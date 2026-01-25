"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { RefreshCw, ChevronDown } from "lucide-react"
import { useAiMarketSummary } from "@/hooks/useAiMarketSummary"
import { useToast } from "@/hooks/use-toast"

interface AiMarketSummaryProps {
  signals?: string[]
  snapshot?: any
}

export function AiMarketSummary({ signals, snapshot }: AiMarketSummaryProps) {
  const { toast } = useToast()
  const query = useAiMarketSummary({ signals, snapshot })

  const updatedText = useMemo(() => {
    if (!query.data?.updatedAt) return ""
    const date = new Date(query.data.updatedAt)
    const diffMs = Date.now() - date.getTime()
    const mins = Math.max(1, Math.round(diffMs / 60000))
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.round(mins / 60)
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`
  }, [query.data?.updatedAt])

  const handleRefresh = async () => {
    try {
      await query.refetch()
    } catch (err) {
      toast({
        title: "Refresh failed",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">AI Market Summary</CardTitle>
          <CardDescription>{updatedText ? `Updated ${updatedText}` : "Latest market intel"}</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={handleRefresh}
          disabled={query.isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${query.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {query.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : query.error ? (
          <div className="text-sm text-destructive">
            {(query.error as Error).message || "Failed to load summary"}
            <div className="mt-2">
              <Button size="sm" variant="outline" className="bg-transparent" onClick={handleRefresh}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {query.data?.summary || "No summary available."}
            </p>

            {query.data?.citations && query.data.citations.length > 0 && (
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary">
                  <ChevronDown className="h-4 w-4" /> Sources
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                    {query.data.citations.map((c, idx) => (
                      <div key={`${c.symbol}-${idx}`} className="border rounded-md p-2 bg-muted/40">
                        <div className="font-medium text-foreground">
                          {c.symbol ? `${c.symbol} — ` : ""}
                          {c.title}
                        </div>
                        <div className="text-[11px] uppercase tracking-wide">{c.published_at?.slice(0, 10)}</div>
                        <div className="mt-1">{c.snippet}</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
