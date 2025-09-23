"use client"

import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface EditorOutputProps {
  inputText: string
  outputText: string
  isLoading?: boolean
}

export function EditorOutput({ inputText, outputText, isLoading }: EditorOutputProps) {
  const differences = useMemo(() => {
    if (!inputText || !outputText) return []

    // Better diff highlighting that preserves formatting and tracks word usage
    const inputWords = inputText.split(/\s+/).filter(Boolean)
    
    // Normalize words for comparison (remove punctuation, lowercase)
    const normalizeWord = (word: string) => word.replace(/[^\w]/g, '').toLowerCase()
    
    // Create a map of available words from input (with counts)
    const inputWordCounts = new Map<string, number>()
    inputWords.forEach(word => {
      const normalized = normalizeWord(word)
      if (normalized) { // Only count non-empty words
        inputWordCounts.set(normalized, (inputWordCounts.get(normalized) || 0) + 1)
      }
    })
    
    // Split output text to preserve formatting while analyzing words
    const outputParts = outputText.split(/(\s+)/) // This preserves whitespace including line breaks
    
    return outputParts.map((part, index) => {
      // If this part is whitespace (including line breaks), preserve it as-is
      if (/^\s+$/.test(part)) {
        return { content: part, isChanged: false, isWhitespace: true, index }
      }
      
      // This is a word - check if it's changed
      const normalized = normalizeWord(part)
      
      if (!normalized) {
        return { content: part, isChanged: false, isWhitespace: false, index } // Don't highlight punctuation-only
      }
      
      const availableCount = inputWordCounts.get(normalized) || 0
      
      if (availableCount > 0) {
        // Word exists in input, mark as used
        inputWordCounts.set(normalized, availableCount - 1)
        return { content: part, isChanged: false, isWhitespace: false, index }
      } else {
        // Word is new or already used up all instances from input
        return { content: part, isChanged: true, isWhitespace: false, index }
      }
    })
  }, [inputText, outputText])

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4 space-y-3 bg-white">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground">Processing your text...</p>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {outputText ? (
          <div className="prose prose-sm max-w-none">
            <div className="text-base leading-6 font-sans tracking-normal whitespace-pre-wrap font-normal">
              {differences.map((item, index) => {
                // If it's whitespace, render it as-is to preserve formatting
                if (item.isWhitespace) {
                  return <span key={index}>{item.content}</span>
                }
                
                // For words, apply highlighting if changed
                return (
                  <span
                    key={index}
                    className={item.isChanged ? "bg-yellow-200/60 px-1 rounded border border-yellow-300/40" : ""}
                    title={item.isChanged ? "Changed from original" : undefined}
                  >
                    {item.content}
                  </span>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4 border border-blue-200/50">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-medium mb-2 text-slate-700">Ready to humanize</h3>
              <p className="text-sm text-slate-500">
                Enter your text in the left panel and click "Humanize" to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
