// Enhanced tools structure - supports both simple and stepped lessons
import { ParsedLesson } from './lessonParser'

export interface SimpleTool {
  id: string
  slug: string
  title: string
  description: string
  track: 'python' | 'ai' | 'data'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  order: number
  
  // Choose lesson format
  lessonType: 'simple' | 'stepped'
  
  // For simple lessons
  starterCode?: string
  solutionCode?: string
  instructions?: string[]
  concepts?: string[]
  
  // For stepped lessons
  steppedLesson?: ParsedLesson
  
  // Testing and validation
  testCases?: Array<{
    input: any
    expectedOutput: any
    description: string
  }>
}

export const tools: SimpleTool[] = [
  {
    id: 'receipt-generator',
    slug: 'receipt-generator',
    title: 'Receipt Generator',
    description: 'Build a simple receipt generator using pure Python. Learn through 7 progressive steps that teach Python fundamentals.',
    track: 'python',
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    order: 1,
    lessonType: 'stepped', // Use the new stepped format
    
    // Load the stepped lesson dynamically
    steppedLesson: undefined, // Will be loaded asynchronously
    
    concepts: [
      'Variables and data types',
      'Lists and dictionaries',
      'For loops',
      'String formatting',
      'Mathematical operations'
    ],
    testCases: [
      {
        input: [{"name": "Coffee", "price": 3.50}],
        expectedOutput: "Should show Coffee $3.50 with total $3.50",
        description: "Single item receipt"
      },
      {
        input: [
          {"name": "Coffee", "price": 3.50},
          {"name": "Bagel", "price": 2.25}
        ],
        expectedOutput: "Should show both items with total $5.75",
        description: "Multiple items receipt"
      }
    ]
  }
]

// Helper functions for easy maintenance
export function getToolBySlug(slug: string): SimpleTool | undefined {
  return tools.find(tool => tool.slug === slug)
}

export async function getToolWithSteps(slug: string): Promise<SimpleTool | undefined> {
  const tool = getToolBySlug(slug)
  if (!tool) return undefined
  
  console.log('🐛 Debug: Loading tool with steps for slug:', slug)
  console.log('🐛 Debug: Tool found:', tool.title, 'lessonType:', tool.lessonType)
  
  // Load stepped lesson if needed
  if (tool.lessonType === 'stepped' && !tool.steppedLesson) {
    console.log('🐛 Debug: Tool needs stepped lesson loading...')
    try {
      // Convert slug to the correct file name format
      const lessonSlug = `01-${tool.slug}-stepped`
      console.log('🐛 Debug: Loading lesson with slug:', lessonSlug)
      
      // Try to load from JSON file first
      const jsonResponse = await fetch(`/api/lesson-json/${lessonSlug}`)
      console.log('🐛 Debug: JSON API response status:', jsonResponse.status)
      
      if (jsonResponse.ok) {
        const jsonLesson = await jsonResponse.json()
        console.log('✅ Loaded lesson from JSON file')
        console.log('🐛 Debug: JSON lesson title:', jsonLesson.title)
        console.log('🐛 Debug: Steps count:', jsonLesson.steps?.length || 0)
        
        const { parseJsonLesson } = await import('./lessonParser')
        tool.steppedLesson = parseJsonLesson(jsonLesson)
      } else {
        console.error('❌ Failed to load JSON lesson')
      }
    } catch (error) {
      console.error(`❌ Failed to load stepped lesson for '${tool.slug}':`, error)
      // Return tool without stepped lesson data
      // The UI will handle this gracefully
    }
  }
  
  console.log('🐛 Debug: Final tool state - hasSteppedLesson:', !!tool.steppedLesson)
  console.log('🐛 Debug: Steps count:', tool.steppedLesson?.steps?.length || 0)
  return tool
}

export function getToolsByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): SimpleTool[] {
  return tools.filter(tool => tool.difficulty === difficulty)
}

export function getAllTools(): SimpleTool[] {
  return tools.sort((a, b) => a.order - b.order)
}

// Simple lesson template for solo developers
export const simpleLessonTemplate = {
  id: 'new-lesson',
  slug: 'new-lesson', 
  title: 'New Lesson',
  description: 'Description of what students will build',
  track: 'python' as const,
  difficulty: 'Beginner' as const,
  estimatedTime: '15 min',
  order: 2,
  lessonType: 'simple' as const,
  concepts: [
    'Concept 1',
    'Concept 2'
  ],
  starterCode: `# Your starter code here
def my_function():
    # TODO: Implement this
    pass

# Test your function
print(my_function())`,
  solutionCode: `# Solution code here
def my_function():
    return "Hello, World!"

print(my_function())`,
  instructions: [
    'Step 1: Do this',
    'Step 2: Do that',
    'Step 3: Complete the function'
  ]
}

// Stepped lesson template for solo developers  
export const steppedLessonTemplate = `# New Lesson - 7 Progressive Steps

## Lesson Overview
**Difficulty**: Beginner | **Time**: 20 minutes | **Track**: Python

Brief description of what students will build.

**Concepts You'll Learn**:
- Concept 1
- Concept 2
- Concept 3

---

## Step 1: First Step
**Goal**: What students will learn in this step

### What You'll Build
Brief description of this step's outcome.

### Instructions
1. First instruction
2. Second instruction
3. Third instruction

### Starter Code
\`\`\`python
# Starter code with ??? placeholders
def my_function():
    ??? # Replace with actual code
    pass
\`\`\`

### Solution Code
\`\`\`python
# Complete working solution
def my_function():
    return "Hello, World!"
\`\`\`

### Expected Output
\`\`\`
Hello, World!
\`\`\`

---

## Step 2: Second Step
**Goal**: Next learning objective

[Repeat pattern for all 7 steps...]

---

## Lesson Complete! 🎉

**What You Built**: Summary of the complete project

**Skills Mastered**:
- ✅ Skill 1
- ✅ Skill 2
- ✅ Skill 3
` 