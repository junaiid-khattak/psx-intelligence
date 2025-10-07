"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SignInForm } from "../../../components/auth/signin-form"
import { TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/dashboard")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PSX Intelligence</h1>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Professional Market Analysis</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Access real-time PSX data, AI-powered insights, and institutional-grade analytics. Make informed investment
            decisions with confidence.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Real-time market data</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">AI trading signals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Professional charting tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PSX Intelligence</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
