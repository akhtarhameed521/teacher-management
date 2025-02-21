import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TASK_STATUSES, PRIORITY_LEVELS, TASK_CATEGORIES, DEPARTMENTS, USERS } from "@/lib/constants"

interface TaskFiltersProps {
  setFilters: (filters: any) => void
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ setFilters }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select onValueChange={(value) => setFilters((prev: any) => ({ ...prev, status: value }))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setFilters((prev: any) => ({ ...prev, priority: value }))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {PRIORITY_LEVELS.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setFilters((prev: any) => ({ ...prev, category: value }))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {TASK_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setFilters((prev: any) => ({ ...prev, department: value }))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {DEPARTMENTS.map((department) => (
            <SelectItem key={department} value={department}>
              {department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setFilters((prev: any) => ({ ...prev, assignedTo: value }))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          {USERS.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TaskFilters

