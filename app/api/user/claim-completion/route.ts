import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'
import { authOptions } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { toolSlug, xpAmount } = body

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get tool
    const tool = await prisma.tool.findUnique({
      where: { slug: toolSlug }
    })

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    // Check if already completed
    const existingProgress = await prisma.userToolProgress.findUnique({
      where: {
        userId_toolId: {
          userId: user.id,
          toolId: tool.id
        }
      }
    })

    if (existingProgress?.status === 'completed') {
      return NextResponse.json({ error: 'Already completed' }, { status: 400 })
    }

    // Update user progress and XP in a transaction
    const result = await prisma.$transaction([
      // Update or create tool progress
      prisma.userToolProgress.upsert({
        where: {
          userId_toolId: {
            userId: user.id,
            toolId: tool.id
          }
        },
        create: {
          userId: user.id,
          toolId: tool.id,
          status: 'completed',
          xpEarned: xpAmount,
          completedAt: new Date()
        },
        update: {
          status: 'completed',
          xpEarned: xpAmount,
          completedAt: new Date()
        }
      }),

      // Create achievement
      prisma.userAchievement.create({
        data: {
          userId: user.id,
          title: `${tool.title} Master`,
          description: `Completed all steps of ${tool.title}`,
          icon: '🏆',
          earnedAt: new Date()
        }
      }),

      // Update user's total XP and level
      prisma.user.update({
        where: { id: user.id },
        data: {
          totalXP: user.totalXP + xpAmount,
          level: Math.floor((user.totalXP + xpAmount) / 100) + 1
        }
      })
    ])

    return NextResponse.json({
      success: true,
      newTotalXP: result[2].totalXP,
      newLevel: result[2].level
    })

  } catch (error) {
    console.error('Error claiming completion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 