"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Group, Task } from "@/types/tasks"

interface TaskFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
  groups: Group[]
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ isOpen, onClose, onSubmit, groups }) => {
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Not Started")
  const [priority, setPriority] = useState("Medium")
  const [groupId, setGroupId] = useState(groups[0]?.id || "")

  const handleSubmit = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: taskName,
      description,
      status,
      priority,
      groupId,
      dueDate: new Date().toISOString().split("T")[0],
      progress: 0,
      assignee: {
        name: "Unassigned",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      department: groups.find((g) => g.id === groupId)?.name || "",
      tags: [],
    }
    onSubmit(newTask)
    resetForm()
  }

  const resetForm = () => {
    setTaskName("")
    setDescription("")
    setStatus("Not Started")
    setPriority("Medium")
    setGroupId(groups[0]?.id || "")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="task-name" className="text-sm font-medium">
              Task Name
            </label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="task-status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="task-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="task-priority" className="text-sm font-medium">
              Priority
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="task-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="task-group" className="text-sm font-medium">
              Group
            </label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger id="task-group">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskFormDialog

