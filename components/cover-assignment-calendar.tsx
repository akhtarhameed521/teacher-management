import { useState } from "react"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isSameDay } from "date-fns"

interface CoverAssignment {
  id: number
  date: string
  class: string
  session: string
  time: string
  originalTeacher: string
  status: "Upcoming" | "Completed" | "Cancelled"
}

interface CoverAssignmentCalendarProps {
  assignments: CoverAssignment[]
  onAssignmentClick: (assignment: CoverAssignment) => void
}

export function CoverAssignmentCalendar({ assignments, onAssignmentClick }: CoverAssignmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const assignmentsForDate = assignments.filter((assignment) =>
    isSameDay(new Date(assignment.date), selectedDate as Date),
  )

  const customDayRender: CalendarProps["components"] = {
    day: ({ date, ...props }) => {
      const assignmentsForThisDate = assignments.filter((assignment) => isSameDay(new Date(assignment.date), date))
      return (
        <div {...props} className="relative">
          {props.children}
          {assignmentsForThisDate.length > 0 && (
            <Badge variant="secondary" className="absolute bottom-0 right-0 -mb-1 -mr-1">
              {assignmentsForThisDate.length}
            </Badge>
          )}
        </div>
      )
    },
  }

  return (
    <div className="flex space-x-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        components={customDayRender}
      />
      <Card className="flex-1">
        <CardContent>
          <h3 className="font-semibold mb-2">Assignments for {selectedDate && format(selectedDate, "MMMM d, yyyy")}</h3>
          <ScrollArea className="h-[300px]">
            {assignmentsForDate.length > 0 ? (
              assignmentsForDate.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-2 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => onAssignmentClick(assignment)}
                >
                  <div className="font-medium">{assignment.class}</div>
                  <div className="text-sm text-muted-foreground">
                    Session {assignment.session}: {assignment.time}
                  </div>
                  <Badge variant={assignment.status === "Upcoming" ? "default" : "secondary"}>
                    {assignment.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No assignments for this date.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

