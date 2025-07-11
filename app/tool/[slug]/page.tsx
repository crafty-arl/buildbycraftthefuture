'use client'

import { useState, useEffect, useRef } from 'react'
import { useUserProgress } from '@/app/hooks/useUserProgress'
import { useToolProgress } from '@/app/hooks/useToolProgress'
import { getToolWithSteps, SimpleTool } from '@/app/data/tools'
import { LessonStep } from '@/app/data/lessonParser'
import { ArrowLeft, Play, RotateCcw, CheckCircle, Lightbulb, Target, ChevronLeft, ChevronRight } from 'lucide-react'
import LayoutWrapper from '@/app/components/layout/LayoutWrapper'
import MonacoCodeEditor from '@/app/components/MonacoCodeEditor'
import CompletionPopup from '@/app/components/CompletionPopup'
import { useSession } from 'next-auth/react'

interface ToolPageProps {
  params: {
    slug: string
  }
}

// Pyodide interface types
interface PyodideInterface {
  runPython: (code: string) => any;
  globals: {
    get: (name: string) => any;
  };
  toPy: (obj: any) => any;
  FS: {
    writeFile: (path: string, data: string) => void;
    readFile: (path: string) => Uint8Array;
  };
}

declare global {
  interface Window {
    loadPyodide: (config?: {
      indexURL?: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<any>;
  }
}

export default function ToolPage({ params }: ToolPageProps) {
  const [tool, setTool] = useState<SimpleTool | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [code, setCode] = useState<string>('')
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [isClaimingRewards, setIsClaimingRewards] = useState(false)
  const hasClaimedRef = useRef(false)
  const { data: session } = useSession()
  const { progress, saveProgress } = useToolProgress(params.slug)
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [isPyodideLoading, setIsPyodideLoading] = useState(true)
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0)
  const [loadDuration, setLoadDuration] = useState<number>(0)
  const [loadMethod, setLoadMethod] = useState<string>('')
  const { completeToolIfNotCompleted } = useUserProgress()
  const pyodideInitialized = useRef(false)

  // Load Pyodide CDN
  useEffect(() => {
    const loadPyodideScript = async () => {
      if (pyodideInitialized.current) return;
      
      const startTime = Date.now();
      setLoadingStartTime(startTime);
      console.log('🐍 Starting Pyodide load at:', new Date(startTime).toLocaleTimeString());
      
      try {
        // Load Pyodide using script tag approach
        let loadPyodide;
        
        // Try ES module approach first using eval to bypass TypeScript
        try {
          const dynamicImport = new Function('specifier', 'return import(specifier)');
          const pyodideModule = await dynamicImport('https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.mjs');
          loadPyodide = pyodideModule.loadPyodide;
          setLoadMethod('ES Module');
          console.log('✅ Successfully loaded Pyodide via ES module');
        } catch (importError) {
          console.warn('ES module import failed, trying script tag approach:', importError);
          
          // Fallback to script tag approach
          if (!document.querySelector('script[src*="pyodide"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.js';
            script.async = true;
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = (e) => {
                console.error('Failed to load Pyodide script:', e);
                reject(new Error('Failed to load Pyodide script from CDN'));
              };
              // Add timeout
              setTimeout(() => {
                reject(new Error('Timeout loading Pyodide script'));
              }, 30000); // 30 second timeout
            });
          }

          // Wait for loadPyodide to be available on window
          let attempts = 0;
          while (!window.loadPyodide && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          if (!window.loadPyodide) {
            throw new Error('loadPyodide function not available after script load');
          }
          
          loadPyodide = window.loadPyodide;
          setLoadMethod('Script Tag');
          console.log('✅ Successfully loaded Pyodide via script tag');
        }

        // Initialize Pyodide
        const pyodideInstance = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/',
        });

        // Setup stdout capture using StringIO
        pyodideInstance.runPython(`
import sys
from io import StringIO

# Global output buffer
_stdout_buffer = StringIO()
        `);

        setPyodide(pyodideInstance);
        setIsPyodideLoading(false);
        pyodideInitialized.current = true;
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        setLoadDuration(duration);
        
        console.log(`🎉 Pyodide fully loaded and initialized!`);
        console.log(`📊 Load stats: ${duration}ms via ${loadMethod || 'Unknown method'}`);
        console.log(`🕐 Started: ${new Date(startTime).toLocaleTimeString()}`);
        console.log(`🕐 Finished: ${new Date(endTime).toLocaleTimeString()}`);
        
        // Set initial success message in output
        setOutput(`🎉 Python runtime loaded successfully!\n\n📊 Debug Info:\n• Load method: ${loadMethod || 'Unknown'}\n• Load time: ${(duration / 1000).toFixed(1)} seconds\n• Started: ${new Date(startTime).toLocaleTimeString()}\n• Finished: ${new Date(endTime).toLocaleTimeString()}\n\n👆 Write some Python code and click "Run Code" to get started!`);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setOutput(`❌ Failed to load Python runtime: ${errorMessage}\n\nPossible solutions:\n• Check your internet connection\n• Refresh the page and try again\n• Try using a different browser\n• Check if your browser supports WebAssembly`);
        setIsPyodideLoading(false);
      }
    };

    loadPyodideScript();
  }, []);

  // Real-time timer update during loading
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPyodideLoading && loadingStartTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100); // Update every 100ms for smooth counter
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPyodideLoading, loadingStartTime]);

  // Load tool and progress
  useEffect(() => {
    async function loadTool() {
      setIsLoading(true)
      console.log('🔍 Page Debug: Loading tool for slug:', params.slug)
      const foundTool = await getToolWithSteps(params.slug)
      if (!foundTool) {
        console.error('❌ Page Error: Tool not found:', params.slug)
        setIsLoading(false)
        return
      }
      
      setTool(foundTool)
      
      // Set initial code based on saved progress or default
      if (progress?.completedSteps?.length > 0) {
        // If we have completed steps, mark tool as completed
        hasClaimedRef.current = true
      }
      
      if (foundTool.lessonType === 'stepped' && foundTool.steppedLesson?.steps[0]) {
        setCode(foundTool.steppedLesson.steps[0].starterCode)
      } else if (foundTool.starterCode) {
        setCode(foundTool.starterCode)
      }
      
      setIsLoading(false)
    }

    loadTool()
  }, [params.slug, progress])

  const runCode = async () => {
    if (!code.trim()) {
      setOutput('⚠️ Please write some code first!')
      return
    }

    if (!pyodide) {
      setOutput('⚠️ Python runtime is still loading. Please wait a moment and try again.')
      return
    }

    setIsRunning(true)
    setOutput('🔄 Running your code...\n')

    try {
      // Reset and setup output capture
      pyodide.runPython(`
_stdout_buffer.seek(0)
_stdout_buffer.truncate(0)
sys.stdout = _stdout_buffer
      `)
      
      // Run user code
      try {
        pyodide.runPython(code)
      } catch (pythonError: unknown) {
        // Handle Python runtime errors
        const errorMessage = pythonError instanceof Error ? pythonError.message : String(pythonError)
        setOutput(`❌ Python Error:\n${errorMessage}`)
        setIsRunning(false)
        return
      }
      
      // Get captured output and restore stdout
      const result = pyodide.runPython(`
sys.stdout = sys.__stdout__
_stdout_buffer.getvalue()
      `)
      
      // Handle different types of output
      let finalOutput: string
      if (result && typeof result === 'string' && result.trim().length > 0) {
        finalOutput = result
      } else {
        // Check if code contains print statements
        if (code.includes('print(')) {
          finalOutput = '✅ Code executed successfully (no output generated)\n\nNote: If you used print() statements, make sure they are correctly formatted.'
        } else {
          finalOutput = '✅ Code executed successfully (no print statements found)\n\nTip: Use print() to display output in the console.'
        }
      }
      setOutput(finalOutput)
      
      // Check for completion patterns
      if (finalOutput.includes('PYTHON') && finalOutput.includes('TOTAL') && finalOutput.includes('$')) {
        completeToolIfNotCompleted(tool?.slug || '', 100)
        setOutput(finalOutput + '\n\n✅ Great job! Your receipt generator is working!')
      }
      
      // Check for TextBar completion (bars + total)
      if (finalOutput.includes('█') && finalOutput.includes('Total') && finalOutput.includes('-')) {
        completeToolIfNotCompleted(tool?.slug || '', 100)
        setOutput(finalOutput + '\n\n✅ Excellent! Your text bar chart generator is working perfectly!')
      }
      
      // Check step completion for stepped lessons
      if (tool?.lessonType === 'stepped' && tool.steppedLesson) {
        checkStepCompletion(finalOutput)
      }
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const checkStepCompletion = (output: string) => {
    if (!tool?.steppedLesson) return
    
    const currentStep = tool.steppedLesson.steps[currentStepIndex]
    if (!currentStep) return
    
    // Check if step is already completed
    if (progress.completedSteps.includes(currentStep.id)) return
    
    // Enhanced completion check - look for expected output or successful execution
    let isComplete = false
    
    if (currentStep.expectedOutput) {
      // Check if output contains key parts of expected output
      const expectedLines = currentStep.expectedOutput.split('\n').filter(line => line.trim())
      const outputLines = output.split('\n')
      
      // Consider complete if most expected content is present
      const matchingLines = expectedLines.filter(expectedLine => 
        outputLines.some(outputLine => 
          outputLine.includes(expectedLine.trim()) || 
          expectedLine.trim().includes(outputLine.trim())
        )
      )
      
      isComplete = matchingLines.length >= Math.ceil(expectedLines.length * 0.7)
    } else {
      // Fallback: check for successful execution without errors
      isComplete = output.length > 20 && 
                   !output.toLowerCase().includes('error') && 
                   !output.includes('❌') &&
                   !output.includes('⚠️')
    }
    
    if (isComplete) {
      const newCompletedSteps = [...progress.completedSteps, currentStep.id]
      saveProgress(newCompletedSteps, newCompletedSteps.length === (tool.steppedLesson?.steps?.length || 0))
      setOutput(prev => prev + '\n\n✅ Step completed! Great work!')

      // Check if all steps are completed
      if (newCompletedSteps.length === (tool.steppedLesson?.steps?.length || 0) && !hasClaimedRef.current) {
        setShowCompletionPopup(true)
      }
    }
  }

  const handleClaimRewards = async () => {
    if (!tool || hasClaimedRef.current) return
    
    try {
      setIsClaimingRewards(true)
      
      hasClaimedRef.current = true
      setShowCompletionPopup(false)
      
      // Show success message
      setOutput(prev => 
        prev + '\n\n🎉 Congratulations! You\'ve earned:\n' +
        `• ${tool.steppedLesson?.xp || 100} XP\n` +
        `• "${tool.title} Master" achievement\n` +
        '• Progress saved!'
      )
    } catch (error) {
      console.error('Error claiming rewards:', error)
      setOutput(prev => prev + '\n\n❌ Failed to claim rewards. Please try again.')
    } finally {
      setIsClaimingRewards(false)
    }
  }

  const resetCode = () => {
    if (tool) {
      if (tool.lessonType === 'stepped' && tool.steppedLesson?.steps[currentStepIndex]) {
        setCode(tool.steppedLesson.steps[currentStepIndex].starterCode)
      } else if (tool.starterCode) {
        setCode(tool.starterCode)
      }
      setOutput('')
      setShowSolution(false)
    }
  }

  const toggleSolution = () => {
    if (!tool) return
    
    if (!showSolution) {
      if (tool.lessonType === 'stepped' && tool.steppedLesson?.steps[currentStepIndex]) {
        setCode(tool.steppedLesson.steps[currentStepIndex].solutionCode)
      } else if (tool.solutionCode) {
        setCode(tool.solutionCode)
      }
      setShowSolution(true)
    } else {
      resetCode()
    }
  }

  const nextStep = () => {
    if (!tool?.steppedLesson?.steps || currentStepIndex >= tool.steppedLesson.steps.length - 1) return
    
    const nextIndex = currentStepIndex + 1
    setCurrentStepIndex(nextIndex)
    setCode(tool.steppedLesson.steps[nextIndex].starterCode)
    setOutput('')
    setShowSolution(false)
  }

  const prevStep = () => {
    if (currentStepIndex <= 0) return
    
    const prevIndex = currentStepIndex - 1
    if (tool?.steppedLesson?.steps[prevIndex]) {
      setCurrentStepIndex(prevIndex)
      setCode(tool.steppedLesson.steps[prevIndex].starterCode)
      setOutput('')
      setShowSolution(false)
    }
  }

  const getCurrentStep = (): LessonStep | null => {
    const currentStep = tool?.steppedLesson?.steps[currentStepIndex] || null
    console.log('🔍 Step Debug: Current step index:', currentStepIndex)
    console.log('🔍 Step Debug: Current step:', currentStep?.title || 'null')
    console.log('🔍 Step Debug: Total steps available:', tool?.steppedLesson?.steps.length || 0)
    return currentStep
  }

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-tan-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-build-accent border-t-transparent mx-auto"></div>
            <h2 className="text-xl font-bold text-build-text font-mono">Loading Tool...</h2>
            <p className="text-build-muted">Preparing your coding environment</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!tool) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-tan-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-build-text mb-4">Tool not found</h1>
            <p className="text-build-muted mb-6">We couldn't find the tool you're looking for.</p>
            <a href="/" className="btn-primary">← Back to Home</a>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  // Handle case where stepped lesson failed to load
  if (tool.lessonType === 'stepped' && !tool.steppedLesson) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-tan-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-build-text mb-4">Lesson Not Available</h1>
            <p className="text-build-muted mb-6">
              The stepped lesson content for "{tool.title}" could not be loaded. 
              This might be due to a missing markdown file.
            </p>
            <div className="space-y-2 text-left bg-build-surface p-4 rounded border border-build-border mb-6">
              <p className="text-sm text-build-muted">For developers:</p>
              <p className="text-xs font-mono text-build-text">
                Expected file: lessons/{tool.order.toString().padStart(2, '0')}-{tool.slug}-stepped.md
              </p>
            </div>
            <a href="/" className="btn-primary">← Back to Home</a>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  const isSteppedLesson = tool.lessonType === 'stepped' && tool.steppedLesson
  const currentStep = getCurrentStep()

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-tan-50">
        {/* Header */}
        <div className="bg-build-surface border-b border-build-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/" className="btn-minimal p-2">
                  <ArrowLeft className="w-5 h-5" />
                </a>
                <div>
                  <h1 className="text-xl font-bold text-build-text font-mono">{tool.title}</h1>
                  <p className="text-build-muted text-sm">{tool.description}</p>
                  {isSteppedLesson && (
                    <p className="text-build-accent text-sm font-mono">
                      Step {currentStepIndex + 1} of {tool.steppedLesson?.steps?.length || 0} - {currentStep?.title || 'Loading...'}
                      {tool.steppedLesson?.steps && (
                        <span className="text-build-muted ml-2">
                          (Debug: {tool.steppedLesson.steps.length} steps loaded)
                        </span>
                      )}
                    </p>
                  )}
                  {isPyodideLoading && (
                    <p className="text-blue-600 text-sm font-mono animate-pulse">
                      🐍 Loading Python runtime...
                      {loadingStartTime > 0 && (
                        <span className="text-blue-500 ml-2">
                          ({Math.round((currentTime - loadingStartTime) / 1000)}s)
                        </span>
                      )}
                    </p>
                  )}
                  {pyodide && (
                    <p className="text-green-600 text-sm font-mono">
                      🎉 Python loaded successfully via {loadMethod} 
                      {loadDuration > 0 && (
                        <span className="text-green-500 ml-1">
                          ({(loadDuration / 1000).toFixed(1)}s)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-build-accent/10 text-build-accent rounded-lg text-sm font-mono">
                  {tool.difficulty}
                </span>
                <span className="px-3 py-1 bg-build-muted/10 text-build-muted rounded-lg text-sm font-mono">
                  {tool.estimatedTime}
                </span>
                {tool.steppedLesson?.xp && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-mono">
                    ⭐ {tool.steppedLesson.xp} XP
                  </span>
                )}
                {isPyodideLoading && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-mono animate-pulse">
                    🐍 Loading... {loadingStartTime > 0 && `${Math.round((currentTime - loadingStartTime) / 1000)}s`}
                  </span>
                )}
                {pyodide && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-mono">
                    🐍 Ready ({loadMethod}) {loadDuration > 0 && `${(loadDuration / 1000).toFixed(1)}s`}
                  </span>
                )}
              </div>
            </div>
            
            {/* Step Navigation for Stepped Lessons */}
            {isSteppedLesson && (
              <div className="mt-4 pt-4 border-t border-build-border">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="flex items-center space-x-2 px-3 py-1 bg-build-surface hover:bg-tan-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-build-text font-mono border border-build-border text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <div className="text-center">
                    <div className="text-sm font-mono text-build-text">
                      Step {currentStepIndex + 1} of {tool.steppedLesson?.steps?.length || 0}
                    </div>
                    <div className="text-xs text-build-muted">
                      {currentStep?.title || 'Loading...'}
                    </div>
                  </div>
                  
                  <button 
                    onClick={nextStep}
                    disabled={!tool.steppedLesson || currentStepIndex >= (tool.steppedLesson.steps?.length || 0) - 1}
                    className="flex items-center space-x-2 px-3 py-1 bg-build-accent hover:bg-build-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors font-mono text-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Step Dots */}
                <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2">
                  <div className="text-xs text-build-muted mr-2 whitespace-nowrap">
                    Steps: {tool.steppedLesson?.steps?.length || 0}
                  </div>
                  {tool.steppedLesson?.steps?.map((step: any, index: number) => {
                    console.log(`🔍 Step Dots Debug: Rendering step ${index + 1}: ${step.id} - ${step.title}`)
                    return (
                      <div 
                        key={step.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono border flex-shrink-0 ${
                          index === currentStepIndex 
                            ? 'bg-build-accent text-white border-build-accent' 
                            : progress.completedSteps.includes(step.id)
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-tan-200 text-build-muted border-build-border'
                        }`}
                        title={`Step ${index + 1}: ${step.title}`}
                      >
                        {progress.completedSteps.includes(step.id) ? '✓' : index + 1}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Instructions */}
            <div className="space-y-6">
              {/* Current Step or Overview */}
              <div className="bg-white rounded-lg border border-build-border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-build-accent" />
                  <h2 className="text-lg font-semibold text-build-text">
                    {isSteppedLesson && currentStep ? currentStep.title : "What You'll Build"}
                  </h2>
                </div>
                
                {isSteppedLesson && currentStep ? (
                  <>
                    <p className="text-build-accent font-medium mb-2">Goal: {currentStep.goal}</p>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-build-text">Instructions:</h3>
                      <ol className="space-y-1">
                        {currentStep.instructions.map((instruction: string, index: number) => (
                          <li key={index} className="flex space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-build-accent text-white rounded-full flex items-center justify-center text-sm font-mono">
                              {index + 1}
                            </span>
                            <span className="text-build-muted">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-build-muted mb-4">{tool.description}</p>
                    <h3 className="font-semibold text-build-text mb-2">Concepts You'll Learn:</h3>
                    <ul className="space-y-1">
                      {(tool.concepts || []).map((concept, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-build-muted">
                          <div className="w-1.5 h-1.5 bg-build-accent rounded-full"></div>
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Expected Output for Stepped Lessons */}
              {isSteppedLesson && currentStep?.expectedOutput && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Expected Output:</h3>
                  <pre className="text-sm text-green-700 font-mono whitespace-pre-wrap bg-green-100 p-3 rounded">
                    {currentStep.expectedOutput}
                  </pre>
                </div>
              )}

              {/* Test Cases for Simple Lessons */}
              {!isSteppedLesson && tool.testCases && (
                <div className="bg-white rounded-lg border border-build-border p-6">
                  <h3 className="font-semibold text-build-text mb-3">Test Your Code</h3>
                  <div className="space-y-2">
                    {tool.testCases.map((testCase, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-mono text-build-muted">Test {index + 1}: {testCase.description}</div>
                        <div className="text-build-muted ml-4">Expected: {testCase.expectedOutput}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Code Editor */}
            <div className="space-y-6">
              {/* Code Editor */}
              <div className="bg-white rounded-lg border border-build-border overflow-hidden">
                <div className="bg-build-surface border-b border-build-border px-4 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-build-text">Code Editor</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={resetCode}
                      className="btn-minimal text-sm px-3 py-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </button>
                    <button 
                      onClick={toggleSolution}
                      className="btn-minimal text-sm px-3 py-1"
                    >
                      {showSolution ? 'Hide' : 'Show'} Solution
                    </button>
                    <button 
                      onClick={runCode}
                      disabled={isRunning || isPyodideLoading}
                      className="btn-primary text-sm px-4 py-1"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {isRunning ? 'Running...' : isPyodideLoading ? 'Loading...' : 'Run Code'}
                    </button>
                  </div>
                </div>
                <div className="h-96">
                  <MonacoCodeEditor
                    value={code}
                    onChange={setCode}
                    language="python"
                    theme="dark"
                    placeholder="# Write your Python code here..."
                  />
                </div>
              </div>

              {/* Output */}
              <div className="bg-white rounded-lg border border-build-border overflow-hidden">
                <div className="bg-build-surface border-b border-build-border px-4 py-3">
                  <h3 className="font-semibold text-build-text">Output</h3>
                </div>
                <div className="p-4">
                  <pre className="font-mono text-sm text-build-text whitespace-pre-wrap min-h-[200px]">
                    {output || (isPyodideLoading ? '🐍 Loading Python runtime...' : '👆 Click "Run Code" to see your output here!')}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add CompletionPopup */}
        <CompletionPopup
          isOpen={showCompletionPopup}
          onClose={() => setShowCompletionPopup(false)}
          onClaim={handleClaimRewards}
          xpAmount={tool?.steppedLesson?.xp || 100}
          toolTitle={tool?.title || ''}
          isLoading={isClaimingRewards}
        />
      </div>
    </LayoutWrapper>
  )
} 