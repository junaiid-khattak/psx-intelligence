"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Clock, CheckCircle, AlertTriangle, Trash2, Activity } from "lucide-react"

interface CacheEntry {
  key: string
  type: "dashboard" | "tickers" | "signals" | "user"
  size: string
  lastUpdated: string
  hitRate: number
  status: "healthy" | "stale" | "error"
}

export function CacheManagement() {
  const [refreshing, setRefreshing] = useState<string | null>(null)

  // Mock cache data - in production this would come from your cache system
  const cacheEntries: CacheEntry[] = [
    {
      key: "dashboard_sections",
      type: "dashboard",
      size: "2.4 MB",
      lastUpdated: "2 minutes ago",
      hitRate: 94.2,
      status: "healthy",
    },
    {
      key: "tickers_list",
      type: "tickers",
      size: "1.8 MB",
      lastUpdated: "5 minutes ago",
      hitRate: 87.5,
      status: "healthy",
    },
    {
      key: "ai_signals",
      type: "signals",
      size: "512 KB",
      lastUpdated: "15 minutes ago",
      hitRate: 76.3,
      status: "stale",
    },
    {
      key: "user_sessions",
      type: "user",
      size: "256 KB",
      lastUpdated: "1 minute ago",
      hitRate: 99.1,
      status: "healthy",
    },
  ]

  const handleRefreshCache = async (key: string) => {
    setRefreshing(key)
    // Simulate cache refresh
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRefreshing(null)
  }

  const handleClearCache = async (key: string) => {
    // Simulate cache clear
    console.log(`Clearing cache: ${key}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "stale":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "stale":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dashboard":
        return "bg-blue-100 text-blue-800"
      case "tickers":
        return "bg-green-100 text-green-800"
      case "signals":
        return "bg-purple-100 text-purple-800"
      case "user":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cache Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage system cache performance</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Cache Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">Total Cache Size</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5.0 MB</div>
            <p className="text-sm text-muted-foreground">Across all entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Hit Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89.3%</div>
            <p className="text-sm text-muted-foreground">Average across all caches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Healthy Entries</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-sm text-muted-foreground">Out of 4 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <CardTitle className="text-base">Stale Entries</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-sm text-muted-foreground">Needs refresh</p>
          </CardContent>
        </Card>
      </div>

      {/* Cache Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cache Entries</CardTitle>
          <CardDescription>Individual cache performance and management</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cache Key
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Hit Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cacheEntries.map((entry) => (
                  <tr key={entry.key} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm">{entry.key}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getTypeColor(entry.type)}>{entry.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.size}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{entry.hitRate}%</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{entry.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        <span className={`text-sm font-medium capitalize ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefreshCache(entry.key)}
                          disabled={refreshing === entry.key}
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshing === entry.key ? "animate-spin" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleClearCache(entry.key)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
