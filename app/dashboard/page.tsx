export const dynamic = "force-dynamic"
export const revalidate = 0

import { Suspense } from "react"
import Link from "next/link"
import { DashboardLayout } from "../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricRow } from "@/components/psx/metric-row"
import { CardSkeleton } from "@/components/psx/loading-skeleton"
import { fetchDashboardSections } from "@/lib/psx"
import { TrendingUp, Volume2, DollarSign, Package, ArrowUpDown, TrendingDown, Zap } from "lucide-react"
import { CacheStatusIndicator } from "@/components/cache-status-indicator"
import { TopGainersCard } from "@/components/psx/top-gainers-card"

async function DashboardContent() {
  const sections = await fetchDashboardSections()

  // Get the latest trading date from the first section
  const tradingDate = sections.topGainers[0]?.trading_date
    ? new Date(sections.topGainers[0].trading_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Today"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time PSX market intelligence</p>
        </div>
        <div className="text-sm text-muted-foreground">Trading Date: {tradingDate}</div>
      </div>

      <CacheStatusIndicator showRefreshButton={true} compact={false} />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TopGainersCard data={sections.topGainers} />

        {/* Most Active Volume */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">Most Active</CardTitle>
            </div>
            <CardDescription>Highest trading volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.mostActiveVolume.slice(0, 5).map((ticker) => (
              <MetricRow
                key={ticker.symbol}
                symbol={ticker.symbol}
                close={ticker.close}
                primary={{
                  value: ticker.volume,
                  kind: "vol",
                  label: "Volume",
                }}
                secondary={{
                  value: ticker.pct_change_1d,
                  kind: "pct",
                  label: "1D %",
                }}
                hint={ticker.name}
              />
            ))}
            <div className="pt-2">
              <Link href="/tickers?sort=volume.desc">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all active →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Highest Turnover */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-base">Highest Turnover</CardTitle>
            </div>
            <CardDescription>Largest trading value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.highestTurnover.slice(0, 5).map((ticker) => (
              <MetricRow
                key={ticker.symbol}
                symbol={ticker.symbol}
                close={ticker.close}
                primary={{
                  value: ticker.turnover,
                  kind: "value",
                  label: "Turnover",
                }}
                secondary={{
                  value: ticker.pct_change_1d,
                  kind: "pct",
                  label: "1D %",
                }}
                hint={ticker.name}
              />
            ))}
            <div className="pt-2">
              <Link href="/tickers?sort=turnover.desc">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all turnover →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Largest Block Trades */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-base">Largest Blocks</CardTitle>
            </div>
            <CardDescription>Biggest single orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.largestBlocks.slice(0, 5).map((ticker) => (
              <MetricRow
                key={ticker.symbol}
                symbol={ticker.symbol}
                close={ticker.close}
                primary={{
                  value: ticker.biggest_order_shares,
                  kind: "vol",
                  label: "Shares",
                }}
                secondary={{
                  value: ticker.biggest_order_value,
                  kind: "value",
                  label: "Value",
                }}
                hint={ticker.name}
              />
            ))}
            <div className="pt-2">
              <Link href="/tickers?sort=biggest_order_shares.desc">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all blocks →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* VWAP Premiums */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">VWAP Premiums</CardTitle>
            </div>
            <CardDescription>Trading above VWAP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.vwapPremiums.slice(0, 5).map((ticker) => (
              <MetricRow
                key={ticker.symbol}
                symbol={ticker.symbol}
                close={ticker.close}
                primary={{
                  value: ticker.vwap_gap_pct,
                  kind: "pct",
                  label: "VWAP Gap",
                }}
                secondary={{
                  value: ticker.pct_change_1d,
                  kind: "pct",
                  label: "1D %",
                }}
                hint={ticker.name}
              />
            ))}
            <div className="pt-2">
              <Link href="/tickers?sort=vwap_gap_pct.desc">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all premiums →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* VWAP Discounts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <CardTitle className="text-base">VWAP Discounts</CardTitle>
            </div>
            <CardDescription>Trading below VWAP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.vwapDiscounts.slice(0, 5).map((ticker) => (
              <MetricRow
                key={ticker.symbol}
                symbol={ticker.symbol}
                close={ticker.close}
                primary={{
                  value: ticker.vwap_gap_pct,
                  kind: "pct",
                  label: "VWAP Gap",
                }}
                secondary={{
                  value: ticker.pct_change_1d,
                  kind: "pct",
                  label: "1D %",
                }}
                hint={ticker.name}
              />
            ))}
            <div className="pt-2">
              <Link href="/tickers?sort=vwap_gap_pct.asc">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all discounts →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Volatility Leaders */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <CardTitle className="text-base">Volatility Leaders</CardTitle>
            </div>
            <CardDescription>Highest intraday swings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {sections.volatilityLeaders.slice(0, 5).map((ticker) => (
              <MetricRow
                key={ticker.symbol}
                symbol={ticker.symbol}
                close={ticker.close}
                primary={{
                  value: ticker.intraday_volatility,
                  kind: "pct",
                  label: "Volatility",
                }}
                secondary={{
                  value: ticker.pct_change_1d,
                  kind: "pct",
                  label: "1D %",
                }}
                hint={ticker.name}
              />
            ))}
            <div className="pt-2">
              <Link href="/tickers?sort=intraday_volatility.desc">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all volatile →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Navigate to key sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/tickers">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                Browse All Tickers
              </Button>
            </Link>
            <Link href="/dashboard/watchlist">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Volume2 className="h-4 w-4 mr-2" />
                My Watchlist
              </Button>
            </Link>
            <Link href="/dashboard/signals">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Zap className="h-4 w-4 mr-2" />
                Trading Signals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                <div className="h-4 w-48 bg-muted rounded animate-pulse mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardSkeleton />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  )
}
