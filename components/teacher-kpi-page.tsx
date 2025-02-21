"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { TeacherProfile, TeacherKPIData } from "@/types/teacher"

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

export const TeacherKPIPage = ({
  teacherProfile,
  teacherKPIData,
}: { teacherProfile: TeacherProfile; teacherKPIData: TeacherKPIData }) => {
  const [activeTab, setActiveTab] = useState("overview")

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
        <TabsContent value="engagement">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement & Participation (15%)</CardTitle>
                <CardDescription>Goal: Ensure students are actively engaged in lessons.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{teacherProfile.level} Engagement Metrics</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <KPIScoreCard
                        title="Participation"
                        score={teacherKPIData.studentEngagement.participation}
                        description="Target: 80%"
                      />
                      <KPIScoreCard
                        title="Attendance Rate"
                        score={teacherKPIData.studentEngagement.attendanceRate}
                        description="Target: ≥90%"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>80%+ of students participate verbally twice per class</li>
                      <li>Attendance rate of students should be ≥ 90%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="effectiveness">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Teaching Effectiveness (15%)</CardTitle>
                <CardDescription>Goal: Deliver high-quality lessons that meet curriculum standards.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{teacherProfile.level} Teaching Techniques</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <KPIScoreCard
                        title="Technique Implementation"
                        score={teacherKPIData.teachingEffectiveness.techniqueImplementation}
                        description="Target: 75%"
                      />
                      <KPIScoreCard
                        title="Student Feedback Score"
                        score={(teacherKPIData.teachingEffectiveness.studentFeedback / 5) * 100}
                        description="Target: 4.5/5 average"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Must use appropriate teaching techniques in 75% of lessons</li>
                      <li>Student Feedback Score: 4.5/5 average</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="management">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Classroom Management & Behavior (10%)</CardTitle>
                <CardDescription>Goal: Maintain a positive and structured learning environment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{teacherProfile.level} Classroom Management</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <KPIScoreCard
                        title="Incidents"
                        score={(1 - teacherKPIData.classroomManagement.incidents / 3) * 100}
                        description="Target: Max 3 per term"
                      />
                      <KPIScoreCard
                        title="Observation Rating"
                        score={(teacherKPIData.classroomManagement.observationRating / 5) * 100}
                        description="Target: 4/5+"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Max 3 disruptive incidents per term</li>
                      <li>Observation rating must be 4/5+</li>
                      <li>Seating and materials must support learning</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="development">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Professional Development & Growth (10%)</CardTitle>
                <CardDescription>Goal: Encourage continuous learning and skill improvement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <KPIScoreCard
                      title="Workshops Attended"
                      score={(teacherKPIData.professionalDevelopment.workshopsAttended / 3) * 100}
                      description="Target: 3+ per year"
                    />
                    <KPIScoreCard
                      title="New Strategies Implemented"
                      score={(teacherKPIData.professionalDevelopment.newStrategiesImplemented / 1) * 100}
                      description="Target: 1+ per term"
                    />
                    <KPIScoreCard
                      title="Peer Observations"
                      score={(teacherKPIData.professionalDevelopment.peerObservations / 1) * 100}
                      description="Target: 1+ per term"
                    />
                    <KPIScoreCard
                      title="Evaluation Score"
                      score={(teacherKPIData.professionalDevelopment.evaluationScore / 5) * 100}
                      description="Target: 4/5+"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Attend at least 3 professional development workshops per year</li>
                      <li>Implement at least one new strategy from training into lesson plans</li>
                      <li>Participate in at least one peer observation per term</li>
                      <li>Score 4/5 or higher in supervisor and peer evaluations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="professionalism">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Professionalism & Attendance (15%)</CardTitle>
                <CardDescription>
                  Goal: Maintain high standards in punctuality, reliability, and professionalism.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <KPIScoreCard
                      title="Latenesses"
                      score={(1 - teacherKPIData.professionalism.latenesses / 3) * 100}
                      description="Target: Max 3 per term"
                    />
                    <KPIScoreCard
                      title="Absences"
                      score={(1 - teacherKPIData.professionalism.absences / 5) * 100}
                      description="Target: Max 5 per term"
                    />
                    <KPIScoreCard
                      title="Policy Adherence"
                      score={teacherKPIData.professionalism.policyAdherence}
                      description="Target: 100%"
                    />
                    <KPIScoreCard
                      title="On-Time Submissions"
                      score={teacherKPIData.professionalism.onTimeSubmissions}
                      description="Target: 100%"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Teacher must not be late more than 3 times per term</li>
                      <li>Absences should not exceed 5 days per term (excluding approved sick leave)</li>
                      <li>Must notify administration at least 2 hours before an absence (except emergencies)</li>
                      <li>Follows school policies and procedures 100% of the time</li>
                      <li>Submits reports and lesson plans on time</li>
                      <li>Maintains a professional attitude with colleagues and students</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

