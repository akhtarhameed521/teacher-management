"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { PieChart } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  CalendarIcon,
  Clock,
  Search,
  Download,
  Printer,
  RefreshCw,
  MoreHorizontal,
  Plus,
  ChevronRight,
} from "lucide-react"
import { TeacherTimetable } from "@/components/teacher-timetable"
import { PerformanceChart } from "@/components/performance-chart"
import { AttendanceTracker } from "@/components/attendance-tracker"
import { AdvancedAnalytics } from "@/components/advanced-analytics"

// Mock data generation functions
const generateMockTeachers = () => {
  const subjects = ["Mathematics", "Science", "English", "History", "Art"]
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Teacher ${i + 1}`,
    subject: subjects[i % subjects.length],
    performance: Math.floor(Math.random() * 30) + 70,
    classes: Math.floor(Math.random() * 3) + 2,
    students: Math.floor(Math.random() * 50) + 50,
    avatar: `/placeholder.svg?height=40&width=40&text=${String.fromCharCode(65 + i)}`,
  }))
}

const generateMockClasses = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Class ${String(i + 1).padStart(2, "0")}`,
    teacher: `Teacher ${Math.floor(Math.random() * 20) + 1}`,
    students: Math.floor(Math.random() * 20) + 15,
    averagePerformance: Math.floor(Math.random() * 30) + 70,
  }))
}

const generateMockStudents = () => {
  const grades = [9, 10, 11, 12]
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    grade: grades[i % grades.length],
    performance: Math.floor(Math.random() * 30) + 70,
    attendance: Math.floor(Math.random() * 20) + 80,
    avatar: `/placeholder.svg?height=32&width=32&text=${String.fromCharCode(65 + (i % 26))}`,
  }))
}

export default function ManagerDashboard() {
  const [teachers] = useState(generateMockTeachers())
  const [classes] = useState(generateMockClasses())
  const [students] = useState(generateMockStudents())
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const overallStats = useMemo(() => {
    return {
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalStudents: students.length,
      averagePerformance: Math.round(students.reduce((sum, student) => sum + student.performance, 0) / students.length),
      averageAttendance: Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length),
    }
  }, [teachers, classes, students])

  const performanceData = useMemo(() => {
    return teachers.map((teacher) => ({
      name: teacher.name,
      performance: teacher.performance,
    }))
  }, [teachers])

  const classDistributionData = useMemo(() => {
    const distribution = classes.reduce((acc, cls) => {
      acc[cls.teacher] = (acc[cls.teacher] || 0) + 1
      return acc
    }, {})
    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  }, [classes])

  const studentGradeDistribution = useMemo(() => {
    const distribution = students.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1
      return acc
    }, {})
    return Object.entries(distribution).map(([name, value]) => ({ name: `Grade ${name}`, value }))
  }, [students])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "The dashboard data has been updated.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Management Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", { "animate-spin": isLoading })} />
            Refresh Data
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast({ title: "Downloading report...", description: "Your report will be ready soon." })
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">+3 from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+15 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averagePerformance}%</div>
            <Progress value={overallStats.averagePerformance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="assign-cover">Assign Cover</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PerformanceChart teachers={teachers} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Class Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={classDistributionData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value} classes`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/placeholder.svg?height=36&width=36&text=${i + 1}`} alt="Avatar" />
                          <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Olivia Martin</p>
                          <p className="text-sm text-muted-foreground">
                            {i % 2 === 0 ? "Uploaded a new assignment" : "Graded student submissions"}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), "MMM dd, yyyy")}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={studentGradeDistribution}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value} students`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Management</CardTitle>
              <CardDescription>Manage and monitor teacher performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search teachers..." className="w-[300px]" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Teacher
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                          </Avatar>
                          {teacher.name}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={teacher.performance} className="w-[60px] mr-2" />
                          {teacher.performance}%
                        </div>
                      </TableCell>
                      <TableCell>{teacher.classes}</TableCell>
                      <TableCell>{teacher.students}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>Manage and monitor class performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search classes..." className="w-[300px]" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Class
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Average Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.teacher}</TableCell>
                      <TableCell>{cls.students}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={cls.averagePerformance} className="w-[60px] mr-2" />
                          {cls.averagePerformance}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>Manage and monitor student performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search students..." className="w-[300px]" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                          </Avatar>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={student.performance} className="w-[60px] mr-2" />
                          {student.performance}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={student.attendance} className="w-[60px] mr-2" />
                          {student.attendance}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <AttendanceTracker isManagerView={true} />
        </TabsContent>
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Schedules</CardTitle>
              <CardDescription>View and manage teacher timetables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Select
                  onValueChange={(value) => setSelectedTeacher(teachers.find((t) => t.id === Number.parseInt(value)))}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {selectedTeacher ? (
                <TeacherTimetable teacherId={selectedTeacher.id} />
              ) : (
                <div className="text-center py-10">
                  <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Teacher Selected</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Please select a teacher to view their schedule.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <AdvancedAnalytics teachers={teachers} classes={classes} students={students} />
        </TabsContent>
        <TabsContent value="assign-cover">
          <p>Assign Cover Content</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

