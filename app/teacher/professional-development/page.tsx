"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Calendar,
  Users,
  Video,
  FileText,
  Target,
  Brain,
  Heart,
  Award,
  MessageCircle,
  Globe,
  TrendingUp,
  Coffee,
  Star,
  Trophy,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { FloatingCalendar } from "@/components/floating-calendar"
import { TeacherLeaderboard } from "@/components/teacher-leaderboard"
import { CertificatesAchieved } from "@/components/certificates-achieved"

export default function ProfessionalDevelopment() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [userLevel, setUserLevel] = useState(1)
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  const upcomingWorkshops = [
    {
      id: "w1",
      title: "Advanced TESOL Techniques",
      date: "2024-03-15",
      duration: "6 hours",
      type: "Online",
      spots: 15,
    },
    {
      id: "w2",
      title: "Teaching English Through Technology",
      date: "2024-03-20",
      duration: "4 hours",
      type: "Hybrid",
      spots: 20,
    },
    {
      id: "w3",
      title: "Cultural Sensitivity in ESL",
      date: "2024-04-01",
      duration: "3 hours",
      type: "In-person",
      spots: 12,
    },
  ]

  const resources = [
    {
      title: "ESL Lesson Planning Templates",
      type: "Template",
      downloads: 234,
      new: true,
    },
    {
      title: "Pronunciation Assessment Rubric",
      type: "Assessment",
      downloads: 189,
      new: false,
    },
    {
      title: "Interactive Grammar Activities",
      type: "Activity",
      downloads: 312,
      new: true,
    },
  ]

  const certifications = [
    {
      title: "CELTA Certification",
      provider: "Cambridge English",
      duration: "4 weeks",
      progress: 65,
    },
    {
      title: "Digital Teaching Methods",
      provider: "Coursera",
      duration: "6 weeks",
      progress: 30,
    },
    {
      title: "Teaching Business English",
      provider: "TESOL International",
      duration: "8 weeks",
      progress: 90,
    },
  ]

  useEffect(() => {
    // Simulate initial points and level
    setUserPoints(750)
    setUserLevel(3)
  }, [])

  const addPoints = (points: number) => {
    setUserPoints((prevPoints) => {
      const newPoints = prevPoints + points
      if (newPoints >= userLevel * 1000) {
        setUserLevel((prevLevel) => prevLevel + 1)
        setShowLevelUpAnimation(true)
        setTimeout(() => setShowLevelUpAnimation(false), 3000)
      }
      return newPoints
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Professional Development</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-lg">
            <Star className="mr-2 h-4 w-4" />
            {userPoints} XP
          </Badge>
          <Badge variant="outline" className="text-lg">
            <Trophy className="mr-2 h-4 w-4" />
            Level {userLevel}
          </Badge>
          <Button variant="outline" onClick={() => setShowCalendar(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      {showLevelUpAnimation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg z-50"
        >
          <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
          <p>Congratulations! You've reached Level {userLevel}!</p>
        </motion.div>
      )}

      <Tabs defaultValue="training" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-4">
          <TabsTrigger value="training">Training & Workshops</TabsTrigger>
          <TabsTrigger value="resources">Teaching Resources</TabsTrigger>
          <TabsTrigger value="courses">Online Courses</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
          <TabsTrigger value="career">Career Growth</TabsTrigger>
          <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Workshops
                </CardTitle>
                <CardDescription>Register for upcoming training sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setSelectedWorkshop(workshop.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{workshop.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workshop.date).toLocaleDateString()} • {workshop.duration}
                        </p>
                      </div>
                      <Badge variant={workshop.type === "Online" ? "default" : "secondary"}>{workshop.type}</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{workshop.spots} spots available</span>
                      <Link href={`/teacher/professional-development/workshop/${workshop.id}`}>
                        <Button size="sm" onClick={() => addPoints(50)}>
                          Register (+50 XP)
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  On-demand Training
                </CardTitle>
                <CardDescription>Access recorded sessions and materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Teaching Pronunciation Effectively</h3>
                    <p className="text-sm text-muted-foreground mb-2">Duration: 45 minutes</p>
                    <Link href="/teacher/professional-development/video/pronunciation">
                      <Button variant="outline" className="w-full" onClick={() => addPoints(30)}>
                        Watch Now (+30 XP)
                      </Button>
                    </Link>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Grammar Teaching Techniques</h3>
                    <p className="text-sm text-muted-foreground mb-2">Duration: 60 minutes</p>
                    <Link href="/teacher/professional-development/video/grammar">
                      <Button variant="outline" className="w-full" onClick={() => addPoints(40)}>
                        Watch Now (+40 XP)
                      </Button>
                    </Link>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Teaching Writing Skills</h3>
                    <p className="text-sm text-muted-foreground mb-2">Duration: 50 minutes</p>
                    <Link href="/teacher/professional-development/video/writing">
                      <Button variant="outline" className="w-full" onClick={() => addPoints(35)}>
                        Watch Now (+35 XP)
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Teaching Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                      onClick={() => addPoints(10)}
                    >
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.downloads} downloads</p>
                      </div>
                      {resource.new && <Badge>New</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Assessment Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Speaking Assessment Rubric</h3>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => addPoints(15)}>
                      Download (+15 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Writing Evaluation Guide</h3>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => addPoints(15)}>
                      Download (+15 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Cultural Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Cross-Cultural Communication Guide</h3>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => addPoints(20)}>
                      Access (+20 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Cultural Sensitivity Training</h3>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => addPoints(20)}>
                      Access (+20 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Current Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {certifications.map((cert, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{cert.title}</h3>
                        <Badge variant="outline">{cert.provider}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Duration: {cert.duration}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Advanced TESOL Certification</h3>
                    <p className="text-sm text-muted-foreground mb-2">By Cambridge English</p>
                    <Button className="w-full" onClick={() => addPoints(100)}>
                      Enroll Now (+100 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Teaching English Online</h3>
                    <p className="text-sm text-muted-foreground mb-2">By British Council</p>
                    <Button className="w-full" onClick={() => addPoints(100)}>
                      Enroll Now (+100 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Latest Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Technology in ESL Classrooms</h3>
                    <p className="text-sm text-muted-foreground">Published in TESOL Quarterly</p>
                    <Button variant="outline" className="mt-2" onClick={() => addPoints(25)}>
                      Read More (+25 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Mobile Learning in Language Teaching</h3>
                    <p className="text-sm text-muted-foreground">Published in ELT Journal</p>
                    <Button variant="outline" className="mt-2" onClick={() => addPoints(25)}>
                      Read More (+25 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Teaching Innovations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">AI in Language Learning</h3>
                    <p className="text-sm text-muted-foreground mb-2">Emerging trends and applications</p>
                    <Button variant="outline" className="w-full" onClick={() => addPoints(30)}>
                      Explore (+30 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Virtual Reality for ESL</h3>
                    <p className="text-sm text-muted-foreground mb-2">Immersive learning experiences</p>
                    <Button variant="outline" className="w-full" onClick={() => addPoints(30)}>
                      Explore (+30 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Mentorship Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Peer Observation Program</h3>
                    <p className="text-sm text-muted-foreground mb-2">Learn from experienced ESL teachers</p>
                    <Button className="w-full" onClick={() => addPoints(75)}>
                      Join Program (+75 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">New Teacher Mentoring</h3>
                    <p className="text-sm text-muted-foreground mb-2">Get guidance from senior teachers</p>
                    <Button className="w-full" onClick={() => addPoints(75)}>
                      Apply Now (+75 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Discussion Forums
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Teaching Methodology Forum</h3>
                    <p className="text-sm text-muted-foreground">238 active discussions</p>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => addPoints(40)}>
                      Join Discussion (+40 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Resource Sharing Group</h3>
                    <p className="text-sm text-muted-foreground">156 active members</p>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => addPoints(40)}>
                      Join Group (+40 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">TESOL International Convention</h3>
                      <p className="text-sm text-muted-foreground">March 15-18, 2024 • Virtual</p>
                    </div>
                    <Badge>Featured</Badge>
                  </div>
                  <Button className="mt-4" onClick={() => addPoints(150)}>
                    Register Now (+150 XP)
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">ESL Teaching Innovation Summit</h3>
                      <p className="text-sm text-muted-foreground">April 5-6, 2024 • Hybrid</p>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <Button variant="outline" className="mt-4" onClick={() => addPoints(50)}>
                    Learn More (+50 XP)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Career Advancement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Leadership Development Program</h3>
                    <p className="text-sm text-muted-foreground mb-2">Path to becoming a Senior Teacher</p>
                    <Button className="w-full" onClick={() => addPoints(125)}>
                      Apply Now (+125 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Department Head Training</h3>
                    <p className="text-sm text-muted-foreground mb-2">Administrative skills development</p>
                    <Button className="w-full" onClick={() => addPoints(100)}>
                      Learn More (+100 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recognition Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Teacher of the Year Awards</h3>
                    <p className="text-sm text-muted-foreground mb-2">Annual recognition program</p>
                    <Button variant="outline" className="w-full" onClick={() => addPoints(50)}>
                      View Criteria (+50 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Innovation in Teaching Award</h3>
                    <p className="text-sm text-muted-foreground mb-2">Quarterly recognition</p>
                    <Button variant="outline" className="w-full" onClick={() => addPoints(75)}>
                      Submit Nomination (+75 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wellbeing" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Wellness Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Stress Management Workshop</h3>
                    <p className="text-sm text-muted-foreground mb-2">Weekly online sessions</p>
                    <Button className="w-full" onClick={() => addPoints(60)}>
                      Join Session (+60 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Mindfulness for Teachers</h3>
                    <p className="text-sm text-muted-foreground mb-2">Daily guided practices</p>
                    <Button className="w-full" onClick={() => addPoints(60)}>
                      Access Resources (+60 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coffee className="mr-2 h-5 w-5" />
                  Work-Life Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Time Management Strategies</h3>
                    <p className="text-sm text-muted-foreground mb-2">For busy ESL teachers</p>
                    <Button variant="outline" className="w-full" onClick={() => addPoints(40)}>
                      Learn More (+40 XP)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Teacher Support Network</h3>
                    <p className="text-sm text-muted-foreground mb-2">24/7 counseling services</p>
                    <Button variant="outline" className="w-full" onClick={() => addPoints(40)}>
                      Get Support (+40 XP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Badge variant="outline" className="p-4 flex flex-col items-center">
              <Award className="h-8 w-8 mb-2" />
              <span>Workshop Master</span>
            </Badge>
            <Badge variant="outline" className="p-4 flex flex-col items-center">
              <BookOpen className="h-8 w-8 mb-2" />
              <span>Resource Explorer</span>
            </Badge>
            <Badge variant="outline" className="p-4 flex flex-col items-center">
              <Brain className="h-8 w-8 mb-2" />
              <span>Research Enthusiast</span>
            </Badge>
            <Badge variant="outline" className="p-4 flex flex-col items-center">
              <Heart className="h-8 w-8 mb-2" />
              <span>Well-being Advocate</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      <CertificatesAchieved />

      {showCalendar && <FloatingCalendar onClose={() => setShowCalendar(false)} />}
      <TeacherLeaderboard />
    </div>
  )
}

