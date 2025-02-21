"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

const sessions = [
  { time: "08:00 - 08:45", type: "Grammar", topic: "Past Perfect Tense" },
  { time: "08:45 - 09:30", type: "Vocabulary", topic: "Academic Words" },
  { time: "09:30 - 10:15", type: "Break", duration: 45 },
  { time: "10:15 - 11:00", type: "Reading", topic: "Shakespeare's Sonnets" },
  { time: "11:00 - 11:45", type: "Writing", topic: "Essay Structure" },
  { time: "11:45 - 12:10", type: "Break", duration: 25 },
  { time: "12:10 - 12:55", type: "Speaking", topic: "Debate Practice" },
  { time: "12:55 - 13:40", type: "Listening", topic: "TED Talk Analysis" },
]

const homework = [
  { title: "Write an essay on 'The Impact of Social Media'", dueDate: "2023-06-15", link: "/homework/essay" },
  { title: "Complete grammar exercises on past tenses", dueDate: "2023-06-17", link: "/homework/grammar" },
]

const quizzes = [
  { title: "Vocabulary Quiz: Academic Words", dueDate: "2023-06-16", link: "/quizzes/vocabulary" },
  { title: "Reading Comprehension: Shakespeare's Sonnets", dueDate: "2023-06-18", link: "/quizzes/reading" },
]

export default function EnglishSubjectPage() {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">English Timetable</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Schedule</h2>
        <div className="space-y-2">
          {sessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">{session.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={session.type === "Break" ? "outline" : "default"}>
                  {session.type === "Break" ? `${session.type} (${session.duration} min)` : session.type}
                </Badge>
                {session.topic && <span className="text-sm text-muted-foreground">{session.topic}</span>}
              </div>
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
                  <span className="font-medium">{item.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Due: {item.dueDate}</Badge>
                  <Link href={item.link} className="text-primary hover:text-primary/80">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href="/student/homework">View All Homework</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
          <div className="space-y-2">
            {quizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{quiz.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Due: {quiz.dueDate}</Badge>
                  <Link href={quiz.link} className="text-primary hover:text-primary/80">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href="/student/quizzes/english">Start English Quiz</Link>
          </Button>
          <Button asChild className="mt-4 w-full">
            <Link href="/student/quizzes">View All Quizzes</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}

