export interface Task {
  id: string
  name: string
  assignee?: {
    name: string
    avatar: string
  }
  status?: {
    brainstorming: TaskStatus
    design: TaskStatus
    spec: TaskStatus
    development: TaskStatus
  }
  // Social media specific fields
  channel?: string
  publishDate?: string
  category?: string
  design?: string
  designer?: {
    name: string
    avatar: string
  }
  copywriting?: string
  writer?: {
    name: string
    avatar: string
  }
  // Project specific fields
  timeRange?: string
}

export type TaskStatus = "done" | "working" | "stuck" | "pending" | "postponed"
export type ViewType = "sprint" | "social" | "project"

export interface Group {
  id: string
  name: string
  tasks: Task[]
}

