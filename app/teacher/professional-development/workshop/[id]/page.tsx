"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function WorkshopPage() {
  const params = useParams()
  const workshopId = params.id

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Workshop Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You are registering for workshop ID: {workshopId}</p>
          <p className="mb-4">Workshop details would be displayed here.</p>
          <div className="flex space-x-4">
            <Button>Confirm Registration</Button>
            <Link href="/teacher/professional-development">
              <Button variant="outline">Back to Professional Development</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

