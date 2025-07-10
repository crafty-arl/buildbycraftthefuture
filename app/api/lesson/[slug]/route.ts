import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Construct the path to the markdown file
    const filePath = join(process.cwd(), 'lessons', `${slug}.md`)
    
    // Read the markdown file
    const markdownContent = await readFile(filePath, 'utf-8')
    
    return new NextResponse(markdownContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error: any) {
    console.error('Failed to read lesson file:', error)
    
    return NextResponse.json(
      { error: 'Lesson file not found' },
      { status: 404 }
    )
  }
} 