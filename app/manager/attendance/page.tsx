"use client"

import React, { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AttendanceTracker } from "@/components/attendance-tracker"
import { LineChart, BarChart, PieChart } from "@/components/ui/charts"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCcw, Download, Printer, Users, UserCheck, UserX, Clock, HelpCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const StatCard = ({ title, value, icon: Icon }) => {
  const { theme } = useTheme()
  return (
    <motion.div
      className="p-4 rounded-lg shadow-lg backdrop-blur-md bg-opacity-30 bg-white dark:bg-opacity-10 dark:bg-gray-800"
      style={{
        background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)",
      }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="w-8 h-8 text-indigo-500" />
      </div>
    </motion.div>
  )
}

const ExpandableCard = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <Card className="overflow-hidden">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "60px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <CardContent className="p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleExpand}
            onKeyDown={(e) => e.key === "Enter" && toggleExpand()}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              ▼
            </motion.div>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </motion.div>
    </Card>
  )
}

export default function ManagerAttendancePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { theme } = useTheme()

  const refreshData = useCallback(() => {
    setIsRefreshing(true)
    // Simulating data refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "Attendance data has been updated.",
      })
    }, 1000)
  }, [])

  useEffect(() => {
    const interval = setInterval(refreshData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [refreshData])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "r" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        refreshData()
      }
    },
    [refreshData],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  const handleExport = () => {
    toast({
      title: "Exporting data",
      description: "Your attendance data is being exported.",
    })
    // Implement actual export functionality here
  }

  const handlePrint = () => {
    toast({
      title: "Printing report",
      description: "Your attendance report is being prepared for printing.",
    })
    // Implement actual print functionality here
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
                Attendance Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage and track student attendance efficiently
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={refreshData} disabled={isRefreshing} title="Refresh Data (Ctrl/Cmd + R)">
                    <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Data (Ctrl/Cmd + R)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export attendance data</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print attendance report</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard title="Present" value="85%" icon={UserCheck} />
            <StatCard title="Absent" value="10%" icon={UserX} />
            <StatCard title="Late" value="5%" icon={Clock} />
            <StatCard title="Total Students" value="150" icon={Users} />
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <Tabs defaultValue="tracker" className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <TabsList>
                    <TabsTrigger value="tracker">Attendance Tracker</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64"
                    />
                  </div>
                </div>

                <TabsContent value="tracker" className="h-[calc(100vh-300px)] overflow-auto">
                  <React.Suspense fallback={<Skeleton className="h-full w-full" />}>
                    <AttendanceTracker searchTerm={searchTerm} />
                  </React.Suspense>
                </TabsContent>

                <TabsContent value="trends">
                  <ExpandableCard title="Attendance Trends">
                    <div className="h-[400px]">
                      <LineChart
                        data={[
                          { date: "2023-01", attendance: 90 },
                          { date: "2023-02", attendance: 85 },
                          { date: "2023-03", attendance: 88 },
                          { date: "2023-04", attendance: 92 },
                        ]}
                      />
                    </div>
                  </ExpandableCard>
                </TabsContent>

                <TabsContent value="insights" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ExpandableCard title="Attendance by Day">
                    <div className="h-[300px]">
                      <BarChart
                        data={[
                          { day: "Mon", attendance: 95 },
                          { day: "Tue", attendance: 88 },
                          { day: "Wed", attendance: 92 },
                          { day: "Thu", attendance: 90 },
                          { day: "Fri", attendance: 85 },
                        ]}
                      />
                    </div>
                  </ExpandableCard>
                  <ExpandableCard title="Attendance Distribution">
                    <div className="h-[300px]">
                      <PieChart
                        data={[
                          { category: "Present", value: 85 },
                          { category: "Absent", value: 10 },
                          { category: "Late", value: 5 },
                        ]}
                      />
                    </div>
                  </ExpandableCard>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg" variant="secondary">
              <HelpCircle className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Need help? Click for assistance</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

