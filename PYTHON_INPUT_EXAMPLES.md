# 🚀 Python Input Handling Examples

Your IDE supports **natural Python input()** exactly like a real Python terminal! Here are examples to get you started.

## 🌟 Basic Input Examples

### Simple User Input
```python
# Basic input example
name = input("What's your name? ")
print(f"Hello, {name}!")
```

### Multiple Inputs
```python
# Multiple inputs work seamlessly
name = input("Enter your name: ")
age = int(input("Enter your age: "))
city = input("What city are you from? ")

print(f"\nProfile:")
print(f"Name: {name}")
print(f"Age: {age}")
print(f"City: {city}")
```

## 🎮 Interactive Programs

### Number Guessing Game
```python
import random

def guessing_game():
    number = random.randint(1, 100)
    attempts = 0
    
    print("🎯 Guess the number between 1-100!")
    
    while True:
        guess = int(input("Your guess: "))
        attempts += 1
        
        if guess == number:
            print(f"🎉 Correct! You won in {attempts} attempts!")
            break
        elif guess < number:
            print("📈 Too low!")
        else:
            print("📉 Too high!")

guessing_game()
```

### Interactive Calculator
```python
def calculator():
    print("🧮 Simple Calculator")
    print("Operations: +, -, *, /, quit")
    
    while True:
        operation = input("\nEnter operation (or 'quit'): ")
        
        if operation.lower() == 'quit':
            print("👋 Goodbye!")
            break
            
        if operation in ['+', '-', '*', '/']:
            a = float(input("Enter first number: "))
            b = float(input("Enter second number: "))
            
            if operation == '+':
                result = a + b
            elif operation == '-':
                result = a - b
            elif operation == '*':
                result = a * b
            elif operation == '/':
                result = a / b if b != 0 else "Error: Division by zero"
                
            print(f"Result: {result}")
        else:
            print("❌ Invalid operation!")

calculator()
```

## 📊 Data Collection

### Survey Tool
```python
def survey():
    responses = []
    
    print("📋 Quick Survey")
    name = input("Name: ")
    
    print("\nRate these on a scale of 1-5:")
    python_rating = int(input("How much do you like Python? "))
    coding_rating = int(input("How much do you enjoy coding? "))
    
    feedback = input("Any additional feedback? ")
    
    survey_data = {
        'name': name,
        'python_rating': python_rating,
        'coding_rating': coding_rating,
        'feedback': feedback
    }
    
    print(f"\n✅ Survey complete! Thank you, {name}!")
    print(f"📊 Your ratings: Python={python_rating}/5, Coding={coding_rating}/5")
    
    return survey_data

# Run the survey
result = survey()
```

## 🔬 Data Science Integration

### Interactive Data Analysis
```python
import pandas as pd
import numpy as np

def create_dataset():
    print("📊 Interactive Dataset Creator")
    
    # Get dataset parameters
    num_rows = int(input("How many data points? "))
    dataset_name = input("What should we call this dataset? ")
    
    # Generate data
    data = {
        'id': range(1, num_rows + 1),
        'value': np.random.randn(num_rows),
        'category': np.random.choice(['A', 'B', 'C'], num_rows)
    }
    
    df = pd.DataFrame(data)
    
    print(f"\n✨ Created '{dataset_name}' with {num_rows} rows!")
    print(df.head())
    
    # Interactive analysis
    while True:
        action = input("\nWhat would you like to do? (stats/plot/filter/quit): ")
        
        if action == 'stats':
            print(df.describe())
        elif action == 'plot':
            print("📈 Plotting feature requires matplotlib setup")
        elif action == 'filter':
            category = input("Filter by category (A/B/C): ")
            filtered = df[df['category'] == category]
            print(f"Filtered data for category {category}:")
            print(filtered)
        elif action == 'quit':
            break
        else:
            print("❌ Unknown action")
    
    return df

# Create your dataset
dataset = create_dataset()
```

## 💡 Usage Tips

### 🎯 Best Practices
1. **Write in Editor** - Create your script in the editor, then click "Run"
2. **Natural Flow** - Your code will pause at `input()` calls automatically
3. **Multiple Inputs** - Chain as many `input()` calls as needed
4. **Error Handling** - Add try/except around `int()` conversions
5. **Save Tools** - Use "Save as Tool" to build your portfolio

### ⚡ Quick Tips
- **REPL Mode**: Click "REPL" for interactive Python commands
- **Clear Terminal**: Use Ctrl+L or click "Clear" button  
- **History**: Use ↑/↓ arrows in REPL to navigate command history
- **Input Types**: Convert input with `int()`, `float()`, etc.

### 🚀 Advanced Features
- **Data Science**: Pre-loaded with pandas, numpy, matplotlib
- **Web APIs**: Use `requests` for HTTP calls
- **File Operations**: Read/write files with Python's built-in functions
- **Game Development**: Use `random`, `time` modules for interactive games

## 🎉 Start Building!

Copy any of these examples into your editor and click "Run" to see the natural input handling in action. The terminal will pause and wait for your input exactly like a real Python environment! 