"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { format, addDays, startOfWeek, isSameDay, subWeeks, addWeeks } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ChatWidget } from "@/components/chat-widget"
import { useToast } from "@/components/ui/use-toast"
import { NotificationCenter } from "@/components/notification-center"
import {
  Search,
  Plus,
  Download,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  MapPin,
  CalendarPlus2Icon as CalendarIcon2,
  Share2,
  Printer,
  FileText,
  Video,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Laptop,
  Book,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced Types
interface ClassAttendee {
  id: string
  name: string
  role: "student" | "assistant" | "observer"
  avatar?: string
  status?: "present" | "absent" | "late"
}

interface ClassResource {
  id: string
  type: "document" | "video" | "link" | "assignment"
  title: string
  url: string
  dueDate?: Date
}

interface ClassNote {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: string
}

interface Class {
  id: string
  subject: string
  room: string
  type: "regular" | "cover" | "meeting" | "break" | "exam" | "workshop" | "tutorial" | "it" | "islamic"
  notes?: ClassNote[]
  students?: ClassAttendee[]
  resources?: ClassResource[]
  virtualRoom?: string
  recurring?: boolean
  color?: string
  capacity?: number
  duration?: number
  preparationTime?: number
  priority?: "low" | "medium" | "high"
  status?: "scheduled" | "in-progress" | "completed" | "cancelled"
  notifications?: boolean
  reminders?: number[]
}

interface TimeSlot {
  period: number
  startTime: string
  endTime: string
  class?: Class
  conflictsWith?: string[]
  isBreak?: boolean
  isFree?: boolean
}

interface DaySchedule {
  date: Date
  slots: TimeSlot[]
  summary?: {
    totalClasses: number
    totalStudents: number
    totalDuration: number
  }
}

// Mock data generator
const generateMockData = () => {
  const classTypes: Class["type"][] = ["regular", "break", "it", "islamic"]

  const subjects = [
    "English Grammar",
    "Reading Comprehension",
    "Writing Skills",
    "Listening Practice",
    "Speaking Practice",
    "Vocabulary",
    "Phonetics",
    "Literature",
  ]

  const rooms = [
    "Room 101",
    "Room 102",
    "Room 103",
    "Room 104",
    "Room 105",
    "IT Lab",
    "Language Lab",
    "Islamic Studies Room",
  ]

  const generateAttendees = (count: number): ClassAttendee[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `student-${i}`,
      name: `Student ${i + 1}`,
      role: "student",
      status: Math.random() > 0.8 ? "absent" : Math.random() > 0.9 ? "late" : "present",
    }))
  }

  const generateResources = (): ClassResource[] => {
    return [
      {
        id: "res-1",
        type: "document",
        title: "Lecture Notes",
        url: "/documents/notes.pdf",
      },
      {
        id: "res-2",
        type: "video",
        title: "Tutorial Recording",
        url: "/videos/tutorial.mp4",
      },
    ]
  }

  return {
    generateClass: (id: string): Class => ({
      id,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      room: rooms[Math.floor(Math.random() * rooms.length)],
      type: classTypes[Math.floor(Math.random() * classTypes.length)],
      students: generateAttendees(Math.floor(Math.random() * 20) + 10),
      resources: generateResources(),
      virtualRoom: Math.random() > 0.5 ? `https://meet.virtual/${id}` : undefined,
      recurring: Math.random() > 0.7,
      capacity: 30,
      duration: 60,
      preparationTime: 15,
      priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
      status: "scheduled",
      notifications: true,
      reminders: [15, 30],
    }),
  }
}

const { generateClass } = generateMockData()

// Enhanced color mapping
const classColors = {
  regular: "bg-blue-100 text-blue-800 border-blue-200",
  break: "bg-gray-100 text-gray-800 border-gray-200",
  it: "bg-green-100 text-green-800 border-green-200",
  islamic: "bg-amber-100 text-amber-800 border-amber-200",
}

export default function MyTimetablePage() {
  // Enhanced state management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedView, setSelectedView] = useState<"day" | "week" | "month" | "agenda" | "timeline">("day")
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<Class["type"] | "all">("all")
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showVirtualClasses, setShowVirtualClasses] = useState(true)
  const [showConflicts, setShowConflicts] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [undoStack, setUndoStack] = useState<DaySchedule[][]>([])
  const [redoStack, setRedoStack] = useState<DaySchedule[][]>([])
  const { toast } = useToast()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            if (e.shiftKey) handleRedo()
            else handleUndo()
            break
          case "s":
            e.preventDefault()
            handleSave()
            break
          case "p":
            e.preventDefault()
            handlePrint()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  // Generate enhanced schedule
  useEffect(() => {
    const weekStart = startOfWeek(selectedDate)
    const weekSchedule = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i)
      const slots: TimeSlot[] = [
        { period: 1, startTime: "06:30", endTime: "07:30", class: generateClass(`class-${date.getTime()}-1`) },
        { period: 2, startTime: "07:30", endTime: "08:30", class: generateClass(`class-${date.getTime()}-2`) },
        { period: 3, startTime: "08:30", endTime: "09:30", class: generateClass(`class-${date.getTime()}-3`) },
        {
          period: 4,
          startTime: "09:30",
          endTime: "10:15",
          isBreak: true,
          class: { id: `break-${date.getTime()}-1`, subject: "Break", room: "Break Area", type: "break" },
        },
        { period: 5, startTime: "10:15", endTime: "11:15", class: generateClass(`class-${date.getTime()}-4`) },
        {
          period: 6,
          startTime: "11:15",
          endTime: "11:35",
          isBreak: true,
          class: { id: `break-${date.getTime()}-2`, subject: "Break", room: "Break Area", type: "break" },
        },
        { period: 7, startTime: "11:35", endTime: "12:30", class: generateClass(`class-${date.getTime()}-5`) },
      ]

      // Add IT and Islamic studies
      if (i === 1 || i === 3) {
        // Tuesday and Thursday
        slots[2].class = { id: `it-${date.getTime()}`, subject: "IT", room: "IT Lab", type: "it" }
      }
      if (i === 2) {
        // Wednesday
        slots[4].class = {
          id: `islamic-${date.getTime()}`,
          subject: "Islamic Studies",
          room: "Islamic Studies Room",
          type: "islamic",
        }
      }

      return {
        date,
        slots,
        summary: {
          totalClasses: slots.filter((s) => !s.isBreak).length,
          totalStudents: slots.reduce((acc, s) => acc + (s.class?.students?.length || 0), 0),
          totalDuration: slots.filter((s) => !s.isBreak).reduce((acc, s) => acc + (s.class?.duration || 0), 0),
        },
      }
    })

    setSchedule(weekSchedule)
  }, [selectedDate])

  // Memoized calculations
  const stats = useMemo(
    () => ({
      totalClasses: schedule.reduce((acc, day) => acc + day.summary!.totalClasses, 0),
      totalStudents: schedule.reduce((acc, day) => acc + day.summary!.totalStudents, 0),
      totalDuration: schedule.reduce((acc, day) => acc + day.summary!.totalDuration, 0),
      classTypes: Object.fromEntries(
        ["regular", "break", "it", "islamic"].map((type) => [
          type,
          schedule.flatMap((d) => d.slots).filter((s) => s.class?.type === type).length,
        ]),
      ),
      attendance: {
        present: schedule
          .flatMap((d) => d.slots)
          .flatMap((s) => s.class?.students || [])
          .filter((s) => s.status === "present").length,
        absent: schedule
          .flatMap((d) => d.slots)
          .flatMap((s) => s.class?.students || [])
          .filter((s) => s.status === "absent").length,
        late: schedule
          .flatMap((d) => d.slots)
          .flatMap((s) => s.class?.students || [])
          .filter((s) => s.status === "late").length,
      },
    }),
    [schedule],
  )

  // Enhanced handlers
  const handleSave = useCallback(() => {
    setUndoStack((prev) => [...prev, schedule])
    toast({
      title: "Schedule saved",
      description: "Your changes have been saved successfully.",
    })
  }, [schedule, toast]) // Added toast to dependencies

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    setRedoStack((prev) => [...prev, schedule])
    setSchedule(previous)
    setUndoStack((prev) => prev.slice(0, -1))
  }, [schedule, undoStack])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack((prev) => [...prev, schedule])
    setSchedule(next)
    setRedoStack((prev) => prev.slice(0, -1))
  }, [schedule, redoStack])

  const handlePrint = useCallback(() => {
    toast({
      title: "Preparing print view",
      description: "Your schedule will be ready to print shortly.",
    })
    window.print()
  }, [toast]) // Added toast to dependencies

  const handleExport = useCallback(
    (format: "pdf" | "ics" | "excel") => {
      toast({
        title: "Export started",
        description: `Exporting schedule as ${format.toUpperCase()}...`,
      })
    },
    [toast],
  ) // Added toast to dependencies

  const handleShare = useCallback(() => {
    toast({
      title: "Share schedule",
      description: "Schedule link copied to clipboard.",
    })
  }, [toast]) // Added toast to dependencies

  return (
    <div className={cn("container mx-auto p-6 space-y-8", darkMode && "dark")}>
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">My Timetable</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <CalendarIcon2 className="h-4 w-4" />
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <NotificationCenter />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
              </DialogHeader>
              {/* Enhanced class form */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <Input id="subject" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room" className="text-right">
                    Room
                  </Label>
                  <Input id="room" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={""} onValueChange={() => {}}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(classColors).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <div className="col-span-3 flex gap-4">
                    <Input type="time" id="startTime" />
                    <span>-</span>
                    <Input type="time" id="endTime" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input type="date" id="date" className="col-span-3" />
                </div>
                {/* Additional form fields */}
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search classes, rooms, or students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as Class["type"] | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(classColors).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="space-y-2">
                    {["pdf", "ics", "excel"].map((format) => (
                      <Button
                        key={format}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleExport(format as "pdf" | "ics" | "excel")}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {format.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Enhanced toolbar */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={undoStack.length === 0}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} disabled={redoStack.length === 0}>
                <Redo className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button variant="ghost" size="icon" onClick={() => setZoomLevel(Math.min(zoomLevel + 10, 200))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm">{zoomLevel}%</span>
              <Button variant="ghost" size="icon" onClick={() => setZoomLevel(Math.max(zoomLevel - 10, 50))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch checked={showVirtualClasses} onCheckedChange={setShowVirtualClasses} id="virtual-classes" />
                <Label htmlFor="virtual-classes">Virtual Classes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={showConflicts} onCheckedChange={setShowConflicts} id="show-conflicts" />
                <Label htmlFor="show-conflicts">Show Conflicts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={autoSync} onCheckedChange={setAutoSync} id="auto-sync" />
                <Label htmlFor="auto-sync">Auto Sync</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Classes</span>
                    <Badge variant="secondary">{stats.totalClasses}</Badge>
                  </div>
                  <Progress value={(stats.totalClasses / 40) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Students</span>
                    <Badge variant="secondary">{stats.totalStudents}</Badge>
                  </div>
                  <Progress value={(stats.totalStudents / 300) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Teaching Hours</span>
                    <Badge variant="secondary">{Math.round(stats.totalDuration / 60)}</Badge>
                  </div>
                  <Progress value={(stats.totalDuration / 2400) * 100} />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Enhanced Schedule View */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Schedule</CardTitle>
              <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {selectedView === "day" && (
                <LayoutGroup>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {schedule
                      .find((day) => isSameDay(day.date, selectedDate))
                      ?.slots.map((slot) => (
                        <motion.div
                          layout
                          key={slot.period}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className={cn(
                            "p-4 rounded-lg border transition-all hover:shadow-md",
                            slot.class && classColors[slot.class.type],
                          )}
                          style={{ zoom: `${zoomLevel}%` }}
                          onClick={() => setSelectedClass(slot.class || null)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-semibold flex items-center gap-2">
                                {slot.class?.subject}
                                {slot.class?.type === "it" && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Laptop className="h-3 w-3" />
                                    IT
                                  </Badge>
                                )}
                                {slot.class?.type === "islamic" && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Book className="h-3 w-3" />
                                    Islamic
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {slot.startTime} - {slot.endTime}
                              </p>
                            </div>
                            <Badge variant="outline">{slot.class?.type}</Badge>
                          </div>

                          <div className="mt-4 space-y-2">
                            {slot.class?.room && (
                              <p className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {slot.class.room}
                              </p>
                            )}
                            {slot.class?.students && !slot.isBreak && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <div className="flex -space-x-2">
                                  {slot.class.students.slice(0, 3).map((student) => (
                                    <Avatar key={student.id} className="h-6 w-6 border-2 border-background">
                                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {slot.class.students.length > 3 && (
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                      +{slot.class.students.length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {slot.class?.resources && slot.class.resources.length > 0 && !slot.isBreak && (
                            <div className="mt-4 flex gap-2">
                              {slot.class.resources.map((resource) => (
                                <Badge key={resource.id} variant="secondary" className="flex items-center gap-1">
                                  {resource.type === "document" && <FileText className="h-3 w-3" />}
                                  {resource.type === "video" && <Video className="h-3 w-3" />}
                                  {resource.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                  </motion.div>
                </LayoutGroup>
              )}

              {selectedView === "week" && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Time</TableHead>
                        {schedule.map((day) => (
                          <TableHead key={day.date.toISOString()} className="min-w-[200px]">
                            <div className="text-center">
                              <div className="font-bold">{format(day.date, "EEEE")}</div>
                              <div className="text-sm text-muted-foreground">{format(day.date, "MMM d")}</div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule[0].slots.map((slot, index) => (
                        <TableRow key={slot.period}>
                          <TableCell className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </TableCell>
                          {schedule.map((day) => {
                            const daySlot = day.slots[index]
                            return (
                              <TableCell
                                key={day.date.toISOString()}
                                className={cn(
                                  "cursor-pointer hover:bg-accent transition-colors",
                                  daySlot.class && classColors[daySlot.class.type],
                                )}
                                onClick={() => setSelectedClass(daySlot.class || null)}
                              >
                                {daySlot.class && (
                                  <div className="p-2 space-y-1">
                                    <div className="font-medium">{daySlot.class.subject}</div>
                                    <div className="text-xs">{daySlot.class.room}</div>
                                    {daySlot.class.type === "it" && (
                                      <Badge variant="secondary" className="text-xs">
                                        IT
                                      </Badge>
                                    )}
                                    {daySlot.class.type === "islamic" && (
                                      <Badge variant="secondary" className="text-xs">
                                        Islamic
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedView === "agenda" && (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-8">
                    {schedule.map((day) => (
                      <div key={day.date.toISOString()}>
                        <h3 className="font-semibold mb-4">{format(day.date, "EEEE, MMMM d")}</h3>
                        <div className="space-y-2">
                          {day.slots
                            .filter((slot) => slot.class && !slot.isBreak)
                            .map((slot) => (
                              <Card key={slot.period}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">{slot.class?.subject}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {slot.startTime} - {slot.endTime}
                                      </p>
                                    </div>
                                    <Badge variant="outline">{slot.class?.type}</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {selectedView === "timeline" && (
                <div className="relative min-h-[600px]">
                  <div className="absolute inset-0">
                    {schedule.map((day, dayIndex) => (
                      <div
                        key={day.date.toISOString()}
                        className="absolute left-0 right-0"
                        style={{ top: `${dayIndex * 100}px` }}
                      >
                        <div className="font-semibold mb-2">{format(day.date, "EEEE, MMMM d")}</div>
                        <div className="relative h-20">
                          {day.slots.map((slot) => (
                            <motion.div
                              key={slot.period}
                              className={cn(
                                "absolute h-16 rounded-lg border p-2",
                                slot.class && classColors[slot.class.type],
                              )}
                              style={{
                                left: `${(slot.period - 1) * 12.5}%`,
                                width: "11.5%",
                              }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="text-xs font-medium">{slot.class?.subject}</div>
                              <div className="text-xs text-muted-foreground">
                                {slot.startTime} - {slot.endTime}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={Object.entries(stats.classTypes).map(([type, count]) => ({
                name: type,
                value: count,
              }))}
              index="name"
              category="value"
              valueFormatter={(value) => `${value} classes`}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[
                { name: "Present", value: stats.attendance.present },
                { name: "Absent", value: stats.attendance.absent },
                { name: "Late", value: stats.attendance.late },
              ]}
              index="name"
              categories={["value"]}
              colors={["green", "red", "yellow"]}
              valueFormatter={(value) => `${value} students`}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teaching Load</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={schedule.map((day) => ({
                name: format(day.date, "EEE"),
                value: day.summary!.totalDuration / 60,
              }))}
              index="name"
              categories={["value"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value}h`}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

