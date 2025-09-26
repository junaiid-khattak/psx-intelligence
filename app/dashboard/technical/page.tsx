import { DashboardLayout } from "../../../components/dashboard-layout"
import { TechnicalAnalysis } from "../../../components/analysis/technical-analysis"

export default function TechnicalPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Technical Analysis</h1>
            <p className="text-muted-foreground mt-1">Advanced charting and technical indicators for PSX stocks</p>
          </div>
        </div>

        <TechnicalAnalysis />
      </div>
    </DashboardLayout>
  )
}
