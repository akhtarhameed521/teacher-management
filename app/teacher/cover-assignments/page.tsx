"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { CoverAssignmentsList } from "@/components/cover-assignments-list"
import { CoverAssignmentCalendar } from "@/components/cover-assignment-calendar"
import { CoverAssignmentStats } from "@/components/cover-assignment-stats"
import { CoverAssignmentMap } from "@/components/cover-assignment-map"
import { NotificationPreferences } from "@/components/notification-preferences"
import { FeedbackForm } from "@/components/feedback-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, Search, Download, Printer, Share2, Bell, Settings, HelpCircle, RefreshCw } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

// Mock data and types (replace with actual data fetching in a real application)
interface CoverAssignment {
  id: number
  date: string
  class: string
  session: string
  time: string
  originalTeacher: string
  status: "Upcoming" | "Completed" | "Cancelled"
  location: { lat: number; lng: number }
  notes: string
  attachments: string[]
}

const mockAssignments: CoverAssignment[] = [
  {
    id: 1,
    date: "2026-06-20",
    class: "FND-05",
    session: "2",
    time: "9:30 - 10:30",
    originalTeacher: "John Doe",
    status: "Upcoming",
    location: { lat: 25.2048, lng: 55.2708 },
    notes: "Please review chapter 5 before the class.",
    attachments: ["lesson_plan.pdf", "worksheet.docx"],
  },
  {
    id: 2,
    date: "2026-06-22",
    class: "FND-03",
    session: "4",
    time: "11:30 - 12:30",
    originalTeacher: "Jane Smith",
    status: "Completed",
    location: { lat: 25.2048, lng: 55.2708 },
    notes: "",
    attachments: [],
  },
  {
    id: 3,
    date: "2026-06-25",
    class: "FND-07",
    session: "1",
    time: "8:30 - 9:30",
    originalTeacher: "Alice Johnson",
    status: "Upcoming",
    location: { lat: 25.2048, lng: 55.2708 },
    notes: "",
    attachments: [],
  },
]

export default function CoverAssignmentsPage() {
  const [assignments, setAssignments] = useState<CoverAssignment[]>(mockAssignments)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "map" | "stats">("list")
  const [isLoading, setIsLoading] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)
  const [distanceFilter, setDistanceFilter] = useState<[number]>([10])
  const [selectedAssignment, setSelectedAssignment] = useState<CoverAssignment | null>(null)

  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.originalTeacher.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || assignment.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesDate = !selectedDate || assignment.date === format(selectedDate, "yyyy-MM-dd")
      const matchesCompleted = showCompleted || assignment.status !== "Completed"
      // Add more complex filtering logic here (e.g., distance-based filtering)
      return matchesSearch && matchesStatus && matchesDate && matchesCompleted
    })
    .sort((a, b) => {
      const compareValue = a[sortBy] > b[sortBy] ? 1 : -1
      return sortOrder === "asc" ? compareValue : -compareValue
    })

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In a real application, you would fetch new data here
    setIsLoading(false)
    toast({
      title: "Data Refreshed",
      description: "Your cover assignments have been updated.",
    })
  }

  const handleExport = (format: "pdf" | "csv") => {
    // Implement export logic here
    toast({
      title: "Export Started",
      description: `Your assignments are being exported as ${format.toUpperCase()}.`,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    // Implement share logic here
    toast({
      title: "Assignments Shared",
      description: "Your assignments have been shared successfully.",
    })
  }

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAssignments((prev) => [
        ...prev,
        {
          id: Date.now(),
          date: format(addDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd"),
          class: `FND-${Math.floor(Math.random() * 10 + 1)}`,
          session: `${Math.floor(Math.random() * 6 + 1)}`,
          time: "10:30 - 11:30",
          originalTeacher: "New Teacher",
          status: "Upcoming",
          location: { lat: 25.2048 + Math.random() * 0.1, lng: 55.2708 + Math.random() * 0.1 },
          notes: "New assignment added.",
          attachments: [],
        },
      ])
      toast({
        title: "New Assignment",
        description: "A new cover assignment has been added to your schedule.",
      })
    }, 60000) // Add a new assignment every minute for demo purposes

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Cover Assignments</h1>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Filter and Sort</span>
            <Button variant="outline" size="sm" onClick={() => refreshData()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by class or teacher"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-completed" checked={showCompleted} onCheckedChange={setShowCompleted} />
              <Label htmlFor="show-completed">Show Completed</Label>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Label htmlFor="distance-filter">Max Distance (km)</Label>
            <Slider
              id="distance-filter"
              max={50}
              step={1}
              value={distanceFilter}
              onValueChange={setDistanceFilter}
              className="w-[200px]"
            />
            <span>{distanceFilter}km</span>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="originalTeacher">Original Teacher</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Tabs value={viewMode} onValueChange={(value: "list" | "calendar" | "stats") => setViewMode(value)}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "list" && (
            <CoverAssignmentsList assignments={filteredAssignments} onAssignmentClick={setSelectedAssignment} />
          )}
          {viewMode === "calendar" && (
            <CoverAssignmentCalendar assignments={filteredAssignments} onAssignmentClick={setSelectedAssignment} />
          )}
          {viewMode === "map" && (
            <CoverAssignmentMap assignments={filteredAssignments} onAssignmentClick={setSelectedAssignment} />
          )}
          {viewMode === "stats" && <CoverAssignmentStats assignments={assignments} />}
        </motion.div>
      </AnimatePresence>

      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant={selectedAssignment.status === "Upcoming" ? "default" : "secondary"}>
                  {selectedAssignment.status}
                </Badge>
                <span className="text-sm text-muted-foreground">{selectedAssignment.date}</span>
              </div>
              <h3 className="text-lg font-semibold">{selectedAssignment.class}</h3>
              <p>
                Session {selectedAssignment.session}: {selectedAssignment.time}
              </p>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedAssignment.originalTeacher}`}
                  />
                  <AvatarFallback>{selectedAssignment.originalTeacher[0]}</AvatarFallback>
                </Avatar>
                <span>{selectedAssignment.originalTeacher}</span>
              </div>
              <p className="text-sm">{selectedAssignment.notes}</p>
              {selectedAssignment.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Attachments:</h4>
                  <ul className="list-disc pl-5">
                    {selectedAssignment.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href="#" className="text-blue-500 hover:underline">
                          {attachment}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                  Close
                </Button>
                <Button>Accept Assignment</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notification Preferences
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </div>
        </CardContent>
      </Card>

      <NotificationPreferences />
      <FeedbackForm />
    </div>
  )
}

