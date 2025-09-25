import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { TrendingUp, BarChart3, Zap, Shield, Search, Database } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PSX Intelligence</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/tickers" className="text-muted-foreground hover:text-foreground">
              Browse Tickers
            </Link>
            <Link href="/auth/signin" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">Professional PSX Market Intelligence</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Real-time market data, advanced analytics, and institutional-quality insights for the Pakistan Stock
            Exchange. Track gainers, volume leaders, VWAP gaps, and volatility patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Open Dashboard
              </Button>
            </Link>
            <Link href="/tickers">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                Browse Tickers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Professional Trading Intelligence</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to make informed investment decisions in the Pakistani market
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Market Dashboard</h4>
            <p className="text-muted-foreground text-sm">
              Real-time market overview with top gainers, most active stocks, and volatility leaders
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Advanced Search</h4>
            <p className="text-muted-foreground text-sm">
              Search and filter all PSX tickers with sortable columns and real-time data
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">VWAP Analysis</h4>
            <p className="text-muted-foreground text-sm">
              Track stocks trading at premium or discount to Volume Weighted Average Price
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Volatility Tracking</h4>
            <p className="text-muted-foreground text-sm">
              Monitor intraday volatility patterns and identify high-movement opportunities
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Block Trade Analysis</h4>
            <p className="text-muted-foreground text-sm">
              Track largest block trades and institutional activity across all sectors
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Professional Grade</h4>
            <p className="text-muted-foreground text-sm">
              Institutional-quality data and analytics trusted by professional traders
            </p>
          </Card>
        </div>
      </section>

      {/* Market Metrics Preview */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Live Market Insights</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Get instant access to key market metrics and trading opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">Top Gainers</div>
              <p className="text-muted-foreground text-sm">Stocks with highest 1-day gains</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">Most Active</div>
              <p className="text-muted-foreground text-sm">Highest volume trading</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">VWAP Leaders</div>
              <p className="text-muted-foreground text-sm">Premium/discount analysis</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">Block Trades</div>
              <p className="text-muted-foreground text-sm">Institutional activity</p>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                View Full Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Start Trading Smarter?</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join professional traders who rely on PSX Intelligence for market analysis and trading decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/tickers">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Explore Market Data
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">PSX Intelligence</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/tickers" className="hover:text-foreground">
                Tickers
              </Link>
              <Link href="/auth/signin" className="hover:text-foreground">
                Sign In
              </Link>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm mt-4">
            <p>&copy; 2025 PSX Intelligence. Professional market analysis for the Pakistan Stock Exchange.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
