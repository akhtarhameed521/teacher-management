"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Award, CalendarIcon, Clock, Star, Users } from "lucide-react"
import confetti from "canvas-confetti"

const attendanceData = {
  weekly: [
    { week: "Week 1", present: 5, absent: 0, late: 0 },
    { week: "Week 2", present: 4, absent: 1, late: 0 },
    { week: "Week 3", present: 3, absent: 1, late: 1 },
    { week: "Week 4", present: 5, absent: 0, late: 0 },
    { week: "Week 5", present: 4, absent: 0, late: 1 },
  ],
  monthly: [
    { month: "Jan", attendance: 95 },
    { month: "Feb", attendance: 92 },
    { month: "Mar", attendance: 88 },
    { month: "Apr", attendance: 90 },
    { month: "May", attendance: 93 },
  ],
  subjects: [
    { name: "Math", attendance: 95 },
    { name: "Science", attendance: 88 },
    { name: "English", attendance: 92 },
    { name: "History", attendance: 85 },
  ],
  dailyBreakdown: [
    { date: "2023-05-01", status: "present", arrivalTime: "08:55", departureTime: "15:30" },
    { date: "2023-05-02", status: "late", arrivalTime: "09:10", departureTime: "15:30" },
    { date: "2023-05-03", status: "present", arrivalTime: "08:50", departureTime: "15:30" },
    { date: "2023-05-04", status: "absent", arrivalTime: null, departureTime: null },
    { date: "2023-05-05", status: "present", arrivalTime: "08:45", departureTime: "15:30" },
  ],
}

const achievements = [
  { name: "Perfect Week", description: "Attend all classes for a week", progress: 80 },
  { name: "Early Bird", description: "Arrive early 5 days in a row", progress: 60 },
  { name: "Subject Master", description: "100% attendance in a subject", progress: 95 },
  { name: "Consistency King", description: "Maintain 90%+ attendance for a month", progress: 75 },
]

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showConfetti, setShowConfetti] = useState(false)

  const overallAttendance = 92
  const daysPresent = 45
  const totalDays = 49
  const perfectWeeks = 3

  const triggerConfetti = () => {
    setShowConfetti(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Awesome Attendance Adventure!
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Overall Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">{overallAttendance}%</div>
            <Badge variant="secondary" className="mt-2">
              Excellent!
            </Badge>
            <Progress value={overallAttendance} className="mt-4" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2" />
              Days Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">
              {daysPresent}/{totalDays}
            </div>
            <Badge variant="secondary" className="mt-2">
              Keep it up!
            </Badge>
            <Progress value={(daysPresent / totalDays) * 100} className="mt-4" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2" />
              Perfect Weeks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold">{perfectWeeks}</div>
            <Badge variant="secondary" className="mt-2">
              Impressive!
            </Badge>
            <Button variant="secondary" className="mt-4 w-full" onClick={triggerConfetti}>
              Celebrate!
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="weekly" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Breakdown</CardTitle>
                <CardDescription>See how you're doing each week</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={attendanceData.weekly}
                  index="week"
                  categories={["present", "absent", "late"]}
                  colors={["green", "red", "yellow"]}
                  valueFormatter={(value) => `${value} days`}
                  yAxisWidth={48}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>Track your attendance day by day</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="monthly">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>See how your attendance improves over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={attendanceData.monthly}
                  index="month"
                  categories={["attendance"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="subjects">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Subject</CardTitle>
                <CardDescription>How well are you attending each subject?</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={attendanceData.subjects}
                  category="attendance"
                  index="name"
                  valueFormatter={(value) => `${value}%`}
                  colors={["sky", "violet", "pink", "rose"]}
                  className="h-80"
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="daily">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Log</CardTitle>
                <CardDescription>A detailed look at your daily attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceData.dailyBreakdown.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {day.status === "present" && <Badge variant="success">Present</Badge>}
                        {day.status === "late" && <Badge variant="warning">Late</Badge>}
                        {day.status === "absent" && <Badge variant="destructive">Absent</Badge>}
                        <span>{day.date}</span>
                      </div>
                      {day.status !== "absent" && (
                        <div className="flex items-center space-x-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Clock className="h-5 w-5 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Arrival: {day.arrivalTime}</p>
                                <p>Departure: {day.departureTime}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2" />
              Attendance Achievements
            </CardTitle>
            <CardDescription>Unlock these awesome attendance milestones!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={achievement.progress} className="mt-2" />
                    <p className="text-sm text-right mt-1">{achievement.progress}% Complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2" />
              Attendance Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Aim for at least 95% attendance to maximize your learning potential.</li>
              <li>If you're running late, it's better to come to class late than not at all.</li>
              <li>If you must be absent, inform your teacher in advance and catch up on missed work.</li>
              <li>Consistent attendance helps build good habits for your future career.</li>
              <li>Remember, every day in class is an opportunity to learn something new!</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
              <p>You've achieved a perfect attendance week!</p>
              <p>Keep up the great work!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

