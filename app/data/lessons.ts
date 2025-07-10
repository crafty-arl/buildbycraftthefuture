// Simplified lesson structure for solo developer maintenance
export interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  order: number
  
  // Core content - simple and maintainable
  overview: string
  concepts: string[]
  starterCode: string
  instructions: string[]
  solution: string
  
  // Optional enhancements
  tips?: string[]
  challenges?: string[]
  nextSteps?: string
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  level: string
  lessons: Lesson[]
  status: 'available' | 'coming-soon'
}

// Simplified Python Fundamentals Course
export const courses: Course[] = [
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    description: 'Build practical Python tools from day one',
    icon: '🐍',
    level: 'Beginner',
    status: 'available',
    lessons: [
      {
        id: 'receipt-generator',
        title: 'Receipt Generator Tool',
        description: 'Build a simple receipt generator using pure Python - perfect first project',
        difficulty: 'Beginner',
        estimatedTime: '15 min',
        order: 1,
        overview: 'Create a tool that generates clean text receipts from item names and prices. You\'ll learn basic Python syntax, string formatting, math operations, and how to work with data structures.',
        concepts: [
          'Variables and data types',
          'Lists and dictionaries', 
          'Basic math operations',
          'String formatting',
          'Function basics'
        ],
        starterCode: `# 🧾 Simple Receipt Generator
# Build a tool that creates clean text receipts

def create_receipt(items):
    """
    Generate a simple text receipt from a list of items
    
    items: list of dictionaries like [{"name": "Coffee", "price": 3.50}]
    """
    # TODO: Build your receipt generator here
    
    # Step 1: Calculate total price
    total = 0
    
    # Step 2: Create receipt header
    receipt = "\\n" + "="*30 + "\\n"
    receipt += "    PYTHON CAFE    \\n"
    receipt += "="*30 + "\\n"
    
    # Step 3: Add items to receipt
    
    # Step 4: Add total
    
    # Step 5: Add footer
    receipt += "\\nThank you! 😊\\n"
    receipt += "="*30
    
    return receipt

# Test data
sample_items = [
    {"name": "Coffee", "price": 3.50},
    {"name": "Bagel", "price": 2.25},
    {"name": "Orange Juice", "price": 4.00}
]

# Test your function
print("🧾 Receipt Generator")
print(create_receipt(sample_items))`,
        instructions: [
          'Calculate the total price by adding up all item prices',
          'Add each item to the receipt with name and price',
          'Format prices to show 2 decimal places (like $3.50)',
          'Add the total at the bottom',
          'Make sure the receipt looks clean and readable'
        ],
        solution: `def create_receipt(items):
    # Calculate total
    total = 0
    for item in items:
        total += item["price"]
    
    # Create receipt header
    receipt = "\\n" + "="*30 + "\\n"
    receipt += "    PYTHON CAFE    \\n"
    receipt += "="*30 + "\\n"
    
    # Add items
    for item in items:
        receipt += f"{item['name']:<15} \${item['price']:>6.2f}\\n"
    
    # Add total
    receipt += "-"*30 + "\\n"
    receipt += f"{'TOTAL:':<15} \${total:>6.2f}\\n"
    
    # Add footer
    receipt += "\\nThank you! 😊\\n"
    receipt += "="*30
    
    return receipt`,
        tips: [
          'Use a for loop to go through each item',
          'The += operator adds to a running total',
          'f-strings make formatting text easier: f"Hello {name}"',
          'Use \\n for new lines in your text'
        ],
        challenges: [
          'Add tax calculation (8.5% of total)',
          'Add the current date and time',
          'Create a function to add new items to the list'
        ]
      },
      {
        id: 'hello-world',
        title: 'Hello World Basics',
        description: 'Your very first Python program - learn the fundamentals',
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        order: 2,
        overview: 'Learn the basics of Python by creating your first program. Understand variables, strings, and how to display output.',
        concepts: [
          'print() function',
          'Strings and quotes',
          'Variables',
          'Basic syntax'
        ],
        starterCode: `# 👋 Your First Python Program
# Let's start with the classic Hello World

# Display text with print()
print("Hello, World!")

# Try changing the message
print("Hello, Python!")

# Use variables to store information
name = "Your Name Here"
print(f"Hello, {name}!")

# TODO: Create your own personalized greeting`,
        instructions: [
          'Change "Your Name Here" to your actual name',
          'Create a variable for your favorite hobby',
          'Print a message that includes both your name and hobby',
          'Experiment with different messages'
        ],
        solution: `# Your First Python Program
print("Hello, World!")
print("Hello, Python!")

# Personal greeting
name = "Aaron"
hobby = "coding"
print(f"Hello, {name}!")
print(f"I love {hobby}!")
print(f"My name is {name} and I enjoy {hobby}.")`,
        tips: [
          'Strings go inside quotes: "like this"',
          'Variables store values: name = "value"',
          'f-strings let you insert variables: f"Hello {name}"',
          'print() displays text on the screen'
        ]
      },
      {
        id: 'variables-math',
        title: 'Variables and Math',
        description: 'Learn to work with numbers and perform calculations',
        difficulty: 'Beginner',
        estimatedTime: '12 min',
        order: 3,
        overview: 'Master variables and mathematical operations in Python. Build a simple calculator and learn about different data types.',
        concepts: [
          'Numbers and math operations',
          'Different variable types',
          'Calculations and rounding',
          'User-friendly output'
        ],
        starterCode: `# 🧮 Variables and Math Operations
# Learn to work with numbers in Python

# Different types of data
project_name = "Calculator Tool"    # String (text)
tasks_done = 8                     # Integer (whole number)
progress = 75.5                    # Float (decimal number)
is_complete = False                # Boolean (True/False)

print(f"Project: {project_name}")
print(f"Progress: {progress}%")

# Math operations
total_tasks = 10
remaining = total_tasks - tasks_done
percentage = (tasks_done / total_tasks) * 100

print(f"Tasks remaining: {remaining}")
print(f"Completion: {percentage}%")

# TODO: Build a simple tip calculator
bill_amount = 25.50
tip_rate = 0.20  # 20%

# Calculate tip and total`,
        instructions: [
          'Calculate the tip amount (bill × tip rate)',
          'Calculate the total (bill + tip)',
          'Display the results in a user-friendly format',
          'Round the amounts to 2 decimal places'
        ],
        solution: `# Variables and Math Operations
project_name = "Calculator Tool"
tasks_done = 8
progress = 75.5
is_complete = False

print(f"Project: {project_name}")
print(f"Progress: {progress}%")

# Math operations
total_tasks = 10
remaining = total_tasks - tasks_done
percentage = (tasks_done / total_tasks) * 100

print(f"Tasks remaining: {remaining}")
print(f"Completion: {percentage}%")

# Tip calculator
bill_amount = 25.50
tip_rate = 0.20

tip_amount = bill_amount * tip_rate
total_amount = bill_amount + tip_amount

print(f"\\n💰 Tip Calculator")
print(f"Bill: \${bill_amount:.2f}")
print(f"Tip (20%): \${tip_amount:.2f}")
print(f"Total: \${total_amount:.2f}")`,
        tips: [
          'Use * for multiplication, + for addition',
          'Round numbers with :.2f in f-strings',
          'Integers are whole numbers, floats have decimals',
          'Boolean values are either True or False'
        ]
      }
    ]
  }
]

// Helper functions for easy maintenance
export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = courses.find(c => c.id === courseId)
  return course?.lessons.find(l => l.id === lessonId)
}

export function getAllLessons(): Lesson[] {
  return courses.flatMap(course => course.lessons)
}

export function getLessonsByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Lesson[] {
  return getAllLessons().filter(lesson => lesson.difficulty === difficulty)
} 