'use client'

import { useState, useCallback, useMemo } from 'react'

export interface IDESessionStats {
  linesWritten: number
  executionTime: number
  toolsCreated: number
  startTime: number
}

export interface IDETerminalState {
  output: string
  isRunning: boolean
  waitingForInput: boolean
  currentPrompt: string
  userInput: string
  replMode: boolean
  replInput: string
  commandHistory: string[]
  historyIndex: number
  terminalCollapsed: boolean
  terminalScrollLock: boolean
}

export function useIDEState() {
  // Terminal state
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [waitingForInput, setWaitingForInput] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [userInput, setUserInput] = useState('')
  const [replMode, setReplMode] = useState(false)
  const [replInput, setReplInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [terminalScrollLock, setTerminalScrollLock] = useState(true)
  
  // Session stats
  const [sessionStats, setSessionStats] = useState<IDESessionStats>({
    linesWritten: 0,
    executionTime: 0,
    toolsCreated: 0,
    startTime: Date.now()
  })

  // Terminal functions
  const appendToOutput = useCallback((text: string) => {
    setOutput(prev => prev + text)
  }, [])

  const clearTerminal = useCallback(() => {
    setOutput('🚀 Future Builder Studio - Python IDE\n✨ Write code in the editor and click Run, or use REPL mode for interactive commands\n📚 Pre-loaded: numpy, pandas, matplotlib, scikit-learn\n💡 Natural input() support - code pauses for user input automatically!\n\n>>> ')
  }, [])

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return

    let newIndex = historyIndex
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1)
    }

    setHistoryIndex(newIndex)
    if (newIndex === -1) {
      setReplInput('')
    } else {
      setReplInput(commandHistory[newIndex])
    }
  }, [commandHistory, historyIndex])

  const addToHistory = useCallback((command: string) => {
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)
  }, [])

  // Session stats functions
  const updateSessionStats = useCallback((updates: Partial<IDESessionStats>) => {
    setSessionStats(prev => ({ ...prev, ...updates }))
  }, [])

  const incrementLinesWritten = useCallback((lines: number) => {
    setSessionStats(prev => ({
      ...prev,
      linesWritten: prev.linesWritten + lines
    }))
  }, [])

  const incrementToolsCreated = useCallback(() => {
    setSessionStats(prev => ({
      ...prev,
      toolsCreated: prev.toolsCreated + 1
    }))
  }, [])

  // Memoized terminal state
  const terminalState = useMemo<IDETerminalState>(() => ({
    output,
    isRunning,
    waitingForInput,
    currentPrompt,
    userInput,
    replMode,
    replInput,
    commandHistory,
    historyIndex,
    terminalCollapsed: false,
    terminalScrollLock
  }), [
    output,
    isRunning,
    waitingForInput,
    currentPrompt,
    userInput,
    replMode,
    replInput,
    commandHistory,
    historyIndex,
    terminalScrollLock
  ])

  return {
    // State
    sessionStats,
    terminalState,
    
    // Terminal functions
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
    setHistoryIndex,
    
    // Session stats functions
    updateSessionStats,
    incrementLinesWritten,
    incrementToolsCreated
  }
} 