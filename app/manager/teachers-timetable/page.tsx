"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  CalendarIcon,
  ChevronRight,
  Search,
  Download,
  Printer,
  RefreshCw,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type TeacherSchedule = {
  id: number
  name: string
  subject: string
  schedule: {
    [day: string]: {
      [period: string]: string
    }
  }
  workload: number
  avatar: string
  email: string
  phone: string
  department: string
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const periods = ["1", "2", "3", "4", "5", "6"]

const mockTeachers: TeacherSchedule[] = [
  {
    id: 1,
    name: "John Doe",
    subject: "Mathematics",
    schedule: {
      Monday: { "1": "Math 101", "2": "Math 202", "3": "Break", "4": "Math 101", "5": "Free", "6": "Math 303" },
      Tuesday: { "1": "Math 202", "2": "Math 101", "3": "Math 303", "4": "Break", "5": "Math 101", "6": "Free" },
      Wednesday: { "1": "Math 303", "2": "Break", "3": "Math 101", "4": "Math 202", "5": "Math 101", "6": "Free" },
      Thursday: { "1": "Math 101", "2": "Math 303", "3": "Math 202", "4": "Break", "5": "Free", "6": "Math 101" },
      Friday: { "1": "Math 202", "2": "Math 101", "3": "Free", "4": "Math 303", "5": "Break", "6": "Math 101" },
    },
    workload: 25,
    avatar: "/placeholder.svg?height=40&width=40",
    email: "john.doe@school.com",
    phone: "+1234567890",
    department: "Science and Mathematics",
  },
  {
    id: 2,
    name: "Jane Smith",
    subject: "Science",
    schedule: {
      Monday: {
        "1": "Science 101",
        "2": "Break",
        "3": "Science 202",
        "4": "Science 101",
        "5": "Free",
        "6": "Science 303",
      },
      Tuesday: {
        "1": "Science 202",
        "2": "Science 101",
        "3": "Break",
        "4": "Science 303",
        "5": "Science 101",
        "6": "Free",
      },
      Wednesday: {
        "1": "Science 303",
        "2": "Science 101",
        "3": "Break",
        "4": "Science 202",
        "5": "Free",
        "6": "Science 101",
      },
      Thursday: {
        "1": "Science 101",
        "2": "Science 303",
        "3": "Break",
        "4": "Science 202",
        "5": "Science 101",
        "6": "Free",
      },
      Friday: {
        "1": "Science 202",
        "2": "Break",
        "3": "Science 101",
        "4": "Science 303",
        "5": "Free",
        "6": "Science 101",
      },
    },
    workload: 23,
    avatar: "/placeholder.svg?height=40&width=40",
    email: "jane.smith@school.com",
    phone: "+1987654321",
    department: "Science and Mathematics",
  },
]

export default function ManagerTeachersTimetablePage() {
  const [teachers, setTeachers] = useState<TeacherSchedule[]>(mockTeachers)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherSchedule | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("timetable")
  const [showWeekend, setShowWeekend] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const { toast } = useToast()

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [teachers, searchTerm])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "The timetable data has been updated.",
        duration: 3000,
      })
    }, 1000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implement CSV download logic here
    toast({
      title: "Download Started",
      description: "Your CSV file is being generated and will download shortly.",
      duration: 3000,
    })
  }

  const workloadData = useMemo(() => {
    return teachers.map((teacher) => ({
      name: teacher.name,
      workload: teacher.workload,
    }))
  }, [teachers])

  const departmentData = useMemo(() => {
    const departments: { [key: string]: number } = {}
    teachers.forEach((teacher) => {
      departments[teacher.department] = (departments[teacher.department] || 0) + 1
    })
    return Object.entries(departments).map(([name, value]) => ({ name, value }))
  }, [teachers])

  useEffect(() => {
    if (filteredTeachers.length > 0 && !selectedTeacher) {
      setSelectedTeacher(filteredTeachers[0])
    }
  }, [filteredTeachers, selectedTeacher])

  const getClassColor = (className: string) => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
    ]
    const hash = className.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0)
    return colors[hash % colors.length]
  }

  const renderTimetable = () => {
    if (!selectedTeacher) return null

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background">Period</TableHead>
              {daysOfWeek.map((day) => (
                <TableHead key={day}>{day}</TableHead>
              ))}
              {showWeekend && (
                <>
                  <TableHead>Saturday</TableHead>
                  <TableHead>Sunday</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period) => (
              <TableRow key={period}>
                <TableCell className="sticky left-0 bg-background font-medium">{period}</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day}>
                    {selectedTeacher.schedule[day]?.[period] ? (
                      <Badge className={cn("font-normal", getClassColor(selectedTeacher.schedule[day][period]))}>
                        {selectedTeacher.schedule[day][period]}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                ))}
                {showWeekend && (
                  <>
                    <TableCell>
                      <span className="text-muted-foreground">N/A</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">N/A</span>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderCalendarView = () => {
    if (!selectedTeacher || !selectedDate) return null

    const daySchedule = selectedTeacher.schedule[format(selectedDate, "EEEE")]

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Schedule for {format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period}>
                  <TableCell>{period}</TableCell>
                  <TableCell>
                    {daySchedule?.[period] ? (
                      <Badge className={cn("font-normal", getClassColor(daySchedule[period]))}>
                        {daySchedule[period]}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>{`${8 + Number.parseInt(period)}:00 - ${9 + Number.parseInt(period)}:00`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Management: Teachers Timetable</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage and view teacher timetables (Management View)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", { "animate-spin": isLoading })} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Teacher List</CardTitle>
            <CardDescription>Select a teacher to view their timetable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="view-mode">View Mode</Label>
              <Select value={viewMode} onValueChange={(value: "list" | "grid") => setViewMode(value)}>
                <SelectTrigger id="view-mode">
                  <SelectValue placeholder="Select view mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[300px] mt-4">
              {viewMode === "list" ? (
                <ul className="space-y-2">
                  {filteredTeachers.map((teacher) => (
                    <li
                      key={teacher.id}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-accent",
                        selectedTeacher?.id === teacher.id && "bg-accent",
                      )}
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filteredTeachers.map((teacher) => (
                    <Card
                      key={teacher.id}
                      className={cn(
                        "cursor-pointer hover:bg-accent",
                        selectedTeacher?.id === teacher.id && "bg-accent",
                      )}
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="h-12 w-12 mb-2">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Timetable View</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timetable">Timetable</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="workload">Workload</TabsTrigger>
              </TabsList>
              <TabsContent value="timetable">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="show-weekend" checked={showWeekend} onCheckedChange={setShowWeekend} />
                    <Label htmlFor="show-weekend">Show Weekend</Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle to show or hide weekend days in the timetable</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {selectedTeacher ? (
                  renderTimetable()
                ) : (
                  <div className="text-center py-10">
                    <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">Please select a teacher to view their timetable.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="calendar">
                <div className="flex flex-col items-center space-y-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  {selectedTeacher && selectedDate ? (
                    renderCalendarView()
                  ) : (
                    <div className="text-center py-10">
                      <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-lg font-medium">
                        Please select a teacher and a date to view the schedule.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="workload">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Workload Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={workloadData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="workload" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={departmentData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Workload Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Workload (hours)</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workloadData.map((teacher) => (
                          <TableRow key={teacher.name}>
                            <TableCell>{teacher.name}</TableCell>
                            <TableCell>{teachers.find((t) => t.name === teacher.name)?.subject}</TableCell>
                            <TableCell>{teacher.workload}</TableCell>
                            <TableCell>
                              <Badge variant={teacher.workload > 20 ? "default" : "secondary"}>
                                {teacher.workload > 20 ? "High" : "Normal"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Teacher</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="Enter teacher's name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input id="subject" placeholder="Enter teacher's subject" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" placeholder="Enter teacher's email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" placeholder="Enter teacher's phone" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="science">Science and Mathematics</SelectItem>
                  <SelectItem value="humanities">Humanities</SelectItem>
                  <SelectItem value="languages">Languages</SelectItem>
                  <SelectItem value="arts">Arts and Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workload" className="text-right">
                Workload
              </Label>
              <Input id="workload" type="number" placeholder="Enter weekly workload" className="col-span-3" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Add Teacher</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

