"use client"

import { useState } from "react"
import { format, subMonths, subYears } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import {
  CalendarIcon,
  Download,
  Printer,
  SlidersHorizontal,
  AlertTriangle,
  Maximize2,
  Minimize2,
  TrendingUp,
  Users,
  Award,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

// Mock data generation functions
const generateMockPerformanceData = () => {
  const classes = ["10A", "10B", "11A", "11B", "12A", "12B"]
  return classes.map((className) => ({
    class: className,
    averageScore: Math.floor(Math.random() * 50) + 120,
    studentCount: Math.floor(Math.random() * 20) + 20,
    passRate: Math.floor(Math.random() * 30) + 70,
  }))
}

const generateMockAttendanceData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      month: format(date, "MMM"),
      attendance: Math.floor(Math.random() * 10) + 90,
    }
  }).reverse()
}

const generateMockStudentProgressData = () => {
  const saudiMaleNames = [
    "Abdullah",
    "Mohammed",
    "Ahmed",
    "Ali",
    "Omar",
    "Khalid",
    "Fahad",
    "Saud",
    "Salman",
    "Faisal",
    "Majid",
    "Nasser",
    "Saad",
    "Turki",
    "Waleed",
    "Yasser",
    "Ziyad",
    "Bandar",
    "Hamad",
    "Ibrahim",
  ]
  return Array.from({ length: 20 }, (_, i) => ({
    name: saudiMaleNames[i],
    initialScore: Math.floor(Math.random() * 50) + 100,
    currentScore: Math.floor(Math.random() * 50) + 120,
    targetScore: Math.floor(Math.random() * 20) + 150,
    improvement: Math.floor(Math.random() * 20) + 1,
    attendance: Math.floor(Math.random() * 20) + 80,
    warningLevel: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
  }))
}

const generateMockTeacherPerformanceData = () => {
  const teacherNames = [
    "Dr. Al-Mansour",
    "Prof. Al-Rashid",
    "Mr. Al-Saud",
    "Ms. Al-Farhan",
    "Mrs. Al-Qhtani",
    "Dr. Al-Ghamdi",
    "Mr. Al-Shammari",
    "Ms. Al-Mutairi",
    "Prof. Al-Harbi",
    "Mrs. Al-Dossari",
  ]
  return teacherNames.map((name) => ({
    name,
    classesTaught: Math.floor(Math.random() * 3) + 1,
    averageStudentScore: Math.floor(Math.random() * 50) + 120,
    studentSatisfaction: Math.floor(Math.random() * 30) + 70,
    classesPerWeek: Math.floor(Math.random() * 10) + 15,
  }))
}

const generateMockResourceUtilizationData = () => {
  const resources = ["Classrooms", "Computers", "Science Labs", "Library", "Sports Equipment"]
  return resources.map((resource) => ({
    resource,
    utilization: Math.floor(Math.random() * 40) + 60,
    efficiency: Math.floor(Math.random() * 30) + 70,
  }))
}

const generateMockFinancialData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      month: format(date, "MMM"),
      income: Math.floor(Math.random() * 50000) + 100000,
      expenses: Math.floor(Math.random() * 40000) + 80000,
    }
  }).reverse()
}

const generateMockSubjectPerformanceData = () => {
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Arabic"]
  return subjects.map((subject) => ({
    subject,
    averageScore: Math.floor(Math.random() * 50) + 120,
    passRate: Math.floor(Math.random() * 30) + 70,
  }))
}

const generateMockYearlyTrendData = () => {
  return Array.from({ length: 5 }, (_, i) => {
    const year = subYears(new Date(), 4 - i).getFullYear()
    return {
      year,
      averageScore: Math.floor(Math.random() * 30) + 130,
      passRate: Math.floor(Math.random() * 20) + 75,
    }
  })
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  })

  const performanceData = generateMockPerformanceData()
  const attendanceData = generateMockAttendanceData()
  const studentProgressData = generateMockStudentProgressData()
  const teacherPerformanceData = generateMockTeacherPerformanceData()
  const resourceUtilizationData = generateMockResourceUtilizationData()
  const financialData = generateMockFinancialData()
  const subjectPerformanceData = generateMockSubjectPerformanceData()
  const yearlyTrendData = generateMockYearlyTrendData()

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Alert className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <AlertTitle className="text-lg font-bold">FET Exam Analytics Dashboard</AlertTitle>
          <AlertDescription>Comprehensive analysis and insights for improved educational outcomes</AlertDescription>
        </Alert>
      </motion.div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manager Reports</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white dark:bg-gray-800">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average FET Score"
          value={`${yearlyTrendData[yearlyTrendData.length - 1].averageScore}/170`}
          change="+3.5%"
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Overall Pass Rate"
          value={`${yearlyTrendData[yearlyTrendData.length - 1].passRate}%`}
          change="+2.1%"
          icon={<Award className="h-4 w-4 text-yellow-500" />}
        />
        <MetricCard
          title="Total Students"
          value={performanceData.reduce((acc, curr) => acc + curr.studentCount, 0).toString()}
          change="+50"
          icon={<Users className="h-4 w-4 text-blue-500" />}
        />
        <MetricCard
          title="Subjects Offered"
          value={subjectPerformanceData.length.toString()}
          change="No change"
          icon={<BookOpen className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-white dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection
            yearlyTrendData={yearlyTrendData}
            subjectPerformanceData={subjectPerformanceData}
            attendanceData={attendanceData}
          />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceSection performanceData={performanceData} studentProgressData={studentProgressData} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceSection
            attendanceData={attendanceData}
            studentProgressData={studentProgressData}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </TabsContent>

        <TabsContent value="teachers">
          <TeachersSection teacherPerformanceData={teacherPerformanceData} />
        </TabsContent>

        <TabsContent value="resources">
          <ResourcesSection resourceUtilizationData={resourceUtilizationData} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialSection financialData={financialData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OverviewSection({ yearlyTrendData, subjectPerformanceData, attendanceData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ExpandableChart
          title="FET Exam Performance Trend"
          chart={
            <LineChart
              data={yearlyTrendData}
              index="year"
              categories={["averageScore", "passRate"]}
              colors={["blue", "green"]}
              valueFormatter={(value) => `${value}`}
              className="h-[300px]"
              yAxisWidth={40}
              customTooltip={(props) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-bold">Year: {props.payload.year}</div>
                        <div>Average Score: {props.payload.averageScore}/170</div>
                        <div>Pass Rate: {props.payload.passRate}%</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          }
        />
        <ExpandableChart
          title="Subject Performance Overview"
          chart={
            <BarChart
              data={subjectPerformanceData}
              index="subject"
              categories={["averageScore", "passRate"]}
              colors={["blue", "green"]}
              valueFormatter={(value, category) => (category === "averageScore" ? `${value}/170` : `${value}%`)}
              className="h-[300px]"
              yAxisWidth={48}
              customTooltip={(props) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-bold">{props.payload.subject}</div>
                        <div>Average Score: {props.payload.averageScore}/170</div>
                        <div>Pass Rate: {props.payload.passRate}%</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          }
        />
      </div>
      <ExpandableChart
        title="Monthly Attendance Trend"
        chart={
          <LineChart
            data={attendanceData}
            index="month"
            categories={["attendance"]}
            colors={["blue"]}
            valueFormatter={(value) => `${value}%`}
            className="h-[300px]"
            yAxisWidth={48}
            customTooltip={(props) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-bold">{props.payload.month}</div>
                      <div>Attendance: {props.payload.attendance}%</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          />
        }
      />
    </motion.div>
  )
}

function PerformanceSection({ performanceData, studentProgressData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">FET Exam Performance Analysis</CardTitle>
          <CardDescription>Detailed breakdown of student performance across classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {performanceData.map((classData) => (
                    <SelectItem key={classData.class} value={classData.class}>
                      Class {classData.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
            <ExpandableChart
              title="FET Exam Performance by Class"
              chart={
                <BarChart
                  data={performanceData}
                  index="class"
                  categories={["averageScore", "passRate"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value, category) => (category === "averageScore" ? `${value}/170` : `${value}%`)}
                  className="h-[300px]"
                  yAxisWidth={48}
                  customTooltip={(props) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-bold">Class {props.payload.class}</div>
                            <div>Average Score: {props.payload.averageScore}/170</div>
                            <div>Pass Rate: {props.payload.passRate}%</div>
                            <div>Students: {props.payload.studentCount}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                />
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Student Progress Tracker</CardTitle>
          <CardDescription>Monitoring individual student improvement and targets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Initial Score</TableHead>
                <TableHead>Current Score</TableHead>
                <TableHead>Target Score</TableHead>
                <TableHead>Improvement</TableHead>
                <TableHead>Progress to Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProgressData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.initialScore}/170</TableCell>
                  <TableCell>{student.currentScore}/170</TableCell>
                  <TableCell>{student.targetScore}/170</TableCell>
                  <TableCell>
                    <Badge variant={student.improvement > 10 ? "success" : "default"}>+{student.improvement}</Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={(student.currentScore / student.targetScore) * 100} className="w-[60px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AttendanceSection({ attendanceData, studentProgressData, dateRange, setDateRange }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Attendance Overview</CardTitle>
          <CardDescription>School-wide attendance trends and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <ExpandableChart
              title="Attendance Trend"
              chart={
                <LineChart
                  data={attendanceData}
                  index="month"
                  categories={["attendance"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[300px]"
                  yAxisWidth={48}
                  customTooltip={(props) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-bold">{props.payload.month}</div>
                            <div>Attendance: {props.payload.attendance}%</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                />
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Students with Low Attendance</CardTitle>
          <CardDescription>Students with attendance below 90%</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Warning Level</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProgressData
                .filter((student) => student.attendance < 90)
                .map((student, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{student.attendance}%</Badge>
                    </TableCell>
                    <TableCell>{student.warningLevel}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Warning level ${student.warningLevel + 1} issued to ${student.name}`)}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Issue Warning {student.warningLevel + 1}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TeachersSection({ teacherPerformanceData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Teacher Performance Evaluation</CardTitle>
          <CardDescription>Comprehensive analysis of teacher effectiveness in FET exam preparation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="social">Social Studies</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Classes Taught</TableHead>
                  <TableHead>Avg. Student FET Score</TableHead>
                  <TableHead>Student Satisfaction</TableHead>
                  <TableHead>Classes per Week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherPerformanceData.map((teacher, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.classesTaught}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress value={(teacher.averageStudentScore / 170) * 100} className="w-[60px] mr-2" />
                        {teacher.averageStudentScore}/170
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress value={teacher.studentSatisfaction} className="w-[60px] mr-2" />
                        {teacher.studentSatisfaction}%
                      </div>
                    </TableCell>
                    <TableCell>{teacher.classesPerWeek}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpandableChart
          title="Teacher Workload Distribution"
          chart={
            <BarChart
              data={teacherPerformanceData}
              index="name"
              categories={["classesPerWeek"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} classes`}
              className="h-[300px]"
              yAxisWidth={48}
              customTooltip={(props) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-bold">{props.payload.name}</div>
                        <div>Classes per Week: {props.payload.classesPerWeek}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          }
        />
        <ExpandableChart
          title="Average FET Scores by Teacher"
          chart={
            <BarChart
              data={teacherPerformanceData}
              index="name"
              categories={["averageStudentScore"]}
              colors={["green"]}
              valueFormatter={(value) => `${value}/170`}
              className="h-[300px]"
              yAxisWidth={48}
              customTooltip={(props) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-bold">{props.payload.name}</div>
                        <div>Average Student Score: {props.payload.averageStudentScore}/170</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          }
        />
      </div>
    </motion.div>
  )
}

function ResourcesSection({ resourceUtilizationData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Resource Utilization Analysis</CardTitle>
          <CardDescription>Overview of school resource usage and efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ExpandableChart
              title="Resource Utilization and Efficiency"
              chart={
                <BarChart
                  data={resourceUtilizationData}
                  index="resource"
                  categories={["utilization", "efficiency"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[300px]"
                  yAxisWidth={48}
                  customTooltip={(props) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-bold">{props.payload.resource}</div>
                            <div>Utilization: {props.payload.utilization}%</div>
                            <div>Efficiency: {props.payload.efficiency}%</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                />
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Resource Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Scheduled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceUtilizationData.map((resource, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{resource.resource}</TableCell>
                  <TableCell>
                    {format(
                      new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                      "MMM d, yyyy",
                    )}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                      "MMM d, yyyy",
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={Math.random() > 0.5 ? "success" : "warning"}>
                      {Math.random() > 0.5 ? "Good" : "Needs Attention"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FinancialSection({ financialData }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Financial Overview</CardTitle>
          <CardDescription>School budget and expenditure analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select defaultValue="year">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Yearly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
            <ExpandableChart
              title="Income vs Expenses"
              chart={
                <LineChart
                  data={financialData}
                  index="month"
                  categories={["income", "expenses"]}
                  colors={["green", "red"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                  className="h-[300px]"
                  yAxisWidth={80}
                  customTooltip={(props) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-bold">{props.payload.month}</div>
                            <div>Income: ${props.payload.income.toLocaleString()}</div>
                            <div>Expenses: ${props.payload.expenses.toLocaleString()}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                />
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ExpandableChart
          title="Budget Allocation"
          chart={
            <PieChart
              data={[
                { category: "Staff Salaries", value: 60 },
                { category: "Facilities", value: 15 },
                { category: "Educational Resources", value: 10 },
                { category: "Technology", value: 8 },
                { category: "Extracurricular", value: 7 },
              ]}
              category="value"
              index="category"
              valueFormatter={(value) => `${value}%`}
              colors={["sky", "blue", "indigo", "violet", "purple"]}
              className="h-[300px]"
              customTooltip={(props) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-bold">{props.payload.category}</div>
                        <div>Allocation: {props.payload.value}%</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          }
        />
        <ExpandableChart
          title="Revenue Sources"
          chart={
            <PieChart
              data={[
                { source: "Tuition Fees", value: 70 },
                { source: "Government Funding", value: 20 },
                { source: "Donations", value: 5 },
                { source: "Fundraising", value: 5 },
              ]}
              category="value"
              index="source"
              valueFormatter={(value) => `${value}%`}
              colors={["sky", "blue", "indigo", "violet"]}
              className="h-[300px]"
              customTooltip={(props) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-bold">{props.payload.source}</div>
                        <div>Percentage: {props.payload.value}%</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            />
          }
        />
      </div>
    </motion.div>
  )
}

function MetricCard({ title, value, change, icon }) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change} from last period</p>
        <Progress value={Number.parseFloat(value)} className="mt-2" />
      </CardContent>
    </Card>
  )
}

function ExpandableChart({ title, chart }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <>
                  <Minimize2 className="mr-2 h-4 w-4" />
                  Collapse
                </>
              ) : (
                <>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Expand
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full w-[90vw] h-[90vh]">
            <div className="w-full h-full">{chart}</div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  )
}

