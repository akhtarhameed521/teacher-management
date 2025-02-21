"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Headphones, MessageCircle, BookOpen, Pencil } from "lucide-react"

interface SkillScore {
  skill: string
  score: number
  icon: React.ReactNode
}

interface PerformanceMetricsProps {
  teacherName: string
  teacherId: string
  level: string
  overallScore: number
  ranking: string
  skillScores: SkillScore[]
}

export function PerformanceMetrics({
  teacherName,
  teacherId,
  level,
  overallScore,
  ranking,
  skillScores,
}: PerformanceMetricsProps) {
  const getPerformanceStatus = (score: number) => {
    if (score >= 90) return { status: "Excellent", color: "bg-green-500", emoji: "🟢" }
    if (score >= 75) return { status: "Satisfactory", color: "bg-yellow-500", emoji: "🟡" }
    return { status: "Needs Improvement", color: "bg-red-500", emoji: "🔴" }
  }

  const performance = getPerformanceStatus(overallScore)

  const skillIcons = {
    Listening: <Headphones className="h-4 w-4" />,
    Speaking: <MessageCircle className="h-4 w-4" />,
    Reading: <BookOpen className="h-4 w-4" />,
    Writing: <Pencil className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Teacher Name & ID:</span>
                <span>
                  {teacherName} ({teacherId})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subject/Level:</span>
                <Badge>{level}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Status:</span>
                <div className="flex items-center gap-2">
                  <span>{performance.emoji}</span>
                  <span>{performance.status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ranking:</span>
                <span>{ranking}</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Average KPI Score</span>
              <div className="flex items-center gap-2">
                <Progress value={overallScore} className="h-2" />
                <span className="text-sm font-medium">{overallScore}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={skillScores.map(({ skill, score }) => ({
                name: skill,
                value: score,
              }))}
              index="name"
              categories={["value"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value}%`}
              className="h-[200px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={[
                { name: "Meeting Target", value: 65 },
                { name: "Below Target", value: 25 },
                { name: "Exceeding Target", value: 10 },
              ]}
              index="name"
              category="value"
              colors={["green", "red", "blue"]}
              className="h-[200px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={[
              { month: "Jan", score: 82 },
              { month: "Feb", score: 85 },
              { month: "Mar", score: 83 },
              { month: "Apr", score: 87 },
              { month: "May", score: 89 },
              { month: "Jun", score: 88 },
            ]}
            index="month"
            categories={["score"]}
            colors={["green"]}
            valueFormatter={(value) => `${value}%`}
            className="h-[200px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}

