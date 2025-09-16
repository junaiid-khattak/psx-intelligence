import { DashboardLayout } from "../../components/dashboard-layout"
import { WatchlistTable } from "../../components/watchlist-table"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Market Overview</h1>
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">KSE-100 Index</div>
            <div className="text-2xl font-bold text-foreground">42,156.78</div>
            <div className="text-sm text-green-600">+1.24%</div>
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
