"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  Calendar,
  Trash2,
  Edit3,
  Copy,
  Filter,
  X,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

// Helper function to safely format dates
const formatProjectDate = (date: Date | string | null | undefined): string => {
  try {
    if (!date) return 'Recently';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Recently';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Recently';
  }
}

export function Sidebar() {
  const { projects, currentProject, sidebarCollapsed, addProject, setCurrentProject, deleteProject, updateProject } =
    useAppStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "recent" | "archived">("all")
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title">("updated")
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [renameTitle, setRenameTitle] = useState("")

  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.inputText.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter =
        filter === "all" ||
        (filter === "recent" && new Date(project.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

      return matchesSearch && matchesFilter
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchQuery, filter, sortBy])

  const handleNewProject = (title?: string) => {
    const projectTitle = title || newProjectTitle || "Untitled Project"
    addProject({
      title: projectTitle,
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
    setNewProjectTitle("")
    setShowNewProjectDialog(false)
  }

  const handleProjectAction = (projectId: string, action: "rename" | "duplicate" | "archive" | "delete") => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    switch (action) {
      case "duplicate":
        addProject({
          ...project,
          title: `${project.title} (Copy)`,
        })
        break
      case "delete":
        setSelectedProject(project)
        setShowDeleteDialog(true)
        break
      case "rename":
        setSelectedProject(project)
        setRenameTitle(project.title)
        setShowRenameDialog(true)
        break
    }
  }

  const handleConfirmDelete = () => {
    if (!selectedProject) return
    
    deleteProject(selectedProject.id)
    // Delete from database if it exists there
    if (selectedProject.isInDatabase && selectedProject.dbId) {
      ;(async () => {
        try {
          await api.deleteProject(selectedProject.dbId)
          console.log('Project deleted from database:', selectedProject.dbId)
        } catch (error) {
          console.error('Failed to delete project from database:', error)
        }
      })()
    }
    
    setShowDeleteDialog(false)
    setSelectedProject(null)
  }

  const handleConfirmRename = () => {
    if (!selectedProject || !renameTitle || renameTitle === selectedProject.title) return
    
    updateProject(selectedProject.id, { title: renameTitle })
    setShowRenameDialog(false)
    setSelectedProject(null)
    setRenameTitle("")
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  if (sidebarCollapsed) {
    return null
  }

  return (
    <aside className="w-80 border-r border-green-200 bg-gradient-to-b from-green-100 to-emerald-100/60 flex flex-col h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 border-b border-green-200/70 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Projects</h2>
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Enter project title..."
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNewProject()
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleNewProject()}>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 bg-white border-green-200 focus:border-green-400 focus:ring-green-200"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={cn(
                "text-xs",
                filter === "all" ? "bg-green-100 text-green-700 hover:bg-green-200" : "text-slate-600 hover:bg-white/50"
              )}
            >
              All
            </Button>
            <Button
              variant={filter === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("recent")}
              className={cn(
                "text-xs",
                filter === "recent" ? "bg-green-100 text-green-700 hover:bg-green-200" : "text-slate-600 hover:bg-white/50"
              )}
            >
              Recent
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-slate-600 hover:bg-white/50">
                <Filter className="h-3 w-3" />
                Sort
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("updated")}>
                {sortBy === "updated" && "✓ "}Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("created")}>
                {sortBy === "created" && "✓ "}Date Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>
                {sortBy === "title" && "✓ "}Title A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="text-xs text-slate-500 mt-2">
            {filteredAndSortedProjects.length} result{filteredAndSortedProjects.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedProjects.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            {searchQuery ? (
              <>
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm mb-2">No projects match your search</p>
                <Button variant="ghost" size="sm" onClick={clearSearch} className="hover:bg-white/50">
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm mb-2">No projects found</p>
                <Button variant="ghost" size="sm" onClick={() => handleNewProject("My First Project")} className="hover:bg-white/50">
                  Create your first project
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredAndSortedProjects.map((project) => (
              <div
                key={project.id}
                className={cn(
                  "group relative rounded-lg p-3 mb-2 cursor-pointer transition-all duration-200 hover:bg-white/70 hover:shadow-sm",
                  currentProject?.id === project.id && "bg-green-100/60 border border-green-200 shadow-sm",
                )}
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-slate-800 truncate" title={project.title}>
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {formatProjectDate(project.updatedAt)}
                      </span>
                    </div>
                    {project.inputText && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {project.inputText.substring(0, 100)}
                        {project.inputText.length > 100 && "..."}
                      </p>
                    )}

                    {/* Project stats */}
                    <div className="flex items-center gap-2 mt-2">
                      {project.inputText && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-slate-300 text-slate-600">
                          {project.inputText.split(" ").filter(Boolean).length} words
                        </Badge>
                      )}
                      {project.versions.length > 0 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-slate-300 text-slate-600">
                          {project.versions.length} version{project.versions.length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {project.outputText && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200">
                          Humanized
                        </Badge>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleProjectAction(project.id, "rename")}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProjectAction(project.id, "duplicate")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleProjectAction(project.id, "delete")}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with quick stats */}
      <div className="border-t border-green-200/70 p-4 bg-white">
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Total projects:</span>
            <span className="font-medium">{projects.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Words processed:</span>
            <span className="font-medium">
              {projects.reduce((total, project) => {
                return total + (project.inputText ? project.inputText.split(" ").filter(Boolean).length : 0)
              }, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for "{selectedProject?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmRename()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRename} disabled={!renameTitle || renameTitle === selectedProject?.title}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
