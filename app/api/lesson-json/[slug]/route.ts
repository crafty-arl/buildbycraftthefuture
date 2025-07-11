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
    console.log('🔍 API Debug: Request URL:', request.url)
    console.log('🔍 API Debug: Full request details:', {
      slug,
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    })
    
    // Construct the path to the JSON file
    const filePath = join(process.cwd(), 'lessons', `${slug}.json`)
    console.log('🔍 API Debug: File path:', filePath)
    
    // Check if file exists
    const fs = await import('fs/promises')
    try {
      await fs.access(filePath)
      console.log('🔍 API Debug: File exists and is accessible')
    } catch (error) {
      console.error('❌ API Error: File does not exist or is not accessible:', filePath)
      return NextResponse.json(
        { error: `JSON lesson file not found: ${slug}.json` },
        { status: 404 }
      )
    }
    
    // Read the JSON file
    const jsonContent = await readFile(filePath, 'utf-8')
    console.log('🔍 API Debug: JSON content length:', jsonContent.length)
    
    const lessonData = JSON.parse(jsonContent)
    console.log('🔍 API Debug: Parsed lesson data:')
    console.log('  - Title:', lessonData.title)
    console.log('  - Steps count:', lessonData.steps?.length || 0)
    console.log('  - Step IDs:', lessonData.steps?.map((s: any) => s.id) || [])
    console.log('🔍 API Debug: Returning lesson with ID:', lessonData.id)
    
    return NextResponse.json(lessonData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable caching for debugging
        'Pragma': 'no-cache',
        'Expires': '0'
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