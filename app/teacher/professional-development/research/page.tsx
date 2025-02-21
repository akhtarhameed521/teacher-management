"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Brain, TrendingUp } from "lucide-react"

export default function ResearchPage() {
  const researchPapers = [
    { title: "Technology in ESL Classrooms", journal: "TESOL Quarterly", date: "2024-01-15" },
    { title: "Mobile Learning in Language Teaching", journal: "ELT Journal", date: "2023-11-30" },
  ]

  const innovations = [
    { title: "AI in Language Learning", description: "Emerging trends and applications" },
    { title: "Virtual Reality for ESL", description: "Immersive learning experiences" },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Latest Research
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {researchPapers.map((paper, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{paper.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Published in {paper.journal} on {paper.date}
                  </p>
                  <Button variant="outline" className="mt-2">
                    Read More
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Teaching Innovations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {innovations.map((innovation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{innovation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{innovation.description}</p>
                  <Button variant="outline" className="w-full">
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link href="/teacher/professional-development">
            <Button variant="outline">Back to Professional Development</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

