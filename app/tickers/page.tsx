"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/psx/search-input"
import { NumberBadge } from "@/components/psx/number-badge"
import { TableSkeleton } from "@/components/psx/loading-skeleton"
import { fetchTickers, type TickerData } from "@/lib/psx"
import { ChevronLeft, ChevronRight, ArrowUpDown, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ITEMS_PER_PAGE = 50

interface SortConfig {
  field: string
  direction: "asc" | "desc"
}

export default function TickersPage() {
  const searchParams = useSearchParams()
  const [tickers, setTickers] = useState<TickerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "symbol",
    direction: "asc",
  })

  // Initialize sort from URL params
  useEffect(() => {
    const sortParam = searchParams.get("sort")
    if (sortParam) {
      const [field, direction] = sortParam.split(".")
      setSortConfig({ field, direction: direction as "asc" | "desc" })
    }
  }, [searchParams])

  const loadTickers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE
      const sort = `${sortConfig.field}.${sortConfig.direction}`

      const data = await fetchTickers({
        q: searchQuery,
        limit: ITEMS_PER_PAGE,
        offset,
        sort,
      })

      setTickers(data)
      // For demo purposes, estimate total count
      setTotalCount(searchQuery ? data.length : 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickers")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, currentPage, sortConfig])

  useEffect(() => {
    loadTickers()
  }, [loadTickers])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
    setCurrentPage(1) // Reset to first page on sort
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalCount)

  const columns = [
    { key: "symbol", label: "Symbol", sortable: true, tooltip: "Stock ticker symbol" },
    { key: "name", label: "Name", sortable: true, tooltip: "Company name" },
    { key: "sector", label: "Sector", sortable: true, tooltip: "Industry sector" },
    { key: "close", label: "Close", sortable: true, tooltip: "Last trading price" },
    { key: "pct_change_1d", label: "%Chg (1D)", sortable: true, tooltip: "1-day percentage change" },
    { key: "volume", label: "Volume", sortable: true, tooltip: "Number of shares traded" },
    { key: "turnover", label: "Turnover", sortable: true, tooltip: "Total value traded" },
    { key: "vwap_gap_pct", label: "VWAP Gap %", sortable: true, tooltip: "Difference between close and VWAP" },
    { key: "intraday_volatility", label: "Volatility", sortable: true, tooltip: "Intraday price volatility" },
    {
      key: "biggest_order_shares",
      label: "Big Order (Shares)",
      sortable: true,
      tooltip: "Largest single order by shares",
    },
    { key: "biggest_order_value", label: "Big Order Value", sortable: true, tooltip: "Largest single order by value" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Tickers</h1>
            <p className="text-muted-foreground mt-1">Browse and search PSX-listed securities</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
            <CardDescription>Find tickers by symbol or company name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Search by symbol or company name..."
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Market Data</CardTitle>
                <CardDescription>
                  {loading ? "Loading..." : `Showing ${startItem}-${endItem} of ${totalCount} tickers`}
                </CardDescription>
              </div>
              {!loading && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {error ? (
              <div className="p-6 text-center">
                <div className="text-red-600 font-semibold mb-2">Error Loading Data</div>
                <div className="text-muted-foreground">{error}</div>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={loadTickers}>
                  Try Again
                </Button>
              </div>
            ) : loading ? (
              <TableSkeleton />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <TooltipProvider>
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                              column.sortable ? "cursor-pointer hover:bg-muted/70" : ""
                            }`}
                            onClick={column.sortable ? () => handleSort(column.key) : undefined}
                          >
                            <div className="flex items-center gap-1">
                              <span>{column.label}</span>
                              {column.tooltip && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{column.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {column.sortable && <ArrowUpDown className="h-3 w-3" />}
                              {sortConfig.field === column.key && (
                                <span className="text-primary">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                        ))}
                      </TooltipProvider>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tickers.map((ticker) => (
                      <tr
                        key={ticker.symbol}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => {
                          // Future: Navigate to ticker detail page
                          console.log("Navigate to ticker detail:", ticker.symbol)
                        }}
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-sm">{ticker.symbol}</td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate">{ticker.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">{ticker.sector}</td>
                        <td className="px-4 py-3 text-sm font-mono tabular-nums text-right">
                          {ticker.close?.toFixed(2) || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.pct_change_1d} kind="pct" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.volume} kind="vol" showIcon={false} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.turnover} kind="value" showIcon={false} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.vwap_gap_pct} kind="pct" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.intraday_volatility} kind="pct" showIcon={false} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.biggest_order_shares} kind="vol" showIcon={false} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NumberBadge value={ticker.biggest_order_value} kind="value" showIcon={false} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startItem}-{endItem} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
