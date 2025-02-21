"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Activity = {
  id: string
  user: {
    name: string
    avatar: string
  }
  action: string
  timestamp: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Fetch recent activities from API
    const fetchActivities = async () => {
      // Simulated API call
      const response = await new Promise<Activity[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              user: { name: "Fatima Al-Sayed", avatar: "/placeholder.svg?height=32&width=32" },
              action: "marked attendance for Class FND 03",
              timestamp: "2 minutes ago",
            },
            {
              id: "2",
              user: { name: "Ahmed Khan", avatar: "/placeholder.svg?height=32&width=32" },
              action: "uploaded a new lesson plan",
              timestamp: "10 minutes ago",
            },
            {
              id: "3",
              user: { name: "Zainab Omar", avatar: "/placeholder.svg?height=32&width=32" },
              action: "created a new assignment for Class FND 05",
              timestamp: "1 hour ago",
            },
          ])
        }, 1000)
      })
      setActivities(response)
    }

    fetchActivities()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{activity.user.name}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

