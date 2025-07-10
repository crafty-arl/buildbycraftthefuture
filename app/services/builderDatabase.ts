import {
  BuilderDatabase,
  BuilderProfile,
  Achievement,
  UserTool,
  EditorTab,
  LearningProgress,
  BuilderSession,
  BuilderStats,
  ACHIEVEMENT_DEFINITIONS,
  LEVEL_TITLES,
  XP_PER_LEVEL
} from '../types/builderTypes'

class BuilderDatabaseService {
  private readonly storageKey = 'builderDatabase'
  private database: BuilderDatabase
  
  constructor() {
    this.database = this.loadDatabase()
  }

  // Initialize default database structure
  private createDefaultDatabase(): BuilderDatabase {
    const now = new Date().toISOString()
    
    return {
      profile: {
        id: `builder_${Date.now()}`,
        username: 'Builder',
        level: 1,
        xp: 0,
        title: 'Code Newbie',
        streak: 0,
        toolsBuilt: 0,
        linesOfCode: 0,
        joinDate: now,
        lastActiveDate: now,
        preferences: {
          theme: 'dark',
          fontSize: 14,
          autoSave: true,
          showHints: true,
          celebrateAchievements: true
        }
      },
      achievements: ACHIEVEMENT_DEFINITIONS.map(achievement => ({
        ...achievement,
        unlocked: false
      })),
      tools: [],
      learningProgress: {
        completedLessons: [],
        skillPoints: {
          python_basics: 0,
          data_structures: 0,
          functions: 0,
          file_handling: 0,
          data_science: 0,
          ai_ml: 0
        },
        conceptsMastered: [],
        timeSpentCoding: 0
      },
      sessions: [],
      stats: {
        totalSessions: 0,
        averageSessionTime: 0,
        longestStreak: 0,
        favoriteCategory: 'beginner',
        mostUsedFeatures: [],
        progressOverTime: []
      },
      currentTabs: []
    }
  }

  // Load database from localStorage or create default
  private loadDatabase(): BuilderDatabase {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure all required fields exist by merging with default
        return { ...this.createDefaultDatabase(), ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load builder database:', error)
    }
    
    return this.createDefaultDatabase()
  }

  // Save database to localStorage
  private saveDatabase(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.database))
    } catch (error) {
      console.error('Failed to save builder database:', error)
    }
  }

  // Profile Management
  getProfile(): BuilderProfile {
    return { ...this.database.profile }
  }

  updateProfile(updates: Partial<BuilderProfile>): BuilderProfile {
    this.database.profile = { ...this.database.profile, ...updates }
    this.saveDatabase()
    return this.getProfile()
  }

  // XP and Level Management
  awardXP(amount: number, reason: string): { 
    newXP: number; 
    leveledUp: boolean; 
    newLevel?: number;
    newTitle?: string;
  } {
    const oldLevel = this.database.profile.level
    const newXP = this.database.profile.xp + amount
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1
    const leveledUp = newLevel > oldLevel
    
    this.database.profile.xp = newXP
    this.database.profile.level = newLevel
    
    if (leveledUp) {
      const newTitle = this.getLevelTitle(newLevel)
      this.database.profile.title = newTitle
      this.saveDatabase()
      
      return { 
        newXP, 
        leveledUp: true, 
        newLevel, 
        newTitle 
      }
    }
    
    this.saveDatabase()
    return { newXP, leveledUp: false }
  }

  private getLevelTitle(level: number): string {
    const sortedLevels = Object.keys(LEVEL_TITLES)
      .map(Number)
      .sort((a, b) => b - a)
    
    for (const levelThreshold of sortedLevels) {
      if (level >= levelThreshold) {
        return LEVEL_TITLES[levelThreshold]
      }
    }
    
    return 'Code Newbie'
  }

  // Achievement Management
  getAchievements(): Achievement[] {
    return [...this.database.achievements]
  }

  unlockAchievement(achievementId: string): Achievement | null {
    const achievement = this.database.achievements.find(a => a.id === achievementId)
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date().toISOString()
      
      // Award XP for achievement
      this.awardXP(achievement.xpReward, `Achievement: ${achievement.name}`)
      
      this.saveDatabase()
      return { ...achievement }
    }
    
    return null
  }

  checkAchievements(action: string, metadata?: any): Achievement | null {
    const profile = this.database.profile
    const tools = this.database.tools
    
    let achievementToUnlock: string | null = null
    
    switch (action) {
      case 'first_print':
        if (!this.database.achievements.find(a => a.id === 'hello-builder')?.unlocked) {
          achievementToUnlock = 'hello-builder'
        }
        break
        
      case 'save_tool':
        if (!this.database.achievements.find(a => a.id === 'first-tool')?.unlocked) {
          achievementToUnlock = 'first-tool'
        }
        // Check for prolific builder (25 tools)
        if (tools.length >= 25 && !this.database.achievements.find(a => a.id === 'prolific-builder')?.unlocked) {
          achievementToUnlock = 'prolific-builder'
        }
        break
        
      case 'streak_update':
        if (profile.streak >= 7 && !this.database.achievements.find(a => a.id === 'week-streak')?.unlocked) {
          achievementToUnlock = 'week-streak'
        }
        break
        
      case 'use_loop':
        const loopTools = tools.filter(tool => 
          tool.code.includes('for ') || tool.code.includes('while ')
        ).length
        if (loopTools >= 10 && !this.database.achievements.find(a => a.id === 'loop-master')?.unlocked) {
          achievementToUnlock = 'loop-master'
        }
        break
        
      case 'use_pandas':
        const pandasTools = tools.filter(tool => 
          tool.code.includes('import pandas') || tool.code.includes('pd.')
        ).length
        if (pandasTools >= 5 && !this.database.achievements.find(a => a.id === 'data-wizard')?.unlocked) {
          achievementToUnlock = 'data-wizard'
        }
        break
        
      case 'lines_written':
        if (profile.linesOfCode >= 5000 && !this.database.achievements.find(a => a.id === 'code-marathoner')?.unlocked) {
          achievementToUnlock = 'code-marathoner'
        }
        break
    }
    
    if (achievementToUnlock) {
      return this.unlockAchievement(achievementToUnlock)
    }
    
    return null
  }

  // Tool Management
  getTools(): UserTool[] {
    return [...this.database.tools]
  }

  saveTool(tool: Omit<UserTool, 'id' | 'createdAt' | 'version'>): UserTool {
    const now = new Date().toISOString()
    const newTool: UserTool = {
      ...tool,
      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      version: 1
    }
    
    this.database.tools.push(newTool)
    
    // Update profile stats
    this.database.profile.toolsBuilt = this.database.tools.length
    this.database.profile.linesOfCode += tool.linesOfCode
    
    this.saveDatabase()
    
    // Check for achievements
    this.checkAchievements('save_tool')
    this.checkAchievements('lines_written')
    
    return { ...newTool }
  }

  updateTool(toolId: string, updates: Partial<UserTool>): UserTool | null {
    const toolIndex = this.database.tools.findIndex(t => t.id === toolId)
    
    if (toolIndex !== -1) {
      const oldTool = this.database.tools[toolIndex]
      const updatedTool = {
        ...oldTool,
        ...updates,
        lastModified: new Date().toISOString(),
        version: oldTool.version + 1
      }
      
      this.database.tools[toolIndex] = updatedTool
      
      // Update lines of code if content changed
      if (updates.linesOfCode !== undefined) {
        const lineDifference = updates.linesOfCode - oldTool.linesOfCode
        this.database.profile.linesOfCode += lineDifference
      }
      
      this.saveDatabase()
      return { ...updatedTool }
    }
    
    return null
  }

  deleteTool(toolId: string): boolean {
    const toolIndex = this.database.tools.findIndex(t => t.id === toolId)
    
    if (toolIndex !== -1) {
      const tool = this.database.tools[toolIndex]
      this.database.tools.splice(toolIndex, 1)
      
      // Update profile stats
      this.database.profile.toolsBuilt = this.database.tools.length
      this.database.profile.linesOfCode -= tool.linesOfCode
      
      this.saveDatabase()
      return true
    }
    
    return false
  }

  // Tab Management
  getCurrentTabs(): EditorTab[] {
    return [...this.database.currentTabs]
  }

  saveCurrentTabs(tabs: EditorTab[]): void {
    this.database.currentTabs = tabs
    this.saveDatabase()
  }

  // Streak Management
  updateStreak(): { streakUpdated: boolean; newStreak: number } {
    const today = new Date().toDateString()
    const lastActive = new Date(this.database.profile.lastActiveDate).toDateString()
    
    if (today === lastActive) {
      // Already updated today
      return { streakUpdated: false, newStreak: this.database.profile.streak }
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    let newStreak: number
    
    if (lastActive === yesterdayStr) {
      // Continuing streak
      newStreak = this.database.profile.streak + 1
    } else {
      // Streak broken or first day
      newStreak = 1
    }
    
    this.database.profile.streak = newStreak
    this.database.profile.lastActiveDate = new Date().toISOString()
    
    // Update longest streak
    if (newStreak > this.database.stats.longestStreak) {
      this.database.stats.longestStreak = newStreak
    }
    
    this.saveDatabase()
    
    // Check for streak achievements
    this.checkAchievements('streak_update')
    
    return { streakUpdated: true, newStreak }
  }

  // Session Management
  startSession(): BuilderSession {
    const session: BuilderSession = {
      id: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      xpEarned: 0,
      linesWritten: 0,
      toolsCreated: 0,
      achievementsUnlocked: [],
      lessonsCompleted: []
    }
    
    this.database.sessions.push(session)
    this.saveDatabase()
    
    return { ...session }
  }

  endSession(sessionId: string): BuilderSession | null {
    const session = this.database.sessions.find(s => s.id === sessionId)
    
    if (session && !session.endTime) {
      session.endTime = new Date().toISOString()
      this.saveDatabase()
      return { ...session }
    }
    
    return null
  }

  // Analytics and Stats
  getStats(): BuilderStats {
    return { ...this.database.stats }
  }

  updateProgressTracking(): void {
    const today = new Date().toISOString().split('T')[0]
    const progress = this.database.stats.progressOverTime
    
    // Check if we already have an entry for today
    const todayEntry = progress.find(p => p.date === today)
    
    if (todayEntry) {
      // Update today's entry
      todayEntry.xp = this.database.profile.xp
      todayEntry.level = this.database.profile.level
      todayEntry.toolsBuilt = this.database.profile.toolsBuilt
    } else {
      // Add new entry
      progress.push({
        date: today,
        xp: this.database.profile.xp,
        level: this.database.profile.level,
        toolsBuilt: this.database.profile.toolsBuilt
      })
    }
    
    // Keep only last 30 days
    if (progress.length > 30) {
      progress.splice(0, progress.length - 30)
    }
    
    this.saveDatabase()
  }

  // Export/Import
  exportData(): string {
    return JSON.stringify(this.database, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData)
      this.database = { ...this.createDefaultDatabase(), ...imported }
      this.saveDatabase()
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }

  // Reset (for development/testing)
  resetDatabase(): void {
    this.database = this.createDefaultDatabase()
    this.saveDatabase()
  }
}

// Export singleton instance
export const builderDB = new BuilderDatabaseService()
export default builderDB 