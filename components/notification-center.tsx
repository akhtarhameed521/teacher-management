"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "task" | "cover" | "change"
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Simulating fetching notifications
    const fetchNotifications = () => {
      const newNotifications: Notification[] = [
        {
          id: "1",
          type: "task",
          message: "Complete lesson plan for tomorrow",
          timestamp: new Date(),
          read: false,
        },
        {
          id: "2",
          type: "cover",
          message: "You have been assigned a cover class for Math 101",
          timestamp: new Date(Date.now() - 3600000),
          read: false,
        },
        {
          id: "3",
          type: "change",
          message: "Your schedule has been updated for next week",
          timestamp: new Date(Date.now() - 7200000),
          read: false,
        },
      ]
      setNotifications(newNotifications)
    }

    fetchNotifications()
    // In a real application, you might want to set up a polling mechanism or use WebSockets for real-time updates
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground">No new notifications</p>
                  ) : (
                    <ul className="space-y-4">
                      {notifications.map((notification) => (
                        <li key={notification.id} className="flex items-start justify-between">
                          <div>
                            <p className={`text-sm ${notification.read ? "text-muted-foreground" : "font-medium"}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                Mark as read
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

