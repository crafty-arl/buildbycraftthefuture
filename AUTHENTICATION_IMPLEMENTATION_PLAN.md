# 🔐 Authentication Implementation Plan
## Next.js Auth with GitHub & Google

### 🎯 Overview
Implement secure authentication using Next.js Auth (Auth.js) with GitHub and Google as the only login providers. This will enable user progress persistence, Season Pass management, and social features.

---

## 📋 Implementation Steps

### Phase 1: Setup & Configuration (30 minutes)

#### 1.1 Install Dependencies
```bash
npm install next-auth
npm install @auth/prisma-adapter prisma @prisma/client  # For database
npm install @types/next-auth  # TypeScript support
```

#### 1.2 Environment Variables Setup
Create/update `.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth  
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (if using Prisma)
DATABASE_URL="your-database-connection-string"
```

#### 1.3 OAuth App Registration

**GitHub OAuth App:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - Application name: `/build Platform`
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`

**Google OAuth App:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

---

### Phase 2: Auth Configuration (45 minutes)

#### 2.1 Create Auth Configuration
`app/lib/auth.ts`:
```typescript
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  session: {
    strategy: "database"
  }
}
```

#### 2.2 API Route Setup
`app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import { authOptions } from "../../../lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 2.3 Database Schema (Prisma)
`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "sqlite" for development
  url      = env("DATABASE_URL")
}

// NextAuth required tables
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  username      String?   @unique
  
  // /build specific fields
  totalXP       Int       @default(0)
  level         Int       @default(1)
  joinDate      DateTime  @default(now())
  isPassHolder  Boolean   @default(false)
  
  accounts      Account[]
  sessions      Session[]
  toolProgress  UserToolProgress[]
  achievements  UserAchievement[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// /build specific models
model Tool {
  id          String @id @default(cuid())
  slug        String @unique
  title       String
  track       String
  season      String
  order       Int
  description String
  difficulty  String
  
  userProgress UserToolProgress[]
}

model UserToolProgress {
  id          String   @id @default(cuid())
  userId      String
  toolId      String
  status      String   @default("not_started") // not_started, in_progress, completed
  xpEarned    Int      @default(0)
  completedAt DateTime?
  code        String?  @db.Text
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tool Tool @relation(fields: [toolId], references: [id], onDelete: Cascade)
  
  @@unique([userId, toolId])
}

model UserAchievement {
  id           String   @id @default(cuid())
  userId       String
  title        String
  description  String
  icon         String
  earnedAt     DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

### Phase 3: UI Components (60 minutes)

#### 3.1 Auth Button Component
`app/components/auth/AuthButton.tsx`:
```typescript
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { LogIn, LogOut, User, Github } from 'lucide-react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-8 h-8 bg-build-muted/20 rounded-full"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        <Link href="/profile" className="flex items-center space-x-2 hover:text-build-accent transition-colors">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-8 h-8 rounded-full border-2 border-build-border"
            />
          ) : (
            <User className="w-8 h-8 p-1 bg-build-surface rounded-full border-2 border-build-border" />
          )}
          <span className="hidden sm:inline font-mono text-sm">
            {session.user?.name || 'Profile'}
          </span>
        </Link>
        <button
          onClick={() => signOut()}
          className="btn-minimal text-sm"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Sign Out</span>
        </button>
      </div>
    )
  }

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
```

#### 3.2 Sign In Page
`app/auth/signin/page.tsx`:
```typescript
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
```

#### 3.3 Session Provider Setup
`app/components/auth/SessionProvider.tsx`:
```typescript
'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
```

---

### Phase 4: Integration (90 minutes)

#### 4.1 Update Root Layout
`app/layout.tsx`:
```typescript
import SessionProvider from './components/auth/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

#### 4.2 Update Header Component
Add to `app/components/layout/Header.tsx`:
```typescript
import AuthButton from '../auth/AuthButton'

// In the header JSX, replace user actions with:
{showUserActions && (
  <div className="flex items-center space-x-2">
    <AuthButton />
  </div>
)}
```

#### 4.3 Protected Route Middleware
`middleware.ts`:
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which routes require authentication
        const protectedPaths = ['/profile', '/upgrade']
        const isProtectedPath = protectedPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        )
        
        return !isProtectedPath || !!token
      },
    },
  }
)

export const config = {
  matcher: ['/profile/:path*', '/upgrade/:path*']
}
```

#### 4.4 Update User Progress System
`app/hooks/useUserProgress.ts`:
```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export function useUserProgress() {
  const { data: session } = useSession()
  const [progress, setProgress] = useState({
    totalXP: 0,
    completedTools: [],
    level: 1,
    achievements: []
  })

  useEffect(() => {
    if (session?.user) {
      // Fetch from database
      fetchUserProgress()
    } else {
      // Fall back to localStorage for anonymous users
      loadLocalProgress()
    }
  }, [session])

  const fetchUserProgress = async () => {
    // API call to get user progress from database
    try {
      const response = await fetch('/api/user/progress')
      const data = await response.json()
      setProgress(data)
    } catch (error) {
      console.error('Failed to fetch user progress:', error)
    }
  }

  const loadLocalProgress = () => {
    // Existing localStorage logic
    const savedXP = parseInt(localStorage.getItem('user_xp') || '0')
    const completedTools = JSON.parse(localStorage.getItem('completed_tools') || '[]')
    // ... rest of localStorage logic
  }

  const updateProgress = async (updates: any) => {
    if (session?.user) {
      // Save to database
      try {
        await fetch('/api/user/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        fetchUserProgress()
      } catch (error) {
        console.error('Failed to update progress:', error)
      }
    } else {
      // Save to localStorage
      // ... existing localStorage update logic
    }
  }

  return { progress, updateProgress }
}
```

---

### Phase 5: API Routes (45 minutes)

#### 5.1 User Progress API
`app/api/user/progress/route.ts`:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        toolProgress: {
          include: { tool: true }
        },
        achievements: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const completedTools = user.toolProgress
      .filter(progress => progress.status === 'completed')
      .map(progress => progress.tool.slug)

    return NextResponse.json({
      totalXP: user.totalXP,
      level: user.level,
      completedTools,
      achievements: user.achievements,
      toolProgress: user.toolProgress
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await request.json()
    
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: updates.totalXP,
        level: Math.floor(updates.totalXP / 100) + 1
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

### Phase 6: Testing & Deployment (30 minutes)

#### 6.1 Development Testing
1. Test GitHub OAuth flow
2. Test Google OAuth flow
3. Verify session persistence
4. Test protected routes
5. Test progress synchronization

#### 6.2 Environment Setup
- Development: Use localhost URLs
- Production: Update OAuth redirect URLs
- Set secure NEXTAUTH_SECRET for production

#### 6.3 Database Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🚀 Benefits After Implementation

### For Users:
- **Progress Persistence**: Never lose your XP or completed tools
- **Cross-Device Sync**: Access your progress from anywhere
- **Social Features**: GitHub/Google profile integration
- **Season Pass**: Proper subscription management

### For Platform:
- **User Analytics**: Track real user engagement
- **Monetization**: Secure Season Pass subscriptions
- **Community**: Build user profiles and sharing features
- **Data Insights**: Understanding user learning patterns

---

## 📈 Future Enhancements

1. **Social Features**: Share completed tools, follow other builders
2. **Team Collaboration**: Work on tools together
3. **Tool Marketplace**: Share and discover community tools
4. **Advanced Analytics**: Detailed progress tracking
5. **Mobile App**: React Native with same auth system

---

## 🔒 Security Considerations

- Use HTTPS in production
- Rotate OAuth secrets regularly
- Implement rate limiting on auth endpoints
- Add CSRF protection (included in NextAuth)
- Regular security audits

This implementation will provide a robust, scalable authentication system that integrates seamlessly with your existing `/build` platform while maintaining the "build-first" philosophy. 