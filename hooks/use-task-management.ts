"use client"

import { useState, useCallback, useMemo } from "react"
import type { Task } from "@/types/tasks"

const INITIAL_TASKS: Task[] = [] // Declare INITIAL_TASKS

const isThisWeek = (date: Date): boolean => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  const firstDay = new Date(date.setDate(diff))
  return date >= firstDay && date < new Date(firstDay.setDate(firstDay.getDate() + 7))
}

const isThisMonth = (date: Date): boolean => {
  const now = new Date()
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    department: "all",
    assignedTo: "all",
    seniority: "all",
    dueDate: "all",
    tags: [] as string[],
  })
  const [sortConfig, setSortConfig] = useState({ key: "dueDate" as keyof Task, direction: "asc" as "asc" | "desc" })
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(
      (task) =>
        (filters.status === "all" || task.status === filters.status) &&
        (filters.priority === "all" || task.priority === filters.priority) &&
        (filters.category === "all" || task.category === filters.category) &&
        (filters.department === "all" || task.department === filters.department) &&
        (filters.assignedTo === "all" ||
          task.assignedTo.some((teacher) => teacher.id.toString() === filters.assignedTo)) &&
        (filters.seniority === "all" || task.assignedTo.some((teacher) => teacher.seniority === filters.seniority)) &&
        (filters.dueDate === "all" ||
          (filters.dueDate === "overdue"
            ? new Date(task.dueDate) < new Date()
            : filters.dueDate === "today"
              ? new Date(task.dueDate).toDateString() === new Date().toDateString()
              : filters.dueDate === "thisWeek"
                ? isThisWeek(new Date(task.dueDate))
                : filters.dueDate === "thisMonth"
                  ? isThisMonth(new Date(task.dueDate))
                  : true)) &&
        (filters.tags.length === 0 || filters.tags.every((tag) => task.tags.includes(tag))) &&
        (searchTerm === "" ||
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [tasks, filters, sortConfig, searchTerm])

  const addTask = useCallback((newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, { ...newTask, id: prevTasks.length + 1 }])
  }, [])

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }, [])

  const deleteTask = useCallback((taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }, [])

  return {
    tasks: filteredAndSortedTasks,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    setSortConfig,
    setSearchTerm,
  }
}

