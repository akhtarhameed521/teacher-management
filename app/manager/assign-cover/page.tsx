"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { format, addDays, startOfWeek } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Users, Clock, CheckCircle, Undo, Redo, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { classData } from "@/lib/class-data"

const sessions = ["1", "2", "3", "4", "5", "6"]

const generateMockTeachers = () => {
  return Array.from(new Set(classData.map((cls) => cls.englishInstructor))).map((name, index) => ({
    id: `teacher-${index + 1}`,
    name,
    avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`,
  }))
}

export default function AssignCoverPage() {
  const [teachers, setTeachers] = useState(generateMockTeachers())
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [coverAssignments, setCoverAssignments] = useState({})
  const [assignmentHistory, setAssignmentHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const { toast } = useToast()

  useEffect(() => {
    // Reset cover assignments when class changes
    setCoverAssignments({})
    setAssignmentHistory([])
    setHistoryIndex(-1)
  }, [])

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return

      const { source, destination, draggableId } = result
      const updatedAssignments = { ...coverAssignments }

      if (source.droppableId !== "teachers") {
        delete updatedAssignments[source.droppableId]
      }

      if (destination.droppableId !== "teachers") {
        updatedAssignments[destination.droppableId] = draggableId
      }

      setCoverAssignments(updatedAssignments)
      setAssignmentHistory((prev) => [...prev.slice(0, historyIndex + 1), updatedAssignments])
      setHistoryIndex((prev) => prev + 1)

      toast({
        title: "Cover Assigned",
        description: `${teachers.find((t) => t.id === draggableId).name} assigned to ${selectedClass?.class} for session ${destination.droppableId}`,
      })
    },
    [coverAssignments, historyIndex, selectedClass?.class, teachers, toast],
  )

  const getSessionStatus = useCallback(
    (session) => {
      if (coverAssignments[session]) return "covered"
      if (selectedClass) return "active"
      return "unavailable"
    },
    [coverAssignments, selectedClass],
  )

  const sessionColors = {
    active: "bg-green-100 border-green-300 text-green-800",
    covered: "bg-blue-100 border-blue-300 text-blue-800",
    unavailable: "bg-gray-100 border-gray-300 text-gray-500",
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setCoverAssignments(assignmentHistory[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < assignmentHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setCoverAssignments(assignmentHistory[historyIndex + 1])
    }
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i))

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.h1
        className="text-4xl font-bold text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Assign Cover
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2" /> Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" /> Select Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedClass(classData.find((cls) => cls.class === value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classData.map((cls) => (
                  <SelectItem key={cls.class} value={cls.class}>
                    {cls.class} - {cls.englishInstructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedClass && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2" /> Weekly Schedule
                  </div>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
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
                    </TooltipProvider>
                    <TooltipProvider>
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
                    </TooltipProvider>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Session</TableHead>
                        {weekDays.map((day) => (
                          <TableHead key={day.toISOString()}>{format(day, "EEE, MMM d")}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session}>
                          <TableCell>{`${8 + Number.parseInt(session)}:00 - ${9 + Number.parseInt(session)}:00`}</TableCell>
                          {weekDays.map((day) => (
                            <TableCell key={day.toISOString()}>
                              <Droppable droppableId={`${format(day, "yyyy-MM-dd")}-${session}`}>
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={cn(
                                      "min-h-[2.5rem] rounded-md p-2 transition-colors",
                                      sessionColors[getSessionStatus(`${format(day, "yyyy-MM-dd")}-${session}`)],
                                      snapshot.isDraggingOver && "ring-2 ring-primary",
                                    )}
                                  >
                                    <AnimatePresence>
                                      {coverAssignments[`${format(day, "yyyy-MM-dd")}-${session}`] ? (
                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          transition={{ duration: 0.2 }}
                                          className="flex items-center space-x-2"
                                        >
                                          <Avatar className="h-6 w-6">
                                            <AvatarImage
                                              src={
                                                teachers.find(
                                                  (t) =>
                                                    t.id ===
                                                    coverAssignments[`${format(day, "yyyy-MM-dd")}-${session}`],
                                                ).avatar
                                              }
                                            />
                                            <AvatarFallback>
                                              {
                                                teachers.find(
                                                  (t) =>
                                                    t.id ===
                                                    coverAssignments[`${format(day, "yyyy-MM-dd")}-${session}`],
                                                ).name[0]
                                              }
                                            </AvatarFallback>
                                          </Avatar>
                                          <span>
                                            {
                                              teachers.find(
                                                (t) =>
                                                  t.id === coverAssignments[`${format(day, "yyyy-MM-dd")}-${session}`],
                                              ).name
                                            }
                                          </span>
                                          <Badge variant="secondary">Cover</Badge>
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          transition={{ duration: 0.2 }}
                                          className="flex items-center space-x-2"
                                        >
                                          <Avatar className="h-6 w-6">
                                            <AvatarImage
                                              src={`/placeholder.svg?height=24&width=24&text=${selectedClass.englishInstructor[0]}`}
                                            />
                                            <AvatarFallback>{selectedClass.englishInstructor[0]}</AvatarFallback>
                                          </Avatar>
                                          <span
                                            className={
                                              coverAssignments[`${format(day, "yyyy-MM-dd")}-${session}`]
                                                ? "line-through text-gray-500"
                                                : ""
                                            }
                                          >
                                            {selectedClass.englishInstructor}
                                          </span>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" /> Available Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="teachers">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {teachers.map((teacher, index) => (
                        <Draggable key={teacher.id} draggableId={teacher.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "p-2 rounded-md flex items-center space-x-2 transition-colors",
                                snapshot.isDragging ? "bg-primary text-primary-foreground" : "bg-secondary",
                              )}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={teacher.avatar} />
                                <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{teacher.name}</span>
                            </motion.li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        </DragDropContext>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2" /> Cover Assignment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Cover Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(coverAssignments).map(([key, teacherId]) => {
                  const [date, session] = key.split("-")
                  const teacher = teachers.find((t) => t.id === teacherId)
                  return (
                    <TableRow key={key}>
                      <TableCell>{format(new Date(date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{`Session ${session}`}</TableCell>
                      <TableCell>{teacher.name}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          className="w-full"
          size="lg"
          onClick={() =>
            toast({
              title: "Cover Assignments Saved",
              description: "The cover assignments have been successfully saved and teachers notified.",
            })
          }
        >
          <CheckCircle className="mr-2" /> Save Cover Assignments
        </Button>
      </motion.div>
    </div>
  )
}

