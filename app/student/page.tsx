"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { Badge } from "@/components/ui/badge"
import { GradeChart } from "@/components/grade-chart"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Gift, Trophy, Star, TrendingUp, Calendar, MessageCircle, Clock, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "@/components/chat-window"

export default function StudentDashboard() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const studentData = {
    id: "162180",
    name: "Abdulrahman Ali Asiri",
    class: "ESL-Intermediate",
    profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YD4KOzhX5vdoAqO8ZF4j7djF4A2Cls.png",
    attendance: {
      w2: 55,
      w3: 63,
      w4: 73,
      w5: 79,
      change: 6,
    },
    exams: {
      exam1: {
        total: 139,
        speaking: 35,
        listening: 32,
        reading: 38,
        writing: 34,
        areasToImprove: ["Pronunciation", "Listening comprehension", "Essay structure"],
      },
      exam2: {
        total: 140,
        speaking: 36,
        listening: 33,
        reading: 37,
        writing: 34,
        areasToImprove: ["Vocabulary usage", "Reading speed", "Grammar accuracy"],
      },
      exam3: {
        total: 160,
        speaking: 40,
        listening: 38,
        reading: 42,
        writing: 40,
        areasToImprove: ["Advanced vocabulary", "Critical analysis in writing", "Accent reduction"],
      },
    },
    subjects: ["ESL English", "Conversation Practice", "Academic Writing"],
    awards: ["Most Improved in Speaking"],
    teacherNotes:
      "Abdulrahman has shown significant improvement in speaking confidence. Focus on academic writing skills next.",
    timetable: [
      { time: "08:00 - 09:30", subject: "ESL Grammar", room: "Room 101" },
      { time: "09:45 - 11:15", subject: "Listening & Speaking", room: "Language Lab" },
      { time: "11:30 - 13:00", subject: "Reading Comprehension", room: "Library" },
      { time: "14:00 - 15:30", subject: "Academic Writing", room: "Room 105" },
    ],
  }

  const calculateGPA = (exams: { [key: string]: { total: number } }) => {
    const total = Object.values(exams).reduce((sum, exam) => sum + exam.total, 0)
    return ((total / (Object.keys(exams).length * 200)) * 100).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 right-4 z-50"
        >
          <Button
            onClick={() => setIsChatOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-full flex items-center space-x-2 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <AnimatePresence>
              {isHovered ? (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  Chat with Teacher
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageSquare className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-purple-400 dark:ring-purple-600">
                  <Image
                    src={studentData.profileImage || "/placeholder.svg"}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{studentData.name}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    ID: {studentData.id} | Class: {studentData.class}
                  </p>
                </div>
                <Gift className="h-10 w-10 text-purple-500 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Today's ESL Timetable</h2>
                  <Calendar className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="space-y-3">
                  {studentData.timetable.map((session, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-300" />
                        <div>
                          <p className="font-semibold">{session.subject}</p>
                          <p className="text-sm text-gray-200">{session.room}</p>
                        </div>
                      </div>
                      <p className="text-sm">{session.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-rows-2 gap-4 h-full">
              <MetricCard
                label="Latest Attendance"
                value={studentData.attendance.w5}
                suffix="%"
                icon={<Calendar className="h-6 w-6" />}
                trend={studentData.attendance.change}
                trendLabel="vs last week"
              />
              <MetricCard
                label="Attendance Change"
                value={studentData.attendance.change}
                suffix="%"
                icon={<TrendingUp className="h-6 w-6" />}
                positive
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                Latest ESL Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(studentData.exams).map(([exam, data]) => (
                  <Dialog key={exam}>
                    <DialogTrigger asChild>
                      <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold">{exam.toUpperCase()}</h3>
                          <p className="text-3xl font-bold mt-2">{data.total}</p>
                          <p className="text-sm mt-1 opacity-80">Click for details</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{exam.toUpperCase()} Breakdown</DialogTitle>
                        <DialogDescription>Detailed scores for each section of the ESL exam.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                          <span className="font-semibold">Speaking:</span>
                          <span>{data.speaking}</span>
                          <span className="font-semibold">Listening:</span>
                          <span>{data.listening}</span>
                          <span className="font-semibold">Reading:</span>
                          <span>{data.reading}</span>
                          <span className="font-semibold">Writing:</span>
                          <span>{data.writing}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Areas to Improve:</h4>
                          <ul className="list-disc pl-5">
                            {data.areasToImprove.map((area, index) => (
                              <li key={index}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                  ESL Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studentData.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-lg py-2 px-4">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                  ESL Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {studentData.awards.map((award) => (
                    <Badge key={award} variant="outline" className="text-lg py-2 px-4 w-full justify-start">
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      {award}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <MessageCircle className="mr-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                ESL Teacher's Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 dark:text-gray-300">{studentData.teacherNotes}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-purple-500 dark:text-purple-400" />
                ESL Attendance Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <GradeChart
                  data={[
                    { week: "W2", value: studentData.attendance.w2 },
                    { week: "W3", value: studentData.attendance.w3 },
                    { week: "W4", value: studentData.attendance.w4 },
                    { week: "W5", value: studentData.attendance.w5 },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  )
}

