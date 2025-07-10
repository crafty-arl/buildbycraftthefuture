'use client'

import { useRef, useEffect } from 'react'
import { Terminal } from 'lucide-react'

interface IDETerminalProps {
  output: string
  isRunning: boolean
  pythonStatus: 'loading' | 'ready' | 'error'
  replMode: boolean
  waitingForInput: boolean
  currentPrompt: string
  userInput: string
  replInput: string
  terminalScrollLock: boolean
  onUserInputChange: (value: string) => void
  onReplInputChange: (value: string) => void
  onUserInputSubmit: (value: string) => void
  onReplCommand: (command: string) => void
  onNavigateHistory: (direction: 'up' | 'down') => void
  onToggleReplMode: () => void
  onClearTerminal: () => void
  onTerminalClick: () => void
}

export default function IDETerminal({
  output,
  isRunning,
  pythonStatus,
  replMode,
  waitingForInput,
  currentPrompt,
  userInput,
  replInput,
  terminalScrollLock,
  onUserInputChange,
  onReplInputChange,
  onUserInputSubmit,
  onReplCommand,
  onNavigateHistory,
  onToggleReplMode,
  onClearTerminal,
  onTerminalClick
}: IDETerminalProps) {
  const terminalOutputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const replInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalScrollLock && terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight
    }
  }, [output, terminalScrollLock])

  // Focus input when waiting
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [waitingForInput])

  // Focus REPL input when in REPL mode
  useEffect(() => {
    if (replMode && replInputRef.current) {
      replInputRef.current.focus()
    }
  }, [replMode])

  return (
    <div className="w-full h-full">
      <div className="h-full bg-build-surface border border-build-border rounded-lg flex flex-col">
        
        {/* Natural Terminal Content - Integrated with build theme */}
        <div 
          ref={terminalOutputRef}
          className="flex-1 p-4 overflow-y-auto bg-slate-900 rounded-t-lg m-2 mb-0"
          onClick={onTerminalClick}
        >
          <div className="text-green-400 leading-relaxed font-mono text-sm">
            {/* Main terminal output */}
            <pre className="whitespace-pre-wrap">
              {output}
            </pre>
            
            {/* Inline Input for script interaction - Natural Python style */}
            {waitingForInput && (
              <div className="flex items-center">
                <span className="text-green-400">{currentPrompt}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => onUserInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (userInput.trim()) {
                        onUserInputSubmit(userInput.trim())
                      } else {
                        onUserInputSubmit('')
                      }
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono ml-1"
                  style={{ caretColor: 'lime' }}
                  disabled={isRunning}
                  autoFocus
                />
                <span className="animate-pulse text-lime-400">│</span>
              </div>
            )}
            
            {/* Natural Python REPL Input */}
            {replMode && !waitingForInput && (
              <div className="flex items-center">
                <span className="text-green-400">{'>>> '}</span>
                <input
                  ref={replInputRef}
                  type="text"
                  value={replInput}
                  onChange={(e) => onReplInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && replInput.trim()) {
                      onReplCommand(replInput.trim())
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      onNavigateHistory('up')
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      onNavigateHistory('down')
                    } else if (e.key === 'Escape') {
                      onToggleReplMode()
                    } else if (e.key === 'l' && e.ctrlKey) {
                      e.preventDefault()
                      onClearTerminal()
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono ml-1"
                  style={{ caretColor: 'lime' }}
                  placeholder=""
                  disabled={pythonStatus !== 'ready'}
                  autoFocus
                />
                <span className="animate-pulse text-lime-400">│</span>
              </div>
            )}

            {/* Show ready prompt when not in REPL and not waiting for input */}
            {!replMode && !waitingForInput && pythonStatus === 'ready' && (
              <div className="flex items-center mt-2">
                <span className="text-green-400">{'>>> '}</span>
                <span className="text-gray-500 italic">Ready for Python commands (type code and press Run, or enter REPL mode)</span>
              </div>
            )}
          </div>
        </div>

        {/* Header with controls - build theme styling */}
        <div className="flex items-center justify-between px-3 py-2 bg-build-surface border-t border-build-border rounded-b-lg m-2 mt-0">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-build-accent" />
            <span className="text-sm font-medium text-build-text">Python Terminal</span>
            {replMode && <span className="text-xs px-2 py-1 bg-build-accent/10 text-build-accent rounded">REPL</span>}
            {waitingForInput && <span className="text-xs px-2 py-1 bg-build-pink/10 text-build-pink rounded">Input</span>}
          </div>
          
          <div className="flex items-center space-x-1">
            {pythonStatus !== 'ready' && (
              <span className={`text-xs px-2 py-1 rounded ${
                pythonStatus === 'loading' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>
                {pythonStatus === 'loading' ? 'Loading...' : 'Error'}
              </span>
            )}
            
            <button
              onClick={onToggleReplMode}
              disabled={pythonStatus !== 'ready'}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                pythonStatus !== 'ready' ? 'opacity-50 cursor-not-allowed' :
                replMode 
                  ? 'bg-build-accent text-white' 
                  : 'bg-tan-100 text-build-text hover:bg-tan-200'
              }`}
              title={replMode ? 'Exit REPL Mode' : 'Enter REPL Mode'}
            >
              REPL
            </button>
            
            <button
              onClick={onClearTerminal}
              className="px-2 py-1 text-xs bg-tan-100 hover:bg-tan-200 text-build-text rounded transition-colors"
              title="Clear Terminal (Ctrl+L)"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 