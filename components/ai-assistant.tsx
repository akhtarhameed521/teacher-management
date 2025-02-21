import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Zap } from "lucide-react"

interface AIAssistantProps {
  onSuggest: () => void
}

export function AIAssistant({ onSuggest }: AIAssistantProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onSuggest}
            size="lg"
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Zap className="h-8 w-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Get AI Suggestions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

