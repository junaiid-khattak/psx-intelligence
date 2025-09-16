import { DashboardLayout } from "../../../components/dashboard-layout"
import { SignalsOverview } from "../../../components/signals-overview"

export default function SignalsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Trading Signals</h1>
            <p className="text-muted-foreground mt-1">Machine learning insights for PSX stocks</p>
          </div>
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        <SignalsOverview />
      </div>
    </DashboardLayout>
  )
}
