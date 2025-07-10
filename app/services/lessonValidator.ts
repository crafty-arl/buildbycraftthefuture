import { runPythonCode } from '../utils/python-runner'
import { CourseLesson } from '../types/builderTypes'

export interface ValidationResult {
  isValid: boolean
  score: number // 0-100
  maxScore: number
  feedback: string[]
  errors: string[]
  xpEarned: number
  testResults: TestResult[]
  canComplete: boolean
  suggestions: string[]
}

export interface TestResult {
  description: string
  passed: boolean
  expected: string
  actual: string
  points: number
  earnedPoints: number
}

export class LessonValidator {
  
  /**
   * Validate user code against lesson expected outcomes
   */
  async validateLesson(
    userCode: string, 
    lesson: CourseLesson,
    trackingCallback?: (action: string, data: any) => void
  ): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: false,
      score: 0,
      maxScore: 100,
      feedback: [],
      errors: [],
      xpEarned: 0,
      testResults: [],
      canComplete: false,
      suggestions: []
    }

    if (!lesson.expectedOutcomes) {
      // No validation criteria - auto-pass for theory lessons
      result.isValid = true
      result.score = 100
      result.maxScore = 100
      result.canComplete = true
      result.xpEarned = lesson.rewards?.xp || 50
      result.feedback.push("✅ Lesson completed successfully!")
      return result
    }

    const outcomes = lesson.expectedOutcomes
    let totalPoints = 0
    let earnedPoints = 0

    try {
      // Run the user's code
      const executionResult = await runPythonCode(userCode)
      
      // Track code execution
      if (trackingCallback) {
        trackingCallback('lesson_code_run', {
          lessonId: lesson.id,
          codeLength: userCode.length,
          hasError: !!executionResult.error
        })
      }

      // Check for runtime errors
      if (executionResult.error && outcomes.hasNoErrors) {
        result.errors.push(`❌ Code has errors: ${executionResult.error}`)
        result.suggestions.push("💡 Fix the syntax errors in your code")
        return result
      }

      // Validate output
      if (outcomes.output) {
        totalPoints += 25
        if (this.validateOutput(executionResult.output || '', outcomes.output)) {
          earnedPoints += 25
          result.feedback.push("✅ Output matches expected result!")
        } else {
          result.feedback.push(`❌ Output doesn't match. Expected: "${outcomes.output}", Got: "${executionResult.output || 'No output'}"`)
          result.suggestions.push("🔍 Check your print statements and variable values")
        }
      }

      // Validate keywords in code
      if (outcomes.containsKeywords) {
        totalPoints += 25
        const foundKeywords = outcomes.containsKeywords.filter(keyword => 
          userCode.toLowerCase().includes(keyword.toLowerCase())
        )
        if (foundKeywords.length === outcomes.containsKeywords.length) {
          earnedPoints += 25
          result.feedback.push(`✅ Code contains all required keywords: ${outcomes.containsKeywords.join(', ')}`)
        } else {
          const missingKeywords = outcomes.containsKeywords.filter(keyword => 
            !userCode.toLowerCase().includes(keyword.toLowerCase())
          )
          result.feedback.push(`❌ Missing keywords: ${missingKeywords.join(', ')}`)
          result.suggestions.push(`💡 Make sure to use: ${missingKeywords.join(', ')}`)
        }
      }

      // Run test cases
      if (outcomes.testCases) {
        for (const testCase of outcomes.testCases) {
          totalPoints += testCase.points
          const testResult = await this.runTestCase(userCode, testCase)
          result.testResults.push(testResult)
          
          if (testResult.passed) {
            earnedPoints += testResult.earnedPoints
            result.feedback.push(`✅ ${testResult.description}`)
          } else {
            result.feedback.push(`❌ ${testResult.description}`)
            result.feedback.push(`   Expected: ${testResult.expected}`)
            result.feedback.push(`   Got: ${testResult.actual}`)
            result.suggestions.push("🔧 Review the test case requirements")
          }
        }
      }

      // Calculate final score
      result.maxScore = Math.max(totalPoints, 100)
      result.score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
      
      // Determine completion status
      const minScoreToPass = 70 // 70% minimum to complete
      result.canComplete = result.score >= minScoreToPass
      result.isValid = result.canComplete

      // Calculate XP rewards
      const baseXP = lesson.rewards?.xp || 50
      if (result.canComplete) {
        result.xpEarned = baseXP
        
        // Bonus XP for perfect score
        if (result.score === 100 && lesson.rewards?.bonusXP) {
          result.xpEarned += lesson.rewards.bonusXP
          result.feedback.push(`🎯 Perfect score! +${lesson.rewards.bonusXP} bonus XP!`)
        }
      } else if (lesson.rewards?.partialCredit) {
        // Partial credit based on score
        result.xpEarned = Math.round(baseXP * (result.score / 100))
        result.feedback.push(`📈 Partial credit: ${result.score}% complete`)
      }

      // Add encouraging messages
      if (result.score >= 90) {
        result.feedback.push("🌟 Excellent work! You've mastered this lesson!")
      } else if (result.score >= 70) {
        result.feedback.push("👍 Good job! You can complete this lesson.")
      } else {
        result.feedback.push("🚀 Keep trying! You're making progress.")
        result.suggestions.push("💪 Review the lesson content and try again")
      }

    } catch (error) {
      result.errors.push(`❌ Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.suggestions.push("🔧 Check your code syntax and try again")
    }

    return result
  }

  /**
   * Validate output against expected output (string or regex)
   */
  private validateOutput(actual: string, expected: string | RegExp): boolean {
    if (typeof expected === 'string') {
      return actual.trim() === expected.trim()
    } else {
      return expected.test(actual)
    }
  }

  /**
   * Run a specific test case
   */
  private async runTestCase(userCode: string, testCase: {
    description: string
    input?: string
    expectedOutput: string | RegExp
    points: number
  }): Promise<TestResult> {
    const result: TestResult = {
      description: testCase.description,
      passed: false,
      expected: typeof testCase.expectedOutput === 'string' ? testCase.expectedOutput : testCase.expectedOutput.toString(),
      actual: '',
      points: testCase.points,
      earnedPoints: 0
    }

    try {
      // For keyword/code pattern tests, check the user code directly
      if (testCase.description.toLowerCase().includes('keyword') || 
          testCase.description.toLowerCase().includes('contains') ||
          testCase.description.toLowerCase().includes('variable') ||
          testCase.description.toLowerCase().includes('function')) {
        result.actual = userCode
        result.passed = this.validateOutput(userCode, testCase.expectedOutput)
        if (result.passed) {
          result.earnedPoints = testCase.points
        }
        return result
      }

      // If test case has input, we need to modify the code to handle it
      let codeToRun = userCode
      if (testCase.input) {
        // This is a simplified approach - you might need more sophisticated input handling
        codeToRun = userCode + `\n# Test input: ${testCase.input}\n`
      }

      const executionResult = await runPythonCode(codeToRun)
      result.actual = executionResult.output || executionResult.error || 'No output'

      if (executionResult.error) {
        result.passed = false
        result.actual = `Error: ${executionResult.error}`
      } else {
        result.passed = this.validateOutput(executionResult.output || '', testCase.expectedOutput)
        if (result.passed) {
          result.earnedPoints = testCase.points
        }
      }

    } catch (error) {
      result.passed = false
      result.actual = `Test execution error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    return result
  }

  /**
   * Generate helpful suggestions based on common mistakes
   */
  generateSuggestions(userCode: string, lesson: CourseLesson): string[] {
    const suggestions: string[] = []
    
    // Check for common Python mistakes
    if (userCode.includes('print(') && !userCode.includes('print("') && !userCode.includes("print('")) {
      suggestions.push('💡 Remember to use quotes around text in print statements')
    }
    
    if (lesson.expectedOutcomes?.containsKeywords) {
      const missingKeywords = lesson.expectedOutcomes.containsKeywords.filter(keyword => 
        !userCode.toLowerCase().includes(keyword.toLowerCase())
      )
      if (missingKeywords.length > 0) {
        suggestions.push(`🔑 Try using these concepts: ${missingKeywords.join(', ')}`)
      }
    }
    
    if (userCode.trim().length < 10) {
      suggestions.push('📝 Your code seems quite short. Make sure you\'re implementing all requirements.')
    }
    
    return suggestions
  }
} 