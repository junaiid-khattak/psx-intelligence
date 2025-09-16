import Link from "next/link"
import { SignUpForm } from "../../../components/auth/signup-form"
import { TrendingUp } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PSX Intelligence</h1>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Start Trading Smarter</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join thousands of traders who trust PSX Intelligence for their market analysis. Get started with your free
            account today.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Free account setup</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Instant access to dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PSX Intelligence</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground mt-2">Get started with PSX Intelligence today</p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
