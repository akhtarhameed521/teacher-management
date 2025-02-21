import type React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TaskHeaderProps {
  onAddTask: () => void
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ onAddTask }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <Button onClick={onAddTask}>
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  )
}

export default TaskHeader

