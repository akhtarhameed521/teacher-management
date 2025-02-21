import type React from "react"
import type { Task } from "@/types/tasks"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface TaskTableProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onSort: (key: keyof Task) => void
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete, onSort }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort("title")}>Title</TableHead>
          <TableHead onClick={() => onSort("assignedTo")}>Assigned To</TableHead>
          <TableHead onClick={() => onSort("dueDate")}>Due Date</TableHead>
          <TableHead onClick={() => onSort("status")}>Status</TableHead>
          <TableHead onClick={() => onSort("priority")}>Priority</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              {task.assignedTo.map((teacher) => (
                <div key={teacher.id}>{teacher.name}</div>
              ))}
            </TableCell>
            <TableCell>{format(new Date(task.dueDate), "PPP")}</TableCell>
            <TableCell>{task.status}</TableCell>
            <TableCell>
              <Badge>{task.priority}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TaskTable

