"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Heart,
  Clock,
  Building,
  Phone,
  Headphones,
  MessageCircle,
  BookOpen,
  Pencil,
} from "lucide-react"
import type { TeacherProfile } from "@/types/teacher"

// Mock data for demonstration
const mockTeacherProfiles = {
  "mohamed-hashim": {
    id: "mohamed-hashim",
    name: "Mohamed Hashim",
    email: "mohamed.hashim@arx.edu",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8tytteA6jz61DFKy5ks1xOjaqOT2UX.png",
    position: "English Language Teacher",
    level: "Fnd-01",
    joinDate: "2020-09-01",
    yearsAtArx: 3,
    previousExperience: [
      {
        company: "International Language School",
        position: "ESL Teacher",
        duration: "2018-2020",
        description: "Taught English as a Second Language to adult learners",
      },
    ],
    education: [
      {
        degree: "MA in TESOL",
        institution: "University of Manchester",
        year: "2018",
      },
      {
        degree: "BA in English Literature",
        institution: "University of Cairo",
        year: "2016",
      },
    ],
    certifications: [
      {
        name: "CELTA",
        issuer: "Cambridge English",
        year: "2017",
      },
    ],
    medicalInfo: {
      conditions: [],
      allergies: [],
      emergencyContact: {
        name: "Fatima Hashim",
        relation: "Spouse",
        phone: "+20 100 123 4567",
      },
    },
    cvLink: "/documents/mohamed-hashim-cv.pdf",
    isActive: true,
  },
  // Add more mock profiles for other teachers here
  "saif-khan": {
    id: "saif-khan",
    name: "Saif Khan",
    email: "saif.khan@arx.edu",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8tytteA6jz61DFKy5ks1xOjaqOT2UX.png",
    position: "English Language Teacher",
    level: "A2",
    joinDate: "2021-09-01",
    yearsAtArx: 2.5,
    previousExperience: [
      {
        company: "International Language School",
        position: "ESL Teacher",
        duration: "2018-2021",
        description: "Taught English as a Second Language to adult learners",
      },
      {
        company: "Global Education Center",
        position: "Language Instructor",
        duration: "2016-2018",
        description: "Conducted business English courses for corporate clients",
      },
    ],
    education: [
      {
        degree: "MA in TESOL",
        institution: "University of Manchester",
        year: "2016",
      },
      {
        degree: "BA in English Literature",
        institution: "University of Leeds",
        year: "2014",
      },
    ],
    certifications: [
      {
        name: "CELTA",
        issuer: "Cambridge English",
        year: "2015",
      },
      {
        name: "DELTA",
        issuer: "Cambridge English",
        year: "2019",
      },
    ],
    medicalInfo: {
      conditions: ["Mild Asthma"],
      allergies: ["Peanuts"],
      emergencyContact: {
        name: "Sarah Khan",
        relation: "Spouse",
        phone: "+44 7700 900123",
      },
    },
    cvLink: "/documents/saif-khan-cv.pdf",
    isActive: true,
  },
}

const mockTeacherKPIData = {
  "mohamed-hashim": {
    teacherId: "mohamed-hashim",
    overallScore: 85,
    studentPerformance: {
      score: 84,
      passRate: 78,
      averageGrowth: 12,
    },
    studentEngagement: {
      score: 90,
      participation: 88,
      attendanceRate: 98,
    },
    teachingEffectiveness: {
      score: 86,
      techniqueImplementation: 85,
      studentFeedback: 4.5,
    },
    classroomManagement: {
      score: 88,
      incidents: 1,
      observationRating: 4.6,
    },
    professionalDevelopment: {
      score: 82,
      workshopsAttended: 3,
      newStrategiesImplemented: 2,
      peerObservations: 1,
      evaluationScore: 4.2,
    },
    professionalism: {
      score: 95,
      latenesses: 0,
      absences: 1,
      policyAdherence: 100,
      onTimeSubmissions: 100,
    },
  },
  "saif-khan": {
    teacherId: "saif-khan",
    overallScore: 92,
    studentPerformance: {
      score: 94,
      passRate: 88,
      averageGrowth: 15,
    },
    studentEngagement: {
      score: 95,
      participation: 92,
      attendanceRate: 99,
    },
    teachingEffectiveness: {
      score: 93,
      techniqueImplementation: 90,
      studentFeedback: 4.8,
    },
    classroomManagement: {
      score: 90,
      incidents: 0,
      observationRating: 4.9,
    },
    professionalDevelopment: {
      score: 88,
      workshopsAttended: 4,
      newStrategiesImplemented: 3,
      peerObservations: 2,
      evaluationScore: 4.5,
    },
    professionalism: {
      score: 98,
      latenesses: 0,
      absences: 0,
      policyAdherence: 100,
      onTimeSubmissions: 100,
    },
  },
  // Add more mock KPI data for other teachers here
}

const KPIScoreCard = ({ title, score, description }: { title: string; score: number; description?: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge variant={score >= 90 ? "default" : score >= 80 ? "secondary" : "destructive"}>{score}%</Badge>
            </CardHeader>
            <CardContent>
              <Progress value={score} className="h-2" />
              {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
            </CardContent>
          </Card>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click for more details</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const TeacherProfile = ({ profile }: { profile: TeacherProfile }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.position}</p>
              <Badge className="mt-2">{profile.level} Level Teacher</Badge>
            </div>
            <Button asChild variant="outline" className="w-full">
              <a href={profile.cvLink} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                View CV
              </a>
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Joined ARX: {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{profile.yearsAtArx} years at ARX</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Heart className="mr-2 h-4 w-4" />
                    Medical Information
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Medical Information</DialogTitle>
                    <DialogDescription>Confidential medical information for {profile.name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Medical Conditions</h4>
                      <ul className="list-disc pl-5">
                        {profile.medicalInfo.conditions.length > 0 ? (
                          profile.medicalInfo.conditions.map((condition, i) => <li key={i}>{condition}</li>)
                        ) : (
                          <li>No known medical conditions</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Allergies</h4>
                      <ul className="list-disc pl-5">
                        {profile.medicalInfo.allergies.length > 0 ? (
                          profile.medicalInfo.allergies.map((allergy, i) => <li key={i}>{allergy}</li>)
                        ) : (
                          <li>No known allergies</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Emergency Contact</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          {profile.medicalInfo.emergencyContact.phone}
                        </div>
                        <p>
                          {profile.medicalInfo.emergencyContact.name} ({profile.medicalInfo.emergencyContact.relation})
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Briefcase className="mr-2" />
                Previous Experience
              </h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                {profile.previousExperience.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <h4 className="font-semibold">{exp.company}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exp.position} • {exp.duration}
                    </p>
                    <p className="text-sm mt-1">{exp.description}</p>
                    {i < profile.previousExperience.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <GraduationCap className="mr-2" />
                  Education
                </h3>
                <ScrollArea className="h-[150px] rounded-md border p-4">
                  {profile.education.map((edu, i) => (
                    <div key={i} className="mb-4">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                      {i < profile.education.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div>
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Award className="mr-2" />
                  Certifications
                </h3>
                <ScrollArea className="h-[150px] rounded-md border p-4">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="mb-4">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}, {cert.year}
                      </p>
                      {i < profile.certifications.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TeacherKPIPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const teacherId = params.id
  const teacherProfile = mockTeacherProfiles[teacherId]
  const teacherKPIData = mockTeacherKPIData[teacherId]

  if (!teacherProfile || !teacherKPIData) {
    return <div>Teacher not found</div>
  }

  const skillScores = [
    { skill: "Listening", score: 85, icon: <Headphones className="h-4 w-4" /> },
    { skill: "Speaking", score: 82, icon: <MessageCircle className="h-4 w-4" /> },
    { skill: "Reading", score: 88, icon: <BookOpen className="h-4 w-4" /> },
    { skill: "Writing", score: 80, icon: <Pencil className="h-4 w-4" /> },
  ]

  return (
    <div className="container mx-auto p-6">
      <TeacherProfile profile={teacherProfile} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <KPIScoreCard
            title="Overall Performance"
            score={teacherKPIData.overallScore}
            description="Based on all KPI categories"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <KPIScoreCard
            title="Student Performance & Progress"
            score={teacherKPIData.studentPerformance.score}
            description="35% weight in overall score"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <KPIScoreCard
            title="Student Engagement & Participation"
            score={teacherKPIData.studentEngagement.score}
            description="15% weight in overall score"
          />
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Student Performance</TabsTrigger>
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="effectiveness">Teaching Effectiveness</TabsTrigger>
          <TabsTrigger value="management">Classroom Management</TabsTrigger>
          <TabsTrigger value="development">Professional Development</TabsTrigger>
          <TabsTrigger value="professionalism">Professionalism</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>KPI Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { category: "Student Performance", value: teacherKPIData.studentPerformance.score },
                    { category: "Student Engagement", value: teacherKPIData.studentEngagement.score },
                    { category: "Teaching Effectiveness", value: teacherKPIData.teachingEffectiveness.score },
                    { category: "Classroom Management", value: teacherKPIData.classroomManagement.score },
                    { category: "Professional Development", value: teacherKPIData.professionalDevelopment.score },
                    { category: "Professionalism", value: teacherKPIData.professionalism.score },
                  ]}
                  index="category"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { month: "Jan", score: 83 },
                    { month: "Feb", score: 85 },
                    { month: "Mar", score: 84 },
                    { month: "Apr", score: 86 },
                    { month: "May", score: 87 },
                    { month: "Jun", score: 87 },
                  ]}
                  index="month"
                  categories={["score"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value}%`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="performance">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Student Performance & Progress (35%)</CardTitle>
                <CardDescription>Goal: Ensure students improve their English proficiency.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{teacherProfile.level} Performance</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <KPIScoreCard
                        title="Pass Rate"
                        score={teacherKPIData.studentPerformance.passRate}
                        description="Target: 75%"
                      />
                      <KPIScoreCard
                        title="Average Growth"
                        score={(teacherKPIData.studentPerformance.averageGrowth / 7) * 100}
                        description="Target: 7+ points per term"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>75%+ of students must improve scores by at least 7 points per term</li>
                      <li>Starting score range: 100 – 120</li>
                      <li>Growth target per term: +7 to 12 points</li>
                      <li>Target score after term: 107 – 132</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        {/* Add other TabsContent components for engagement, effectiveness, management, development, and professionalism */}
      </Tabs>
    </div>
  )
}

