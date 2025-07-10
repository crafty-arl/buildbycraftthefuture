'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { runPythonCode, continueWithInput } from '../utils/python-runner'
import { useBuilderProgress } from '../hooks/useBuilderProgress'
import { useIDEState } from '../hooks/useIDEState'
import { usePythonRuntime } from '../hooks/usePythonRuntime'
import FileExplorer from './FileExplorer'
import MultiTabEditor from './MultiTabEditor'
import AchievementSystem from './AchievementSystem'
import CourseViewer from './CourseViewer'
import LessonPopupWidget from './LessonPopupWidget'
import { LessonValidator, ValidationResult } from '../services/lessonValidator'
import IDEToolbar from './ide/IDEToolbar'
import IDETerminal from './ide/IDETerminal'
import IDELayout from './ide/IDELayout'
import IDELoadingScreen from './ide/IDELoadingScreen'
import { EditorTab, UserTool, Course } from '../types/builderTypes'
import { 
  Award, 
  Code, 
  Terminal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trophy,
  Menu,
  X,
  Book,
  RotateCcw,
  History,
  Play,
  Settings,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Save,
  Folder,
  FileText,
  Cpu,
  Wifi
} from 'lucide-react'

interface GamefiedPythonIDEProps {
  className?: string
}

export default function GamefiedPythonIDE({ className = "" }: GamefiedPythonIDEProps) {
  // Gamification state
  const {
    profile,
    tools,
    achievements,
    currentTabs,
    newlyUnlocked,
    isLoading,
    trackCodingAction,
    saveTool,
    saveCurrentTabs,
    dismissAchievement,
    courses,
    courseProgress,
    completeCourseLesson,
    completeCourse,
    loadCoursesWithUnlockStatus
  } = useBuilderProgress()

  // IDE state management
  const {
    sessionStats,
    terminalState,
    appendToOutput,
    clearTerminal,
    navigateHistory,
    addToHistory,
    setOutput,
    setIsRunning,
    setWaitingForInput,
    setCurrentPrompt,
    setUserInput,
    setReplInput,
    setReplMode,
    updateSessionStats,
    incrementLinesWritten,
    incrementToolsCreated
  } = useIDEState()

  // Python runtime management
  const { pythonStatus, statusMessage, formatTime } = usePythonRuntime()

  // UI state
  const [tabs, setTabs] = useState<EditorTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [showAchievementGallery, setShowAchievementGallery] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Course state (now integrated into sidebar)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCourseViewer, setShowCourseViewer] = useState(false)
  
  // Lesson state (integrated into IDE)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [showLessonWidget, setShowLessonWidget] = useState(false)
  const [lessonWidgetMinimized, setLessonWidgetMinimized] = useState(false)
  const [lessonValidationResult, setLessonValidationResult] = useState<ValidationResult | null>(null)
  
  // Refs
  const isInitializedRef = useRef(false)
  const savingTabsRef = useRef(false)
  const lessonValidatorRef = useRef(new LessonValidator())

  // Track session statistics
  useEffect(() => {
    const interval = setInterval(() => {
      updateSessionStats({
        executionTime: Date.now() - sessionStats.startTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStats.startTime, updateSessionStats])

  // Client-side only flag to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize terminal output and handle Python runtime messages
  useEffect(() => {
    // Set initial terminal message on client-side only
    if (isClient && terminalState.output === '') {
      setOutput('🚀 Future Builder Studio - Python IDE\n✨ Write code in the editor and click Run, or use REPL mode for interactive commands\n📚 Pre-loaded: numpy, pandas, matplotlib, scikit-learn\n💡 Natural input() support - code pauses for user input automatically!\n\n>>> ')
    }
  }, [isClient, terminalState.output, setOutput])

  // Update terminal with Python runtime success message
  useEffect(() => {
    if (pythonStatus === 'ready') {
      setOutput(prev => {
        const hasInitMessage = prev.includes('Python WebAssembly runtime loaded from CDN')
        if (!hasInitMessage) {
          return prev + '\n\n✅ Python WebAssembly runtime loaded from CDN\n📦 Data science packages: numpy, pandas, matplotlib, scikit-learn\n🔧 Ready for professional Python development!'
        }
        return prev
      })
    } else if (pythonStatus === 'error') {
      setOutput(prev => prev + '\n\n❌ Python runtime failed to load from CDN\n🔄 Please refresh the page to retry')
    }
  }, [pythonStatus, setOutput])

  // Memoize default content function
  const getDefaultContent = useCallback((name: string) => {
    if (name === 'welcome_tool') {
      return `# 🚀 Welcome to Future Builder Studio!
# Professional Python IDE with Natural Terminal Input

print("🌟 Welcome to the most advanced Python learning environment!")
print("📚 Check the sidebar for courses and your tool portfolio")
print()

# Natural input flow - just like a real Python terminal
name = input("What's your builder name? ")
print(f"Welcome to the future, {name}! 🌟")

# Try multiple inputs seamlessly
age = input("How old are you? ")
favorite_language = input("What's your favorite programming language? ")

print(f"\\nProfile Created:")
print(f"👤 Name: {name}")
print(f"🎂 Age: {age}")
print(f"💻 Favorite Language: {favorite_language}")

# Interactive menu example
print("\\n🎯 What would you like to build today?")
print("1. Data Analysis Tool")
print("2. Game Project") 
print("3. Web Scraper")
print("4. AI/ML Model")

choice = input("Enter your choice (1-4): ")

if choice == "1":
    print("🔬 Great choice! Data science tools are powerful!")
    print("💡 Try: import pandas as pd; import numpy as np")
elif choice == "2":
    print("🎮 Awesome! Games are fun to build!")
    print("💡 Try: import random for game mechanics")
elif choice == "3":
    print("🕷️ Web scraping opens up data possibilities!")
    print("💡 Try: import requests for web APIs")
elif choice == "4":
    print("🤖 AI/ML is the future of technology!")
    print("💡 Try: import sklearn for machine learning")
else:
    print("🚀 Whatever you choose, the future is yours to build!")

print("\\n✨ Click 'Save as Tool' to add this to your portfolio!")
print("🏆 Start coding to earn XP and unlock achievements!")
`
    }
    
    return `# 🛠️ New Python Tool
# Build something amazing for the future!

def interactive_tool():
    """Your innovative tool starts here."""
    print("Hello, Future Builder! 🚀")
    
    # Try adding some input() calls to test the natural terminal flow
    # Example:
    # user_input = input("Enter something: ")
    # print(f"You entered: {user_input}")
    
if __name__ == "__main__":
    interactive_tool()
`
  }, [])

  // Memoized tab creation function
  const createNewTab = useCallback((name?: string) => {
    const tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const tabName = name || `untitled_${tabs.length + 1}`
    
    const newTab: EditorTab = {
      id: tabId,
      name: tabName,
      content: getDefaultContent(tabName),
      isModified: false,
      isActive: true,
      language: 'python',
      createdAt: new Date().toISOString()
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(tabId)
    
    // Update session stats
    incrementToolsCreated()
  }, [tabs.length, getDefaultContent, incrementToolsCreated])

  // Initialize tabs from saved state - only once
  useEffect(() => {
    if (!isInitializedRef.current && !isLoading) {
      if (currentTabs.length > 0) {
        setTabs(currentTabs)
        const activeTab = currentTabs.find(tab => tab.isActive) || currentTabs[0]
        setActiveTabId(activeTab.id)
      } else {
        // Create initial tab
        const tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const initialTab: EditorTab = {
          id: tabId,
          name: 'welcome_tool',
          content: getDefaultContent('welcome_tool'),
          isModified: false,
          isActive: true,
          language: 'python',
          createdAt: new Date().toISOString()
        }
        setTabs([initialTab])
        setActiveTabId(tabId)
      }
      isInitializedRef.current = true
    }
  }, [currentTabs, isLoading, getDefaultContent])

  // Debounced save function to prevent excessive saves
  const debouncedSave = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (tabsToSave: EditorTab[]) => {
      if (savingTabsRef.current) return
      
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (tabsToSave.length > 0 && isInitializedRef.current) {
          savingTabsRef.current = true
          saveCurrentTabs(tabsToSave)
          setTimeout(() => {
            savingTabsRef.current = false
          }, 100)
        }
      }, 300)
    }
  }, [saveCurrentTabs])

  // Save tabs when they change - with debouncing
  useEffect(() => {
    if (tabs.length > 0 && isInitializedRef.current && !savingTabsRef.current) {
      const updatedTabs = tabs.map(tab => ({
        ...tab,
        isActive: tab.id === activeTabId
      }))
      debouncedSave(updatedTabs)
    }
  }, [tabs, activeTabId, debouncedSave])

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId)
  }, [])

  const handleTabClose = useCallback((tabId: string) => {
    if (tabs.length === 1) return // Don't close the last tab
    
    setTabs(prev => {
      const tabIndex = prev.findIndex(tab => tab.id === tabId)
      const newTabs = prev.filter(tab => tab.id !== tabId)
      
      // If closing active tab, switch to adjacent tab
      if (tabId === activeTabId) {
        const newActiveIndex = tabIndex === 0 ? 0 : tabIndex - 1
        setActiveTabId(newTabs[newActiveIndex]?.id || '')
      }
      
      return newTabs
    })
  }, [activeTabId])

  const handleTabSave = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isModified: false }
        : tab
    ))

    // Update session stats
    const lines = content.split('\n').length
    incrementLinesWritten(lines)
  }, [incrementLinesWritten])

  const toggleReplMode = useCallback(() => {
    setReplMode(!terminalState.replMode)
    if (!terminalState.replMode) {
      // Entering REPL mode
      appendToOutput('\n>>> ')
    } else {
      // Exiting REPL mode
      appendToOutput('\n')
    }
  }, [terminalState.replMode, setReplMode, appendToOutput])

  const handleRunCode = useCallback(async (code: string) => {
    if (!code.trim()) {
      setOutput(prev => `${prev}\n`)
      return
    }

    if (pythonStatus !== 'ready') {
      setOutput(prev => `${prev}\nPython runtime not ready. Status: ${pythonStatus}`)
      return
    }

    setIsRunning(true)
    // Exit REPL mode when running scripts
    if (terminalState.replMode) {
      toggleReplMode()
    }
    appendToOutput('\n')
    
    const startTime = Date.now()
    
    try {
      const result = await runPythonCode(code)
      const executionTime = Date.now() - startTime
      
      if (result.error) {
        // Display raw Python error without formatting
        appendToOutput(result.error)
      } else if (result.waitingForInput) {
        if (result.output) {
          appendToOutput(result.output)
        }
        setWaitingForInput(true)
        setCurrentPrompt(result.prompt || '')
      } else {
        // Display raw output
        if (result.output) {
          appendToOutput(result.output)
        }
      }
      
      // Track coding action for XP
      await trackCodingAction('run_code', { code, executionTime })

      // Run lesson validation if a lesson is active
      if (selectedCourse && showLessonWidget && selectedCourse.lessons[currentLessonIndex]) {
        const currentLesson = selectedCourse.lessons[currentLessonIndex]
        if (currentLesson.type === 'practice' || currentLesson.type === 'challenge') {
          try {
            const validationResult = await lessonValidatorRef.current.validateLesson(
              code,
              currentLesson,
              (action, data) => {
                // Track validation events
                trackCodingAction('lesson_validation', { lessonId: currentLesson.id, action, data })
              }
            )
            setLessonValidationResult(validationResult)

            // Clear and show comprehensive lesson feedback (Codecademy style)
            appendToOutput('\n' + '='.repeat(50))
            appendToOutput('📊 LESSON VALIDATION RESULTS')
            appendToOutput('='.repeat(50))

            // Show test results with detailed feedback
            if (validationResult.testResults.length > 0) {
              appendToOutput('\n🧪 Test Results:')
              validationResult.testResults.forEach((test, index) => {
                const status = test.passed ? '✅' : '❌'
                appendToOutput(`${status} Test ${index + 1}: ${test.description}`)
                if (!test.passed && test.expected !== test.actual) {
                  appendToOutput(`   Expected: ${test.expected}`)
                  appendToOutput(`   Got: ${test.actual}`)
                }
                appendToOutput(`   Points: ${test.earnedPoints}/${test.points}`)
              })
            }

            // Show overall score
            const scorePercent = Math.round((validationResult.score / validationResult.maxScore) * 100)
            appendToOutput(`\n🎯 Overall Score: ${validationResult.score}/${validationResult.maxScore} (${scorePercent}%)`)
            
            if (validationResult.canComplete) {
              appendToOutput('\n🎉 LESSON REQUIREMENTS MET!')
              if (validationResult.xpEarned > 0) {
                appendToOutput(`🌟 XP Earned: ${validationResult.xpEarned}`)
              }
              
              // Auto-complete lesson
              if (!currentLesson.isCompleted) {
                // Mark lesson as completed
                const updatedCourse = {
                  ...selectedCourse,
                  lessons: selectedCourse.lessons.map((lesson, index) => 
                    index === currentLessonIndex 
                      ? { ...lesson, isCompleted: true }
                      : lesson
                  )
                }
                setSelectedCourse(updatedCourse)
                
                // Track lesson completion
                await trackCodingAction('lesson_complete', { 
                  lessonId: currentLesson.id, 
                  score: validationResult.score,
                  xpEarned: validationResult.xpEarned
                })
                
                appendToOutput('\n✨ Lesson completed! Great work!')
                
                // Check if course is complete
                const completedLessons = updatedCourse.lessons.filter(l => l.isCompleted).length
                if (completedLessons === updatedCourse.lessons.length) {
                  appendToOutput(`\n🏆 COURSE COMPLETED! "${updatedCourse.title}" finished!`)
                  appendToOutput(`🛠️ New tool unlocked: ${updatedCourse.rewards.tool.name}`)
                  appendToOutput(`🌟 Total course XP: +${updatedCourse.rewards.xp}`)
                } else {
                  appendToOutput('\n📚 Ready for the next lesson! Click on Lesson ' + (currentLessonIndex + 2) + ' in the widget.')
                }
              }
            } else {
              appendToOutput('\n❌ Lesson requirements not met yet.')
              appendToOutput(`Need ${Math.ceil(70 - scorePercent)}% more to pass this lesson.`)
              
              // Show helpful feedback
              if (validationResult.feedback.length > 0) {
                appendToOutput('\n💬 Feedback:')
                validationResult.feedback.forEach(feedback => {
                  appendToOutput(`   ${feedback}`)
                })
              }

              if (validationResult.suggestions.length > 0) {
                appendToOutput('\n💡 Suggestions:')
                validationResult.suggestions.forEach(suggestion => {
                  appendToOutput(`   ${suggestion}`)
                })
              }
              
              appendToOutput('\n📝 Keep coding! You\'re making progress.')
            }

            appendToOutput('\n' + '='.repeat(50))
            
          } catch (validationError) {
            appendToOutput(`\n❌ Validation error: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`)
          }
        } else {
          // For theory lessons, just show completion
          appendToOutput('\n📚 Theory lesson - read the content in the lesson widget!')
        }
      }
      
    } catch (error) {
      // Display raw system error
      appendToOutput(error instanceof Error ? error.message : String(error))
    } finally {
      setIsRunning(false)
    }
  }, [trackCodingAction, pythonStatus, setIsRunning, terminalState.replMode, toggleReplMode, 
    appendToOutput, setWaitingForInput, setCurrentPrompt])

  const handleUserInput = useCallback(async (inputValue: string) => {
    if (!terminalState.waitingForInput) return

    // First, display the user's input inline in the terminal (like a real Python terminal)
    setOutput(prev => prev + inputValue + '\n')
    
    // Clear the input field and stop waiting for input
    setUserInput('')
    setWaitingForInput(false)
    setCurrentPrompt('')
    
    try {
      const result = await continueWithInput(inputValue)
      
      if (result.error) {
        appendToOutput(result.error)
      } else if (result.waitingForInput) {
        // Show the output first, then show the new prompt
        if (result.output) {
          appendToOutput(result.output)
        }
        setWaitingForInput(true)
        setCurrentPrompt(result.prompt || '')
      } else {
        // Show final output
        if (result.output) {
          appendToOutput(result.output)
        }
      }
    } catch (error) {
      appendToOutput(error instanceof Error ? error.message : String(error))
    }
      }, [terminalState.waitingForInput, setOutput, setUserInput, setWaitingForInput, setCurrentPrompt, appendToOutput])

  const handleReplCommand = useCallback(async (command: string) => {
    if (!command.trim()) return

    if (pythonStatus !== 'ready') {
      appendToOutput(`Python runtime not ready. Status: ${pythonStatus}\n`)
      return
    }

    // Add to history
    addToHistory(command)
    
    // Display the command inline (like a real Python REPL)
    setOutput(prev => prev + `>>> ${command}\n`)
    setReplInput('')
    
    try {
      const result = await runPythonCode(command)
      
      if (result.error) {
        appendToOutput(result.error)
      } else if (result.waitingForInput) {
        if (result.output) {
          appendToOutput(result.output)
        }
        setWaitingForInput(true)
        setCurrentPrompt(result.prompt || '')
        // Exit REPL when waiting for input
        if (terminalState.replMode) {
          toggleReplMode()
        }
      } else {
        if (result.output && result.output.trim()) {
          appendToOutput(result.output)
        }
      }
    } catch (error) {
      appendToOutput(error instanceof Error ? error.message : String(error))
    }
  }, [pythonStatus, addToHistory, setOutput, setReplInput, appendToOutput, setWaitingForInput, setCurrentPrompt, terminalState.replMode, toggleReplMode])

  const handleSaveAsTool = useCallback((content: string, tabName: string) => {
    const toolName = tabName.replace('.py', '').replace(/[^a-zA-Z0-9_]/g, '_')
    
    // Determine category based on content analysis
    let category: UserTool['category'] = 'beginner'
    const codeContent = content.toLowerCase()
    
    if (codeContent.includes('pandas') || codeContent.includes('numpy') || codeContent.includes('matplotlib') || codeContent.includes('seaborn')) {
      category = 'data-science'
    } else if (codeContent.includes('sklearn') || codeContent.includes('tensorflow') || codeContent.includes('torch') || codeContent.includes('machine learning')) {
      category = 'ai-ml'
    } else if (codeContent.includes('requests') || codeContent.includes('selenium') || codeContent.includes('schedule') || codeContent.includes('automation')) {
      category = 'automation'
    } else if (codeContent.includes('pygame') || codeContent.includes('tkinter') || codeContent.includes('game') || codeContent.includes('gui')) {
      category = 'games'
    } else if (codeContent.includes('os.') || codeContent.includes('sys.') || codeContent.includes('file') || codeContent.includes('utility')) {
      category = 'utilities'
    }

    const tool = saveTool({
      name: toolName,
      description: `Professional tool created in Future Builder Studio`,
      category,
      code: content,
      tags: [],
      isPublic: false
    })

    appendToOutput(`\n✅ Tool "${tool.name}" saved to your portfolio! 🎉\n📁 Category: ${category}\n🏆 Check your file explorer to see it listed`)
  }, [saveTool, appendToOutput])

  const handleToolSelect = useCallback((tool: UserTool) => {
    // Check if tool is already open in a tab
    const existingTab = tabs.find(tab => tab.toolId === tool.id)
    
    if (existingTab) {
      setActiveTabId(existingTab.id)
    } else {
      // Create new tab for the tool
      const tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newTab: EditorTab = {
        id: tabId,
        toolId: tool.id,
        name: tool.name,
        content: tool.code,
        isModified: false,
        isActive: true,
        language: 'python',
        createdAt: new Date().toISOString()
      }

      setTabs(prev => [...prev, newTab])
      setActiveTabId(tabId)
    }
  }, [tabs])

  const handleCourseSelect = useCallback((course: Course) => {
    setSelectedCourse(course)
    setCurrentLessonIndex(0)
    setShowLessonWidget(true)
    setLessonWidgetMinimized(false)
    setLessonValidationResult(null)
    
    // Load lesson code template if available
    const firstLesson = course.lessons[0]
    if (firstLesson && firstLesson.codeTemplate) {
      // Create a new tab for the lesson
      const tabId = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const lessonTab: EditorTab = {
        id: tabId,
        name: `${course.title} - ${firstLesson.title}`,
        content: firstLesson.codeTemplate,
        isModified: false,
        isActive: true,
        language: 'python',
        createdAt: new Date().toISOString()
      }
      
      setTabs(prev => [...prev, lessonTab])
      setActiveTabId(tabId)
    }
    
    appendToOutput(`\n📚 Started course: "${course.title}"\n🎯 Lesson 1: ${firstLesson?.title}\n💡 Use the lesson widget to track your progress!\n`)
  }, [appendToOutput])

  const handleCloseCourseViewer = useCallback(() => {
    setShowCourseViewer(false)
    setSelectedCourse(null)
  }, [])

  const handleLessonChange = useCallback((newLessonIndex: number) => {
    if (!selectedCourse) return
    
    setCurrentLessonIndex(newLessonIndex)
    setLessonValidationResult(null)
    
    const newLesson = selectedCourse.lessons[newLessonIndex]
    if (newLesson && newLesson.codeTemplate) {
      // Create a new tab for the lesson or update existing lesson tab
      const tabId = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const lessonTab: EditorTab = {
        id: tabId,
        name: `${selectedCourse.title} - ${newLesson.title}`,
        content: newLesson.codeTemplate,
        isModified: false,
        isActive: true,
        language: 'python',
        createdAt: new Date().toISOString()
      }
      
      setTabs(prev => [...prev, lessonTab])
      setActiveTabId(tabId)
    }
    
    appendToOutput(`\n📚 Lesson ${newLessonIndex + 1}: ${newLesson?.title}\n`)
  }, [selectedCourse, appendToOutput])

  const handleCloseLessonWidget = useCallback(() => {
    setShowLessonWidget(false)
    setSelectedCourse(null)
    setLessonValidationResult(null)
  }, [])

  const handleMinimizeLessonWidget = useCallback(() => {
    setLessonWidgetMinimized(!lessonWidgetMinimized)
  }, [lessonWidgetMinimized])

  const handleCourseComplete = useCallback(async (courseId: string) => {
    const newTool = await completeCourse(courseId)
    if (newTool) {
      setOutput(prev => `${prev}\n\n🎉 COURSE COMPLETED! 🎉\n"${selectedCourse?.title}" finished successfully!\n🛠️ New tool "${newTool.name}" added to your portfolio!\n+${selectedCourse?.rewards.xp || 0} XP earned!\n`)
      
      // Expand terminal to show completion message
      // toggleTerminal() // Removed as per edit hint
      
      // Reload course status
      loadCoursesWithUnlockStatus()
    }
  }, [completeCourse, selectedCourse, loadCoursesWithUnlockStatus, setOutput, // toggleTerminal // Removed as per edit hint
    ])

  // Memoize achievement count to prevent unnecessary re-renders
  const achievementCount = useMemo(() => 
    achievements.filter(a => a.unlocked).length
  , [achievements])

  if (isLoading || !isClient) {
    return <IDELoadingScreen />
  }

  return (
    <div className={`h-full bg-build-surface flex flex-col ${className}`}>
      {/* IDE Layout */}
      <IDELayout
        sidebar={
          <FileExplorer
            profile={profile}
            tools={tools}
            achievements={achievements}
            courses={courses}
            onToolSelect={handleToolSelect}
            onNewTool={createNewTab}
            onCourseSelect={handleCourseSelect}
            activeCourse={showLessonWidget ? selectedCourse : null}
            currentLessonIndex={currentLessonIndex}
            className="h-full"
          />
        }
        editor={
          <MultiTabEditor
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            onTabSave={handleTabSave}
            onNewTab={createNewTab}
            onRunCode={handleRunCode}
            onSaveAsTool={handleSaveAsTool}
            isRunning={terminalState.isRunning}
            className="h-full"
          />
        }
        showTerminal={false}
      />

      {/* Achievement System */}
      <AchievementSystem
        newlyUnlocked={newlyUnlocked}
        onDismiss={dismissAchievement}
        allAchievements={achievements}
        showGallery={showAchievementGallery}
        onCloseGallery={() => setShowAchievementGallery(false)}
      />

      {/* Course Viewer (when course selected from sidebar) */}
      <CourseViewer
        course={selectedCourse}
        isOpen={showCourseViewer}
        onClose={handleCloseCourseViewer}
        onComplete={completeCourseLesson}
        onCourseComplete={handleCourseComplete}
      />

      {/* Lesson Popup Widget (integrated lesson experience) */}
      {showLessonWidget && (
        <LessonPopupWidget
          course={selectedCourse}
          currentLesson={selectedCourse?.lessons[currentLessonIndex] || null}
          currentLessonIndex={currentLessonIndex}
          validationResult={lessonValidationResult}
          onLessonChange={handleLessonChange}
          onClose={handleCloseLessonWidget}
          onMinimize={handleMinimizeLessonWidget}
          isMinimized={lessonWidgetMinimized}
        />
      )}
    </div>
  )
} 