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
    id: 'quickreceipt-stepped',
    slug: 'quickreceipt',
    title: '🧾 QuickReceipt',
    description: 'Build a real tool you can actually use. Whether you\'re selling earrings at a pop-up, tutoring a friend, or just organizing your own expenses — this tool helps you generate a clean, printable receipt with Python.',
    track: 'python',
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    order: 1,
    lessonType: 'stepped', // Use the new stepped format
    
    // Load the stepped lesson dynamically
    steppedLesson: undefined, // Will be loaded asynchronously
    
    concepts: [
      'Building real-world tools',
      'Data storage and organization',
      'Financial calculations',
      'Professional formatting',
      'Error handling and validation'
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
  },
  {
    id: 'namemixer-stepped',
    slug: 'namemixer',
    title: '🔤 NameMixer',
    description: 'Build a simple word-mixing tool that sparks creative names for products, projects, or any idea. Learn to work with lists, random selection, and string concatenation — all in your browser with pure Python.',
    track: 'python',
    difficulty: 'Beginner',
    estimatedTime: '15 min',
    order: 2,
    lessonType: 'stepped',
    
    // Load the stepped lesson dynamically
    steppedLesson: undefined, // Will be loaded asynchronously
    
    concepts: [
      'Lists and indexing',
      'Random selection',
      'String concatenation',
      'Function design',
      'In-memory state'
    ],
    testCases: [
      {
        input: ["Quantum", "Cozy", "Bold"],
        expectedOutput: "Should generate random combinations like 'Quantum Bot' or 'Cozy Frame'",
        description: "Random name generation"
      },
      {
        input: 3,
        expectedOutput: "Should generate 3 different mixed names",
        description: "Multiple name generation"
      }
    ]
  },
  {
    id: 'dategapfinder-stepped',
    slug: 'dategapfinder',
    title: '📆 DateGap Finder',
    description: 'Build an in-browser Python tool that tells you how many days remain until a future date. Perfect for countdowns, birthdays, or deadlines. You\'ll work with strings, `datetime`, error handling, and flexible parsing—no `input()`, just variables you can change and re-run.',
    track: 'python',
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    order: 3,
    lessonType: 'stepped',
    
    // Load the stepped lesson dynamically
    steppedLesson: undefined, // Will be loaded asynchronously
    
    concepts: [
      'Working with string variables',
      '`datetime.strptime` and multiple formats',
      'Date arithmetic',
      'Error handling with `try/except`',
      'Conditional logic',
      'Function design',
      'Clear output formatting'
    ],
    testCases: [
      {
        input: '2025-12-31',
        expectedOutput: "Should show days until event",
        description: "Future date countdown"
      },
      {
        input: '2020-01-01',
        expectedOutput: "Should show 'Date has already passed!'",
        description: "Past date handling"
      },
      {
        input: '07/10/2025',
        expectedOutput: "Should handle MM/DD/YYYY format",
        description: "Alternative date format"
      }
    ]
  },
  {
    id: 'passcheck-stepped',
    slug: 'passcheck',
    title: '🔐 PassCheck',
    description: 'Build an in-browser tool that scores password strength (0–10) and explains why. You\'ll work with strings, loops, conditionals, and functions—no `input()`, just variables you can change and re-run.',
    track: 'python',
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    order: 4,
    lessonType: 'stepped',
    
    // Load the stepped lesson dynamically
    steppedLesson: undefined, // Will be loaded asynchronously
    
    concepts: [
      'String length and indexing',
      'Character classes (`isupper`, `isdigit`)',
      'Loops and conditionals',
      'Scoring systems',
      'Function design',
      'Clear output formatting'
    ],
    testCases: [
      {
        input: 'MyPass123!',
        expectedOutput: "Should score 6 (Medium)",
        description: "Mixed case with digits and special chars"
      },
      {
        input: 'short',
        expectedOutput: "Should score 0 (Weak)",
        description: "Short password"
      },
      {
        input: 'Str0ng!Pass123',
        expectedOutput: "Should score 8 (Strong)",
        description: "Long, complex password"
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
      let lessonSlug
      if (tool.slug === 'quickreceipt') {
        lessonSlug = `01-${tool.slug}-stepped`
      } else if (tool.slug === 'namemixer') {
        lessonSlug = `02-${tool.slug}-stepped`
      } else if (tool.slug === 'dategapfinder') {
        lessonSlug = `03-${tool.slug}-stepped`
      } else if (tool.slug === 'passcheck') {
        lessonSlug = `04-${tool.slug}-stepped`
      } else {
        lessonSlug = `${tool.slug}-stepped`
      }
      
      console.log('🐛 Debug: Loading lesson with slug:', lessonSlug)
      
      // Try to load from JSON file first
      const timestamp = Date.now()
      const apiUrl = `/api/lesson-json/${lessonSlug}?t=${timestamp}&slug=${tool.slug}`
      console.log('🐛 Debug: Making API request to:', apiUrl)
      console.log('🐛 Debug: Requesting for tool slug:', tool.slug)
      const jsonResponse = await fetch(apiUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      console.log('🐛 Debug: JSON API response status:', jsonResponse.status)
      
      if (jsonResponse.ok) {
        const jsonLesson = await jsonResponse.json()
        console.log('✅ Loaded lesson from JSON file')
        console.log('🐛 Debug: JSON lesson ID:', jsonLesson.id)
        console.log('🐛 Debug: JSON lesson title:', jsonLesson.title)
        console.log('🐛 Debug: Steps count:', jsonLesson.steps?.length || 0)
        console.log('🐛 Debug: First step title:', jsonLesson.steps?.[0]?.title || 'No first step')
        console.log('🐛 Debug: First step ID:', jsonLesson.steps?.[0]?.id || 'No first step ID')
        
        // Verify we got the right lesson
        const expectedLessonId = `${tool.slug}-stepped`
        if (jsonLesson.id !== expectedLessonId) {
          console.error(`❌ Wrong lesson loaded! Expected ${expectedLessonId}, got ${jsonLesson.id}`)
          console.error(`❌ This might be a caching issue or wrong file being served`)
        } else {
          console.log(`✅ Correct lesson loaded: ${jsonLesson.id}`)
        }
        
        const { parseJsonLesson } = await import('./lessonParser')
        tool.steppedLesson = parseJsonLesson(jsonLesson)
        
        console.log('🐛 Debug: Parsed lesson steps count:', tool.steppedLesson?.steps?.length || 0)
        console.log('🐛 Debug: First parsed step title:', tool.steppedLesson?.steps?.[0]?.title || 'No first parsed step')
      } else {
        console.error('❌ Failed to load JSON lesson - Status:', jsonResponse.status)
        const errorText = await jsonResponse.text()
        console.error('❌ Error response:', errorText)
      }
    } catch (error) {
      console.error(`❌ Failed to load stepped lesson for '${tool.slug}':`, error)
      // Return tool without stepped lesson data
      // The UI will handle this gracefully
    }
  }
  
  console.log('🐛 Debug: Final tool state - hasSteppedLesson:', !!tool.steppedLesson)
  console.log('🐛 Debug: Steps count:', tool.steppedLesson?.steps?.length || 0)
  if (tool.steppedLesson?.steps && tool.steppedLesson.steps.length > 0) {
    console.log('🐛 Debug: First step starter code length:', tool.steppedLesson.steps[0]?.starterCode?.length || 0)
  }
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