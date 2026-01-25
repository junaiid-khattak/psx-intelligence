"use client"

import { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useTickerExplainer } from "@/hooks/useTickerExplainer"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, RefreshCw } from "lucide-react"

interface Metrics {
  close?: number
  pct_change_1d?: number
  volume?: number
  pct_volume_change_1d?: number
  pct_volume_change_2d?: number
  pct_volume_change_3d?: number
  rvol_3d?: number
  biggest_order_value?: number
  vwap_gap_pct?: number
  intraday_volatility?: number
  [key: string]: any
}

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  ticker?: {
    symbol: string
    name?: string
  }
  metrics?: Metrics
}

function Stat({ label, value, suffix }: { label: string; value?: number; suffix?: string }) {
  if (value === undefined || value === null || Number.isNaN(value)) return null
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground tabular-nums">
        {value.toLocaleString(undefined, { maximumFractionDigits: 2 })} {suffix}
      </div>
    </div>
  )
}

export function TickerExplainSheet({ open, onOpenChange, ticker, metrics }: Props) {
  const { toast } = useToast()
  const symbol = ticker?.symbol || null
  const explainer = useTickerExplainer(symbol, metrics)

  const updatedText = useMemo(() => {
    if (!explainer.data?.updatedAt) return ""
    const date = new Date(explainer.data.updatedAt)
    const diffMs = Date.now() - date.getTime()
    const mins = Math.max(1, Math.round(diffMs / 60000))
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.round(mins / 60)
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`
  }, [explainer.data?.updatedAt])

  const handleRefresh = async () => {
    try {
      await explainer.refetch()
    } catch (err) {
      toast({
        title: "Refresh failed",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{ticker ? `${ticker.symbol} — ${ticker.name || ""}` : "Ticker"}</SheetTitle>
          <SheetDescription className="flex items-center justify-between">
            AI explanation • {updatedText || "just now"}
            <Button variant="ghost" size="sm" className="bg-transparent" onClick={handleRefresh} disabled={explainer.isFetching}>
              <RefreshCw className={cn("h-4 w-4", explainer.isFetching ? "animate-spin" : "")} />
            </Button>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Close" value={metrics?.close} />
            <Stat label="1D %" value={metrics?.pct_change_1d} suffix="%" />
            <Stat label="Volume" value={metrics?.volume} />
            <Stat label="Vol % 1D" value={metrics?.pct_volume_change_1d} suffix="%" />
            <Stat label="Vol % 2D" value={metrics?.pct_volume_change_2d} suffix="%" />
            <Stat label="Vol % 3D" value={metrics?.pct_volume_change_3d} suffix="%" />
            <Stat label="RVOL 3D" value={metrics?.rvol_3d} />
            <Stat label="Big Order Value" value={metrics?.biggest_order_value} />
            <Stat label="VWAP Gap %" value={metrics?.vwap_gap_pct} suffix="%" />
            <Stat label="Intraday Vol %" value={metrics?.intraday_volatility} suffix="%" />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-semibold">AI Explanation</div>
            {explainer.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : explainer.error ? (
              <div className="text-sm text-destructive space-y-2">
                {(explainer.error as Error).message || "Failed to load explanation"}
                <Button size="sm" variant="outline" className="bg-transparent" onClick={handleRefresh}>
                  Retry
                </Button>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {explainer.data?.explanation || "No explanation available."}
              </p>
            )}
          </div>

          {explainer.data?.citations && explainer.data.citations.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary">
                <ChevronDown className="h-4 w-4" /> Sources
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                  {explainer.data.citations.map((c, idx) => (
                    <div key={`${c.symbol}-${idx}`} className="border rounded-md p-2 bg-muted/40">
                      <div className="font-medium text-foreground">{c.symbol ? `${c.symbol} — ` : ""}{c.title}</div>
                      <div className="text-[11px] uppercase tracking-wide">{c.published_at?.slice(0, 10)}</div>
                      <div className="mt-1">{c.snippet}</div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
