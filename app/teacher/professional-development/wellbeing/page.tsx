"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Heart, Coffee } from "lucide-react"

export default function WellbeingPage() {
  const wellnessResources = [
    { title: "Stress Management Workshop", description: "Weekly online sessions" },
    { title: "Mindfulness for Teachers", description: "Daily guided practices" },
  ]

  const workLifeBalance = [
    { title: "Time Management Strategies", description: "For busy ESL teachers" },
    { title: "Teacher Support Network", description: "24/7 counseling services" },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Wellness Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wellnessResources.map((resource, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                  <Button className="w-full">Access Resource</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Coffee className="mr-2 h-5 w-5" />
              Work-Life Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workLifeBalance.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
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

