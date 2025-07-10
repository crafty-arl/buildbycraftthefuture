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
  session: {
    strategy: "jwt", // Use JWT even with adapter for better fallback
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID from token
      if (session.user && token.sub) {
        session.user.id = token.sub
        
        // Try to get additional user data from database, fall back gracefully
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { totalXP: true, level: true, isPassHolder: true }
          })
          if (dbUser) {
            session.user.totalXP = dbUser.totalXP
            session.user.level = dbUser.level
            session.user.isPassHolder = dbUser.isPassHolder
          } else {
            // User not in database yet, set defaults
            session.user.totalXP = 0
            session.user.level = 1
            session.user.isPassHolder = false
          }
        } catch (error) {
          console.warn('Database unavailable, using JWT-only session:', error instanceof Error ? error.message : String(error))
          // Gracefully fall back to default values
          session.user.totalXP = 0
          session.user.level = 1
          session.user.isPassHolder = false
        }
        
        console.log('Session created for user:', session.user.email)
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        console.log('JWT token created for user:', user.email)
      }
      return token
    }
  },
  events: {
    async createUser({ user }) {
      // Initialize user with default /build values
      if (user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              totalXP: 0,
              level: 1,
              isPassHolder: false
            }
          })
          console.log('User initialized in database:', user.email)
        } catch (error) {
          console.warn('Failed to initialize user in database:', error instanceof Error ? error.message : String(error))
          // Don't fail auth if database is unavailable
        }
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
} 