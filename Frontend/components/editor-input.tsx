"use client"

import { useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

interface EditorInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function EditorInput({ value, onChange, placeholder }: EditorInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        // Trigger humanize action - this would be handled by parent component
        const event = new CustomEvent("humanize-shortcut")
        window.dispatchEvent(event)
      }
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown)
      return () => textarea.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-4 py-2">
        <h3 className="font-medium text-sm">Input Text</h3>
      </div>
      
        <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-green-200/50 bg-white">
          <p className="text-xs text-slate-600">Paste your AI-generated text here</p>
        </div>

        <div className="flex-1 p-4 bg-white">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-full resize-none border-0 shadow-none focus-visible:ring-0 text-base font-sans leading-6 tracking-normal bg-transparent font-normal"
          />
        </div>
      </div>
    </div>
  )
}
