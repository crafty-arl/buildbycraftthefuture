'use client'

import { useState } from 'react'
import { Course } from '../types/builderTypes'
import { Play, Book, Target } from 'lucide-react'

interface QuickStartDemoProps {
  courses: Course[]
  onStartLesson: (course: Course) => void
  className?: string
}

export default function QuickStartDemo({ 
  courses, 
  onStartLesson, 
  className = "" 
}: QuickStartDemoProps) {
  const [showDemo, setShowDemo] = useState(true)

  const pythonFundamentalsCourse = courses.find(c => c.id === 'python-fundamentals')

  if (!showDemo || !pythonFundamentalsCourse) return null

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Book className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">🚀 Start Your Python Journey!</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Learn Python with interactive lessons and instant feedback. Your code is validated automatically just like Codecademy!
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>4 lessons</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⏱️</span>
              <span>30 minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🏆</span>
              <span>+300 XP</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDemo(false)}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          ×
        </button>
      </div>
      
      <div className="mt-3 flex items-center space-x-2">
        <button
          onClick={() => onStartLesson(pythonFundamentalsCourse)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Play className="w-4 h-4" />
          <span>Start Learning Python</span>
        </button>
        <div className="text-xs text-gray-500">
          ✨ Beginner-friendly with step-by-step guidance
        </div>
      </div>
    </div>
  )
} 