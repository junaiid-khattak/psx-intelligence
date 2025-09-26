"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, Database, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  systemHealth: "healthy" | "warning" | "critical"
  lastUpdate: string
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    systemHealth: "healthy",
    lastUpdate: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      try {
        // Fetch user statistics
        const { data: users, error: usersError } = await supabase.from("psx.users").select("id, created_at, role")

        if (usersError) throw usersError

        // Calculate stats
        const totalUsers = users?.length || 0
        const activeUsers = Math.floor(totalUsers * 0.7) // Mock active users
        const totalSessions = Math.floor(totalUsers * 1.3) // Mock sessions

        setStats({
          totalUsers,
          activeUsers,
          totalSessions,
          systemHealth: "healthy",
          lastUpdate: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const healthColor = {
    healthy: "text-green-600",
    warning: "text-yellow-600",
    critical: "text-red-600",
  }

  const healthIcon = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    critical: AlertTriangle,
  }

  const HealthIcon = healthIcon[stats.systemHealth]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and management</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <HealthIcon className={`h-4 w-4 ${healthColor[stats.systemHealth]}`} />
          System {stats.systemHealth}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">Total Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Active Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-base">Sessions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-base">Uptime</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
            <CardDescription>Real-time database health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection Pool</span>
              <Badge variant="outline" className="text-green-600">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Query Performance</span>
              <Badge variant="outline" className="text-green-600">
                Optimal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Usage</span>
              <Badge variant="outline">45% Used</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup Status</span>
              <Badge variant="outline" className="text-green-600">
                Up to Date
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Data Status
            </CardTitle>
            <CardDescription>PSX data feed and processing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">PSX Data Feed</span>
              <Badge variant="outline" className="text-green-600">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <Badge variant="outline">2 min ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cache Status</span>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing Queue</span>
              <Badge variant="outline">12 items</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
          <CardDescription>Latest administrative actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">System backup completed successfully</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration: john.doe@example.com</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Cache invalidation triggered for market data</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
