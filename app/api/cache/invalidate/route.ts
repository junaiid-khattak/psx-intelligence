import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  console.log("[v0] Cache invalidate POST request received")

  try {
    const body = await request.json()
    const { sections, tickers, apiKey } = body

    console.log("[v0] Request body:", { sections, tickers, hasApiKey: !!apiKey })

    // Basic API key validation
    const expectedApiKey = process.env.CACHE_INVALIDATION_API_KEY
    if (!expectedApiKey) {
      console.log("[v0] No CACHE_INVALIDATION_API_KEY environment variable set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (apiKey !== expectedApiKey) {
      console.log("[v0] Invalid API key provided")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      // Revalidate dashboard pages to refresh server-side data
      revalidatePath("/dashboard")
      revalidatePath("/tickers")

      // If specific sections are provided, we could be more granular
      if (sections && sections.length > 0) {
        console.log("[v0] Revalidating specific sections:", sections)
        // For now, revalidate all dashboard-related paths
        revalidatePath("/dashboard", "layout")
      }

      console.log("[v0] Next.js cache revalidation completed")
    } catch (revalidateError) {
      console.error("[v0] Next.js revalidation error:", revalidateError)
      // Continue with SSE invalidation even if revalidation fails
    }

    // Broadcast cache invalidation event to all connected clients
    const invalidationData = {
      type: "CACHE_INVALIDATE",
      timestamp: new Date().toISOString(),
      sections: sections || ["all"], // Which dashboard sections to invalidate
      tickers: tickers || [], // Specific tickers to invalidate
    }

    // Store the invalidation event in a simple in-memory store
    // In production, you might want to use Redis or a database
    global.cacheInvalidationEvents = global.cacheInvalidationEvents || []
    global.cacheInvalidationEvents.push(invalidationData)

    // Keep only the last 10 events to prevent memory leaks
    if (global.cacheInvalidationEvents.length > 10) {
      global.cacheInvalidationEvents = global.cacheInvalidationEvents.slice(-10)
    }

    console.log("[v0] Cache invalidation triggered:", invalidationData)

    return NextResponse.json({
      success: true,
      message: "Cache invalidation triggered",
      data: invalidationData,
    })
  } catch (error) {
    console.error("[v0] Cache invalidation error:", error)
    return NextResponse.json(
      {
        error: "Failed to process cache invalidation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to check recent invalidation events
export async function GET() {
  console.log("[v0] Cache invalidate GET request received")
  const events = global.cacheInvalidationEvents || []
  return NextResponse.json({ events, count: events.length })
}
