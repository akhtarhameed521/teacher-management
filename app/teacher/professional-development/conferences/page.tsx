"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar } from "lucide-react"

export default function ConferencesPage() {
  const conferences = [
    {
      title: "TESOL International Convention",
      date: "March 15-18, 2024",
      type: "Virtual",
      status: "Featured",
    },
    {
      title: "ESL Teaching Innovation Summit",
      date: "April 5-6, 2024",
      type: "Hybrid",
      status: "Coming Soon",
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Conferences & Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conferences.map((conference, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{conference.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {conference.date} • {conference.type}
                    </p>
                  </div>
                  <Badge variant={conference.status === "Featured" ? "default" : "outline"}>{conference.status}</Badge>
                </div>
                <Button className="mt-4 w-full">
                  {conference.status === "Featured" ? "Register Now" : "Learn More"}
                </Button>
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

