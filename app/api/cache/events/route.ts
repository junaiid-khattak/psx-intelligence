import type { NextRequest } from "next/server"

// Server-Sent Events endpoint for real-time cache invalidation
export async function GET(request: NextRequest) {
  console.log("[v0] SSE connection requested")

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      console.log("[v0] SSE stream started")

      try {
        // Send initial connection message
        const data = `data: ${JSON.stringify({ type: "CONNECTED", timestamp: new Date().toISOString() })}\n\n`
        controller.enqueue(encoder.encode(data))
        console.log("[v0] SSE initial connection message sent")

        // Set up interval to check for cache invalidation events
        const interval = setInterval(() => {
          try {
            // Check if controller is still open
            if (controller.desiredSize === null) {
              console.log("[v0] SSE controller closed, clearing interval")
              clearInterval(interval)
              return
            }

            const events = global.cacheInvalidationEvents || []
            const recentEvents = events.filter((event) => {
              const eventTime = new Date(event.timestamp).getTime()
              const now = Date.now()
              return now - eventTime < 30000 // Events from last 30 seconds
            })

            if (recentEvents.length > 0) {
              console.log(`[v0] SSE sending ${recentEvents.length} cache invalidation events`)
              recentEvents.forEach((event) => {
                const data = `data: ${JSON.stringify(event)}\n\n`
                controller.enqueue(encoder.encode(data))
              })

              // Clear processed events
              global.cacheInvalidationEvents = global.cacheInvalidationEvents.filter((event) => {
                const eventTime = new Date(event.timestamp).getTime()
                const now = Date.now()
                return now - eventTime >= 30000
              })
            }

            // Send heartbeat every 30 seconds
            const heartbeat = `data: ${JSON.stringify({ type: "HEARTBEAT", timestamp: new Date().toISOString() })}\n\n`
            controller.enqueue(encoder.encode(heartbeat))
          } catch (error) {
            console.error("[v0] SSE interval error:", error)
            // Clear interval on error to prevent spam
            clearInterval(interval)
            try {
              controller.error(error)
            } catch (e) {
              console.log("[v0] Controller already closed")
            }
          }
        }, 30000)

        // Clean up on close
        const cleanup = () => {
          console.log("[v0] SSE cleanup initiated")
          clearInterval(interval)
        }

        // Handle client disconnect
        request.signal.addEventListener("abort", () => {
          console.log("[v0] SSE client disconnected")
          cleanup()
        })
      } catch (error) {
        console.error("[v0] SSE initialization error:", error)
        try {
          controller.error(error)
        } catch (e) {
          console.error("[v0] Failed to send SSE error:", e)
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  })
}
