"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Group } from "@/types/tasks"

interface BoardViewProps {
  groups: Group[]
  onUpdateGroups: (groups: Group[]) => void
}

const BoardView = ({ groups, onUpdateGroups }: BoardViewProps) => {
  const [columns] = useState([
    { id: "not-started", title: "Not Started", color: "bg-gray-100" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
    { id: "in-review", title: "In Review", color: "bg-yellow-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
    { id: "blocked", title: "Blocked", color: "bg-red-100" },
  ])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceDroppableId = source.droppableId
    const destinationDroppableId = destination.droppableId

    const [groupId, sourceStatus] = sourceDroppableId.split(":")
    const [destGroupId, destStatus] = destinationDroppableId.split(":")

    const newGroups = [...groups]
    const group = newGroups.find((g) => g.id === groupId)
    const destGroup = newGroups.find((g) => g.id === destGroupId)

    if (!group || !destGroup) return

    const [movedTask] = group.tasks.splice(source.index, 1)
    movedTask.status = destStatus

    if (groupId === destGroupId) {
      group.tasks.splice(destination.index, 0, movedTask)
    } else {
      movedTask.groupId = destGroupId
      destGroup.tasks.splice(destination.index, 0, movedTask)
    }

    onUpdateGroups(newGroups)
  }

  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-[600px]">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-[300px] bg-muted/30 rounded-lg">
          <div className={`p-3 ${column.color} rounded-t-lg border-b`}>
            <h3 className="font-medium">{column.title}</h3>
          </div>
          <div className="p-2">
            {groups.map((group) => (
              <div key={group.id} className="mb-6">
                <div className="flex items-center gap-2 p-2 mb-2">
                  <Badge className={`bg-${group.color}-100 text-${group.color}-700 border-${group.color}-300`}>
                    {group.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {group.tasks.filter((t) => t.status.toLowerCase().replace(" ", "-") === column.id).length} tasks
                  </span>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={`${group.id}:${column.id}`}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {group.tasks
                          .filter((task) => task.status.toLowerCase().replace(" ", "-") === column.id)
                          .map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-background rounded-lg shadow-sm border p-3"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className="font-medium mb-1">{task.name}</h4>
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {task.tags.map((tag) => (
                                          <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <Badge
                                      className={`bg-${task.priority.toLowerCase()}-100 text-${task.priority.toLowerCase()}-700`}
                                    >
                                      {task.priority}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignee.avatar} />
                                        <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{task.assignee.name}</span>
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-muted-foreground">Progress</span>
                                        <span className="text-xs font-medium">{task.progress}%</span>
                                      </div>
                                      <Progress value={task.progress} className="h-1" />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                      {task.timeline && (
                                        <span>
                                          {Math.ceil(
                                            (new Date(task.timeline.endDate).getTime() -
                                              new Date(task.timeline.startDate).getTime()) /
                                              (1000 * 60 * 60 * 24),
                                          )}{" "}
                                          days
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            ))}
            <Button variant="ghost" className="w-full border-2 border-dashed mt-2" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BoardView

