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
      {/* Sidebar - Responsive behavior */}
      <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-build-border flex-shrink-0 lg:flex-shrink-0">
        <div className="h-full overflow-y-auto">
          {sidebar}
        </div>
      </div>

      {/* Main content area - Editor and Terminal */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Code Editor - Responsive sizing */}
        <div className={`flex-1 ${showTerminal ? 'h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-build-border' : 'h-full'}`}>
          {editor}
        </div>

        {/* Terminal - Conditionally rendered with responsive sizing */}
        {showTerminal && terminal && (
          <div className="w-full lg:w-80 h-1/2 lg:h-full">
            {terminal}
          </div>
        )}
      </div>
    </div>
  )
} 