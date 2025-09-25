"use client"

import { trpc } from "../lib/trpc"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Percent, Building } from "lucide-react"
import { cn } from "../lib/utils"
import { getCacheConfig } from "../lib/cache-config"

interface StockDetailCardProps {
  ticker: string
  onExplainSignal: () => void
  isLoadingSignal: boolean
}

export function StockDetailCard({ ticker, onExplainSignal, isLoadingSignal }: StockDetailCardProps) {
  const { data: stockDetail, isLoading } = trpc.getStockDetail.useQuery(
    { ticker },
    {
      ...getCacheConfig("stockDetails"),
      // Keep data fresh for active stock details
      refetchIntervalInBackground: false,
    },
  )

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
        <div className="h-32 bg-muted rounded" />
      </div>
    )
  }

  if (!stockDetail) return null

  const isPositive = stockDetail.change > 0
  const priceHistory = stockDetail.last5Days

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{stockDetail.name}</h3>
          <p className="text-sm text-muted-foreground">{stockDetail.ticker}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">₨{stockDetail.price.toFixed(2)}</div>
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600",
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {stockDetail.change.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Market Cap</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{stockDetail.marketCap}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">P/E Ratio</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{stockDetail.pe}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Dividend</span>
          </div>
          <div className="text-lg font-semibold text-foreground">{stockDetail.dividend}%</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Volume</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {stockDetail.volume >= 1000000
              ? `${(stockDetail.volume / 1000000).toFixed(1)}M`
              : `${(stockDetail.volume / 1000).toFixed(0)}K`}
          </div>
        </Card>
      </div>

      {/* Price Chart Placeholder */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-foreground">5-Day Price History</h4>
          <span className="text-xs text-muted-foreground">Last 5 trading days</span>
        </div>
        <div className="h-24 flex items-end justify-between gap-2">
          {priceHistory.map((price, index) => {
            const height =
              ((price - Math.min(...priceHistory)) / (Math.max(...priceHistory) - Math.min(...priceHistory))) * 80 + 20
            const isLast = index === priceHistory.length - 1
            return (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={cn("w-full rounded-t", isLast ? "bg-primary" : "bg-muted-foreground/30")}
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs text-muted-foreground">D{index + 1}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₨{Math.min(...priceHistory).toFixed(1)}</span>
          <span>₨{Math.max(...priceHistory).toFixed(1)}</span>
        </div>
      </Card>

      {/* AI Signal Button */}
      <div className="flex justify-center">
        <Button onClick={onExplainSignal} disabled={isLoadingSignal} className="px-6">
          {isLoadingSignal ? "Analyzing..." : "Explain Signal (AI)"}
        </Button>
      </div>
    </div>
  )
}
