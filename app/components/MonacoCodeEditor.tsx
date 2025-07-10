'use client'

import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'

interface MonacoCodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string | number
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  minimap?: boolean
  lineNumbers?: boolean
  wordWrap?: boolean
  fontSize?: number
}

export default function MonacoCodeEditor({
  value,
  onChange,
  placeholder = "# Start coding here...",
  height = "400px",
  language = "python",
  theme = "dark",
  readOnly = false,
  minimap = true,
  lineNumbers = true,
  wordWrap = true,
  fontSize = 14
}: MonacoCodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    editorRef.current = editor
    
    // Focus the editor
    editor.focus()
    
    // Set up placeholder text when empty
    if (!value) {
      editor.setValue(placeholder)
      // Use the correct Monaco Range and Selection API
      const range = new monaco.Range(1, 1, 1, placeholder.length + 1)
      editor.setSelection(range)
    }
  }

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue)
    }
  }

  // Configure Monaco Editor options
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true,
    minimap: { enabled: minimap },
    fontSize: fontSize,
    lineNumbers: lineNumbers ? 'on' : 'off',
    wordWrap: wordWrap ? 'on' : 'off',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    contextmenu: true,
    readOnly: readOnly,
    cursorStyle: 'line',
    cursorBlinking: 'smooth',
    smoothScrolling: true,
    multiCursorModifier: 'ctrlCmd',
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    quickSuggestions: true,
    parameterHints: {
      enabled: true
    },
    hover: {
      enabled: true
    },
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'always',
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    padding: {
      top: 16,
      bottom: 16
    }
  }

  return (
    <div className="w-full h-full border-0 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading Monaco Editor...</p>
            </div>
          </div>
        }
      />
    </div>
  )
} 