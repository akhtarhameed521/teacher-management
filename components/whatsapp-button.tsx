"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const openWhatsApp = () => {
    const whatsappLink = "https://wa.me/1234567890"
    window.open(whatsappLink, "_blank")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Button
                  className={`
                    fixed bottom-6 right-6 
                    bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600
                    text-white shadow-lg 
                    flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
                    z-50 overflow-hidden
                    ${isHovered ? "animate-pulse" : ""}
                  `}
                  style={{
                    width: isHovered ? "180px" : "60px",
                    height: "60px",
                    borderRadius: "30px",
                    boxShadow: isHovered
                      ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                  }}
                  onClick={openWhatsApp}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <MessageCircle
                    className={`w-6 h-6 transition-transform duration-300 ${isHovered ? "rotate-12 mr-2" : ""}`}
                  />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isHovered ? "opacity-100 max-w-full" : "opacity-0 max-w-0"}`}
                  >
                    Message Us
                  </span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={5}>
              <p>Chat with us on WhatsApp</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  )
}

