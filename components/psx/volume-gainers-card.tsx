"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricRow } from "./metric-row"
import { Volume2 } from "lucide-react"
import type { TickerData } from "@/lib/psx"

interface VolumeGainersCardProps {
  data: TickerData[]
}

export function VolumeGainersCard({ data }: VolumeGainersCardProps) {
  const [period, setPeriod] = useState<"1d" | "2d" | "3d">("1d")

  // Sort data based on selected period
  const sortedData = [...data].sort((a, b) => {
    if (period === "1d") {
      // Calculate 1D volume change client-side
      const aChange = a.volume_prev_1d ? (a.volume / a.volume_prev_1d - 1) * 100 : 0
      const bChange = b.volume_prev_1d ? (b.volume / b.volume_prev_1d - 1) * 100 : 0
      return bChange - aChange
    } else if (period === "2d") {
      return (b.pct_volume_change_2d || 0) - (a.pct_volume_change_2d || 0)
    } else {
      return (b.pct_volume_change_3d || 0) - (a.pct_volume_change_3d || 0)
    }
  })

  // Calculate volume change % for display
  const getVolumeChange = (ticker: TickerData) => {
    if (period === "1d") {
      return ticker.volume_prev_1d ? (ticker.volume / ticker.volume_prev_1d - 1) * 100 : 0
    } else if (period === "2d") {
      return ticker.pct_volume_change_2d || 0
    } else {
      return ticker.pct_volume_change_3d || 0
    }
  }

  // Get previous volume for tooltip
  const getPrevVolume = (ticker: TickerData) => {
    if (period === "1d") return ticker.volume_prev_1d
    if (period === "2d") return ticker.volume_prev_2d
    return ticker.volume_prev_3d
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-base">Volume Gainers</CardTitle>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "1d" | "2d" | "3d")}>
            <TabsList className="h-7">
              <TabsTrigger value="1d" className="text-xs px-2 py-0.5">
                1D
              </TabsTrigger>
              <TabsTrigger value="2d" className="text-xs px-2 py-0.5">
                2D
              </TabsTrigger>
              <TabsTrigger value="3d" className="text-xs px-2 py-0.5">
                3D
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>Highest volume % change</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {sortedData.slice(0, 5).map((ticker) => {
          const volumeChange = getVolumeChange(ticker)
          const prevVolume = getPrevVolume(ticker)
          const tooltip = prevVolume ? `Prev ${period.toUpperCase()} Vol: ${prevVolume.toLocaleString()}` : ticker.name

          return (
            <MetricRow
              key={ticker.symbol}
              symbol={ticker.symbol}
              close={ticker.close}
              primary={{
                value: volumeChange,
                kind: "pct",
                label: `${period.toUpperCase()} Vol %`,
              }}
              secondary={{
                value: ticker.volume,
                kind: "vol",
                label: "Volume",
              }}
              hint={tooltip}
            />
          )
        })}
        <div className="pt-2">
          <Link href="/tickers?sort=volume.desc">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              See all volume →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
