"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const periods = [1, 2, 3, 4, 5, 6]

const CoverAssignment = ({ classes, teachers, onAssignCover }) => {
  const [selectedClass, setSelectedClass] = useState(null)
  const [coverAssignments, setCoverAssignments] = useState({})

  useEffect(() => {
    if (selectedClass) {
      const initialAssignments = {}
      periods.forEach((period) => {
        if (selectedClass.schedule[period] !== "break") {
          initialAssignments[`period-${period}`] = []
        }
      })
      setCoverAssignments(initialAssignments)
    }
  }, [selectedClass])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const updatedAssignments = { ...coverAssignments }

    // Remove from the source
    if (source.droppableId !== "teachers") {
      updatedAssignments[source.droppableId] = updatedAssignments[source.droppableId].filter((id) => id !== draggableId)
    }

    // Add to the destination
    if (destination.droppableId !== "teachers") {
      if (!updatedAssignments[destination.droppableId]) {
        updatedAssignments[destination.droppableId] = []
      }
      // Ensure only one teacher is assigned per period
      updatedAssignments[destination.droppableId] = [draggableId]
    }

    setCoverAssignments(updatedAssignments)
    onAssignCover(updatedAssignments)
  }

  const getTeacherColor = (teacherId) => {
    const colors = [
      "bg-red-200 text-red-800",
      "bg-blue-200 text-blue-800",
      "bg-green-200 text-green-800",
      "bg-yellow-200 text-yellow-800",
      "bg-purple-200 text-purple-800",
      "bg-pink-200 text-pink-800",
      "bg-indigo-200 text-indigo-800",
      "bg-teal-200 text-teal-800",
    ]
    return colors[teacherId % colors.length]
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Cover Assignment</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Assign Cover</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign Cover</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class" className="text-right">
                Select Class
              </Label>
              <Select onValueChange={(value) => setSelectedClass(classes.find((c) => c.id === Number.parseInt(value)))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name} - {cls.teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClass && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-6 gap-4">
                  {periods.map((period) => (
                    <Droppable key={period} droppableId={`period-${period}`}>
                      {(provided, snapshot) => (
                        <Card
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`${snapshot.isDraggingOver ? "bg-secondary" : ""}`}
                        >
                          <CardHeader>
                            <CardTitle>Period {period}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedClass.schedule[period] === "break" ? (
                              <Badge variant="secondary">Break</Badge>
                            ) : (
                              coverAssignments[`period-${period}`]?.map((teacherId, index) => {
                                const teacher = teachers.find((t) => t.id.toString() === teacherId)
                                return (
                                  <Draggable key={teacherId} draggableId={teacherId} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`p-2 mb-2 rounded flex items-center ${getTeacherColor(Number.parseInt(teacherId))}`}
                                      >
                                        <Avatar className="h-6 w-6 mr-2">
                                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {teacher.name}
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })
                            )}
                            {provided.placeholder}
                          </CardContent>
                        </Card>
                      )}
                    </Droppable>
                  ))}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Available Teachers</h3>
                  <Droppable droppableId="teachers" direction="horizontal">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2">
                        {teachers.map((teacher, index) => (
                          <Draggable key={teacher.id} draggableId={teacher.id.toString()} index={index}>
                            {(provided) => (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-2 rounded flex items-center ${getTeacherColor(teacher.id)}`}
                                    >
                                      <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      {teacher.name}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{teacher.subject}</p>
                                    <p>Classes: {teacher.classes}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CoverAssignment

