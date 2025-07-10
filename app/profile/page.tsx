'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LayoutWrapper from '../components/layout/LayoutWrapper'
import { Trophy, Target, Clock, CheckCircle, Star, Zap, Award, TrendingUp, User, Loader } from 'lucide-react'
import { tools, SimpleTool } from '../data/tools'

interface UserProfile {
  name: string
  email: string
  image?: string
  totalXP: number
  completedTools: string[]
  level: number
  joinDate: string
  isPassHolder: boolean
  achievements: any[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedToolsData, setCompletedToolsData] = useState<SimpleTool[]>([])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      // Redirect to sign-in if not authenticated
      router.push('/auth/signin?callbackUrl=/profile')
      return
    }

    loadUserProfile()
  }, [session, status, router])

  const loadUserProfile = async () => {
    try {
      if (!session?.user) return

      // Try to fetch from database first
      const response = await fetch('/api/user/progress')
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: session.user.name || 'Builder',
          email: session.user.email || '',
          image: session.user.image || undefined,
          totalXP: data.totalXP || 0,
          completedTools: data.completedTools || [],
          level: data.level || 1,
          joinDate: new Date().toISOString().split('T')[0], // We'll get this from DB later
          isPassHolder: session.user.isPassHolder || false,
          achievements: data.achievements || []
        })

        // Get completed tools data
        const completedToolsInfo = tools.filter(tool => 
          (data.completedTools || []).includes(tool.slug)
        )
        setCompletedToolsData(completedToolsInfo)
      } else {
        // Fallback to localStorage for new users
        const savedXP = parseInt(localStorage.getItem('user_xp') || '0')
        const completedTools = JSON.parse(localStorage.getItem('completed_tools') || '[]')
        
        setProfile({
          name: session.user.name || 'Builder',
          email: session.user.email || '',
          image: session.user.image || undefined,
          totalXP: savedXP,
          completedTools,
          level: Math.floor(savedXP / 100) + 1,
          joinDate: new Date().toISOString().split('T')[0],
          isPassHolder: false,
          achievements: []
        })

        const completedToolsInfo = tools.filter(tool => completedTools.includes(tool.slug))
        setCompletedToolsData(completedToolsInfo)

        // Sync localStorage data to database
        if (savedXP > 0 || completedTools.length > 0) {
          syncToDatabase(savedXP, completedTools)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncToDatabase = async (totalXP: number, completedTools: string[]) => {
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalXP, completedTools })
      })
    } catch (error) {
      console.error('Error syncing to database:', error)
    }
  }

  const calculateStreak = (completedTools: string[]): number => {
    // Simple streak calculation - in real app would check completion dates
    return Math.min(completedTools.length, 7)
  }

  const getXPToNextLevel = (): number => {
    if (!profile) return 100
    return (profile.level * 100) - profile.totalXP
  }

  const getProgressPercentage = (): number => {
    if (!profile) return 0
    const currentLevelXP = profile.totalXP % 100
    return (currentLevelXP / 100) * 100
  }

  const getAchievements = () => {
    if (!profile) return []
    
    const achievements = []
    
    if (profile.completedTools.length >= 1) {
      achievements.push({
        title: 'First Tool Built',
        description: 'Completed your first tool',
        icon: '🛠️',
        earned: true
      })
    }
    
    if (profile.completedTools.length >= 3) {
      achievements.push({
        title: 'Tool Builder',
        description: 'Completed 3 tools',
        icon: '🏗️',
        earned: true
      })
    }
    
    if (profile.completedTools.length >= 1) {
      achievements.push({
        title: 'Master Builder',
        description: 'Completed the Receipt Generator tool',
        icon: '🏆',
        earned: true
      })
    }
    
    if (profile.totalXP >= 500) {
      achievements.push({
        title: 'XP Champion',
        description: 'Earned 500+ XP',
        icon: '⚡',
        earned: true
      })
    }

    // Add locked achievements
    if (profile.completedTools.length < 3) {
      achievements.push({
        title: 'Tool Builder',
        description: 'Complete 3 tools',
        icon: '🔒',
        earned: false
      })
    }
    
    if (profile.completedTools.length < 1) {
      achievements.push({
        title: 'Master Builder',
        description: 'Complete the Receipt Generator tool',
        icon: '🔒',
        earned: false
      })
    }

    return achievements
  }

  const trackColors = {
    python: 'bg-python-blue/10 border-python-blue text-python-blue',
    ai: 'bg-purple-500/10 border-purple-500 text-purple-500',
    data: 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
  }

  if (loading) {
    return (
      <LayoutWrapper currentPage="profile">
        <div className="min-h-screen bg-build-bg flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-build-accent mx-auto mb-4" />
            <p className="text-build-muted">Loading your profile...</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!profile || !session) {
    return (
      <LayoutWrapper currentPage="profile">
        <div className="min-h-screen bg-build-bg flex items-center justify-center">
          <div className="text-center">
            <p className="text-build-muted">Please sign in to view your profile.</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper currentPage="profile">
      <div className="min-h-screen bg-build-bg">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Profile Header */}
          <div className="bg-build-surface rounded-lg border border-build-border p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {profile.image ? (
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="w-16 h-16 rounded-full border-2 border-build-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-build-accent/20 border-2 border-build-border flex items-center justify-center">
                    <User className="w-8 h-8 text-build-accent" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-build-text font-mono">
                    Welcome back, {profile.name}!
                  </h1>
                  <p className="text-build-muted mt-1">{profile.email}</p>
                  <p className="text-build-muted text-sm">
                    Building the future since {new Date(profile.joinDate).toLocaleDateString()}
                    {profile.isPassHolder && (
                      <span className="ml-2 px-2 py-1 bg-build-accent text-white text-xs rounded-full">
                        Season Pass
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-build-accent font-mono">
                  Level {profile.level}
                </div>
                <div className="text-sm text-build-muted">
                  {getXPToNextLevel()} XP to level {profile.level + 1}
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-build-muted">Progress to Level {profile.level + 1}</span>
                <span className="text-sm font-mono text-build-accent">{profile.totalXP} XP</span>
              </div>
              <div className="w-full bg-build-bg rounded-full h-3">
                <div 
                  className="bg-build-accent h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="bg-build-surface rounded-lg border border-build-border p-6">
              <h3 className="text-xl font-semibold text-build-text mb-4 font-mono flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-build-accent" />
                Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-build-muted">Tools Completed</span>
                  <span className="text-build-accent font-mono">{profile.completedTools.length}/1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-build-muted">Total XP</span>
                  <span className="text-build-accent font-mono">{profile.totalXP}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-build-muted">Current Level</span>
                  <span className="text-build-accent font-mono">{profile.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-build-muted">Build Streak</span>
                  <span className="text-build-accent font-mono">{calculateStreak(profile.completedTools)} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-build-muted">Account Type</span>
                  <span className="text-build-accent font-mono">{profile.isPassHolder ? 'Season Pass' : 'Free'}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-build-surface rounded-lg border border-build-border p-6">
              <h3 className="text-xl font-semibold text-build-text mb-4 font-mono flex items-center">
                <Award className="w-5 h-5 mr-2 text-build-accent" />
                Achievements
              </h3>
              <div className="space-y-3">
                {getAchievements().slice(0, 4).map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-build-accent/10' : 'bg-build-bg'
                  }`}>
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className={`font-medium ${achievement.earned ? 'text-build-text' : 'text-build-muted'}`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-build-muted">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-4 h-4 text-build-accent" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-build-surface rounded-lg border border-build-border p-6">
              <h3 className="text-xl font-semibold text-build-text mb-4 font-mono flex items-center">
                <Zap className="w-5 h-5 mr-2 text-build-accent" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a 
                  href="/tool/receipt-generator"
                  className="block w-full btn-primary text-center"
                >
                  Build Receipt Generator
                </a>
                {!profile.isPassHolder && (
                  <a 
                    href="/upgrade"
                    className="block w-full btn-minimal text-center"
                  >
                    Upgrade to Season Pass
                  </a>
                )}
                <a 
                  href="/"
                  className="block w-full btn-minimal text-center"
                >
                  Browse All Tools
                </a>
              </div>
            </div>
          </div>

          {/* Completed Tools */}
          {completedToolsData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-build-text mb-6 font-mono">
                🛠️ Your Built Tools ({completedToolsData.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedToolsData.map((tool) => (
                  <div key={tool.id} className="bg-build-surface rounded-lg border border-build-border p-6 group hover:border-build-accent transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono border ${trackColors[tool.track]}`}>
                        /{tool.track}
                      </span>
                      <CheckCircle className="w-5 h-5 text-build-accent" />
                    </div>
                    <h4 className="text-lg font-semibold text-build-text mb-2 font-mono group-hover:text-build-accent transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-build-muted text-sm mb-4">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-build-muted font-mono">{tool.difficulty}</span>
                      <a 
                        href={`/tool/${tool.slug}`}
                        className="text-build-accent hover:text-build-accent-dark text-sm font-mono"
                      >
                        View Tool →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Tools */}
          {profile.completedTools.length < tools.length && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-build-text mb-6 font-mono">
                🎯 Available Tools ({tools.length - profile.completedTools.length} remaining)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter(tool => !profile.completedTools.includes(tool.slug)).map((tool) => (
                  <div key={tool.id} className="bg-build-surface rounded-lg border border-build-border p-6 group hover:border-build-accent transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono border ${trackColors[tool.track]}`}>
                        /{tool.track}
                      </span>
                      <div className="text-xs text-build-muted font-mono">+{tool.difficulty === 'Beginner' ? '100' : tool.difficulty === 'Intermediate' ? '150' : '200'} XP</div>
                    </div>
                    <h4 className="text-lg font-semibold text-build-text mb-2 font-mono group-hover:text-build-accent transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-build-muted text-sm mb-4">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-build-muted font-mono">{tool.estimatedTime}</span>
                      <a 
                        href={`/tool/${tool.slug}`}
                        className="btn-primary text-sm"
                      >
                        Start Building →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
} 