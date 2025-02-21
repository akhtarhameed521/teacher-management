import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

const GradeChart: React.FC = () => {
  const gradeData = [
    { subject: "Math", grade: 85 },
    { subject: "Science", grade: 92 },
    { subject: "English", grade: 78 },
    { subject: "History", grade: 88 },
    { subject: "Art", grade: 95 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Overview</CardTitle>
        <CardDescription>Your current grades across subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={gradeData}
          index="subject"
          categories={["grade"]}
          colors={["#4BC0C0"]}
          valueFormatter={(value: number) => `${value}%`}
        />
      </CardContent>
    </Card>
  )
}

export default GradeChart

