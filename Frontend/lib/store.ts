import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "@/lib/api"

export interface Project {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  inputText: string
  outputText: string
  versions: Version[]
  language: string
  tone: "neutral" | "academic" | "casual" | "marketing"
  intensity: number
  flags: {
    avoidBurstiness: boolean
    avoidPerplexity: boolean
  }
  dbId?: string // Database ID if the project exists in DB
  isInDatabase?: boolean // Flag to track if project is saved in DB
}

export interface Version {
  id: string
  createdAt: Date
  outputText: string
  checkScores?: {
    detectorA: number
    detectorB: number
    overall: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  plan: "free" | "basic" | "pro" | "ultra"
  usage: {
    wordsThisMonth: number
    limit: number
  }
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean

  // Projects state
  projects: Project[]
  currentProject: Project | null

  // UI state
  sidebarCollapsed: boolean
  theme: "light" | "dark" | "system"

  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  toggleSidebar: () => void
  setTheme: (theme: "light" | "dark" | "system") => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      projects: [],
      currentProject: null,
      sidebarCollapsed: false,
      theme: "light",

      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      setProjects: (projects) => {
        const convertedProjects = projects.map(project => ({
          id: project.id,
          title: project.title,
          inputText: project.input_text || '',
          outputText: project.output_text || '',
          language: project.language || 'en',
          tone: project.tone || 'neutral',
          intensity: project.intensity || 50,
          flags: { avoidBurstiness: true, avoidPerplexity: true }, // Always enabled as baseline
          createdAt: project.created_at ? new Date(project.created_at) : new Date(),
          updatedAt: project.updated_at ? new Date(project.updated_at) : new Date(),
          versions: project.versions?.map(version => ({
            ...version,
            createdAt: version.createdAt instanceof Date ? version.createdAt : new Date(version.createdAt || new Date()),
          })) || [],
          dbId: project.id, // Store the database ID
          isInDatabase: true // Mark as existing in database
        }));
        set({ projects: convertedProjects, currentProject: convertedProjects[0] ?? null });
      },

      addProject: (projectData) => {
        const tempProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          isInDatabase: false, // New projects are not in database yet
        }
        set((state) => ({ projects: [tempProject, ...state.projects], currentProject: tempProject }))
      },

      updateProject: (id, updates) => {
        const updatedAt = new Date()
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates, updatedAt } : p)),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt }
              : state.currentProject,
        }))

        // Persist on explicit actions only
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }))
        // Persist on explicit actions only
      },

      setCurrentProject: (project) => set({ currentProject: project }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "humanize-pro-storage",
      partialize: (state) => ({
        projects: state.projects,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
)
