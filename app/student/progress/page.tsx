"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProgressAnalysis } from "@/components/progress-analysis"

export default function ProgressPage() {
  const [semesters] = useState([
    {
      name: "Semester 1",
      avgGrade: 67,
      courses: [
        {
          code: "COMP0023",
          name: "DATA SCIENCE",
          year: "2023",
          grade: 74,
          status: "success",
        },
        {
          code: "COMP0028",
          name: "CYBERSECURITY",
          year: "2023",
          grade: 69,
          status: "warning",
        },
        {
          code: "COMP0013",
          name: "DIGITAL TECHNOLOGIES",
          year: "2023",
          grade: 32,
          status: "danger",
        },
        {
          code: "COMP0087",
          name: "NETWORKING",
          year: "2023",
          grade: 89,
          status: "success",
        },
      ],
    },
    {
      name: "Semester 2",
      avgGrade: 87,
      courses: [
        {
          code: "COMP0023",
          name: "SOFTWARE ENGINEERING",
          year: "2023",
          grade: 65,
          status: "warning",
        },
      ],
    },
  ])

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      <div className="space-y-6">
        {semesters.map((semester) => (
          <Card key={semester.name} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{semester.name}</h2>
              <p className="text-sm text-muted-foreground">Avg. Grade {semester.avgGrade}</p>
            </div>
            <div className="space-y-4">
              {semester.courses.map((course) => (
                <div key={`${semester.name}-${course.code}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                    <p
                      className={`text-sm font-medium ${
                        course.status === "danger" ? "text-destructive" : "text-primary"
                      }`}
                    >
                      {course.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{course.year}</p>
                  </div>
                  <span
                    className={`text-2xl font-bold ${course.status === "danger" ? "text-destructive" : "text-primary"}`}
                  >
                    {course.grade}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <ProgressAnalysis />
    </div>
  )
}

