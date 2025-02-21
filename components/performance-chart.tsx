"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, RadarChart } from "@/components/ui/chart"

interface Teacher {
  id: number
  name: string
  performance: number
  subject: string
}

interface PerformanceChartProps {
  teachers: Teacher[]
}

export function PerformanceChart({ teachers }: PerformanceChartProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const subjects = Array.from(new Set(teachers.map((teacher) => teacher.subject)))

  const filteredTeachers = selectedSubject
    ? teachers.filter((teacher) => teacher.subject === selectedSubject)
    : teachers

  const sortedTeachers = [...filteredTeachers].sort((a, b) => b.performance - a.performance)

  const performanceData = sortedTeachers.map((teacher) => ({
    name: teacher.name,
    performance: teacher.performance,
  }))

  const subjectPerformanceData = subjects.map((subject) => {
    const subjectTeachers = teachers.filter((teacher) => teacher.subject === subject)
    const averagePerformance =
      subjectTeachers.reduce((sum, teacher) => sum + teacher.performance, 0) / subjectTeachers.length
    return {
      subject,
      performance: Number(averagePerformance.toFixed(2)),
    }
  })

  const gradeDistributionData = [
    { name: "A", value: 25 },
    { name: "B", value: 30 },
    { name: "C", value: 20 },
    { name: "D", value: 15 },
    { name: "F", value: 10 },
  ]

  const attendanceTrendData = [
    { month: "Jan", attendance: 85 },
    { month: "Feb", attendance: 90 },
    { month: "Mar", attendance: 88 },
    { month: "Apr", attendance: 92 },
    { month: "May", attendance: 87 },
    { month: "Jun", attendance: 95 },
  ]

  const improvementData = [
    { period: "Q1", improvement: 10 },
    { period: "Q2", improvement: 15 },
    { period: "Q3", improvement: 12 },
    { period: "Q4", improvement: 18 },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Visual representation of student performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Grade Distribution</h3>
            <PieChart
              data={gradeDistributionData}
              category="value"
              index="name"
              colors={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Attendance Trend</h3>
            <LineChart data={attendanceTrendData} categories={["attendance"]} index="month" colors={["#4BC0C0"]} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Subject Performance</h3>
            <RadarChart
              data={subjectPerformanceData}
              categories={["performance"]}
              index="subject"
              colors={["#FF6384"]}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Improvement Over Time</h3>
            <BarChart data={improvementData} categories={["improvement"]} index="period" colors={["#36A2EB"]} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

