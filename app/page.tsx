import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Search,
  Database,
  ArrowRight,
  Star,
  Users,
  Activity,
  Target,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PSX Intelligence</h1>
              <p className="text-xs text-muted-foreground">Professional Market Analytics</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="gradient-primary text-white border-0">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-accent/5"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Star className="w-4 h-4 mr-2 text-accent" />
              Announcing $20M in Series A Funding
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Pakistan Stock Exchange
              <span className="block gradient-primary bg-clip-text text-transparent">Intelligence Platform</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Quickly deploy our suite of market intelligence APIs designed for institutional trading. Our
              industry-leading analytics power investment decisions for firms representing $3T+ in assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gradient-primary text-white border-0 px-8 py-6 text-lg">
                  Request Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent">
                  Explore Platform
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Listed Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">$50B+</div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">Real-time</div>
                <div className="text-sm text-muted-foreground">Data Feed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Activity className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Institutional-Grade Market Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make informed investment decisions in the Pakistani market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Execution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Streamline fixed income trading with automated execution algorithms. Monitor open orders, and take
                action with our comprehensive trading suite.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create custom risk policies, monitor open orders, and take action with real-time risk assessment and
                portfolio optimization tools.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-3 to-chart-4 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Strategies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build ladders, automate reinvestment and rebalancing, and implement sophisticated trading strategies
                with our API suite.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Technical Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced charting tools with 50+ technical indicators, pattern recognition, and real-time market
                sentiment analysis.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Screening</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powerful screening tools to identify opportunities based on fundamental and technical criteria across
                all PSX sectors.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-chart-4 to-chart-5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Alerts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instant notifications for price movements, volume spikes, and custom conditions via email, SMS, and push
                notifications.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              Trusted by Professionals
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "PSX Intelligence has transformed how we analyze the Pakistani market. The real-time data and
                professional-grade tools are exceptional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center text-white font-semibold">
                  AK
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Ahmed Khan</div>
                  <div className="text-sm text-muted-foreground">Portfolio Manager, ABC Capital</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "The technical analysis tools and market screening capabilities are unmatched. It's like having
                Bloomberg for the PSX."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-3 to-chart-4 rounded-full flex items-center justify-center text-white font-semibold">
                  SF
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Sarah Fatima</div>
                  <div className="text-sm text-muted-foreground">Research Analyst, XYZ Securities</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "The platform's reliability and comprehensive data coverage make it indispensable for our trading
                operations."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-5 to-chart-1 rounded-full flex items-center justify-center text-white font-semibold">
                  MR
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Muhammad Rashid</div>
                  <div className="text-sm text-muted-foreground">Head of Trading, DEF Asset Management</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-accent to-chart-1 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to Transform Your Trading?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
            Join thousands of professional traders and institutions who rely on PSX Intelligence for market analysis and
            investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg bg-white text-primary hover:bg-white/90"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-foreground">PSX Intelligence</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional market intelligence platform for the Pakistan Stock Exchange.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-foreground transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/screening" className="hover:text-foreground transition-colors">
                    Screening
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="hover:text-foreground transition-colors">
                    Alerts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="hover:text-foreground transition-colors">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2025 PSX Intelligence. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
