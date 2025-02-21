import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
import { format, parseISO } from "date-fns"

interface CoverAssignment {
  id: number
  date: string
  class: string
  session: string
  time: string
  originalTeacher: string
  status: "Upcoming" | "Completed"
}

interface CoverAssignmentsListProps {
  assignments: CoverAssignment[]
}

export function CoverAssignmentsList({ assignments }: CoverAssignmentsListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="overflow-hidden">
          <CardHeader className="bg-secondary">
            <CardTitle className="flex items-center justify-between">
              <span>{assignment.class}</span>
              <Badge variant={assignment.status === "Upcoming" ? "default" : "success"}>{assignment.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {assignment.date ? format(parseISO(assignment.date), "MMMM d, yyyy") : "N/A"}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Session {assignment.session}: {assignment.time}
              </div>
              <div className="text-sm text-muted-foreground">Original Teacher: {assignment.originalTeacher}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

