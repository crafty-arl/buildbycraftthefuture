'use client'

import { useState } from 'react'
import { Terminal, Menu, X, ExternalLink, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from '../auth/AuthButton'

interface HeaderProps {
  showNavigation?: boolean
  showUserActions?: boolean
  currentPage?: 'home' | 'sandbox' | 'learn' | 'tools' | 'profile' | 'upgrade'
  onBackClick?: () => void
  showBackButton?: boolean
}

export default function Header({ 
  showNavigation = true, 
  showUserActions = true, 
  currentPage = 'home',
  onBackClick,
  showBackButton = false
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Tools', href: '/#tools', current: pathname === '/' },
    { name: 'Features', href: '/#features', current: pathname === '/' },
    { name: 'Profile', href: '/profile', current: pathname === '/profile' },
    { name: 'Season Pass', href: '/upgrade', current: pathname === '/upgrade' }
  ]

  const getPageTitle = () => {
    switch (currentPage) {
      case 'sandbox':
        return '/build/sandbox'
      case 'learn':
        return '/build/learn'
      case 'tools':
        return '/build/tools'
      case 'profile':
        return '/build/profile'
      case 'upgrade':
        return '/build/upgrade'
      default:
        return '/build'
    }
  }

  const getPageIcon = () => {
    switch (currentPage) {
      case 'sandbox':
        return '🔧'
      case 'learn':
        return '📚'
      default:
        return '🐍'
    }
  }

  return (
    <header className="bg-build-surface/80 backdrop-blur-sm border-b border-build-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto container-padding py-3 sm:py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {showBackButton && onBackClick && (
              <button
                onClick={onBackClick}
                className="p-2 rounded hover:bg-tan-100 transition-colors touch-target"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-build-muted" />
              </button>
            )}
            <div className="bg-build-accent p-1.5 sm:p-2 rounded-lg shadow-sm orange-glow">
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold text-build-text font-mono">/build</span>
              {currentPage !== 'home' && (
                <>
                  <span className="text-build-muted">/</span>
                  <span className="text-sm sm:text-base text-build-muted font-mono">
                    {currentPage}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          {showNavigation && (
            <nav className="flex items-center space-x-4 lg:space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-build-muted hover:text-build-accent transition-colors font-mono text-sm lg:text-base touch-target"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          )}

          {/* User Actions */}
          {showUserActions && (
            <div className="flex items-center space-x-2">
              <AuthButton />
            </div>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              {showBackButton && onBackClick && (
                <button
                  onClick={onBackClick}
                  className="p-2 text-build-muted hover:text-build-accent transition-colors touch-target"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="bg-build-accent p-1.5 rounded-lg shadow-sm orange-glow">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-bold text-build-text font-mono">/build</span>
                {currentPage !== 'home' && (
                  <>
                    <span className="text-build-muted">/</span>
                    <span className="text-sm text-build-muted font-mono">
                      {currentPage}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button and Auth */}
            <div className="flex items-center space-x-2">
              {showUserActions && <AuthButton />}
              {showNavigation && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-build-muted hover:text-build-accent transition-colors touch-target"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation - Enhanced with smooth animation */}
          {showNavigation && (
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              mobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <nav className="mt-3 pt-3 border-t border-build-border nav-mobile">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-build-muted hover:text-build-accent transition-colors font-mono touch-target py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 