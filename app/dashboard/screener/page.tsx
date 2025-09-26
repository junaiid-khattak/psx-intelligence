import { DashboardLayout } from "../../../components/dashboard-layout"
import { StockScreener } from "../../../components/analysis/stock-screener"

export default function ScreenerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stock Screener</h1>
            <p className="text-muted-foreground mt-1">
              Filter and discover stocks based on technical and fundamental criteria
            </p>
          </div>
        </div>

        <StockScreener />
      </div>
    </DashboardLayout>
  )
}
