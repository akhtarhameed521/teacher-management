"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  parseISO,
  differenceInDays,
  addWeeks,
} from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Calendar,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { Task } from "@/types/tasks"

interface TimelineViewProps {
  tasks: Task[]
  onTaskEdit: (task: Task) => void
  onTaskDelete: (taskId: string) => void
  onTaskMove: (taskId: string, newStartDate: string, newEndDate: string) => void
  onTaskCreate: (task: Partial<Task>) => void
}

const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onTaskEdit, onTaskDelete, onTaskMove, onTaskCreate }) => {
  const [startDate, setStartDate] = useState(startOfWeek(new Date()))
  const [endDate, setEndDate] = useState(endOfWeek(addWeeks(new Date(), 8))) // Show 9 weeks by default
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [filter, setFilter] = useState({ status: "all", priority: "all", assignee: "all" })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showWeekends, setShowWeekends] = useState(true)
  const [showDependencies, setShowDependencies] = useState(true)
  const [groupBy, setGroupBy] = useState<"none" | "status" | "assignee" | "priority">("none")
  const [viewMode, setViewMode] = useState<"timeline" | "calendar" | "list">("timeline")
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const days = useMemo(
    () =>
      eachDayOfInterval({ start: startDate, end: endDate }).filter(
        (day) => showWeekends || (day.getDay() !== 0 && day.getDay() !== 6),
      ),
    [startDate, endDate, showWeekends],
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        (filter.status === "all" || task.status === filter.status) &&
        (filter.priority === "all" || task.priority === filter.priority) &&
        (filter.assignee === "all" || task.assignee.name === filter.assignee) &&
        (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [tasks, filter, searchTerm])

  const groupedTasks = useMemo(() => {
    if (groupBy === "none") return { "All Tasks": filteredTasks }
    return filteredTasks.reduce(
      (acc, task) => {
        const key = groupBy === "assignee" ? task.assignee.name : task[groupBy]
        if (!acc[key]) acc[key] = []
        acc[key].push(task)
        return acc
      },
      {} as Record<string, Task[]>,
    )
  }, [filteredTasks, groupBy])

  const navigateTimeline = useCallback((direction: "prev" | "next") => {
    const daysToShift = direction === "prev" ? -7 : 7
    setStartDate((prev) => addDays(prev, daysToShift))
    setEndDate((prev) => addDays(prev, daysToShift))
  }, [])

  const handleZoom = useCallback((direction: "in" | "out") => {
    setZoom((prevZoom) => Math.max(0.5, Math.min(2, prevZoom + (direction === "in" ? 0.1 : -0.1))))
  }, [])

  const getTaskPosition = useCallback(
    (task: Task) => {
      const taskStart = parseISO(task.dueDate)
      const dayIndex = differenceInDays(taskStart, startDate)
      return `${(dayIndex / days.length) * 100}%`
    },
    [days, startDate],
  )

  const getTaskWidth = useCallback(
    (task: Task) => {
      const duration = task.duration || 1
      return `${(duration / days.length) * 100}%`
    },
    [days],
  )

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "To Do":
        return "bg-red-200 dark:bg-red-800"
      case "In Progress":
        return "bg-yellow-200 dark:bg-yellow-800"
      case "Done":
        return "bg-green-200 dark:bg-green-800"
      default:
        return "bg-gray-200 dark:bg-gray-800"
    }
  }, [])

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return

      const { draggableId, source, destination } = result
      const task = tasks.find((t) => t.id === draggableId)
      if (!task) return

      const newStartDate = addDays(startDate, destination.index).toISOString()
      const newEndDate = addDays(parseISO(newStartDate), task.duration || 1).toISOString()
      onTaskMove(draggableId, newStartDate, newEndDate)
    },
    [tasks, startDate, onTaskMove],
  )

  const toggleTaskExpansion = useCallback(
    (taskId: string) => {
      setExpandedTask(expandedTask === taskId ? null : taskId)
    },
    [expandedTask],
  )

  const handleCreateTask = useCallback(
    (newTask: Partial<Task>) => {
      onTaskCreate(newTask)
      setIsCreatingTask(false)
    },
    [onTaskCreate],
  )

  const scrollToToday = useCallback(() => {
    const todayIndex = days.findIndex((day) => isToday(day))
    if (todayIndex !== -1 && timelineRef.current) {
      const scrollPosition = (todayIndex / days.length) * timelineRef.current.scrollWidth
      timelineRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }, [days])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+") {
          e.preventDefault()
          handleZoom("in")
        } else if (e.key === "-") {
          e.preventDefault()
          handleZoom("out")
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleZoom])

  return (
    <TooltipProvider>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateTimeline("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateTimeline("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{ from: startDate, to: endDate }}
                  onSelect={(range) => {
                    if (range?.from) setStartDate(range.from)
                    if (range?.to) setEndDate(range.to)
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={scrollToToday}>
              Today
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(value: "timeline" | "calendar" | "list") => setViewMode(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline</SelectItem>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoom]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={([value]) => setZoom(value)}
              className="w-32"
            />
            <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                {/* Add your task creation form here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.priority} onValueChange={(value) => setFilter({ ...filter, priority: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={groupBy}
              onValueChange={(value: "none" | "status" | "assignee" | "priority") => setGroupBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="assignee">Assignee</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch checked={showWeekends} onCheckedChange={setShowWeekends} id="show-weekends" />
              <label htmlFor="show-weekends" className="text-sm">
                Show Weekends
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={showDependencies} onCheckedChange={setShowDependencies} id="show-dependencies" />
              <label htmlFor="show-dependencies" className="text-sm">
                Show Dependencies
              </label>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="relative" style={{ minWidth: `${days.length * 50 * zoom}px` }} ref={timelineRef}>
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
              <div className="flex">
                <div className="w-48 flex-shrink-0 p-2 font-medium dark:text-white">Task</div>
                <div className="flex-grow">
                  {days.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={`inline-block text-center p-2 border-r dark:border-gray-700 ${
                        isToday(day) ? "bg-blue-100 dark:bg-blue-900" : ""
                      }`}
                      style={{ width: `${50 * zoom}px` }}
                    >
                      <div className="text-xs font-medium dark:text-white">{format(day, "EEE")}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, "MMM d")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                <div key={groupName} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 px-4 dark:text-white">{groupName}</h3>
                  <Droppable droppableId={groupName} direction="vertical">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {groupTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <div className="w-48 flex-shrink-0 p-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-pointer" onClick={() => toggleTaskExpansion(task.id)}>
                                        <span className="text-sm font-medium dark:text-white">{task.name}</span>
                                        {expandedTask === task.id ? (
                                          <ChevronUp className="inline-block h-4 w-4 ml-1" />
                                        ) : (
                                          <ChevronDown className="inline-block h-4 w-4 ml-1" />
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{task.name}</p>
                                      <p>Status: {task.status}</p>
                                      <p>Priority: {task.priority}</p>
                                      <p>Assignee: {task.assignee.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="flex-grow relative" style={{ height: "40px" }}>
                                  <motion.div
                                    {...provided.dragHandleProps}
                                    className={`absolute top-1 h-8 ${getStatusColor(task.status)} rounded-md shadow-sm cursor-move`}
                                    style={{
                                      left: getTaskPosition(task),
                                      width: getTaskWidth(task),
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <div className="px-2 py-1 text-xs font-medium truncate dark:text-white">
                                      {task.name}
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>

            {showDependencies && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {tasks.flatMap((task) =>
                  (task.dependencies || []).map((depId) => {
                    const depTask = tasks.find((t) => t.id === depId)
                    if (!depTask) return null
                    const startX = Number.parseFloat(getTaskPosition(task)) + Number.parseFloat(getTaskWidth(task)) / 2
                    const endX = Number.parseFloat(getTaskPosition(depTask))
                    const startY = tasks.indexOf(task) * 40 + 20
                    const endY = tasks.indexOf(depTask) * 40 + 20
                    return (
                      <line
                        key={`${task.id}-${depId}`}
                        x1={`${startX}%`}
                        y1={startY}
                        x2={`${endX}%`}
                        y2={endY}
                        stroke={theme === "dark" ? "#4B5563" : "#9CA3AF"}
                        strokeWidth="2"
                        strokeDasharray="4"
                      />
                    )
                  }),
                )}
              </svg>
            )}
          </div>
        </ScrollArea>

        <AnimatePresence>
          {expandedTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            >
              <div className="p-4">
                {(() => {
                  const task = tasks.find((t) => t.id === expandedTask)
                  if (!task) return null
                  return (
                    <>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{task.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{task.priority}</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Assigned to: {task.assignee.name}
                        </span>
                      </div>
                      <Progress value={task.progress} className="mb-2" />
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onTaskEdit(task)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onTaskDelete(task.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

export default TimelineView

