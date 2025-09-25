// Cache configuration for different types of financial data
export const cacheConfig = {
  // Real-time market data - short cache times
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },

  // Stock details - medium cache times
  stockDetails: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },

  // Watchlist data - medium cache times with background updates
  watchlist: {
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },

  // Dashboard sections - longer cache for aggregated data
  dashboard: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: false, // Server-side data, no need to refetch on reconnect
  },

  // AI signals - longer cache since they're expensive to generate
  aiSignals: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },

  // Static/reference data - very long cache times
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
}

// Helper function to get cache config by data type
export function getCacheConfig(type: keyof typeof cacheConfig) {
  return cacheConfig[type]
}

// Cache invalidation patterns for different data types
export const invalidationPatterns = {
  // When market data changes, invalidate these queries
  marketData: ["getWatchlist", "getKSE100Data", "getStockDetail"],

  // When dashboard data changes, invalidate these queries
  dashboardData: ["getWatchlist", "getKSE100Data"],

  // When specific ticker data changes
  tickerData: (ticker: string) => [
    ["getStockDetail", { ticker }],
    "getWatchlist", // In case the ticker is in watchlist
  ],

  // Full cache clear
  all: ["*"],
}
