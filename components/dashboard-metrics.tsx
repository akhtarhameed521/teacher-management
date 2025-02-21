"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Users, BookOpen, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalTeachers: 0,
    activeClasses: 0,
    attendanceRate: 0,
    openTasks: 0,
  })

  useEffect(() => {
    // Fetch metrics from API
    const fetchMetrics = async () => {
      // Simulated API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalTeachers: 25,
            activeClasses: 12,
            attendanceRate: 92,
            openTasks: 18,
          })
        }, 1000)
      })
      setMetrics(response as typeof metrics)
    }

    fetchMetrics()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalTeachers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeClasses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.attendanceRate}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.openTasks}</div>
        </CardContent>
      </Card>
    </div>
  )
}

