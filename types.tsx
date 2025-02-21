// Existing types...

export interface Teacher {
  id: number
  name: string
  role: string
  department: string
  avatar: string
  seniority: "Junior" | "Mid-level" | "Senior"
}

export interface Task {
  id: number
  title: string
  description: string
  assignedTo: Teacher[]
  dueDate: string
  status: "Not Started" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High" | "Urgent"
  category: string
  department: string
  progress: number
  subtasks: { id: number; title: string; completed: boolean }[]
  comments: { id: number; user: Teacher; text: string; timestamp: string }[]
  attachments: { id: number; name: string; url: string }[]
}

// Other existing types...

