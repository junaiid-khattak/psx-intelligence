import type { NextRequest } from "next/server"

// Server-Sent Events endpoint for real-time cache invalidation
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      try {
        // Send initial connection message
        const data = `data: ${JSON.stringify({ type: "CONNECTED", timestamp: new Date().toISOString() })}\n\n`
        controller.enqueue(encoder.encode(data))

        // Set up interval to check for cache invalidation events
        const interval = setInterval(() => {
          try {
            const events = global.cacheInvalidationEvents || []
            const recentEvents = events.filter((event) => {
              const eventTime = new Date(event.timestamp).getTime()
              const now = Date.now()
              return now - eventTime < 30000 // Events from last 30 seconds
            })

            if (recentEvents.length > 0) {
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
            // Don't close the stream for interval errors, just log them
          }
        }, 30000)

        // Clean up on close
        const cleanup = () => {
          clearInterval(interval)
          try {
            controller.close()
          } catch (error) {
            // Controller might already be closed
            console.log("[v0] SSE controller cleanup completed")
          }
        }

        request.signal.addEventListener("abort", cleanup)

        // Also handle stream errors
        controller.error = (error: any) => {
          console.error("[v0] SSE stream error:", error)
          cleanup()
        }
      } catch (error) {
        console.error("[v0] SSE initialization error:", error)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
