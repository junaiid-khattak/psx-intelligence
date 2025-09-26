"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

interface SystemMetrics {
  cpu: number
  memory: number
  storage: number
  network: number
  uptime: string
  activeConnections: number
  requestsPerMinute: number
  errorRate: number
}

export function SystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    storage: 38,
    network: 78,
    uptime: "15d 4h 23m",
    activeConnections: 1247,
    requestsPerMinute: 342,
    errorRate: 0.02,
  })
  const [loading, setLoading] = useState(false)

  const refreshMetrics = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        ...metrics,
        cpu: Math.floor(Math.random() * 30) + 30,
        memory: Math.floor(Math.random() * 40) + 40,
        network: Math.floor(Math.random() * 50) + 50,
        activeConnections: Math.floor(Math.random() * 500) + 1000,
        requestsPerMinute: Math.floor(Math.random() * 200) + 250,
      })
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-600"
    if (value >= thresholds.warning) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return AlertTriangle
    if (value >= thresholds.warning) return AlertTriangle
    return CheckCircle
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Monitoring</h1>
          <p className="text-muted-foreground mt-1">Real-time system health and performance metrics</p>
        </div>
        <Button onClick={refreshMetrics} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">CPU Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.cpu}%</span>
                <Badge variant="outline" className={getStatusColor(metrics.cpu, { warning: 70, critical: 85 })}>
                  {metrics.cpu < 70 ? "Normal" : metrics.cpu < 85 ? "High" : "Critical"}
                </Badge>
              </div>
              <Progress value={metrics.cpu} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Memory Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.memory}%</span>
                <Badge variant="outline" className={getStatusColor(metrics.memory, { warning: 80, critical: 90 })}>
                  {metrics.memory < 80 ? "Normal" : metrics.memory < 90 ? "High" : "Critical"}
                </Badge>
              </div>
              <Progress value={metrics.memory} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-base">Storage Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.storage}%</span>
                <Badge variant="outline" className={getStatusColor(metrics.storage, { warning: 75, critical: 90 })}>
                  {metrics.storage < 75 ? "Normal" : metrics.storage < 90 ? "High" : "Critical"}
                </Badge>
              </div>
              <Progress value={metrics.storage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-base">Network I/O</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.network}%</span>
                <Badge variant="outline" className={getStatusColor(metrics.network, { warning: 80, critical: 95 })}>
                  {metrics.network < 80 ? "Normal" : metrics.network < 95 ? "High" : "Critical"}
                </Badge>
              </div>
              <Progress value={metrics.network} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Status
            </CardTitle>
            <CardDescription>System uptime and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <Badge variant="outline" className="text-green-600">
                {metrics.uptime}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Connections</span>
              <Badge variant="outline">{metrics.activeConnections.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Requests/min</span>
              <Badge variant="outline">{metrics.requestsPerMinute.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <Badge variant="outline" className="text-green-600">
                {metrics.errorRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Health
            </CardTitle>
            <CardDescription>Database performance and status</CardDescription>
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
              <span className="text-sm">Replication Lag</span>
              <Badge variant="outline">&lt; 1ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cache Hit Rate</span>
              <Badge variant="outline" className="text-green-600">
                98.5%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Data Feed
            </CardTitle>
            <CardDescription>PSX data processing status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Feed Status</span>
              <Badge variant="outline" className="text-green-600">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <Badge variant="outline">2 min ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing Queue</span>
              <Badge variant="outline">12 items</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Accuracy</span>
              <Badge variant="outline" className="text-green-600">
                99.9%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system events and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">System backup completed successfully</p>
                <p className="text-xs text-green-600">All data backed up to secure storage - 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">High memory usage detected</p>
                <p className="text-xs text-yellow-600">Memory usage at 85% - consider scaling - 15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Cache invalidation completed</p>
                <p className="text-xs text-blue-600">Market data cache refreshed successfully - 1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
