"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarIcon,
  Users,
  Clock,
  Undo,
  Redo,
  Search,
  Plus,
  Sun,
  Moon,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { classData } from "@/lib/class-data"
import { SessionCard } from "@/components/session-card"
import { TeacherCard } from "@/components/teacher-card"
import { NotificationCenter } from "@/components/notification-center"
import { PerformanceInsights } from "@/components/performance-insights"
import { LeaderboardModal } from "@/components/leaderboard-modal"
import { StudentResults } from "@/components/student-results"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { PerformanceChart } from "@/components/performance-chart"

const generateMockTeachers = () => {
  return Array.from(new Set(classData.map((cls) => cls.englishInstructor))).map((name, index) => ({
    id: `teacher-${index + 1}`,
    name,
    avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`,
    expertise: ["Mathematics", "Science", "English", "History"][Math.floor(Math.random() * 4)],
    availability: true,
    performance: Math.floor(Math.random() * 100),
    coverCount: Math.floor(Math.random() * 50),
    studentSatisfaction: Math.floor(Math.random() * 100),
    attendanceRate: 80 + Math.floor(Math.random() * 20),
    classesCompleted: Math.floor(Math.random() * 100),
  }))
}

const generateMockStudentData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    listening: Math.floor(Math.random() * 100),
    speaking: Math.floor(Math.random() * 100),
    writing: Math.floor(Math.random() * 100),
    reading: Math.floor(Math.random() * 100),
    exam1: Math.floor(Math.random() * 100),
    exam2: Math.floor(Math.random() * 100),
    exam3: Math.floor(Math.random() * 100),
  }))
}

const generateMockData = () => {
  const performanceTrendData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    Math: Math.floor(Math.random() * 30) + 70,
    Science: Math.floor(Math.random() * 30) + 70,
    English: Math.floor(Math.random() * 30) + 70,
    History: Math.floor(Math.random() * 30) + 70,
  }))

  const attendanceData = Array.from({ length: 10 }, (_, i) => ({
    week: `Week ${i + 1}`,
    Present: Math.floor(Math.random() * 20) + 80,
    Absent: Math.floor(Math.random() * 10),
    Late: Math.floor(Math.random() * 5),
  }))

  const skillDistributionData = [
    { skill: "Critical Thinking", value: Math.floor(Math.random() * 40) + 60 },
    { skill: "Problem Solving", value: Math.floor(Math.random() * 40) + 60 },
    { skill: "Communication", value: Math.floor(Math.random() * 40) + 60 },
    { skill: "Teamwork", value: Math.floor(Math.random() * 40) + 60 },
    { skill: "Creativity", value: Math.floor(Math.random() * 40) + 60 },
  ]

  const resourceUtilizationData = [
    { resource: "Textbooks", usage: Math.floor(Math.random() * 50) + 50 },
    { resource: "Online Courses", usage: Math.floor(Math.random() * 50) + 50 },
    { resource: "Video Lectures", usage: Math.floor(Math.random() * 50) + 50 },
    { resource: "Practice Tests", usage: Math.floor(Math.random() * 50) + 50 },
  ]

  return { performanceTrendData, attendanceData, skillDistributionData, resourceUtilizationData }
}

export default function ClassManagementPage() {
  const [classes, setClasses] = useState(classData)
  const [teachers, setTeachers] = useState(generateMockTeachers())
  const [students, setStudents] = useState(generateMockStudentData())
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [coverAssignments, setCoverAssignments] = useState({})
  const [assignmentHistory, setAssignmentHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShift, setSelectedShift] = useState("AM")
  const [darkMode, setDarkMode] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const { toast } = useToast()

  const { performanceTrendData, attendanceData, skillDistributionData, resourceUtilizationData } = generateMockData()

  const sessions = useMemo(() => {
    const amSessions = [
      { id: "am-1", number: 1, time: "6:30 - 7:30" },
      { id: "am-2", number: 2, time: "7:30 - 8:30" },
      { id: "am-3", number: 3, time: "8:30 - 9:30" },
      { id: "am-4", number: 4, time: "9:30 - 10:30" },
      { id: "am-5", number: 5, time: "10:30 - 11:30" },
      { id: "am-6", number: 6, time: "11:30 - 12:30" },
    ]
    const pmSessions = [
      { id: "pm-1", number: 1, time: "13:30 - 14:30" },
      { id: "pm-2", number: 2, time: "14:30 - 15:30" },
      { id: "pm-3", number: 3, time: "15:30 - 16:30" },
      { id: "pm-4", number: 4, time: "16:30 - 17:30" },
      { id: "pm-5", number: 5, time: "17:30 - 18:30" },
      { id: "pm-6", number: 6, time: "18:30 - 19:30" },
    ]
    return selectedShift === "AM" ? amSessions : pmSessions
  }, [selectedShift])

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (cls) =>
        cls.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.englishInstructor.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [classes, searchTerm])

  const availableTeachers = useMemo(() => {
    return teachers
      .filter(
        (teacher) =>
          teacher.availability &&
          (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.expertise.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => a.coverCount - b.coverCount)
  }, [teachers, searchTerm])

  useEffect(() => {
    setCoverAssignments({})
    setAssignmentHistory([])
    setHistoryIndex(-1)
  }, [])

  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result

      if (!destination) {
        return
      }

      const updatedAssignments = { ...coverAssignments }

      // Remove teacher from previous assignment if any
      Object.keys(updatedAssignments).forEach((sessionId) => {
        if (updatedAssignments[sessionId] === draggableId) {
          delete updatedAssignments[sessionId]
        }
      })

      // Assign teacher to new session
      if (destination.droppableId !== "teachers") {
        updatedAssignments[destination.droppableId] = draggableId
      }

      setCoverAssignments(updatedAssignments)
      setAssignmentHistory((prev) => [...prev.slice(0, historyIndex + 1), updatedAssignments])
      setHistoryIndex((prev) => prev + 1)

      const assignedTeacher = teachers.find((t) => t.id === draggableId)
      if (assignedTeacher && destination.droppableId !== "teachers") {
        toast({
          title: "Cover Assigned",
          description: `${assignedTeacher.name} assigned to ${selectedClass?.class} for session ${destination.droppableId}`,
        })
        // Update teacher's cover count
        setTeachers((prevTeachers) =>
          prevTeachers.map((t) => (t.id === draggableId ? { ...t, coverCount: t.coverCount + 1 } : t)),
        )
      } else if (destination.droppableId === "teachers") {
        toast({
          title: "Cover Removed",
          description: `Cover teacher removed from ${selectedClass?.class} for session ${source.droppableId}`,
        })
      }
    },
    [coverAssignments, historyIndex, teachers, toast, selectedClass],
  )

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setCoverAssignments(assignmentHistory[historyIndex - 1])
    }
  }, [assignmentHistory, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < assignmentHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setCoverAssignments(assignmentHistory[historyIndex + 1])
    }
  }, [assignmentHistory, historyIndex])

  const handleRevert = useCallback(() => {
    setCoverAssignments({})
    setAssignmentHistory([])
    setHistoryIndex(-1)
    toast({
      title: "Assignments Reverted",
      description: "All cover assignments have been cleared.",
    })
  }, [toast])

  return (
    <TooltipProvider>
      <div className={cn("container mx-auto p-6 space-y-8", darkMode ? "dark" : "")}>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Class Management</h1>
          <div className="flex items-center space-x-4">
            <Switch checked={darkMode} onCheckedChange={setDarkMode} className="mr-2" />
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                {/* Add form for new class here */}
              </DialogContent>
            </Dialog>
            <Button onClick={() => setShowLeaderboard(true)}>View Leaderboard</Button>
          </div>
        </div>

        <Tabs defaultValue="classes">
          <TabsList>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="results">Student Results</TabsTrigger>
            <TabsTrigger value="insights">Performance Insights</TabsTrigger>
            <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="classes">
            <div className="flex items-center space-x-4 mb-6">
              <Search className="w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search classes or teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-96"
              />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Class List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                      <AnimatePresence>
                        {filteredClasses.map((cls) => (
                          <motion.div
                            key={cls.class}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-left mb-2 p-4",
                                selectedClass?.class === cls.class && "bg-primary/10",
                              )}
                              onClick={() => setSelectedClass(cls)}
                            >
                              <div>
                                <div className="font-medium">{cls.class}</div>
                                <div className="text-sm text-muted-foreground">{cls.englishInstructor}</div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {selectedClass && (
                  <Card className="lg:col-span-6">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="mr-2" /> Cover Assignment for {selectedClass.class}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}>
                                <Undo className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Undo last assignment</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRedo}
                                disabled={historyIndex >= assignmentHistory.length - 1}
                              >
                                <Redo className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Redo last undone assignment</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" onClick={handleRevert}>
                                Revert All
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Clear all cover assignments</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-6">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <Select value={selectedShift} onValueChange={setSelectedShift}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM Shift</SelectItem>
                            <SelectItem value="PM">PM Shift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                          {sessions.map((session) => (
                            <motion.div
                              key={session.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <SessionCard
                                key={session.id}
                                session={session}
                                coverAssignment={coverAssignments[session.id]}
                                teachers={teachers}
                                selectedClass={selectedClass}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2" /> Available Teachers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId="teachers">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          <AnimatePresence>
                            {availableTeachers.map((teacher, index) => (
                              <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <TeacherCard teacher={teacher} index={index} />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            </DragDropContext>
          </TabsContent>
          <TabsContent value="results">
            <StudentResults />
          </TabsContent>
          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2" /> Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={teachers.map((t) => ({ name: t.name, performance: t.performance }))}
                    xAxis="name"
                    yAxis="performance"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2" /> Student Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart data={teachers.map((t) => ({ name: t.name, value: t.studentSatisfaction }))} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2" /> Classes Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={teachers.map((t) => ({ name: t.name, classes: t.classesCompleted }))}
                    xAxis="name"
                    yAxis="classes"
                  />
                </CardContent>
              </Card>
            </div>
            <PerformanceChart teachers={teachers} />
          </TabsContent>
          <TabsContent value="analytics">
            <AdvancedAnalytics
              teachers={teachers}
              classes={classes}
              students={students}
              performanceTrendData={performanceTrendData}
              attendanceData={attendanceData}
              skillDistributionData={skillDistributionData}
              resourceUtilizationData={resourceUtilizationData}
            />
          </TabsContent>
        </Tabs>

        <NotificationCenter />
        <PerformanceInsights teachers={teachers} />
        <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} teachers={teachers} />
      </div>
    </TooltipProvider>
  )
}

