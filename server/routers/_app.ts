import { z } from "zod"
import { publicProcedure, router } from "../trpc"

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
})

export type AppRouter = typeof appRouter
