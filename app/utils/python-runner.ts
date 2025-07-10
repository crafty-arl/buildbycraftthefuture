// Global Pyodide interface
declare global {
  interface Window {
    loadPyodide: (config?: {
      indexURL?: string
      stdout?: (text: string) => void
      stderr?: (text: string) => void
    }) => Promise<any>
  }
}

let pyodideInstance: any = null
let isInitializing = false
let pendingInput: { resolve: (value: string) => void, prompt: string } | null = null

async function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Pyodide can only be loaded in the browser'))
      return
    }

    // Check if script is already loaded
    if (typeof window.loadPyodide === 'function') {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Pyodide script'))
    document.head.appendChild(script)
  })
}

export async function initializePyodide(): Promise<any> {
  if (pyodideInstance) {
    return pyodideInstance
  }

  if (isInitializing) {
    // Wait for the current initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    if (pyodideInstance) {
      return pyodideInstance
    }
    throw new Error('Pyodide initialization failed')
  }

  isInitializing = true

  try {
    // Load Pyodide script from CDN
    await loadPyodideScript()
    
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    })

    // Pre-load essential data science packages for Python learning path
    try {
      await pyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn'])
      console.log('📊 Data science packages loaded successfully')
    } catch (error) {
      console.warn('⚠️ Some data science packages failed to load:', error)
      // Continue without data science packages - basic Python will still work
    }

    // Set up stdout/stderr capture and natural input handling
    pyodideInstance.runPython(`
import sys
from io import StringIO
import contextlib
import traceback
import builtins
import asyncio

# Create persistent IO objects
_stdout_buffer = StringIO()
_stderr_buffer = StringIO()

def get_output():
    stdout_content = _stdout_buffer.getvalue()
    stderr_content = _stderr_buffer.getvalue()
    # Clear buffers for next execution
    _stdout_buffer.seek(0)
    _stdout_buffer.truncate(0)
    _stderr_buffer.seek(0)
    _stderr_buffer.truncate(0)
    return stdout_content, stderr_content

def safe_exec(code_str):
    try:
        # Clear any previous output
        _stdout_buffer.seek(0)
        _stdout_buffer.truncate(0)
        _stderr_buffer.seek(0)
        _stderr_buffer.truncate(0)
        
        # Use exec with both local and global scope
        exec_globals = dict(globals())
        exec_locals = {}
        
        # Redirect stdout and stderr safely - capture everything raw
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        
        try:
            sys.stdout = _stdout_buffer
            sys.stderr = _stderr_buffer
            exec(code_str, exec_globals, exec_locals)
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr
            
        # Update globals with any new variables
        globals().update(exec_locals)
        return True, None
    except Exception as e:
        # Capture raw error output - no formatting
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        
        try:
            sys.stdout = _stdout_buffer
            sys.stderr = _stderr_buffer
            # Print the full traceback exactly as Python would
            traceback.print_exc()
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr
            
        return False, None  # Don't return custom error message

# Natural input handling - like a real Python terminal
original_input = builtins.input
_waiting_for_input = False
_current_prompt = ""
_input_value = None
_paused_execution = None

def browser_input(prompt=""):
    global _waiting_for_input, _current_prompt, _input_value
    _current_prompt = prompt
    _waiting_for_input = True
    
    # Print the prompt immediately
    if prompt:
        print(prompt, end="", flush=True)
    
    # Throw a special exception that we can catch
    raise InputRequiredException(prompt)

class InputRequiredException(Exception):
    def __init__(self, prompt):
        self.prompt = prompt
        super().__init__(f"Input required: {prompt}")

# Replace input function
builtins.input = browser_input

def is_waiting_for_input():
    return _waiting_for_input

def get_current_prompt():
    return _current_prompt

def provide_input(user_input):
    global _waiting_for_input, _input_value
    _waiting_for_input = False
    _input_value = user_input
    return user_input

def get_provided_input():
    global _input_value
    result = _input_value
    _input_value = None
    return result

def clear_input_state():
    global _waiting_for_input, _current_prompt, _input_value
    _waiting_for_input = False
    _current_prompt = ""
    _input_value = None
`)

    // Load common packages silently in background
    try {
      await pyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib', 'requests'])
      console.log('✅ Python packages loaded: numpy, pandas, matplotlib, requests')
    } catch (error) {
      console.warn('⚠️ Some Python packages could not be loaded:', error)
      // Try loading basic packages
      try {
        await pyodideInstance.loadPackage(['numpy'])
        console.log('✅ Basic Python packages loaded: numpy')
      } catch (basicError) {
        console.warn('⚠️ Could not load any packages, running with standard library only')
      }
    }
    
    isInitializing = false
    return pyodideInstance
  } catch (error) {
    isInitializing = false
    console.error('❌ Failed to initialize Pyodide:', error)
    throw error
  }
}

export async function runPythonCode(code: string): Promise<{ 
  output: string; 
  error: string | null;
  waitingForInput?: boolean;
  prompt?: string;
}> {
  try {
    const pyodide = await initializePyodide()
    
    // Clean and prepare the code
    const cleanCode = code.trim()
    if (!cleanCode) {
      return { output: '', error: null }
    }

    console.log('🐍 Executing Python code:', cleanCode.substring(0, 100) + (cleanCode.length > 100 ? '...' : ''))
    
    // Check if pyodide instance is valid
    if (!pyodide) {
      console.error('❌ Pyodide instance is null')
      return {
        output: '',
        error: 'Python environment not initialized'
      }
    }

    // Test if basic Python functions are available
    try {
      const testResult = pyodide.runPython('1 + 1')
      console.log('✅ Basic Python test successful:', testResult)
    } catch (testError) {
      console.error('❌ Basic Python test failed:', testError)
      return {
        output: '',
        error: 'Python environment is not working properly'
      }
    }

    // Clear previous input state safely
    try {
      pyodide.runPython(`clear_input_state()`)
    } catch (clearError) {
      console.warn('⚠️ Could not clear input state:', clearError)
    }
    
    // Store the user code in a Python variable to avoid escaping issues
    try {
      pyodide.globals.set('user_code', cleanCode)
      console.log('✅ User code stored in Python globals')
    } catch (setError) {
      console.error('❌ Failed to set user code:', setError)
      return {
        output: '',
        error: 'Failed to prepare code for execution'
      }
    }
    
    // Execute the code safely using the stored variable
    try {
      console.log('🚀 Executing Python code...')
      const result = pyodide.runPython(`
# Execute user code and capture result
def execute_and_return():
    try:
        success, error_msg = safe_exec(user_code)
        stdout_content, stderr_content = get_output()
        waiting = is_waiting_for_input()
        current_prompt = get_current_prompt()
        
        # Return results as a tuple - this should always return something
        result_tuple = (success, error_msg, stdout_content, stderr_content, waiting, current_prompt)
        print(f"Debug: Result tuple created: {type(result_tuple)}, content: {result_tuple[:2]}")
        return result_tuple
    except InputRequiredException as e:
        # Code is waiting for input
        stdout_content, stderr_content = get_output()
        result_tuple = (True, None, stdout_content, stderr_content, True, str(e.prompt))
        print(f"Debug: Input required tuple: {type(result_tuple)}")
        return result_tuple
    except Exception as e:
        # Any other error
        print(f"Debug: Exception in Python execution: {e}")
        import traceback
        traceback.print_exc()
        return ("ERROR", str(e), "", str(e), False, "")

# Call the function and return its result
execute_and_return()
`)

      console.log('✅ Python execution completed, result type:', typeof result)
      console.log('✅ Python execution result:', result)

      // Check if result is valid before calling toJs()
      if (result === undefined || result === null) {
        console.error('❌ Python execution returned undefined/null')
        return {
          output: '',
          error: 'Python execution returned no result - code may have syntax errors'
        }
      }

      if (typeof result.toJs !== 'function') {
        console.error('❌ Python result does not have toJs method, type:', typeof result)
        console.error('❌ Python result value:', result)
        return {
          output: '',
          error: 'Python execution result is not convertible to JavaScript'
        }
      }

      const resultArray = result.toJs()
      console.log('✅ Converted to JS array:', resultArray)

      if (!Array.isArray(resultArray) || resultArray.length < 6) {
        console.error('❌ Invalid result array:', resultArray)
        return {
          output: '',
          error: 'Python execution returned invalid result format'
        }
      }

      const [success, errorMsg, stdout, stderr, waitingForInput, prompt] = resultArray

      // If there's stderr content, return it as error (raw Python error)
      if (stderr && stderr.trim()) {
        return {
          output: stdout || '',
          error: stderr.trim()
        }
      }

      // Check if code is waiting for input
      if (waitingForInput) {
        return {
          output: stdout || '',
          error: null,
          waitingForInput: true,
          prompt: prompt || ''
        }
      }

      // Return raw stdout content
      return {
        output: stdout || '',
        error: null
      }
    } catch (executionError) {
      console.error('❌ Python execution error:', executionError)
      
      // Try to get any output that was captured before the error
      try {
        const fallbackResult = pyodide.runPython(`
try:
    stdout_content, stderr_content = get_output()
    waiting = is_waiting_for_input()
    current_prompt = get_current_prompt()
    (False, None, stdout_content, stderr_content, waiting, current_prompt)
except:
    (False, None, "", str(Exception("Execution failed")), False, "")
`)
        
        if (fallbackResult && typeof fallbackResult.toJs === 'function') {
          const [success, errorMsg, stdout, stderr, waitingForInput, prompt] = fallbackResult.toJs()
          return {
            output: stdout || '',
            error: stderr || String(executionError)
          }
        }
      } catch (fallbackError) {
        console.error('❌ Fallback execution also failed:', fallbackError)
      }
      
      return {
        output: '',
        error: `Execution error: ${executionError instanceof Error ? executionError.message : String(executionError)}`
      }
    }
  } catch (error) {
    console.error('❌ System-level error in runPythonCode:', error)
    return {
      output: '',
      error: `System error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

export async function continueWithInput(userInput: string): Promise<{
  output: string;
  error: string | null;
  waitingForInput?: boolean;
  prompt?: string;
}> {
  try {
    const pyodide = await initializePyodide()
    
    // Store the input and modify the input function to return it
    const result = pyodide.runPython(`
# Provide the user input
provide_input("${userInput.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")

# Create a new input function that will return the provided value once
def continue_input(prompt=""):
    global _input_value
    if _input_value is not None:
        result = _input_value
        _input_value = None
        return result
    else:
        # If no more input available, use the original behavior
        return browser_input(prompt)

# Temporarily replace the input function
old_input = builtins.input
builtins.input = continue_input

try:
    # Re-execute the last code block that was waiting for input
    # For now, just indicate that input was provided
    stdout_content, stderr_content = get_output()
    waiting = is_waiting_for_input()
    current_prompt = get_current_prompt()
    (True, None, stdout_content, stderr_content, waiting, current_prompt)
finally:
    # Restore original input handling
    builtins.input = old_input
`)

    // Check if result is valid before calling toJs()
    if (!result || typeof result.toJs !== 'function') {
      console.error('Invalid Python execution result in continueWithInput:', result)
      return {
        output: '',
        error: 'Python execution failed - invalid result'
      }
    }

    const [success, errorMsg, stdout, stderr, waitingForInput, prompt] = result.toJs()

    return {
      output: stdout || '',
      error: stderr || null,
      waitingForInput: waitingForInput || false,
      prompt: prompt || undefined
    }
  } catch (error) {
    console.error('❌ Error continuing with input:', error)
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export function isPyodideReady(): boolean {
  return pyodideInstance !== null
}

export async function loadPythonPackage(packageName: string): Promise<boolean> {
  try {
    const pyodide = await initializePyodide()
    await pyodide.loadPackage(packageName)
    console.log(`✅ Loaded Python package: ${packageName}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to load package ${packageName}:`, error)
    return false
  }
}

export function getAvailablePackages(): string[] {
  return [
    'numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn',
    'requests', 'beautifulsoup4', 'pillow', 'sympy', 'networkx',
    'seaborn', 'plotly', 'statsmodels', 'opencv-python'
  ]
}

export async function getLoadedPackages(): Promise<string[]> {
  try {
    const pyodide = await initializePyodide()
    const result = pyodide.runPython(`
import sys
loaded_packages = []
for module_name in sys.modules:
    if not module_name.startswith('_') and '.' not in module_name:
        loaded_packages.append(module_name)
sorted(list(set(loaded_packages)))
`)
    
    // Check if result is valid before calling toJs()
    if (!result || typeof result.toJs !== 'function') {
      console.error('Invalid Python execution result in getLoadedPackages:', result)
      return []
    }
    
    return result.toJs()
  } catch (error) {
    console.error('Failed to get loaded packages:', error)
    return []
  }
} 