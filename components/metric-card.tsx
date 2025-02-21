"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: number
  suffix?: string
  positive?: boolean
  onViewDetails?: () => void
  className?: string
}

export function MetricCard({ label, value, suffix = "", positive = false, onViewDetails, className }: MetricCardProps) {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (label.toLowerCase().includes("attendance") && value < 85) {
      setShowWarning(true)
    }
  }, [label, value])

  const handleCopyReport = async () => {
    try {
      // Simulating API call to fetch report data
      const response = await fetch("/api/management/report")
      const reportData = await response.json()

      // Copy report data to clipboard
      await navigator.clipboard.writeText(JSON.stringify(reportData, null, 2))

      toast({
        title: "Report Copied",
        description: "The management report has been copied to your clipboard.",
      })
    } catch (error) {
      console.error("Error copying report:", error)
      toast({
        title: "Error",
        description: "Failed to copy the report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = () => {
    if (label.toLowerCase().includes("attendance")) {
      router.push("/student/attendance")
    }
  }

  return (
    <Card className={cn("bg-white dark:bg-gray-800", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-2xl font-bold">
          {value}
          {suffix}
        </p>
        {positive && <span className="text-green-500">↑</span>}
      </div>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-sm flex items-center justify-center"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Attendance below 85%
        </motion.div>
      )}
      {label.toLowerCase().includes("attendance") && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full flex items-center justify-center"
          onClick={handleViewDetails}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </Card>
  )
}

