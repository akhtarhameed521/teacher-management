"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { motion } from "framer-motion"
import { ChevronRight, MoreHorizontal, Paperclip, Link, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type { Group, Task } from "@/types/tasks"

interface TableViewProps {
  groups: Group[]
  columns: { id: string; name: string }[]
  onUpdateGroups: (groups: Group[]) => void
  onTaskClick: (task: Task) => void
  onTaskSelect: (taskId: string) => void
  selectedTasks: string[]
}

const TableView: React.FC<TableViewProps> = ({
  groups,
  columns,
  onUpdateGroups,
  onTaskClick,
  onTaskSelect,
  selectedTasks,
}) => {
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const sourceGroupId = result.source.droppableId.split(":")[0]
    const destGroupId = result.destination.droppableId.split(":")[0]

    const newGroups = [...groups]
    const sourceGroup = newGroups.find((g) => g.id === sourceGroupId)
    const destGroup = newGroups.find((g) => g.id === destGroupId)

    if (!sourceGroup || !destGroup) return

    const [movedTask] = sourceGroup.tasks.splice(result.source.index, 1)
    movedTask.groupId = destGroupId
    destGroup.tasks.splice(result.destination.index, 0, movedTask)

    onUpdateGroups(newGroups)
  }

  const handleCellEdit = (taskId: string, field: string, value: string) => {
    const newGroups = groups.map((group) => ({
      ...group,
      tasks: group.tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)),
    }))
    onUpdateGroups(newGroups)
    setEditingCell(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string, field: string, value: string) => {
    if (e.key === "Enter") {
      handleCellEdit(taskId, field, value)
    } else if (e.key === "Escape") {
      setEditingCell(null)
    }
  }

  const toggleSubtasks = (taskId: string) => {
    const newGroups = groups.map((group) => ({
      ...group,
      tasks: group.tasks.map((task) => (task.id === taskId ? { ...task, showSubtasks: !task.showSubtasks } : task)),
    }))
    onUpdateGroups(newGroups)
  }

  const addSubtask = (parentTaskId: string) => {
    const newGroups = groups.map((group) => ({
      ...group,
      tasks: group.tasks.map((task) => {
        if (task.id === parentTaskId) {
          const newSubtask: Task = {
            id: `subtask-${Date.now()}`,
            name: "New Subtask",
            status: "Not Started",
            priority: "Medium",
            dueDate: new Date().toISOString().split("T")[0],
            progress: 0,
            assignee: task.assignee,
            department: task.department,
            tags: [],
            groupId: task.groupId,
          }
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask],
            showSubtasks: true,
          }
        }
        return task
      }),
    }))
    onUpdateGroups(newGroups)
  }

  return (
    <ScrollArea className="border rounded-lg">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[30px,30px,1fr,repeat(5,120px)] gap-4 p-4 border-b bg-muted/50">
          <div></div>
          <div></div>
          <div className="font-medium">Task Name</div>
          {columns.map((column) => (
            <div key={column.id} className="font-medium">
              {column.name}
            </div>
          ))}
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {groups.map((group) => (
            <Droppable key={group.id} droppableId={`${group.id}:tasks`}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <div
                    className="grid grid-cols-[30px,30px,1fr] p-4 border-b hover:bg-muted/30 cursor-pointer"
                    onClick={() => toggleSubtasks(group.id)}
                  >
                    <ChevronRight className={`h-4 w-4 transition-transform ${group.isExpanded ? "rotate-90" : ""}`} />
                    <div></div>
                    <div className="font-medium">
                      <Badge className={`bg-${group.color}-100 text-${group.color}-700`}>{group.name}</Badge>
                    </div>
                  </div>

                  {group.isExpanded &&
                    group.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <>
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="grid grid-cols-[30px,30px,1fr,repeat(5,120px)] gap-4 p-4 border-b hover:bg-muted/50"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center justify-center">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={selectedTasks.includes(task.id)}
                                  onCheckedChange={() => onTaskSelect(task.id)}
                                />
                              </div>
                              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTaskClick(task)}>
                                {editingCell?.taskId === task.id && editingCell?.field === "name" ? (
                                  <Input
                                    ref={inputRef}
                                    value={task.name}
                                    onChange={(e) => handleCellEdit(task.id, "name", e.target.value)}
                                    onBlur={() => setEditingCell(null)}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, task.id, "name", (e.target as HTMLInputElement).value)
                                    }
                                  />
                                ) : (
                                  <span onDoubleClick={() => setEditingCell({ taskId: task.id, field: "name" })}>
                                    {task.name}
                                  </span>
                                )}
                                {task.subtasks && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 cursor-pointer"
                                    onClick={() => toggleSubtasks(task.id)}
                                  >
                                    {task.subtasks.length} subtasks
                                  </Badge>
                                )}
                                {task.attachments && <Paperclip className="h-4 w-4 text-muted-foreground" />}
                                {task.dependencies && <Link className="h-4 w-4 text-muted-foreground" />}
                              </div>
                              {columns.map((column) => (
                                <div key={column.id}>
                                  {column.id === "status" && (
                                    <Badge className={`${task.status.toLowerCase().replace(" ", "-")}`}>
                                      {task.status}
                                    </Badge>
                                  )}
                                  {column.id === "priority" && (
                                    <Badge className={`${task.priority.toLowerCase()}`}>{task.priority}</Badge>
                                  )}
                                  {column.id === "dueDate" && (
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                  {column.id === "progress" && (
                                    <div>
                                      <Progress value={task.progress} className="h-2" />
                                      <span className="text-xs text-muted-foreground mt-1">{task.progress}%</span>
                                    </div>
                                  )}
                                  {column.id === "assignee" && (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignee.avatar} />
                                        <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{task.assignee.name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </motion.div>
                            {task.showSubtasks && task.subtasks && (
                              <div className="pl-8">
                                {task.subtasks.map((subtask, subtaskIndex) => (
                                  <motion.div
                                    key={subtask.id}
                                    className="grid grid-cols-[30px,1fr,repeat(5,120px)] gap-4 p-4 border-b hover:bg-muted/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: subtaskIndex * 0.05 }}
                                  >
                                    {/* Render subtask content similar to main tasks */}
                                    {/* ... */}
                                  </motion.div>
                                ))}
                                <Button variant="ghost" size="sm" className="mt-2" onClick={() => addSubtask(task.id)}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Subtask
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </ScrollArea>
  )
}

export default TableView

