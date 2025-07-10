# Hello World Basics - Your First Python Program

## 🎯 What You'll Build
Your very first Python program! Learn to display text, use variables, and create personalized greetings.

## ⏰ Estimated Time: 10 minutes
**Difficulty**: Beginner

## 🧠 What You'll Learn
- How to use the `print()` function
- Working with strings (text)
- Creating and using variables
- Basic Python syntax rules

## 📋 Project Overview
You'll start with the classic "Hello World" program, then make it personal by adding your own information. This teaches you the fundamental building blocks of Python programming.

## 🚀 Starter Code

```python
# 👋 Your First Python Program
# Let's start with the classic Hello World

# Display text with print()
print("Hello, World!")

# Try changing the message
print("Hello, Python!")

# Use variables to store information
name = "Your Name Here"
print(f"Hello, {name}!")

# TODO: Create your own personalized greeting
# 1. Change "Your Name Here" to your actual name
# 2. Create a variable for your favorite hobby
# 3. Print a message that includes both your name and hobby
```

## 📝 Step-by-Step Instructions

### Step 1: Personalize Your Greeting
Replace `"Your Name Here"` with your actual name:
```python
name = "Aaron"  # Use your real name
```

### Step 2: Add Your Hobby
Create a new variable for something you enjoy:
```python
hobby = "coding"  # What do you like to do?
```

### Step 3: Create a Complete Introduction
Use both variables in a sentence:
```python
print(f"Hi! My name is {name} and I love {hobby}!")
```

## ✅ Complete Solution

```python
# Your First Python Program
print("Hello, World!")
print("Hello, Python!")

# Personal greeting
name = "Aaron"
hobby = "coding"
print(f"Hello, {name}!")
print(f"I love {hobby}!")
print(f"Hi! My name is {name} and I love {hobby}!")

# Try some variations
favorite_color = "blue"
print(f"My favorite color is {favorite_color}.")
print(f"{name} likes {hobby} and the color {favorite_color}!")
```

## 💡 Key Concepts Explained

**The print() Function**
```python
print("Hello!")  # Displays text on screen
```
- Put your message inside parentheses and quotes
- Python will show whatever you put between the quotes

**Strings (Text)**
```python
"Hello"    # Double quotes work
'Hello'    # Single quotes also work  
```
- Text in Python is called a "string"
- Always use quotes around text

**Variables**
```python
name = "Aaron"    # Store text in a variable
age = 25          # Store numbers too
```
- Variables are like labeled boxes that hold information
- You can use the information later by using the variable name

**F-strings (Text Formatting)**
```python
print(f"Hello {name}!")  # Puts the variable value into the text
```
- The `f` before the quote makes it an "f-string"
- Put variable names inside `{curly braces}`
- Python replaces `{name}` with the actual value

## 🎮 Try These Challenges

1. **Personal Profile**: Add variables for your age, city, and favorite food
2. **Math in Text**: Create a variable for your birth year and calculate your age
3. **Multiple Lines**: Create a story using several print statements
4. **Quotes Practice**: Try using both single and double quotes in the same program

## 🔄 Next Steps
Once you master this, you'll be ready for:
- Working with numbers and math
- Getting input from users  
- Making decisions with if statements
- Building more complex programs

## ⚡ Quick Tips
- **Experiment!** Try changing the text and variable names
- **Use meaningful names** like `favorite_color` instead of `x`
- **Check your quotes** - make sure they match (both single or both double)
- **Test often** - run your code to see what happens

---
**Solo Developer Note**: This lesson covers the absolute basics. Students should feel confident with variables and print statements before moving on. 