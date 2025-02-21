"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const initialMessages = [
  {
    id: 1,
    from: "John Doe",
    to: "Manager",
    subject: "Lesson Plan Question",
    content: "I have a question about the upcoming lesson plan...",
    date: "2023-06-10",
  },
  {
    id: 2,
    from: "Manager",
    to: "Jane Smith",
    subject: "Performance Review",
    content: "I'd like to schedule your performance review for next week...",
    date: "2023-06-09",
  },
]

export default function Messaging() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState({ to: "", subject: "", content: "" })

  const handleSendMessage = () => {
    const message = {
      id: messages.length + 1,
      from: "Manager",
      ...newMessage,
      date: new Date().toISOString().split("T")[0],
    }
    setMessages([message, ...messages])
    setNewMessage({ to: "", subject: "", content: "" })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messaging</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="to">To:</Label>
              <Select onValueChange={(value) => setNewMessage({ ...newMessage, to: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  {/* Add more teachers here */}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
            />
            <Textarea
              placeholder="Message content"
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            />
            <Button onClick={handleSendMessage}>Send Message</Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <CardTitle>{message.subject}</CardTitle>
              <CardDescription>
                {message.from} to {message.to} - {message.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{message.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

