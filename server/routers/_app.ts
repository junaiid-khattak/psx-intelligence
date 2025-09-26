import { z } from "zod"
import { publicProcedure, router } from "../trpc"

// Types for KSE100 API response
type KSE100DataPoint = [number, number, number] // [timestamp, price, volume]
type KSE100Response = {
  status: number
  message: string
  data: KSE100DataPoint[]
}

// Mock PSX stock data
const mockStocks = [
  { ticker: "UBL", name: "United Bank Limited", price: 145.5, change: 2.3, volume: 1250000 },
  { ticker: "HBL", name: "Habib Bank Limited", price: 89.75, change: -1.2, volume: 980000 },
  { ticker: "ENGRO", name: "Engro Corporation", price: 312.8, change: 4.1, volume: 750000 },
  { ticker: "OGDC", name: "Oil & Gas Development Company", price: 78.9, change: -0.8, volume: 2100000 },
  { ticker: "PSO", name: "Pakistan State Oil", price: 203.45, change: 1.9, volume: 650000 },
]

export const appRouter = router({
  getWatchlist: publicProcedure.query(() => {
    return mockStocks
  }),

  getStockDetail: publicProcedure.input(z.object({ ticker: z.string() })).query(({ input }) => {
    const stock = mockStocks.find((s) => s.ticker === input.ticker)
    if (!stock) throw new Error("Stock not found")

    return {
      ...stock,
      marketCap: "125.6B PKR",
      pe: 12.4,
      dividend: 3.2,
      last5Days: [140.2, 142.1, 144.8, 143.9, 145.5], // Mock price history
    }
  }),

  explainSignal: publicProcedure.input(z.object({ ticker: z.string() })).mutation(async ({ input }) => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const signals = [
      `Volume spike detected in ${input.ticker}, possible institutional activity. Proceed with caution.`,
      `${input.ticker} showing strong momentum with price breaking above resistance. Consider entry.`,
      `Technical indicators suggest ${input.ticker} is oversold. Potential reversal opportunity.`,
      `${input.ticker} earnings announcement approaching. Increased volatility expected.`,
    ]

    return {
      signal: signals[Math.floor(Math.random() * signals.length)],
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
    }
  }),

  getKSE100Data: publicProcedure.query(async () => {
    try {
      const response = await fetch("https://dps.psx.com.pk/timeseries/int/KSE100")

      if (!response.ok) {
        throw new Error(`Failed to fetch KSE100 data: ${response.status} ${response.statusText}`)
      }

      const data: KSE100Response = await response.json()

      if (data.status !== 1) {
        throw new Error(`API returned error: ${data.message}`)
      }

      // Transform the data to a more usable format and limit to last 50 points for performance
      const transformedData = data.data
        .slice(-50) // Only take the last 50 data points
        .map(([timestamp, price, volume]) => ({
          timestamp: new Date(timestamp * 1000), // Convert Unix timestamp to Date
          price,
          volume,
        }))

      return {
        success: true,
        data: transformedData,
        lastUpdated: new Date(),
        totalPoints: transformedData.length,
      }
    } catch (error) {
      console.error("Error fetching KSE100 data:", error)
      throw new Error(`Failed to fetch KSE100 data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }),

  getDashboardSections: publicProcedure.query(async () => {
    // Import the server-side function
    const { fetchDashboardSections } = await import("../lib/psx")

    try {
      const sections = await fetchDashboardSections()
      return {
        success: true,
        data: sections,
        lastUpdated: new Date(),
      }
    } catch (error) {
      console.error("Error fetching dashboard sections:", error)
      throw new Error(`Failed to fetch dashboard sections: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }),

  getCacheStatus: publicProcedure.query(() => {
    return {
      lastInvalidation: global.lastCacheInvalidation || null,
      cacheEvents: global.cacheInvalidationEvents || [],
      serverTime: new Date().toISOString(),
    }
  }),
})

export type AppRouter = typeof appRouter
