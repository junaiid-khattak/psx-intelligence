export interface CacheInvalidationEvent {
  type: "CACHE_INVALIDATE" | "CONNECTED" | "HEARTBEAT"
  timestamp: string
  sections?: string[]
  tickers?: string[]
}

export class CacheInvalidationManager {
  private eventSource: EventSource | null = null
  private trpcUtils: any = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 1000
  private maxReconnectDelay = 30000 // Cap at 30 seconds
  private isConnected = false
  private reconnectTimer: NodeJS.Timeout | null = null

  constructor() {
    // Initialize in browser only
    if (typeof window !== "undefined") {
      this.connect()
      this.startHealthCheck()
    }
  }

  setTrpcUtils(utils: any) {
    this.trpcUtils = utils
  }

  private connect() {
    try {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }

      this.eventSource = new EventSource("/api/cache/events")

      this.eventSource.onopen = () => {
        console.log("[v0] Cache invalidation SSE connected")
        this.reconnectAttempts = 0
        this.isConnected = true
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data: CacheInvalidationEvent = JSON.parse(event.data)
          this.handleCacheInvalidation(data)
        } catch (error) {
          console.error("[v0] Failed to parse SSE message:", error)
        }
      }

      this.eventSource.onerror = () => {
        console.log("[v0] Cache invalidation SSE error, attempting reconnect...")
        this.isConnected = false
        this.eventSource?.close()
        this.reconnect()
      }
    } catch (error) {
      console.error("[v0] Failed to connect to cache invalidation SSE:", error)
      this.isConnected = false
      this.reconnect()
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay)

      this.reconnectTimer = setTimeout(() => {
        console.log(`[v0] Reconnecting to SSE (attempt ${this.reconnectAttempts})...`)
        this.connect()
      }, delay)
    } else {
      console.error("[v0] Max reconnection attempts reached for cache invalidation SSE")
      this.schedulePeriodicRetry()
    }
  }

  private schedulePeriodicRetry() {
    // Wait 5 minutes before trying again
    this.reconnectTimer = setTimeout(
      () => {
        console.log("[v0] Attempting periodic SSE reconnection...")
        this.reconnectAttempts = 0 // Reset attempts for periodic retry
        this.connect()
      },
      5 * 60 * 1000,
    ) // 5 minutes
  }

  private startHealthCheck() {
    setInterval(
      () => {
        // If we've been disconnected for more than 2 minutes, reset attempts
        if (!this.isConnected && this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log("[v0] Health check: Resetting SSE connection attempts")
          this.reconnectAttempts = 0
          this.connect()
        }
      },
      2 * 60 * 1000,
    ) // Check every 2 minutes
  }

  private handleCacheInvalidation(event: CacheInvalidationEvent) {
    if (!this.trpcUtils) {
      console.warn("[v0] tRPC utils not available for cache invalidation")
      return
    }

    console.log("[v0] Processing cache invalidation:", event)

    switch (event.type) {
      case "CACHE_INVALIDATE":
        this.invalidateQueries(event.sections || [], event.tickers || [])
        break
      case "CONNECTED":
        console.log("[v0] Connected to cache invalidation stream")
        break
      case "HEARTBEAT":
        // Keep connection alive
        break
    }
  }

  private invalidateQueries(sections: string[], tickers: string[]) {
    if (!this.trpcUtils) return

    try {
      // Invalidate dashboard sections
      if (sections.includes("all") || sections.includes("watchlist")) {
        this.trpcUtils.getWatchlist.invalidate()
        console.log("[v0] Invalidated watchlist cache")
      }

      if (sections.includes("all") || sections.includes("kse100")) {
        this.trpcUtils.getKSE100Data.invalidate()
        console.log("[v0] Invalidated KSE100 cache")
      }

      // Invalidate specific ticker details
      if (tickers.length > 0) {
        tickers.forEach((ticker) => {
          this.trpcUtils.getStockDetail.invalidate({ ticker })
          console.log(`[v0] Invalidated ${ticker} stock detail cache`)
        })
      }

      // If no specific sections/tickers, invalidate everything
      if (sections.includes("all") && tickers.length === 0) {
        this.trpcUtils.invalidate()
        console.log("[v0] Invalidated all tRPC caches")
      }

      // Trigger a page refresh for server-side cached data
      if (sections.includes("all") || sections.includes("dashboard")) {
        // Force refresh of server-side dashboard data
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Error during cache invalidation:", error)
    }
  }

  // Manual cache invalidation methods
  invalidateAll() {
    if (this.trpcUtils) {
      this.trpcUtils.invalidate()
      console.log("[v0] Manually invalidated all caches")
    }
    // Also refresh the page to get fresh server-side data
    window.location.reload()
  }

  invalidateWatchlist() {
    if (this.trpcUtils) {
      this.trpcUtils.getWatchlist.invalidate()
      console.log("[v0] Manually invalidated watchlist cache")
    }
  }

  invalidateKSE100() {
    if (this.trpcUtils) {
      this.trpcUtils.getKSE100Data.invalidate()
      console.log("[v0] Manually invalidated KSE100 cache")
    }
  }

  invalidateStockDetail(ticker: string) {
    if (this.trpcUtils) {
      this.trpcUtils.getStockDetail.invalidate({ ticker })
      console.log(`[v0] Manually invalidated ${ticker} stock detail cache`)
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.isConnected = false
      console.log("[v0] Disconnected from cache invalidation SSE")
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

// Global instance
export const cacheManager = new CacheInvalidationManager()
