'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  X,
  Sparkles,
  Award,
  Crown,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Achievement, AchievementRarity } from '../types/builderTypes'

interface AchievementSystemProps {
  newlyUnlocked: Achievement | null
  onDismiss: () => void
  allAchievements: Achievement[]
  showGallery?: boolean
  onCloseGallery?: () => void
}

export default function AchievementSystem({
  newlyUnlocked,
  onDismiss,
  allAchievements,
  showGallery = false,
  onCloseGallery
}: AchievementSystemProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const achievementsPerPage = 8

  useEffect(() => {
    if (newlyUnlocked) {
      setShowCelebration(true)
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [newlyUnlocked])

  const handleDismiss = () => {
    setShowCelebration(false)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-yellow-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBorderColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400'
      case 'rare': return 'border-blue-400'
      case 'epic': return 'border-purple-400'
      case 'legendary': return 'border-yellow-400'
      default: return 'border-gray-400'
    }
  }

  const getRarityIcon = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />
      case 'rare': return <Trophy className="w-4 h-4" />
      case 'epic': return <Award className="w-4 h-4" />
      case 'legendary': return <Crown className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const unlockedAchievements = allAchievements.filter(a => a.unlocked)
  const lockedAchievements = allAchievements.filter(a => !a.unlocked)
  
  const totalPages = Math.ceil(allAchievements.length / achievementsPerPage)
  const currentAchievements = allAchievements.slice(
    currentPage * achievementsPerPage,
    (currentPage + 1) * achievementsPerPage
  )

  return (
    <>
      {/* Achievement Unlock Celebration */}
      <AnimatePresence>
        {showCelebration && newlyUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 300
                }
              }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Celebration Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-build-accent/20 to-python-blue/20 rounded-2xl blur-xl" />
              
              {/* Achievement Card */}
              <div className="relative bg-build-surface border-2 border-build-accent rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                {/* Sparkles Animation */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ 
                        opacity: 0,
                        x: Math.random() * 300,
                        y: Math.random() * 200,
                        scale: 0
                      }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: [0, -50, -100],
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-build-accent" />
                    </motion.div>
                  ))}
                </div>

                {/* Close Button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-tan-100 transition-colors"
                >
                  <X className="w-5 h-5 text-build-muted" />
                </button>

                {/* Content */}
                <div className="space-y-6 text-center">
                  {/* Header */}
                  <div className="space-y-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="flex justify-center"
                    >
                      <div className={`p-4 rounded-full bg-gradient-to-br ${getRarityColor(newlyUnlocked.rarity)} text-white`}>
                        <Zap className="w-8 h-8" />
                      </div>
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-build-text"
                    >
                      Achievement Unlocked!
                    </motion.h2>
                  </div>

                  {/* Achievement Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-4xl">{newlyUnlocked.icon}</span>
                      <div className="text-left">
                        <div className="text-xl font-bold text-build-text">
                          {newlyUnlocked.name}
                        </div>
                        <div className={`text-sm font-mono flex items-center space-x-1 ${getRarityColor(newlyUnlocked.rarity).replace('from-', 'text-').replace(' to-gray-600', '').replace(' to-blue-600', '').replace(' to-purple-600', '').replace(' to-yellow-600', '')}`}>
                          {getRarityIcon(newlyUnlocked.rarity)}
                          <span className="capitalize">{newlyUnlocked.rarity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-build-muted text-center">
                      {newlyUnlocked.description}
                    </p>
                    
                    <div className="bg-tan-50 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Trophy className="w-5 h-5 text-build-accent" />
                        <span className="text-lg font-bold text-build-accent">
                          +{newlyUnlocked.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleDismiss}
                    className="w-full bg-build-accent text-white px-6 py-3 rounded-lg font-mono font-semibold hover:bg-build-accent/90 transition-colors"
                  >
                    Continue Building
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={onCloseGallery}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-build-surface border border-build-border rounded-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-build-border bg-gradient-to-r from-build-accent/5 to-python-blue/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-build-text">Achievement Gallery</h2>
                    <p className="text-build-muted font-mono mt-1">
                      {unlockedAchievements.length} / {allAchievements.length} unlocked
                    </p>
                  </div>
                  <button
                    onClick={onCloseGallery}
                    className="p-2 rounded-full hover:bg-tan-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-build-muted" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-tan-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-build-accent to-python-blue h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(unlockedAchievements.length / allAchievements.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Achievement Grid */}
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.unlocked
                          ? `${getRarityBorderColor(achievement.rarity)} bg-gradient-to-br ${getRarityColor(achievement.rarity)}/10`
                          : 'border-tan-200 bg-tan-50 opacity-60'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                          {achievement.unlocked ? achievement.icon : '🔒'}
                        </div>
                        <div className="space-y-1">
                          <div className={`text-sm font-bold ${achievement.unlocked ? 'text-build-text' : 'text-build-muted'}`}>
                            {achievement.name}
                          </div>
                          <div className="text-xs text-build-muted">
                            {achievement.description}
                          </div>
                          <div className={`text-xs font-mono flex items-center justify-center space-x-1 ${
                            achievement.unlocked ? 'text-build-accent' : 'text-build-muted'
                          }`}>
                            {getRarityIcon(achievement.rarity)}
                            <span>+{achievement.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-build-border bg-tan-50/30">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="p-2 rounded-lg hover:bg-tan-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm font-mono text-build-muted">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="p-2 rounded-lg hover:bg-tan-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 