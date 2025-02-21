"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import TaskDetailsDialog from "@/components/task-details-dialog"
import type { Task } from "@/types/tasks"

const TaskPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    // In a real app, fetch task data from API
    // For now, we'll use mock data
    setTask({
      id: params.id,
      name: "Sample Task",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-03-01",
      progress: 65,
      assignee: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      department: "Academic",
      tags: ["curriculum", "2024", "planning"],
      groupId: "g1",
      description: "This is a sample task description.",
      timeline: {
        startDate: "2024-02-01",
        endDate: "2024-03-01",
      },
      comments: [],
      activities: [],
    })
  }, [params.id])

  const handleClose = () => {
    router.push("/manager/tasks")
  }

  const handleUpdate = (updatedTask: Task) => {
    setTask(updatedTask)
    // In a real app, save to API
    handleClose()
  }

  return (
    <div>
      <Button variant="ghost" onClick={handleClose} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tasks
      </Button>

      <TaskDetailsDialog task={task} isOpen={true} onClose={handleClose} onUpdate={handleUpdate} />
    </div>
  )
}

export default TaskPage

