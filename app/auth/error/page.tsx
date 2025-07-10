'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorDetails, setErrorDetails] = useState<{
    error: string | null
    errorDescription: string | null
  }>({
    error: null,
    errorDescription: null
  })

  useEffect(() => {
    const error = searchParams?.get('error')
    const errorDescription = searchParams?.get('error_description')
    
    setErrorDetails({
      error,
      errorDescription
    })

    // Log error details for debugging
    if (error) {
      console.error('Auth Error:', {
        error,
        errorDescription,
        fullURL: window.location.href
      })
    }
  }, [searchParams])

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There is a problem with the OAuth app configuration. Check your client ID and secret.',
          suggestion: 'Verify your OAuth app settings in GitHub/Google console.'
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You denied access to the application.',
          suggestion: 'Try signing in again and grant the necessary permissions.'
        }
      case 'Verification':
        return {
          title: 'Verification Error',
          message: 'The sign in link was invalid or has expired.',
          suggestion: 'Please try signing in again.'
        }
      case 'Default':
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication.',
          suggestion: 'Please try again or contact support if the problem persists.'
        }
    }
  }

  const errorInfo = getErrorMessage(errorDetails.error)

  return (
    <div className="min-h-screen bg-build-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-build-surface rounded-lg border border-red-800 p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-build-text mb-4">
            {errorInfo.title}
          </h1>
          
          <p className="text-build-muted mb-6">
            {errorInfo.message}
          </p>

          {errorDetails.errorDescription && (
            <div className="bg-red-950 border border-red-800 rounded p-4 mb-6">
              <p className="text-red-300 text-sm font-mono">
                {errorDetails.errorDescription}
              </p>
            </div>
          )}

          <div className="bg-build-bg rounded p-4 mb-6">
            <h3 className="font-medium text-build-text mb-2">Debug Information:</h3>
            <div className="text-sm text-build-muted space-y-1">
              <p><strong>Error Code:</strong> {errorDetails.error || 'None'}</p>
              <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
            </div>
          </div>

          <p className="text-sm text-build-accent mb-6">
            💡 {errorInfo.suggestion}
          </p>

          <div className="space-y-3">
            <Link 
              href="/auth/signin" 
              className="w-full btn-primary flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
            
            <Link 
              href="/auth/debug" 
              className="w-full btn-minimal flex items-center justify-center"
            >
              Debug Authentication
            </Link>
            
            <Link 
              href="/" 
              className="w-full btn-minimal flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to /build
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 