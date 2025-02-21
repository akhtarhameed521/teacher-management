"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, Award } from "lucide-react"

export default function CareerGrowthPage() {
  const careerPrograms = [
    { title: "Leadership Development Program", description: "Path to becoming a Senior Teacher" },
    { title: "Department Head Training", description: "Administrative skills development" },
  ]

  const recognitionPrograms = [
    { title: "Teacher of the Year Awards", description: "Annual recognition program" },
    { title: "Innovation in Teaching Award", description: "Quarterly recognition" },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Career Advancement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerPrograms.map((program, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                  <Button className="w-full">Apply Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Recognition Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recognitionPrograms.map((program, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                  <Button variant="outline" className="w-full">
                    Learn More
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

