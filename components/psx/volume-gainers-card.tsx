"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, Loader2, TrendingUp } from "lucide-react"
import type { TickerData } from "@/lib/psx"
import { fetchVolumeGainers1D } from "@/lib/psx"
import { cn } from "@/lib/utils"

interface VolumeGainersCardProps {
  data: TickerData[]
}

export function VolumeGainersCard({ data }: VolumeGainersCardProps) {
  const [period, setPeriod] = useState<"1d" | "2d" | "3d" | "rvol">("1d")
  const [data1D, setData1D] = useState<TickerData[]>([])
  const [loading1D, setLoading1D] = useState(false)

  useEffect(() => {
    if (period === "1d" && data1D.length === 0) {
      setLoading1D(true)
      fetchVolumeGainers1D()
        .then((result) => {
          setData1D(result)
        })
        .catch((error) => {
          console.error("[v0] Failed to fetch 1D volume gainers:", error)
        })
        .finally(() => {
          setLoading1D(false)
        })
    }
  }, [period, data1D.length])

  const displayData = period === "1d" ? data1D : data

  const sortedData =
    period === "1d"
      ? displayData
      : period === "rvol"
        ? [...data].filter((t) => t.rvol_3d != null).sort((a, b) => (b.rvol_3d || 0) - (a.rvol_3d || 0))
        : [...displayData].sort((a, b) => {
            if (period === "2d") {
              return (b.pct_volume_change_2d || 0) - (a.pct_volume_change_2d || 0)
            } else {
              return (b.pct_volume_change_3d || 0) - (a.pct_volume_change_3d || 0)
            }
          })

  const getVolumeChange = (ticker: TickerData) => {
    if (period === "1d") return ticker.pct_volume_change_1d || 0
    if (period === "2d") return ticker.pct_volume_change_2d || 0
    return ticker.pct_volume_change_3d || 0
  }

  const getPrevVolume = (ticker: TickerData) => {
    if (period === "1d") return ticker.volume_prev_1d
    if (period === "2d") return ticker.volume_prev_2d
    return ticker.volume_prev_3d
  }

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`
    return vol.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-base">Volume % Gainers</CardTitle>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "1d" | "2d" | "3d" | "rvol")}>
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
              <TabsTrigger value="rvol" className="text-xs px-2 py-0.5">
                RVOL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>
          {period === "rvol"
            ? "RVOL compares today's volume to the average of the prior 3 sessions."
            : "Highest volume % change"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading1D && period === "1d" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No data available</div>
        ) : (
          <div className="space-y-0.5">
            {sortedData.slice(0, 5).map((ticker, index) => {
              const volumeChange = getVolumeChange(ticker)
              const prevVolume = getPrevVolume(ticker)
              const tooltip = prevVolume
                ? `Prev vol: ${formatVolume(prevVolume)}`
                : period === "rvol"
                  ? `3-day avg: ${formatVolume((ticker.volume || 0) / (ticker.rvol_3d || 1))}`
                  : ticker.name

              return (
                <Link key={ticker.symbol} href={`/ticker/${ticker.symbol}`}>
                  <div
                    className="grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center px-3 py-2.5 rounded-md hover:bg-accent transition-colors group"
                    title={tooltip}
                  >
                    {/* Rank */}
                    <span className="text-xs font-medium text-muted-foreground w-4 text-right">{index + 1}</span>

                    {/* Symbol */}
                    <span className="font-mono font-semibold text-sm truncate">{ticker.symbol}</span>

                    {/* % Change or RVOL - Primary metric */}
                    {period === "rvol" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-base font-bold text-blue-600 tabular-nums">
                          {(ticker.rvol_3d || 0).toFixed(2)}×
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span
                          className={cn(
                            "text-base font-bold tabular-nums",
                            volumeChange >= 0 ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {volumeChange >= 0 ? "+" : ""}
                          {volumeChange.toFixed(1)}%
                        </span>
                      </div>
                    )}

                    {/* Volume - Secondary metric */}
                    <span className="text-xs text-muted-foreground tabular-nums text-right min-w-[60px]">
                      {formatVolume(ticker.volume || 0)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="pt-3 mt-2 border-t">
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
