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
  private maxReconnectAttempts = 5 // Reduced max attempts to prevent spam
  private reconnectDelay = 2000 // Increased initial delay
  private maxReconnectDelay = 30000
  private isConnected = false
  private reconnectTimer: NodeJS.Timeout | null = null
  private healthCheckTimer: NodeJS.Timeout | null = null

  constructor() {
    // Initialize in browser only
    if (typeof window !== "undefined") {
      this.connect()
      this.startHealthCheck()
    }
  }

  setTrpcUtils(utils: any) {
    this.trpcUtils = utils
    console.log("[v0] tRPC utils set for cache manager")
  }

  private connect() {
    try {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }

      // Close existing connection if any
      if (this.eventSource) {
        this.eventSource.close()
        this.eventSource = null
      }

      console.log("[v0] Attempting SSE connection...")
      this.eventSource = new EventSource("/api/cache/events")

      this.eventSource.onopen = () => {
        console.log("[v0] Cache invalidation SSE connected successfully")
        this.reconnectAttempts = 0
        this.isConnected = true
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data: CacheInvalidationEvent = JSON.parse(event.data)
          console.log("[v0] SSE message received:", data.type)
          this.handleCacheInvalidation(data)
        } catch (error) {
          console.error("[v0] Failed to parse SSE message:", error)
        }
      }

      this.eventSource.onerror = (error) => {
        console.log("[v0] Cache invalidation SSE error occurred")
        this.isConnected = false

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.eventSource?.close()
          this.reconnect()
        } else {
          console.log("[v0] Max reconnection attempts reached, will retry in health check")
          this.eventSource?.close()
          this.eventSource = null
        }
      }
    } catch (error) {
      console.error("[v0] Failed to create SSE connection:", error)
      this.isConnected = false
      this.reconnect()
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[v0] Max reconnection attempts reached for cache invalidation SSE")
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay)

    console.log(`[v0] Reconnecting to SSE (attempt ${this.reconnectAttempts}) in ${delay}ms...`)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  private startHealthCheck() {
    this.healthCheckTimer = setInterval(() => {
      if (!this.isConnected) {
        console.log("[v0] Health check: Resetting SSE connection attempts")
        this.reconnectAttempts = 0
        this.connect()
      }
    }, 60 * 1000) // Check every minute
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
        // Keep connection alive - no action needed
        break
    }
  }

  private invalidateQueries(sections: string[], tickers: string[]) {
    if (!this.trpcUtils) return

    try {
      console.log("[v0] Invalidating cache sections:", sections, "tickers:", tickers)

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

      if (sections.includes("all") || sections.includes("dashboard")) {
        // Invalidate all dashboard-related queries
        this.trpcUtils.getDashboardSections?.invalidate()
        console.log("[v0] Invalidated dashboard sections cache")
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
    console.log("[v0] Disconnecting cache invalidation manager")

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.isConnected = false
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = null
    }

    console.log("[v0] Disconnected from cache invalidation SSE")
  }
}

// Global instance
export const cacheManager = new CacheInvalidationManager()
