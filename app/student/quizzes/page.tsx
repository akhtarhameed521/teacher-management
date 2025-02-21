import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, MessageCircle, Pencil, Headphones, FileText, Award } from "lucide-react"

const englishTopics = [
  { name: "Grammar", icon: BookOpen, progress: 65, color: "bg-blue-500", level: 1 },
  { name: "Vocabulary", icon: FileText, progress: 40, color: "bg-green-500", level: 2 },
  { name: "Reading", icon: BookOpen, progress: 80, color: "bg-yellow-500", level: 3 },
  { name: "Writing", icon: Pencil, progress: 30, color: "bg-red-500", level: 2 },
  { name: "Listening", icon: Headphones, progress: 50, color: "bg-purple-500", level: 1 },
  { name: "Speaking", icon: MessageCircle, progress: 70, color: "bg-pink-500", level: 3 },
  { name: "Idioms", icon: Award, progress: 20, color: "bg-indigo-500", level: 4 },
  { name: "Academic English", icon: FileText, progress: 10, color: "bg-orange-500", level: 5 },
]

export default function EnglishQuizzesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">English Skills</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {englishTopics.map((topic) => (
          <Link href={`/student/quizzes/english/${topic.name.toLowerCase()}`} key={topic.name}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className={`w-16 h-16 rounded-full ${topic.color} flex items-center justify-center mx-auto mb-4`}>
                  <topic.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">{topic.name}</h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Level {topic.level}</span>
                  <span className="text-sm font-medium">{topic.progress}%</span>
                </div>
                <Progress value={topic.progress} className="w-full" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Quiz</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

