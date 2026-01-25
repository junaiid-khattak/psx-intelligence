import { useQuery } from "@tanstack/react-query"

interface SnapshotPayload {
  topVolume2d?: Array<{ symbol: string; pct: number; volume: number }>
  topVolume3d?: Array<{ symbol: string; pct: number; volume: number }>
  topRvol?: Array<{ symbol: string; rvol: number; volume: number }>
  topBigOrders?: Array<{ symbol: string; biggest_order_value: number }>
}

export interface MarketSummaryResult {
  summary: string
  updatedAt: string
  citations: Array<{ symbol: string; title: string; published_at: string; snippet: string }>
}

async function fetchSummary(payload: { signals?: string[]; days?: number; snapshot?: SnapshotPayload }) {
  const res = await fetch("/api/ai/dashboard-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to load AI market summary")
  }
  return (await res.json()) as MarketSummaryResult
}

export function useAiMarketSummary(payload: { signals?: string[]; days?: number; snapshot?: SnapshotPayload }) {
  return useQuery({
    queryKey: ["ai-market-summary", payload],
    queryFn: () => fetchSummary(payload),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
    retry: 2,
  })
}
