# Receipt Generator - Your First Python Tool

## 🎯 What You'll Build
A simple receipt generator that takes a list of items and creates a clean, formatted text receipt. Perfect introduction to Python programming!

## ⏰ Estimated Time: 15 minutes
**Difficulty**: Beginner

## 🧠 What You'll Learn
- Variables and data types (strings, numbers, lists, dictionaries)
- For loops to process multiple items
- String formatting for clean output
- Basic mathematical operations
- Function structure and documentation

## 📋 Project Overview
You'll create a function that takes a list of items (like what someone bought at a cafe) and generates a professional-looking text receipt. This teaches you fundamental programming concepts while building something actually useful!

## 🚀 Starter Code

```python
# 🧾 Simple Receipt Generator
# Build a tool that creates clean text receipts

def create_receipt(items):
    """
    Generate a formatted text receipt from a list of items
    
    Args:
        items: List of dictionaries like [{"name": "Coffee", "price": 3.50}]
    
    Returns:
        str: Complete formatted receipt
    """
    # TODO: Build your receipt generator here
    
    # Step 1: Calculate total price
    total = 0
    # (Add your code here)
    
    # Step 2: Create receipt header
    receipt = "\n" + "="*35 + "\n"
    receipt += "     PYTHON CORNER STORE     \n"
    receipt += "="*35 + "\n\n"
    
    # Step 3: Add each item to receipt
    # (Add your code here)
    
    # Step 4: Add total section
    receipt += "\n" + "-"*35 + "\n"
    # (Add your code here)
    
    # Step 5: Add footer
    receipt += "\nThank you for shopping! 😊\n"
    receipt += "="*35 + "\n"
    
    return receipt

# Test your function with sample data
sample_items = [
    {"name": "Coffee", "price": 3.50},
    {"name": "Bagel", "price": 2.25},  
    {"name": "Orange Juice", "price": 4.00}
]

print("🧾 Testing Receipt Generator")
print(create_receipt(sample_items))
```

## 📝 Step-by-Step Instructions

### Step 1: Calculate the Total
Add code to calculate the total price of all items:
```python
# Use a for loop to go through each item
for item in items:
    total += item["price"]  # Add each price to the total
```

### Step 2: Add Items to Receipt  
Show each item with its price:
```python
for item in items:
    name = item["name"]
    price = item["price"]
    receipt += f"{name:<25} ${price:>6.2f}\n"
```

### Step 3: Add the Total
Display the final total:
```python
receipt += f"{'TOTAL:':<25} ${total:>6.2f}\n"
```

## ✅ Complete Solution

```python
def create_receipt(items):
    """Generate a formatted text receipt from a list of items"""
    
    # Calculate total price
    total = 0
    for item in items:
        total += item["price"]
    
    # Create receipt header
    receipt = "\n" + "="*35 + "\n"
    receipt += "     PYTHON CORNER STORE     \n"
    receipt += "="*35 + "\n\n"
    
    # Add each item to receipt
    for item in items:
        name = item["name"]
        price = item["price"]
        receipt += f"{name:<25} ${price:>6.2f}\n"
    
    # Add total section
    receipt += "\n" + "-"*35 + "\n"
    receipt += f"{'TOTAL:':<25} ${total:>6.2f}\n"
    
    # Add footer
    receipt += "\nThank you for shopping! 😊\n"
    receipt += "="*35 + "\n"
    
    return receipt
```

## 💡 Key Concepts Explained

**Dictionaries**: Store related data together
```python
item = {"name": "Coffee", "price": 3.50}
# Access with: item["name"] and item["price"]
```

**For Loops**: Process each item in a list
```python
for item in items:
    # Do something with each item
```

**F-strings**: Format text with variables
```python
f"{name:<25} ${price:>6.2f}"
# <25 = left-align in 25 spaces
# >6.2f = right-align number with 2 decimal places
```

## 🎮 Try These Challenges

1. **Add Tax**: Calculate 8.5% tax on the subtotal
2. **Add Date**: Include today's date at the top
3. **Item Counter**: Show how many total items were purchased
4. **Discount**: Add a 10% discount if total is over $20

## 🔄 Next Steps
Once you complete this, you'll be ready for:
- User input handling
- File operations (saving receipts)
- More complex calculations
- Building a complete point-of-sale system

## ⚡ Quick Tips
- Use `+=` to add to running totals
- String formatting makes output look professional
- Test with different data to make sure it works
- Comment your code so others (and future you) understand it

---
**Solo Developer Note**: This lesson is designed to be self-contained and easy to update. Just modify the starter code, solution, or challenges as needed! 