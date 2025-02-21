"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: {
    id: string
    number: number
    time: string
  }
  coverAssignment: string | undefined
  teachers: any[]
  selectedClass: any
}

export function SessionCard({ session, coverAssignment, teachers, selectedClass }: SessionCardProps) {
  const getSessionStatus = () => {
    if (coverAssignment) return "covered"
    if (selectedClass) return "active"
    return "unavailable"
  }

  const sessionColors = {
    active: "bg-green-100 border-green-300 text-green-800",
    covered: "bg-blue-100 border-blue-300 text-blue-800",
    unavailable: "bg-gray-100 border-gray-300 text-gray-500",
  }

  return (
    <Droppable droppableId={session.id}>
      {(provided, snapshot) => (
        <motion.div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={cn(
            "p-4 rounded-md transition-colors",
            sessionColors[getSessionStatus()],
            snapshot.isDraggingOver && "ring-2 ring-primary",
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Session {session.number}</span>
            <span className="text-sm text-muted-foreground">{session.time}</span>
          </div>
          <AnimatePresence mode="wait">
            {coverAssignment ? (
              <Draggable key={coverAssignment} draggableId={coverAssignment} index={0}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md",
                      snapshot.isDragging ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary",
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={teachers.find((t) => t.id === coverAssignment)?.avatar} />
                      <AvatarFallback>{teachers.find((t) => t.id === coverAssignment)?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{teachers.find((t) => t.id === coverAssignment)?.name}</span>
                    <Badge variant="secondary">Cover</Badge>
                  </motion.div>
                )}
              </Draggable>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${selectedClass.englishInstructor[0]}`} />
                  <AvatarFallback>{selectedClass.englishInstructor[0]}</AvatarFallback>
                </Avatar>
                <span>{selectedClass.englishInstructor}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  )
}

