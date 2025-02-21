"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoreHorizontal, Plus } from "lucide-react"
import { WhatsAppIntegration } from "@/components/whatsapp-integration"

// Mock data for tasks
const initialTasks = [
  {
    id: "task1",
    title: "Prepare lesson plan for next week",
    description: "Create a detailed lesson plan for the upcoming Math 101 class",
    status: "todo",
    priority: "high",
    dueDate: "2026-03-15",
    assignedBy: "John Doe",
    category: "Lesson Planning",
  },
  {
    id: "task2",
    title: "Grade midterm exams",
    description: "Review and grade the midterm exams for Science 202",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-03-18",
    assignedBy: "Jane Smith",
    category: "Grading",
  },
  {
    id: "task3",
    title: "Attend parent-teacher conference",
    description: "Meet with parents to discuss student progress",
    status: "todo",
    priority: "high",
    dueDate: "2026-03-20",
    assignedBy: "Principal Johnson",
    category: "Meetings",
  },
  {
    id: "task4",
    title: "Submit quarterly report",
    description: "Compile and submit the quarterly performance report",
    status: "completed",
    priority: "medium",
    dueDate: "2026-03-10",
    assignedBy: "Admin Team",
    category: "Reporting",
  },
  {
    id: "task5",
    title: "Prepare for science fair",
    description: "Assist students in preparing their projects for the upcoming science fair",
    status: "in-progress",
    priority: "low",
    dueDate: "2026-04-05",
    assignedBy: "Science Department",
    category: "Extracurricular",
  },
]

const taskCategories = ["Lesson Planning", "Grading", "Meetings", "Reporting", "Extracurricular"]

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTask, setSelectedTask] = useState<(typeof initialTasks)[0] | null>(null)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const newTasks = Array.from(tasks)
    const [reorderedItem] = newTasks.splice(result.source.index, 1)
    newTasks.splice(result.destination.index, 0, reorderedItem)

    setTasks(
      newTasks.map((task) =>
        task.id === reorderedItem.id ? { ...task, status: result.destination.droppableId } : task,
      ),
    )
  }

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: `task${tasks.length + 1}`, status: "todo" }])
  }

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">My Tasks</h1>
        <AddTaskDialog onAddTask={addTask} />
      </header>

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">Task Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <TaskBoard tasks={tasks} onDragEnd={onDragEnd} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView tasks={tasks} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </TabsContent>

        <TabsContent value="metrics">
          <PerformanceMetrics tasks={tasks} />
        </TabsContent>
      </Tabs>

      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
      <div className="mt-6">
        <WhatsAppIntegration />
      </div>
    </div>
  )
}

function TaskBoard({ tasks, onDragEnd, onUpdateTask, onDeleteTask }) {
  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ]

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <h2 className="text-xl font-semibold">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-secondary p-4 rounded-lg min-h-[500px]"
                >
                  <AnimatePresence>
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <TaskCard task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

function TaskCard({ task, onUpdate, onDelete }) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdate({ ...task, status: "todo" })}>Move to To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate({ ...task, status: "in-progress" })}>
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate({ ...task, status: "completed" })}>
                Move to Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm">
          <Badge variant="outline">{task.category}</Badge>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Priority: {task.priority}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Assigned by: {task.assignedBy}</CardFooter>
    </Card>
  )
}

function CalendarView({ tasks, selectedDate, setSelectedDate }) {
  const startDate = startOfWeek(selectedDate || new Date())
  const endDate = endOfWeek(selectedDate || new Date())
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Calendar View</h2>
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <Card key={day.toISOString()} className="p-2">
            <CardHeader className="p-2">
              <CardTitle className="text-center">{format(day, "EEE")}</CardTitle>
              <CardDescription className="text-center">{format(day, "d")}</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-40">
                {tasks
                  .filter((task) => task.dueDate === format(day, "yyyy-MM-dd"))
                  .map((task) => (
                    <div key={task.id} className="mb-2 p-2 bg-secondary rounded-md text-xs">
                      <div className="font-semibold">{task.title}</div>
                      <div className="text-muted-foreground">{task.category}</div>
                    </div>
                  ))}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PerformanceMetrics({ tasks }) {
  const completedTasks = tasks.filter((task) => task.status === "completed")
  const completionRate = (completedTasks.length / tasks.length) * 100

  const tasksByCategory = taskCategories.map((category) => ({
    category,
    count: tasks.filter((task) => task.category === category).length,
  }))

  const taskCompletionTrend = [
    { date: "Mon", completed: 3 },
    { date: "Tue", completed: 5 },
    { date: "Wed", completed: 2 },
    { date: "Thu", completed: 4 },
    { date: "Fri", completed: 6 },
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-4xl font-bold">{completionRate.toFixed(1)}%</div>
            <BarChart
              data={[{ name: "Completion Rate", value: completionRate }]}
              index="name"
              categories={["value"]}
              valueFormatter={(value) => `${value.toFixed(1)}%`}
              className="w-[300px] h-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={tasksByCategory}
              index="category"
              categories={["count"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} tasks`}
              className="w-full aspect-[4/3]"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={taskCompletionTrend}
              index="date"
              categories={["completed"]}
              colors={["green"]}
              valueFormatter={(value) => `${value} tasks`}
              className="w-full aspect-[4/3]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AddTaskDialog({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    category: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTask({ ...newTask, assignedBy: "Self" })
    setIsOpen(false)
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "", category: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task for your to-do list.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="col-span-3"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <select
                id="category"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="col-span-3"
              >
                <option value="">Select a category</option>
                {taskCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TaskDetailsDialog({ task, onClose, onUpdate, onDelete }) {
  const [editedTask, setEditedTask] = useState(task)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(editedTask)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>View and edit task details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <select
                id="priority"
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="col-span-3"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <select
                id="category"
                value={editedTask.category}
                onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                className="col-span-3"
              >
                {taskCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                className="col-span-3"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
            <Button type="submit">Update Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

