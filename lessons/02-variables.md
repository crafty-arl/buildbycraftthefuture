# Variables and Data Types

## What You'll Learn
- What variables are and why they're useful
- Different types of data in Python
- How to create and use variables
- Basic operations with variables

## Why Variables Matter

Think of variables like labeled boxes where you can store information. Instead of writing the same value over and over, you can store it once and reuse it everywhere.

```python
# Without variables (repetitive)
print("Welcome to Python, John!")
print("Your score is 85, John")
print("Goodbye, John!")

# With variables (much better)
user_name = "John"
score = 85
print(f"Welcome to Python, {user_name}!")
print(f"Your score is {score}, {user_name}")
print(f"Goodbye, {user_name}!")
```

## Data Types in Python

Python has several types of data:

### Strings (Text)
```python
name = "Alice"
message = "Hello there!"
color = 'blue'  # Single or double quotes both work
```

### Numbers
```python
age = 25          # Integer (whole number)
price = 19.99     # Float (decimal number)
temperature = -5  # Negative numbers work too
```

### Booleans (True/False)
```python
is_student = True
is_weekend = False
```

## Creating Variables

Variable names should be descriptive and follow these rules:
- Use lowercase with underscores: `user_name`, `total_score`
- Start with a letter, not a number
- No spaces or special characters (except underscore)

```python
# Good variable names
first_name = "Sarah"
age = 28
is_member = True

# Bad variable names (don't do this)
# 1name = "Sarah"  # Can't start with number
# first-name = "Sarah"  # No hyphens
# first name = "Sarah"  # No spaces
```

## Try It Yourself

```python
# Create variables for a simple profile
name = "Your Name"
age = 20
city = "Your City"
hobby = "Your Hobby"

# Print a nice introduction
print(f"Hi! I'm {name}, I'm {age} years old.")
print(f"I live in {city} and I love {hobby}.")
```

## Working with Numbers

```python
# Basic math operations
x = 10
y = 3

print(f"x + y = {x + y}")  # Addition: 13
print(f"x - y = {x - y}")  # Subtraction: 7
print(f"x * y = {x * y}")  # Multiplication: 30
print(f"x / y = {x / y}")  # Division: 3.333...
```

## Practice Challenge

Create a simple calculator for a pizza order:

```python
# Pizza order calculator
pizza_price = 12.99
number_of_pizzas = 3
tax_rate = 0.08  # 8% tax

subtotal = pizza_price * number_of_pizzas
tax = subtotal * tax_rate
total = subtotal + tax

print(f"Pizza price: ${pizza_price}")
print(f"Number of pizzas: {number_of_pizzas}")
print(f"Subtotal: ${subtotal:.2f}")
print(f"Tax: ${tax:.2f}")
print(f"Total: ${total:.2f}")
```

## Key Takeaways

- Variables store data for later use
- Use descriptive names with underscores
- Python has strings, numbers, and booleans
- Variables make code reusable and easier to maintain
- You can do math with number variables

## Next Steps

Now that you understand variables, let's learn about making decisions in your code with if statements and loops!

---

**Estimated time**: 10 minutes | **Difficulty**: Beginner 