export interface Slide {
  id: string
  type: 'intro' | 'concept' | 'practice' | 'summary'
  title: string
  content: string[]
  code?: string
  starterCode?: string
  isInteractive?: boolean
}

export interface Module {
  id: string
  title: string
  description: string
  difficulty: string
  time: string
  slides: Slide[]
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  color: string
  level: string
  modules: Module[]
  totalTime: string
  status: 'available' | 'coming-soon'
}

export const courses: Course[] = [
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    description: 'Build your first Python tools from the ground up',
    icon: '🐍',
    color: 'neon-blue',
    level: 'Beginner',
    status: 'available',
    totalTime: '30 min',
    modules: [
      {
        id: '01-hello-world',
        title: 'Hello World → Your First Tool',
        description: 'Build your first Python script. No theory, just code that works.',
        difficulty: 'Starter',
        time: '5 min',
        slides: [
          {
            id: 'intro',
            type: 'intro',
            title: 'Ready to Build?',
            content: [
              'Python is powerful because it gets out of your way.',
              'Today you\'ll build:',
              '• Your first working Python script',
              '• Text output tools (print statements)',
              '• Variable storage systems',
              '• A foundation for real automation'
            ]
          },
          {
            id: 'print-concept',
            type: 'concept',
            title: 'print() - Your Output Tool',
            content: [
              'The print() function displays text. Simple as that.',
              'Put your message in quotes - Python handles the rest.',
              'Single \' or double " quotes both work.',
              'This is your first tool for building user interfaces.'
            ],
            code: 'print("Hello, Builder!")\nprint(\'Start building now.\')'
          },
          {
            id: 'first-practice',
            type: 'practice',
            title: 'Build Your First Script',
            content: [
              'Time to build something real.',
              'Customize the message below.',
              'Make it yours. Make it useful.'
            ],
            starterCode: '# Build your first tool\nprint("Hello, World!")\n\n# Add your own message below',
            isInteractive: true
          },
          {
            id: 'variables-concept',
            type: 'concept',
            title: 'Variables - Reusable Data Storage',
            content: [
              'Variables store data you want to reuse.',
              'Think of them as labeled containers.',
              'Write once, use everywhere.',
              'Essential for building scalable tools.'
            ],
            code: 'name = "Builder"\nprint(f"Welcome, {name}!")\nprint(f"Ready to build, {name}?")'
          },
          {
            id: 'variables-practice',
            type: 'practice',
            title: 'Build a Personalized Tool',
            content: [
              'Build a tool that works for anyone.',
              'Use variables to make it flexible.',
              'This is how you build reusable code.'
            ],
            starterCode: '# Build a personalized greeting tool\nuser_name = "Your Name"\nfavorite_language = "Python"\n\n# Build your output below',
            isInteractive: true
          },
          {
            id: 'summary',
            type: 'summary',
            title: 'First Tool Built! 🔧',
            content: [
              'You just built working Python code.',
              'What you shipped:',
              '• Text output system (print)',
              '• Data storage (variables)',
              '• Reusable, customizable scripts',
              '• Foundation for bigger builds',
              'Next: Scale up to data manipulation and automation!'
            ]
          }
        ]
      },
      {
        id: '02-variables',
        title: 'Variables → Data Management Tools',
        description: 'Build flexible scripts with data types, operations, and smart storage.',
        difficulty: 'Starter',
        time: '10 min',
        slides: [
          {
            id: 'intro',
            type: 'intro',
            title: 'Build Smarter Tools',
            content: [
              'Variables aren\'t just storage - they\'re your building blocks.',
              'Today you\'ll build:',
              '• Data management systems',
              '• Flexible, reusable scripts',
              '• Tools that handle different data types',
              '• Code that scales and adapts'
            ]
          },
          {
            id: 'data-types',
            type: 'concept',
            title: 'Data Types - Choose Your Tools',
            content: [
              'Different data needs different tools:',
              'Strings (text) → "Hello Builder"',
              'Numbers (integers) → 42',
              'Decimals (floats) → 19.99',
              'True/False (booleans) → True',
              'Pick the right tool for the job.'
            ],
            code: 'project_name = "Build Bot"  # String\nfiles_processed = 150        # Integer\ncompletion_rate = 94.7       # Float\nis_deployed = True           # Boolean\n\nprint(f"Project: {project_name}")\nprint(f"Status: {completion_rate}% complete")'
          },
          {
            id: 'string-tools',
            type: 'practice',
            title: 'Build a Status Report Tool',
            content: [
              'Build a tool that reports project status.',
              'Use different data types strategically.',
              'Make it informative and useful.'
            ],
            starterCode: '# Build a project status tool\nproject_name = "Your Project"\ntasks_completed = 8\ntotal_tasks = 10\nis_on_schedule = True\n\n# Calculate and display progress',
            isInteractive: true
          },
          {
            id: 'math-operations',
            type: 'concept',
            title: 'Math Operations - Data Processing',
            content: [
              'Python handles calculations for you:',
              'Addition: +    Subtraction: -',
              'Multiplication: *    Division: /',
              'Powers: **    Modulo: %',
              'Build tools that process and analyze data.'
            ],
            code: 'files = 120\nprocessed = 87\nremaining = files - processed\nprogress = (processed / files) * 100\n\nprint(f"Progress: {progress:.1f}%")\nprint(f"Remaining: {remaining} files")'
          },
          {
            id: 'calculator-practice',
            type: 'practice',
            title: 'Build a Progress Calculator',
            content: [
              'Build a tool that calculates completion percentages.',
              'Make it handle any project size.',
              'This is how you build reusable utilities.'
            ],
            starterCode: '# Build a progress calculator tool\ncurrent_progress = 45\ntotal_required = 100\n\n# Calculate remaining work and percentage\n# Display useful metrics',
            isInteractive: true
          },
          {
            id: 'f-strings',
            type: 'concept',
            title: 'F-Strings - Template Engine',
            content: [
              'F-strings format output professionally:',
              'f"Hello {name}" embeds variables',
              'f"Progress: {percent:.1f}%" controls formatting',
              'Build clean, readable output for users.'
            ],
            code: 'user = "Builder"\nscore = 87.543\nlevel = "Advanced"\n\nreport = f"User: {user} | Score: {score:.1f} | Level: {level}"\nprint(report)\nprint(f"Achievement unlocked: {score >= 85}")'
          },
          {
            id: 'report-practice',
            type: 'practice',
            title: 'Build a Performance Dashboard',
            content: [
              'Build a tool that displays formatted metrics.',
              'Use f-strings for professional output.',
              'Make it look like a real dashboard.'
            ],
            starterCode: '# Build a performance dashboard\nteam_name = "Dev Team"\ntasks_done = 23\ntarget = 30\nefficiency = (tasks_done / target) * 100\n\n# Create a formatted dashboard display',
            isInteractive: true
          },
          {
            id: 'summary',
            type: 'summary',
            title: 'Data Tools Built! 📊',
            content: [
              'You\'ve built serious data management tools.',
              'What you shipped:',
              '• Multi-type data handling',
              '• Mathematical processing systems',
              '• Professional formatting tools',
              '• Reusable calculation utilities',
              'Next up: Functions and modular code architecture!'
            ]
          }
        ]
      },
      {
        id: '03-functions',
        title: 'Functions → Reusable Code Modules',
        description: 'Build modular tools with parameters, returns, and clean architecture.',
        difficulty: 'Builder',
        time: '15 min',
        slides: [
          {
            id: 'intro',
            type: 'intro',
            title: 'Scale Your Builds',
            content: [
              'Functions are how you build tools that last.',
              'Today you\'ll architect:',
              '• Reusable code modules',
              '• Parameterized tools that adapt',
              '• Clean, maintainable systems',
              '• Professional-grade code structure'
            ]
          },
          {
            id: 'why-functions',
            type: 'concept',
            title: 'Functions - Your Code Toolkit',
            content: [
              'Functions eliminate repetitive code.',
              'Write once, use everywhere.',
              'Build tools that other tools can use.',
              'This is how you scale from scripts to systems.'
            ],
            code: '# Without functions (repetitive)\nprint("Processing file 1...")\nprint("Status: Complete")\nprint("---")\n\nprint("Processing file 2...")\nprint("Status: Complete") \nprint("---")\n\n# With functions (scalable)\ndef process_status(file_num):\n    print(f"Processing file {file_num}...")\n    print("Status: Complete")\n    print("---")\n\nprocess_status(1)\nprocess_status(2)'
          },
          {
            id: 'basic-function',
            type: 'practice',
            title: 'Build Your First Function Tool',
            content: [
              'Build a function that displays system status.',
              'Make it reusable and professional.',
              'This is your first modular tool.'
            ],
            starterCode: '# Build a status display function\ndef show_status():\n    # Your status display code here\n    pass\n\n# Test your function\nshow_status()',
            isInteractive: true
          },
          {
            id: 'parameters',
            type: 'concept',
            title: 'Parameters - Configurable Tools',
            content: [
              'Parameters make functions flexible.',
              'Pass data in, get customized results.',
              'Build tools that adapt to any situation.',
              'This is how you build professional utilities.'
            ],
            code: 'def build_report(project, completion, team_size):\n    print(f"Project: {project}")\n    print(f"Progress: {completion}%")\n    print(f"Team Size: {team_size} developers")\n    print("---")\n\nbuild_report("Web App", 75, 4)\nbuild_report("API", 90, 2)'
          },
          {
            id: 'params-practice',
            type: 'practice',
            title: 'Build a Configurable Calculator',
            content: [
              'Build a function that calculates progress for any project.',
              'Make it accept different inputs.',
              'Build something truly reusable.'
            ],
            starterCode: '# Build a progress calculator function\ndef calculate_progress(completed, total):\n    # Your calculation logic here\n    pass\n\n# Test with different projects\ncalculate_progress(45, 60)\ncalculate_progress(120, 150)',
            isInteractive: true
          },
          {
            id: 'return-values',
            type: 'concept',
            title: 'Return Values - Tool Output',
            content: [
              'Return values let functions produce data.',
              'Build tools that other tools can use.',
              'Chain functions together for complex workflows.',
              'This is how you build system architecture.'
            ],
            code: 'def calculate_efficiency(completed, total, hours):\n    completion_rate = (completed / total) * 100\n    tasks_per_hour = completed / hours\n    \n    return completion_rate, tasks_per_hour\n\n# Use the returned data\nrate, speed = calculate_efficiency(80, 100, 16)\nprint(f"Completion: {rate}%")\nprint(f"Speed: {speed:.1f} tasks/hour")'
          },
          {
            id: 'return-practice',
            type: 'practice',
            title: 'Build a Metrics Engine',
            content: [
              'Build a function that calculates and returns multiple metrics.',
              'Make it return data other functions can use.',
              'Build the foundation for a larger system.'
            ],
            starterCode: '# Build a metrics calculation engine\ndef analyze_performance(tasks_done, time_spent, target):\n    # Calculate multiple metrics\n    # Return them for other tools to use\n    pass\n\n# Test your metrics engine\nresults = analyze_performance(25, 8, 30)\nprint(f"Analysis complete: {results}")',
            isInteractive: true
          },
          {
            id: 'summary',
            type: 'summary',
            title: 'Modular System Built! ⚙️',
            content: [
              'You\'ve architected reusable code systems.',
              'What you built:',
              '• Modular function libraries',
              '• Parameterized, flexible tools',
              '• Data-producing utilities',
              '• Professional code architecture',
              'You\'re now building like a pro. Next: Advanced data structures and file processing!'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build interactive web apps with modern JavaScript',
    icon: '🌐',
    color: 'neon-green',
    level: 'Intermediate',
    status: 'coming-soon',
    totalTime: '45 min',
    modules: []
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Transform data into insights with Python tools',
    icon: '📊',
    color: 'neon-purple',
    level: 'Intermediate',
    status: 'coming-soon',
    totalTime: '60 min',
    modules: []
  }
]

// Legacy export for backward compatibility
export const lessons = courses[0].modules
export type Lesson = Module 