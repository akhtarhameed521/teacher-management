"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-20">
        {/* Logo */}
        <motion.div
          className="absolute top-8 left-8 w-[200px]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-voGpdZr0l19Oyu72iNr7BFGX5EXwqF.png"
            alt="ARX Aerospace and Defense Logo"
            width={200}
            height={60}
            className="w-full h-auto"
            priority
          />
        </motion.div>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-500 to-white">
            IATC Portal
          </h1>
          <p className="text-2xl text-white/60">Elevating Education in Aviation Technology</p>
        </motion.div>

        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
            duration: 2,
          }}
        >
          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3UQDCoE103aD7IQsISsI1Mpl2i49tU.png"
            alt="Modern Foldable Drone"
            className="w-[600px] h-auto relative z-10"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-blue-500/20 blur-3xl"
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-black/30 border border-white/10 backdrop-blur-lg">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg text-white">Student Portal</CardTitle>
                  <CardDescription className="text-white/60">
                    Access your grades and track your academic progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-400" asChild>
                    <Link href="/student">Enter Student Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-black/30 border border-white/10 backdrop-blur-lg">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle className="text-lg text-white">Teacher Portal</CardTitle>
                  <CardDescription className="text-white/60">
                    Access your timetable and manage your classes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-400" asChild>
                    <Link href="/teacher">Enter Teacher Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-black/30 border border-white/10 backdrop-blur-lg">
                <CardHeader>
                  <Users className="h-8 w-8 text-cyan-500 mb-2" />
                  <CardTitle className="text-lg text-white">Management Portal</CardTitle>
                  <CardDescription className="text-white/60">
                    Manage teachers, timetables, and school operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400" asChild>
                    <Link href="/manager">Enter Management Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

