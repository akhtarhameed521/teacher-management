import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TopBar } from "@/components/top-bar"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <TopBar />
          <ScrollArea className="flex-1">
            <main className="p-6">
              <div className="container mx-auto max-w-7xl">{children}</div>
            </main>
          </ScrollArea>
          <WhatsAppButton className="fixed bottom-4 right-4 z-50" />
        </div>
      </div>
    </SidebarProvider>
  )
}

