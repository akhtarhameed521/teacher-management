"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CoverAssignment {
  id: number
  date: string
  class: string
  session: string
  time: string
  originalTeacher: string
  status: "Upcoming" | "Completed" | "Cancelled"
  location: { lat: number; lng: number }
}

interface CoverAssignmentMapProps {
  assignments: CoverAssignment[]
  onAssignmentClick: (assignment: CoverAssignment) => void
}

declare global {
  interface Window {
    google: any
  }
}

export function CoverAssignmentMap({ assignments, onAssignmentClick }: CoverAssignmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (typeof window.google === "undefined") {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      script.onload = initMap
    } else {
      initMap()
    }

    function initMap() {
      if (!mapRef.current) return

      const defaultLocation = { lat: 25.2048, lng: 55.2708 } // Dubai coordinates
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 10,
      })

      assignments.forEach((assignment) => {
        const marker = new window.google.maps.Marker({
          position: assignment.location,
          map: mapInstanceRef.current,
          title: assignment.class,
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h3>${assignment.class}</h3>
              <p>${assignment.date} - Session ${assignment.session}</p>
              <p>${assignment.status}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker)
          onAssignmentClick(assignment)
        })
      })
    }
  }, [assignments, onAssignmentClick])

  return (
    <Card>
      <CardContent>
        <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      </CardContent>
    </Card>
  )
}

