'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'

interface ToolProgress {
  completedSteps: string[]
  isCompleted: boolean
}

export function useToolProgress(toolSlug: string) {
  const { data: session } = useSession()
  const [progress, setProgress] = useState<ToolProgress>({
    completedSteps: [],
    isCompleted: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load progress
  useEffect(() => {
    function loadProgress() {
      try {
        const savedProgress = localStorage.getItem(`tool_steps_${toolSlug}`)
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress))
        }
      } catch (err) {
        console.error('Error loading progress:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [toolSlug])

  // Save progress
  const saveProgress = useCallback(async (
    completedSteps: string[],
    isCompleted: boolean = false
  ) => {
    try {
      setIsSaving(true)
      const newProgress = { completedSteps, isCompleted }
      
      // Save to localStorage
      localStorage.setItem(`tool_steps_${toolSlug}`, JSON.stringify(newProgress))
      setProgress(newProgress)

      return newProgress
    } catch (err) {
      console.error('Error saving progress:', err)
      throw new Error('Failed to save progress')
    } finally {
      setIsSaving(false)
    }
  }, [toolSlug])

  return {
    progress,
    isLoading,
    isSaving,
    error,
    saveProgress
  }
} 