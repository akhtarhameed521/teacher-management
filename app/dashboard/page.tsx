"use client"

import { useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Sun,
  Moon,
  User,
  LogOut,
  Plus,
  MoreHorizontal,
  CalendarIcon,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react"

// Dynamically import heavy components
const Map = dynamic(() => import("@/components/Map"), { ssr: false })
const WeatherWidget = dynamic(() => import("@/components/WeatherWidget"), { ssr: false })

// Mock data (in a real app, this would come from an API)
const mockFetchDashboardData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  return {
    performanceData: [
      { name: "Teacher A", performance: 85 },
      { name: "Teacher B", performance: 92 },
      { name: "Teacher C", performance: 78 },
      { name: "Teacher D", performance: 95 },
      { name: "Teacher E", performance: 88 },
    ],
    attendanceData: [
      { name: "Mon", attendance: 92 },
      { name: "Tue", attendance: 88 },
      { name: "Wed", attendance: 95 },
      { name: "Thu", attendance: 90 },
      { name: "Fri", attendance: 93 },
    ],
    subjectDistribution: [
      { subject: "Math", value: 30 },
      { subject: "Science", value: 25 },
      { subject: "English", value: 20 },
      { subject: "History", value: 15 },
      { subject: "Art", value: 10 },
    ],
    teachers: [
      { id: 1, name: "John Doe", subject: "Mathematics", performance: 92, avatar: "/avatars/john-doe.jpg" },
      { id: 2, name: "Jane Smith", subject: "Science", performance: 88, avatar: "/avatars/jane-smith.jpg" },
      { id: 3, name: "Bob Johnson", subject: "English", performance: 95, avatar: "/avatars/bob-johnson.jpg" },
    ],
    classes: [
      { id: 1, name: "Class A", teacher: "John Doe", students: 25, performance: 88 },
      { id: 2, name: "Class B", teacher: "Jane Smith", students: 22, performance: 92 },
      { id: 3, name: "Class C", teacher: "Bob Johnson", students: 28, performance: 85 },
    ],
    students: [
      { id: 1, name: "Alice Brown", grade: 10, attendance: 95, performance: 88 },
      { id: 2, name: "Charlie Davis", grade: 11, attendance: 92, performance: 90 },
      { id: 3, name: "Eva White", grade: 9, attendance: 88, performance: 85 },
    ],
    recentActivities: [
      { id: 1, user: "John Doe", action: "Submitted grades for Class A", timestamp: "2023-06-15T10:30:00Z" },
      { id: 2, user: "Jane Smith", action: "Created a new assignment", timestamp: "2023-06-15T11:45:00Z" },
      { id: 3, user: "Bob Johnson", action: "Marked attendance for Class C", timestamp: "2023-06-15T09:15:00Z" },
    ],
    upcomingEvents: [
      { id: 1, title: "Parent-Teacher Meeting", date: "2023-06-20T15:00:00Z" },
      { id: 2, title: "Science Fair", date: "2023-06-25T09:00:00Z" },
      { id: 3, title: "End of Term Exams", date: "2023-06-30T08:00:00Z" },
    ],
    schoolPerformance: [
      { month: "Jan", performance: 82 },
      { month: "Feb", performance: 85 },
      { month: "Mar", performance: 88 },
      { month: "Apr", performance: 87 },
      { month: "May", performance: 90 },
      { month: "Jun", performance: 91 },
    ],
    resourceUtilization: [
      { resource: "Classrooms", utilization: 85 },
      { resource: "Labs", utilization: 70 },
      { resource: "Library", utilization: 60 },
      { resource: "Sports Facilities", utilization: 75 },
      { resource: "Computers", utilization: 90 },
    ],
  }
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [date, setDate] = useState<Date | undefined>(new Date())

  const { data, isLoading, error } = useQuery("dashboardData", mockFetchDashboardData)

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  const chartAnimationProps = useMemo(
    () => ({
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
    }),
    [],
  )

  if (isLoading) return <DashboardSkeleton />
  if (error) return <DashboardError />

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">ARX Manager Dashboard</h1>
        <div className="flex items-center space-x-4">
          <WeatherWidget />
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/account")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/account/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="resources" className="hidden lg:block">
            Resources
          </TabsTrigger>
          <TabsTrigger value="reports" className="hidden lg:block">
            Reports
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStatsCard icon={Users} title="Total Teachers" value={data.teachers.length} trend={5} />
                <QuickStatsCard icon={BookOpen} title="Total Classes" value={data.classes.length} trend={2} />
                <QuickStatsCard icon={Users} title="Total Students" value={data.students.length} trend={8} />
                <QuickStatsCard
                  icon={CheckCircle}
                  title="Avg. Attendance"
                  value={`${calculateAverage(data.attendanceData)}%`}
                  trend={3}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>School Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div {...chartAnimationProps}>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.schoolPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="performance" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div {...chartAnimationProps}>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart outerRadius={90} data={data.resourceUtilization}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="resource" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Utilization"
                            dataKey="utilization"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {data.recentActivities.map((activity, index) => (
                        <div key={activity.id} className="flex items-center space-x-4 mb-4">
                          <Avatar>
                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{activity.user}</p>
                            <p className="text-sm text-muted-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    <ScrollArea className="h-[200px] mt-4">
                      {data.upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center space-x-4 mb-4">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="teachers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div {...chartAnimationProps}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="performance" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Teachers List</CardTitle>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Teacher
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar>
                                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                                <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{teacher.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell>
                            <Progress value={teacher.performance} className="w-[60%]" />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Classes Overview</CardTitle>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.classes.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell>{cls.teacher}</TableCell>
                          <TableCell>{cls.students}</TableCell>
                          <TableCell>
                            <Progress value={cls.performance} className="w-[60%]" />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Class Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div {...chartAnimationProps}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.subjectDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.subjectDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div {...chartAnimationProps}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="attendance" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Students List</CardTitle>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>
                            <Progress value={student.attendance} className="w-[60%]" />
                          </TableCell>
                          <TableCell>
                            <Progress value={student.performance} className="w-[60%]" />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div {...chartAnimationProps}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.resourceUtilization}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="resource" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="utilization" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resource Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.resourceUtilization.map((resource) => (
                        <TableRow key={resource.resource}>
                          <TableCell className="font-medium">{resource.resource}</TableCell>
                          <TableCell>100</TableCell>
                          <TableCell>{100 - resource.utilization}</TableCell>
                          <TableCell>
                            <Progress value={resource.utilization} className="w-[60%]" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Teacher Performance Report
                    </Button>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Student Attendance Report
                    </Button>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Resource Utilization Report
                    </Button>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Class Performance Report
                    </Button>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Financial Report
                    </Button>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Custom Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Generated On</TableHead>
                        <TableHead>Generated By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Teacher Performance Q2 2023</TableCell>
                        <TableCell>2023-06-30</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Student Attendance May 2023</TableCell>
                        <TableCell>2023-06-01</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Resource Utilization H1 2023</TableCell>
                        <TableCell>2023-07-01</TableCell>
                        <TableCell>Bob Johnson</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

function QuickStatsCard({ icon: Icon, title, value, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 inline mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 inline mr-1" />
          )}
          {Math.abs(trend)}% from last month
        </p>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

function DashboardError() {
  return (
    <div className="container mx-auto p-4 text-center">
      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
      <p className="text-muted-foreground mb-4">
        There was a problem loading the dashboard data. Please try again later.
      </p>
      <Button onClick={() => window.location.reload()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  )
}

function calculateAverage(data) {
  return (data.reduce((sum, item) => sum + item.attendance, 0) / data.length).toFixed(1)
}

