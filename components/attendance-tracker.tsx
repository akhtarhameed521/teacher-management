"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timer, AlertCircle, MoreVertical, Download, Search, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AttendanceStats } from "@/components/attendance-stats"
import { WeeklyView } from "@/components/weekly-view"
import {
  calculateAttendanceStats,
  getAbsenceCount,
  formatDuration,
  generateAttendanceReport,
  getWeeklyAttendance,
  calculateTardiness,
} from "@/lib/utils/attendance"
import type { Student, AttendanceStatus, WeeklyAttendance } from "@/types/attendance"

const initialStudents: Student[] = [
  {
    id: "164031",
    firstName: "Abdullah",
    middleName: "Abdulrahman",
    lastName: "Abu Shahab",
    attendance: [],
    toiletBreaks: [],
  },
  {
    id: "164034",
    firstName: "Mohammed",
    middleName: "Abdulraheem",
    lastName: "Alzamil",
    attendance: [],
    toiletBreaks: [],
  },
  {
    id: "164037",
    firstName: "Fatima",
    middleName: "Ahmed",
    lastName: "Al-Sayed",
    attendance: [],
    toiletBreaks: [],
  },
  {
    id: "164040",
    firstName: "Aisha",
    middleName: "Khalid",
    lastName: "Al-Rashid",
    attendance: [],
    toiletBreaks: [],
  },
  {
    id: "164043",
    firstName: "Omar",
    middleName: "Hassan",
    lastName: "Al-Farsi",
    attendance: [],
    toiletBreaks: [],
  },
]

export function AttendanceTracker() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Update toilet break timers
  useEffect(() => {
    const timer = setInterval(() => {
      setStudents((currentStudents) =>
        currentStudents.map((student) => {
          const activeBreak = student.toiletBreaks.find((b) => !b.endTime)
          if (activeBreak) {
            const duration = Math.floor((new Date().getTime() - new Date(activeBreak.startTime).getTime()) / 1000)
            return {
              ...student,
              toiletBreaks: student.toiletBreaks.map((b) => (b.id === activeBreak.id ? { ...b, duration } : b)),
            }
          }
          return student
        }),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAttendanceStatus = useCallback(
    async (student: Student, status: AttendanceStatus) => {
      try {
        setLoading(true)
        const updatedStudents = students.map((s) => {
          if (s.id === student.id) {
            return {
              ...s,
              attendance: [
                ...s.attendance,
                {
                  id: uuidv4(),
                  status,
                  notes: "",
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          }
          return s
        })
        setStudents(updatedStudents)
        toast({
          title: "Attendance Updated",
          description: `Marked ${student.firstName} as ${status}`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update attendance",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [students, toast],
  )

  const handleToiletBreak = useCallback(
    (student: Student) => {
      const currentBreak = student.toiletBreaks.find((b) => !b.endTime)
      const now = new Date()

      if (currentBreak) {
        // End the break
        setStudents((currentStudents) =>
          currentStudents.map((s) => {
            if (s.id === student.id) {
              return {
                ...s,
                toiletBreaks: s.toiletBreaks.map((b) =>
                  b.id === currentBreak.id
                    ? {
                        ...b,
                        endTime: now.toISOString(),
                        duration: Math.floor((now.getTime() - new Date(b.startTime).getTime()) / 1000),
                      }
                    : b,
                ),
              }
            }
            return s
          }),
        )
        toast({
          title: "Toilet Break Ended",
          description: `${student.firstName}'s break has ended`,
        })
      } else {
        // Start a new break
        setStudents((currentStudents) =>
          currentStudents.map((s) => {
            if (s.id === student.id) {
              return {
                ...s,
                toiletBreaks: [
                  ...s.toiletBreaks,
                  {
                    id: uuidv4(),
                    startTime: now.toISOString(),
                    endTime: null,
                    duration: 0,
                  },
                ],
              }
            }
            return s
          }),
        )
        toast({
          title: "Toilet Break Started",
          description: `${student.firstName}'s break has started`,
        })
      }
    },
    [toast],
  )

  const handleAddNote = useCallback(
    (student: Student) => {
      if (!note.trim()) return

      setStudents((currentStudents) =>
        currentStudents.map((s) => {
          if (s.id === student.id) {
            const attendance = [...s.attendance]
            if (attendance.length > 0) {
              attendance[attendance.length - 1].notes = note
            }
            return { ...s, attendance }
          }
          return s
        }),
      )
      toast({
        title: "Note Added",
        description: "The note has been saved successfully",
      })
      setNote("")
      setSelectedStudent(null)
    },
    [note, toast],
  )

  const handleExportAttendance = useCallback(() => {
    const report = generateAttendanceReport(students)
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-report-${format(new Date(), "yyyy-MM-dd")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Report Exported",
      description: "Attendance report has been downloaded",
    })
  }, [students, toast])

  const handleBulkAction = useCallback(
    (action: AttendanceStatus) => {
      const updatedStudents = students.map((student) => ({
        ...student,
        attendance: [
          ...student.attendance,
          {
            id: uuidv4(),
            status: action,
            notes: "",
            timestamp: new Date().toISOString(),
          },
        ],
      }))
      setStudents(updatedStudents)
      toast({
        title: "Bulk Action Completed",
        description: `Marked all students as ${action}`,
      })
    },
    [students, toast],
  )

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.includes(searchTerm),
    )
  }, [students, searchTerm])

  const stats = useMemo(() => calculateAttendanceStats(students), [students])
  const weeklyAttendance: WeeklyAttendance = useMemo(() => getWeeklyAttendance(students), [students])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Tracker</h2>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportAttendance}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </div>

      <AttendanceStats stats={stats} />

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
        </div>
        <div className="space-x-2">
          <Button onClick={() => handleBulkAction("present")}>Mark All Present</Button>
          <Button onClick={() => handleBulkAction("absent")}>Mark All Absent</Button>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Middle Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Toilet Breaks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const currentBreak = student.toiletBreaks.find((b) => !b.endTime)
                  const absenceCount = getAbsenceCount(student)
                  const tardinessCount = calculateTardiness(student)
                  const rowColor =
                    absenceCount >= 10
                      ? "text-red-600 dark:text-red-400"
                      : absenceCount >= 5
                        ? "text-orange-600 dark:text-orange-400"
                        : ""

                  return (
                    <TableRow key={student.id}>
                      <TableCell className={rowColor}>{student.id}</TableCell>
                      <TableCell className={rowColor}>{student.firstName}</TableCell>
                      <TableCell className={rowColor}>{student.middleName}</TableCell>
                      <TableCell className={rowColor}>{student.lastName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant={
                              student.attendance[student.attendance.length - 1]?.status === "present"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleAttendanceStatus(student, "present")}
                            disabled={loading}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              student.attendance[student.attendance.length - 1]?.status === "late"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleAttendanceStatus(student, "late")}
                            disabled={loading}
                          >
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              student.attendance[student.attendance.length - 1]?.status === "absent"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleAttendanceStatus(student, "absent")}
                            disabled={loading}
                          >
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              student.attendance[student.attendance.length - 1]?.status === "excused"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleAttendanceStatus(student, "excused")}
                            disabled={loading}
                          >
                            Excused
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant={currentBreak ? "default" : "outline"}
                            onClick={() => handleToiletBreak(student)}
                          >
                            <Timer className="h-4 w-4 mr-1" />
                            {currentBreak ? "End Break" : "Toilet Break"}
                          </Button>
                          {currentBreak && <Badge variant="secondary">{formatDuration(currentBreak.duration)}</Badge>}
                          {student.toiletBreaks.length > 0 && <Badge>{student.toiletBreaks.length} breaks</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedStudent(student)}>
                                Add Note
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Note for {student.firstName}</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Note</Label>
                                  <Textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Enter note here..."
                                  />
                                </div>
                              </div>
                              <Button onClick={() => handleAddNote(student)}>Save Note</Button>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className={cn(
                                  "flex items-center",
                                  absenceCount >= 10
                                    ? "text-red-600 dark:text-red-400"
                                    : absenceCount >= 5
                                      ? "text-orange-600 dark:text-orange-400"
                                      : "",
                                )}
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                {absenceCount} absences
                              </DropdownMenuItem>
                              <DropdownMenuItem>{tardinessCount} times late</DropdownMenuItem>
                              {student.attendance[student.attendance.length - 1]?.notes && (
                                <DropdownMenuItem>
                                  Latest Note: {student.attendance[student.attendance.length - 1].notes}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyView weeklyAttendance={weeklyAttendance} students={students} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

