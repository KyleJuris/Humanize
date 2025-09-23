"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { HumanizerInterface } from "@/components/humanizer-interface"
import { ProtectedRoute } from "@/components/protected-route"

export default function HumanizerPage() {
  const { currentProject, projects, addProject, user } = useAppStore()

  useEffect(() => {
    // Create a default project if none exists AND user is logged in
    if (user?.id && projects.length === 0 && !currentProject) {
      addProject({
        title: "My First Project",
        inputText: "",
        outputText: "",
        versions: [],
        language: "en",
        tone: "neutral",
        intensity: 50,
        flags: {
          avoidBurstiness: true,
          avoidPerplexity: true,
        },
      })
    }
  }, [projects.length, currentProject, addProject, user?.id])

  useEffect(() => {
    (async () => {
      try {
        if (user?.id) {
          const dbProjects = await api.getProjects(user.id)
          if (dbProjects && Array.isArray(dbProjects) && dbProjects.length > 0) {
            useAppStore.getState().setProjects(dbProjects as any)
          }
        }
      } catch {}
    })()
  }, [user?.id])

  return (
    <ProtectedRoute>
      <HumanizerInterface />
    </ProtectedRoute>
  )
}
