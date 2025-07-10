'use client'

import { Menu, Code, Award, Settings, Trophy, FileText, Folder, Cpu, Wifi } from 'lucide-react'

interface IDEToolbarProps {
  onToggleSidebar: () => void
  pythonStatus: 'loading' | 'ready' | 'error'
  statusMessage: string
  profile: {
    level: number
    xp: number
  }
  sessionStats: {
    linesWritten: number
    toolsCreated: number
    executionTime: number
  }
  achievementCount: number
  onShowAchievements: () => void
  formatTime: (ms: number) => string
}

export default function IDEToolbar({
  onToggleSidebar,
  pythonStatus,
  statusMessage,
  profile,
  sessionStats,
  achievementCount,
  onShowAchievements,
  formatTime
}: IDEToolbarProps) {
  // Memoize progress display to prevent unnecessary re-renders
  const progressDisplay = (
    <div className="flex items-center space-x-1 sm:space-x-2 text-sm font-mono">
      <Trophy className="w-4 h-4 text-yellow-500" />
      <span className="hidden sm:inline text-build-text">Level {profile.level}</span>
      <span className="sm:hidden text-build-text">L{profile.level}</span>
      <span className="text-build-muted">•</span>
      <span className="text-build-accent">{profile.xp} XP</span>
    </div>
  )

  // Status indicators - Responsive
  const statusIndicators = (
    <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
      <div className="flex items-center space-x-1">
        <Cpu className={`w-3 h-3 ${pythonStatus === 'ready' ? 'text-green-500' : pythonStatus === 'loading' ? 'text-yellow-500' : 'text-red-500'}`} />
        <span className="hidden sm:inline text-build-muted">{statusMessage}</span>
        <span className="sm:hidden text-build-muted">Ready</span>
      </div>
      <div className="hidden sm:flex items-center space-x-1">
        <Wifi className="w-3 h-3 text-blue-500" />
        <span className="text-build-muted">CDN Runtime</span>
      </div>
      <div className="flex items-center space-x-1">
        <span className="hidden sm:inline text-build-muted">Session: {formatTime(sessionStats.executionTime)}</span>
        <span className="sm:hidden text-build-muted">{formatTime(sessionStats.executionTime)}</span>
      </div>
    </div>
  )

  return (
    <div className="h-12 bg-build-surface border-b border-build-border flex items-center px-2 sm:px-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded hover:bg-tan-100 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-build-muted" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-build-accent" />
          <span className="hidden sm:inline font-mono font-bold text-build-text">Future Builder Studio</span>
          <span className="sm:hidden font-mono font-bold text-build-text">FBS</span>
          <span className="text-xs text-build-muted bg-tan-100 px-2 py-1 rounded font-mono">Pro</span>
        </div>
      </div>

      <div className="flex-1 px-2 sm:px-4">
        {statusIndicators}
      </div>

      <div className="flex items-center space-x-1 sm:space-x-4">
        {/* Progress Indicator */}
        {progressDisplay}

        {/* Session Stats - Responsive */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-build-muted">
          <FileText className="w-3 h-3" />
          <span>{sessionStats.linesWritten} lines</span>
          <span>•</span>
          <Folder className="w-3 h-3" />
          <span>{sessionStats.toolsCreated} tools</span>
        </div>
        
        {/* Mobile Session Stats */}
        <div className="sm:hidden flex items-center space-x-1 text-xs font-mono text-build-muted">
          <FileText className="w-3 h-3" />
          <span>{sessionStats.linesWritten}</span>
          <span>•</span>
          <Folder className="w-3 h-3" />
          <span>{sessionStats.toolsCreated}</span>
        </div>

        {/* Achievement Gallery Button - Responsive */}
        <button
          onClick={onShowAchievements}
          className="flex items-center space-x-1 px-2 sm:px-3 py-1 rounded hover:bg-tan-100 transition-colors"
          title="View Achievements"
        >
          <Award className="w-4 h-4 text-yellow-500" />
          <span className="hidden sm:inline text-sm font-mono text-build-text">
            {achievementCount}
          </span>
          <span className="sm:hidden text-sm font-mono text-build-text">
            {achievementCount}
          </span>
        </button>

        {/* Settings */}
        <button
          className="p-1 rounded hover:bg-tan-100 transition-colors"
          title="IDE Settings"
        >
          <Settings className="w-4 h-4 text-build-muted" />
        </button>
      </div>
    </div>
  )
} 