"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, AlertCircle } from "lucide-react"

const mockTechnicalData = {
  UBL: {
    price: 185.5,
    change: 2.45,
    indicators: {
      rsi: 68.5,
      macd: 1.25,
      sma20: 182.3,
      sma50: 178.9,
      bollinger_upper: 190.25,
      bollinger_lower: 175.8,
      volume_sma: 1250000,
    },
    signals: [
      { type: "bullish", indicator: "RSI", message: "RSI approaching overbought but still in bullish territory" },
      { type: "bullish", indicator: "MACD", message: "MACD showing positive momentum with bullish crossover" },
      { type: "neutral", indicator: "Bollinger", message: "Price trading within normal Bollinger Band range" },
    ],
    support: [180.5, 175.25, 170.0],
    resistance: [190.0, 195.75, 200.5],
  },
}

const availableStocks = ["UBL", "HBL", "ENGRO", "OGDC", "PSO", "LUCK", "NESTLE"]

export function TechnicalAnalysis() {
  const [selectedStock, setSelectedStock] = useState("UBL")
  const [timeframe, setTimeframe] = useState("1D")

  const data = mockTechnicalData[selectedStock as keyof typeof mockTechnicalData] || mockTechnicalData.UBL

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return "text-red-600"
    if (rsi >= 30) return "text-green-600"
    return "text-yellow-600"
  }

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return "Overbought"
    if (rsi >= 30) return "Normal"
    return "Oversold"
  }

  const getSignalIcon = (type: string) => {
    switch (type) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />
    }
  }

  const getSignalColor = (type: string) => {
    switch (type) {
      case "bullish":
        return "border-green-200 bg-green-50"
      case "bearish":
        return "border-red-200 bg-red-50"
      default:
        return "border-yellow-200 bg-yellow-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stock Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Technical Analysis Dashboard</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1D</SelectItem>
                  <SelectItem value="1W">1W</SelectItem>
                  <SelectItem value="1M">1M</SelectItem>
                  <SelectItem value="3M">3M</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableStocks.map((stock) => (
                    <SelectItem key={stock} value={stock}>
                      {stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">PKR {data.price.toFixed(2)}</h3>
              <p className={`text-sm font-medium ${data.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {data.change >= 0 ? "+" : ""}
                {data.change.toFixed(2)}% Today
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {timeframe} Chart
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="indicators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="levels">Support & Resistance</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* RSI */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">RSI (14)</CardTitle>
                <CardDescription>Relative Strength Index</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-foreground">{data.indicators.rsi.toFixed(1)}</span>
                  <Badge
                    variant={
                      data.indicators.rsi >= 70 ? "destructive" : data.indicators.rsi >= 30 ? "default" : "secondary"
                    }
                  >
                    {getRSILabel(data.indicators.rsi)}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${data.indicators.rsi >= 70 ? "bg-red-500" : data.indicators.rsi >= 30 ? "bg-green-500" : "bg-yellow-500"}`}
                    style={{ width: `${data.indicators.rsi}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>30</span>
                  <span>70</span>
                  <span>100</span>
                </div>
              </CardContent>
            </Card>

            {/* MACD */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">MACD</CardTitle>
                <CardDescription>Moving Average Convergence Divergence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-foreground">{data.indicators.macd.toFixed(2)}</span>
                  <Badge variant={data.indicators.macd > 0 ? "default" : "secondary"}>
                    {data.indicators.macd > 0 ? "Bullish" : "Bearish"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.indicators.macd > 0 ? "Positive momentum signal" : "Negative momentum signal"}
                </p>
              </CardContent>
            </Card>

            {/* Moving Averages */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Moving Averages</CardTitle>
                <CardDescription>SMA 20 & 50 day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">SMA 20</span>
                  <span className="font-medium text-foreground">PKR {data.indicators.sma20.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">SMA 50</span>
                  <span className="font-medium text-foreground">PKR {data.indicators.sma50.toFixed(2)}</span>
                </div>
                <Badge
                  variant={data.indicators.sma20 > data.indicators.sma50 ? "default" : "secondary"}
                  className="w-full justify-center"
                >
                  {data.indicators.sma20 > data.indicators.sma50 ? "Golden Cross" : "Death Cross"}
                </Badge>
              </CardContent>
            </Card>

            {/* Bollinger Bands */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Bollinger Bands</CardTitle>
                <CardDescription>Price volatility bands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Upper</span>
                  <span className="font-medium text-foreground">PKR {data.indicators.bollinger_upper.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current</span>
                  <span className="font-medium text-primary">PKR {data.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lower</span>
                  <span className="font-medium text-foreground">PKR {data.indicators.bollinger_lower.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Volume */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Volume Analysis</CardTitle>
                <CardDescription>Trading volume vs average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-foreground">
                    {data.indicators.volume_sma.toLocaleString()}
                  </span>
                  <Badge variant="outline">20-day avg</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Current volume relative to 20-day average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Signals</CardTitle>
              <CardDescription>AI-generated signals based on technical indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.signals.map((signal, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSignalColor(signal.type)}`}>
                    <div className="flex items-start gap-3">
                      {getSignalIcon(signal.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{signal.indicator}</h4>
                          <Badge variant="outline" className="text-xs">
                            {signal.type.charAt(0).toUpperCase() + signal.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{signal.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base">Support Levels</CardTitle>
                </div>
                <CardDescription>Key price support zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.support.map((level, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <span className="text-sm text-muted-foreground">Support {index + 1}</span>
                      <span className="font-medium text-foreground">PKR {level.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-base">Resistance Levels</CardTitle>
                </div>
                <CardDescription>Key price resistance zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.resistance.map((level, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <span className="text-sm text-muted-foreground">Resistance {index + 1}</span>
                      <span className="font-medium text-foreground">PKR {level.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
