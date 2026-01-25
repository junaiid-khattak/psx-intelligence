"use client"

import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { NumberBadge } from "./number-badge"
import { cn } from "@/lib/utils"

type MetricKind = "pct" | "vol" | "value"

interface Metric {
  value: number | null
  kind: MetricKind
  label: string
}

interface TickerRowV2Props {
  ticker: any
  primary: Metric
  secondary?: Metric
  hint?: string
  showExplain?: boolean
  onExplain?: () => void
}

export function TickerRowV2({ ticker, primary, secondary, hint, showExplain, onExplain }: TickerRowV2Props) {
  const symbol = ticker?.symbol ?? ""
  const close = ticker?.close

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg px-3 py-2 transition-colors",
        "hover:bg-muted/50 cursor-pointer",
      )}
      onClick={onExplain}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-base text-foreground">{symbol}</span>
          {typeof close === "number" && (
            <span className="text-xs text-muted-foreground tabular-nums">{close.toFixed(2)}</span>
          )}
          {showExplain && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-transparent ml-auto"
              onClick={(e) => {
                e.stopPropagation()
                onExplain?.()
              }}
              aria-label={`Explain ${symbol}`}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>
        {hint ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className="text-sm text-muted-foreground leading-snug line-clamp-2"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {hint}
                </p>
              </TooltipTrigger>
              <TooltipContent side="top">{hint}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <NumberBadge value={primary.value ?? 0} kind={primary.kind} showIcon={primary.kind === "pct"} />
        <div className="text-[11px] text-muted-foreground">{primary.label}</div>

        {secondary ? (
          <div className="flex flex-col items-end gap-1">
            <NumberBadge value={secondary.value ?? 0} kind={secondary.kind} showIcon={secondary.kind === "pct"} />
            <div className="text-[11px] text-muted-foreground">{secondary.label}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
