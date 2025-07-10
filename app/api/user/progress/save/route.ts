import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'
import { authOptions } from '@/app/lib/auth'

interface SaveProgressRequest {
  toolSlug: string
  code: string
  status: 'not_started' | 'in_progress' | 'completed'
  completedSteps?: string[]
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as SaveProgressRequest
    const { toolSlug, code, status = 'in_progress', completedSteps, ...additionalData } = body

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create tool
    const tool = await prisma.tool.upsert({
      where: { slug: toolSlug },
      update: {},
      create: {
        slug: toolSlug,
        title: toolSlug, // Default title, will be updated later
        track: 'python',
        season: '1',
        order: 1,
        description: '',
        difficulty: 'Beginner'
      }
    })

    // Update or create progress with tool states
    const progress = await prisma.userToolProgress.upsert({
      where: {
        userId_toolId: {
          userId: user.id,
          toolId: tool.id
        }
      },
      create: {
        userId: user.id,
        toolId: tool.id,
        status,
        code,
        xpEarned: status === 'completed' ? 100 : 0,
        completedAt: status === 'completed' ? new Date() : null,
        toolStates: {
          [toolSlug]: {
            completedSteps: completedSteps || [],
            status,
            ...additionalData
          }
        }
      },
      update: {
        status,
        code,
        xpEarned: status === 'completed' ? 100 : 0,
        completedAt: status === 'completed' ? new Date() : null,
        toolStates: {
          [toolSlug]: {
            completedSteps: completedSteps || [],
            status,
            ...additionalData
          }
        }
      }
    })

    // If completing, update user's total XP
    if (status === 'completed' && progress.status !== 'completed') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalXP: {
            increment: 100
          },
          level: {
            increment: 1
          }
        }
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error saving tool progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 