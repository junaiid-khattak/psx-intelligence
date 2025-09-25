"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { RefreshCw } from "lucide-react"
import { trpc } from "../lib/trpc"

interface RefreshButtonProps {
  onRefresh?: () => void
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
  children?: React.ReactNode
}

export function RefreshButton({
  onRefresh,
  variant = "outline",
  size = "sm",
  className = "",
  children,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const utils = trpc.useUtils()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      } else {
        // Default behavior: invalidate all queries
        await utils.invalidate()
      }
    } catch (error) {
      console.error("[v0] Refresh failed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`bg-transparent ${className}`}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
      {children || (isRefreshing ? "Refreshing..." : "Refresh")}
    </Button>
  )
}
