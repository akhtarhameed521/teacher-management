"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Download, Plus, Trash2, Mic, Share2, Book, Trophy, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { BarChart } from "@/components/ui/chart"

const formSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  class: z.string().min(1, "Class is required"),
  instructor: z.string().min(1, "Instructor name is required"),
  readingScore: z.number().min(0).max(200),
  writingScore: z.number().min(0).max(200),
  listeningScore: z.number().min(0).max(200),
  speakingScore: z.number().min(0).max(200),
  targetLevel: z.string().min(1, "Target level is required"),
  exam1Score: z.number().min(0).max(200),
  exam2Score: z.number().min(0).max(200),
  scoreGain: z.number(),
  actions: z.array(
    z.object({
      goal: z.enum(["Reading", "Writing", "Listening", "Speaking"]),
      specificActions: z.string().min(1, "Specific actions are required"),
      resources: z.string().min(1, "Resources are required"),
      successCriteria: z.string().min(1, "Success criteria are required"),
      deadline: z.date(),
      progress: z.number().min(0).max(100),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

interface SmartActionPlanProps {
  studentData: {
    firstName: string
    familyName: string
    class: string
    instructor: string
    reading: { score: number }
    writing: { score: number }
    listening: { score: number }
    speaking: { score: number }
    target: number
    exam1Score: number
    exam2Score: number
    gain: number
  }
}

export function SmartActionPlan({ studentData }: SmartActionPlanProps) {
  const [actionPlan, setActionPlan] = useState<FormValues | null>(null)
  const [isCollaborative, setIsCollaborative] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("general")
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: `${studentData.firstName} ${studentData.familyName}`,
      class: studentData.class,
      instructor: studentData.instructor,
      readingScore: studentData.reading.score,
      writingScore: studentData.writing.score,
      listeningScore: studentData.listening.score,
      speakingScore: studentData.speaking.score,
      targetLevel: studentData.target.toString(),
      exam1Score: studentData.exam1Score,
      exam2Score: studentData.exam2Score,
      scoreGain: studentData.gain,
      actions: [
        {
          goal: "Reading",
          specificActions: "",
          resources: "",
          successCriteria: "",
          deadline: new Date(),
          progress: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "actions",
    control: form.control,
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const aiSuggestion = await generateText({
        model: openai("gpt-4"),
        prompt: `Generate a SMART Action Plan for a student based on the following data:
          Student: ${data.studentName}
          Class: ${data.class}
          Instructor: ${data.instructor}
          Scores:
          - Reading: ${data.readingScore}
          - Writing: ${data.writingScore}
          - Listening: ${data.listeningScore}
          - Speaking: ${data.speakingScore}
          Target Level: ${data.targetLevel}
          Exam 1 Score: ${data.exam1Score}
          Exam 2 Score: ${data.exam2Score}
          Score Gain: ${data.scoreGain}

          For each of the following goals, provide specific action steps, resources needed, and success criteria:
          ${data.actions
            .map(
              (action) => `
            Goal: ${action.goal}
            Specific Actions: ${action.specificActions}
            Resources: ${action.resources}
            Success Criteria: ${action.successCriteria}
            Deadline: ${format(action.deadline, "PP")}
          `,
            )
            .join("\n")}

          Please provide suggestions to improve the action plan and make it more effective.`,
      })

      setActionPlan({ ...data, aiSuggestion: aiSuggestion.text })
      toast({
        title: "Action Plan Generated",
        description: "Your SMART Action Plan has been created successfully.",
      })
    } catch (error) {
      console.error("Error generating action plan:", error)
      toast({
        title: "Error",
        description: "There was an error generating the action plan. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (format: "pdf" | "excel" | "google-docs") => {
    // Implement download functionality here
    toast({
      title: "Download Started",
      description: `Your action plan is being downloaded as a ${format.toUpperCase()} file.`,
    })
  }

  const handleVoiceInput = () => {
    setIsVoiceInputActive(true)
    // Implement voice input functionality here
    toast({
      title: "Voice Input Active",
      description: "Please speak your goal or action item.",
    })
  }

  const handleSharePlan = () => {
    // Implement sharing functionality here
    toast({
      title: "Plan Shared",
      description: "Your action plan has been shared with the student and relevant stakeholders.",
    })
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    // Implement template loading logic here
    toast({
      title: "Template Applied",
      description: `The ${template} template has been applied to your action plan.`,
    })
  }

  const skillGapAnalysis = () => {
    // Implement skill gap analysis here
    return [
      { skill: "Reading", gap: 15 },
      { skill: "Writing", gap: 10 },
      { skill: "Listening", gap: 5 },
      { skill: "Speaking", gap: 20 },
    ]
  }

  const peerComparison = () => {
    // Implement peer comparison logic here
    return [
      { skill: "Reading", studentScore: 75, averageScore: 70 },
      { skill: "Writing", studentScore: 80, averageScore: 75 },
      { skill: "Listening", studentScore: 85, averageScore: 80 },
      { skill: "Speaking", studentScore: 70, averageScore: 75 },
    ]
  }

  useEffect(() => {
    // Implement regular check-in notifications here
    const checkInInterval = setInterval(
      () => {
        toast({
          title: "Action Plan Check-in",
          description: "It's time to review your progress and update your action plan.",
        })
      },
      7 * 24 * 60 * 60 * 1000,
    ) // Weekly check-in

    return () => clearInterval(checkInInterval)
  }, [toast])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SMART Action Plan</CardTitle>
        <CardDescription>Create and track your personalized learning goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="view">View Plan</TabsTrigger>
            <TabsTrigger value="progress">Track Progress</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Button type="button" onClick={() => handleTemplateChange("general")}>
                    General Template
                  </Button>
                  <Button type="button" onClick={() => handleTemplateChange("language")}>
                    Language Learning Template
                  </Button>
                  <Button type="button" onClick={() => handleTemplateChange("exam")}>
                    Exam Preparation Template
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button type="button" onClick={handleVoiceInput}>
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Input
                  </Button>
                  <Switch checked={isCollaborative} onCheckedChange={setIsCollaborative} id="collaborative-mode" />
                  <Label htmlFor="collaborative-mode">Collaborative Mode</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input id="studentName" {...form.register("studentName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input id="class" {...form.register("class")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" {...form.register("instructor")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetLevel">Target Level</Label>
                  <Input id="targetLevel" {...form.register("targetLevel")} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="readingScore">Reading Score</Label>
                  <Input id="readingScore" type="number" {...form.register("readingScore", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="writingScore">Writing Score</Label>
                  <Input id="writingScore" type="number" {...form.register("writingScore", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listeningScore">Listening Score</Label>
                  <Input
                    id="listeningScore"
                    type="number"
                    {...form.register("listeningScore", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speakingScore">Speaking Score</Label>
                  <Input
                    id="speakingScore"
                    type="number"
                    {...form.register("speakingScore", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Action Items</h3>
                {fields.map((field, index) => (
                  <Card key={field.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium">Action Item {index + 1}</h4>
                        <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`actions.${index}.goal`}>Goal</Label>
                          <Controller
                            name={`actions.${index}.goal`}
                            control={form.control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a goal" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Reading">Reading</SelectItem>
                                  <SelectItem value="Writing">Writing</SelectItem>
                                  <SelectItem value="Listening">Listening</SelectItem>
                                  <SelectItem value="Speaking">Speaking</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`actions.${index}.specificActions`}>Specific Actions</Label>
                          <Textarea
                            id={`actions.${index}.specificActions`}
                            {...form.register(`actions.${index}.specificActions`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`actions.${index}.resources`}>Resources Needed</Label>
                          <Textarea
                            id={`actions.${index}.resources`}
                            {...form.register(`actions.${index}.resources`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`actions.${index}.successCriteria`}>Success Criteria</Label>
                          <Textarea
                            id={`actions.${index}.successCriteria`}
                            {...form.register(`actions.${index}.successCriteria`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`actions.${index}.deadline`}>Deadline</Label>
                          <Controller
                            name={`actions.${index}.deadline`}
                            control={form.control}
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`actions.${index}.progress`}>Progress</Label>
                          <Controller
                            name={`actions.${index}.progress`}
                            control={form.control}
                            render={({ field }) => (
                              <Slider
                                defaultValue={[field.value]}
                                max={100}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    append({
                      goal: "Reading",
                      specificActions: "",
                      resources: "",
                      successCriteria: "",
                      deadline: new Date(),
                      progress: 0,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Action Item
                </Button>
              </div>

              <Button type="submit">Generate Action Plan</Button>
            </form>
          </TabsContent>

          <TabsContent value="view">
            {actionPlan ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Action Plan Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p>
                          <strong>Student:</strong> {actionPlan.studentName}
                        </p>
                        <p>
                          <strong>Class:</strong> {actionPlan.class}
                        </p>
                        <p>
                          <strong>Instructor:</strong> {actionPlan.instructor}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Target Level:</strong> {actionPlan.targetLevel}
                        </p>
                        <p>
                          <strong>Score Gain:</strong> {actionPlan.scoreGain}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Goal</TableHead>
                          <TableHead>Specific Actions</TableHead>
                          <TableHead>Resources</TableHead>
                          <TableHead>Success Criteria</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {actionPlan.actions.map((action, index) => (
                          <TableRow key={index}>
                            <TableCell>{action.goal}</TableCell>
                            <TableCell>{action.specificActions}</TableCell>
                            <TableCell>{action.resources}</TableCell>
                            <TableCell>{action.successCriteria}</TableCell>
                            <TableCell>{format(action.deadline, "PP")}</TableCell>
                            <TableCell>
                              <Progress value={action.progress} className="w-[60px]" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{actionPlan.aiSuggestion}</p>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={() => handleDownload("pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </Button>
                  <Button onClick={() => handleDownload("excel")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as Excel
                  </Button>
                  <Button onClick={() => handleDownload("google-docs")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to Google Docs
                  </Button>
                  <Button onClick={handleSharePlan}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Plan
                  </Button>
                </div>
              </div>
            ) : (
              <p>No action plan generated yet. Please create a plan first.</p>
            )}
          </TabsContent>

          <TabsContent value="progress">
            {actionPlan ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={actionPlan.actions.map((action) => ({
                        goal: action.goal,
                        progress: action.progress,
                      }))}
                      index="goal"
                      categories={["progress"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value}%`}
                      yAxisWidth={48}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Action Item Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {actionPlan.actions.map((action, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{action.goal}</h4>
                          <Badge variant={action.progress === 100 ? "success" : "default"}>
                            {action.progress === 100 ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <Progress value={action.progress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-1">Deadline: {format(action.deadline, "PP")}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {actionPlan.actions
                        .filter((action) => action.progress === 100)
                        .map((action, index) => (
                          <Badge key={index} variant="success">
                            <Trophy className="mr-1 h-4 w-4" />
                            {action.goal} Mastered
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p>No action plan generated yet. Please create a plan first.</p>
            )}
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Gap Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={skillGapAnalysis()}
                    index="skill"
                    categories={["gap"]}
                    colors={["red"]}
                    valueFormatter={(value) => `${value} points`}
                    yAxisWidth={48}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peer Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={peerComparison()}
                    index="skill"
                    categories={["studentScore", "averageScore"]}
                    colors={["blue", "gray"]}
                    valueFormatter={(value) => `${value} points`}
                    yAxisWidth={48}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {["Reading", "Writing", "Listening", "Speaking"].map((skill) => (
                      <li key={skill} className="flex items-center">
                        <Book className="mr-2 h-4 w-4" />
                        <span>{skill} resources: </span>
                        <Button variant="link" className="ml-2">
                          View Recommendations
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <Bell className="mr-2 h-4 w-4" />
              Set Reminders
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Action Plan Reminders</DialogTitle>
              <DialogDescription>
                Choose how often you'd like to receive reminders about your action plan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reminder-frequency" className="text-right">
                  Frequency
                </Label>
                <Select defaultValue="weekly">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() =>
                toast({
                  title: "Reminders Set",
                  description: "You will receive regular reminders about your action plan.",
                })
              }
            >
              Save Reminder Settings
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

