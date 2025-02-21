import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AttendanceStats } from "@/types/attendance"

interface AttendanceStatsProps {
  stats: AttendanceStats
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
  const presentPercentage = ((stats.present / stats.total) * 100).toFixed(1)
  const latePercentage = ((stats.late / stats.total) * 100).toFixed(1)
  const absentPercentage = ((stats.absent / stats.total) * 100).toFixed(1)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          <p className="text-xs text-muted-foreground">{presentPercentage}% of total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          <p className="text-xs text-muted-foreground">{latePercentage}% of total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <p className="text-xs text-muted-foreground">{absentPercentage}% of total</p>
        </CardContent>
      </Card>
    </div>
  )
}

