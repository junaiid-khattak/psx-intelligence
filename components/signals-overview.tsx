"use client"

import { useState } from "react"
import { trpc } from "../lib/trpc"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Zap, TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react"
import { cn } from "../lib/utils"

const mockSignalStocks = ["UBL", "HBL", "ENGRO", "OGDC", "PSO"]

export function SignalsOverview() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [signals, setSignals] = useState<Record<string, { signal: string; confidence: number }>>({})

  const explainSignalMutation = trpc.explainSignal.useMutation({
    onSuccess: (data, variables) => {
      setSignals((prev) => ({
        ...prev,
        [variables.ticker]: data,
      }))
    },
  })

  const handleGenerateSignal = (ticker: string) => {
    setSelectedStock(ticker)
    explainSignalMutation.mutate({ ticker })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return "High"
    if (confidence >= 60) return "Medium"
    return "Low"
  }

  return (
    <div className="space-y-6">
      {/* Signal Generation Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Generate AI Signals</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select a stock to generate AI-powered trading signals and market insights
        </p>
        <div className="flex flex-wrap gap-2">
          {mockSignalStocks.map((ticker) => (
            <Button
              key={ticker}
              variant={selectedStock === ticker ? "default" : "outline"}
              size="sm"
              onClick={() => handleGenerateSignal(ticker)}
              disabled={explainSignalMutation.isPending && selectedStock === ticker}
            >
              {explainSignalMutation.isPending && selectedStock === ticker ? "Analyzing..." : ticker}
            </Button>
          ))}
        </div>
      </Card>

      {/* Active Signals */}
      {Object.keys(signals).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Active Signals</h3>
          <div className="grid gap-4">
            {Object.entries(signals).map(([ticker, signal]) => (
              <Card key={ticker} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{ticker}</h4>
                      <p className="text-sm text-muted-foreground">AI Trading Signal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={signal.confidence >= 80 ? "default" : signal.confidence >= 60 ? "secondary" : "outline"}
                    >
                      {getConfidenceBadge(signal.confidence)}
                    </Badge>
                    <p className={cn("text-sm font-medium mt-1", getConfidenceColor(signal.confidence))}>
                      {signal.confidence}% Confidence
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{signal.signal}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Signal Types Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Signal Types</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Bullish Signals</h4>
              <p className="text-sm text-muted-foreground">Momentum, breakouts, institutional activity</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Bearish Signals</h4>
              <p className="text-sm text-muted-foreground">Oversold conditions, resistance levels</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Risk Alerts</h4>
              <p className="text-sm text-muted-foreground">Volatility warnings, earnings events</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
