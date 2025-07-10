'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Github, Chrome, ArrowLeft } from 'lucide-react'
import LayoutWrapper from '../../components/layout/LayoutWrapper'

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <Github className="w-5 h-5" />
      case 'google':
        return <Chrome className="w-5 h-5" />
      default:
        return null
    }
  }

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'bg-gray-800 hover:bg-gray-700 text-white'
      case 'google':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      default:
        return 'btn-primary'
    }
  }

  return (
    <LayoutWrapper currentPage="profile">
      <div className="min-h-screen bg-build-bg flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-build-surface rounded-lg border border-build-border p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-build-text font-mono mb-2">
                Welcome to /build
              </h1>
              <p className="text-build-muted">
                Sign in to save your progress and unlock Season Pass features
              </p>
            </div>

            <div className="space-y-4">
              {providers && Object.values(providers).map((provider: any) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${getProviderColor(provider.id)}`}
                >
                  {getProviderIcon(provider.id)}
                  <span>Continue with {provider.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a href="/" className="inline-flex items-center text-build-muted hover:text-build-accent transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to /build
              </a>
            </div>

            <div className="mt-6 text-xs text-build-muted text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
} 