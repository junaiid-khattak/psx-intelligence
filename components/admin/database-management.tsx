"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Table, RefreshCw, Activity, HardDrive, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TableInfo {
  name: string
  schema: string
  rowCount: number
  size: string
  lastUpdated: string
  status: "healthy" | "warning" | "error"
}

export function DatabaseManagement() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [dbStats, setDbStats] = useState({
    totalTables: 0,
    totalRows: 0,
    dbSize: "0 MB",
    lastBackup: "Never",
  })

  useEffect(() => {
    const loadDatabaseInfo = async () => {
      try {
        const supabase = createClient()

        // Get table information from our PSX schema
        const mockTables: TableInfo[] = [
          {
            name: "users",
            schema: "psx",
            rowCount: 1247,
            size: "2.4 MB",
            lastUpdated: "2 hours ago",
            status: "healthy",
          },
          {
            name: "tickers",
            schema: "psx",
            rowCount: 573,
            size: "1.8 MB",
            lastUpdated: "1 day ago",
            status: "healthy",
          },
          {
            name: "prices_eod",
            schema: "psx",
            rowCount: 2847392,
            size: "1.2 GB",
            lastUpdated: "6 hours ago",
            status: "warning",
          },
          {
            name: "prices_intraday",
            schema: "psx",
            rowCount: 15847293,
            size: "4.8 GB",
            lastUpdated: "15 minutes ago",
            status: "healthy",
          },
          {
            name: "corporate_actions",
            schema: "psx",
            rowCount: 8472,
            size: "156 KB",
            lastUpdated: "3 days ago",
            status: "healthy",
          },
          {
            name: "ai_signals",
            schema: "psx",
            rowCount: 94738,
            size: "45 MB",
            lastUpdated: "30 minutes ago",
            status: "healthy",
          },
        ]

        setTables(mockTables)
        setDbStats({
          totalTables: mockTables.length,
          totalRows: mockTables.reduce((sum, table) => sum + table.rowCount, 0),
          dbSize: "6.8 GB",
          lastBackup: "12 hours ago",
        })
      } catch (error) {
        console.error("Failed to load database info:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDatabaseInfo()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
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
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Database Management</h1>
          <p className="text-muted-foreground mt-1">Monitor database performance and manage data</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">Total Tables</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{loading ? "..." : dbStats.totalTables}</div>
            <p className="text-sm text-muted-foreground">PSX schema tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Total Records</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : dbStats.totalRows.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Across all tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-base">Database Size</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{loading ? "..." : dbStats.dbSize}</div>
            <p className="text-sm text-muted-foreground">Total storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-base">Last Backup</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{loading ? "..." : dbStats.lastBackup}</div>
            <p className="text-sm text-muted-foreground">Automated backup</p>
          </CardContent>
        </Card>
      </div>

      {/* Tables List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Database Tables</CardTitle>
          <CardDescription>
            {loading ? "Loading tables..." : `Showing ${tables.length} tables in PSX schema`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse">Loading database information...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Table Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Schema
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Row Count
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Size
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
                  {tables.map((table) => (
                    <tr key={`${table.schema}.${table.name}`} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Table className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm font-medium">{table.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{table.schema}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{table.rowCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{table.size}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{table.lastUpdated}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(table.status)}
                          <span className={`text-sm font-medium capitalize ${getStatusColor(table.status)}`}>
                            {table.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Database Operations</CardTitle>
          <CardDescription>Common database maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Statistics
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Database className="h-4 w-4 mr-2" />
              Run Backup
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Activity className="h-4 w-4 mr-2" />
              Optimize Tables
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
