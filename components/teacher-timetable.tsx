"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

type Session = {
  id: string
  subject: string
  startTime: string
  endTime: string
  room: string
}

type Break = {
  id: string
  startTime: string
  endTime: string
}

type DaySchedule = {
  sessions: Session[]
  breaks: Break[]
}

type WeekSchedule = {
  [day: string]: DaySchedule
}

// Mock data for the teacher's schedule
const mockSchedule: WeekSchedule = {
  Monday: {
    sessions: [
      { id: "1", subject: "Math 101", startTime: "08:00", endTime: "09:30", room: "Room A1" },
      { id: "2", subject: "Science", startTime: "10:00", endTime: "11:30", room: "Lab B2" },
      { id: "3", subject: "English", startTime: "13:00", endTime: "14:30", room: "Room C3" },
    ],
    breaks: [
      { id: "1", startTime: "09:30", endTime: "10:00" },
      { id: "2", startTime: "11:30", endTime: "13:00" },
    ],
  },
  Tuesday: {
    sessions: [
      { id: "4", subject: "History", startTime: "08:00", endTime: "09:30", room: "Room D4" },
      { id: "5", subject: "Geography", startTime: "10:00", endTime: "11:30", room: "Room E5" },
      { id: "6", subject: "Art", startTime: "13:00", endTime: "14:30", room: "Art Studio" },
    ],
    breaks: [
      { id: "3", startTime: "09:30", endTime: "10:00" },
      { id: "4", startTime: "11:30", endTime: "13:00" },
    ],
  },
  Wednesday: { sessions: [], breaks: [] },
  Thursday: { sessions: [], breaks: [] },
  Friday: { sessions: [], breaks: [] },
}

export function TeacherTimetable({ teacherId }: { teacherId: number }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const schedule = mockSchedule

  const getClassColor = (subject: string) => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
    ]
    const hash = subject.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0)
    return colors[hash % colors.length]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            {Object.keys(schedule).map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                className="mr-2 mb-2"
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        {selectedDay && (
          <div className="mt-4 space-y-4">
            <h3 className="font-semibold">{selectedDay}'s Schedule</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule[selectedDay].sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {session.startTime} - {session.endTime}
                    </TableCell>
                    <TableCell>
                      <Badge className={getClassColor(session.subject)}>{session.subject}</Badge>
                    </TableCell>
                    <TableCell>{session.room}</TableCell>
                    <TableCell>
                      {format(
                        new Date(`2000-01-01T${session.endTime}:00`) - new Date(`2000-01-01T${session.startTime}:00`),
                        "H'h' mm'm'",
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {schedule[selectedDay].breaks.map((breakItem) => (
                  <TableRow key={breakItem.id}>
                    <TableCell>
                      {breakItem.startTime} - {breakItem.endTime}
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Badge variant="secondary">Break</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Legend</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              new Set(Object.values(schedule).flatMap((day) => day.sessions.map((session) => session.subject))),
            ).map((subject) => (
              <TooltipProvider key={subject}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className={getClassColor(subject)}>{subject}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{subject}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

