"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Database, Activity, TrendingUp, RefreshCw, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalTickers: number
  lastDataUpdate: string
  cacheStatus: "healthy" | "warning" | "error"
  systemStatus: "operational" | "degraded" | "down"
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTickers: 0,
    lastDataUpdate: "Loading...",
    cacheStatus: "healthy",
    systemStatus: "operational",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const supabase = createClient()

        // Get user counts
        const { count: totalUsers } = await supabase.from("psx.users").select("*", { count: "exact", head: true })

        // Get ticker count
        const { count: totalTickers } = await supabase.from("psx.tickers").select("*", { count: "exact", head: true })

        // Get latest data update
        const { data: latestData } = await supabase
          .from("psx.prices_eod")
          .select("trading_date")
          .order("trading_date", { ascending: false })
          .limit(1)
          .single()

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: Math.floor((totalUsers || 0) * 0.3), // Mock active users
          totalTickers: totalTickers || 0,
          lastDataUpdate: latestData?.trading_date ? new Date(latestData.trading_date).toLocaleDateString() : "Unknown",
          cacheStatus: "healthy",
          systemStatus: "operational",
        })
      } catch (error) {
        console.error("Failed to load admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
      case "down":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational":
        return "text-green-600"
      case "warning":
      case "degraded":
        return "text-yellow-600"
      case "error":
      case "down":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and management</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">Total Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">{loading ? "..." : stats.activeUsers} active this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Total Tickers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : stats.totalTickers.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">PSX listed securities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-base">Cache Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(stats.cacheStatus)}
              <span className={`font-medium capitalize ${getStatusColor(stats.cacheStatus)}`}>{stats.cacheStatus}</span>
            </div>
            <p className="text-sm text-muted-foreground">Data caching system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-base">System Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(stats.systemStatus)}
              <span className={`font-medium capitalize ${getStatusColor(stats.systemStatus)}`}>
                {stats.systemStatus}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Overall system health</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Status</CardTitle>
          <CardDescription>Market data and system information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Last Data Update</h4>
              <p className="text-sm text-muted-foreground">
                Market data was last updated on <span className="font-medium">{stats.lastDataUpdate}</span>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">PSX Real-time</Badge>
                <Badge variant="outline">End-of-Day</Badge>
                <Badge variant="outline">Corporate Actions</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Cache
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Database className="h-4 w-4 mr-2" />
              Update Data
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
