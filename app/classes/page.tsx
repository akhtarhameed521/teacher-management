"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Classes() {
  const [classes, setClasses] = useState([
    { id: 1, name: "Math 101", teacher: "John Doe", time: "Mon, Wed, Fri 9:00 AM", students: 25 },
    { id: 2, name: "Science 101", teacher: "Jane Smith", time: "Tue, Thu 10:30 AM", students: 30 },
  ])

  const [newClass, setNewClass] = useState({
    name: "",
    teacher: "",
    time: "",
    students: "",
  })

  const handleAddClass = () => {
    setClasses([...classes, { id: classes.length + 1, ...newClass, students: Number.parseInt(newClass.students) }])
    setNewClass({ name: "", teacher: "", time: "", students: "" })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Classes</h1>
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">
                  Teacher
                </Label>
                <Input
                  id="teacher"
                  value={newClass.teacher}
                  onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  value={newClass.time}
                  onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="students" className="text-right">
                  Students
                </Label>
                <Input
                  id="students"
                  type="number"
                  value={newClass.students}
                  onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddClass}>Add Class</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Students</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls.id}>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.teacher}</TableCell>
              <TableCell>{cls.time}</TableCell>
              <TableCell>{cls.students}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

