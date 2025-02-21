"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Download } from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    { title: "ESL Lesson Planning Templates", downloads: 234 },
    { title: "Pronunciation Assessment Rubric", downloads: 189 },
    { title: "Interactive Grammar Activities", downloads: 312 },
  ]

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Teaching Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.downloads} downloads</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/teacher/professional-development">
              <Button variant="outline">Back to Professional Development</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

