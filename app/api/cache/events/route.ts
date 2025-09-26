import type { NextRequest } from "next/server"

import { cacheInvalidationEvents } from "../invalidate/route"

// Simplified Server-Sent Events endpoint for cache invalidation
export async function GET(request: NextRequest) {
  console.log("[v0] SSE endpoint called")

  // Create a simple text encoder
  const encoder = new TextEncoder()

  // Create the SSE stream
  const stream = new ReadableStream({
    start(controller) {
      console.log("[v0] SSE stream starting")

      try {
        // Send initial connection message
        const sendMessage = (data: any) => {
          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        }

        // Send connection confirmation
        sendMessage({
          type: "CONNECTED",
          timestamp: new Date().toISOString(),
        })
        console.log("[v0] SSE connection message sent")

        const checkEventsAndSendHeartbeat = () => {
          try {
            // Check for cache invalidation events
            const now = Date.now()
            const recentEvents = cacheInvalidationEvents.filter((event: any) => {
              const eventTime = new Date(event.timestamp).getTime()
              return now - eventTime < 60000 // Events from last 60 seconds
            })

            // Send any recent events
            if (recentEvents.length > 0) {
              console.log(`[v0] SSE sending ${recentEvents.length} cache invalidation events`)
              recentEvents.forEach((event: any) => {
                sendMessage(event)
              })
            }

            // Send heartbeat
            sendMessage({
              type: "HEARTBEAT",
              timestamp: new Date().toISOString(),
            })
            console.log("[v0] SSE heartbeat sent")
          } catch (error) {
            console.error("[v0] SSE interval error:", error)
          }
        }

        // Send initial heartbeat
        checkEventsAndSendHeartbeat()

        // Set up interval for events and heartbeats
        const interval = setInterval(checkEventsAndSendHeartbeat, 15000) // Every 15 seconds

        const cleanup = () => {
          console.log("[v0] SSE cleanup initiated")
          clearInterval(interval)
          try {
            controller.close()
          } catch (error) {
            console.log("[v0] SSE controller cleanup completed")
          }
        }

        // Handle client disconnect
        if (request.signal) {
          request.signal.addEventListener("abort", cleanup)
        }
        // Store cleanup for potential manual use
        ;(controller as any).cleanup = cleanup
      } catch (error) {
        console.error("[v0] SSE initialization error:", error)
        try {
          controller.close()
        } catch (closeError) {
          console.error("[v0] SSE controller close error:", closeError)
        }
      }
    },
  })

  // Return the SSE response
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
