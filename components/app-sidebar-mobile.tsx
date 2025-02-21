"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { useSidebarContext } from "@/components/ui/sidebar"

export function AppSidebarMobile() {
  const { isOpen, toggleSidebar } = useSidebarContext()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden" onClick={toggleSidebar} />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar />
      </div>
    </>
  )
}

export { AppSidebarMobile }

