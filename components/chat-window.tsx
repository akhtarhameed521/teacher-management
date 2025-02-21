"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Smile, X, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  content: string
  sender: "student" | "teacher" | "ai"
  timestamp: Date
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "teacher",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isAIMode, setIsAIMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) //Corrected dependency

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    const studentMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "student",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, studentMessage])
    setNewMessage("")
    setIsLoading(true)

    if (isAIMode) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newMessage }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to get AI response: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, aiMessage])
      } catch (error) {
        console.error("Error getting AI response:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Sorry, I couldn't process your request. Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, errorMessage])
      } finally {
        setIsLoading(false)
      }
    } else {
      // Simulate teacher's response
      setTimeout(() => {
        const teacherMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for your message. I'll get back to you soon.",
          sender: "teacher",
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, teacherMessage])
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-[600px] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {isAIMode ? <Bot className="h-6 w-6" /> : <AvatarImage src="/teacher-avatar.png" alt="Teacher" />}
                    <AvatarFallback>{isAIMode ? "AI" : "TC"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{isAIMode ? "AI Assistant" : "Mrs. Johnson"}</h2>
                    <p className="text-xs opacity-75">{isAIMode ? "OpenAI GPT" : "ESL Teacher"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="ai-mode" checked={isAIMode} onCheckedChange={setIsAIMode} />
                  <Label htmlFor="ai-mode" className="text-xs">
                    AI Mode
                  </Label>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        message.sender === "student"
                          ? "bg-indigo-500 text-white"
                          : message.sender === "ai"
                            ? "bg-green-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl">
                      <p className="text-gray-500 dark:text-gray-400">Typing...</p>
                    </div>
                  </motion.div>
                )}
              </ScrollArea>
              <div className="flex items-center gap-2 p-4 bg-white dark:bg-gray-800">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-500">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-500">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-indigo-500 hover:bg-indigo-600"
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

