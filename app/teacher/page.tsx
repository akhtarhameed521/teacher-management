"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ClipboardList, MessageSquare, Users, TrendingUp, Clock, Award, GraduationCap } from "lucide-react"
import { LineChart, BarChart } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TeacherTimetable } from "@/components/teacher-timetable"
import { StudentProgressTracker } from "@/components/student-progress-tracker"

const generateMockClasses = () => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Class ${String(i + 1).padStart(2, "0")}`,
    students: Math.floor(Math.random() * 20) + 10,
    attendance: Math.floor(Math.random() * 100),
    nextAssignment: `Assignment ${i + 1}`,
    dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  }))
}

const generateMockStudents = () => {
  const names = ["Fatima", "Ahmed", "Zainab", "Omar", "Aisha", "Yusuf", "Mariam", "Ibrahim"]
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    avatar: `/placeholder.svg?height=32&width=32&text=${names[i % names.length].charAt(0)}`,
    performance: Math.floor(Math.random() * 100),
    attendance: Math.floor(Math.random() * 100),
  }))
}

export default function TeacherDashboard() {
  const [classes] = useState(generateMockClasses())
  const [students] = useState(generateMockStudents())
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Teacher Dashboard</h1>
        <div className="text-right">
          <p className="text-2xl font-bold">{currentTime.toLocaleTimeString()}</p>
          <p className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">1 new class this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <Progress value={95} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 due today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 from parents, 2 from colleagues</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Class Management</TabsTrigger>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { day: "Mon", attendance: 92 },
                    { day: "Tue", attendance: 95 },
                    { day: "Wed", attendance: 90 },
                    { day: "Thu", attendance: 93 },
                    { day: "Fri", attendance: 91 },
                  ]}
                  index="day"
                  categories={["attendance"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={classes.map((cls) => ({ name: cls.name, performance: cls.attendance }))}
                  index="name"
                  categories={["performance"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {classes.map((cls) => (
                    <li key={cls.id} className="flex justify-between items-center">
                      <span>{cls.nextAssignment}</span>
                      <Badge variant="outline">{cls.dueDate}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/teacher/my-timetable">
                  <Button className="w-full">
                    <Clock className="mr-2 h-4 w-4" /> View My Timetable
                  </Button>
                </Link>
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" /> Take Attendance
                </Button>
                <Button className="w-full">
                  <ClipboardList className="mr-2 h-4 w-4" /> Create Lesson Plan
                </Button>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Send Message to Parents
                </Button>
                <Link href="/teacher/professional-development">
                  <Button className="w-full">
                    <GraduationCap className="mr-2 h-4 w-4" /> Professional Development
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Class 03 average score improved by 5%</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span>Replied to 3 parent messages</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Student Ahmed won the science fair</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ClipboardList className="h-4 w-4 text-purple-500" />
                    <span>Submitted weekly report to principal</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Class Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-2">Students: {cls.students}</div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Attendance</span>
                          <span>{cls.attendance}%</span>
                        </div>
                        <Progress value={cls.attendance} className="mt-1" />
                      </div>
                      <div className="mt-2 text-sm">
                        <div>Next Assignment: {cls.nextAssignment}</div>
                        <div>Due Date: {cls.dueDate}</div>
                      </div>
                      <Button className="mt-2 w-full" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {students.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Performance</span>
                            <span>{student.performance}%</span>
                          </div>
                          <Progress value={student.performance} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Attendance</span>
                            <span>{student.attendance}%</span>
                          </div>
                          <Progress value={student.attendance} className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule">
          <TeacherTimetable teacherId={1} />
        </TabsContent>
        <TabsContent value="progress">
          <StudentProgressTracker />
        </TabsContent>
      </Tabs>
    </div>
  )
}

