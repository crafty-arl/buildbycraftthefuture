'use client'

import { useState, useEffect, useCallback } from 'react'
import builderDB from '../services/builderDatabase'
import { 
  BuilderProfile, 
  Achievement, 
  UserTool, 
  EditorTab,
  Course,
  CourseProgress,
  BuilderSession
} from '../types/builderTypes'

interface BuilderProgressState {
  profile: BuilderProfile
  achievements: Achievement[]
  tools: UserTool[]
  currentTabs: EditorTab[]
  newlyUnlocked: Achievement | null
  currentSession: BuilderSession | null
  isLoading: boolean
}

export function useBuilderProgress() {
  const [state, setState] = useState<BuilderProgressState>({
    profile: builderDB.getProfile(),
    achievements: builderDB.getAchievements(),
    tools: builderDB.getTools(),
    currentTabs: builderDB.getCurrentTabs(),
    newlyUnlocked: null,
    currentSession: null,
    isLoading: false
  })

  const [courses, setCourses] = useState<Course[]>([])
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])

  // Initialize and load data
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }))
      
      try {
        // Update streak on app load
        const streakResult = builderDB.updateStreak()
        
        // Start new session
        const session = builderDB.startSession()
        
        setState(prev => ({
          ...prev,
          profile: builderDB.getProfile(),
          achievements: builderDB.getAchievements(),
          tools: builderDB.getTools(),
          currentTabs: builderDB.getCurrentTabs(),
          currentSession: session,
          isLoading: false
        }))

        // Award XP for daily login if streak was updated
        if (streakResult.streakUpdated) {
          await awardXP(20, 'Daily login bonus')
        }
      } catch (error) {
        console.error('Failed to load builder data:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    loadData()
  }, [])

  // Award XP and check for level ups/achievements
  const awardXP = useCallback(async (amount: number, reason: string): Promise<{
    xpAwarded: number
    leveledUp: boolean
    newLevel?: number
    newTitle?: string
  }> => {
    const result = builderDB.awardXP(amount, reason)
    
    setState(prev => ({
      ...prev,
      profile: builderDB.getProfile()
    }))
    
    // Update progress tracking
    builderDB.updateProgressTracking()
    
    return {
      xpAwarded: amount,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      newTitle: result.newTitle
    }
  }, [])

  // Track coding actions and award XP
  const trackCodingAction = useCallback(async (action: string, metadata?: any) => {
    let xpAmount = 0
    let reason = ''
    
    switch (action) {
      case 'run_code':
        xpAmount = 10
        reason = 'Running code'
        // Check for first print statement
        if (metadata?.code?.includes('print(')) {
          const achievement = builderDB.checkAchievements('first_print')
          if (achievement) {
            setState(prev => ({ ...prev, newlyUnlocked: achievement }))
          }
        }
        // Check for loop usage
        if (metadata?.code?.includes('for ') || metadata?.code?.includes('while ')) {
          builderDB.checkAchievements('use_loop')
        }
        // Check for pandas usage
        if (metadata?.code?.includes('pandas') || metadata?.code?.includes('pd.')) {
          builderDB.checkAchievements('use_pandas')
        }
        break
        
      case 'save_tool':
        xpAmount = 50
        reason = 'Saving tool'
        const achievement = builderDB.checkAchievements('save_tool')
        if (achievement) {
          setState(prev => ({ ...prev, newlyUnlocked: achievement }))
        }
        break
        
      case 'complete_lesson':
        xpAmount = 75
        reason = 'Completing lesson'
        break
        
      case 'debug_fix':
        xpAmount = 25
        reason = 'Fixing bug'
        break
        
      case 'share_tool':
        xpAmount = 30
        reason = 'Sharing tool'
        break
        
      default:
        return { xpAwarded: 0, leveledUp: false }
    }
    
    if (xpAmount > 0) {
      return await awardXP(xpAmount, reason)
    }
    
    return { xpAwarded: 0, leveledUp: false }
  }, [awardXP])

  // Save a new tool
  const saveTool = useCallback((toolData: {
    name: string
    description: string
    category: UserTool['category']
    code: string
    tags?: string[]
    isPublic?: boolean
  }): UserTool => {
    const linesOfCode = toolData.code.split('\n').filter(line => line.trim()).length
    
    const tool = builderDB.saveTool({
      ...toolData,
      lastModified: new Date().toISOString(),
      linesOfCode,
      timesRun: 0,
      isPublic: toolData.isPublic || false,
      isFavorite: false,
      tags: toolData.tags || [],
      language: 'python',
      status: 'completed'
    })
    
    setState(prev => ({
      ...prev,
      profile: builderDB.getProfile(),
      tools: builderDB.getTools(),
      achievements: builderDB.getAchievements()
    }))
    
    // Track the action for XP
    trackCodingAction('save_tool', { tool })
    
    return tool
  }, [trackCodingAction])

  // Update an existing tool
  const updateTool = useCallback((toolId: string, updates: Partial<UserTool>): UserTool | null => {
    if (updates.code) {
      updates.linesOfCode = updates.code.split('\n').filter(line => line.trim()).length
    }
    
    const updatedTool = builderDB.updateTool(toolId, updates)
    
    if (updatedTool) {
      setState(prev => ({
        ...prev,
        profile: builderDB.getProfile(),
        tools: builderDB.getTools()
      }))
    }
    
    return updatedTool
  }, [])

  // Delete a tool
  const deleteTool = useCallback((toolId: string): boolean => {
    const success = builderDB.deleteTool(toolId)
    
    if (success) {
      setState(prev => ({
        ...prev,
        profile: builderDB.getProfile(),
        tools: builderDB.getTools()
      }))
    }
    
    return success
  }, [])

  // Tab management
  const saveCurrentTabs = useCallback((tabs: EditorTab[]) => {
    builderDB.saveCurrentTabs(tabs)
    setState(prev => ({ ...prev, currentTabs: tabs }))
  }, [])

  // Achievement management
  const dismissAchievement = useCallback(() => {
    setState(prev => ({ ...prev, newlyUnlocked: null }))
  }, [])

  // Manual achievement unlock (for testing/admin)
  const unlockAchievement = useCallback((achievementId: string): Achievement | null => {
    const achievement = builderDB.unlockAchievement(achievementId)
    
    if (achievement) {
      setState(prev => ({
        ...prev,
        profile: builderDB.getProfile(),
        achievements: builderDB.getAchievements(),
        newlyUnlocked: achievement
      }))
    }
    
    return achievement
  }, [])

  // Get statistics
  const getStats = useCallback(() => {
    return builderDB.getStats()
  }, [])

  // Session management
  const endCurrentSession = useCallback(() => {
    if (state.currentSession) {
      builderDB.endSession(state.currentSession.id)
      setState(prev => ({ ...prev, currentSession: null }))
    }
  }, [state.currentSession])

  // Profile updates
  const updateProfile = useCallback((updates: Partial<BuilderProfile>) => {
    const updatedProfile = builderDB.updateProfile(updates)
    setState(prev => ({ ...prev, profile: updatedProfile }))
    return updatedProfile
  }, [])

  // Export/Import data
  const exportData = useCallback(() => {
    return builderDB.exportData()
  }, [])

  const importData = useCallback((jsonData: string): boolean => {
    const success = builderDB.importData(jsonData)
    
    if (success) {
      setState(prev => ({
        ...prev,
        profile: builderDB.getProfile(),
        achievements: builderDB.getAchievements(),
        tools: builderDB.getTools(),
        currentTabs: builderDB.getCurrentTabs()
      }))
    }
    
    return success
  }, [])

  // Reset all data (for development)
  const resetProgress = useCallback(() => {
    builderDB.resetDatabase()
    setState(prev => ({
      ...prev,
      profile: builderDB.getProfile(),
      achievements: builderDB.getAchievements(),
      tools: builderDB.getTools(),
      currentTabs: builderDB.getCurrentTabs(),
      newlyUnlocked: null,
      currentSession: null
    }))
  }, [])

  // Utility functions
  const getTotalXPForLevel = useCallback((level: number): number => {
    return level * 1000
  }, [])

  const getXPProgress = useCallback((currentXP: number, currentLevel: number): {
    currentLevelXP: number
    nextLevelXP: number
    progressPercent: number
  } => {
    const currentLevelXP = currentXP % 1000
    const nextLevelXP = 1000
    const progressPercent = (currentLevelXP / nextLevelXP) * 100
    
    return {
      currentLevelXP,
      nextLevelXP,
      progressPercent
    }
  }, [])

  const getUnlockedAchievements = useCallback(() => {
    return state.achievements.filter(a => a.unlocked)
  }, [state.achievements])

  const getLockedAchievements = useCallback(() => {
    return state.achievements.filter(a => !a.unlocked)
  }, [state.achievements])

  const getToolsByCategory = useCallback((category: UserTool['category']) => {
    return state.tools.filter(tool => tool.category === category)
  }, [state.tools])

  // Course Management Functions
  const completeCourseLesson = useCallback(async (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
        )
        const completedCount = updatedLessons.filter(l => l.isCompleted).length
        const progress = Math.round((completedCount / updatedLessons.length) * 100)
        
        return {
          ...course,
          lessons: updatedLessons,
          progress
        }
      }
      return course
    }))
    
    // Track course progress
    setCourseProgress(prev => {
      const existing = prev.find(p => p.courseId === courseId)
      if (existing) {
        return prev.map(p => p.courseId === courseId ? {
          ...p,
          completedLessons: Array.from(new Set([...p.completedLessons, lessonId]))
        } : p)
      } else {
        return [...prev, {
          courseId,
          currentLessonId: lessonId,
          completedLessons: [lessonId],
          startedAt: new Date().toISOString(),
          score: 0
        }]
      }
    })
    
    // Award XP for lesson completion
    await trackCodingAction('complete_lesson', { courseId, lessonId, xp: 50 })
  }, [trackCodingAction])

  const completeCourse = useCallback(async (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (!course) return

    // Mark course as completed
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, isCompleted: true, progress: 100 } : c
    ))

    // Update course progress
    setCourseProgress(prev => prev.map(p => 
      p.courseId === courseId ? {
        ...p,
        completedAt: new Date().toISOString(),
        score: 100
      } : p
    ))

    // Award course completion rewards
    await trackCodingAction('complete_course', { 
      courseId, 
      xp: course.rewards.xp 
    })

    // Add the course tool to user's tools
    const newTool = saveTool({
      name: course.rewards.tool.name,
      description: course.rewards.tool.description,
      code: course.rewards.tool.code,
      category: course.category as any,
      tags: ['course-reward', courseId],
      isPublic: false
    })

    // Unlock achievement if specified
    if (course.rewards.achievement) {
      builderDB.unlockAchievement(course.rewards.achievement)
      setState(prev => ({
        ...prev,
        achievements: builderDB.getAchievements()
      }))
    }

    return newTool
  }, [courses, trackCodingAction, saveTool])

  // Load courses with unlock status
  const loadCoursesWithUnlockStatus = useCallback(() => {
    // Old courses system removed - this function is now a no-op
    // Tools are loaded through the tools system instead
    console.log('loadCoursesWithUnlockStatus: Old courses system removed')
  }, [state.achievements])

  // Update courses when achievements change
  useEffect(() => {
    loadCoursesWithUnlockStatus()
  }, [loadCoursesWithUnlockStatus])

  return {
    // State
    profile: state.profile,
    achievements: state.achievements,
    tools: state.tools,
    currentTabs: state.currentTabs,
    newlyUnlocked: state.newlyUnlocked,
    currentSession: state.currentSession,
    isLoading: state.isLoading,
    
    // Actions
    awardXP,
    trackCodingAction,
    saveTool,
    updateTool,
    deleteTool,
    saveCurrentTabs,
    dismissAchievement,
    unlockAchievement,
    updateProfile,
    endCurrentSession,
    
    // Utilities
    getStats,
    exportData,
    importData,
    resetProgress,
    getTotalXPForLevel,
    getXPProgress,
    getUnlockedAchievements,
    getLockedAchievements,
    getToolsByCategory,
    courses,
    courseProgress,
    completeCourseLesson,
    completeCourse,
    loadCoursesWithUnlockStatus
  }
} 