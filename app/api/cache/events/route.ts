import type { NextRequest } from "next/server"

// Server-Sent Events endpoint for real-time cache invalidation
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "CONNECTED", timestamp: new Date().toISOString() })}\n\n`
      controller.enqueue(encoder.encode(data))

      // Set up interval to check for cache invalidation events
      const interval = setInterval(() => {
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
      }, 30000)

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
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
