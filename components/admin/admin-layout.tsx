"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Shield,
  Users,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Database,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "System Monitoring", href: "/admin/system", icon: Activity },
  { name: "Database", href: "/admin/database", icon: Database },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/auth/signin")
        return
      }

      setUser(user)

      // Fetch user data and check admin role
      const { data: userData } = await supabase.from("psx.users").select("*").eq("id", user.id).single()

      if (!userData || userData.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setUserData(userData)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/signin")
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        getUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData || userData.role !== "admin") {
    return null
  }

  const userInitials = userData?.full_name
    ? userData.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "A"

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <span className="text-xl font-bold text-foreground">PSX Admin</span>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-red-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-border">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="w-full justify-start mb-2 bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                User Dashboard
              </Button>
            </Link>
          </div>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-red-600/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-red-600">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userData?.full_name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <p className="text-xs text-red-600 font-medium">Administrator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center gap-4 px-4 py-3">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Admin Mode</span>
            </div>
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              System Status: <span className="text-green-600 font-medium">Operational</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
