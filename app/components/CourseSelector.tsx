'use client'

import { Course } from '../types/builderTypes'
import { 
  X, 
  Book, 
  Clock, 
  Trophy,
  Star,
  Lock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface CourseSelectorProps {
  courses: Course[]
  isOpen: boolean
  onClose: () => void
  onSelectCourse: (course: Course) => void
  className?: string
}

export default function CourseSelector({ 
  courses, 
  isOpen, 
  onClose, 
  onSelectCourse,
  className = "" 
}: CourseSelectorProps) {
  if (!isOpen) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-500 bg-red-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data-science': return '📊'
      case 'ai-ml': return '🤖'
      case 'automation': return '⚙️'
      case 'games': return '🎮'
      case 'beginner': return '🌱'
      case 'advanced': return '🚀'
      default: return '📚'
    }
  }

  console.log('CourseSelector render:', { isOpen, coursesCount: courses.length, courses })

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 ${className}`} style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col relative" style={{ zIndex: 10000 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Learning Courses</h1>
              <p className="text-gray-800">Build real tools while learning Python</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Course Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`border rounded-lg p-6 transition-all hover:shadow-lg ${
                  course.isUnlocked
                    ? 'border-gray-200 hover:border-blue-300 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                onClick={() => course.isUnlocked && onSelectCourse(course)}
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(course.category)}</span>
                    <div>
                      <h3 className="font-bold text-lg text-black">{course.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-800 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {!course.isUnlocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : course.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-gray-900 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Progress Bar */}
                {course.isUnlocked && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-800 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Course Rewards */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-black">You'll Learn:</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-900">+{course.rewards.xp} XP</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-900">{course.rewards.tool.name}</span>
                    </div>
                  </div>
                  
                  {/* Lesson Count */}
                  <div className="text-xs text-gray-800">
                    {course.lessons.length} lessons • {course.lessons.filter(l => l.type === 'practice').length} hands-on exercises
                  </div>
                </div>

                {/* Prerequisites */}
                {!course.isUnlocked && course.prerequisites.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Prerequisites Required
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Complete previous achievements to unlock this course
                    </p>
                  </div>
                )}

                {/* Action Button */}
                {course.isUnlocked && (
                  <div className="mt-4">
                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      {course.isCompleted ? 'Review Course' : course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
              <p className="text-gray-600">Courses are being prepared for you. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 