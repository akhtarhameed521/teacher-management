"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

const dummyCertificates = [
  {
    name: "TESOL Certification",
    issuer: "International TESOL Association",
    date: "2023-05-15",
    number: "TESOL-2023-1234",
    validUntil: "2026-05-15",
    signature: "Dr. Sarah Johnson",
    description:
      "This certifies that the holder has successfully completed all requirements for Teaching English to Speakers of Other Languages (TESOL) certification.",
  },
  {
    name: "Advanced English Grammar for ESL Teachers",
    issuer: "English Language Institute",
    date: "2023-08-22",
    number: "ELI-2023-5678",
    validUntil: "2025-08-22",
    signature: "Prof. Michael Smith",
    description:
      "This certificate is awarded for demonstrating advanced proficiency in English grammar instruction methodologies.",
  },
  {
    name: "Teaching English Online",
    issuer: "British Council",
    date: "2023-11-10",
    number: "BC-2023-9012",
    validUntil: "2025-11-10",
    signature: "Dr. Emma Wilson",
    description: "Awarded for successfully completing the comprehensive online teaching methodology program.",
  },
  {
    name: "ESL Classroom Management Techniques",
    issuer: "TEFL Academy",
    date: "2024-01-30",
    number: "TEFL-2024-3456",
    validUntil: "2026-01-30",
    signature: "Prof. David Brown",
    description: "This certifies excellence in classroom management strategies for ESL environments.",
  },
]

export function CertificatesAchieved() {
  const [selectedCertificate, setSelectedCertificate] = useState<(typeof dummyCertificates)[0] | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Certificates Achieved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyCertificates.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setSelectedCertificate(cert)}
              >
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{new Date(cert.date).toLocaleDateString()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 border rounded-lg bg-[url('/certificate-bg.png')] bg-cover"
            >
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Award className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Certificate of Achievement</h2>
                  <p className="text-xl font-semibold">{selectedCertificate.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-lg">This is to certify that</p>
                  <p className="text-2xl font-semibold text-primary">John Smith</p>
                  <p className="text-lg">{selectedCertificate.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate Number</p>
                    <p className="font-semibold">{selectedCertificate.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-semibold">{new Date(selectedCertificate.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                    <p className="font-semibold">{new Date(selectedCertificate.validUntil).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issuing Authority</p>
                    <p className="font-semibold">{selectedCertificate.issuer}</p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t">
                  <div className="flex justify-center">
                    <div className="text-center">
                      <p className="font-signature text-2xl text-primary">{selectedCertificate.signature}</p>
                      <p className="text-sm text-muted-foreground">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

