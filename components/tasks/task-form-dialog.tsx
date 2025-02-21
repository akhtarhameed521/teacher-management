import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TaskForm from "@/components/tasks/task-form"
import type { Task } from "@/types/tasks"

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (task: Task) => void
  title: string
  task?: Task | null
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ open, onOpenChange, onSubmit, title, task }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <TaskForm task={task} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default TaskFormDialog

