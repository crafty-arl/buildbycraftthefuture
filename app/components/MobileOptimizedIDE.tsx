'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown, Code, Terminal, Settings, Play, RotateCcw } from 'lucide-react'
import { runPythonCode } from '../utils/python-runner'

interface MobileOptimizedIDEProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  className?: string
}

export default function MobileOptimizedIDE({ 
  initialCode = '# Write your Python code here\nprint("Hello, World!")',
  onCodeChange,
  className = ""
}: MobileOptimizedIDEProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activePanel, setActivePanel] = useState<'editor' | 'terminal'>('editor')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('Running...\n')
    
    try {
      const result = await runPythonCode(code)
      setOutput(result.output || result.error || 'No output')
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput('')
  }

  const togglePanel = () => {
    setActivePanel(activePanel === 'editor' ? 'terminal' : 'editor')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [code])

  return (
    <div className={`flex flex-col h-full ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-build-bg' : ''}`}>
      {/* Mobile Header */}
      <div className="bg-build-surface border-b border-build-border p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-build-accent" />
          <span className="font-mono text-sm font-medium">Mobile IDE</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={togglePanel}
            className="p-2 text-build-muted hover:text-build-accent transition-colors touch-target"
            title={activePanel === 'editor' ? 'Show Terminal' : 'Show Editor'}
          >
            {activePanel === 'editor' ? <Terminal className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-build-muted hover:text-build-accent transition-colors touch-target"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Editor Panel */}
        {activePanel === 'editor' && (
          <div className="flex-1 flex flex-col">
            {/* Editor Toolbar */}
            <div className="bg-build-surface border-b border-build-border p-2 flex items-center justify-between">
              <span className="text-xs text-build-muted font-mono">Python Editor</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 text-build-muted hover:text-build-accent transition-colors touch-target"
                  title="Reset Code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="p-1.5 bg-build-accent text-white rounded hover:bg-build-accent-dark transition-colors touch-target disabled:opacity-50"
                  title="Run Code"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-3">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full bg-tan-50 text-build-text font-mono text-sm resize-none outline-none border border-tan-200 focus:border-build-accent transition-colors rounded-lg p-3"
                placeholder="Write your Python code here..."
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>
        )}

        {/* Terminal Panel */}
        {activePanel === 'terminal' && (
          <div className="flex-1 flex flex-col">
            {/* Terminal Toolbar */}
            <div className="bg-build-surface border-b border-build-border p-2 flex items-center justify-between">
              <span className="text-xs text-build-muted font-mono">Terminal Output</span>
              <button
                onClick={() => setOutput('')}
                className="p-1.5 text-build-muted hover:text-build-accent transition-colors touch-target"
                title="Clear Output"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 p-3">
              <div className="w-full h-full bg-build-surface text-build-text font-mono text-xs overflow-auto rounded-lg border border-build-border p-3">
                <pre className="whitespace-pre-wrap break-words">{output || 'Ready to run code...'}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <div className="bg-build-surface border-t border-build-border p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-build-muted">
              {activePanel === 'editor' ? 'Editor' : 'Terminal'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-3 py-1.5 bg-build-accent text-white text-sm rounded hover:bg-build-accent-dark transition-colors touch-target disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 