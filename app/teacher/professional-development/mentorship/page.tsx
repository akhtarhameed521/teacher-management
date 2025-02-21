"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, MessageCircle } from "lucide-react"

export default function MentorshipPage() {
  const mentorshipPrograms = [
    { title: "Peer Observation Program", description: "Learn from experienced ESL teachers" },
    { title: "New Teacher Mentoring", description: "Get guidance from senior teachers" },
  ]

  const discussionForums = [
    { title: "Teaching Methodology Forum", activeDiscussions: 238 },
    { title: "Resource Sharing Group", activeMembers: 156 },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Mentorship Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentorshipPrograms.map((program, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                  <Button className="w-full">Join Program</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Discussion Forums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discussionForums.map((forum, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{forum.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {forum.activeDiscussions
                      ? `${forum.activeDiscussions} active discussions`
                      : `${forum.activeMembers} active members`}
                  </p>
                  <Button variant="outline" className="mt-2 w-full">
                    Join Discussion
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

