'use client'

import { useSession, signIn, signOut, getProviders } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function AuthDebugPage() {
  const { data: session, status, update } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [providers, setProviders] = useState<any>(null)
  const [authErrors, setAuthErrors] = useState<string[]>([])
  const [testingProvider, setTestingProvider] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders()
        setProviders(res)
        console.log('Available providers:', res)
      } catch (error) {
        console.error('Failed to fetch providers:', error)
        setAuthErrors(prev => [...prev, `Failed to fetch providers: ${error}`])
      }
    }
    fetchProviders()

    // Listen for URL parameters that might indicate auth errors
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error) {
      setAuthErrors(prev => [...prev, `URL Error: ${error}`])
    }
  }, [])

  const handleRefreshSession = async () => {
    setIsRefreshing(true)
    try {
      await update()
      console.log('Session refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh session:', error)
      setAuthErrors(prev => [...prev, `Session refresh failed: ${error}`])
    } finally {
      setIsRefreshing(false)
    }
  }

  const testSignIn = async (providerId: string) => {
    setTestingProvider(providerId)
    setAuthErrors([]) // Clear previous errors
    
    try {
      console.log(`Testing sign in with ${providerId}`)
      const result = await signIn(providerId, { 
        callbackUrl: '/auth/debug',
        redirect: false // Don't redirect immediately
      })
      
      console.log('Sign in result:', result)
      
      if (result?.error) {
        setAuthErrors(prev => [...prev, `Sign in error: ${result.error}`])
      }
      
      if (result?.ok) {
        console.log('Sign in initiated successfully')
      }
    } catch (error) {
      console.error('Sign in failed:', error)
      setAuthErrors(prev => [...prev, `Sign in exception: ${error}`])
    } finally {
      setTestingProvider(null)
    }
  }

  const clearErrors = () => {
    setAuthErrors([])
  }

  return (
    <div className="min-h-screen bg-build-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-build-text mb-8">Authentication Debug Center</h1>
        
        <div className="grid gap-6">
          {/* Session Status */}
          <div className="bg-build-surface p-6 rounded-lg border border-build-border">
            <h2 className="text-xl font-semibold text-build-text mb-4">Session Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> <span className="text-build-accent">{status}</span></p>
              <p><strong>Authenticated:</strong> <span className="text-build-accent">{status === 'authenticated' ? 'Yes' : 'No'}</span></p>
              <p><strong>Loading:</strong> <span className="text-build-accent">{status === 'loading' ? 'Yes' : 'No'}</span></p>
            </div>
          </div>

          {/* OAuth Providers Test */}
          <div className="bg-build-surface p-6 rounded-lg border border-build-border">
            <h2 className="text-xl font-semibold text-build-text mb-4">OAuth Providers Test</h2>
            <div className="space-y-4">
              {providers ? (
                Object.values(providers).map((provider: any) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 bg-build-bg rounded border">
                    <div>
                      <p className="font-medium text-build-text">{provider.name}</p>
                      <p className="text-sm text-build-muted">ID: {provider.id}</p>
                    </div>
                    <button
                      onClick={() => testSignIn(provider.id)}
                      disabled={testingProvider === provider.id}
                      className="btn-primary"
                    >
                      {testingProvider === provider.id ? 'Testing...' : `Test ${provider.name}`}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-build-muted">Loading providers...</p>
              )}
            </div>
          </div>

          {/* Errors */}
          {authErrors.length > 0 && (
            <div className="bg-red-950 border border-red-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-red-300">Authentication Errors</h2>
                <button onClick={clearErrors} className="text-red-400 hover:text-red-300">
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {authErrors.map((error, index) => (
                  <p key={index} className="text-red-200 font-mono text-sm">{error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Session Data */}
          <div className="bg-build-surface p-6 rounded-lg border border-build-border">
            <h2 className="text-xl font-semibold text-build-text mb-4">Session Data</h2>
            <pre className="bg-build-bg p-4 rounded text-sm overflow-auto text-build-text">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="bg-build-surface p-6 rounded-lg border border-build-border">
            <h2 className="text-xl font-semibold text-build-text mb-4">Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleRefreshSession}
                disabled={isRefreshing}
                className="btn-primary"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
              </button>
              
              {status === 'authenticated' ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/debug' })}
                  className="btn-minimal"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="btn-primary"
                >
                  Sign In (Default)
                </button>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-build-surface p-6 rounded-lg border border-build-border">
            <h2 className="text-xl font-semibold text-build-text mb-4">Environment Configuration</h2>
            <div className="space-y-2">
              <p><strong>NODE_ENV:</strong> <span className="text-build-accent">{process.env.NODE_ENV}</span></p>
              <p><strong>NEXTAUTH_URL:</strong> <span className="text-build-accent">{process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not publicly set'}</span></p>
              <p><strong>Current URL:</strong> <span className="text-build-accent">{typeof window !== 'undefined' ? window.location.origin : 'SSR'}</span></p>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="bg-build-surface p-6 rounded-lg border border-build-border">
            <h2 className="text-xl font-semibold text-build-text mb-4">Troubleshooting Checklist</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-build-text">GitHub OAuth App Settings:</h3>
                <ul className="text-sm text-build-muted space-y-1 ml-4">
                  <li>• Authorization callback URL: <code className="bg-build-bg px-2 py-1 rounded">http://localhost:3000/api/auth/callback/github</code></li>
                  <li>• Application type: Web application</li>
                  <li>• Client ID and Secret are correctly set in .env.local</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-build-text">Google OAuth App Settings:</h3>
                <ul className="text-sm text-build-muted space-y-1 ml-4">
                  <li>• Authorized redirect URI: <code className="bg-build-bg px-2 py-1 rounded">http://localhost:3000/api/auth/callback/google</code></li>
                  <li>• OAuth consent screen configured</li>
                  <li>• Client ID and Secret are correctly set in .env.local</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 