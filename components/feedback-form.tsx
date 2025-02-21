"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement feedback submission logic here
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    })
    setFeedback("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provide Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Share your thoughts or suggestions..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mb-4"
          />
          <Button type="submit">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  )
}

