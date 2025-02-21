"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, GripVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Task, Group } from "@/types/tasks"

interface TimelineViewProps {
  groups: Group[]
}

const TimelineView = ({ groups }: TimelineViewProps) => {
  const [timelineStart, setTimelineStart] = useState(new Date())
  const [timelineEnd, setTimelineEnd] = useState(new Date())
  const [daysInView, setDaysInView] = useState(14)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Find the earliest start date and latest end date
    let earliest = new Date()
    let latest = new Date()

    groups.forEach((group) => {
      group.tasks.forEach((task) => {
        if (task.timeline) {
          const start = new Date(task.timeline.startDate)
          const end = new Date(task.timeline.endDate)
          if (start < earliest) earliest = start
          if (end > latest) latest = end
        }
      })
    })

    setTimelineStart(earliest)
    setTimelineEnd(latest)
  }, [groups])

  const getDaysBetween = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getPositionAndWidth = (task: Task) => {
    if (!task.timeline) return { left: 0, width: 0 }

    const start = new Date(task.timeline.startDate)
    const end = new Date(task.timeline.endDate)
    const totalDays = getDaysBetween(timelineStart, timelineEnd)
    const daysFromStart = getDaysBetween(timelineStart, start)
    const taskDuration = getDaysBetween(start, end)

    const left = (daysFromStart / totalDays) * 100
    const width = (taskDuration / totalDays) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  const getDates = () => {
    const dates = []
    const currentDate = new Date(timelineStart)
    while (currentDate <= timelineEnd) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
  }

  return (
    <div className="border rounded-lg">
      <div className="flex">
        {/* Left side - Group and task names */}
        <div className="w-[300px] flex-shrink-0 border-r">
          <div className="h-10 border-b bg-muted/50"></div>
          {groups.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
                <ChevronRight className="h-4 w-4" />
                <Badge className={`bg-${group.color}-100 text-${group.color}-700`}>{group.name}</Badge>
              </div>
              {group.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 p-2 border-b hover:bg-muted/50">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{task.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right side - Timeline */}
        <div className="flex-1 overflow-x-auto" ref={containerRef}>
          {/* Timeline header */}
          <div className="flex h-10 border-b bg-muted/50">
            {getDates().map((date, i) => (
              <div key={i} className="flex-shrink-0 w-[100px] px-2 py-1 border-r text-xs">
                {date.toLocaleDateString()}
              </div>
            ))}
          </div>

          {/* Timeline content */}
          {groups.map((group) => (
            <div key={group.id}>
              <div className="h-10 border-b bg-muted/30"></div>
              {group.tasks.map((task) => (
                <div key={task.id} className="relative h-10 border-b">
                  {task.timeline && (
                    <motion.div
                      className={`absolute top-2 h-6 rounded-full bg-${group.color}-100 border border-${group.color}-300`}
                      style={getPositionAndWidth(task)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center h-full px-2 gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={task.assignee.avatar} />
                          <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs whitespace-nowrap overflow-hidden">{task.name}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimelineView

