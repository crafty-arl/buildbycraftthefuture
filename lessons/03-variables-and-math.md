# Variables and Math - Build a Tip Calculator

## 🎯 What You'll Build
A practical tip calculator that works with different bill amounts and tip percentages. Learn to work with numbers and perform calculations in Python.

## ⏰ Estimated Time: 12 minutes
**Difficulty**: Beginner

## 🧠 What You'll Learn
- Different types of data (strings, integers, floats, booleans)
- Mathematical operations in Python
- Formatting numbers for display
- Building practical calculation tools

## 📋 Project Overview
You'll create a tip calculator that takes a bill amount and tip percentage, then calculates the tip and total. This teaches you how to work with numbers, perform calculations, and format output professionally.

## 🚀 Starter Code

```python
# 🧮 Variables and Math Operations
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

# Calculate tip and total
# (Add your code here)
```

## 📝 Step-by-Step Instructions

### Step 1: Calculate the Tip Amount
Multiply the bill by the tip rate:
```python
tip_amount = bill_amount * tip_rate
```

### Step 2: Calculate the Total
Add the bill and tip together:
```python
total_amount = bill_amount + tip_amount
```

### Step 3: Display the Results
Show everything with nice formatting:
```python
print(f"\n💰 Tip Calculator")
print(f"Bill: ${bill_amount:.2f}")
print(f"Tip (20%): ${tip_amount:.2f}")
print(f"Total: ${total_amount:.2f}")
```

## ✅ Complete Solution

```python
# Variables and Math Operations
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

print(f"\n💰 Tip Calculator")
print(f"Bill: ${bill_amount:.2f}")
print(f"Tip (20%): ${tip_amount:.2f}")
print(f"Total: ${total_amount:.2f}")

# Try different tip rates
print(f"\n📊 Different Tip Amounts:")
for tip_percent in [15, 18, 20, 25]:
    tip_rate = tip_percent / 100
    tip = bill_amount * tip_rate
    total = bill_amount + tip
    print(f"{tip_percent}%: Tip ${tip:.2f}, Total ${total:.2f}")
```

## 💡 Key Concepts Explained

**Data Types**
```python
name = "Python"        # String (text)
age = 30              # Integer (whole number)
price = 19.99         # Float (decimal number)
is_ready = True       # Boolean (True or False)
```

**Math Operations**
```python
# Basic operations
result = 10 + 5       # Addition: 15
result = 10 - 3       # Subtraction: 7
result = 4 * 6        # Multiplication: 24
result = 15 / 3       # Division: 5.0
result = 2 ** 3       # Power: 8
result = 17 % 5       # Modulo (remainder): 2
```

**Number Formatting**
```python
price = 19.999
print(f"${price:.2f}")    # Shows: $20.00
# :.2f means "show 2 decimal places"
```

**Order of Operations**
```python
result = 2 + 3 * 4        # Result: 14 (not 20!)
result = (2 + 3) * 4      # Result: 20 (parentheses first)
```

## 🎮 Try These Challenges

1. **Tax Calculator**: Add sales tax calculation (8.5% on the bill)
2. **Split the Bill**: Calculate how much each person pays if splitting among friends
3. **Discount Calculator**: Calculate the final price after a percentage discount
4. **Compound Interest**: Calculate how money grows over time with interest

## 🔄 Advanced Examples

```python
# Bill splitter
bill = 120.00
tip_rate = 0.18
people = 4

tip = bill * tip_rate
total = bill + tip
per_person = total / people

print(f"Bill: ${bill:.2f}")
print(f"Tip (18%): ${tip:.2f}")
print(f"Total: ${total:.2f}")
print(f"Per person: ${per_person:.2f}")
```

## ⚡ Quick Tips
- **Use meaningful variable names**: `bill_amount` not `x`
- **Remember order of operations**: Use parentheses when needed
- **Format money properly**: Always use `:.2f` for currency
- **Test with different values**: Make sure your math is correct
- **Integer vs Float**: Division always gives a float (decimal)

## 🔄 Next Steps
Once you master this, you'll be ready for:
- Getting user input for calculations
- Making decisions with if statements  
- Creating reusable functions
- Building more complex tools

---
**Solo Developer Note**: This lesson focuses on practical math skills. Students should be comfortable with variables and basic operations before moving to more complex topics. 