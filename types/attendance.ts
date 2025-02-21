export type AttendanceStatus = "present" | "late" | "absent" | "excused" | null

export interface ToiletBreak {
  id: string
  startTime: string
  endTime: string | null
  duration: number
}

export interface AttendanceRecord {
  id: string
  status: AttendanceStatus
  notes: string
  timestamp: string
}

export interface Student {
  id: string
  firstName: string
  middleName: string
  lastName: string
  attendance: AttendanceRecord[]
  toiletBreaks: ToiletBreak[]
}

export interface AttendanceStats {
  present: number
  late: number
  absent: number
  excused: number
  total: number
}

export interface WeeklyAttendance {
  [date: string]: {
    [studentId: string]: AttendanceStatus
  }
}

