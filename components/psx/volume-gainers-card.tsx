"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricRow } from "./metric-row"
import { Volume2, Loader2 } from "lucide-react"
import type { TickerData } from "@/lib/psx"
import { fetchVolumeGainers1D } from "@/lib/psx"

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
      ? displayData // Already sorted from view
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
    if (period === "1d") {
      return ticker.pct_volume_change_1d || 0
    } else if (period === "2d") {
      return ticker.pct_volume_change_2d || 0
    } else {
      return ticker.pct_volume_change_3d || 0
    }
  }

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
      <CardContent className="space-y-1">
        {loading1D && period === "1d" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No data available</div>
        ) : period === "rvol" ? (
          <>
            {sortedData.slice(0, 5).map((ticker, index) => {
              const tooltip = `Prev 3-day avg: ${((ticker.volume || 0) / (ticker.rvol_3d || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

              return (
                <Link key={ticker.symbol} href={`/ticker/${ticker.symbol}`}>
                  <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground w-4">{index + 1}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">{ticker.symbol}</span>
                        <span className="text-xs text-muted-foreground">
                          Vol: {(ticker.volume || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-blue-600" title={tooltip}>
                        {(ticker.rvol_3d || 0).toFixed(2)}×
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </>
        ) : (
          sortedData.slice(0, 5).map((ticker) => {
            const volumeChange = getVolumeChange(ticker)
            const prevVolume = getPrevVolume(ticker)
            const tooltip = prevVolume ? `Prev vol: ${prevVolume.toLocaleString()}` : ticker.name

            return (
              <Link key={ticker.symbol} href={`/ticker/${ticker.symbol}`}>
                <MetricRow
                  symbol={ticker.symbol}
                  close={ticker.close}
                  primary={{
                    value: volumeChange,
                    kind: "pct",
                    label: "% Change",
                  }}
                  secondary={{
                    value: ticker.volume,
                    kind: "vol",
                    label: "Volume",
                  }}
                  hint={tooltip}
                />
              </Link>
            )
          })
        )}
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
