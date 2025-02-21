"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

const classStatuses = ["On-time", "Delayed", "Cancelled", "Cover"]
const classColors = {
  "On-time": "bg-green-500",
  Delayed: "bg-yellow-500",
  Cancelled: "bg-red-500",
  Cover: "bg-blue-500",
}

export function ClassList({ classes, onDragEnd, onManageClass, searchTerm, setSearchTerm }) {
  const [sortBy, setSortBy] = useState<"name" | "teacher" | "status">("name")

  const filteredClasses = classes
    .filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "teacher") return a.teacher.localeCompare(b.teacher)
      return a.status.localeCompare(b.status)
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[300px] rounded-md border"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "teacher" | "status")}
          className="rounded-md border"
        >
          <option value="name">Sort by Name</option>
          <option value="teacher">Sort by Teacher</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="classes">
          {(provided) => (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {filteredClasses.map((cls, index) => (
                  <Draggable key={cls.id} draggableId={cls.id.toString()} index={index}>
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${classColors[cls.status]}`}
                      >
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>{cls.teacher || "Unassigned"}</TableCell>
                        <TableCell>{cls.status}</TableCell>
                        <TableCell>{cls.students}</TableCell>
                        <TableCell>
                          <Button variant="outline" onClick={() => onManageClass(cls)}>
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

