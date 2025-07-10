'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface UserProgress {
  totalXP: number
  completedTools: string[]
  level: number
  achievements: any[]
  toolStates: Record<string, {
    status: 'not_started' | 'in_progress' | 'completed'
    code: string | null
    xpEarned: number
    completedAt: Date | null
  }>
}

export function useUserProgress() {
  const { data: session } = useSession()
  const [progress, setProgress] = useState<UserProgress>({
    totalXP: 0,
    completedTools: [],
    level: 1,
    achievements: [],
    toolStates: {}
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      // Fetch from database for authenticated users
      fetchUserProgress()
    } else {
      // Fall back to localStorage for anonymous users
      loadLocalProgress()
    }
  }, [session])

  const fetchUserProgress = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/progress')
      if (response.ok) {
        const data = await response.json()
        const toolStates: Record<string, any> = {}
        
        // Convert tool progress array to map
        if (Array.isArray(data.toolProgress)) {
          data.toolProgress.forEach((tool: any) => {
            toolStates[tool.tool.slug] = {
              status: tool.status,
              code: tool.code,
              xpEarned: tool.xpEarned,
              completedAt: tool.completedAt ? new Date(tool.completedAt) : null
            }
          })
        }

        setProgress({
          totalXP: data.totalXP || 0,
          completedTools: data.toolProgress?.filter((t: any) => t.status === 'completed').map((t: any) => t.tool.slug) || [],
          level: data.level || 1,
          achievements: data.achievements || [],
          toolStates
        })
      } else {
        console.error('Failed to fetch progress, falling back to local storage')
        loadLocalProgress()
      }
    } catch (error) {
      console.error('Failed to fetch user progress:', error)
      loadLocalProgress()
    } finally {
      setIsLoading(false)
    }
  }

  const loadLocalProgress = () => {
    try {
      const savedXP = parseInt(localStorage.getItem('user_xp') || '0')
      const completedTools = JSON.parse(localStorage.getItem('completed_tools') || '[]')
      const achievements = JSON.parse(localStorage.getItem('user_achievements') || '[]')
      const toolStates = JSON.parse(localStorage.getItem('tool_states') || '{}')
      
      setProgress({
        totalXP: savedXP,
        completedTools,
        level: Math.floor(savedXP / 100) + 1,
        achievements,
        toolStates
      })
    } catch (error) {
      console.error('Failed to load local progress:', error)
      // Use default values if localStorage fails
      setProgress({
        totalXP: 0,
        completedTools: [],
        level: 1,
        achievements: [],
        toolStates: {}
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates }
    setProgress(newProgress)

    if (session?.user) {
      // Save to database for authenticated users
      try {
        await fetch('/api/user/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
      } catch (error) {
        console.error('Failed to update progress in database:', error)
        // Still save to localStorage as backup
        saveToLocalStorage(newProgress)
      }
    } else {
      // Save to localStorage for anonymous users
      saveToLocalStorage(newProgress)
    }
  }

  const saveToLocalStorage = (progressData: UserProgress) => {
    try {
      localStorage.setItem('user_xp', progressData.totalXP.toString())
      localStorage.setItem('completed_tools', JSON.stringify(progressData.completedTools))
      localStorage.setItem('user_achievements', JSON.stringify(progressData.achievements))
      localStorage.setItem('tool_states', JSON.stringify(progressData.toolStates))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const addXP = async (amount: number) => {
    await updateProgress({ totalXP: progress.totalXP + amount })
  }

  const completeToolIfNotCompleted = async (toolSlug: string, xpReward: number) => {
    if (!progress.completedTools.includes(toolSlug)) {
      const newCompletedTools = [...progress.completedTools, toolSlug]
      const newToolStates = {
        ...progress.toolStates,
        [toolSlug]: {
          status: 'completed' as const,
          code: progress.toolStates[toolSlug]?.code || null,
          xpEarned: xpReward,
          completedAt: new Date()
        }
      }
      
      await updateProgress({
        completedTools: newCompletedTools,
        totalXP: progress.totalXP + xpReward,
        toolStates: newToolStates
      })
      return true // Tool was newly completed
    }
    return false // Tool was already completed
  }

  const addAchievement = async (achievement: any) => {
    const achievementExists = progress.achievements.some(a => a.title === achievement.title)
    if (!achievementExists) {
      await updateProgress({
        achievements: [...progress.achievements, achievement]
      })
      return true // Achievement was newly earned
    }
    return false // Achievement already exists
  }

  return { 
    progress, 
    updateProgress, 
    addXP, 
    completeToolIfNotCompleted, 
    addAchievement,
    isAuthenticated: !!session?.user,
    isLoading
  }
} 