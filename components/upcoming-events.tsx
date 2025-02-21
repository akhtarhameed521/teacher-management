"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

type Event = {
  id: string
  title: string
  date: Date
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    // Fetch upcoming events from API
    const fetchEvents = async () => {
      // Simulated API call
      const response = await new Promise<Event[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: "1", title: "Parent-Teacher Meeting", date: new Date(2023, 5, 15) },
            { id: "2", title: "End of Term Exams", date: new Date(2023, 5, 20) },
            { id: "3", title: "School Sports Day", date: new Date(2023, 5, 25) },
          ])
        }, 1000)
      })
      setEvents(response)
    }

    fetchEvents()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={new Date()}
          className="rounded-md border"
          components={{
            DayContent: (props) => {
              const matchingEvent = events.find((event) => event.date.toDateString() === props.date.toDateString())
              return (
                <div className="relative h-full w-full p-2">
                  <div className="text-center">{props.date.getDate()}</div>
                  {matchingEvent && (
                    <div className="absolute bottom-0 left-0 right-0 text-center text-xs truncate">
                      {matchingEvent.title}
                    </div>
                  )}
                </div>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

