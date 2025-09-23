"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Copy, Download, MoreVertical, Save, Zap, FileText, History, Shield, Edit3, Trash2, Files } from "lucide-react"
import { EditorInput } from "@/components/editor-input"
import { EditorOutput } from "@/components/editor-output"
import { VersionList } from "@/components/version-list"
import { DetectionMeter } from "@/components/detection-meter"

export function HumanizerInterface() {
  const { currentProject, updateProject, deleteProject, addProject } = useAppStore()
  const { toast } = useToast()

  const [isHumanizing, setIsHumanizing] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("output")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [renameTitle, setRenameTitle] = useState("")

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        handleHumanize()
      }
    }

    const handleCustomEvent = () => {
      handleHumanize()
    }

    window.addEventListener("keydown", handleKeyboardShortcut)
    window.addEventListener("humanize-shortcut", handleCustomEvent)

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut)
      window.removeEventListener("humanize-shortcut", handleCustomEvent)
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Timer effect for updating the saved time display
  useEffect(() => {
    if (!lastSaved) return

    const updateTimer = () => {
      setCurrentTime(new Date())
    }

    // Update immediately
    updateTimer()

    // Set up interval
    const interval = setInterval(updateTimer, 1000) // Update every second

    return () => clearInterval(interval)
  }, [lastSaved])

  // Format the time since last saved with custom intervals
  const formattedTimeSaved = useMemo(() => {
    if (!lastSaved) return null

    const secondsAgo = Math.floor((currentTime.getTime() - lastSaved.getTime()) / 1000)
    
    if (secondsAgo < 60) {
      return `${secondsAgo}s ago`
    } else if (secondsAgo < 300) { // Less than 5 minutes
      const minutesAgo = Math.floor(secondsAgo / 60)
      return `${minutesAgo}m ago`
    } else if (secondsAgo < 1800) { // Less than 30 minutes
      const minutesAgo = Math.floor(secondsAgo / 300) * 5 // Round to 5-minute intervals
      return `${minutesAgo} min ago`
    } else {
      return '30m ago' // Max out at 30 minutes
    }
  }, [lastSaved, currentTime])

  const handleHumanize = useCallback(async () => {
    if (!currentProject || !currentProject.inputText.trim()) {
      toast({
        title: "No text to humanize",
        description: "Please enter some text first.",
        variant: "destructive",
      })
      return
    }

    setIsHumanizing(true)
    try {
      const response = await api.humanize(currentProject.inputText, {
        tone: currentProject.tone,
        intensity: currentProject.intensity,
        language: currentProject.language,
        flags: currentProject.flags,
      })

      const newVersion = {
        id: response.versionId,
        createdAt: new Date(),
        outputText: response.outputText,
      }

      updateProject(currentProject.id, {
        outputText: response.outputText,
        versions: [newVersion, ...currentProject.versions],
      })

      // Save/update project in database when user clicks Humanize
      const user = useAppStore.getState().user
      if (user?.id && user.id !== 'demo-user-id') {
        try {
          if (currentProject.isInDatabase && currentProject.dbId) {
            // Update existing project in database
            console.log('Updating existing project in database:', currentProject.dbId)
            await api.updateProject(currentProject.dbId, {
              title: currentProject.title,
              input_text: currentProject.inputText,
              output_text: response.outputText,
              language: currentProject.language,
              tone: currentProject.tone,
              intensity: currentProject.intensity,
              flags: currentProject.flags,
            })
          } else {
            // Create new project in database
            console.log('Creating new project in database')
            const dbProject = await api.createProject({
              userId: user.id,
              title: currentProject.title,
              inputText: currentProject.inputText,
              outputText: response.outputText,
              language: currentProject.language,
              tone: currentProject.tone,
              intensity: currentProject.intensity,
              flags: currentProject.flags,
              archived: false,
            })
            
            // Mark project as saved in database
            updateProject(currentProject.id, {
              dbId: dbProject.id,
              isInDatabase: true,
            })
          }
        } catch (error) {
          console.error('Failed to save project to database:', error)
        }
      }

      setActiveTab("output")
      setHasUnsavedChanges(false)
      setLastSaved(new Date())

      toast({
        title: "✨ Text humanized successfully",
        description: "Your text has been transformed.",
      })
    } catch (error) {
      toast({
        title: "Humanization failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsHumanizing(false)
    }
  }, [currentProject, updateProject, toast])

  const handleCheckAI = useCallback(async () => {
    if (!currentProject?.outputText) {
      toast({
        title: "No text to check",
        description: "Please humanize some text first.",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    try {
      const response = await api.checkAI(currentProject.outputText)

      // Update the latest version with check scores
      const updatedVersions = currentProject.versions.map((version, index) =>
        index === 0 ? { ...version, checkScores: response.scores } : version,
      )

      updateProject(currentProject.id, { versions: updatedVersions })

      toast({
        title: "AI detection complete",
        description: response.notes,
      })
    } catch (error) {
      toast({
        title: "Check failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }, [currentProject, updateProject, toast])

  const handleCopyOutput = useCallback(async () => {
    if (!currentProject?.outputText) return

    try {
      await navigator.clipboard.writeText(currentProject.outputText)
      toast({
        title: "Copied to clipboard",
        description: "Output text has been copied.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }, [currentProject?.outputText, toast])

  const handleExport = useCallback(
    (format: "txt" | "md") => {
      if (!currentProject?.outputText) return

      const blob = new Blob([currentProject.outputText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentProject.title}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `File saved as ${currentProject.title}.${format}`,
      })
    },
    [currentProject, toast],
  )

  const handleProjectAction = useCallback(
    (action: "rename" | "duplicate" | "archive" | "delete") => {
      if (!currentProject) return

      switch (action) {
        case "rename":
          setRenameTitle(currentProject.title)
          setShowRenameDialog(true)
          break
        case "duplicate":
          addProject({
            ...currentProject,
            title: `${currentProject.title} (Copy)`,
          })
          toast({ title: "Project duplicated", description: "A copy has been created." })
          break
        case "delete":
          setShowDeleteDialog(true)
          break
      }
    },
    [currentProject, addProject, toast],
  )

  const handleConfirmRename = useCallback(() => {
    if (!currentProject || !renameTitle || renameTitle === currentProject.title) return
    
    updateProject(currentProject.id, { title: renameTitle })
    toast({ title: "Project renamed", description: `Renamed to "${renameTitle}"` })
    setShowRenameDialog(false)
    setRenameTitle("")
  }, [currentProject, renameTitle, updateProject, toast])

  const handleConfirmDelete = useCallback(() => {
    if (!currentProject) return
    
    deleteProject(currentProject.id)
    toast({ title: "Project deleted", description: "Project has been removed." })
    setShowDeleteDialog(false)
  }, [currentProject, deleteProject, toast])

  const handleInputChange = useCallback(
    (value: string) => {
      if (currentProject) {
        updateProject(currentProject.id, { inputText: value })
        setHasUnsavedChanges(true)
        setLastSaved(new Date())
      }
    },
    [currentProject, updateProject],
  )

  const wordCount = currentProject?.inputText ? currentProject.inputText.split(/\s+/).filter(Boolean).length : 0
  const charCount = currentProject?.inputText?.length || 0

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No project selected</h3>
          <p className="text-muted-foreground">Select a project from the sidebar or create a new one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-green-200/50 bg-gradient-to-r from-green-100 to-emerald-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-800">{currentProject.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-700 bg-white px-3 py-1 rounded-full border border-green-200 shadow-sm">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>
            {lastSaved && formattedTimeSaved && (
              <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Save className="h-3 w-3" />
                Saved • {formattedTimeSaved}
              </Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="outline" className="gap-1 animate-bounce bg-amber-50 text-amber-600 border-amber-200">
                Unsaved changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleHumanize}
              disabled={isHumanizing || !currentProject.inputText.trim()}
              className="gap-2 hover:scale-105 transition-transform duration-200 bg-green-700 hover:bg-green-800"
            >
              {isHumanizing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Humanizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Humanize
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleCheckAI}
              disabled={isChecking || !currentProject.outputText}
              className="gap-2 bg-white hover:bg-green-50 border-green-600 text-green-700 hover:text-green-800 hover:scale-105 transition-transform duration-200"
            >
              {isChecking ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Checking...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Check AI
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyOutput}
              disabled={!currentProject.outputText}
              className="gap-2 bg-white hover:bg-green-50 border-green-600 text-green-700 hover:text-green-800 hover:scale-105 transition-transform duration-200"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!currentProject.outputText}
                  className="gap-2 bg-white hover:bg-green-50 border-green-600 text-green-700 hover:text-green-800 hover:scale-105 transition-transform duration-200"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("txt")}>Export as TXT</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("md")}>Export as Markdown</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200 hover:bg-slate-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleProjectAction("rename")}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProjectAction("duplicate")}>
                  <Files className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProjectAction("delete")} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Options Toolbar */}
        <div className="flex flex-wrap items-center gap-4 text-sm bg-white p-3 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Label htmlFor="tone" className="text-slate-700 font-medium">Tone:</Label>
            <Select
              value={currentProject.tone}
              onValueChange={(value: any) => updateProject(currentProject.id, { tone: value })}
            >
              <SelectTrigger className="w-32 hover:bg-green-50 transition-colors duration-200 bg-white border-green-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="language" className="text-slate-700 font-medium">Language:</Label>
            <Select
              value={currentProject.language}
              onValueChange={(value) => updateProject(currentProject.id, { language: value })}
            >
              <SelectTrigger className="w-24 hover:bg-green-50 transition-colors duration-200 bg-white border-green-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="intensity" className="text-slate-700 font-medium">Intensity:</Label>
            <div className="flex items-center gap-2 w-[10.5rem] md:w-[13.5rem] bg-white/90 px-3 py-2 rounded border border-green-200">
              <span className="text-xs text-slate-500">Light</span>
              <Slider
                value={[currentProject.intensity]}
                onValueChange={([value]) => updateProject(currentProject.id, { intensity: value })}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-slate-500">Aggressive</span>
            </div>
          </div>

        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Input Panel */}
        <div className="flex-1 border-r border-green-200/50 bg-green-100/40">
          <EditorInput
            value={currentProject.inputText}
            onChange={handleInputChange}
            placeholder="Paste or write your text here..."
          />
        </div>

        {/* Output Panel */}
        <div className="flex-1 flex flex-col bg-emerald-100/40">
          {/* Humanized Output Header */}
          <div className="border-b border-border px-4 py-2">
            <h3 className="font-medium text-sm">Humanized Output</h3>
          </div>
          
          {/* Subtitle */}
          <div className="p-4 border-b border-green-200/50 bg-white">
            <p className="text-xs text-slate-600">Your humanized text with changes highlighted</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-green-200/50 px-4 py-2 bg-white">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50">
                <TabsTrigger value="output" className="gap-2 hover:bg-green-50 transition-colors duration-200 data-[state=active]:bg-green-700 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  Output
                </TabsTrigger>
                <TabsTrigger value="versions" className="gap-2 hover:bg-green-50 transition-colors duration-200 data-[state=active]:bg-green-700 data-[state=active]:text-white">
                  <History className="h-4 w-4" />
                  Versions ({currentProject.versions.length})
                </TabsTrigger>
                <TabsTrigger value="detection" className="gap-2 hover:bg-green-50 transition-colors duration-200 data-[state=active]:bg-green-700 data-[state=active]:text-white">
                  <Shield className="h-4 w-4" />
                  Detection
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="output" className="flex-1 m-0">
              <EditorOutput
                inputText={currentProject.inputText}
                outputText={currentProject.outputText}
                isLoading={isHumanizing}
              />
            </TabsContent>

            <TabsContent value="versions" className="flex-1 m-0 bg-white/40">
              <VersionList
                versions={currentProject.versions}
                onSelectVersion={(version) => {
                  updateProject(currentProject.id, { outputText: version.outputText })
                  setActiveTab("output")
                }}
              />
            </TabsContent>

            <TabsContent value="detection" className="flex-1 m-0 bg-white/40">
              <DetectionMeter
                scores={currentProject.versions[0]?.checkScores}
                isLoading={isChecking}
                onCheck={handleCheckAI}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for "{currentProject?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rename-input" className="text-right">
                Name
              </Label>
              <Input
                id="rename-input"
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
            <Button onClick={handleConfirmRename} disabled={!renameTitle || renameTitle === currentProject?.title}>
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
              Are you sure you want to delete "{currentProject?.title}"? This action cannot be undone.
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
    </div>
  )
}
