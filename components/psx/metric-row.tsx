"use client"

import { NumberBadge } from "./number-badge"
import { Button } from "../ui/button"
import { Info } from "lucide-react"

interface MetricRowProps {
  symbol: string
  close: number
  primary: {
    value: number
    kind?: "pct" | "vol" | "value"
    label: string
  }
  secondary?: {
    value: number
    kind?: "pct" | "vol" | "value"
    label: string
  }
  hint?: string
  onClick?: () => void
  onExplain?: () => void
  showExplain?: boolean
}

export function MetricRow({ symbol, close, primary, secondary, hint, onClick, onExplain, showExplain }: MetricRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
        onClick ? "hover:bg-muted/50 cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-sm">{symbol}</span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">{close.toFixed(2)}</span>
        </div>
        {hint && <p className="text-xs text-muted-foreground truncate mt-0.5">{hint}</p>}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <NumberBadge value={primary.value} kind={primary.kind} showIcon={primary.kind === "pct"} />
          <div className="text-xs text-muted-foreground mt-0.5">{primary.label}</div>
        </div>

        {secondary && (
          <div className="text-right">
            <NumberBadge value={secondary.value} kind={secondary.kind} showIcon={false} />
            <div className="text-xs text-muted-foreground mt-0.5">{secondary.label}</div>
          </div>
        )}

        {showExplain && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-transparent"
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
    </div>
  )
}
