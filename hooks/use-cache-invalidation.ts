"use client"

import { useEffect, useState } from "react"
import { trpc } from "../lib/trpc"

export function useCacheInvalidation() {
  const [lastInvalidation, setLastInvalidation] = useState<Date | null>(null)
  const utils = trpc.useUtils()

  useEffect(() => {
    // Listen for cache invalidation events
    const eventSource = new EventSource("/api/cache/events")

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "CACHE_INVALIDATE") {
          console.log("[v0] Received cache invalidation event:", data)

          // Invalidate relevant queries based on the event
          const { sections = [], tickers = [] } = data

          if (sections.includes("all") || sections.includes("watchlist")) {
            utils.getWatchlist.invalidate()
          }

          if (sections.includes("all") || sections.includes("kse100")) {
            utils.getKSE100Data.invalidate()
          }

          // Invalidate specific ticker details
          tickers.forEach((ticker: string) => {
            utils.getStockDetail.invalidate({ ticker })
          })

          // If it's a full invalidation, refresh everything
          if (sections.includes("all")) {
            utils.invalidate()
          }

          setLastInvalidation(new Date())
        }
      } catch (error) {
        console.error("[v0] Failed to process cache invalidation event:", error)
      }
    }

    eventSource.onerror = () => {
      console.log("[v0] Cache invalidation SSE connection error")
    }

    return () => {
      eventSource.close()
    }
  }, [utils])

  const manualInvalidate = {
    all: () => {
      utils.invalidate()
      setLastInvalidation(new Date())
    },
    watchlist: () => {
      utils.getWatchlist.invalidate()
      setLastInvalidation(new Date())
    },
    kse100: () => {
      utils.getKSE100Data.invalidate()
      setLastInvalidation(new Date())
    },
    stockDetail: (ticker: string) => {
      utils.getStockDetail.invalidate({ ticker })
      setLastInvalidation(new Date())
    },
  }

  return {
    lastInvalidation,
    manualInvalidate,
  }
}
