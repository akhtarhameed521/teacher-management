"use client"

import { Bell, Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebarContext } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommandMenu } from "@/components/command-menu"

export function TopBar() {
  const { toggleSidebar } = useSidebarContext()
  const { theme, setTheme } = useTheme()
  const [newAssignments, setNewAssignments] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating receiving new cover assignments
    const interval = setInterval(() => {
      const newAssignmentCount = Math.floor(Math.random() * 3)
      if (newAssignmentCount > 0) {
        setNewAssignments((prev) => prev + newAssignmentCount)
        toast({
          title: "New Cover Assignment",
          description: `You have ${newAssignmentCount} new cover assignment(s).`,
        })
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [toast])

  return (
    <motion.div
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b h-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-4 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <CommandMenu />
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {newAssignments > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 min-w-[1.25rem]">
                  {newAssignments}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/teacher/cover-assignments">View Cover Assignments</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}

