'use client'

import { useState } from 'react'
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Trophy, 
  Target,
  Flame,
  Code,
  Database,
  Brain,
  Zap,
  Star,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronRight,
  Book,
  PlayCircle,
  CheckCircle,
  Lock,
  Users,
  Globe,
  Search,
  Clock
} from 'lucide-react'
import { UserTool, BuilderProfile, Achievement, Course } from '../types/builderTypes'
import QuickStartDemo from './QuickStartDemo'

interface FileExplorerProps {
  profile: BuilderProfile
  tools: UserTool[]
  achievements: Achievement[]
  courses: Course[]
  onToolSelect: (tool: UserTool) => void
  onNewTool: () => void
  onCourseSelect: (course: Course) => void
  className?: string
  // Lesson integration
  activeCourse?: Course | null
  currentLessonIndex?: number
}

export default function FileExplorer({ 
  profile,
  tools, 
  achievements,
  courses,
  onToolSelect, 
  onNewTool,
  onCourseSelect,
  className = "",
  activeCourse = null,
  currentLessonIndex = 0
}: FileExplorerProps) {
  const [expandedSections, setExpandedSections] = useState({
    myTools: true,
    courses: true, // Auto-expand courses for better UX
    achievements: false,
    progress: true
  })
  
  const [searchTerm, setSearchTerm] = useState('')

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beginner': return <Code className="w-4 h-4 text-build-accent" />
      case 'data-science': return <Database className="w-4 h-4 text-data-purple" />
      case 'automation': return <Zap className="w-4 h-4 text-build-green" />
      case 'ai-ml': return <Brain className="w-4 h-4 text-ai-teal" />
      case 'games': return <Star className="w-4 h-4 text-build-pink" />
      case 'utilities': return <Target className="w-4 h-4 text-build-muted" />
      default: return <File className="w-4 h-4 text-build-muted" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner': return 'text-build-accent'
      case 'data-science': return 'text-data-purple'
      case 'automation': return 'text-build-green'
      case 'ai-ml': return 'text-ai-teal'
      case 'games': return 'text-build-pink'
      case 'utilities': return 'text-build-muted'
      default: return 'text-build-text'
    }
  }

  const getCourseIcon = (course: Course) => {
    if (!course.isUnlocked) return <Lock className="w-4 h-4 text-gray-400" />
    if (course.isCompleted) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <PlayCircle className="w-4 h-4 text-blue-500" />
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getXPProgress = () => {
    const currentLevelXP = profile.xp % 1000
    const progressPercent = (currentLevelXP / 1000) * 100
    return { currentLevelXP, progressPercent }
  }

  const getRecentAchievements = () => {
    return achievements
      .filter(a => a.unlocked)
      .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
      .slice(0, 3)
  }

  const filterTools = (tools: UserTool[]) => {
    if (!searchTerm) return tools
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const toolsByCategory = filterTools(tools).reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, UserTool[]>)

  const { currentLevelXP, progressPercent } = getXPProgress()
  const recentAchievements = getRecentAchievements()

  return (
    <div className={`h-full bg-build-surface border-r border-build-border flex flex-col ${className}`}>
      {/* Builder Progress Header */}
      <div className="p-4 border-b border-build-border bg-gradient-to-r from-build-accent/5 to-python-blue/5">
        <div className="space-y-3">
          {/* Level and Title */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold text-build-text font-mono">
                  Level {profile.level}
                </span>
              </div>
              <div className="text-xs text-build-muted font-mono mt-1">
                {profile.title}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-mono text-build-text">{profile.streak}</span>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-tan-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-build-accent to-python-blue h-2.5 rounded-full transition-all duration-500 orange-glow"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-build-muted font-mono">
              <span>{currentLevelXP} XP</span>
              <span>{1000 - currentLevelXP} to next level</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center space-x-1">
              <Code className="w-3 h-3 text-build-accent" />
              <span className="text-build-muted">{profile.toolsBuilt} tools</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-build-green" />
              <span className="text-build-muted">{profile.linesOfCode} lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-build-border">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-build-muted" />
          <input
            type="text"
            placeholder="Search tools and courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-tan-50 border border-tan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-build-accent/20 focus:border-build-accent font-mono"
          />
        </div>
      </div>

      {/* File Explorer Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Start Demo */}
        <div className="p-3">
          <QuickStartDemo courses={courses} onStartLesson={onCourseSelect} />
        </div>

        {/* Learning Courses Section */}
        <div className="border-b border-build-border">
          <button
            onClick={() => toggleSection('courses')}
            className="w-full p-3 flex items-center justify-between hover:bg-tan-50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Book className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-mono text-build-text">
                Learning Path ({courses.filter(c => c.isUnlocked).length}/{courses.length})
              </span>
            </div>
            {expandedSections.courses ? 
              <ChevronDown className="w-4 h-4 text-build-muted" /> : 
              <ChevronRight className="w-4 h-4 text-build-muted" />
            }
          </button>
          
          {expandedSections.courses && (
            <div className="pb-2">
              {courses.map(course => {
                const isActiveCourse = activeCourse && activeCourse.id === course.id
                const completedLessons = course.lessons.filter(l => l.isCompleted).length
                const progressPercent = (completedLessons / course.lessons.length) * 100
                
                return (
                  <div key={course.id} className={`${isActiveCourse ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                    <button
                      onClick={() => course.isUnlocked && onCourseSelect(course)}
                      disabled={!course.isUnlocked}
                      className={`w-full p-2 pl-8 flex items-center space-x-3 transition-colors ${
                        course.isUnlocked 
                          ? 'hover:bg-tan-50 cursor-pointer' 
                          : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      {getCourseIcon(course)}
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-build-text font-mono truncate">
                            {course.title}
                          </div>
                          {isActiveCourse && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-mono">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-build-muted">
                          {course.lessons.length} lessons • 
                          {course.isCompleted ? ' Completed' : 
                           course.isUnlocked ? ` ${Math.round(progressPercent)}% complete` : ' Locked'
                          }
                        </div>
                        {course.rewards && (
                          <div className="text-xs text-build-accent">
                            +{course.rewards.xp} XP • {course.rewards.tool ? '1 tool' : '0 tools'}
                          </div>
                        )}
                        {isActiveCourse && (
                          <div className="text-xs text-blue-600 font-mono">
                            📚 Lesson {currentLessonIndex + 1}: {course.lessons[currentLessonIndex]?.title || 'N/A'}
                          </div>
                        )}
                      </div>
                      {course.isCompleted && (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      )}
                      {isActiveCourse && !course.isCompleted && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </button>
                    
                    {/* Show lesson progress when active */}
                    {isActiveCourse && (
                      <div className="px-8 pb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Lesson Progress</span>
                          <span>{completedLessons}/{course.lessons.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* My Tools Section */}
        <div className="border-b border-build-border">
          <button
            onClick={() => toggleSection('myTools')}
            className="w-full p-3 flex items-center justify-between hover:bg-tan-50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {expandedSections.myTools ? 
                <FolderOpen className="w-4 h-4 text-build-accent" /> : 
                <Folder className="w-4 h-4 text-build-muted" />
              }
              <span className="text-sm font-mono text-build-text">My Tools ({filterTools(tools).length})</span>
            </div>
            {expandedSections.myTools ? 
              <ChevronDown className="w-4 h-4 text-build-muted" /> : 
              <ChevronRight className="w-4 h-4 text-build-muted" />
            }
          </button>
          
          {expandedSections.myTools && (
            <div className="pb-2">
              {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
                <div key={category} className="mb-3">
                  {/* Category Header */}
                  <div className="px-6 py-1 flex items-center space-x-2">
                    {getCategoryIcon(category)}
                    <span className={`text-xs font-mono font-semibold ${getCategoryColor(category)}`}>
                      {category.replace('-', ' ').toUpperCase()} ({categoryTools.length})
                    </span>
                  </div>
                  
                  {/* Tools in Category */}
                  {categoryTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => onToolSelect(tool)}
                      className="w-full p-2 pl-10 flex items-center space-x-2 hover:bg-tan-50 transition-colors group"
                    >
                      <File className="w-3 h-3 text-build-muted group-hover:text-build-accent transition-colors" />
                      <div className="flex-1 text-left">
                        <div className="text-sm text-build-text font-mono truncate">
                          {tool.name}.py
                        </div>
                        <div className="text-xs text-build-muted flex items-center space-x-2">
                          <span>{tool.linesOfCode} lines</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{new Date(tool.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {tool.isFavorite && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                      {tool.isPublic && (
                        <Globe className="w-3 h-3 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
              
              <button
                onClick={onNewTool}
                className="w-full p-2 pl-8 flex items-center space-x-2 hover:bg-build-accent/5 transition-colors text-build-accent"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-mono">New Tool</span>
              </button>
            </div>
          )}
        </div>

        {/* Recent Achievements Section */}
        <div className="border-b border-build-border">
          <button
            onClick={() => toggleSection('achievements')}
            className="w-full p-3 flex items-center justify-between hover:bg-tan-50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-mono text-build-text">
                Recent Achievements ({achievements.filter(a => a.unlocked).length})
              </span>
            </div>
            {expandedSections.achievements ? 
              <ChevronDown className="w-4 h-4 text-build-muted" /> : 
              <ChevronRight className="w-4 h-4 text-build-muted" />
            }
          </button>
          
          {expandedSections.achievements && (
            <div className="pb-2">
              {recentAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="p-2 pl-8 flex items-center space-x-2"
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-build-text font-mono">
                      {achievement.name}
                    </div>
                    <div className="text-xs text-build-muted">
                      +{achievement.xpReward} XP • {achievement.rarity}
                    </div>
                  </div>
                </div>
              ))}
              
              {recentAchievements.length === 0 && (
                <div className="p-2 pl-8 text-xs text-build-muted font-mono">
                  Complete challenges to unlock achievements!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Community Section */}
        <div className="p-3">
          <div className="text-xs text-build-muted font-mono mb-2 flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>COMMUNITY</span>
          </div>
          <div className="space-y-1 text-xs text-build-muted font-mono">
            <div>🌟 Builders online: 1,247</div>
            <div>🔥 Global streak leader: 89 days</div>
            <div>🏆 Most tools built: 156</div>
          </div>
        </div>
      </div>
    </div>
  )
} 