'use client'

import { useState, useEffect } from 'react'
import { CourseLesson, Course } from '../types/builderTypes'
import { ValidationResult } from '../services/lessonValidator'
import { 
  X, 
  CheckCircle, 
  Circle, 
  Book, 
  Code, 
  Trophy,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Target,
  Award,
  Minimize2,
  Maximize2
} from 'lucide-react'

interface LessonPopupWidgetProps {
  course: Course | null
  currentLesson: CourseLesson | null
  currentLessonIndex: number
  validationResult: ValidationResult | null
  onLessonChange: (index: number) => void
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
  className?: string
}

export default function LessonPopupWidget({
  course,
  currentLesson,
  currentLessonIndex,
  validationResult,
  onLessonChange,
  onClose,
  onMinimize,
  isMinimized,
  className = ""
}: LessonPopupWidgetProps) {
  const [activeTab, setActiveTab] = useState<'lesson' | 'progress' | 'hints'>('lesson')

  if (!course || !currentLesson) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'hard': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-800'
      case 'practice': return 'bg-green-100 text-green-800'
      case 'challenge': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const completedLessons = course.lessons.filter(l => l.isCompleted).length
  const progressPercent = (completedLessons / course.lessons.length) * 100

  if (isMinimized) {
    return (
      <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border-2 border-blue-200 z-50 ${className}`}>
        <div className="p-3 flex items-center space-x-2">
          <Book className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-800">
            {currentLesson.title}
          </span>
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Maximize2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed top-4 right-4 w-96 bg-white rounded-lg shadow-xl border-2 border-blue-200 z-50 max-h-[80vh] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-800">{course.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className={`font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty.toUpperCase()}
                </span>
                <span>•</span>
                <span>{completedLessons}/{course.lessons.length} lessons</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onMinimize}
              className="p-1 hover:bg-blue-100 rounded"
            >
              <Minimize2 className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Course Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'lesson'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📚 Lesson
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'progress'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🎯 Progress
        </button>
        <button
          onClick={() => setActiveTab('hints')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'hints'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          💡 Hints
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === 'lesson' && (
          <div className="space-y-4">
            {/* Current Lesson Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${getLessonTypeColor(currentLesson.type)}`}>
                  {currentLesson.type.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">
                  {currentLessonIndex + 1} of {course.lessons.length}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onLessonChange(Math.max(0, currentLessonIndex - 1))}
                  disabled={currentLessonIndex === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onLessonChange(Math.min(course.lessons.length - 1, currentLessonIndex + 1))}
                  disabled={currentLessonIndex === course.lessons.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Title */}
            <h4 className="font-semibold text-gray-800">{currentLesson.title}</h4>

            {/* Lesson Content */}
            <div className="text-sm text-gray-700 leading-relaxed">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: currentLesson.content
                    .replace(/\n/g, '<br>')
                    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
                }} 
              />
            </div>

            {/* Lesson Objectives */}
            {currentLesson.expectedOutcomes && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Objectives
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {currentLesson.expectedOutcomes.containsKeywords && (
                    <li>• Use: {currentLesson.expectedOutcomes.containsKeywords.join(', ')}</li>
                  )}
                  {currentLesson.expectedOutcomes.output && (
                    <li>• Output: &quot;{String(currentLesson.expectedOutcomes?.output || 'N/A')}&quot;</li>
                  )}
                  {currentLesson.expectedOutcomes.testCases && (
                    <li>• Complete {currentLesson.expectedOutcomes.testCases.length} test cases</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* Validation Results */}
            {validationResult && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800">Current Progress</h5>
                  <span className={`text-sm font-medium ${
                    validationResult.canComplete ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {validationResult.score}%
                  </span>
                </div>
                
                {validationResult.testResults.length > 0 && (
                  <div className="space-y-2">
                    {validationResult.testResults.map((test, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {test.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${test.passed ? 'text-green-700' : 'text-gray-600'}`}>
                          {test.description}
                        </span>
                        <span className="text-xs text-gray-500">
                          {test.earnedPoints}/{test.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.xpEarned > 0 && (
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    🌟 XP Earned: {validationResult.xpEarned}
                  </div>
                )}
              </div>
            )}

            {/* All Lessons Progress */}
            <div className="space-y-2">
              <h5 className="font-medium text-gray-800">All Lessons</h5>
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonChange(index)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    index === currentLessonIndex
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {lesson.isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-800">
                      {lesson.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Course Rewards */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Course Rewards
              </h5>
              <div className="space-y-1 text-sm text-yellow-700">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>+{course.rewards.xp} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>{course.rewards.tool.name}</span>
                </div>
                {course.rewards.achievement && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Achievement Unlock</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4">
            {currentLesson.hints && currentLesson.hints.length > 0 ? (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-800 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                  Helpful Hints
                </h5>
                {currentLesson.hints.map((hint, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">💡 {hint}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No hints available for this lesson.</p>
                <p className="text-xs mt-1">Try running your code to get feedback!</p>
              </div>
            )}

            {/* Validation Suggestions */}
            {validationResult && validationResult.suggestions.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-800 flex items-center">
                  <Target className="w-4 h-4 mr-1 text-blue-500" />
                  Suggestions
                </h5>
                {validationResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 