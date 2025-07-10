'use client'

import { useState, useEffect, useCallback } from 'react'

export type PythonStatus = 'loading' | 'ready' | 'error'

export function usePythonRuntime() {
  const [pythonStatus, setPythonStatus] = useState<PythonStatus>('loading')
  const [statusMessage, setStatusMessage] = useState('Initializing Python runtime...')

  // Initialize Python runtime status
  useEffect(() => {
    const checkPythonStatus = async () => {
      try {
        // Import python runner and check status
        const pythonRunner = await import('../utils/python-runner')
        
        setStatusMessage('Loading Python from CDN...')
        
        // Check if already ready, otherwise initialize
        if (!pythonRunner.isPyodideReady()) {
          await pythonRunner.initializePyodide()
        }
        
        setPythonStatus('ready')
        setStatusMessage('Python environment ready • CDN-based execution')
        
      } catch (error) {
        setPythonStatus('error')
        setStatusMessage('Python CDN loading failed')
        console.error('Python initialization failed:', error)
      }
    }

    checkPythonStatus()
  }, [])

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  return {
    pythonStatus,
    statusMessage,
    formatTime
  }
} 