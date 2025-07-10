import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    console.log('🔍 API Debug: Loading JSON lesson for slug:', slug)
    
    // Construct the path to the JSON file
    const filePath = join(process.cwd(), 'lessons', `${slug}.json`)
    console.log('🔍 API Debug: File path:', filePath)
    
    // Read the JSON file
    const jsonContent = await readFile(filePath, 'utf-8')
    console.log('🔍 API Debug: JSON content length:', jsonContent.length)
    
    const lessonData = JSON.parse(jsonContent)
    console.log('🔍 API Debug: Parsed lesson data:')
    console.log('  - Title:', lessonData.title)
    console.log('  - Steps count:', lessonData.steps?.length || 0)
    console.log('  - Step IDs:', lessonData.steps?.map((s: any) => s.id) || [])
    
    return NextResponse.json(lessonData, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error: any) {
    console.error('❌ API Error: Failed to read JSON lesson file:', error)
    
    return NextResponse.json(
      { error: 'JSON lesson file not found' },
      { status: 404 }
    )
  }
} 