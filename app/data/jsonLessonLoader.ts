// JSON-based lesson loader - SO MUCH SIMPLER! 🎉

export interface LessonStep {
  id: string
  title: string
  goal: string
  instructions: string[]
  starterCode: string
  solutionCode: string
  expectedOutput?: string
}

export interface ParsedLesson {
  id: string
  title: string
  difficulty: string
  time: string
  track: string
  overview: string
  concepts: string[]
  steps: LessonStep[]
}

// SUPER SIMPLE JSON LOADING - No complex regex! 🎯
export async function loadJsonLesson(slug: string): Promise<ParsedLesson> {
  // Client-side: fetch from API
  if (typeof window !== 'undefined') {
    const response = await fetch(`/api/lesson-json/${slug}`)
    if (response.ok) {
      return await response.json() // ← THAT'S IT! No parsing needed!
    }
    throw new Error(`Failed to load JSON lesson: ${slug}`)
  }
  
  // Server-side: read file directly
  const { readFile } = await import('fs/promises')
  const { join } = await import('path')
  const filePath = join(process.cwd(), 'lessons', `${slug}.json`)
  const jsonContent = await readFile(filePath, 'utf-8')
  return JSON.parse(jsonContent) // ← BOOM! Done! No regex complexity!
}

// Receipt generator specific loader
export async function loadReceiptGeneratorJsonLesson(): Promise<ParsedLesson> {
  return loadJsonLesson('01-receipt-generator-stepped')
}

// Compare the complexity:
// MARKDOWN: 148 lines of complex regex patterns with line ending handling
// JSON: 15 lines total, simple and bulletproof! 🚀 