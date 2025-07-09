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

    // Set up stdout/stderr capture and execution environment
    pyodideInstance.runPython(`
import sys
from io import StringIO
import contextlib
import traceback
import builtins

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
        
        # Redirect stdout and stderr safely
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
        # Capture error output safely
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        
        try:
            sys.stdout = _stdout_buffer
            sys.stderr = _stderr_buffer
            traceback.print_exc()
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr
            
        return False, str(e)

# Set up enhanced print function for better output
original_print = builtins.print
def enhanced_print(*args, **kwargs):
    # Convert args to strings and handle special types
    str_args = []
    for arg in args:
        if hasattr(arg, '__dict__') and hasattr(arg, '__class__'):
            # For objects, show a meaningful representation
            str_args.append(f"<{arg.__class__.__name__} object>")
        else:
            str_args.append(str(arg))
    
    # Call original print with processed args
    original_print(*str_args, **kwargs)

builtins.print = enhanced_print

# Terminal-like input handling for browser environment
original_input = builtins.input
_input_queue = []
_input_prompts = []
_waiting_for_input = False

def terminal_input(prompt=""):
    global _waiting_for_input
    if prompt:
        print(prompt, end="", flush=True)
    
    _input_prompts.append(prompt)
    _waiting_for_input = True
    
    # Return a placeholder that will be replaced
    return "__WAITING_FOR_INPUT__"

builtins.input = terminal_input

def set_input_responses(responses):
    global _input_queue
    _input_queue = responses[:]

def get_input_prompts():
    return _input_prompts[:]

def is_waiting_for_input():
    return _waiting_for_input

def clear_input_state():
    global _input_queue, _input_prompts, _waiting_for_input
    _input_queue = []
    _input_prompts = []
    _waiting_for_input = False
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
      return { output: 'No code to execute.', error: null }
    }
    
    // Clear previous input state
    pyodide.runPython(`clear_input_state()`)
    
    // Execute the code safely
    const result = pyodide.runPython(`
# Execute user code and capture result
success, error_msg = safe_exec("""${cleanCode.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}""")
stdout_content, stderr_content = get_output()
waiting = is_waiting_for_input()
prompts = get_input_prompts()

# Return results as a tuple
(success, error_msg, stdout_content, stderr_content, waiting, prompts)
`)

    const [success, errorMsg, stdout, stderr, waitingForInput, prompts] = result.toJs()

    if (!success) {
      return {
        output: stdout || '',
        error: errorMsg || stderr || 'Python execution error'
      }
    }

    if (stderr && stderr.trim()) {
      return {
        output: stdout || '',
        error: stderr
      }
    }

    // Check if code is waiting for input
    if (waitingForInput && prompts.length > 0) {
      const currentPrompt = prompts[prompts.length - 1]
      return {
        output: stdout || '',
        error: null,
        waitingForInput: true,
        prompt: currentPrompt
      }
    }

    return {
      output: stdout || '✅ Code executed successfully!',
      error: null
    }
  } catch (error) {
    console.error('❌ Python execution error:', error)
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
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
    
    // Continue execution with user input
    const result = pyodide.runPython(`
# Simulate user input by replacing placeholder and continuing
import builtins
import sys

# Get current output and add user input
stdout_content, stderr_content = get_output()
print("${userInput.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")

# Reset input state and continue
_waiting_for_input = False

# Return the updated output
stdout_content, stderr_content = get_output()
(True, None, stdout_content, stderr_content, False, [])
`)

    const [success, errorMsg, stdout, stderr] = result.toJs()

    if (!success) {
      return {
        output: stdout || '',
        error: errorMsg || stderr || 'Execution error'
      }
    }

    return {
      output: stdout || '',
      error: null
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
    return result.toJs()
  } catch (error) {
    console.error('Failed to get loaded packages:', error)
    return []
  }
} 