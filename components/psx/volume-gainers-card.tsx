"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricRow } from "./metric-row"
import { TrendingUp } from "lucide-react"

interface TickerData {
  symbol: string
  name: string
  close: number
  volume: number
  volume_prev_1d: number
  volume_prev_2d: number
  volume_prev_3d: number
  pct_volume_change_2d: number
  pct_volume_change_3d: number
  pct_change_1d: number
}

interface VolumeGainersCardProps {
  data: TickerData[]
}

export function VolumeGainersCard({ data }: VolumeGainersCardProps) {
  const [activeTab, setActiveTab] = useState<"1d" | "2d" | "3d">("2d")

  // Sort data based on active tab
  const sortedData = [...data].sort((a, b) => {
    if (activeTab === "1d") {
      // Calculate 1D volume change client-side
      const aChange = a.volume_prev_1d ? (a.volume / a.volume_prev_1d - 1) * 100 : 0
      const bChange = b.volume_prev_1d ? (b.volume / b.volume_prev_1d - 1) * 100 : 0
      return bChange - aChange
    } else if (activeTab === "2d") {
      return (b.pct_volume_change_2d || 0) - (a.pct_volume_change_2d || 0)
    } else {
      return (b.pct_volume_change_3d || 0) - (a.pct_volume_change_3d || 0)
    }
  })

  // Calculate volume change percentage based on active tab
  const getVolumeChange = (ticker: TickerData) => {
    if (activeTab === "1d") {
      return ticker.volume_prev_1d ? (ticker.volume / ticker.volume_prev_1d - 1) * 100 : 0
    } else if (activeTab === "2d") {
      return ticker.pct_volume_change_2d || 0
    } else {
      return ticker.pct_volume_change_3d || 0
    }
  }

  // Get previous volume for tooltip
  const getPrevVolume = (ticker: TickerData) => {
    if (activeTab === "1d") return ticker.volume_prev_1d
    if (activeTab === "2d") return ticker.volume_prev_2d
    return ticker.volume_prev_3d
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base">Volume % Gainers</CardTitle>
          </div>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "1d" | "2d" | "3d")}>
            <TabsList className="h-8">
              <TabsTrigger value="1d" className="text-xs px-3">
                1D
              </TabsTrigger>
              <TabsTrigger value="2d" className="text-xs px-3">
                2D
              </TabsTrigger>
              <TabsTrigger value="3d" className="text-xs px-3">
                3D
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>Highest volume % increase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {sortedData.slice(0, 5).map((ticker) => {
          const volumeChange = getVolumeChange(ticker)
          const prevVolume = getPrevVolume(ticker)

          return (
            <Link key={ticker.symbol} href={`/ticker/${ticker.symbol}`}>
              <div className="group cursor-pointer" title={`Previous volume: ${prevVolume?.toLocaleString() || "N/A"}`}>
                <MetricRow
                  symbol={ticker.symbol}
                  close={ticker.close}
                  primary={{
                    value: volumeChange,
                    kind: "pct",
                    label: `Vol ${activeTab.toUpperCase()}`,
                  }}
                  secondary={{
                    value: ticker.pct_change_1d,
                    kind: "pct",
                    label: "Price",
                  }}
                  hint={ticker.name}
                />
              </div>
            </Link>
          )
        })}
        <div className="pt-2">
          <Link href={`/tickers?sort=pct_volume_change_${activeTab === "1d" ? "2d" : activeTab}.desc`}>
            <Button variant="ghost" size="sm" className="w-full text-xs">
              See all volume gainers →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
