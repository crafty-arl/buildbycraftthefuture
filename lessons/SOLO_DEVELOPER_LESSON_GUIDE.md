# Solo Developer Lesson Creation Guide

## 🎯 Overview

This guide shows you how to easily create and maintain Python lessons using our simplified system. You can choose between two formats:

1. **Simple Lessons** - Quick, single-step lessons (perfect for basic concepts)
2. **Stepped Lessons** - 7-step progressive lessons (perfect for building complete projects)

Both formats are designed for easy solo developer maintenance!

---

## 📁 File Structure

```
lessons/
├── README.md                              # Basic lesson organization
├── SOLO_DEVELOPER_LESSON_GUIDE.md        # This guide
├── 01-receipt-generator.md                # Original lesson (simple format)
├── 01-receipt-generator-stepped.md       # New stepped format
├── 02-hello-world-basics.md              # Simple format
└── 03-variables-and-math.md              # Simple format

app/data/
├── tools.ts                               # Lesson configuration
├── lessonParser.ts                        # Markdown parser (automatic)
└── lessons.ts                             # Legacy lessons (can ignore)
```

---

## 🚀 Quick Start - Adding a New Lesson

### Option 1: Simple Lesson (Faster to Create)

1. **Create the lesson in `app/data/tools.ts`**:

```typescript
{
  id: 'my-new-lesson',
  slug: 'my-new-lesson',
  title: 'My New Lesson',
  description: 'What students will learn',
  track: 'python',
  difficulty: 'Beginner',
  estimatedTime: '15 min',
  order: 4, // Next available number
  lessonType: 'simple', // Simple format
  
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
```

2. **That's it!** Your lesson is ready at `/tool/my-new-lesson`

### Option 2: Stepped Lesson (More Comprehensive)

1. **Create a markdown file** (e.g., `lessons/04-my-stepped-lesson.md`):

```markdown
# My Stepped Lesson - 7 Progressive Steps

## Lesson Overview
**Difficulty**: Beginner | **Time**: 20 minutes | **Track**: Python

Brief description of what students will build.

**Concepts You'll Learn**:
- Variables and functions
- Loops and conditionals
- String manipulation

---

## Step 1: Setup
**Goal**: Learn basic setup and variables

### What You'll Build
Set up the basic structure and create variables.

### Instructions
1. Create a main function
2. Set up initial variables
3. Print a welcome message

### Starter Code
```python
# Step 1: Setup
def main():
    ??? # Create a variable called 'name' with your name
    ??? # Print f"Welcome, {name}!"

main()
```

### Solution Code
```python
def main():
    name = "Python Learner"
    print(f"Welcome, {name}!")

main()
```

### Expected Output
```
Welcome, Python Learner!
```

---

## Step 2: Add Logic
**Goal**: Learn conditionals

[Continue with remaining steps...]

---

## Lesson Complete! 🎉

**What You Built**: A complete project summary

**Skills Mastered**:
- ✅ Variables
- ✅ Functions  
- ✅ Conditionals
```

2. **Add to `app/data/tools.ts`**:

```typescript
{
  id: 'my-stepped-lesson',
  slug: 'my-stepped-lesson', 
  title: 'My Stepped Lesson',
  description: 'Build something cool step by step',
  track: 'python',
  difficulty: 'Beginner',
  estimatedTime: '20 min',
  order: 4,
  lessonType: 'stepped', // Stepped format
  
  concepts: ['Variables', 'Functions', 'Conditionals']
}
```

3. **Name your markdown file correctly**:
   - File: `lessons/04-my-stepped-lesson-stepped.md` (order 4, slug `my-stepped-lesson`)
   - The system automatically loads it!

---

## 📝 Markdown Template for Stepped Lessons

Copy this template to create new stepped lessons:

```markdown
# Lesson Name - 7 Progressive Steps

## Lesson Overview  
**Difficulty**: Beginner | **Time**: 20 minutes | **Track**: Python

Description of what students will build.

**Concepts You'll Learn**:
- Concept 1
- Concept 2
- Concept 3

---

## Step 1: First Step
**Goal**: What students will learn

### What You'll Build
Brief outcome description.

### Instructions
1. First task
2. Second task
3. Third task

### Starter Code
```python
# Code with ??? placeholders
def my_function():
    ??? # Replace with code
    pass
```

### Solution Code
```python
# Complete working solution
def my_function():
    return "Hello!"
```

### Expected Output
```
Hello!
```

---

[Repeat for Steps 2-7...]

---

## Lesson Complete! 🎉

**What You Built**: Summary

**Skills Mastered**:
- ✅ Skill 1
- ✅ Skill 2
```

---

## 🛠️ Code Editor Features

Students get a professional coding experience with:

- **Monaco Editor** - VS Code-like editor
- **Python Syntax Highlighting** - Beautiful code coloring
- **Auto-completion** - IntelliSense for Python
- **Dark Theme** - Professional appearance
- **Live Code Execution** - Instant feedback
- **Step Navigation** - Easy progression through lessons
- **Solution Toggle** - Show/hide answers
- **Reset Code** - Start over easily

---

## 🎯 Best Practices for Solo Developers

### ✅ DO

- **Use ??? placeholders** in starter code for clarity
- **Write clear instructions** with numbered steps
- **Include expected output** so students know they're right
- **Progressive difficulty** - each step builds on the last
- **Test your code** before publishing
- **Use consistent formatting** across lessons

### ❌ DON'T

- Don't make steps too long (keep under 5 instructions)
- Don't skip explaining new concepts
- Don't forget to include imports if needed
- Don't make starter code too complex
- Don't use advanced concepts without teaching them first

---

## 🔧 Lesson Testing Checklist

Before publishing a lesson:

- [ ] Code runs without errors
- [ ] Instructions are clear and numbered
- [ ] Expected output matches actual output
- [ ] Starter code has helpful ??? placeholders
- [ ] Solution code is complete and working
- [ ] Concepts are clearly listed
- [ ] Difficulty and time estimates are accurate

---

## 📊 Maintenance Tips

### Regular Updates

1. **Check for broken code** - Test lessons monthly
2. **Update Python syntax** - Keep current with best practices  
3. **Gather student feedback** - Improve based on user experience
4. **Add new lessons** - Expand the curriculum gradually

### Version Control

- Keep lesson files in git
- Use descriptive commit messages
- Tag releases when adding new lessons
- Backup student progress data

---

## 🌟 Example Lesson Ideas

Here are some ideas for new lessons you can create:

### Beginner Lessons (Simple Format)
- Password Generator
- Temperature Converter
- Random Quote Display
- Simple Calculator
- Text Encryptor

### Intermediate Projects (Stepped Format)
- Todo List Manager
- Contact Book
- File Organizer
- Weather Dashboard
- Expense Tracker

### Advanced Projects (Stepped Format)
- Web Scraper
- Data Analyzer
- API Client
- Mini Game Engine
- Automation Script

---

## 🎉 You're Ready!

This system is designed to make lesson creation as easy as possible for solo developers. You can:

1. **Start simple** - Create basic lessons quickly
2. **Scale up** - Build comprehensive stepped projects
3. **Maintain easily** - Everything is in readable markdown and TypeScript
4. **Focus on teaching** - The technical stuff is handled automatically

Happy teaching! 🚀

---

## 📖 **IMPORTANT: Pure Markdown System**

### Current Status ✨
- **100% Markdown-driven**: No hardcoded fallbacks
- **Single source of truth**: All lesson content lives in `lessons/` folder
- **Clean and maintainable**: Edit markdown files to update lessons

### How It Works
1. **Client-side**: Fetches from `/api/lesson/[lesson-file-name]`
2. **Server-side**: Reads `lessons/[lesson-file-name].md` directly  
3. **Error handling**: Shows helpful error if markdown file is missing

### For Solo Developers
- **To edit lessons**: Edit the markdown file in `lessons/` folder
- **File naming**: Use format `01-lesson-name-stepped.md` for stepped lessons
- **Check browser console**: Look for `✅ Loaded lesson from markdown file`
- **Missing files**: System shows clear error with expected filename

### 🆕 **Creating New Auto-Loading Stepped Lessons**

The system now automatically loads stepped lessons! No manual parser needed.

**Step 1**: Create markdown file following naming convention:
- Format: `XX-slug-stepped.md` (where XX matches tool order, slug matches tool slug)
- Example: Tool slug `calculator` with order `2` → File `02-calculator-stepped.md`

**Step 2**: Add tool to `app/data/tools.ts`:
```typescript
{
  id: 'calculator',
  slug: 'calculator',
  title: 'Calculator Builder', 
  description: 'Build a calculator step by step',
  track: 'Python',
  difficulty: 'Beginner',
  estimatedTime: '25 minutes',
  order: 2,                    // This number must match filename
  lessonType: 'stepped',       // Enable stepped mode
  concepts: ['Functions', 'User input', 'Math'],
  // ... other properties
}
```

**Step 3**: That's it! The system automatically:
- Loads `lessons/02-calculator-stepped.md` 
- Parses all 7 steps
- Shows helpful error if file is missing

---

## 🆘 Need Help?

Common issues and solutions:

**Q: My lesson isn't showing up**
A: Check that you added it to `tools.ts` and the slug matches

**Q: Are my markdown changes showing up?**
A: Check browser console for loading messages. Refresh page to reload markdown.

**Q: Code execution isn't working** 
A: Verify your code has proper print statements or function calls

**Q: Step navigation is broken**
A: Make sure your markdown follows the exact format with proper headers

**Q: Syntax highlighting is off**
A: Ensure code blocks are marked with ```python

**Q: Students can't see solutions**
A: Check that both starterCode and solutionCode are provided

**Q: Markdown parsing failed**
A: The system will fall back to hardcoded version. Check markdown syntax in your file. 