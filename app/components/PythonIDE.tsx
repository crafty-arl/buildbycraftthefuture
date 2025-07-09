'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Play, RotateCcw, Terminal, ChevronLeft, ChevronRight, Home, ArrowLeft, ArrowRight, Loader, Book, Layers, X } from 'lucide-react'
import { Course, Module, Slide, courses } from '../data/lessons'

// Dynamically import python-runner to avoid SSR issues
const usePythonRunner = () => {
  const [pythonUtils, setPythonUtils] = useState<{
    runPythonCode: (code: string) => Promise<{ 
      output: string; 
      error: string | null;
      waitingForInput?: boolean;
      prompt?: string;
    }>
    continueWithInput: (userInput: string) => Promise<{
      output: string;
      error: string | null;
      waitingForInput?: boolean;
      prompt?: string;
    }>
    initializePyodide: () => Promise<any>
    isPyodideReady: () => boolean
  } | null>(null)

  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      import('../utils/python-runner').then((module) => {
        setPythonUtils({
          runPythonCode: module.runPythonCode,
          continueWithInput: module.continueWithInput,
          initializePyodide: module.initializePyodide,
          isPyodideReady: module.isPyodideReady,
        })
      }).catch((error) => {
        console.error('Failed to load python runner:', error)
      })
    }
  }, [])

  return pythonUtils
}

interface PythonIDEProps {
  initialModule?: Module
  courses?: Course[]
  showCourseSidebar?: boolean
}

function PythonIDEComponent({ 
  initialModule, 
  courses: coursesProp = courses, 
  showCourseSidebar = true 
}: PythonIDEProps) {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [currentCourse, setCurrentCourse] = useState<Course | null>(coursesProp.find(c => c.status === 'available') || null)
  const [currentModule, setCurrentModule] = useState<Module | null>(initialModule || null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [isPyodideInitialized, setIsPyodideInitialized] = useState(false)
  const [initializationProgress, setInitializationProgress] = useState('')
  const [waitingForInput, setWaitingForInput] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [userInput, setUserInput] = useState('')

  const pythonUtils = usePythonRunner()

  const currentSlide = currentModule?.slides[currentSlideIndex]

  // Initialize Pyodide on component mount
  useEffect(() => {
    if (!pythonUtils) return

    const initPyodide = async () => {
      if (pythonUtils.isPyodideReady()) {
        setIsPyodideInitialized(true)
        return
      }

      try {
        setInitializationProgress('🚀 Loading Python runtime from CDN...')
        setOutput('🔄 Initializing Python WebAssembly environment...\n\nThis may take a few seconds on first load.')
        
        await pythonUtils.initializePyodide()
        setIsPyodideInitialized(true)
        setInitializationProgress('')
        setOutput('🐍 Full Python environment ready!\n\n✅ Real Python execution enabled\n✅ Standard library loaded\n✅ NumPy, Pandas, Matplotlib available\n\n▊ Start building real tools with authentic Python!')
      } catch (error) {
        console.error('Failed to initialize Pyodide:', error)
        setInitializationProgress('⚠️ Python CDN unavailable. Using simulation.')
        setIsPyodideInitialized(false)
        setOutput('⚠️ Running in simulation mode.\n\nReal Python execution not available, but core functionality works.\nTry refreshing the page to retry loading.')
      }
    }

    initPyodide()
  }, [pythonUtils])

  const runCode = async () => {
    if (!code.trim()) {
      setOutput('▊ Enter some Python code to execute.')
      return
    }

    setIsRunning(true)
    setOutput('⚡ Executing...')

    try {
      if (isPyodideInitialized && pythonUtils?.isPyodideReady()) {
        // Use real Python execution
        const result = await pythonUtils.runPythonCode(code)
        
        if (result.error) {
          setOutput(`❌ Error: ${result.error}`)
          setWaitingForInput(false)
        } else if (result.waitingForInput) {
          setOutput(result.output + (result.prompt || ''))
          setWaitingForInput(true)
          setCurrentPrompt(result.prompt || '')
        } else {
          setOutput(result.output || '✅ Code executed successfully!')
          setWaitingForInput(false)
        }
      } else {
        // Fallback to simulation
        await simulatePythonExecution()
      }
    } catch (error) {
      setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setWaitingForInput(false)
    } finally {
      setIsRunning(false)
    }
  }

  const simulatePythonExecution = async () => {
    // Fallback simulation for when Pyodide fails to load
    let result = ''
    const lines = code.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      // Handle print statements
      const printMatch = line.match(/print\s*\(\s*(.+)\s*\)/)
      if (printMatch) {
        let content = printMatch[1].trim()
        
        // Remove outer quotes
        if ((content.startsWith('"') && content.endsWith('"')) || 
            (content.startsWith("'") && content.endsWith("'"))) {
          content = content.slice(1, -1)
        }
        
        // Handle f-strings (basic)
        if (content.includes('f"') || content.includes("f'")) {
          content = content.replace(/f["']([^"']*){([^}]+)}([^"']*)["']/, '$1[$2]$3')
        }
        
        // Handle string concatenation
        if (content.includes(' + ')) {
          const parts = content.split(' + ').map(part => {
            part = part.trim()
            if ((part.startsWith('"') && part.endsWith('"')) || 
                (part.startsWith("'") && part.endsWith("'"))) {
              return part.slice(1, -1)
            }
            return `[${part}]`
          })
          content = parts.join('')
        }
        
        result += content + '\n'
      }
      
      // Handle variable assignments (basic)
      const varMatch = line.match(/(\w+)\s*=\s*(.+)/)
      if (varMatch && !line.includes('def ')) {
        result += `▊ Variable '${varMatch[1]}' assigned\n`
      }
      
      // Handle function definitions
      const funcMatch = line.match(/def\s+(\w+)\s*\(/)
      if (funcMatch) {
        result += `▊ Function '${funcMatch[1]}' defined\n`
      }
      
      // Handle function calls (basic)
      const callMatch = line.match(/(\w+)\s*\(.*\)/)
      if (callMatch && !line.includes('print') && !line.includes('def ') && !line.includes('=')) {
        result += `▊ Function '${callMatch[1]}' called\n`
      }
      
      // Handle comments
      if (line.trim().startsWith('#')) {
        continue
      }
    }
    
    setOutput(result || '▊ Code executed in simulation mode')
  }

  const resetCode = () => {
    setCode(currentSlide?.starterCode || '')
    setOutput('')
    setWaitingForInput(false)
    setCurrentPrompt('')
    setUserInput('')
  }

  const handleUserInput = async (inputValue: string) => {
    if (!waitingForInput || !pythonUtils?.continueWithInput) return

    setUserInput('')
    setWaitingForInput(false)
    setIsRunning(true)

    try {
      const result = await pythonUtils.continueWithInput(inputValue)
      
      if (result.error) {
        setOutput(prev => prev + inputValue + '\n❌ Error: ' + result.error)
      } else if (result.waitingForInput) {
        setOutput(prev => prev + inputValue + '\n' + result.output + (result.prompt || ''))
        setWaitingForInput(true)
        setCurrentPrompt(result.prompt || '')
      } else {
        setOutput(prev => prev + inputValue + '\n' + (result.output || ''))
      }
    } catch (error) {
      setOutput(prev => prev + inputValue + '\n❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsRunning(false)
    }
  }

  const loadModule = (course: Course, module: Module) => {
    setCurrentCourse(course)
    setCurrentModule(module)
    setCurrentSlideIndex(0)
    setCode('')
    setOutput('')
  }

  const nextSlide = () => {
    if (currentModule && currentSlideIndex < currentModule.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const renderSlideContent = (slide: Slide) => {
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
        case 'intro': return 'border-l-build-accent bg-build-accent/5 orange-glow'
        case 'concept': return 'border-l-minimal-green bg-minimal-green/5'
        case 'practice': return 'border-l-build-pink-neon bg-build-pink/5 pink-glow'
        case 'summary': return 'border-l-minimal-purple bg-minimal-purple/5'
        default: return 'border-l-build-border bg-build-surface/50'
      }
    }

    return (
      <div className={`h-full p-6 ${getSlideColor(slide.type)} border-l-4`}>
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">{getSlideIcon(slide.type)}</span>
          <h2 className="text-2xl font-bold text-build-text font-mono">{slide.title}</h2>
        </div>
        
        <div className="space-y-4 mb-6">
          {slide.content.map((line, index) => {
            if (line.startsWith('•')) {
              return (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-build-accent mt-1 font-mono">▊</span>
                  <span className="text-build-text leading-relaxed">{line.slice(1).trim()}</span>
                </div>
              )
            }
            return <p key={index} className="text-build-text leading-relaxed">{line}</p>
          })}
        </div>

        {slide.code && (
          <div className="mb-6">
            <div className="bg-tan-50 text-build-text p-4 rounded-lg font-mono text-sm overflow-x-auto border border-tan-200">
              <pre>{slide.code}</pre>
            </div>
          </div>
        )}

        {slide.isInteractive && (
          <div className="bg-build-pink/10 border border-build-pink/30 rounded-lg p-4 pink-glow">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-build-pink-neon">⚡</span>
              <span className="font-semibold text-build-pink-neon font-mono">Build Time</span>
            </div>
            <p className="text-build-text text-sm">
              Code editor is ready. Build and test your solution using real Python.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Load starter code when slide changes
  useEffect(() => {
    if (currentSlide?.starterCode) {
      setCode(currentSlide.starterCode)
    } else if (currentSlide?.code && currentSlide.isInteractive) {
      setCode(currentSlide.code)
    } else if (!currentSlide?.isInteractive) {
      setCode('# Start building\nprint("Hello, Builder!")')
    }
    setOutput('')
  }, [currentSlide])

  return (
    <div className="h-screen ide-layout bg-build-bg">
      {/* Course Sidebar */}
      {showCourseSidebar && (
        <div className={`${sidebarOpen ? 'w-full lg:w-80' : 'hidden lg:w-12'} transition-all duration-300 bg-build-surface ide-sidebar flex flex-col`}>
          <div className="p-3 sm:p-4 border-b border-build-border flex items-center justify-between">
            {sidebarOpen && (
              <>
                <h2 className="font-bold text-base sm:text-lg flex items-center text-build-text font-mono">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-build-accent flex-shrink-0" />
                  <span className="truncate">Courses</span>
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-tan-100 rounded text-build-muted hover:text-build-text touch-target flex-shrink-0"
                >
                  <X className="w-4 h-4 lg:hidden" />
                  <ChevronLeft className="w-4 h-4 hidden lg:block" />
                </button>
              </>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 hover:bg-tan-100 rounded text-build-muted hover:text-build-text touch-target"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {sidebarOpen && (
            <div className="flex-1 sidebar-mobile p-3 sm:p-4">
              {coursesProp.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {coursesProp.map((course, courseIndex) => (
                    <div key={course.id} className="space-y-2">
                      {/* Course Header */}
                      <div className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border ${courseIndex % 2 === 0 ? 'bg-build-accent/5 border-build-accent/20' : 'bg-build-pink/5 border-build-pink/20'}`}>
                        <span className="text-xl sm:text-2xl flex-shrink-0">{course.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-build-text font-mono text-sm sm:text-base truncate">{course.title}</h3>
                            {course.status === 'coming-soon' && (
                              <span className="text-xs px-2 py-0.5 bg-tan-200 text-build-muted rounded font-mono flex-shrink-0">
                                SOON
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-build-muted truncate">{course.description}</p>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-build-muted font-mono">
                            <span>{course.level}</span>
                            <span>•</span>
                            <span>{course.totalTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Course Modules */}
                      {course.status === 'available' && course.modules.map((module, index) => (
                        <button
                          key={module.id}
                          onClick={() => loadModule(course, module)}
                          className={`w-full text-left p-2 sm:p-3 ml-3 sm:ml-4 rounded-lg border transition-all touch-target ${
                            currentModule?.id === module.id
                              ? (index % 2 === 0 ? 'bg-build-accent/10 border-build-accent/30 text-build-accent' : 'bg-build-pink/10 border-build-pink/30 text-build-pink-neon')
                              : 'bg-build-surface border-build-border hover:border-build-accent/50 text-build-text'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-build-muted">Module {index + 1}</span>
                            <span className="text-xs text-build-muted font-mono">{module.time}</span>
                          </div>
                          <div className="text-sm font-semibold font-mono mb-1 truncate">{module.title}</div>
                          <div className="text-xs text-build-muted line-clamp-2">{module.description}</div>
                          {currentModule?.id === module.id && (
                            <div className={`mt-2 text-xs font-mono ${index % 2 === 0 ? 'text-build-accent' : 'text-build-pink-neon'}`}>
                              Step {currentSlideIndex + 1} of {module.slides.length}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-build-muted text-sm font-mono">
                  <p>No courses available.</p>
                  <p className="mt-2">Check back soon for new builds!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main IDE Area */}
      <div className="flex-1 ide-main">
        {/* Header */}
        <div className="bg-build-surface border-b border-build-border p-3 sm:p-4">
          <div className="ide-header-mobile">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Mobile menu button */}
              {showCourseSidebar && !sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-tan-100 rounded text-build-muted hover:text-build-text touch-target flex-shrink-0"
                >
                  <Layers className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-build-accent orange-glow flex-shrink-0" />
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-build-text font-mono truncate">/build/python</h1>
                {!isPyodideInitialized && initializationProgress && (
                  <div className="hidden md:flex items-center space-x-2 text-sm text-build-pink-neon">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="font-mono truncate">{initializationProgress}</span>
                  </div>
                )}
                {isPyodideInitialized && (
                  <span className="bg-minimal-green/20 text-minimal-green text-xs px-2 py-1 rounded font-mono hidden sm:inline flex-shrink-0">
                    ▊ READY
                  </span>
                )}
              </div>
              {currentModule && (
                <div className="hidden lg:flex items-center space-x-2 text-sm text-build-muted font-mono min-w-0">
                  <span>▊</span>
                  <span className="truncate">{currentModule.title}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
              <a
                href="/"
                className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-build-muted hover:text-build-accent transition-colors font-mono text-sm touch-target"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </a>
            </div>
          </div>
        </div>

        {/* IDE Content */}
        <div className="flex-1 ide-content">
          {/* Module Content */}
          {currentModule && currentSlide && (
            <div className="ide-lesson bg-build-surface flex flex-col">
              {/* Slide Navigation */}
              <div className="bg-tan-50/50 border-b border-build-border p-2 sm:p-3">
                <div className="slide-nav-mobile">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="flex items-center justify-center space-x-1 px-3 sm:px-4 py-2 bg-build-surface hover:bg-tan-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-build-text font-mono border border-build-border text-sm touch-target"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>
                  
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 flex-1">
                    <span className="text-xs sm:text-sm text-build-muted font-mono">
                      {currentSlideIndex + 1} of {currentModule.slides.length}
                    </span>
                    <div className="flex space-x-1">
                      {currentModule.slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlideIndex(index)}
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors touch-target ${
                            index === currentSlideIndex ? 'bg-build-accent orange-glow' : 'bg-tan-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={nextSlide}
                    disabled={currentSlideIndex === currentModule.slides.length - 1}
                    className="flex items-center justify-center space-x-1 px-3 sm:px-4 py-2 bg-build-pink-neon hover:bg-build-pink disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors font-mono font-medium pink-glow text-sm touch-target"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Content */}
              <div className="flex-1 lesson-content-mobile">
                {renderSlideContent(currentSlide)}
              </div>
            </div>
          )}

          {/* Code Editor & Output */}
          <div className="ide-editor">

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="bg-tan-50 px-2 sm:px-4 py-2 border-b border-build-border">
                <div className="flex items-center justify-between">
                  <span className="text-build-text text-xs sm:text-sm font-mono truncate">
                    Code Builder {isPyodideInitialized ? '(Python WebAssembly)' : '(Simulation)'}
                  </span>
                  <div className="code-toolbar-mobile flex-shrink-0">
                    <button
                      onClick={resetCode}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-build-surface hover:bg-tan-100 text-build-text text-xs sm:text-sm rounded transition-colors font-mono border border-build-border touch-target"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-build-accent hover:bg-build-accent-dark disabled:opacity-50 text-white text-xs sm:text-sm rounded transition-colors font-mono font-medium orange-glow touch-target"
                    >
                      {isRunning ? (
                        <Loader className="w-3 h-3 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      <span>{isRunning ? 'Building...' : 'Run'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-3 sm:p-4 bg-tan-50 text-build-text font-mono resize-none outline-none code-editor-mobile placeholder-build-muted border-0"
                placeholder="# Start building something real
print('Hello, Builder!')

# Try using input() - enter values in the terminal below:
name = input('What is your name? ')
age = input('How old are you? ')
print(f'Hello {name}, you are {age} years old!')

# Real Python features available:
import math
print(f'Pi: {math.pi:.2f}')

# Ready to ship?"
                spellCheck={false}
              />
            </div>

            {/* Output Panel */}
            <div className="output-panel-mobile bg-build-surface border-t border-build-border flex flex-col">
              <div className="bg-tan-50/50 px-2 sm:px-4 py-2 border-b border-build-border">
                <span className="text-xs sm:text-sm font-mono text-build-text">
                  Terminal {isPyodideInitialized ? '(Real Python)' : '(Simulation)'}
                  {waitingForInput && <span className="text-build-accent ml-2">● Waiting for input</span>}
                </span>
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
                  <pre className="terminal-output-mobile font-mono text-build-text whitespace-pre-wrap">
                    {output || (isPyodideInitialized 
                      ? '🐍 Full Python environment ready!\n\n✅ Real Python execution enabled\n✅ NumPy, Pandas, Matplotlib available\n✅ All standard libraries loaded\n\n▊ Ready to build. Run code to see authentic output!' 
                      : initializationProgress || '⏳ Loading Python WebAssembly environment...\n\nInitializing real Python execution from CDN.'
                    )}
                  </pre>
                </div>
                {waitingForInput && (
                  <div className="border-t border-build-border p-2 sm:p-3 bg-tan-50/30">
                    <div className="flex items-center space-x-2">
                      <span className="text-build-text text-xs font-mono flex-shrink-0">▊</span>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && userInput.trim()) {
                            handleUserInput(userInput.trim())
                          }
                        }}
                        placeholder="Type your response and press Enter..."
                        className="input-mobile px-2 py-1 text-xs sm:text-sm font-mono bg-white border border-build-border rounded outline-none text-build-text placeholder-build-muted"
                        autoFocus
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export with SSR disabled to prevent server-side rendering issues
export default dynamic(() => Promise.resolve(PythonIDEComponent), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-build-bg">
      <div className="flex items-center space-x-2 text-build-text">
        <Loader className="w-5 h-5 animate-spin text-build-accent orange-glow" />
        <span className="font-mono">Loading Python Builder...</span>
      </div>
    </div>
  )
}) 