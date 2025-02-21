export interface TeacherProfile {
  id: string
  name: string
  email: string
  image: string
  position: string
  level: "A1" | "A2" | "B1"
  joinDate: string
  yearsAtArx: number
  previousExperience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
  certifications: {
    name: string
    issuer: string
    year: string
  }[]
  medicalInfo: {
    conditions: string[]
    allergies: string[]
    emergencyContact: {
      name: string
      relation: string
      phone: string
    }
  }
  cvLink: string
  isActive: boolean
}

export interface TeacherKPIData {
  teacherId: string
  overallScore: number
  studentPerformance: {
    score: number
    passRate: number
    averageGrowth: number
  }
  studentEngagement: {
    score: number
    participation: number
    attendanceRate: number
  }
  teachingEffectiveness: {
    score: number
    techniqueImplementation: number
    studentFeedback: number
  }
  classroomManagement: {
    score: number
    incidents: number
    observationRating: number
  }
  professionalDevelopment: {
    score: number
    workshopsAttended: number
    newStrategiesImplemented: number
    peerObservations: number
    evaluationScore: number
  }
  professionalism: {
    score: number
    latenesses: number
    absences: number
    policyAdherence: number
    onTimeSubmissions: number
  }
}

