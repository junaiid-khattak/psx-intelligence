// PSX Intelligence Server Data Layer
// Handles all data fetching from Supabase materialized view public.mv_ticker_dashboard

interface TickerData {
  symbol: string
  name: string
  sector: string
  trading_date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  turnover: number
  vwap: number
  trade_count: number
  avg_trade_size: number
  median_trade_size: number
  intraday_volatility: number
  prev_close: number
  pct_change_1d: number
  vwap_gap_pct: number
  biggest_order_shares: number
  biggest_order_value: number
  volume_prev_1d: number
  volume_prev_2d: number
  volume_prev_3d: number
  pct_volume_change_1d?: number
  pct_volume_change_2d: number
  pct_volume_change_3d: number
  rvol_3d?: number
}

interface FetchTickersParams {
  q?: string
  limit?: number
  offset?: number
  sort?: string
}

interface DashboardSections {
  topGainers: TickerData[]
  mostActiveVolume: TickerData[]
  highestTurnover: TickerData[]
  largestBlocks: TickerData[]
  vwapPremiums: TickerData[]
  vwapDiscounts: TickerData[]
  volatilityLeaders: TickerData[]
  volumeGainers: TickerData[]
  volumeGainers1D: TickerData[]
}

// Create a reusable fetcher with proper headers
async function createSupabaseFetcher() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    console.error("Missing Supabase environment variables:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasAnonKey: !!anonKey,
      availableEnvVars: Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
    })
    throw new Error("Missing Supabase environment variables")
  }

  return {
    fetch: async (endpoint: string) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
        headers: {
          apikey: anonKey,
          authorization: `Bearer ${anonKey}`,
          "content-type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Supabase fetch failed: ${response.status} ${response.statusText}`, {
          endpoint,
          url: `${supabaseUrl}/rest/v1/${endpoint}`,
          error: errorText,
        })
        throw new Error(`Supabase fetch failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    },
  }
}

// Main ticker search and listing function
export async function fetchTickers({
  q,
  limit = 50,
  offset = 0,
  sort = "symbol.asc",
}: FetchTickersParams = {}): Promise<{ data: TickerData[]; totalCount: number }> {
  try {
    const fetcher = await createSupabaseFetcher()

    // Parse sort parameter
    const [sortColumn, sortDirection] = sort.split(".")

    // Build PostgREST query parameters
    const params = new URLSearchParams()

    // Add search filter if provided
    if (q && q.trim()) {
      // Search across symbol and name using PostgREST's or filter
      params.append("or", `symbol.ilike.*${q}*,name.ilike.*${q}*`)
    }

    // Add sorting
    params.append("order", `${sortColumn || "symbol"}.${sortDirection || "asc"}.nullslast`)

    // Add pagination
    params.append("limit", limit.toString())
    params.append("offset", offset.toString())

    // Select all columns we need
    const selectColumns = [
      "symbol",
      "name",
      "sector",
      "trading_date",
      "open",
      "high",
      "low",
      "close",
      "prev_close",
      "pct_change_1d",
      "volume",
      "volume_prev_1d",
      "volume_prev_2d",
      "volume_prev_3d",
      "pct_volume_change_1d",
      "pct_volume_change_2d",
      "pct_volume_change_3d",
      "turnover",
      "vwap",
      "vwap_gap_pct",
      "trade_count",
      "avg_trade_size",
      "median_trade_size",
      "intraday_volatility",
      "biggest_order_shares",
      "biggest_order_value",
      "rvol_3d",
    ].join(",")

    params.append("select", selectColumns)

    const endpoint = `mv_ticker_dashboard?${params.toString()}`

    let totalCount = 0
    try {
      const countParams = new URLSearchParams()
      if (q && q.trim()) {
        countParams.append("or", `symbol.ilike.*${q}*,name.ilike.*${q}*`)
      }
      countParams.append("select", "count")

      const countResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/mv_ticker_dashboard?${countParams.toString()}`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            "content-type": "application/json",
            Prefer: "count=exact",
          },
        },
      )

      if (countResponse.ok) {
        const contentRange = countResponse.headers.get("content-range")
        if (contentRange) {
          totalCount = Number.parseInt(contentRange.split("/")[1] || "0")
        }
      }
    } catch (countError) {
      console.warn("[v0] Failed to get total count, using data length:", countError)
    }

    // Get the actual data
    const data = await fetcher.fetch(endpoint)

    if (totalCount === 0 && data.length > 0) {
      totalCount = data.length + offset // Estimate based on current page
    }

    console.log("[v0] Fetched tickers via PostgREST:", {
      count: data.length,
      totalCount,
      searchQuery: q,
      sort: `${sortColumn}.${sortDirection}`,
      endpoint,
    })

    return { data, totalCount }
  } catch (error) {
    console.error("[v0] Error fetching tickers via PostgREST:", error)
    throw new Error(`Failed to fetch tickers: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Dashboard sections with different sorting criteria
export async function fetchDashboardSections(): Promise<DashboardSections> {
  try {
    const fetcher = await createSupabaseFetcher()

    const baseSelect =
      "symbol,name,sector,close,pct_change_1d,volume,volume_prev_1d,volume_prev_2d,volume_prev_3d,pct_volume_change_1d,pct_volume_change_2d,pct_volume_change_3d,turnover,vwap,vwap_gap_pct,intraday_volatility,biggest_order_shares,biggest_order_value,trading_date,rvol_3d"

    // Fetch all sections in parallel
    const [
      topGainers,
      mostActiveVolume,
      highestTurnover,
      largestBlocks,
      vwapPremiums,
      vwapDiscounts,
      volatilityLeaders,
      volumeGainers,
      volumeGainers1D,
    ] = await Promise.all([
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=pct_change_1d.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=volume.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=turnover.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=biggest_order_shares.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=vwap_gap_pct.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=vwap_gap_pct.asc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=intraday_volatility.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard?select=${baseSelect}&order=pct_volume_change_2d.desc.nullslast&limit=10`),
      fetcher.fetch(
        `v_top_pct_volume_gainers_1d?select=${baseSelect}&order=pct_volume_change_1d.desc.nullslast&limit=10`,
      ),
    ])

    console.log("[v0] Dashboard sections fetched successfully")

    return {
      topGainers,
      mostActiveVolume,
      highestTurnover,
      largestBlocks,
      vwapPremiums,
      vwapDiscounts,
      volatilityLeaders,
      volumeGainers,
      volumeGainers1D,
    }
  } catch (error) {
    console.error("[v0] Error fetching dashboard sections:", error)
    throw new Error(`Failed to fetch dashboard sections: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function fetchVolumeGainers1D(): Promise<TickerData[]> {
  try {
    const fetcher = await createSupabaseFetcher()

    const baseSelect =
      "symbol,name,sector,close,pct_change_1d,volume,volume_prev_1d,pct_volume_change_1d,turnover,vwap,vwap_gap_pct,intraday_volatility,biggest_order_shares,biggest_order_value,trading_date,rvol_3d"

    const data = await fetcher.fetch(
      `v_top_pct_volume_gainers_1d?select=${baseSelect}&order=pct_volume_change_1d.desc.nullslast&limit=10`,
    )

    console.log("[v0] Fetched 1D volume gainers from dedicated view")

    return data
  } catch (error) {
    console.error("[v0] Error fetching 1D volume gainers:", error)
    throw new Error(`Failed to fetch 1D volume gainers: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Number formatting utilities
export function formatNumber(value: number, kind: "pct" | "vol" | "value" = "value"): string {
  if (value === null || value === undefined || isNaN(value)) return "N/A"

  switch (kind) {
    case "pct":
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
    case "vol":
      if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`
      } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`
      }
      return value.toLocaleString()
    case "value":
      if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`
      } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`
      } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`
      }
      return value.toLocaleString()
    default:
      return value.toLocaleString()
  }
}

// Mock data for development/testing when env vars not available
function getMockTickers(): TickerData[] {
  return [
    {
      symbol: "OGDC",
      name: "Oil & Gas Development Company Limited",
      sector: "Oil & Gas Exploration Companies",
      trading_date: "2024-01-15",
      open: 85.5,
      high: 87.2,
      low: 84.8,
      close: 86.75,
      volume: 2_450_000,
      turnover: 212_500_000,
      vwap: 86.2,
      trade_count: 1_250,
      avg_trade_size: 1_960,
      median_trade_size: 1_200,
      intraday_volatility: 2.8,
      prev_close: 85.0,
      pct_change_1d: 2.06,
      vwap_gap_pct: 0.64,
      biggest_order_shares: 50_000,
      biggest_order_value: 4_337_500,
      volume_prev_1d: 2_300_000,
      volume_prev_2d: 2_200_000,
      volume_prev_3d: 2_100_000,
      pct_volume_change_1d: 6.5,
      pct_volume_change_2d: 5.4,
      pct_volume_change_3d: 6.7,
      rvol_3d: 2.3,
    },
    {
      symbol: "LUCK",
      name: "Lucky Cement Limited",
      sector: "Cement",
      trading_date: "2024-01-15",
      open: 520.0,
      high: 535.5,
      low: 518.0,
      close: 532.25,
      volume: 890_000,
      turnover: 468_750_000,
      vwap: 526.5,
      trade_count: 980,
      avg_trade_size: 908,
      median_trade_size: 500,
      intraday_volatility: 3.4,
      prev_close: 525.0,
      pct_change_1d: 1.38,
      vwap_gap_pct: 1.09,
      biggest_order_shares: 25_000,
      biggest_order_value: 13_312_500,
      volume_prev_1d: 800_000,
      volume_prev_2d: 750_000,
      volume_prev_3d: 700_000,
      pct_volume_change_1d: 11.3,
      pct_volume_change_2d: 5.3,
      pct_volume_change_3d: 6.0,
      rvol_3d: 1.8,
    },
  ]
}

function getMockDashboardSections(): DashboardSections {
  const mockData = getMockTickers()
  return {
    topGainers: mockData,
    mostActiveVolume: mockData,
    highestTurnover: mockData,
    largestBlocks: mockData,
    vwapPremiums: mockData,
    vwapDiscounts: mockData,
    volatilityLeaders: mockData,
    volumeGainers: mockData,
    volumeGainers1D: mockData,
  }
}

export type { TickerData, DashboardSections, FetchTickersParams }
