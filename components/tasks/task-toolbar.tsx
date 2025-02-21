import type React from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DEPARTMENTS } from "@/lib/constants"
import type { ViewType, SortConfig } from "@/types/tasks"

interface TaskToolbarProps {
  view: ViewType
  onViewChange: (view: ViewType) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedDepartment: string
  onDepartmentChange: (department: string) => void
  onSort: (key: string) => void
  sortConfig: SortConfig | null
  onBulkAction: (action: "delete" | "changeStatus" | "changePriority", value?: string) => void
}

const TaskToolbar: React.FC<TaskToolbarProps> = ({
  view,
  onViewChange,
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  onSort,
  sortConfig,
  onBulkAction,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="task-search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Departments</SelectItem>
          {DEPARTMENTS.map((department) => (
            <SelectItem key={department} value={department}>
              {department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => onBulkAction("changeStatus", "Not Started")}>
            Set Status: Not Started
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("changeStatus", "In Progress")}>
            Set Status: In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("changeStatus", "Completed")}>
            Set Status: Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("changePriority", "Low")}>Set Priority: Low</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("changePriority", "Medium")}>
            Set Priority: Medium
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("changePriority", "High")}>Set Priority: High</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("delete")}>Delete Selected</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Sort</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSort("name")}>
            Name {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("dueDate")}>
            Due Date {sortConfig?.key === "dueDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("priority")}>
            Priority {sortConfig?.key === "priority" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Select value={view} onValueChange={(value: ViewType) => onViewChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="list">List View</SelectItem>
          <SelectItem value="board">Board View</SelectItem>
          <SelectItem value="timeline">Timeline View</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default TaskToolbar

