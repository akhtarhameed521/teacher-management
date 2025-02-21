"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { ArrowUpIcon, ArrowDownIcon, Search, SortAsc, SortDesc } from "lucide-react"
import { SmartActionPlan } from "@/components/smart-action-plan"
import { Label } from "@/components/ui/label"

interface Student {
  iatcId: string
  firstName: string
  familyName: string
  class: string
  cambridgeScore: number
  level: string
  targetMetNotMet: "Met" | "Not Met"
  gain: number
  reading: { score: number }
  writing: { score: number }
  listening: { score: number }
  speaking: { score: number }
  target: number
  exam1Score: number
  exam2Score: number
  instructor: string
}

export function StudentResults() {
  const [students, setStudents] = useState<Student[]>([
    // Sample data - in a real application, this would be fetched from an API
    {
      iatcId: "001",
      firstName: "John",
      familyName: "Doe",
      class: "FND-01",
      cambridgeScore: 160,
      level: "B2",
      targetMetNotMet: "Met",
      gain: 15,
      reading: { score: 40 },
      writing: { score: 38 },
      listening: { score: 42 },
      speaking: { score: 40 },
      target: 165,
      exam1Score: 145,
      exam2Score: 160,
      instructor: "Ms. Smith",
    },
    // Add more sample students here
  ])

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof Student>("iatcId")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterLevel, setFilterLevel] = useState<string | null>(null)

  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter(
        (student) =>
          (student.firstName.toLowerCase() + " " + student.familyName.toLowerCase()).includes(
            searchTerm.toLowerCase(),
          ) ||
          student.iatcId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((student) => (filterLevel ? student.level === filterLevel : true))
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [students, searchTerm, sortColumn, sortDirection, filterLevel])

  const handleSort = (column: keyof Student) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const levels = useMemo(() => {
    return Array.from(new Set(students.map((student) => student.level)))
  }, [students])

  const performanceData = useMemo(() => {
    return filteredAndSortedStudents.map((student) => ({
      name: `${student.firstName} ${student.familyName}`,
      score: student.cambridgeScore,
    }))
  }, [filteredAndSortedStudents])

  const skillsData = useMemo(() => {
    return selectedStudent
      ? [
          { name: "Reading", score: selectedStudent.reading.score },
          { name: "Writing", score: selectedStudent.writing.score },
          { name: "Listening", score: selectedStudent.listening.score },
          { name: "Speaking", score: selectedStudent.speaking.score },
        ]
      : []
  }, [selectedStudent])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Student Exam Results Analytics</h2>

      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterLevel || "All Levels"} onValueChange={(value) => setFilterLevel(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Levels">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button variant="ghost" onClick={() => handleSort("iatcId")}>
                      IATC ID
                      {sortColumn === "iatcId" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-2 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("firstName")}>
                      Name
                      {sortColumn === "firstName" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-2 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("cambridgeScore")}>
                      Cambridge Score
                      {sortColumn === "cambridgeScore" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-2 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Target Met</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("gain")}>
                      Gain
                      {sortColumn === "gain" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-2 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStudents.map((student) => (
                  <TableRow key={student.iatcId}>
                    <TableCell className="font-medium">{student.iatcId}</TableCell>
                    <TableCell>{`${student.firstName} ${student.familyName}`}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.cambridgeScore}</TableCell>
                    <TableCell>{student.level}</TableCell>
                    <TableCell>
                      <Badge variant={student.targetMetNotMet === "Met" ? "success" : "destructive"}>
                        {student.targetMetNotMet}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={student.gain >= 0 ? "text-green-600" : "text-red-600"}>
                        {student.gain >= 0 ? (
                          <ArrowUpIcon className="inline mr-1" />
                        ) : (
                          <ArrowDownIcon className="inline mr-1" />
                        )}
                        {Math.abs(student.gain)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" onClick={() => setSelectedStudent(student)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={performanceData}
                index="name"
                categories={["score"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} points`}
                yAxisWidth={48}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          {selectedStudent ? (
            <Card>
              <CardHeader>
                <CardTitle>{`${selectedStudent.firstName} ${selectedStudent.familyName}'s Detailed Results`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Student Information</h3>
                    <p>
                      <strong>IATC ID:</strong> {selectedStudent.iatcId}
                    </p>
                    <p>
                      <strong>Class:</strong> {selectedStudent.class}
                    </p>
                    <p>
                      <strong>Level:</strong> {selectedStudent.level}
                    </p>
                    <p>
                      <strong>Instructor:</strong> {selectedStudent.instructor}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Exam Results</h3>
                    <p>
                      <strong>Cambridge Score:</strong> {selectedStudent.cambridgeScore}
                    </p>
                    <p>
                      <strong>Target:</strong> {selectedStudent.target}
                    </p>
                    <p>
                      <strong>Target Met:</strong> {selectedStudent.targetMetNotMet}
                    </p>
                    <p>
                      <strong>Gain:</strong> {selectedStudent.gain}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Skill Breakdown</h3>
                  <BarChart
                    data={skillsData}
                    index="name"
                    categories={["score"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value} points`}
                    yAxisWidth={48}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>Please select a student to view detailed results.</p>
          )}
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <LineChart
                  data={[
                    { exam: "Initial", score: selectedStudent.exam1Score },
                    { exam: "Final", score: selectedStudent.exam2Score },
                  ]}
                  index="exam"
                  categories={["score"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} points`}
                  yAxisWidth={48}
                />
              ) : (
                <p>Please select a student to view performance trends.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-plan">
          <Card>
            <CardHeader>
              <CardTitle>SMART Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent ? (
                <SmartActionPlan studentData={selectedStudent} />
              ) : (
                <p>Please select a student to create an action plan.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            View Selected Student Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={`${selectedStudent.firstName} ${selectedStudent.familyName}`}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="iatcId" className="text-right">
                  IATC ID
                </Label>
                <Input id="iatcId" value={selectedStudent.iatcId} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Class
                </Label>
                <Input id="class" value={selectedStudent.class} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">
                  Level
                </Label>
                <Input id="level" value={selectedStudent.level} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cambridgeScore" className="text-right">
                  Cambridge Score
                </Label>
                <Input id="cambridgeScore" value={selectedStudent.cambridgeScore} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetMetNotMet" className="text-right">
                  Target Met
                </Label>
                <Input id="targetMetNotMet" value={selectedStudent.targetMetNotMet} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gain" className="text-right">
                  Gain
                </Label>
                <Input id="gain" value={selectedStudent.gain} className="col-span-3" readOnly />
              </div>
            </div>
          ) : (
            <p>No student selected</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

