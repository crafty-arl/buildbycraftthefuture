import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'
import { authOptions } from '@/app/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create tool
    const tool = await prisma.tool.upsert({
      where: { slug: params.slug },
      update: {},
      create: {
        slug: params.slug,
        title: params.slug, // Default title, will be updated later
        track: 'python',
        season: '1',
        order: 1,
        description: '',
        difficulty: 'Beginner'
      }
    })

    // Get progress
    const progress = await prisma.userToolProgress.findUnique({
      where: {
        userId_toolId: {
          userId: user.id,
          toolId: tool.id
        }
      }
    })

    if (!progress) {
      return NextResponse.json({
        toolId: tool.id,
        status: 'not_started',
        xpEarned: 0,
        completedAt: null,
        code: null
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error getting tool progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 