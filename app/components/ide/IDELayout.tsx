'use client'

import { ReactNode } from 'react'

interface IDELayoutProps {
  sidebar: ReactNode
  editor: ReactNode
  terminal?: ReactNode
  showTerminal?: boolean
  className?: string
}

export default function IDELayout({
  sidebar,
  editor,
  terminal,
  showTerminal = true,
  className = ""
}: IDELayoutProps) {
  return (
    <div className={`flex-1 flex overflow-hidden ${className}`}>
      {/* Sidebar - Always visible, fixed width */}
      <div className="w-64 border-r border-build-border flex-shrink-0">
        {sidebar}
      </div>

      {/* Main content area - Editor and Terminal */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Code Editor - Takes remaining width and adjusts based on terminal visibility */}
        <div className={`flex-1 ${showTerminal ? 'h-1/2 lg:h-full border-r-0 lg:border-r border-build-border border-b lg:border-b-0' : 'h-full'}`}>
          {editor}
        </div>

        {/* Terminal - Conditionally rendered */}
        {showTerminal && terminal && (
          <div className="w-full lg:w-80 h-1/2 lg:h-full">
            {terminal}
          </div>
        )}
      </div>
    </div>
  )
} 