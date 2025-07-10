'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutWrapperProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  fullHeight?: boolean
  currentPage?: 'home' | 'sandbox' | 'learn' | 'tools' | 'profile' | 'upgrade'
  showNavigation?: boolean
  showUserActions?: boolean
  showBackButton?: boolean
  onBackClick?: () => void
  className?: string
}

export default function LayoutWrapper({
  children,
  showHeader = true,
  showFooter = true,
  fullHeight = false,
  currentPage = 'home',
  showNavigation = true,
  showUserActions = true,
  showBackButton = false,
  onBackClick,
  className = ""
}: LayoutWrapperProps) {
  return (
    <div className={`min-h-screen bg-build-bg build-grid ${fullHeight ? 'h-screen' : ''} ${className}`}>
      {/* Header */}
      {showHeader && (
        <Header
          showNavigation={showNavigation}
          showUserActions={showUserActions}
          currentPage={currentPage}
          showBackButton={showBackButton}
          onBackClick={onBackClick}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 ${fullHeight ? 'h-full overflow-hidden' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer 
          showFullFooter={currentPage === 'home'} 
        />
      )}
    </div>
  )
} 