"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, PieChart, LineChart, RadarChart } from "@/components/ui/chart"

interface AdvancedAnalyticsProps {
  teachers: any[]
  classes: any[]
  students: any[]
  performanceTrendData: any[]
  attendanceData: any[]
  skillDistributionData: any[]
  resourceUtilizationData: any[]
}

export function AdvancedAnalytics({
  teachers,
  classes,
  students,
  performanceTrendData,
  attendanceData,
  skillDistributionData,
  resourceUtilizationData,
}: AdvancedAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState("performance")

  const teacherPerformance = teachers.map((teacher) => ({
    name: teacher.name,
    value: teacher.performance,
  }))

  const classPerformance = classes.map((cls) => ({
    name: cls.name,
    value: cls.averagePerformance,
  }))

  const studentPerformance = students.map((student) => ({
    name: student.name,
    value: student.performance,
  }))

  const performanceDistribution = [
    { name: "90-100%", value: students.filter((s) => s.performance >= 90).length },
    { name: "80-89%", value: students.filter((s) => s.performance >= 80 && s.performance < 90).length },
    { name: "70-79%", value: students.filter((s) => s.performance >= 70 && s.performance < 80).length },
    { name: "60-69%", value: students.filter((s) => s.performance >= 60 && s.performance < 70).length },
    { name: "<60%", value: students.filter((s) => s.performance < 60).length },
  ]

  const metrics = {
    performance: {
      teacher: teacherPerformance,
      class: classPerformance,
      student: studentPerformance,
    },
    attendance: {
      student: students.map((student) => ({
        name: student.name,
        value: student.attendance,
      })),
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Student Performance Trends</CardTitle>
          <CardDescription>Analyzing performance across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={performanceTrendData} categories={["Math", "Science", "English", "History"]} index="month" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Patterns</CardTitle>
          <CardDescription>Visualizing attendance trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={attendanceData} categories={["Present", "Absent", "Late"]} index="week" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skill Distribution</CardTitle>
          <CardDescription>Overview of student skills across subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart data={skillDistributionData} categories={["value"]} index="skill" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
          <CardDescription>Analyzing the usage of learning resources</CardDescription>
        </CardHeader>
        <CardContent>
          <PieChart data={resourceUtilizationData} category="usage" index="resource" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>Dive deep into various metrics across teachers, classes, and students</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardDescription>Overall metrics</CardDescription>
                  <Select onValueChange={(value) => setSelectedMetric(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <BarChart
                  data={metrics[selectedMetric].teacher || metrics[selectedMetric].student}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </div>
            </TabsContent>
            <TabsContent value="comparison">
              <div className="space-y-4">
                <CardDescription>Comparison across categories</CardDescription>
                <BarChart
                  data={[
                    {
                      category: "Teachers",
                      value: teachers.reduce((sum, t) => sum + t.performance, 0) / teachers.length,
                    },
                    {
                      category: "Classes",
                      value: classes.reduce((sum, c) => sum + c.averagePerformance, 0) / classes.length,
                    },
                    {
                      category: "Students",
                      value: students.reduce((sum, s) => sum + s.performance, 0) / students.length,
                    },
                  ]}
                  index="category"
                  categories={["value"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value.toFixed(2)}%`}
                />
              </div>
            </TabsContent>
            <TabsContent value="distribution">
              <div className="space-y-4">
                <CardDescription>Performance distribution</CardDescription>
                <PieChart
                  data={performanceDistribution}
                  category="value"
                  index="name"
                  colors={["sky", "blue", "indigo", "violet", "purple"]}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

