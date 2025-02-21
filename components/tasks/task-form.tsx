import type React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/types/tasks"
import { TASK_STATUSES, PRIORITY_LEVELS, DEPARTMENTS } from "@/lib/constants"

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  dueDate: z.string().min(1, "Due date is required"),
  department: z.string().min(1, "Department is required"),
  assignee: z.object({
    name: z.string().min(1, "Assignee name is required"),
    avatar: z.string().optional(),
  }),
})

interface TaskFormProps {
  task?: Task | null
  onSubmit: (task: Task) => void
  onCancel: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: task || {
      name: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      department: "",
      assignee: { name: "", avatar: "" },
      progress: 0,
      tags: [],
      groupId: "",
    },
  })

  const onSubmitForm = (data: Task) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Task name" error={errors.name?.message} />}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea {...field} placeholder="Task description" error={errors.description?.message} />
        )}
      />
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value} error={errors.status?.message}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value} error={errors.priority?.message}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_LEVELS.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => <Input type="date" {...field} error={errors.dueDate?.message} />}
      />
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value} error={errors.department?.message}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name="assignee.name"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Assignee name" error={errors.assignee?.name?.message} />}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? "Update Task" : "Add Task"}</Button>
      </div>
    </form>
  )
}

export default TaskForm

