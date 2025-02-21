import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Event {
  date: Date
  title: string
  type: string
}

const upcomingEvents: Event[] = [
  {
    date: new Date(2024, 2, 15), // March 15, 2024
    title: "TESOL International Convention",
    type: "Conference",
  },
  {
    date: new Date(2024, 2, 20), // March 20, 2024
    title: "Teaching English Through Technology",
    type: "Workshop",
  },
  {
    date: new Date(2024, 3, 1), // April 1, 2024
    title: "Cultural Sensitivity in ESL",
    type: "Workshop",
  },
  {
    date: new Date(2024, 3, 5), // April 5, 2024
    title: "ESL Teaching Innovation Summit",
    type: "Conference",
  },
]

interface FloatingCalendarProps {
  onClose: () => void
}

export function FloatingCalendar({ onClose }: FloatingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const eventsForSelectedDate = upcomingEvents.filter(
    (event) =>
      event.date.getDate() === selectedDate?.getDate() &&
      event.date.getMonth() === selectedDate?.getMonth() &&
      event.date.getFullYear() === selectedDate?.getFullYear(),
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
            <div className="space-y-2">
              <h3 className="font-semibold">Events on {selectedDate?.toDateString()}:</h3>
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map((event, index) => (
                  <div key={index} className="p-2 bg-secondary rounded-md">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.type}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No events on this date.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

