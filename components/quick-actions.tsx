import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ClipboardList, MessageCircle, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function QuickActions() {
  const router = useRouter()
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: `${action} action initiated.`,
    })
    // Add specific routing or actions here
    switch (action) {
      case "Create Class":
        router.push("/manager/classes/create")
        break
      case "Take Attendance":
        router.push("/manager/attendance")
        break
      case "Send Message":
        router.push("/manager/messages")
        break
      case "Create Report":
        router.push("/manager/reports")
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Button variant="outline" className="h-24 flex-col" onClick={() => handleAction("Create Class")}>
            <PlusCircle className="h-6 w-6 mb-2" />
            Create Class
          </Button>
          <Button variant="outline" className="h-24 flex-col" onClick={() => handleAction("Take Attendance")}>
            <ClipboardList className="h-6 w-6 mb-2" />
            Take Attendance
          </Button>
          <Button variant="outline" className="h-24 flex-col" onClick={() => handleAction("Send Message")}>
            <MessageCircle className="h-6 w-6 mb-2" />
            Send Message
          </Button>
          <Button variant="outline" className="h-24 flex-col" onClick={() => handleAction("Create Report")}>
            <FileText className="h-6 w-6 mb-2" />
            Create Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

