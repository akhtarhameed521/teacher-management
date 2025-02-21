"use client"

import { useState, useCallback, useMemo } from "react"
import { format } from "date-fns"
import { Search, Plus, Bell, Users, Settings, LayoutGrid, Calendar, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TaskAssignmentDialog } from "@/components/task-assignment-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import type { ViewType } from "@/types/tasks"

// Sample data (unchanged)
const TEACHERS = [
  { id: "1", name: "Mohamed Hashim Mohamed Ali", class: "Fnd-01" },
  { id: "2", name: "Mohamed Dol", class: "Fnd-02" },
  { id: "3", name: "Ameen Daniel", class: "Fnd-03" },
  { id: "4", name: "Abdul Raqib Choudhury", class: "Fnd-04" },
  { id: "5", name: "Hamid Hashim", class: "Fnd-05" },
  { id: "6", name: "Brahim Dafiri", class: "Fnd-06" },
  { id: "7", name: "Makhtar Hussien Aidid", class: "Fnd-07" },
  { id: "8", name: "Farah Egal", class: "Fnd-08" },
  { id: "9", name: "Murshad Twaibu Bonomali", class: "Fnd-09" },
  { id: "10", name: "Shaheen Mangal", class: "Fnd-10" },
  { id: "11", name: "Abdirahman Hassan Mohamed", class: "Fnd-11" },
  { id: "12", name: "Razeehn Achmad", class: "Fnd-12" },
  { id: "13", name: "Issa Mckey", class: "Fnd-13" },
  { id: "14", name: "Yaquob Ali", class: "Fnd-14" },
]

const INITIAL_TASKS = [
  {
    id: "1",
    name: "Develop speaking exercises for intermediate students",
    description: "Create a set of speaking exercises focusing on everyday conversations for intermediate ESL students.",
    assignee: TEACHERS[0],
    dueDate: "2023-08-15",
    status: "In Progress",
    department: "English",
  },
  {
    id: "2",
    name: "Create grammar lesson plans for past perfect tense",
    description: "Develop comprehensive lesson plans to teach the past perfect tense to advanced ESL students.",
    assignee: TEACHERS[1],
    dueDate: "2023-08-20",
    status: "Not Started",
    department: "English",
  },
  {
    id: "3",
    name: "Design vocabulary worksheets for beginners",
    description:
      "Create engaging vocabulary worksheets for beginner ESL students, focusing on everyday objects and actions.",
    assignee: TEACHERS[2],
    dueDate: "2023-08-10",
    status: "Completed",
    department: "English",
  },
]

const STATUS_COLORS = {
  "Not Started": "bg-amber-500 text-amber-50",
  "In Progress": "bg-blue-500 text-blue-50",
  Completed: "bg-green-500 text-green-50",
}

export default function TasksPage() {
  const [viewType, setViewType] = useState<ViewType>("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const { toast } = useToast()

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [tasks, searchTerm])

  const handleAssignTask = useCallback((newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }, [])

  const handleUpdateTask = useCallback(
    (taskId: string, update: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, status: "In Progress", lastUpdate: update } : task)),
      )
      setIsUpdateDialogOpen(false)
      setUpdateMessage("")
      toast({
        title: "Task Updated",
        description: "The task has been successfully updated.",
      })
    },
    [toast],
  )

  const handleSendReminder = useCallback(
    (taskId: string) => {
      toast({
        title: "Reminder Sent",
        description: "A reminder has been sent to the assigned teacher.",
      })
    },
    [toast],
  )

  const renderTaskList = () => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6 mt-8"
      >
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.name}</h3>
                <Badge
                  className={`${STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]} text-xs font-medium px-2 py-1`}
                >
                  {task.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.assignee.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.assignee.class}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTask(task)
                      setIsUpdateDialogOpen(true)
                    }}
                  >
                    Update
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSendReminder(task.id)}>
                    Remind
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ESL Teaching Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your teaching assignments</p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64 bg-white dark:bg-gray-800"
              />
            </div>
            <Tabs
              value={viewType}
              onValueChange={(value) => setViewType(value as ViewType)}
              className="bg-white dark:bg-gray-800 p-1 rounded-md shadow-sm"
            >
              <TabsList>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger
                  value="board"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Board
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsAssignDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign Task
            </Button>
          </div>
        </div>

        {viewType === "list" && renderTaskList()}
        {/* Implement Board and Calendar views here */}

        <TaskAssignmentDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          onAssign={handleAssignTask}
          teachers={TEACHERS}
        />

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Task: {selectedTask?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Enter task update..."
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => handleUpdateTask(selectedTask?.id, updateMessage)}>
                Update Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

