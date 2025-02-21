"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star } from "lucide-react"

interface Teacher {
  id: number
  name: string
  participations: number
  presentations: number
  totalPoints: number
}

const dummyData: Teacher[] = [
  { id: 1, name: "Mohamed Hashim Mohamed Ali", participations: 15, presentations: 3, totalPoints: 210 },
  { id: 2, name: "Sheraz Siddiq", participations: 20, presentations: 5, totalPoints: 300 },
  { id: 3, name: "Mohamed Dol", participations: 12, presentations: 2, totalPoints: 160 },
  { id: 4, name: "Sajaad Younis", participations: 18, presentations: 4, totalPoints: 260 },
  { id: 5, name: "Ameen Daniel", participations: 14, presentations: 3, totalPoints: 200 },
  { id: 6, name: "Abdul Raqib Choudhury", participations: 16, presentations: 3, totalPoints: 220 },
  { id: 7, name: "Haroon Raja", participations: 19, presentations: 4, totalPoints: 270 },
  { id: 8, name: "Hamid Hashim", participations: 13, presentations: 2, totalPoints: 170 },
  { id: 9, name: "Brahim Dafiri", participations: 11, presentations: 1, totalPoints: 130 },
  { id: 10, name: "Makhtar Hussien Aidid", participations: 17, presentations: 3, totalPoints: 230 },
  { id: 11, name: "Farah Egal", participations: 10, presentations: 1, totalPoints: 120 },
  { id: 12, name: "Murshad Twaibu Bonomali", participations: 15, presentations: 2, totalPoints: 190 },
  { id: 13, name: "Shaheen Mangal", participations: 14, presentations: 3, totalPoints: 200 },
  { id: 14, name: "Abdirahman Hassan Mohamed", participations: 16, presentations: 3, totalPoints: 220 },
  { id: 15, name: "Razeehn Achmad", participations: 13, presentations: 2, totalPoints: 170 },
  { id: 16, name: "Issa Mckey", participations: 18, presentations: 4, totalPoints: 260 },
  { id: 17, name: "Yaquob Ali", participations: 12, presentations: 1, totalPoints: 140 },
  { id: 18, name: "Mohammed Ashif Uddin", participations: 15, presentations: 3, totalPoints: 210 },
  { id: 19, name: "Mohamed Ibrahim Elmi", participations: 17, presentations: 3, totalPoints: 230 },
  { id: 20, name: "Mohammed Barreh", participations: 14, presentations: 2, totalPoints: 180 },
]

export function TeacherLeaderboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setTeachers(dummyData)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const sortedTeachers = [...teachers].sort((a, b) => b.totalPoints - a.totalPoints)

  if (teachers.length === 0) {
    return <div>Loading leaderboard...</div>
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Teacher Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTeachers.map((teacher, index) => (
            <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-lg">{index + 1}</span>
                <div>
                  <p className="font-semibold">{teacher.name}</p>
                  <div className="flex space-x-2 text-sm text-muted-foreground">
                    <span>{teacher.participations} participations</span>
                    <span>•</span>
                    <span>{teacher.presentations} presentations</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  <Star className="mr-1 h-4 w-4" />
                  {teacher.totalPoints} points
                </Badge>
                {index === 0 && (
                  <Badge variant="default" className="text-sm">
                    <Award className="mr-1 h-4 w-4" />
                    Top Performer
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

