import { useQuery } from "@tanstack/react-query"

export interface TickerExplanationResult {
  explanation: string
  updatedAt: string
  citations: Array<{ symbol: string; title: string; published_at: string; snippet: string }>
}

interface MetricsPayload {
  [key: string]: any
}

async function fetchExplainer(symbol: string, metrics?: MetricsPayload, days?: number) {
  const res = await fetch("/api/ai/ticker-explainer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, days, metrics }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to load ticker explanation")
  }
  return (await res.json()) as TickerExplanationResult
}

export function useTickerExplainer(symbol: string | null, metrics?: MetricsPayload, days?: number) {
  return useQuery({
    queryKey: ["ticker-explainer", symbol, metrics, days],
    queryFn: () => {
      if (!symbol) throw new Error("Missing symbol")
      return fetchExplainer(symbol, metrics, days)
    },
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  })
}
