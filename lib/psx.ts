// PSX Intelligence Server Data Layer
// Handles all data fetching from Supabase materialized view psx.mv_ticker_dashboard_stocks

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
}

// Create a reusable fetcher with proper headers
async function createSupabaseFetcher() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_PSX_INT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing Supabase environment variables:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!serviceKey,
      availableEnvVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
    })
    throw new Error("Missing Supabase environment variables")
  }

  return {
    fetch: async (endpoint: string) => {
      console .log("endpoint", endpoint);
      const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
        headers: {
          apikey: serviceKey,
          authorization: `Bearer ${serviceKey}`,
          "content-type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Supabase fetch failed: ${response.status} ${response.statusText}`, {
          endpoint,
          url: `${supabaseUrl}/rest/v1/${endpoint}`,
          error: errorText
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
}: FetchTickersParams = {}): Promise<TickerData[]> {
  try {
    const fetcher = await createSupabaseFetcher()

    // Build the query parameters
    const params = new URLSearchParams({
      select:
        "symbol,name,sector,close,pct_change_1d,volume,turnover,vwap,vwap_gap_pct,intraday_volatility,biggest_order_shares,biggest_order_value,trading_date",
      order: sort,
      limit: limit.toString(),
      offset: offset.toString(),
    })

    // Add search filter if provided
    if (q && q.trim()) {
      params.append("or", `symbol.ilike.${q}%,name.ilike.%${q}%`)
    }

    const endpoint = `mv_ticker_dashboard_stocks?${params.toString()}`
    return await fetcher.fetch(endpoint)
  } catch (error) {
    console.error("Error fetching tickers:", error)
    // Return mock data for development/testing
    return getMockTickers()
  }
}

// Dashboard sections with different sorting criteria
export async function fetchDashboardSections(): Promise<DashboardSections> {
  try {
    const fetcher = await createSupabaseFetcher()

    const baseSelect =
      "symbol,name,sector,close,pct_change_1d,volume,turnover,vwap,vwap_gap_pct,intraday_volatility,biggest_order_shares,biggest_order_value,trading_date"

    // Fetch all sections in parallel
    const [
      topGainers,
      mostActiveVolume,
      highestTurnover,
      largestBlocks,
      vwapPremiums,
      vwapDiscounts,
      volatilityLeaders,
    ] = await Promise.all([
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=pct_change_1d.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=volume.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=turnover.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=biggest_order_shares.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=vwap_gap_pct.desc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=vwap_gap_pct.asc.nullslast&limit=10`),
      fetcher.fetch(`mv_ticker_dashboard_stocks?select=${baseSelect}&order=intraday_volatility.desc.nullslast&limit=10`),
    ])

    return {
      topGainers,
      mostActiveVolume,
      highestTurnover,
      largestBlocks,
      vwapPremiums,
      vwapDiscounts,
      volatilityLeaders,
    }
  } catch (error) {
    console.error("Error fetching dashboard sections:", error)
    // Return mock data for development/testing
    return getMockDashboardSections()
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
  }
}

export type { TickerData, DashboardSections, FetchTickersParams }
