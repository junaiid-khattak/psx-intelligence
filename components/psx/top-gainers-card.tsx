import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricRow } from "./metric-row"
import { TrendingUp } from "lucide-react"
import type { TickerData } from "@/lib/psx"

interface TopGainersCardProps {
  data: TickerData[]
}

export function TopGainersCard({ data }: TopGainersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <CardTitle className="text-base">Top Gainers</CardTitle>
        </div>
        <CardDescription>Highest price % change</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {data.slice(0, 5).map((ticker) => (
          <MetricRow
            key={ticker.symbol}
            symbol={ticker.symbol}
            close={ticker.close}
            primary={{
              value: ticker.pct_change_1d,
              kind: "pct",
              label: "1D %",
            }}
            secondary={{
              value: ticker.volume,
              kind: "vol",
              label: "Volume",
            }}
            hint={ticker.name}
          />
        ))}
        <div className="pt-2">
          <Link href="/tickers?sort=pct_change_1d.desc">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              See all gainers →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
