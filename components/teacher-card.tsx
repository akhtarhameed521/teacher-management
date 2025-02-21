"use client"

import { motion } from "framer-motion"
import { Draggable } from "react-beautiful-dnd"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TeacherCardProps {
  teacher: {
    id: string
    name: string
    avatar: string
    expertise: string
    coverCount: number
  }
  index: number
}

export function TeacherCard({ teacher, index }: TeacherCardProps) {
  return (
    <Draggable draggableId={teacher.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-2 rounded-md flex items-center space-x-2 transition-all",
            snapshot.isDragging
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-secondary hover:bg-secondary/80",
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={teacher.avatar} />
            <AvatarFallback>{teacher.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="font-medium">{teacher.name}</div>
            <div className="text-sm text-muted-foreground">{teacher.expertise}</div>
          </div>
          <Badge variant="outline">Covers: {teacher.coverCount}</Badge>
        </motion.div>
      )}
    </Draggable>
  )
}

