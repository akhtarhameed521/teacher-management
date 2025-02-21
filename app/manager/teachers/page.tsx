"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TeacherKPIPage } from "@/components/teacher-kpi-page"
import type { TeacherProfile, TeacherKPIData } from "@/types/teacher"

// Mock data for demonstration
const teachersData = [
  {
    id: "mohamed-hashim",
    name: "Mohamed Hashim",
    level: "Fnd-01",
    kpiScore: 85,
    studentGrowth: 12,
    engagement: 90,
    attendance: 98,
    professionalism: "Excellent",
    status: "Good",
  },
  {
    id: "sheraz-siddiq",
    name: "Sheraz Siddiq",
    level: "Senior",
    kpiScore: 78,
    studentGrowth: 9,
    engagement: 75,
    attendance: 95,
    professionalism: "Needs Work",
    status: "Average",
  },
  {
    id: "ameen-daniel",
    name: "Ameen Daniel",
    level: "Fnd-03",
    kpiScore: 82,
    studentGrowth: 10,
    engagement: 85,
    attendance: 90,
    professionalism: "Good",
    status: "Good",
  },
  {
    id: "haroon-raja",
    name: "Haroon Raja",
    level: "Senior",
    kpiScore: 70,
    studentGrowth: 7,
    engagement: 80,
    attendance: 85,
    professionalism: "Needs Work",
    status: "Average",
  },
  {
    id: "hisham-bereir",
    name: "Hisham Bereir",
    level: "Senior",
    kpiScore: 88,
    studentGrowth: 15,
    engagement: 95,
    attendance: 98,
    professionalism: "Excellent",
    status: "Good",
  },
]

const mockTeacherProfiles: { [key: string]: TeacherProfile } = {
  "mohamed-hashim": {
    id: "mohamed-hashim",
    name: "Mohamed Hashim",
    email: "mohamed.hashim@arx.edu",
    image: "https://example.com/mohamed-hashim.jpg",
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
  "sheraz-siddiq": {
    id: "sheraz-siddiq",
    name: "Sheraz Siddiq",
    email: "sheraz.siddiq@arx.edu",
    image: "https://example.com/sheraz-siddiq.jpg",
    position: "Mathematics Teacher",
    level: "Senior",
    joinDate: "2017-06-15",
    yearsAtArx: 6,
    previousExperience: [
      {
        company: "Al-Azhar University",
        position: "Mathematics Lecturer",
        duration: "2015-2017",
        description: "Taught advanced mathematics courses to undergraduate students",
      },
    ],
    education: [
      {
        degree: "PhD in Mathematics",
        institution: "Cairo University",
        year: "2015",
      },
      {
        degree: "MSc in Applied Mathematics",
        institution: "Ain Shams University",
        year: "2012",
      },
    ],
    certifications: [
      {
        name: "Advanced Pedagogy in Mathematics",
        issuer: "Egyptian Mathematical Society",
        year: "2016",
      },
    ],
    medicalInfo: {
      conditions: ["Mild Asthma"],
      allergies: ["Dust"],
      emergencyContact: {
        name: "Aisha Siddiq",
        relation: "Sister",
        phone: "+20 109 876 5432",
      },
    },
    cvLink: "/documents/sheraz-siddiq-cv.pdf",
    isActive: true,
  },
  "ameen-daniel": {
    id: "ameen-daniel",
    name: "Ameen Daniel",
    email: "ameen.daniel@arx.edu",
    image: "https://example.com/ameen-daniel.jpg",
    position: "Science Teacher",
    level: "Fnd-03",
    joinDate: "2022-01-20",
    yearsAtArx: 1,
    previousExperience: [
      {
        company: "Cairo American College",
        position: "Science Lab Assistant",
        duration: "2020-2021",
        description: "Assisted in preparing and conducting science experiments for middle school students",
      },
    ],
    education: [
      {
        degree: "BSc in Biology",
        institution: "American University in Cairo",
        year: "2020",
      },
    ],
    certifications: [
      {
        name: "STEM Education Certificate",
        issuer: "Egyptian STEM Education Coalition",
        year: "2021",
      },
    ],
    medicalInfo: {
      conditions: [],
      allergies: ["Peanuts"],
      emergencyContact: {
        name: "Laila Daniel",
        relation: "Mother",
        phone: "+20 112 345 6789",
      },
    },
    cvLink: "/documents/ameen-daniel-cv.pdf",
    isActive: true,
  },
  "haroon-raja": {
    id: "haroon-raja",
    name: "Haroon Raja",
    email: "haroon.raja@arx.edu",
    image: "https://example.com/haroon-raja.jpg",
    position: "Social Studies Teacher",
    level: "Senior",
    joinDate: "2019-11-01",
    yearsAtArx: 3,
    previousExperience: [
      {
        company: "British Council Egypt",
        position: "Cultural Exchange Coordinator",
        duration: "2017-2019",
        description: "Organized and facilitated cultural exchange programs for students and young professionals",
      },
    ],
    education: [
      {
        degree: "MA in Middle Eastern Studies",
        institution: "SOAS University of London",
        year: "2017",
      },
      {
        degree: "BA in Political Science",
        institution: "Alexandria University",
        year: "2015",
      },
    ],
    certifications: [
      {
        name: "International Baccalaureate (IB) Educator Certificate",
        issuer: "International Baccalaureate Organization",
        year: "2020",
      },
    ],
    medicalInfo: {
      conditions: ["Type 2 Diabetes"],
      allergies: [],
      emergencyContact: {
        name: "Zainab Raja",
        relation: "Wife",
        phone: "+20 115 987 6543",
      },
    },
    cvLink: "/documents/haroon-raja-cv.pdf",
    isActive: true,
  },
  "hisham-bereir": {
    id: "hisham-bereir",
    name: "Hisham Bereir",
    email: "hisham.bereir@arx.edu",
    image: "https://example.com/hisham-bereir.jpg",
    position: "Arabic Language Teacher",
    level: "Senior",
    joinDate: "2021-03-10",
    yearsAtArx: 2,
    previousExperience: [
      {
        company: "Al-Azhar University",
        position: "Arabic Language Instructor",
        duration: "2018-2021",
        description: "Taught Modern Standard Arabic and Classical Arabic to international students",
      },
      {
        company: "Qatar Foundation",
        position: "Arabic Curriculum Developer",
        duration: "2016-2018",
        description: "Developed Arabic language curriculum for K-12 students",
      },
    ],
    education: [
      {
        degree: "PhD in Arabic Linguistics",
        institution: "Cairo University",
        year: "2016",
      },
      {
        degree: "MA in Teaching Arabic as a Foreign Language",
        institution: "American University in Cairo",
        year: "2012",
      },
    ],
    certifications: [
      {
        name: "Certified Arabic Language Proficiency Tester",
        issuer: "American Council on the Teaching of Foreign Languages (ACTFL)",
        year: "2019",
      },
    ],
    medicalInfo: {
      conditions: [],
      allergies: [],
      emergencyContact: {
        name: "Nour Bereir",
        relation: "Spouse",
        phone: "+20 128 765 4321",
      },
    },
    cvLink: "/documents/hisham-bereir-cv.pdf",
    isActive: true,
  },
}

const mockTeacherKPIData: { [key: string]: TeacherKPIData } = {
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
  "sheraz-siddiq": {
    teacherId: "sheraz-siddiq",
    overallScore: 78,
    studentPerformance: {
      score: 75,
      passRate: 70,
      averageGrowth: 9,
    },
    studentEngagement: {
      score: 75,
      participation: 72,
      attendanceRate: 95,
    },
    teachingEffectiveness: {
      score: 76,
      techniqueImplementation: 75,
      studentFeedback: 3.8,
    },
    classroomManagement: {
      score: 80,
      incidents: 3,
      observationRating: 3.9,
    },
    professionalDevelopment: {
      score: 70,
      workshopsAttended: 1,
      newStrategiesImplemented: 0,
      peerObservations: 0,
      evaluationScore: 3.5,
    },
    professionalism: {
      score: 85,
      latenesses: 2,
      absences: 2,
      policyAdherence: 90,
      onTimeSubmissions: 95,
    },
  },
  "ameen-daniel": {
    teacherId: "ameen-daniel",
    overallScore: 82,
    studentPerformance: {
      score: 80,
      passRate: 75,
      averageGrowth: 10,
    },
    studentEngagement: {
      score: 85,
      participation: 82,
      attendanceRate: 90,
    },
    teachingEffectiveness: {
      score: 84,
      techniqueImplementation: 82,
      studentFeedback: 4.2,
    },
    classroomManagement: {
      score: 86,
      incidents: 2,
      observationRating: 4.3,
    },
    professionalDevelopment: {
      score: 78,
      workshopsAttended: 2,
      newStrategiesImplemented: 1,
      peerObservations: 1,
      evaluationScore: 4.0,
    },
    professionalism: {
      score: 90,
      latenesses: 1,
      absences: 0,
      policyAdherence: 98,
      onTimeSubmissions: 98,
    },
  },
  "haroon-raja": {
    teacherId: "haroon-raja",
    overallScore: 70,
    studentPerformance: {
      score: 68,
      passRate: 65,
      averageGrowth: 7,
    },
    studentEngagement: {
      score: 80,
      participation: 78,
      attendanceRate: 85,
    },
    teachingEffectiveness: {
      score: 72,
      techniqueImplementation: 70,
      studentFeedback: 3.5,
    },
    classroomManagement: {
      score: 75,
      incidents: 4,
      observationRating: 3.6,
    },
    professionalDevelopment: {
      score: 65,
      workshopsAttended: 0,
      newStrategiesImplemented: 0,
      peerObservations: 0,
      evaluationScore: 3.2,
    },
    professionalism: {
      score: 80,
      latenesses: 3,
      absences: 3,
      policyAdherence: 85,
      onTimeSubmissions: 88,
    },
  },
  "hisham-bereir": {
    teacherId: "hisham-bereir",
    overallScore: 88,
    studentPerformance: {
      score: 86,
      passRate: 82,
      averageGrowth: 15,
    },
    studentEngagement: {
      score: 95,
      participation: 92,
      attendanceRate: 98,
    },
    teachingEffectiveness: {
      score: 90,
      techniqueImplementation: 88,
      studentFeedback: 4.7,
    },
    classroomManagement: {
      score: 92,
      incidents: 0,
      observationRating: 4.8,
    },
    professionalDevelopment: {
      score: 85,
      workshopsAttended: 4,
      newStrategiesImplemented: 3,
      peerObservations: 2,
      evaluationScore: 4.4,
    },
    professionalism: {
      score: 98,
      latenesses: 0,
      absences: 0,
      policyAdherence: 100,
      onTimeSubmissions: 100,
    },
  },
}

const AdvancedTeacherKPIDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [attendanceFilter, setAttendanceFilter] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)

  const filteredTeachers = teachersData.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (levelFilter === "all" || teacher.level === levelFilter) &&
      (statusFilter === "all" || teacher.status === statusFilter) &&
      (attendanceFilter === "all" ||
        (attendanceFilter === "high" ? teacher.attendance < 90 : teacher.attendance >= 90)),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "text-green-500"
      case "Average":
        return "text-yellow-500"
      case "Poor":
        return "text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Advanced Teacher KPI Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Input
            placeholder="Search by teacher name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto"
          />
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Fnd-01">Fnd-01</SelectItem>
              <SelectItem value="Fnd-02">Fnd-02</SelectItem>
              <SelectItem value="Fnd-03">Fnd-03</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Attendance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attendance</SelectItem>
              <SelectItem value="high">High Issues (&lt;90%)</SelectItem>
              <SelectItem value="low">Low Issues (≥90%)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KPI Teacher Summary Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>KPI Score</TableHead>
                <TableHead>Student Growth</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Professionalism</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.level}</TableCell>
                  <TableCell>{teacher.kpiScore}%</TableCell>
                  <TableCell>+{teacher.studentGrowth} points</TableCell>
                  <TableCell>{teacher.engagement}%</TableCell>
                  <TableCell>{teacher.attendance}%</TableCell>
                  <TableCell>{teacher.professionalism}</TableCell>
                  <TableCell className={getStatusColor(teacher.status)}>{teacher.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTeacher(teacher.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedTeacher && (
        <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
          <DialogContent className="max-w-4xl w-full h-[calc(100vh-4rem)] p-0 overflow-auto">
            <div className="p-6">
              <TeacherKPIPage
                teacherProfile={mockTeacherProfiles[selectedTeacher]}
                teacherKPIData={mockTeacherKPIData[selectedTeacher]}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AdvancedTeacherKPIDashboard

