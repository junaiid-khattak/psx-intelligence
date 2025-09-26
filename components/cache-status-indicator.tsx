"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { RefreshCw, Wifi, WifiOff, AlertCircle } from "lucide-react"
import { trpc } from "../lib/trpc"

interface CacheStatusIndicatorProps {
  showRefreshButton?: boolean
  compact?: boolean
}

export function CacheStatusIndicator({ showRefreshButton = true, compact = false }: CacheStatusIndicatorProps) {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const utils = trpc.useUtils()

  useEffect(() => {
    let eventSource: EventSource | null = null

    const connectSSE = () => {
      try {
        setConnectionStatus("connecting")
        eventSource = new EventSource("/api/cache/events")

        eventSource.onopen = () => {
          console.log("[v0] Cache SSE connected")
          setConnectionStatus("connected")
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log("[v0] Cache invalidation event received:", data)

            if (data.type === "CACHE_INVALIDATE") {
              setLastUpdate(new Date())
              // Trigger page refresh for server-side data
              window.location.reload()
            }
          } catch (error) {
            console.error("[v0] Error parsing SSE message:", error)
          }
        }

        eventSource.onerror = () => {
          console.log("[v0] Cache SSE error")
          setConnectionStatus("disconnected")
          eventSource?.close()

          // Retry connection after 5 seconds
          setTimeout(connectSSE, 5000)
        }
      } catch (error) {
        console.error("[v0] Failed to connect to cache SSE:", error)
        setConnectionStatus("disconnected")
        setTimeout(connectSSE, 5000)
      }
    }

    connectSSE()

    return () => {
      eventSource?.close()
    }
  }, [])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Invalidate all tRPC queries
      await utils.invalidate()
      setLastUpdate(new Date())
      console.log("[v0] Manual cache refresh completed")
    } catch (error) {
      console.error("[v0] Manual cache refresh failed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleFullRefresh = () => {
    // Force page reload to get fresh server-side data
    window.location.reload()
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={connectionStatus === "connected" ? "default" : "destructive"} className="text-xs">
          {connectionStatus === "connected" ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
          {connectionStatus === "connected" ? "Live" : "Offline"}
        </Badge>

        {showRefreshButton && (
          <Button variant="ghost" size="sm" onClick={handleManualRefresh} disabled={isRefreshing} className="h-6 px-2">
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2">
        {connectionStatus === "connected" ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : connectionStatus === "disconnected" ? (
          <WifiOff className="h-4 w-4 text-red-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        )}

        <div className="text-sm">
          <div className="font-medium">
            {connectionStatus === "connected" && "Live Data Connected"}
            {connectionStatus === "disconnected" && "Connection Lost"}
            {connectionStatus === "connecting" && "Connecting..."}
          </div>
          {lastUpdate && (
            <div className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>
          )}
        </div>
      </div>

      {showRefreshButton && (
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleFullRefresh} className="bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Full Refresh
          </Button>
        </div>
      )}
    </div>
  )
}
