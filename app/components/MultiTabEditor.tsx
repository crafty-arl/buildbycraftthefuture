'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Plus, 
  X, 
  Save, 
  Play, 
  Download,
  Settings,
  FileText,
  Circle,
  Loader2
} from 'lucide-react'
import { EditorTab, UserTool } from '../types/builderTypes'

interface MultiTabEditorProps {
  tabs: EditorTab[]
  activeTabId?: string
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabSave: (tabId: string, content: string) => void
  onNewTab: () => void
  onRunCode: (code: string) => void
  onSaveAsTool: (content: string, tabName: string) => void
  isRunning?: boolean
  className?: string
}

export default function MultiTabEditor({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabSave,
  onNewTab,
  onRunCode,
  onSaveAsTool,
  isRunning = false,
  className = ""
}: MultiTabEditorProps) {
  const [editorContent, setEditorContent] = useState<{ [key: string]: string }>({})
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false)
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]

  // Initialize Monaco Editor
  useEffect(() => {
    const loadMonaco = async () => {
      try {
        // Import Monaco dynamically
        const monaco = await import('monaco-editor')
        
        // Configure Monaco for Python
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        })

        // Set Python language configuration
        monaco.languages.register({ id: 'python' })
        
        monacoRef.current = monaco
        setIsMonacoLoaded(true)
      } catch (error) {
        console.error('Failed to load Monaco editor:', error)
      }
    }

    loadMonaco()
  }, [])

  // Initialize editor content from tabs
  useEffect(() => {
    const newContent: { [key: string]: string } = {}
    tabs.forEach(tab => {
      newContent[tab.id] = tab.content
    })
    setEditorContent(newContent)
  }, [tabs])

  // Create Monaco editor instance
  useEffect(() => {
    if (isMonacoLoaded && monacoRef.current && activeTab) {
      const editorContainer = document.getElementById('monaco-editor')
      if (editorContainer && !editorRef.current) {
        editorRef.current = monacoRef.current.editor.create(editorContainer, {
          value: activeTab.content || '',
          language: 'python',
          theme: 'vs-dark',
          fontSize: 14,
          fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
          lineNumbers: 'on',
          wordWrap: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          matchBrackets: 'always',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true
        })

        // Listen for content changes
        editorRef.current.onDidChangeModelContent(() => {
          if (activeTab) {
            const content = editorRef.current.getValue()
            setEditorContent(prev => ({
              ...prev,
              [activeTab.id]: content
            }))
          }
        })
      }
    }
  }, [isMonacoLoaded, activeTab])

  // Update editor content when active tab changes
  useEffect(() => {
    if (editorRef.current && activeTab) {
      const content = editorContent[activeTab.id] || activeTab.content || ''
      if (editorRef.current.getValue() !== content) {
        editorRef.current.setValue(content)
      }
    }
  }, [activeTab, editorContent])

  const handleTabClick = (tabId: string) => {
    if (activeTab && editorRef.current) {
      // Save current content before switching
      const content = editorRef.current.getValue()
      setEditorContent(prev => ({
        ...prev,
        [activeTab.id]: content
      }))
    }
    onTabChange(tabId)
  }

  const handleSave = () => {
    if (activeTab && editorRef.current) {
      const content = editorRef.current.getValue()
      onTabSave(activeTab.id, content)
    }
  }

  const handleRun = () => {
    if (activeTab && editorRef.current) {
      const content = editorRef.current.getValue()
      onRunCode(content)
    }
  }

  const handleSaveAsTool = () => {
    if (activeTab && editorRef.current) {
      const content = editorRef.current.getValue()
      onSaveAsTool(content, activeTab.name)
    }
  }

  const getTabDisplayName = (tab: EditorTab) => {
    if (tab.name.endsWith('.py')) {
      return tab.name
    }
    return `${tab.name}.py`
  }

  const isTabModified = (tab: EditorTab) => {
    const currentContent = editorContent[tab.id] || tab.content || ''
    return currentContent !== tab.content
  }

  return (
    <div className={`h-full bg-build-surface flex flex-col ${className}`}>
      {/* Tab Bar */}
      <div className="flex items-center bg-build-surface border-b border-build-border overflow-x-auto">
        {/* Tabs */}
        <div className="flex items-center flex-1 min-w-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-r border-build-border hover:bg-tan-50 transition-colors relative group ${
                tab.id === activeTabId ? 'bg-build-surface text-build-text' : 'bg-tan-50/50 text-build-muted'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-mono truncate max-w-32">
                {getTabDisplayName(tab)}
              </span>
              
              {/* Modified indicator */}
              {isTabModified(tab) && (
                <Circle className="w-2 h-2 text-build-accent fill-current flex-shrink-0" />
              )}
              
              {/* Close button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabClose(tab.id)
                  }}
                  className="p-1 rounded hover:bg-tan-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Active tab indicator */}
              {tab.id === activeTabId && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-build-accent" />
              )}
            </button>
          ))}
          
          {/* Add new tab button */}
          <button
            onClick={onNewTab}
            className="p-3 hover:bg-tan-50 text-build-muted hover:text-build-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center space-x-2 px-4 border-l border-build-border">
          <button
            onClick={handleSave}
            className="p-2 rounded hover:bg-tan-100 text-build-muted hover:text-build-accent transition-colors"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1 px-3 py-2 bg-build-accent text-white rounded hover:bg-build-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Run Code (Ctrl+Enter)"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span className="text-sm font-mono">Run</span>
          </button>
          
          <button
            onClick={handleSaveAsTool}
            className="p-2 rounded hover:bg-tan-100 text-build-muted hover:text-build-accent transition-colors"
            title="Save as Tool"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            className="p-2 rounded hover:bg-tan-100 text-build-muted hover:text-build-accent transition-colors"
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative">
        {activeTab ? (
          <div className="h-full">
            {isMonacoLoaded ? (
              <div id="monaco-editor" className="h-full w-full" />
            ) : (
              <div className="h-full flex items-center justify-center bg-tan-50">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-build-accent mx-auto" />
                  <div className="text-sm text-build-muted font-mono">
                    Loading Python Editor...
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-tan-50">
            <div className="text-center space-y-4">
              <FileText className="w-12 h-12 text-build-muted mx-auto" />
              <div className="space-y-2">
                <div className="text-lg font-mono text-build-text">
                  Welcome to Future Builder Studio
                </div>
                <div className="text-sm text-build-muted max-w-md">
                  Create a new Python file to start building tools that shape the future.
                  Every script you write becomes part of your builder portfolio.
                </div>
                <button
                  onClick={onNewTab}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-build-accent text-white rounded-lg hover:bg-build-accent/90 transition-colors font-mono"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Tool</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Status Bar */}
        {activeTab && (
          <div className="absolute bottom-0 left-0 right-0 bg-tan-50/90 border-t border-build-border px-4 py-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-4">
                <span className="text-build-muted">
                  {getTabDisplayName(activeTab)}
                </span>
                <span className="text-build-muted">
                  Python
                </span>
                {isTabModified(activeTab) && (
                  <span className="text-build-accent">
                    • Modified
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-build-muted">
                <span>UTF-8</span>
                <span>LF</span>
                <span>Spaces: 4</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="hidden" id="keyboard-shortcuts">
        <div className="text-xs text-build-muted space-y-1">
          <div>Ctrl+S: Save</div>
          <div>Ctrl+Enter: Run Code</div>
          <div>Ctrl+T: New Tab</div>
          <div>Ctrl+W: Close Tab</div>
        </div>
      </div>
    </div>
  )
} 