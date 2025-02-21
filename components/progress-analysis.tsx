import { Card } from "@/components/ui/card"
import { GpaCircle } from "@/components/gpa-circle"
import { MetricCard } from "@/components/metric-card"
import { GradeChart } from "@/components/grade-chart"

export function ProgressAnalysis() {
  return (
    <Card className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Progress Analysis</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <GpaCircle value={75.82} />
          <p className="text-center text-sm text-muted-foreground mt-6">Your GPA last semester has changed by:</p>
          <p className="text-center text-xl font-bold text-primary">2%</p>
        </div>
        <div className="col-span-2 grid grid-cols-1 gap-4">
          <MetricCard label="ECTs" value={165} />
          <MetricCard label="Passed Courses" value={34} />
          <MetricCard label="Credits" value={102} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Avg. Grade/Semester</h3>
        <div className="h-40">
          <GradeChart />
        </div>
      </div>
    </Card>
  )
}

