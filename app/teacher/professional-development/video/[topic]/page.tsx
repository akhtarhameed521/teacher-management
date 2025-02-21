"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function VideoPage() {
  const params = useParams()
  const topic = params.topic

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Video: {topic}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is where the video for {topic} would be embedded.</p>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">Video Player Placeholder</div>
          </div>
          <Link href="/teacher/professional-development">
            <Button variant="outline">Back to Professional Development</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

