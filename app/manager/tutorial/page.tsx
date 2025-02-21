import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function TutorialPage() {
  const pages = [
    {
      title: "Manager Dashboard",
      description: "Overview of school performance and key metrics",
      image: "/placeholder.svg?height=400&width=600&text=Manager+Dashboard",
      explanation:
        "The Manager Dashboard provides a comprehensive overview of the school's performance. It displays key metrics such as total teachers, classes, and students, as well as average performance and attendance rates. The dashboard also includes charts for performance overview, class distribution, and recent activities.",
    },
    {
      title: "Teacher Management",
      description: "Manage and monitor teacher performance",
      image: "/placeholder.svg?height=400&width=600&text=Teacher+Management",
      explanation:
        "The Teacher Management page allows administrators to view and manage teacher information. It includes a table of all teachers with details such as name, subject, performance, classes, and students. Administrators can search for specific teachers, add new teachers, and perform actions like viewing details, editing, or deleting teacher records.",
    },
    {
      title: "Class Management",
      description: "Oversee class schedules and performance",
      image: "/placeholder.svg?height=400&width=600&text=Class+Management",
      explanation:
        "The Class Management page provides an overview of all classes in the school. It displays information such as class name, assigned teacher, number of students, and average performance. Administrators can search for specific classes, add new classes, and manage class details.",
    },
    {
      title: "Attendance Tracker",
      description: "Monitor student attendance across classes",
      image: "/placeholder.svg?height=400&width=600&text=Attendance+Tracker",
      explanation:
        "The Attendance Tracker allows managers to monitor student attendance across all classes. It provides options to view attendance by date, class, or individual student. The page includes charts and statistics to visualize attendance trends and identify any issues that need attention.",
    },
    {
      title: "Teacher Dashboard",
      description: "Teacher's personal dashboard with class information",
      image: "/placeholder.svg?height=400&width=600&text=Teacher+Dashboard",
      explanation:
        "The Teacher Dashboard is the main page for teachers when they log in. It displays their personal information, current classes, recent activities, and quick access to important features like taking attendance or creating lesson plans. It also shows performance metrics for their classes.",
    },
    {
      title: "Teacher's Class View",
      description: "Detailed view of a specific class for teachers",
      image: "/placeholder.svg?height=400&width=600&text=Teacher+Class+View",
      explanation:
        "The Teacher's Class View provides detailed information about a specific class. Teachers can view the class roster, manage attendance, input grades, and access lesson plans. This page also displays class performance metrics and allows teachers to communicate with students or parents.",
    },
    {
      title: "Teacher's Attendance Page",
      description: "Page for teachers to manage class attendance",
      image: "/placeholder.svg?height=400&width=600&text=Teacher+Attendance+Page",
      explanation:
        "The Teacher's Attendance Page is where teachers can record and manage attendance for their classes. It provides an interface to mark students as present, absent, or late, and view attendance history. Teachers can also generate attendance reports from this page.",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Portal Tutorial</h1>
      <Tabs defaultValue="manager" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manager">Management Portal</TabsTrigger>
          <TabsTrigger value="teacher">Teacher Portal</TabsTrigger>
        </TabsList>
        <TabsContent value="manager">
          <div className="grid gap-6">
            {pages.slice(0, 4).map((page, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative mb-4">
                    <Image
                      src={page.image || "/placeholder.svg"}
                      alt={page.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{page.explanation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="teacher">
          <div className="grid gap-6">
            {pages.slice(4).map((page, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative mb-4">
                    <Image
                      src={page.image || "/placeholder.svg"}
                      alt={page.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{page.explanation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

