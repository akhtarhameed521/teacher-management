import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, startOfWeek, addDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { WeeklyAttendance, Student } from "@/types/attendance"

interface WeeklyViewProps {
  weeklyAttendance: WeeklyAttendance
  students: Student[]
}

const statusColors = {
  present: "bg-green-500",
  late: "bg-yellow-500",
  absent: "bg-red-500",
  excused: "bg-blue-500",
}

export function WeeklyView({ weeklyAttendance, students }: WeeklyViewProps) {
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            {weekDays.map((day) => (
              <TableHead key={day.toISOString()}>{format(day, "EEE, MMM d")}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
              {weekDays.map((day) => {
                const dateString = format(day, "yyyy-MM-dd")
                const status = weeklyAttendance[dateString]?.[student.id]
                return (
                  <TableCell key={dateString}>
                    {status && (
                      <Badge className={statusColors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

