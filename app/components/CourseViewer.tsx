'use client'

import { useState, useEffect, useCallback } from 'react'
import { Course, CourseLesson } from '../types/builderTypes'
import { 
  X, 
  Play, 
  CheckCircle, 
  Circle, 
  Book, 
  Code, 
  Trophy,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Lightbulb
} from 'lucide-react'
import { runPythonCode } from '../utils/python-runner'
import { LessonValidator, ValidationResult } from '../services/lessonValidator'

interface CourseViewerProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onComplete: (courseId: string, lessonId: string) => void
  onCourseComplete: (courseId: string) => void
  className?: string
}

export default function CourseViewer({ 
  course, 
  isOpen, 
  onClose, 
  onComplete, 
  onCourseComplete,
  className = "" 
}: CourseViewerProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [userCode, setUserCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [validator] = useState(() => new LessonValidator())

  const currentLesson = course?.lessons[currentLessonIndex]

  // Initialize code when lesson changes
  useEffect(() => {
    if (currentLesson?.codeTemplate) {
      setUserCode(currentLesson.codeTemplate)
    }
    setOutput('')
    setShowHints(false)
    setShowSolution(false)
    setValidationResult(null)
  }, [currentLesson])

  const handleRunCode = useCallback(async () => {
    if (!userCode.trim()) return

    setIsRunning(true)
    setOutput('Running code...\n')
    setValidationResult(null)
    
    try {
      // Run the code
      const result = await runPythonCode(userCode)
      const output = result.error ? `Error: ${result.error}` : result.output
      setOutput(output)

      // Validate the lesson if it has expected outcomes
      if (currentLesson && (currentLesson.type === 'practice' || currentLesson.type === 'challenge')) {
        const validationResult = await validator.validateLesson(
          userCode, 
          currentLesson,
          (action, data) => {
            // Track validation events
            console.log(`Validation: ${action}`, data)
          }
        )
        setValidationResult(validationResult)

        // Add validation feedback to output
        if (validationResult.feedback.length > 0) {
          setOutput(prev => prev + '\n\n📊 Lesson Validation:\n' + validationResult.feedback.join('\n'))
        }

        if (validationResult.suggestions.length > 0) {
          setOutput(prev => prev + '\n\n💡 Suggestions:\n' + validationResult.suggestions.join('\n'))
        }

        // Show test results if available
        if (validationResult.testResults.length > 0) {
          setOutput(prev => prev + '\n\n🧪 Test Results:')
          validationResult.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌'
            setOutput(prev => prev + `\n${status} ${test.description} (${test.earnedPoints}/${test.points} points)`)
          })
        }

        // Show score
        setOutput(prev => prev + `\n\n🎯 Score: ${validationResult.score}/${validationResult.maxScore}`)
        if (validationResult.xpEarned > 0) {
          setOutput(prev => prev + `\n🌟 XP Earned: ${validationResult.xpEarned}`)
        }
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRunning(false)
    }
  }, [userCode, currentLesson, validator])

  const handleCompleteLesson = useCallback(() => {
    if (!course || !currentLesson) return

    // Check if validation is required and passed
    if (currentLesson.type === 'practice' || currentLesson.type === 'challenge') {
      if (!validationResult || !validationResult.canComplete) {
        setOutput(prev => prev + '\n\n❌ You must complete the lesson requirements before proceeding.\n💡 Make sure your code meets all the expected outcomes!')
        return
      }
    }

    onComplete(course.id, currentLesson.id)
    
    // Check if this was the last lesson
    const isLastLesson = currentLessonIndex === course.lessons.length - 1
    if (isLastLesson) {
      // Course completed!
      onCourseComplete(course.id)
      setOutput(prev => `${prev}\n\n🎉 COURSE COMPLETED! 🎉\nYou've unlocked the ${course.rewards.tool.name} tool!\n+${course.rewards.xp} XP earned!`)
    } else {
      // Move to next lesson
      setCurrentLessonIndex(prev => prev + 1)
    }
  }, [course, currentLesson, currentLessonIndex, validationResult, onComplete, onCourseComplete])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setOutput(prev => `${prev}\n📋 Code copied to clipboard!`)
    } catch (error) {
      setOutput(prev => `${prev}\n❌ Failed to copy to clipboard`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'hard': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getLessonIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />
    
    switch (type) {
      case 'theory': return <Book className="w-5 h-5 text-blue-500" />
      case 'practice': return <Code className="w-5 h-5 text-purple-500" />
      case 'challenge': return <Trophy className="w-5 h-5 text-yellow-500" />
      default: return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  console.log('CourseViewer render:', { isOpen, course: course?.title })

  if (!isOpen || !course) return null

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 ${className}`} style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">{course.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-800 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.estimatedTime}
                </span>
                <span className="text-sm text-gray-800">
                  {course.lessons.filter(l => l.isCompleted).length} / {course.lessons.length} completed
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Lesson Navigation */}
          <div className="w-80 border-r border-gray-200 bg-gray-50">
            <div className="p-4">
              <h3 className="font-semibold text-black mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentLessonIndex
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getLessonIcon(lesson.type, lesson.isCompleted)}
                      <div className="flex-1">
                        <div className="font-medium text-sm text-black">{lesson.title}</div>
                        <div className="text-xs text-gray-800 capitalize">{lesson.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Rewards */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="font-semibold text-black mb-2">Course Rewards</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>+{course.rewards.xp} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span>{course.rewards.tool.name}</span>
                </div>
                {course.rewards.achievement && (
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span>Achievement Unlock</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">{currentLesson?.title}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentLessonIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentLessonIndex === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentLessonIndex(prev => Math.min(course.lessons.length - 1, prev + 1))}
                      disabled={currentLessonIndex === course.lessons.length - 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="prose prose-blue max-w-none mb-6">
                  <div 
                    className="text-black leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: currentLesson?.content.replace(/\n/g, '<br>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>') || ''
                    }} 
                  />
                </div>

                {/* Code Editor for Practice/Challenge Lessons */}
                {(currentLesson?.type === 'practice' || currentLesson?.type === 'challenge') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-black">Code Editor</h3>
                      <div className="flex items-center space-x-2">
                        {currentLesson.hints && (
                          <button
                            onClick={() => setShowHints(!showHints)}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                          >
                            <Lightbulb className="w-4 h-4" />
                            <span>Hints</span>
                          </button>
                        )}
                        <button
                          onClick={() => copyToClipboard(userCode)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={handleRunCode}
                          disabled={isRunning}
                          className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Code Editor */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border-none outline-none resize-none"
                        placeholder="Write your Python code here..."
                      />
                    </div>

                    {/* Hints */}
                    {showHints && currentLesson.hints && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">💡 Hints:</h4>
                        <ul className="space-y-1">
                          {currentLesson.hints.map((hint, index) => (
                            <li key={index} className="text-yellow-700 text-sm">• {hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Output */}
                    {output && (
                      <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Output:</span>
                        </div>
                        <pre className="whitespace-pre-wrap">{output}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Validation Status */}
                {validationResult && (
                  <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Validation Results</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          validationResult.canComplete ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {validationResult.score}% Complete
                        </span>
                        {validationResult.canComplete && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                    </div>
                    
                    {validationResult.testResults.length > 0 && (
                      <div className="space-y-1 text-sm">
                        {validationResult.testResults.map((test, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {test.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                            <span className={test.passed ? 'text-green-700' : 'text-red-700'}>
                              {test.description} ({test.earnedPoints}/{test.points} points)
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

                {/* Lesson Completion */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800">
                      Lesson {currentLessonIndex + 1} of {course.lessons.length}
                    </div>
                    <button
                      onClick={handleCompleteLesson}
                      disabled={
                        currentLesson?.isCompleted || 
                        ((currentLesson?.type === 'practice' || currentLesson?.type === 'challenge') && 
                         (!validationResult || !validationResult.canComplete))
                      }
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        currentLesson?.isCompleted
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : (currentLesson?.type === 'practice' || currentLesson?.type === 'challenge') && 
                            (!validationResult || !validationResult.canComplete)
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {currentLesson?.isCompleted 
                        ? 'Completed ✓' 
                        : (currentLesson?.type === 'practice' || currentLesson?.type === 'challenge') && 
                          (!validationResult || !validationResult.canComplete)
                        ? 'Complete Requirements First'
                        : 'Complete Lesson'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 