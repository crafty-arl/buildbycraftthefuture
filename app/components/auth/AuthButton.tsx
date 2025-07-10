'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { LogIn, LogOut, User, Github } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  // Debug session state in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthButton - Session status:', status)
      console.log('AuthButton - Session data:', session)
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-8 h-8 bg-build-muted/20 rounded-full"></div>
        <span className="text-sm text-build-muted">Loading...</span>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <button
        onClick={() => signIn()}
        className="btn-primary text-sm group"
      >
        <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        <span>Sign In</span>
      </button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        <Link href="/profile" className="flex items-center space-x-2 text-build-text hover:text-build-accent transition-colors">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-8 h-8 rounded-full border-2 border-build-border"
            />
          ) : (
            <User className="w-8 h-8 p-1 bg-build-surface rounded-full border-2 border-build-border text-build-text" />
          )}
          <span className="hidden sm:inline font-mono text-sm text-build-text">
            {session.user?.name || 'Profile'}
          </span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn-minimal text-sm"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Sign Out</span>
        </button>
      </div>
    )
  }

  // Fallback for unexpected states
  return (
    <button
      onClick={() => signIn()}
      className="btn-primary text-sm group"
    >
      <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
      <span>Sign In</span>
    </button>
  )
} 