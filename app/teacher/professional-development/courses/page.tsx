"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function CoursesPage() {
  const courses = [
    { title: "CELTA Certification", provider: "Cambridge English", duration: "4 weeks", progress: 65 },
    { title: "Digital Teaching Methods", provider: "Coursera", duration: "6 weeks", progress: 30 },
    { title: "Teaching Business English", provider: "TESOL International", duration: "8 weeks", progress: 90 },
  ]

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Online Courses & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {courses.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{course.title}</h3>
                  <span className="text-sm text-muted-foreground">{course.provider}</span>
                </div>
                <p className="text-sm text-muted-foreground">Duration: {course.duration}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                <Button size="sm">Continue Course</Button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/teacher/professional-development">
              <Button variant="outline">Back to Professional Development</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

