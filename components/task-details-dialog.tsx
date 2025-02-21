"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Tags, AlertCircle, CheckCircle2 } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Task } from "@/types/tasks"

interface TaskDetailsDialogProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
}

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  createdAt: string
}

interface Activity {
  id: string
  user: {
    name: string
    avatar: string
  }
  action: string
  createdAt: string
}

const TaskDetailsDialog = ({ task, isOpen, onClose, onUpdate }: TaskDetailsDialogProps) => {
  const [editedTask, setEditedTask] = useState<Task | null>(task)
  const [activeTab, setActiveTab] = useState("overview")
  const [newComment, setNewComment] = useState("")

  if (!task || !editedTask) return null

  const handleUpdate = () => {
    if (editedTask) {
      onUpdate(editedTask)
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Math.random().toString(),
      user: {
        name: "Current User",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    setEditedTask({
      ...editedTask,
      comments: [...(editedTask.comments || []), comment],
    })
    setNewComment("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <Input
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
              className="text-2xl font-bold h-auto px-0 border-0 focus-visible:ring-0"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-full">
          <div className="flex-1">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(80vh-12rem)] mt-4">
                <TabsContent value="overview" className="m-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-sm">
                            {editedTask.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-sm">
                            {editedTask.priority}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={editedTask.description || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        placeholder="Add a more detailed description..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Progress</label>
                      <div className="space-y-2">
                        <Progress value={editedTask.progress} className="h-2" />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editedTask.progress}
                          onChange={(e) => setEditedTask({ ...editedTask, progress: Number.parseInt(e.target.value) })}
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timeline</label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(editedTask.dueDate), "MMM d, yyyy")}</span>
                        </div>
                        {editedTask.timeline && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(new Date(editedTask.timeline.startDate), "MMM d")} -
                              {format(new Date(editedTask.timeline.endDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {editedTask.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm" className="h-6">
                          <Tags className="h-3 w-3 mr-1" />
                          Add Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="updates" className="m-0">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write an update..."
                          className="mb-2"
                        />
                        <Button onClick={handleAddComment}>Add Update</Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {editedTask.comments?.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar>
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.user.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <p className="mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="m-0">
                  <div className="space-y-4">
                    {editedTask.activities?.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.user.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          <div className="w-64 border-l pl-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Assignee</h3>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={editedTask.assignee.avatar} />
                    <AvatarFallback>{editedTask.assignee.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{editedTask.assignee.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Department</h3>
                <Badge variant="outline">{editedTask.department}</Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Flag as Blocked
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDetailsDialog

