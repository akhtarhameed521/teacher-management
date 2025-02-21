"use client"

import {
  Home,
  Users,
  BookOpen,
  CheckCircle,
  BarChart,
  MessageSquare,
  Calendar,
  Clock,
  Briefcase,
  Settings,
  BarChart2,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const managerMenuItems = [
  { title: "Dashboard", icon: Home, href: "/manager" },
  { title: "Teachers", icon: Users, href: "/manager/teachers" },
  { title: "Classes", icon: BookOpen, href: "/manager/classes" },
  { title: "Attendance", icon: CheckCircle, href: "/manager/attendance" },
  { title: "Tasks", icon: Calendar, href: "/manager/tasks" },
  { title: "Reports", icon: BarChart, href: "/manager/reports" },
  { title: "Messages", icon: MessageSquare, href: "/manager/messages" },
  { title: "KPI Dashboard", icon: TrendingUp, href: "/manager/teachers" }, // Added KPI Dashboard link
]

const teacherMenuItems = [
  { title: "Dashboard", icon: Home, href: "/teacher" },
  { title: "My Classes", icon: BookOpen, href: "/teacher/classes" },
  { title: "Attendance", icon: CheckCircle, href: "/teacher/attendance" },
  { title: "My Tasks", icon: Calendar, href: "/teacher/tasks" },
  { title: "Messages", icon: MessageSquare, href: "/teacher/messages" },
  { title: "My Timetable", icon: Clock, href: "/teacher/my-timetable" },
  { title: "Cover Assignments", icon: Briefcase, href: "/teacher/cover-assignments" },
  {
    href: "/teacher/kpi",
    title: "KPI Dashboard",
    icon: BarChart2,
  },
]

const MotionLink = motion(Link)

export function AppSidebar() {
  const pathname = usePathname()
  const isManager = pathname.startsWith("/manager")
  const menuItems = isManager ? managerMenuItems : teacherMenuItems

  return (
    <Sidebar className="hidden md:flex flex-col w-64 bg-card shadow-lg">
      <SidebarHeader className="p-6">
        <motion.h2
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isManager ? "School Management" : "Teacher Portal"}
        </motion.h2>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <MotionLink
                    href={item.href}
                    className={`flex items-center py-3 px-6 rounded-md transition-colors ${
                      pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-accent"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.title}</span>
                  </MotionLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </Sidebar>
  )
}

