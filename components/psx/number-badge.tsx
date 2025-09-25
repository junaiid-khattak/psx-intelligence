import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/psx"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface NumberBadgeProps {
  value: number
  kind?: "pct" | "vol" | "value"
  className?: string
  showIcon?: boolean
}

export function NumberBadge({ value, kind = "value", className, showIcon = true }: NumberBadgeProps) {
  if (value === null || value === undefined || isNaN(value)) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono tabular-nums",
          "bg-muted text-muted-foreground",
          className,
        )}
      >
        N/A
      </span>
    )
  }

  const formattedValue = formatNumber(value, kind)

  // Determine color and icon based on value and kind
  let colorClass = "bg-muted text-muted-foreground"
  let Icon = Minus

  if (kind === "pct") {
    if (value > 0) {
      colorClass = "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      Icon = TrendingUp
    } else if (value < 0) {
      colorClass = "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      Icon = TrendingDown
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono tabular-nums",
        colorClass,
        className,
      )}
    >
      {showIcon && kind === "pct" && <Icon className="h-3 w-3" />}
      {formattedValue}
    </span>
  )
}
