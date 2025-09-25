"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState, useEffect } from "react"
import type { AppRouter } from "../server/routers/_app"
import { cacheManager } from "../lib/cache-invalidation"

export const trpc = createTRPCReact<AppRouter>()

export function Providers({ children }: { children: React.ReactNode }) {
  const utils = trpc.useUtils() // Moved to top level

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Reduce stale time for financial data that changes frequently
            staleTime: 30 * 1000, // 30 seconds
            // Keep cache for 5 minutes after last use
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Retry failed requests
            retry: 2,
            // Refetch interval for critical data (disabled by default, can be enabled per query)
            refetchInterval: false,
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  )

  useEffect(() => {
    cacheManager.setTrpcUtils(utils)

    // Cleanup on unmount
    return () => {
      cacheManager.disconnect()
    }
  }, [utils])

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
