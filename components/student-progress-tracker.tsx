"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart } from "@/components/ui/chart"

type Student = {
  id: number
  name: string
  grades: {
    [subject: string]: number[]
  }
  attendance: number
  overallProgress: number
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Ahmed Ali",
    grades: {
      Math: [85, 90, 88, 92],
      Science: [78, 82, 85, 80],
      English: [90, 88, 92, 95],
    },
    attendance: 95,
    overallProgress: 88,
  },
  {
    id: 2,
    name: "Fatima Hassan",
    grades: {
      Math: [92, 95, 90, 93],
      Science: [88, 85, 90, 92],
      English: [85, 88, 90, 87],
    },
    attendance: 98,
    overallProgress: 91,
  },
  // Add more mock students here
]

export function StudentProgressTracker() {
  const [selectedStudent, setSelectedStudent] = useState<Student>(mockStudents[0])

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500"
    if (progress >= 80) return "bg-blue-500"
    if (progress >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={(value) =>
            setSelectedStudent(mockStudents.find((s) => s.id === Number.parseInt(value)) || mockStudents[0])
          }
        >
          <SelectTrigger className="w-[200px] mb-4">
            <SelectValue placeholder="Select a student" />
          </SelectTrigger>
          <SelectContent>
            {mockStudents.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{selectedStudent.overallProgress}%</div>
              <Progress
                value={selectedStudent.overallProgress}
                className={getProgressColor(selectedStudent.overallProgress)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{selectedStudent.attendance}%</div>
              <Progress value={selectedStudent.attendance} className={getProgressColor(selectedStudent.attendance)} />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Latest Grade</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(selectedStudent.grades).map(([subject, grades]) => (
                  <TableRow key={subject}>
                    <TableCell>{subject}</TableCell>
                    <TableCell>{grades[grades.length - 1]}</TableCell>
                    <TableCell>{(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)}</TableCell>
                    <TableCell>
                      <LineChart
                        data={grades.map((grade, index) => ({ x: index + 1, y: grade }))}
                        index="x"
                        categories={["y"]}
                        colors={["blue"]}
                        className="h-[50px] w-[100px]"
                        showLegend={false}
                        showXAxis={false}
                        showYAxis={false}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

