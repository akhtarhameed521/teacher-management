"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Group, Task } from "@/types/tasks"

interface TaskTimelineViewProps {
  groups: Group[]
  onTaskEdit: (task: Task) => void
  onTaskDelete: (taskId: string) => void
  onAddTask: () => void
}

const TaskTimelineView: React.FC<TaskTimelineViewProps> = ({ groups, onTaskEdit, onTaskDelete, onAddTask }) => {
  const today = new Date()
  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const getPositionPercentage = (date: string) => {
    const taskDate = new Date(date)
    const totalDays = (oneWeekLater.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    const daysPassed = (taskDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    return (daysPassed / totalDays) * 100
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="relative">
        <div className="flex justify-between mb-2">
          {[...Array(8)].map((_, index) => {
            const date = new Date(today.getTime() + index * 24 * 60 * 60 * 1000)
            return (
              <div key={index} className="text-sm text-muted-foreground">
                {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
            )
          })}
        </div>
        <div className="h-px bg-border mb-4" />
        {groups.map((group) => (
          <div key={group.id} className="mb-8">
            <h3 className="font-semibold mb-2">{group.name}</h3>
            <div className="relative h-20">
              {group.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className="absolute top-0 bg-primary/20 rounded-full p-2 cursor-pointer"
                  style={{
                    left: `${getPositionPercentage(task.dueDate)}%`,
                    transform: "translateX(-50%)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onTaskEdit(task)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium">{task.name}</span>
                    <Badge variant="outline" className="mt-1">
                      {task.priority}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onAddTask} className="mt-4">
        Add Task
      </Button>
    </ScrollArea>
  )
}

export default TaskTimelineView

