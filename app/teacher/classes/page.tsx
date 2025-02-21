"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { classData, type ClassData } from "@/lib/class-data"
import { useAuth } from "@/components/auth-provider"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"
import { NotificationCenter } from "@/components/notification-center"
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns"
import {
  Search,
  Plus,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Download,
  Share2,
  Printer,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Enhanced types
interface EnhancedClassData extends ClassData {
  id: string
  tasks: Task[]
  attendance: AttendanceRecord[]
  resources: Resource[]
  notes: Note[]
  schedule: ScheduleEntry[]
  discussions: DiscussionPost[]
  grades: GradeEntry[]
  events: ClassEvent[]
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
}

interface AttendanceRecord {
  date: string
  presentStudents: number
  absentStudents: number
  lateStudents: number
}

interface Resource {
  id: string
  title: string
  type: "document" | "video" | "link"
  url: string
}

interface Note {
  id: string
  content: string
  createdAt: string
  updatedBy: string
}

interface ScheduleEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  room: string
}

interface DiscussionPost {
  id: string
  author: string
  content: string
  createdAt: string
  replies: DiscussionReply[]
}

interface DiscussionReply {
  id: string
  author: string
  content: string
  createdAt: string
}

interface GradeEntry {
  id: string
  studentId: string
  studentName: string
  assignment: string
  score: number
  maxScore: number
  date: string
}

interface ClassEvent {
  id: string
  title: string
  date: string
  description: string
  type: "exam" | "assignment" | "field-trip" | "other"
}

export default function TeacherClasses() {
  const { user } = useAuth()
  const teacherName = user?.name || ""
  const { toast } = useToast()

  const [classes, setClasses] = useState<EnhancedClassData[]>([])
  const [selectedClass, setSelectedClass] = useState<EnhancedClassData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCriteria, setFilterCriteria] = useState<{
    level: string
    cohort: string
    shift: string
  }>({
    level: "All",
    cohort: "All",
    shift: "All",
  })
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedView, setSelectedView] = useState<"list" | "grid" | "calendar">("list")
  const [isAddingClass, setIsAddingClass] = useState(false)
  const [newClassData, setNewClassData] = useState<Partial<EnhancedClassData>>({})
  const [isEditingClass, setIsEditingClass] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [classToDelete, setClassToDelete] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("overview")

  // Fetch and enhance class data
  useEffect(() => {
    const enhancedClasses = classData
      .filter((cls) => cls.englishInstructor === teacherName || cls.senior === teacherName)
      .map((cls) => ({
        ...cls,
        id: `class-${cls.class.toLowerCase().replace(/\s+/g, "-")}`,
        tasks: generateMockTasks(),
        attendance: generateMockAttendance(),
        resources: generateMockResources(),
        notes: generateMockNotes(),
        schedule: generateMockSchedule(),
        discussions: generateMockDiscussions(),
        grades: generateMockGrades(),
        events: generateMockEvents(),
      }))
    setClasses(enhancedClasses)
  }, [teacherName])

  // Filter and sort classes
  const filteredClasses = useMemo(() => {
    return classes
      .filter((cls) => {
        const matchesSearch =
          cls.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.level.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter =
          (filterCriteria.level === "All" || cls.level === filterCriteria.level) &&
          (filterCriteria.cohort === "All" || cls.cohort === filterCriteria.cohort) &&
          (filterCriteria.shift === "All" || cls.shift === filterCriteria.shift)
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => a.class.localeCompare(b.class))
  }, [classes, searchTerm, filterCriteria])

  // Generate mock data functions
  const generateMockTasks = (): Task[] => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `task-${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description for Task ${i + 1}`,
      dueDate: format(addDays(new Date(), i + 1), "yyyy-MM-dd"),
      status: ["todo", "in-progress", "completed"][Math.floor(Math.random() * 3)] as
        | "todo"
        | "in-progress"
        | "completed",
      priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
    }))
  }

  const generateMockAttendance = (): AttendanceRecord[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: format(addDays(new Date(), -i), "yyyy-MM-dd"),
      presentStudents: Math.floor(Math.random() * 20) + 10,
      absentStudents: Math.floor(Math.random() * 5),
      lateStudents: Math.floor(Math.random() * 3),
    }))
  }

  const generateMockResources = (): Resource[] => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `resource-${i + 1}`,
      title: `Resource ${i + 1}`,
      type: ["document", "video", "link"][i] as "document" | "video" | "link",
      url: `https://example.com/resource-${i + 1}`,
    }))
  }

  const generateMockNotes = (): Note[] => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `note-${i + 1}`,
      content: `This is a note about the class. Note ${i + 1}`,
      createdAt: format(addDays(new Date(), -i), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedBy: teacherName,
    }))
  }

  const generateMockSchedule = (): ScheduleEntry[] => {
    const weekStart = startOfWeek(new Date())
    return Array.from({ length: 5 }, (_, i) => ({
      id: `schedule-${i + 1}`,
      date: format(addDays(weekStart, i), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:30",
      room: `Room ${101 + i}`,
    }))
  }

  const generateMockDiscussions = (): DiscussionPost[] => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `discussion-${i + 1}`,
      author: `Student ${i + 1}`,
      content: `This is a discussion post about the class. Post ${i + 1}`,
      createdAt: format(addDays(new Date(), -i), "yyyy-MM-dd'T'HH:mm:ss"),
      replies: Array.from({ length: 2 }, (_, j) => ({
        id: `reply-${i + 1}-${j + 1}`,
        author: `Student ${j + 2}`,
        content: `This is a reply to the discussion post. Reply ${j + 1}`,
        createdAt: format(addDays(new Date(), -i + 1), "yyyy-MM-dd'T'HH:mm:ss"),
      })),
    }))
  }

  const generateMockGrades = (): GradeEntry[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `grade-${i + 1}`,
      studentId: `student-${i + 1}`,
      studentName: `Student ${i + 1}`,
      assignment: `Assignment ${i + 1}`,
      score: Math.floor(Math.random() * 20) + 80,
      maxScore: 100,
      date: format(addDays(new Date(), -i), "yyyy-MM-dd"),
    }))
  }

  const generateMockEvents = (): ClassEvent[] => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `event-${i + 1}`,
      title: `Event ${i + 1}`,
      date: format(addDays(new Date(), i * 7), "yyyy-MM-dd"),
      description: `Description for Event ${i + 1}`,
      type: ["exam", "assignment", "field-trip", "other"][Math.floor(Math.random() * 4)] as
        | "exam"
        | "assignment"
        | "field-trip"
        | "other",
    }))
  }

  const handleAddClass = () => {
    setIsAddingClass(true)
  }

  const handleSaveNewClass = () => {
    const newClass: EnhancedClassData = {
      ...(newClassData as EnhancedClassData),
      id: `class-${newClassData.class?.toLowerCase().replace(/\s+/g, "-")}`,
      tasks: generateMockTasks(),
      attendance: generateMockAttendance(),
      resources: generateMockResources(),
      notes: generateMockNotes(),
      schedule: generateMockSchedule(),
      discussions: generateMockDiscussions(),
      grades: generateMockGrades(),
      events: generateMockEvents(),
    }
    setClasses([...classes, newClass])
    setIsAddingClass(false)
    setNewClassData({})
    toast({
      title: "Class Added",
      description: "The new class has been successfully added.",
    })
  }

  const handleEditClass = (classId: string) => {
    const classToEdit = classes.find((cls) => cls.id === classId)
    if (classToEdit) {
      setSelectedClass(classToEdit)
      setIsEditingClass(true)
    }
  }

  const handleSaveEditedClass = () => {
    if (selectedClass) {
      setClasses(classes.map((cls) => (cls.id === selectedClass.id ? selectedClass : cls)))
      setIsEditingClass(false)
      setSelectedClass(null)
      toast({
        title: "Class Updated",
        description: "The class has been successfully updated.",
      })
    }
  }

  const handleDeleteClass = (classId: string) => {
    setClassToDelete(classId)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteClass = () => {
    if (classToDelete) {
      setClasses(classes.filter((cls) => cls.id !== classToDelete))
      setShowDeleteConfirmation(false)
      setClassToDelete(null)
      toast({
        title: "Class Deleted",
        description: "The class has been successfully deleted.",
      })
    }
  }

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    toast({
      title: "Export Started",
      description: `Exporting class data as ${format.toUpperCase()}...`,
    })
    // Implement actual export logic here
  }

  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: "A shareable link has been copied to your clipboard.",
    })
    // Implement actual share logic here
  }

  const handlePrint = () => {
    toast({
      title: "Preparing Print View",
      description: "The print view of class data is being prepared.",
    })
    window.print()
  }

  const getStatusVariant = (status: "todo" | "in-progress" | "completed") => {
    switch (status) {
      case "todo":
        return "default"
      case "in-progress":
        return "warning"
      case "completed":
        return "success"
      default:
        return "default"
    }
  }

  const getPriorityVariant = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low":
        return "default"
      case "medium":
        return "warning"
      case "high":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <div className="flex items-center space-x-2">
          <NotificationCenter />
          <Button onClick={handleAddClass}>
            <Plus className="mr-2 h-4 w-4" /> Add Class
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>Manage and view your assigned classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filterCriteria.level}
              onValueChange={(value) => setFilterCriteria({ ...filterCriteria, level: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterCriteria.cohort}
              onValueChange={(value) => setFilterCriteria({ ...filterCriteria, cohort: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cohorts</SelectItem>
                <SelectItem value="23">Cohort 23</SelectItem>
                <SelectItem value="24">Cohort 24</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterCriteria.shift}
              onValueChange={(value) => setFilterCriteria({ ...filterCriteria, shift: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Shifts</SelectItem>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as "list" | "grid" | "calendar")}>
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>{cls.class}</TableCell>
                      <TableCell>{cls.room}</TableCell>
                      <TableCell>{cls.level}</TableCell>
                      <TableCell>{cls.cohort}</TableCell>
                      <TableCell>{cls.shift}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClass(cls.id)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteClass(cls.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClasses.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader>
                      <CardTitle>{cls.class}</CardTitle>
                      <CardDescription>
                        {cls.level} - Cohort {cls.cohort}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <MapPin className="inline-block mr-2" /> Room: {cls.room}
                      </p>
                      <p>
                        <Clock className="inline-block mr-2" /> Shift: {cls.shift}
                      </p>
                      <p>
                        <Users className="inline-block mr-2" /> Students: {cls.students?.length || 0}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-2" onClick={() => handleEditClass(cls.id)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" onClick={() => handleDeleteClass(cls.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="calendar">
              <div className="flex space-x-4">
                <div className="w-1/4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <div className="w-3/4">
                  <h3 className="text-lg font-semibold mb-2">Classes on {format(selectedDate, "MMMM d, yyyy")}</h3>
                  <div className="space-y-2">
                    {filteredClasses
                      .filter((cls) => cls.schedule.some((entry) => isSameDay(parseISO(entry.date), selectedDate)))
                      .map((cls) => (
                        <Card key={cls.id}>
                          <CardHeader>
                            <CardTitle>{cls.class}</CardTitle>
                            <CardDescription>
                              {cls.level} - Room {cls.room}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {cls.schedule
                              .filter((entry) => isSameDay(parseISO(entry.date), selectedDate))
                              .map((entry) => (
                                <p key={entry.id}>
                                  <Clock className="inline-block mr-2" />
                                  {entry.startTime} - {entry.endTime}
                                </p>
                              ))}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>Enter the details for the new class.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="className" className="text-right">
                Class Name
              </Label>
              <Input
                id="className"
                value={newClassData.class || ""}
                onChange={(e) => setNewClassData({ ...newClassData, class: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Input
                id="room"
                value={newClassData.room || ""}
                onChange={(e) => setNewClassData({ ...newClassData, room: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Level
              </Label>
              <Select
                value={newClassData.level || ""}
                onValueChange={(value) => setNewClassData({ ...newClassData, level: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cohort" className="text-right">
                Cohort
              </Label>
              <Input
                id="cohort"
                value={newClassData.cohort || ""}
                onChange={(e) => setNewClassData({ ...newClassData, cohort: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shift" className="text-right">
                Shift
              </Label>
              <Select
                value={newClassData.shift || ""}
                onValueChange={(value) => setNewClassData({ ...newClassData, shift: value as "AM" | "PM" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveNewClass}>Save Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingClass} onOpenChange={setIsEditingClass}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update the details for the selected class.</DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editClassName" className="text-right">
                  Class Name
                </Label>
                <Input
                  id="editClassName"
                  value={selectedClass.class}
                  onChange={(e) => setSelectedClass({ ...selectedClass, class: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editRoom" className="text-right">
                  Room
                </Label>
                <Input
                  id="editRoom"
                  value={selectedClass.room}
                  onChange={(e) => setSelectedClass({ ...selectedClass, room: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editLevel" className="text-right">
                  Level
                </Label>
                <Select
                  value={selectedClass.level}
                  onValueChange={(value) => setSelectedClass({ ...selectedClass, level: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editCohort" className="text-right">
                  Cohort
                </Label>
                <Input
                  id="editCohort"
                  value={selectedClass.cohort}
                  onChange={(e) => setSelectedClass({ ...selectedClass, cohort: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editShift" className="text-right">
                  Shift
                </Label>
                <Select
                  value={selectedClass.shift}
                  onValueChange={(value) => setSelectedClass({ ...selectedClass, shift: value as "AM" | "PM" })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEditedClass}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteClass}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedClass && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedClass.class} Details</CardTitle>
            <CardDescription>Manage class details, tasks, and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Class Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Room:</strong> {selectedClass.room}
                      </p>
                      <p>
                        <strong>Level:</strong> {selectedClass.level}
                      </p>
                      <p>
                        <strong>Cohort:</strong> {selectedClass.cohort}
                      </p>
                      <p>
                        <strong>Shift:</strong> {selectedClass.shift}
                      </p>
                      <p>
                        <strong>Students:</strong> {selectedClass.students?.length || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Average Attendance:</strong> {calculateAverageAttendance(selectedClass.attendance)}%
                      </p>
                      <p>
                        <strong>Completed Tasks:</strong> {countCompletedTasks(selectedClass.tasks)}/
                        {selectedClass.tasks.length}
                      </p>
                      <p>
                        <strong>Upcoming Events:</strong> {countUpcomingEvents(selectedClass.events)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>Manage and track class tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add New Task
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance</CardTitle>
                    <CardDescription>Track and manage class attendance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChart
                      data={selectedClass.attendance}
                      index="date"
                      categories={["presentStudents", "absentStudents", "lateStudents"]}
                      colors={["green", "red", "yellow"]}
                      valueFormatter={(value) => `${value} students`}
                      className="h-[300px]"
                    />
                    <Table className="mt-4">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Late</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.attendance.map((record) => (
                          <TableRow key={record.date}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.presentStudents}</TableCell>
                            <TableCell>{record.absentStudents}</TableCell>
                            <TableCell>{record.lateStudents}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>Manage class resources and materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedClass.resources.map((resource) => (
                        <Card key={resource.id}>
                          <CardHeader>
                            <CardTitle>{resource.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>
                              <strong>Type:</strong> {resource.type}
                            </p>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View Resource
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add New Resource
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="discussions">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Discussions</CardTitle>
                    <CardDescription>Engage in class discussions and forums</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {selectedClass.discussions.map((discussion) => (
                        <AccordionItem key={discussion.id} value={discussion.id}>
                          <AccordionTrigger>
                            {discussion.author}: {discussion.content}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground">
                              Posted on {format(parseISO(discussion.createdAt), "PPP")}
                            </p>
                            <div className="mt-4 space-y-2">
                              {discussion.replies.map((reply) => (
                                <Card key={reply.id}>
                                  <CardContent className="py-2">
                                    <p>{reply.content}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Reply by {reply.author} on {format(parseISO(reply.createdAt), "PPP")}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <Button className="mt-2">
                              <MessageSquare className="mr-2 h-4 w-4" /> Reply
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Start New Discussion
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="grades">
                <Card>
                  <CardHeader>
                    <CardTitle>Grades</CardTitle>
                    <CardDescription>Manage and view student grades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClass.grades.map((grade) => (
                          <TableRow key={grade.id}>
                            <TableCell>{grade.studentName}</TableCell>
                            <TableCell>{grade.assignment}</TableCell>
                            <TableCell>
                              {grade.score}/{grade.maxScore}
                            </TableCell>
                            <TableCell>{grade.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add New Grade
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Calendar</CardTitle>
                    <CardDescription>View and manage class events and schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <div className="w-1/3">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="w-2/3">
                        <h3 className="text-lg font-semibold mb-2">Events on {format(selectedDate, "MMMM d, yyyy")}</h3>
                        <div className="space-y-2">
                          {selectedClass.events
                            .filter((event) => isSameDay(parseISO(event.date), selectedDate))
                            .map((event) => (
                              <Card key={event.id}>
                                <CardHeader>
                                  <CardTitle>{event.title}</CardTitle>
                                  <CardDescription>{event.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p>{event.description}</p>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Add New Event
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Class Analytics</CardTitle>
          <CardDescription>Overview of your classes and student performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Elementary", value: filteredClasses.filter((c) => c.level === "Elementary").length },
                    { name: "Intermediate", value: filteredClasses.filter((c) => c.level === "Intermediate").length },
                    { name: "Advanced", value: filteredClasses.filter((c) => c.level === "Advanced").length },
                  ]}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value} classes`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Present", value: 85 },
                    { name: "Absent", value: 10 },
                    { name: "Late", value: 5 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["green", "red", "yellow"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Week 1", completed: 75 },
                    { name: "Week 2", completed: 80 },
                    { name: "Week 3", completed: 85 },
                    { name: "Week 4", completed: 90 },
                  ]}
                  index="name"
                  categories={["completed"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => handleExport("pdf")}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
        <Button variant="outline" onClick={() => handleExport("csv")}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" onClick={() => handleExport("excel")}>
          <Download className="mr-2 h-4 w-4" /> Export Excel
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <WhatsAppIntegration />
    </div>
  )
}

// Helper functions
const calculateAverageAttendance = (attendance: AttendanceRecord[]) => {
  const total = attendance.reduce((sum, record) => sum + record.presentStudents, 0)
  return Math.round((total / (attendance.length * 100)) * 100)
}

const countCompletedTasks = (tasks: Task[]) => {
  return tasks.filter((task) => task.status === "completed").length
}

const countUpcomingEvents = (events: ClassEvent[]) => {
  const today = new Date()
  return events.filter((event) => parseISO(event.date) > today).length
}

const getStatusVariant = (status: "todo" | "in-progress" | "completed") => {
  switch (status) {
    case "todo":
      return "default"
    case "in-progress":
      return "warning"
    case "completed":
      return "success"
    default:
      return "default"
  }
}

const getPriorityVariant = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "default"
    case "medium":
      return "warning"
    case "high":
      return "destructive"
    default:
      return "default"
  }
}

