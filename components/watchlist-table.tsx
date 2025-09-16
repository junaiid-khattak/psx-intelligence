"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table"
import { trpc } from "../lib/trpc"
import { Button } from "./ui/button"
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "../lib/utils"
import { StockDetailCard } from "./stock-detail-card"

interface Stock {
  ticker: string
  name: string
  price: number
  change: number
  volume: number
}

export function WatchlistTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [signalExplanation, setSignalExplanation] = useState<{
    ticker: string
    signal: string
    confidence: number
  } | null>(null)

  const { data: stocks = [], isLoading } = trpc.getWatchlist.useQuery()
  const explainSignalMutation = trpc.explainSignal.useMutation({
    onSuccess: (data) => {
      if (expandedRow) {
        setSignalExplanation({
          ticker: expandedRow,
          signal: data.signal,
          confidence: data.confidence,
        })
      }
    },
  })

  const handleExplainSignal = () => {
    if (expandedRow) {
      setSignalExplanation(null)
      explainSignalMutation.mutate({ ticker: expandedRow })
    }
  }

  const columns: ColumnDef<Stock>[] = [
    {
      accessorKey: "ticker",
      header: "Symbol",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.getValue("ticker")}
          <div className="text-xs text-muted-foreground truncate max-w-32">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Price
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-1 h-3 w-3" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => <div className="font-mono text-foreground">₨{row.getValue<number>("price").toFixed(2)}</div>,
    },
    {
      accessorKey: "change",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Change %
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-1 h-3 w-3" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => {
        const change = row.getValue<number>("change")
        const isPositive = change > 0
        return (
          <div className={cn("flex items-center gap-1 font-medium", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </div>
        )
      },
    },
    {
      accessorKey: "volume",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Volume
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-1 h-3 w-3" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => {
        const volume = row.getValue<number>("volume")
        const formatted = volume >= 1000000 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}K`
        return <div className="font-mono text-muted-foreground">{formatted}</div>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newExpanded = expandedRow === row.original.ticker ? null : row.original.ticker
            setExpandedRow(newExpanded)
            if (!newExpanded || newExpanded !== expandedRow) {
              setSignalExplanation(null)
            }
          }}
          className="text-xs"
        >
          {expandedRow === row.original.ticker ? "Collapse" : "Details"}
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-4 font-medium text-muted-foreground">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border hover:bg-muted/50 transition-colors cursor-pointer",
                    expandedRow === row.original.ticker && "bg-muted/30",
                  )}
                  onClick={() => {
                    const newExpanded = expandedRow === row.original.ticker ? null : row.original.ticker
                    setExpandedRow(newExpanded)
                    if (!newExpanded || newExpanded !== expandedRow) {
                      setSignalExplanation(null)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {expandedRow === row.original.ticker && (
                  <tr>
                    <td colSpan={columns.length} className="p-0">
                      <div className="bg-muted/20 border-t border-border p-6">
                        <StockDetailCard
                          ticker={row.original.ticker}
                          onExplainSignal={handleExplainSignal}
                          isLoadingSignal={explainSignalMutation.isPending}
                        />

                        {signalExplanation && signalExplanation.ticker === row.original.ticker && (
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-foreground">AI Signal Analysis</h5>
                              <span className="text-xs text-muted-foreground">
                                Confidence: {signalExplanation.confidence}%
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{signalExplanation.signal}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
