import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PerformanceInsightsProps {
  teachers: any[]
}

export function PerformanceInsights({ teachers }: PerformanceInsightsProps) {
  const data = teachers.map((teacher) => ({
    name: teacher.name,
    performance: teacher.performance,
    coverCount: teacher.coverCount,
  }))

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="performance" fill="#8884d8" name="Performance" />
            <Bar yAxisId="right" dataKey="coverCount" fill="#82ca9d" name="Cover Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

