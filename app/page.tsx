"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Send, User, Sparkles, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

interface ApiKeyStatus {
  provider: string
  model: string
  hasApiKey: boolean
  keyLength: number
  keyPreview: string
  keyValid?: boolean
  testResponse?: string
}

export default function FitnessAI() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [fitnessLevel, setFitnessLevel] = useState<string>("Beginner")
  const [fitnessGoals, setFitnessGoals] = useState<string[]>(["General Health"])
  const [workoutTypes, setWorkoutTypes] = useState<string[]>(["Cardio"])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hey there! I'm your AI Gym Buddy powered by DeepInfra. I can help with workout plans, nutrition advice, and motivation to reach your fitness goals. What can I help you with today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus | null>(null)

  // Check API key status on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/chat")
        const status = await response.json()
        setApiKeyStatus(status)
        console.log("API Key Status:", status)
      } catch (error) {
        console.error("Failed to check API key status:", error)
      }
    }

    checkApiKey()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending message to DeepInfra API...")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      })

      console.log("Response status:", response.status)

      // Get response text for better error handling
      const responseText = await response.text()
      console.log("Raw response:", responseText)

      // Check if response is OK
      if (!response.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { error: responseText }
        }
        console.error("API error response:", errorData)
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      // Parse JSON safely
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Failed to parse server response")
      }

      // Check if data has expected structure
      if (!data || typeof data.message !== "string") {
        console.error("Unexpected response format:", data)
        throw new Error("Unexpected response format from server")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle toggling of fitness goals
  const toggleGoal = (goal: string) => {
    setFitnessGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  // Handle toggling of workout types
  const toggleWorkoutType = (type: string) => {
    setWorkoutTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Handle updating training preferences
  const handleUpdateTraining = async () => {
    const preferencesMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Please update my fitness preferences: Level: ${fitnessLevel}, Goals: ${fitnessGoals.join(", ")}, Preferred Workouts: ${workoutTypes.join(", ")}. Please acknowledge these preferences and tailor your future responses accordingly.`,
    }

    setMessages((prev) => [...prev, preferencesMessage])
    setInput(preferencesMessage.content)

    // Trigger form submission
    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
      }
    }, 100)
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const getConnectionStatus = () => {
    if (!apiKeyStatus) return { icon: AlertCircle, color: "text-yellow-500", text: "Checking..." }
    if (!apiKeyStatus.hasApiKey) return { icon: XCircle, color: "text-red-500", text: "No API Key" }
    if (apiKeyStatus.keyValid === false) return { icon: XCircle, color: "text-red-500", text: "Invalid Key" }
    if (apiKeyStatus.keyValid === true) return { icon: CheckCircle, color: "text-green-500", text: "Connected" }
    return { icon: AlertCircle, color: "text-yellow-500", text: "Unknown" }
  }

  const connectionStatus = getConnectionStatus()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-fitness-background to-fitness-secondary-dark text-white">
      <header className="fitness-header py-4">
        <div className="container flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-emerald-500" />
          <h1 className="text-xl font-bold">Fitness AI Gym Buddy</h1>
          <div className="ml-auto flex items-center gap-2">
            {apiKeyStatus && (
              <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full text-xs">
                {apiKeyStatus.provider}: {apiKeyStatus.model}
              </span>
            )}
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                apiKeyStatus?.keyValid
                  ? "status-connected pulse-green"
                  : apiKeyStatus?.hasApiKey
                    ? "status-warning"
                    : "status-error"
              }`}
            >
              <connectionStatus.icon className={`h-3 w-3 ${connectionStatus.color}`} />
              <span className={connectionStatus.color}>{connectionStatus.text}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col container py-4 md:py-8">
        {/* API Key Status Warning */}
        {apiKeyStatus && (!apiKeyStatus.hasApiKey || apiKeyStatus.keyValid === false) && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-red-400 text-sm font-medium">DeepInfra API Key Issue</p>
                {!apiKeyStatus.hasApiKey ? (
                  <p className="text-red-300 text-xs mt-1">
                    Please add your DEEPINFRA_API_KEY to your .env.local file to use the AI chatbot.
                  </p>
                ) : (
                  <p className="text-red-300 text-xs mt-1">
                    API key appears to be invalid. Please check your DeepInfra API key.
                  </p>
                )}
                <p className="text-red-300 text-xs mt-1">Get your free API key at: https://deepinfra.com</p>
                {apiKeyStatus.testResponse && (
                  <p className="text-red-300 text-xs mt-1">Debug: {apiKeyStatus.testResponse}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="fitness-tabs">
              <TabsTrigger value="chat" className="fitness-tab">
                Chat
              </TabsTrigger>
              <TabsTrigger value="training" className="fitness-tab">
                Training
              </TabsTrigger>
            </TabsList>
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs">Fitness Expert</span>
            </div>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 mt-0">
            <Card className="flex-1 flex flex-col fitness-card">
              <CardHeader className="pb-2">
                <CardTitle>Your AI Gym Buddy</CardTitle>
                <CardDescription>Ask about workouts, nutrition, or fitness goals</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pr-4 fitness-scrollbar">
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-400 text-sm">Error: {error}</p>
                      {error.includes("Invalid DeepInfra API key") && (
                        <div className="mt-2">
                          <p className="text-red-300 text-xs">
                            Please check your .env.local file and ensure your DeepInfra API key is correct.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start gap-3 max-w-[80%]">
                        {message.role !== "user" && (
                          <Avatar className="h-8 w-8 border border-zinc-700">
                            <AvatarFallback className="bg-emerald-500 text-zinc-900">
                              <Dumbbell className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === "user" ? "chat-message-user" : "chat-message-assistant"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 border border-zinc-700">
                            <AvatarFallback className="bg-zinc-600">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 border border-zinc-700">
                          <AvatarFallback className="bg-emerald-500 text-zinc-900">
                            <Dumbbell className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-zinc-700">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 loading-dot rounded-full animate-bounce"></div>
                            <div
                              className="h-2 w-2 loading-dot rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="h-2 w-2 loading-dot rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Ask about workouts, nutrition, or fitness goals..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 fitness-input"
                    disabled={isLoading || !apiKeyStatus?.hasApiKey || apiKeyStatus?.keyValid === false}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="fitness-button"
                    disabled={
                      isLoading || !input.trim() || !apiKeyStatus?.hasApiKey || apiKeyStatus?.keyValid === false
                    }
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="flex-1 flex flex-col space-y-4 mt-0">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle>Train Your Gym Buddy</CardTitle>
                <CardDescription>Customize your AI to better understand your fitness preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Fitness Level</h3>
                  <div className="flex gap-2">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <Button
                        key={level}
                        variant={fitnessLevel === level ? "default" : "outline"}
                        className={fitnessLevel === level ? "fitness-button" : "fitness-button-outline"}
                        onClick={() => setFitnessLevel(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Fitness Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "General Health"].map((goal) => (
                      <Button
                        key={goal}
                        variant={fitnessGoals.includes(goal) ? "default" : "outline"}
                        className={fitnessGoals.includes(goal) ? "fitness-button" : "fitness-button-outline"}
                        onClick={() => toggleGoal(goal)}
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Preferred Workout Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Weightlifting", "Cardio", "HIIT", "Yoga", "Calisthenics", "Sports"].map((type) => (
                      <Button
                        key={type}
                        variant={workoutTypes.includes(type) ? "default" : "outline"}
                        className={workoutTypes.includes(type) ? "fitness-button" : "fitness-button-outline"}
                        onClick={() => toggleWorkoutType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-900"
                  onClick={handleUpdateTraining}
                  disabled={!apiKeyStatus?.hasApiKey || apiKeyStatus?.keyValid === false}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Update AI Training
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="fitness-footer py-4">
        <div className="container text-center text-xs text-zinc-500">
          <p>
            Disclaimer: This AI provides general fitness information and is not a substitute for professional medical
            advice. Always consult with a healthcare provider before starting any new fitness program.
          </p>
        </div>
      </footer>
    </div>
  )
}
