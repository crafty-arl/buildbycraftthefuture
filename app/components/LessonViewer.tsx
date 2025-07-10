'use client'

import { useState } from 'react'
import { X, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { Lesson } from '../data/lessons'

interface LessonViewerProps {
  lesson: any // Temporarily use any to avoid type errors
  onClose: () => void
}

export default function LessonViewer({ lesson, onClose }: LessonViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  
  const currentSlide = lesson.slides[currentSlideIndex]

  const nextSlide = () => {
    if (currentSlideIndex < lesson.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const getSlideIcon = (type: string) => {
    switch (type) {
      case 'intro': return '🚀'
      case 'concept': return '🔧'
      case 'practice': return '⚡'
      case 'summary': return '🎯'
      default: return '▊'
    }
  }

  const getSlideColor = (type: string) => {
    switch (type) {
      case 'intro': return 'border-l-build-accent bg-build-accent/5'
      case 'concept': return 'border-l-minimal-green bg-minimal-green/5'
      case 'practice': return 'border-l-build-pink-neon bg-build-pink/5'
      case 'summary': return 'border-l-minimal-purple bg-minimal-purple/5'
      default: return 'border-l-build-border bg-build-surface/50'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-build-bg rounded-xl modal-mobile w-full flex flex-col border border-build-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-build-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-build-text font-mono truncate">{lesson.title}</h2>
            <p className="text-build-muted mt-1 text-sm sm:text-base truncate">{lesson.description}</p>
            <div className="flex items-center space-x-2 sm:space-x-4 mt-2 text-xs sm:text-sm text-build-muted font-mono">
              <span>{lesson.difficulty}</span>
              <span>•</span>
              <span>{lesson.time}</span>
              <span>•</span>
              <span className="hidden sm:inline">{lesson.slides.length} modules</span>
              <span className="sm:hidden">{lesson.slides.length}m</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tan-100 rounded-lg transition-colors touch-target flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-build-muted hover:text-build-text" />
          </button>
        </div>

        {/* Slide Navigation */}
        <div className="bg-tan-50/50 border-b border-build-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-build-surface hover:bg-tan-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-build-text font-mono border border-build-border text-sm touch-target"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs sm:text-sm text-build-muted font-mono">
              {currentSlideIndex + 1} of {lesson.slides.length}
            </span>
            <div className="flex space-x-1">
              {lesson.slides?.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors touch-target ${
                    index === currentSlideIndex ? 'bg-build-accent orange-glow' : 'bg-tan-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === lesson.slides.length - 1}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-build-pink-neon hover:bg-build-pink disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors font-mono font-medium text-sm touch-target"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`h-full p-4 sm:p-6 ${getSlideColor(currentSlide.type)} border-l-4`}>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">{getSlideIcon(currentSlide.type)}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-build-text font-mono">{currentSlide.title}</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {currentSlide.content?.map((line: string, index: number) => {
                if (line.startsWith('•')) {
                  return (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <span className="text-build-accent mt-1 font-mono">▊</span>
                      <span className="text-build-text text-base sm:text-lg leading-relaxed">{line.slice(1).trim()}</span>
                    </div>
                  )
                }
                return <p key={index} className="text-build-text text-base sm:text-lg leading-relaxed">{line}</p>
              })}
            </div>

            {currentSlide.code && (
              <div className="mb-4 sm:mb-6">
                <div className="bg-tan-50 text-build-text p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto border border-tan-200">
                  <pre>{currentSlide.code}</pre>
                </div>
              </div>
            )}

            {currentSlide.isInteractive && (
              <div className="bg-build-pink/10 border border-build-pink/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 pink-glow">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-build-pink-neon">⚡</span>
                  <span className="font-semibold text-build-pink-neon font-mono text-sm sm:text-base">Build Time</span>
                </div>
                <p className="text-build-text mb-3 text-sm sm:text-base">
                  Ready to build? This module includes hands-on coding with interactive input support in the lesson IDE.
                </p>
                <a 
                  href="/learn"
                  className="inline-flex items-center space-x-1 bg-build-accent text-white px-3 sm:px-4 py-2 rounded hover:bg-build-accent-dark transition-colors font-mono font-medium text-sm sm:text-base touch-target"
                >
                  <span>Launch Lesson IDE</span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-build-border px-4 sm:px-6 py-3 sm:py-4 bg-tan-50/50">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-build-muted font-mono">
              Module {currentSlideIndex + 1} of {lesson.slides.length}
            </div>
            <a 
              href="/learn"
              className="flex items-center space-x-1 bg-build-pink-neon text-white px-3 sm:px-4 py-2 rounded hover:bg-build-pink transition-colors font-mono font-medium pink-glow text-sm sm:text-base touch-target"
            >
              <span>Start Building</span>
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 