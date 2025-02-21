"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const attendanceData = [
  { name: "Math 101", attendance: 92 },
  { name: "Science 101", attendance: 88 },
  { name: "English 101", attendance: 95 },
  { name: "History 101", attendance: 85 },
  { name: "Art 101", attendance: 98 },
]

const taskCompletionData = [
  { name: "John Doe", completed: 15, total: 20 },
  { name: "Jane Smith", completed: 18, total: 20 },
  { name: "Bob Johnson", completed: 12, total: 20 },
  { name: "Alice Brown", completed: 20, total: 20 },
  { name: "Charlie Davis", completed: 16, total: 20 },
]

export default function Reports() {
  const [reportType, setReportType] = useState("attendance")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setReportType} defaultValue={reportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="taskCompletion">Task Completion</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{reportType === "attendance" ? "Attendance Report" : "Task Completion Report"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={reportType === "attendance" ? attendanceData : taskCompletionData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {reportType === "attendance" ? (
                <Bar dataKey="attendance" fill="#8884d8" />
              ) : (
                <>
                  <Bar dataKey="completed" fill="#82ca9d" />
                  <Bar dataKey="total" fill="#8884d8" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

