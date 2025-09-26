"use client"

import { useState, useEffect } from "react"

interface CacheEvent {
  type: string
  timestamp: string
  sections?: string[]
  tickers?: string[]
}

export default function CacheTestPage() {
  const [events, setEvents] = useState<CacheEvent[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [isLoading, setIsLoading] = useState(false)

  // Connect to SSE endpoint
  useEffect(() => {
    setConnectionStatus("connecting")

    const eventSource = new EventSource("/api/cache/events")

    eventSource.onopen = () => {
      console.log("[v0] SSE connection opened")
      setConnectionStatus("connected")
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("[v0] SSE message received:", data)

        setEvents((prev) => {
          const newEvents = [data, ...prev].slice(0, 20) // Keep last 20 events
          return newEvents
        })
      } catch (error) {
        console.error("[v0] Error parsing SSE message:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("[v0] SSE error:", error)
      setConnectionStatus("disconnected")
    }

    return () => {
      eventSource.close()
      setConnectionStatus("disconnected")
    }
  }, [])

  // Test cache invalidation
  const triggerCacheInvalidation = async (sections: string[], tickers: string[] = []) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cache/invalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sections,
          tickers,
          apiKey: "test-key-123", // This would normally be from environment
        }),
      })

      const result = await response.json()
      console.log("[v0] Cache invalidation result:", result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to invalidate cache")
      }
    } catch (error) {
      console.error("[v0] Cache invalidation error:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: typeof connectionStatus) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-red-500"
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "CONNECTED":
        return "bg-blue-500 text-white"
      case "HEARTBEAT":
        return "bg-gray-500 text-white"
      case "CACHE_INVALIDATE":
        return "bg-orange-500 text-white"
      default:
        return "bg-purple-500 text-white"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Cache Invalidation Test</h1>
          <p className="text-gray-600">Test the real-time cache invalidation system</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus)}`} />
          <span className="text-sm font-medium capitalize">{connectionStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Trigger Cache Invalidation</h2>
          <p className="text-gray-600 mb-4">Test different cache invalidation scenarios</p>

          <div className="space-y-3">
            <button
              onClick={() => triggerCacheInvalidation(["all"])}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Invalidate All Sections
            </button>

            <button
              onClick={() => triggerCacheInvalidation(["dashboard", "tickers"])}
              disabled={isLoading}
              className="w-full border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:bg-gray-100 px-4 py-2 rounded"
            >
              Invalidate Dashboard & Tickers
            </button>

            <button
              onClick={() => triggerCacheInvalidation(["portfolio"], ["AAPL", "GOOGL"])}
              disabled={isLoading}
              className="w-full border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:bg-gray-100 px-4 py-2 rounded"
            >
              Invalidate Portfolio (AAPL, GOOGL)
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Real-time Events ({events.length})</h2>
          <p className="text-gray-600 mb-4">Live stream of cache invalidation events</p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">No events yet...</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                  <span className={`px-2 py-1 text-xs rounded ${getEventTypeColor(event.type)}`}>{event.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</div>
                    {event.sections && <div className="text-sm">Sections: {event.sections.join(", ")}</div>}
                    {event.tickers && event.tickers.length > 0 && (
                      <div className="text-sm">Tickers: {event.tickers.join(", ")}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>1. Server-Sent Events (SSE):</strong> Real-time connection to /api/cache/events
          </p>
          <p>
            <strong>2. Cache Invalidation API:</strong> POST to /api/cache/invalidate with sections and tickers
          </p>
          <p>
            <strong>3. Event Broadcasting:</strong> Invalidation events are immediately sent to all connected clients
          </p>
          <p>
            <strong>4. Client Updates:</strong> Components can listen for these events and refresh their data
          </p>
        </div>
      </div>
    </div>
  )
}
