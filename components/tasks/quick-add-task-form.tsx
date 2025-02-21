"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task } from "@/types/tasks"

interface QuickAddTaskFormProps {
  onSubmit: (task: Partial<Task>) => void
}

const QuickAddTaskForm: React.FC<QuickAddTaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({
        title,
        status: "Not Started",
        priority: "Medium",
        dueDate: new Date().toISOString(),
      })
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Quick add task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">Add</Button>
    </form>
  )
}

export default QuickAddTaskForm

