import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, PieChart } from "@/components/ui/chart"

interface CoverAssignment {
  id: number
  date: string
  class: string
  session: string
  time: string
  originalTeacher: string
  status: "Upcoming" | "Completed" | "Cancelled"
}

interface CoverAssignmentStatsProps {
  assignments: CoverAssignment[]
}

export function CoverAssignmentStats({ assignments }: CoverAssignmentStatsProps) {
  const statusCounts = assignments.reduce(
    (acc, assignment) => {
      acc[assignment.status] = (acc[assignment.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const classCounts = assignments.reduce(
    (acc, assignment) => {
      acc[assignment.class] = (acc[assignment.class] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  const classData = Object.entries(classCounts).map(([className, count]) => ({
    name: className,
    value: count,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assignments by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart
            data={statusData}
            index="name"
            category="value"
            valueFormatter={(value) => `${value} assignments`}
            colors={["sky", "blue", "indigo"]}
            className="h-[300px]"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assignments by Class</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={classData}
            index="name"
            categories={["value"]}
            colors={["blue"]}
            valueFormatter={(value) => `${value} assignments`}
            yAxisWidth={48}
            className="h-[300px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}

