# Gamified Course System 🎓

## Overview

The gamified course system rewards users with achievements and tools by completing structured learning courses. This system is designed for easy maintenance by a solo developer.

## How It Works

### Course Structure
```typescript
Course {
  id: string               // Unique identifier
  title: string           // Display name
  description: string     // Course overview
  category: string        // beginner, data-science, etc.
  difficulty: string      // easy, medium, hard
  estimatedTime: string   // "45 minutes"
  prerequisites: string[] // Achievement IDs required
  rewards: {
    xp: number           // XP awarded on completion
    achievement?: string // Achievement to unlock
    tool: {              // Tool code to unlock
      name: string
      code: string
      description: string
    }
  }
  lessons: CourseLesson[] // Individual lessons
}
```

### Course Flow
1. **Discovery**: Users see courses in the Course Selector
2. **Unlock**: Courses unlock when prerequisites are met
3. **Learning**: Users complete lessons in the Course Viewer
4. **Rewards**: Completion awards XP, achievements, and tools

## Current Courses

### 1. CSV Cleaner Mastery
- **Category**: Data Science
- **Difficulty**: Easy
- **Duration**: 45 minutes
- **Prerequisites**: `hello_builder` achievement
- **Reward Tool**: CSV Cleaner Pro (complete professional data cleaning tool)

**Lessons**:
1. **Introduction** (Theory) - Overview of data cleaning
2. **Pandas Basics** (Practice) - Essential pandas operations
3. **Missing Data** (Practice) - Multiple strategies for handling NaN values
4. **Duplicates & Outliers** (Practice) - Data quality improvement
5. **Final Challenge** (Challenge) - Build the complete CSV Cleaner Pro class

## Adding New Courses

### 1. Create Course Data
Add to `app/data/courses.ts`:

```typescript
{
  id: 'new-course-id',
  title: 'Your Course Title',
  description: 'What students will learn...',
  category: 'appropriate-category',
  difficulty: 'easy|medium|hard',
  estimatedTime: '30 minutes',
  prerequisites: ['required-achievement-id'],
  rewards: {
    xp: 500,
    achievement: 'optional-achievement-to-unlock',
    tool: {
      name: 'tool_name',
      description: 'Tool description',
      code: `// Complete Python code here`
    }
  },
  lessons: [
    // Lesson objects...
  ]
}
```

### 2. Create Lessons
Each lesson has:
- **Theory**: Markdown content explaining concepts
- **Practice**: Code template + hints + expected output
- **Challenge**: Complex coding task with minimal guidance

### 3. Tool Integration
Course completion automatically:
- Awards XP to the user
- Unlocks the achievement (if specified)
- Adds the tool to the user's toolkit
- Makes the tool available in the IDE

## For Solo Developer Maintenance

### Easy Content Updates
- All course content is in `app/data/courses.ts`
- Lessons use simple markdown for theory
- Code templates are plain JavaScript strings
- No complex backend required

### Expandable System
- Add courses by extending the array
- Course categories are flexible strings
- Achievement system handles prerequisites automatically
- Tools are saved to user's local toolkit

### Testing
To test courses:
1. Run any Python code with `print()` to unlock `hello_builder`
2. Access Courses from the top menu
3. Select "CSV Cleaner Mastery"
4. Complete lessons to earn the tool

### Course Creation Tips
1. **Start Simple**: Focus on one practical tool per course
2. **Progressive Difficulty**: Begin with theory, add practice, end with challenges
3. **Real Value**: Each course should produce a useful tool
4. **Clear Goals**: Students should know exactly what they'll build
5. **Instant Feedback**: Use the code runner for immediate validation

## Technical Implementation

### Key Components
- `CourseSelector.tsx` - Course discovery and selection
- `CourseViewer.tsx` - Lesson delivery and code practice
- `useBuilderProgress.ts` - Course progress tracking
- `courses.ts` - Course data and content

### Data Flow
1. Course unlocking based on achievements
2. Lesson completion tracking
3. Progress persistence in localStorage
4. Automatic tool integration

### Future Enhancements
- Video lesson support
- Interactive code challenges
- Course completion certificates
- Community sharing of user-created courses
- Advanced analytics for learning patterns

This system balances educational value with practical tool building, creating an engaging learning experience that produces real value for users. 