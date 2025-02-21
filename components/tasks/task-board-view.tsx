import type React from "react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Group, Task } from "@/types/tasks"

interface TaskBoardViewProps {
  groups: Group[]
  onTaskEdit: (task: Task) => void
  onTaskDelete: (taskId: string) => void
  onAddTask: () => void
}

const TaskBoardView: React.FC<TaskBoardViewProps> = ({ groups, onTaskEdit, onTaskDelete, onAddTask }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {groups.map((group) => (
        <Droppable key={group.id} droppableId={group.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-muted/30 rounded-lg p-4 w-80 flex-shrink-0"
            >
              <h3 className="font-semibold mb-4">{group.name}</h3>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {group.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-card p-4 rounded-lg shadow-sm mb-2 cursor-move"
                      >
                        <div className="flex flex-col space-y-2">
                          <span className="font-medium">{task.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge>{task.status}</Badge>
                            <Badge variant="outline">{task.priority}</Badge>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => onTaskEdit(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onTaskDelete(task.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ScrollArea>
              <Button variant="ghost" className="w-full mt-4" onClick={onAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  )
}

export default TaskBoardView

