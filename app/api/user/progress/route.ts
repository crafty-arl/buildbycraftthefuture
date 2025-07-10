import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userProgress = await prisma.userToolProgress.findMany({
      where: { userId: session.user.id },
      include: { tool: true }
    })

    return NextResponse.json({ progress: userProgress })
  } catch (error) {
    console.error('Failed to fetch user progress:', error)
    return NextResponse.json({ 
      error: 'Database unavailable', 
      progress: [] 
    }, { status: 200 }) // Return empty progress instead of error
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { toolId, status, xpEarned, code } = body

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }

    const updatedProgress = await prisma.userToolProgress.upsert({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId: toolId
        }
      },
      update: {
        status: status || 'in_progress',
        xpEarned: xpEarned || 0,
        code: code || null,
        completedAt: status === 'completed' ? new Date() : null
      },
      create: {
        userId: session.user.id,
        toolId: toolId,
        status: status || 'in_progress',
        xpEarned: xpEarned || 0,
        code: code || null,
        completedAt: status === 'completed' ? new Date() : null
      }
    })

    // Update user's total XP if this is a completion
    if (status === 'completed' && xpEarned > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalXP: {
            increment: xpEarned
          }
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      progress: updatedProgress 
    })
  } catch (error) {
    console.error('Failed to update user progress:', error)
    return NextResponse.json({ 
      error: 'Database unavailable', 
      success: false 
    }, { status: 200 }) // Don't fail completely
  }
} 