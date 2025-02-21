"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>{children}</SidebarContext.Provider>
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

export const Sidebar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <aside className={className}>{children}</aside>
}

export const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 mt-4 bg-secondary/10">{children}</div>
}

export const SidebarHeader = ({ children }: { children: React.ReactNode }) => {
  return <header className="p-4 mt-4 bg-primary/10">{children}</header>
}

export const SidebarMenu = ({ children }: { children: React.ReactNode }) => {
  return <nav>{children}</nav>
}

export const SidebarMenuItem = ({ children }: { children: React.ReactNode }) => {
  return <li>{children}</li>
}

export const SidebarMenuButton = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <button>{children}</button>
}

