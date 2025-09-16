import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { TrendingUp, BarChart3, Zap, Shield } from "lucide-react"

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
          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">Bloomberg-lite for PSX</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Professional-grade market intelligence for the Pakistan Stock Exchange. Real-time data, AI-powered insights,
            and institutional-quality analytics.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Professional Trading Tools</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to make informed investment decisions in the Pakistani market
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Real-time Data</h4>
            <p className="text-muted-foreground text-sm">
              Live market data with millisecond precision for all PSX-listed securities
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">AI Insights</h4>
            <p className="text-muted-foreground text-sm">
              Machine learning algorithms analyze patterns and generate trading signals
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Advanced Charts</h4>
            <p className="text-muted-foreground text-sm">
              Professional charting tools with technical indicators and drawing tools
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Risk Management</h4>
            <p className="text-muted-foreground text-sm">
              Portfolio analytics and risk assessment tools for better decision making
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Start Trading Smarter?</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust PSX Intelligence for their market analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Open Dashboard
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 PSX Intelligence. Professional market analysis for the Pakistan Stock Exchange.</p>
        </div>
      </footer>
    </div>
  )
}
