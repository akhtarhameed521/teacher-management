import type React from "react"
import { useState } from "react"
import type { Task } from "@/types/tasks"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TaskCalendarProps {
  tasks: Task[]
  onEdit: (task: Task) => void
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onEdit }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const tasksOnSelectedDate = tasks.filter(
    (task) => new Date(task.dueDate).toDateString() === selectedDate?.toDateString(),
  )

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Tasks on {selectedDate?.toDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksOnSelectedDate.length > 0 ? (
              <ul className="space-y-2">
                {tasksOnSelectedDate.map((task) => (
                  <li key={task.id} className="flex items-center space-x-2">
                    <Badge
                      className={
                        task.priority === "High"
                          ? "bg-red-500"
                          : task.priority === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <span className="cursor-pointer hover:underline" onClick={() => onEdit(task)}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks scheduled for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TaskCalendar

