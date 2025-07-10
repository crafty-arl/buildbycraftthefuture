// Builder Profile and Gamification Types

export interface BuilderProfile {
  id: string
  username: string
  level: number
  xp: number
  title: string
  streak: number
  toolsBuilt: number
  linesOfCode: number
  joinDate: string
  lastActiveDate: string
  avatar?: string
  preferences: BuilderPreferences
}

export interface BuilderPreferences {
  theme: 'dark' | 'light'
  fontSize: number
  autoSave: boolean
  showHints: boolean
  celebrateAchievements: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlocked: boolean
  unlockedAt?: string
  category: 'coding' | 'tools' | 'streak' | 'learning' | 'social' | 'data-science' | 'ai-ml'
}

export interface UserTool {
  id: string
  name: string
  description: string
  category: 'beginner' | 'data-science' | 'automation' | 'ai-ml' | 'games' | 'utilities'
  code: string
  createdAt: string
  lastModified: string
  linesOfCode: number
  timesRun: number
  isPublic: boolean
  isFavorite: boolean
  tags: string[]
  language: 'python'
  version: number
  status: 'draft' | 'completed' | 'shared'
}

export interface EditorTab {
  id: string
  toolId?: string // Reference to UserTool if it's a saved tool
  name: string
  content: string
  isModified: boolean
  isActive: boolean
  language: 'python'
  createdAt: string
}

export interface LearningProgress {
  completedLessons: string[]
  currentLesson?: string
  skillPoints: {
    python_basics: number
    data_structures: number
    functions: number
    file_handling: number
    data_science: number
    ai_ml: number
  }
  conceptsMastered: string[]
  timeSpentCoding: number // in minutes
}

export interface BuilderSession {
  id: string
  startTime: string
  endTime?: string
  xpEarned: number
  linesWritten: number
  toolsCreated: number
  achievementsUnlocked: string[]
  lessonsCompleted: string[]
}

export interface BuilderStats {
  totalSessions: number
  averageSessionTime: number
  longestStreak: number
  favoriteCategory: string
  mostUsedFeatures: string[]
  progressOverTime: {
    date: string
    xp: number
    level: number
    toolsBuilt: number
  }[]
}

// Database Schema Structure
export interface BuilderDatabase {
  profile: BuilderProfile
  achievements: Achievement[]
  tools: UserTool[]
  learningProgress: LearningProgress
  sessions: BuilderSession[]
  stats: BuilderStats
  currentTabs: EditorTab[]
}

// Achievement Definitions
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'hello-builder',
    name: 'Hello Builder!',
    description: 'Write your first print() statement',
    icon: '👋',
    rarity: 'common',
    xpReward: 25,
    category: 'coding'
  },
  {
    id: 'first-tool',
    name: 'Tool Creator',
    description: 'Build and save your first tool',
    icon: '🔧',
    rarity: 'common',
    xpReward: 50,
    category: 'tools'
  },
  {
    id: 'week-streak',
    name: 'Weekly Warrior',
    description: 'Code for 7 days in a row',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 100,
    category: 'streak'
  },
  {
    id: 'loop-master',
    name: 'Loop Master',
    description: 'Use for/while loops in 10 different tools',
    icon: '🔄',
    rarity: 'rare',
    xpReward: 150,
    category: 'coding'
  },
  {
    id: 'data-wizard',
    name: 'Data Wizard',
    description: 'Process data with pandas in 5 tools',
    icon: '🧙‍♂️',
    rarity: 'epic',
    xpReward: 250,
    category: 'data-science'
  },
  {
    id: 'ai-pioneer',
    name: 'AI Pioneer',
    description: 'Build your first machine learning model',
    icon: '🚀',
    rarity: 'legendary',
    xpReward: 500,
    category: 'ai-ml'
  },
  {
    id: 'prolific-builder',
    name: 'Prolific Builder',
    description: 'Create 25 different tools',
    icon: '🏗️',
    rarity: 'epic',
    xpReward: 300,
    category: 'tools'
  },
  {
    id: 'code-marathoner',
    name: 'Code Marathoner',
    description: 'Write 5,000 lines of code',
    icon: '🏃‍♂️',
    rarity: 'epic',
    xpReward: 400,
    category: 'coding'
  }
]

// Level Progression
export const LEVEL_TITLES: { [key: number]: string } = {
  1: 'Code Newbie',
  4: 'Script Builder', 
  8: 'Tool Crafter',
  13: 'Data Engineer',
  19: 'AI Developer',
  26: 'Future Architect',
  36: 'Technology Pioneer',
  46: 'Innovation Legend'
}

export const XP_PER_LEVEL = 1000

// Utility Types
export type AchievementCategory = Achievement['category']
export type ToolCategory = UserTool['category']
export type AchievementRarity = Achievement['rarity'] 

export interface Course {
  id: string
  title: string
  description: string
  category: 'beginner' | 'data-science' | 'automation' | 'ai-ml' | 'games' | 'advanced'
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string // e.g., "30 minutes"
  prerequisites: string[] // achievement IDs required to unlock
  rewards: {
    xp: number
    achievement?: string // achievement ID to unlock
    tool: {
      name: string
      code: string
      description: string
    }
  }
  lessons: CourseLesson[]
  isUnlocked: boolean
  isCompleted: boolean
  progress: number // 0-100
}

export interface CourseLesson {
  id: string
  title: string
  type: 'theory' | 'practice' | 'challenge'
  content: string // markdown content
  codeTemplate?: string // starter code for practice/challenge
  expectedOutput?: string // for validation
  hints?: string[]
  isCompleted: boolean
  // Enhanced validation system
  expectedOutcomes?: {
    output?: string | RegExp // Expected console output
    variables?: { [key: string]: any } // Expected variable values
    functionCalls?: string[] // Expected function calls
    hasNoErrors?: boolean // Should run without errors
    containsKeywords?: string[] // Code should contain these keywords
    testCases?: Array<{
      description: string
      input?: string // Input to provide
      expectedOutput: string | RegExp // Expected result
      points: number // Points for passing this test
    }>
  }
  // Reward system
  rewards?: {
    xp: number
    partialCredit?: boolean // Allow partial XP for partial completion
    bonusXP?: number // Extra XP for perfect completion
  }
  // Failure handling
  failureMessages?: {
    noOutput?: string
    wrongOutput?: string
    hasErrors?: string
    missingKeywords?: string
    general?: string
  }
}

export interface CourseProgress {
  courseId: string
  currentLessonId: string
  completedLessons: string[]
  startedAt: string
  completedAt?: string
  score: number // 0-100
} 