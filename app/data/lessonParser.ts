// JSON lesson interfaces (matches our JSON structure)
interface JsonLessonStep {
  id: string
  title: string
  goal: string
  instructions: string[]
  starterCode: string
  solutionCode: string
  expectedOutput?: string
}

interface JsonLesson {
  id: string
  title: string
  difficulty: string
  time: string
  track: string
  overview: string
  concepts: string[]
  xp: number
  steps: JsonLessonStep[]
}

// Parse JSON lesson (convert from JSON format to ParsedLesson format)
export function parseJsonLesson(jsonLesson: JsonLesson): ParsedLesson {
  console.log('🐛 Debug: Starting JSON lesson parsing...')
  console.log('🐛 Debug: Lesson title:', jsonLesson.title)
  console.log('🐛 Debug: Steps count:', jsonLesson.steps.length)
  console.log('🐛 Debug: XP value:', jsonLesson.xp)
  
  return {
    id: jsonLesson.id,
    title: jsonLesson.title,
    difficulty: jsonLesson.difficulty,
    time: jsonLesson.time,
    track: jsonLesson.track,
    overview: jsonLesson.overview,
    concepts: jsonLesson.concepts,
    xp: jsonLesson.xp,
    steps: jsonLesson.steps.map(step => ({
      id: step.id,
      title: step.title,
      goal: step.goal,
      instructions: step.instructions,
      starterCode: step.starterCode,
      solutionCode: step.solutionCode,
      expectedOutput: step.expectedOutput
    }))
  }
}

// Export types for use in other files
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
  xp: number
  steps: LessonStep[]
} 