"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, FileText } from "lucide-react"

const sessions = [
  { time: "08:00 - 08:45", type: "Session" },
  { time: "08:45 - 09:30", type: "Session" },
  { time: "09:30 - 10:15", type: "Break", duration: 45 },
  { time: "10:15 - 11:00", type: "Session" },
  { time: "11:00 - 11:45", type: "Session" },
  { time: "11:45 - 12:10", type: "Break", duration: 25 },
  { time: "12:10 - 12:55", type: "Session" },
  { time: "12:55 - 13:40", type: "Session" },
]

const homework = [
  { title: "Reading Assignment", dueDate: "2023-06-15" },
  { title: "Grammar Exercises", dueDate: "2023-06-17" },
]

const quizzes = [
  { title: "Vocabulary Quiz", dueDate: "2023-06-16" },
  { title: "Comprehension Test", dueDate: "2023-06-18" },
]

export default function SubjectPage() {
  const params = useParams()
  const subject = (params.subject as string).charAt(0).toUpperCase() + (params.subject as string).slice(1)

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">{subject} Timetable</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
        <div className="space-y-2">
          {sessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{session.time}</span>
              </div>
              <Badge variant={session.type === "Break" ? "outline" : "default"}>
                {session.type === "Break" ? `${session.type} (${session.duration} min)` : session.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Homework</h2>
          <div className="space-y-2">
            {homework.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{item.title}</span>
                </div>
                <Badge variant="outline">Due: {item.dueDate}</Badge>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full">View All Homework</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
          <div className="space-y-2">
            {quizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>{quiz.title}</span>
                </div>
                <Badge variant="outline">Due: {quiz.dueDate}</Badge>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full">View All Quizzes</Button>
        </Card>
      </div>
    </div>
  )
}

