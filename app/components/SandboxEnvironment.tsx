'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Play, RotateCcw, Terminal, ArrowLeft, Code, Zap, Home, Copy, CheckCircle } from 'lucide-react'
import MonacoCodeEditor from './MonacoCodeEditor'

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

type Language = 'python' | 'javascript'

interface SandboxEnvironmentProps {
  onClose?: () => void
}

function SandboxEnvironmentComponent({ onClose }: SandboxEnvironmentProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('python')
  const [pythonCode, setPythonCode] = useState(`# Welcome to Python Sandbox! 🐍
print("Hello from Python!")

# Try some Python magic:
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Squared numbers: {squared}")

# Real Python features available:
import math
print(f"Pi: {math.pi:.4f}")

# Build something amazing!
# Note: For interactive input() functions, use the Learn IDE instead!`)

  const [jsCode, setJsCode] = useState(`// Welcome to JavaScript Sandbox! ⚡
console.log("Hello from JavaScript!");

// Try some JS magic:
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x ** 2);
console.log("Squared numbers:", squared);

// Modern JavaScript features:
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("Builder"));

// DOM manipulation available:
// document.body.style.background = "linear-gradient(45deg, #f97316, #ff006e)";

// Build something amazing!`)

  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isPyodideReady, setIsPyodideReady] = useState(false)
  const [copied, setCopied] = useState(false)

  const pythonUtils = usePythonRunner()

  // Initialize Python environment
  useEffect(() => {
    if (!pythonUtils) return

    const initPython = async () => {
      if (pythonUtils.isPyodideReady()) {
        setIsPyodideReady(true)
        return
      }

      try {
        if (currentLanguage === 'python') {
          setOutput('🔄 Loading Python WebAssembly runtime...\n\nThis may take a few moments on first load.')
        }
        
        await pythonUtils.initializePyodide()
        setIsPyodideReady(true)
        if (currentLanguage === 'python') {
          setOutput('🐍 Full Python environment ready!\n\n✅ Real Python execution enabled\n✅ All standard libraries available\n✅ NumPy, Pandas, Matplotlib loaded\n\nStart coding with authentic Python!')
        }
      } catch (error) {
        console.error('Python initialization failed:', error)
        setIsPyodideReady(false)
        if (currentLanguage === 'python') {
          setOutput('⚠️ Python running in simulation mode\n\nReal Python execution not available.\nTry refreshing to retry loading from CDN.')
        }
      }
    }

    initPython()
  }, [pythonUtils, currentLanguage])

  // Set initial output based on language
  useEffect(() => {
    if (currentLanguage === 'python') {
      if (isPyodideReady) {
        setOutput('🐍 Full Python environment ready!\n\n✅ Real Python execution enabled\n✅ All standard libraries available\n✅ NumPy, Pandas, Matplotlib loaded\n\nStart coding with authentic Python!')
      } else {
        setOutput('⏳ Loading Python WebAssembly environment...\n\nPlease wait while we initialize real Python execution.')
      }
    } else {
      setOutput('⚡ JavaScript environment ready! Start coding...')
    }
  }, [currentLanguage, isPyodideReady])

  const getCurrentCode = () => {
    return currentLanguage === 'python' ? pythonCode : jsCode
  }

  const setCurrentCode = (code: string) => {
    if (currentLanguage === 'python') {
      setPythonCode(code)
    } else {
      setJsCode(code)
    }
  }

  const runPythonCode = async (code: string) => {
    if (pythonUtils && isPyodideReady) {
      try {
        const result = await pythonUtils.runPythonCode(code)
        
        if (result.waitingForInput) {
          // Handle input prompts in sandbox
          setOutput(result.output + (result.prompt || ''))
          return '⏳ Waiting for input...'
        }
        
        return result.error ? `❌ Error: ${result.error}` : result.output || '✅ Code executed successfully!'
      } catch (error) {
        return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    } else {
      // Fallback simulation
      return simulatePythonExecution(code)
    }
  }

  const simulatePythonExecution = (code: string) => {
    let result = ''
    const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))
    
    for (const line of lines) {
      const printMatch = line.match(/print\s*\(\s*(.+)\s*\)/)
      if (printMatch) {
        let content = printMatch[1].trim()
        if ((content.startsWith('"') && content.endsWith('"')) || 
            (content.startsWith("'") && content.endsWith("'"))) {
          content = content.slice(1, -1)
        }
        // Handle f-strings (basic)
        content = content.replace(/f["']([^"']*){([^}]+)}([^"']*)["']/, '$1[$2]$3')
        result += content + '\n'
      }
    }
    
    return result || '▊ Code executed in simulation mode'
  }

  const runJavaScriptCode = (code: string) => {
    const originalConsole = console.log
    const logs: string[] = []
    
    // Capture console.log
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '))
    }

    try {
      // Create a safe execution context
      const func = new Function(`
        ${code}
        return "✅ Code executed successfully!";
      `)
      
      const result = func()
      console.log = originalConsole
      
      return logs.length > 0 ? logs.join('\n') : result
    } catch (error) {
      console.log = originalConsole
      return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const runCode = async () => {
    const code = getCurrentCode().trim()
    if (!code) {
      setOutput('▊ Enter some code to execute.')
      return
    }

    setIsRunning(true)
    setOutput('⚡ Executing...')

    try {
      let result: string
      if (currentLanguage === 'python') {
        result = await runPythonCode(code)
      } else {
        result = runJavaScriptCode(code)
      }
      
      setOutput(result)
    } catch (error) {
      setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    if (currentLanguage === 'python') {
      setPythonCode(`# Welcome to Python Sandbox! 🐍
print("Hello from Python!")

# Try some Python magic:
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Squared numbers: {squared}")

# Real Python features available:
import math
print(f"Pi: {math.pi:.4f}")

# Build something amazing!
# Note: For interactive input() functions, use the Learn IDE instead!`)
    } else {
      setJsCode(`// Welcome to JavaScript Sandbox! ⚡
console.log("Hello from JavaScript!");

// Try some JS magic:
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x ** 2);
console.log("Squared numbers:", squared);

// Modern JavaScript features:
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("Builder"));

// DOM manipulation available:
// document.body.style.background = "linear-gradient(45deg, #f97316, #ff006e)";

// Build something amazing!`)
    }
    setOutput('')
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const languageConfig = {
    python: {
      name: 'Python',
      icon: '🐍',
      color: 'build-accent',
      bgColor: 'build-accent/10',
      borderColor: 'build-accent/30'
    },
    javascript: {
      name: 'JavaScript',
      icon: '⚡',
      color: 'build-pink-neon',
      bgColor: 'build-pink/10',
      borderColor: 'build-pink/30'
    }
  }

  const currentConfig = languageConfig[currentLanguage]

  return (
    <div className="h-screen flex flex-col bg-build-bg">
      {/* Header */}
      <header className="bg-build-surface border-b border-build-border p-3 sm:p-4">
        <div className="ide-header-mobile">
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`bg-${currentConfig.color} p-1.5 sm:p-2 rounded-lg shadow-sm ${currentLanguage === 'python' ? 'orange-glow' : 'pink-glow'} flex-shrink-0`}>
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-build-text font-mono truncate">/build/sandbox</h1>
            </div>
            
            {/* Mobile navigation */}
            <div className="flex items-center space-x-2 sm:hidden">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-build-muted hover:text-build-accent transition-colors touch-target"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <a
                href="/"
                className="p-2 text-build-muted hover:text-build-accent transition-colors touch-target"
              >
                <Home className="w-4 h-4" />
              </a>
            </div>
            
            {/* Language Selector - Hidden on mobile, will move to separate row */}
            <div className="hidden sm:flex items-center space-x-2 bg-tan-50 p-1 rounded-lg border border-build-border">
              {(['python', 'javascript'] as Language[]).map((lang) => {
                const config = languageConfig[lang]
                const isActive = currentLanguage === lang
                return (
                  <button
                    key={lang}
                    onClick={() => setCurrentLanguage(lang)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md transition-all font-mono text-sm font-medium touch-target ${
                      isActive 
                        ? `bg-${config.color} text-white shadow-sm ${lang === 'python' ? 'orange-glow' : 'pink-glow'}` 
                        : 'text-build-muted hover:text-build-text hover:bg-tan-100'
                    }`}
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span className="hidden lg:inline">{config.name}</span>
                    <span className="lg:hidden">{config.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile Language Selector */}
          <div className="sm:hidden mt-3">
            <div className="flex items-center space-x-2 bg-tan-50 p-1 rounded-lg border border-build-border">
              {(['python', 'javascript'] as Language[]).map((lang) => {
                const config = languageConfig[lang]
                const isActive = currentLanguage === lang
                return (
                  <button
                    key={lang}
                    onClick={() => setCurrentLanguage(lang)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all font-mono text-sm font-medium touch-target flex-1 justify-center ${
                      isActive 
                        ? `bg-${config.color} text-white shadow-sm ${lang === 'python' ? 'orange-glow' : 'pink-glow'}` 
                        : 'text-build-muted hover:text-build-text hover:bg-tan-100'
                    }`}
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span>{config.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-2 mt-2 sm:mt-0">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center space-x-1 px-3 py-2 text-build-muted hover:text-build-accent transition-colors font-mono touch-target"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <a
              href="/"
              className="flex items-center space-x-1 px-3 py-2 text-build-muted hover:text-build-accent transition-colors font-mono touch-target"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Editor Header */}
          <div className="bg-tan-50 px-3 sm:px-4 py-2 border-b border-build-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className={`text-${currentConfig.color} text-lg flex-shrink-0`}>{currentConfig.icon}</span>
                <span className="text-build-text text-xs sm:text-sm font-mono truncate">
                  {currentConfig.name} Sandbox
                  {currentLanguage === 'python' && (
                    <span className="ml-2 text-xs hidden sm:inline">
                      {isPyodideReady ? '(WebAssembly)' : '(Simulation)'}
                    </span>
                  )}
                </span>
              </div>
              
              <div className="code-toolbar-mobile flex-shrink-0">
                <button
                  onClick={copyCode}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-build-surface hover:bg-tan-100 text-build-text text-xs sm:text-sm rounded transition-colors font-mono border border-build-border touch-target"
                >
                  {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
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
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1 bg-${currentConfig.color} hover:bg-${currentLanguage === 'python' ? 'build-accent-dark' : 'build-pink'} disabled:opacity-50 text-white text-xs sm:text-sm rounded transition-colors font-mono font-medium ${currentLanguage === 'python' ? 'orange-glow' : 'pink-glow'} touch-target`}
                >
                  <Play className="w-3 h-3" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <MonacoCodeEditor
              value={getCurrentCode()}
              onChange={setCurrentCode}
              height="100%"
              language={currentLanguage === 'python' ? 'python' : 'javascript'}
              theme="dark"
              placeholder={`# Start coding in ${currentConfig.name}...\n# Try some ${currentConfig.name} magic!`}
              fontSize={14}
              minimap={false}
              wordWrap={true}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-full lg:w-96 bg-build-surface border-t lg:border-t-0 lg:border-l border-build-border flex flex-col output-panel-mobile">
          <div className={`bg-${currentConfig.bgColor} border-${currentConfig.borderColor} border-b px-3 sm:px-4 py-2`}>
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 text-${currentConfig.color}`} />
              <span className="text-xs sm:text-sm font-mono text-build-text">
                Terminal
                {currentLanguage === 'python' && (
                  <span className="ml-2 text-xs hidden sm:inline">
                    {isPyodideReady ? '(Real Python)' : '(Simulation)'}
                  </span>
                )}
              </span>
            </div>
          </div>
          
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <pre className="terminal-output-mobile font-mono text-build-text whitespace-pre-wrap">
              {output || (currentLanguage === 'python' 
                ? (isPyodideReady 
                  ? '🐍 Full Python environment ready!\n\n✅ Real Python execution enabled\n✅ All libraries loaded\n\n▊ Click "Run" to see authentic Python output.'
                  : '⏳ Loading Python WebAssembly...\n\nInitializing real Python execution.')
                : `⚡ JavaScript ready!\n\n▊ Click "Run" to execute code.`
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export with SSR disabled
export default dynamic(() => Promise.resolve(SandboxEnvironmentComponent), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-build-bg">
      <div className="flex items-center space-x-2 text-build-text">
        <Terminal className="w-5 h-5 animate-spin text-build-accent orange-glow" />
        <span className="font-mono">Loading Sandbox Environment...</span>
      </div>
    </div>
  )
}) 