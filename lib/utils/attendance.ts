import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns"
import type { AttendanceStats, Student, WeeklyAttendance } from "@/types/attendance"

export const calculateAttendanceStats = (students: Student[]): AttendanceStats => {
  const stats = {
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    total: students.length,
  }

  students.forEach((student) => {
    const lastAttendance = student.attendance[student.attendance.length - 1]
    if (lastAttendance) {
      stats[lastAttendance.status]++
    }
  })

  return stats
}

export const getAbsenceCount = (student: Student): number => {
  return student.attendance.filter((a) => a.status === "absent").length
}

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export const generateAttendanceReport = (students: Student[]): string => {
  const today = new Date().toLocaleDateString()
  let report = `Attendance Report - ${today}\n\n`

  students.forEach((student) => {
    const lastAttendance = student.attendance[student.attendance.length - 1]
    const absences = getAbsenceCount(student)
    report += `${student.firstName} ${student.lastName}: ${lastAttendance?.status || "Not marked"}\n`
    report += `Total Absences: ${absences}\n`
    if (lastAttendance?.notes) {
      report += `Notes: ${lastAttendance.notes}\n`
    }
    report += `\n`
  })

  return report
}

export const getWeeklyAttendance = (students: Student[]): WeeklyAttendance => {
  const today = new Date()
  const start = startOfWeek(today)
  const end = endOfWeek(today)
  const days = eachDayOfInterval({ start, end })

  const weeklyAttendance: WeeklyAttendance = {}

  days.forEach((day) => {
    const dateString = format(day, "yyyy-MM-dd")
    weeklyAttendance[dateString] = {}

    students.forEach((student) => {
      const attendance = student.attendance.find((a) => format(new Date(a.timestamp), "yyyy-MM-dd") === dateString)
      weeklyAttendance[dateString][student.id] = attendance?.status || null
    })
  })

  return weeklyAttendance
}

export const calculateTardiness = (student: Student): number => {
  return student.attendance.filter((a) => a.status === "late").length
}

