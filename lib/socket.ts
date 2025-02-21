"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

const SocketContext = createContext(null)

export const SocketProvider = ({ children, url }: { children: React.ReactNode; url: string }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = new WebSocket(url)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [url])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

