"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { classData } from "@/lib/class-data"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, BookOpen, Users, CheckCircle, Briefcase } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const teacherName = user?.name || ""

  const teacherClasses = classData.filter((cls) => cls.englishInstructor === teacherName || cls.senior === teacherName)

  const totalClasses = teacherClasses.length
  const uniqueLevels = new Set(teacherClasses.map((cls) => cls.level)).size
  const uniqueCohorts = new Set(teacherClasses.map((cls) => cls.cohort)).size

  // Mock data for cover assignments and attendance
  const coverAssignments = [
    { id: 1, class: "FND-03", date: "2026-06-20", time: "09:00 - 10:30" },
    { id: 2, class: "FND-05", date: "2026-06-22", time: "11:00 - 12:30" },
  ]

  const attendanceData = [
    { id: 1, name: "Ahmed Ali", present: true, avatar: "/placeholder.svg?height=40&width=40&text=AA" },
    { id: 2, name: "Mohammed Hassan", present: false, avatar: "/placeholder.svg?height=40&width=40&text=MH" },
    { id: 3, name: "Yusuf Ibrahim", present: true, avatar: "/placeholder.svg?height=40&width=40&text=YI" },
    { id: 4, name: "Omar Khalid", present: true, avatar: "/placeholder.svg?height=40&width=40&text=OK" },
    { id: 5, name: "Ali Mahmoud", present: false, avatar: "/placeholder.svg?height=40&width=40&text=AM" },
    { id: 6, name: "Hassan Nasser", present: true, avatar: "/placeholder.svg?height=40&width=40&text=HN" },
    { id: 7, name: "Karim Samir", present: true, avatar: "/placeholder.svg?height=40&width=40&text=KS" },
    { id: 8, name: "Tariq Ziad", present: false, avatar: "/placeholder.svg?height=40&width=40&text=TZ" },
    { id: 9, name: "Jane Doe", present: true, avatar: "/placeholder.svg?height=40&width=40&text=JD" },
    { id: 10, name: "John Smith", present: false, avatar: "/placeholder.svg?height=40&width=40&text=JS" },
    { id: 11, name: "Peter Jones", present: true, avatar: "/placeholder.svg?height=40&width=40&text=PJ" },
    { id: 12, name: "Sarah Williams", present: false, avatar: "/placeholder.svg?height=40&width=40&text=SW" },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Levels</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueLevels}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Cohorts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCohorts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cover Assignments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coverAssignments.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Cover Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {coverAssignments.length > 0 ? (
              <ul className="space-y-2">
                {coverAssignments.map((assignment) => (
                  <li key={assignment.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{assignment.class}</p>
                      <p className="text-sm text-muted-foreground">{assignment.date}</p>
                    </div>
                    <Badge>{assignment.time}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming cover assignments.</p>
            )}
            <Button className="w-full mt-4" asChild>
              <Link href="/teacher/cover-assignments">View All Cover Assignments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attendanceData.map((student) => (
                  <div key={student.id} className="flex items-center space-x-4 p-2 rounded-lg bg-secondary">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <Badge variant={student.present ? "success" : "destructive"}>
                          {student.present ? "Present" : "Absent"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button className="w-full mt-4" asChild>
              <Link href="/teacher/attendance">Manage Attendance</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/teacher/my-timetable">
                <CalendarIcon className="mr-2 h-4 w-4" />
                View Timetable
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/teacher/attendance">
                <CheckCircle className="mr-2 h-4 w-4" />
                Take Attendance
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/teacher/classes">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Classes
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/teacher/cover-assignments">
                <Briefcase className="mr-2 h-4 w-4" />
                Cover Assignments
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <WhatsAppIntegration />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

