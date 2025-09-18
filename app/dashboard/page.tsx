"use client"

import { DashboardLayout } from "../../components/dashboard-layout"
import { WatchlistTable } from "../../components/watchlist-table"
import { trpc } from "../../lib/trpc"

export default function DashboardPage() {
  
  const { data: kse100Data, isLoading: kse100Loading, error: kse100Error } = trpc.getKSE100Data.useQuery()
  
  // Show error state if there's an error
  if (kse100Error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Data</div>
            <div className="text-muted-foreground">{kse100Error.message}</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  console.log('kse100Data', kse100Data);

  // Calculate current price and change
  const currentPrice = kse100Data?.json?.data?.[0]?.price
  const previousPrice = kse100Data?.json?.data?.[1]?.price
  const change = currentPrice && previousPrice ? currentPrice - previousPrice : 0
  const changePercent = previousPrice ? (change / previousPrice) * 100 : 0
  const formattedPrice = currentPrice ? currentPrice.toLocaleString() : "Loading..."
  const formattedChange = changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`
  
  console.log('currentPrice', currentPrice);
  console.log('previousPrice', previousPrice);
  console.log('change', change);
  console.log('changePercent', changePercent);



  console.log('formattedChange', formattedChange);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Market Overview</h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {kse100Data?.lastUpdated ? kse100Data.lastUpdated.toLocaleTimeString() : new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">KSE-100 Index</div>
            <div className="text-2xl font-bold text-foreground">{formattedPrice}</div>
            <div className={`text-sm ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {kse100Loading ? "Loading..." : formattedChange}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Weekly Change</div>
            <div className="text-2xl font-bold text-foreground">125.6M</div>
            <div className="text-sm text-muted-foreground">shares</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Monthly Change</div>
            <div className="text-2xl font-bold text-foreground">8.2T</div>
            <div className="text-sm text-muted-foreground">PKR</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Yearly Change</div>
            <div className="text-2xl font-bold text-foreground">342</div>
            <div className="text-sm text-green-600">+12 today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">KSE-100 Index</div>
            <div className="text-2xl font-bold text-foreground">{formattedPrice}</div>
            <div className={`text-sm ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {kse100Loading ? "Loading..." : formattedChange}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Volume</div>
            <div className="text-2xl font-bold text-foreground">125.6M</div>
            <div className="text-sm text-muted-foreground">shares</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="text-2xl font-bold text-foreground">8.2T</div>
            <div className="text-sm text-muted-foreground">PKR</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Active Stocks</div>
            <div className="text-2xl font-bold text-foreground">342</div>
            <div className="text-sm text-green-600">+12 today</div>
          </div>
        </div>

        {/* Watchlist Section */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Your Watchlist</h2>
            <p className="text-sm text-muted-foreground mt-1">Track your favorite PSX stocks</p>
          </div>
          <WatchlistTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
