"use client"

import { Toast } from "@/components/ui/toast"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useInfiniteQuery } from "react-query"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import { useHotkeys } from "react-hotkeys-hook"
import { useRouter } from "next/router"
import Link from "next/link"
import { useSocket } from "@/lib/socket"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { MoreHorizontal, Plus, SunMoon, User, LogOut } from "lucide-react"

// Define schemas for our data
const teacherSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  performance: z.number().min(0).max(100),
})

const classSchema = z.object({
  id: z.string(),
  name: z.string(),
  teacher: z.string(),
  students: z.number().int().positive(),
  schedule: z.record(z.string()),
})

const studentSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.number().int().min(1).max(12),
  attendance: z.number().min(0).max(100),
})

type Teacher = z.infer<typeof teacherSchema>
type Class = z.infer<typeof classSchema>
type Student = z.infer<typeof studentSchema>

// Mock data fetching function
const fetchData = async (page: number) => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const itemsPerPage = 20
  const start = page * itemsPerPage
  const end = start + itemsPerPage

  const teachers: Teacher[] = Array.from({ length: itemsPerPage }, (_, i) => ({
    id: `t${start + i + 1}`,
    name: `Teacher ${start + i + 1}`,
    email: `teacher${start + i + 1}@school.com`,
    subject: ["Math", "Science", "English", "History"][Math.floor(Math.random() * 4)],
    performance: Math.floor(Math.random() * 100),
  }))

  const classes: Class[] = Array.from({ length: itemsPerPage }, (_, i) => ({
    id: `c${start + i + 1}`,
    name: `Class ${start + i + 1}`,
    teacher: `Teacher ${Math.floor(Math.random() * 20) + 1}`,
    students: Math.floor(Math.random() * 30) + 10,
    schedule: {
      Monday: "9:00 AM - 10:30 AM",
      Wednesday: "11:00 AM - 12:30 PM",
      Friday: "2:00 PM - 3:30 PM",
    },
  }))

  const students: Student[] = Array.from({ length: itemsPerPage }, (_, i) => ({
    id: `s${start + i + 1}`,
    name: `Student ${start + i + 1}`,
    grade: Math.floor(Math.random() * 12) + 1,
    attendance: Math.floor(Math.random() * 100),
  }))

  return { teachers, classes, students, hasMore: end < 100 } // Assuming a total of 100 items
}

export default function ManagerDashboard() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const { t } = useTranslation()
  const socket = useSocket()
  const router = useRouter()
  const { toast } = useToast()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    "dashboard-data",
    ({ pageParam = 0 }) => fetchData(pageParam),
    {
      getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length : undefined),
    },
  )

  const allTeachers = useMemo(() => data?.pages.flatMap((page) => page.teachers) || [], [data])
  const allClasses = useMemo(() => data?.pages.flatMap((page) => page.classes) || [], [data])
  const allStudents = useMemo(() => data?.pages.flatMap((page) => page.students) || [], [data])

  const [draggedItem, setDraggedItem] = useState(null)

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return

      const items = Array.from(allClasses)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      // Here you would typically update the state or send an API request to update the order
      console.log("New order:", items)
    },
    [allClasses],
  )

  useEffect(() => {
    if (socket) {
      socket.on("data-update", (updatedData) => {
        // Handle real-time updates here
        console.log("Received real-time update:", updatedData)
      })
    }
  }, [socket])

  useHotkeys("ctrl+k", () => setIsCommandPaletteOpen(true))

  const performanceData = useMemo(
    () =>
      allTeachers.map((teacher) => ({
        name: teacher.name,
        performance: teacher.performance,
      })),
    [allTeachers],
  )

  const attendanceData = useMemo(
    () =>
      allStudents.map((student) => ({
        name: student.name,
        attendance: student.attendance,
      })),
    [allStudents],
  )

  const subjectDistribution = useMemo(() => {
    const distribution = allTeachers.reduce((acc, teacher) => {
      acc[teacher.subject] = (acc[teacher.subject] || 0) + 1
      return acc
    }, {})
    return Object.entries(distribution).map(([subject, count]) => ({
      subject,
      count,
    }))
  }, [allTeachers])

  const handleLogout = useCallback(() => {
    // Implement logout logic here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }, [router, toast])

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center bg-primary text-primary-foreground p-4 rounded-lg">
        <h1 className="text-3xl font-bold">ARX Manager Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} variant="outline">
            <SunMoon className="h-4 w-4 mr-2" />
            {t("toggleTheme")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" /> {t("account")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t("accountSettings")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">{t("profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/settings">{t("settings")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="teachers">{t("teachers")}</TabsTrigger>
          <TabsTrigger value="classes">{t("classes")}</TabsTrigger>
          <TabsTrigger value="students">{t("students")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("teacherPerformance")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="performance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("studentAttendance")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("subjectDistribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      dataKey="count"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>{t("teacherList")}</CardTitle>
              <CardDescription>{t("manageTeachers")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Input placeholder={t("searchTeachers")} className="max-w-sm" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addTeacher")}
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("name")}</TableHead>
                      <TableHead>{t("email")}</TableHead>
                      <TableHead>{t("subject")}</TableHead>
                      <TableHead>{t("performance")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>
                          <Progress value={teacher.performance} className="w-[60%]" />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("delete")}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {hasNextPage && (
                  <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? t("loading") : t("loadMore")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>{t("classList")}</CardTitle>
              <CardDescription>{t("manageClasses")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Input placeholder={t("searchClasses")} className="max-w-sm" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addClass")}
                  </Button>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="classes">
                    {(provided) => (
                      <Table {...provided.droppableProps} ref={provided.innerRef}>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("name")}</TableHead>
                            <TableHead>{t("teacher")}</TableHead>
                            <TableHead>{t("students")}</TableHead>
                            <TableHead>{t("actions")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allClasses.map((cls, index) => (
                            <Draggable key={cls.id} draggableId={cls.id} index={index}>
                              {(provided) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TableCell>{cls.name}</TableCell>
                                  <TableCell>{cls.teacher}</TableCell>
                                  <TableCell>{cls.students}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                                        <DropdownMenuItem>{t("delete")}</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      </Table>
                    )}
                  </Droppable>
                </DragDropContext>
                {hasNextPage && (
                  <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? t("loading") : t("loadMore")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>{t("studentList")}</CardTitle>
              <CardDescription>{t("manageStudents")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Input placeholder={t("searchStudents")} className="max-w-sm" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addStudent")}
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("name")}</TableHead>
                      <TableHead>{t("grade")}</TableHead>
                      <TableHead>{t("attendance")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>
                          <Progress value={student.attendance} className="w-[60%]" />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("delete")}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {hasNextPage && (
                  <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? t("loading") : t("loadMore")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CommandDialog open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen}>
        <CommandInput placeholder={t("typeCommand")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          <CommandGroup heading={t("actions")}>
            <CommandItem onSelect={() => setActiveTab("overview")}>{t("goToOverview")}</CommandItem>
            <CommandItem onSelect={() => setActiveTab("teachers")}>{t("manageTeachers")}</CommandItem>
            <CommandItem onSelect={() => setActiveTab("classes")}>{t("manageClasses")}</CommandItem>
            <CommandItem onSelect={() => setActiveTab("students")}>{t("manageStudents")}</CommandItem>
            <CommandItem
              onSelect={() => {
                /*Add your action here*/
              }}
            >
              <Button variant="outline" className="w-full">
                <WhatsAppIntegration />
              </Button>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Toast />
    </div>
  )
}

