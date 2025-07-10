# Receipt Generator - 7 Progressive Steps

## Lesson Overview
**Difficulty**: Beginner | **Time**: 20 minutes | **Track**: Python

Build a receipt generator step by step, learning Python fundamentals through practical coding.

**Concepts You'll Learn**:
- Variables and data types
- For loops and iteration  
- String formatting and alignment
- Mathematical operations
- Function design

---

## Step 1: Calculate Totals
**Goal**: Learn to iterate through data and perform calculations

### What You'll Build
Calculate the subtotal, tax, and total for a list of items.

### Instructions
1. Use a `for` loop to iterate through each item
2. Add each item's price to a running subtotal
3. Calculate 8.5% tax on the subtotal
4. Calculate the final total (subtotal + tax)

### Starter Code
```python
# 🧾 Receipt Generator - Step 1: Calculate Totals
def create_receipt(items):
    """Generate a receipt from a list of items"""
    
    # TODO: Replace the ??? with working code
    
    # Loop through each item and add its price to subtotal
    subtotal = 0
    ??? # Write a for loop: for item in items:
        ??? # Add item["price"] to subtotal
    
    # Calculate 8.5% tax on the subtotal
    tax = ??? # Multiply subtotal by 0.085 and round to 2 decimal places
    
    # Calculate the final total
    total = ??? # Add subtotal + tax and round to 2 decimal places
    
    # Test your calculations
    print(f"Subtotal: ${subtotal:.2f}")
    print(f"Tax: ${tax:.2f}")  
    print(f"Total: ${total:.2f}")
    
    return "Step 1 complete!"

# Test data (should total $9.75 + $0.83 tax = $10.58)
sample_items = [
    {"name": "Coffee", "price": 3.50},
    {"name": "Bagel", "price": 2.25},
    {"name": "Orange Juice", "price": 4.00}
]

receipt = create_receipt(sample_items)
print(receipt)
```

### Solution Code
```python
def create_receipt(items):
    """Generate a receipt from a list of items"""
    
    # Loop through each item and add its price to subtotal
    subtotal = 0
    for item in items:
        subtotal += item["price"]
    
    # Calculate 8.5% tax on the subtotal
    tax = round(subtotal * 0.085, 2)
    
    # Calculate the final total
    total = round(subtotal + tax, 2)
    
    # Test your calculations
    print(f"Subtotal: ${subtotal:.2f}")
    print(f"Tax: ${tax:.2f}")  
    print(f"Total: ${total:.2f}")
    
    return "Step 1 complete!"
```

### Expected Output
```
Subtotal: $9.75
Tax: $0.83
Total: $10.58
Step 1 complete!
```

---

## Step 2: Create Receipt Header
**Goal**: Learn string formatting and text layout

### What You'll Build
Create a professional-looking header with store name and date.

### Instructions
1. Create a header variable starting with a newline
2. Add equal signs for a top border
3. Add centered store name
4. Include current date and time
5. Add a separator line

### Starter Code
```python
# 🧾 Receipt Generator - Step 2: Create Header
from datetime import datetime

def create_receipt(items):
    """Generate a receipt from a list of items"""
    
    # Step 1: Calculate totals (COMPLETED)
    subtotal = 0
    for item in items:
        subtotal += item["price"]
    
    tax = round(subtotal * 0.085, 2)
    total = round(subtotal + tax, 2)
    
    # TODO: Create a professional receipt header
    header = ???  # Start with "\n"
    header += ??? # Add "=" * 35 + "\n" for top border
    header += ??? # Add "    PYTHON CORNER STORE    \n" (centered store name)
    header += ??? # Add "=" * 35 + "\n" for separator
    header += ??? # Add current date: f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    header += ??? # Add "-" * 35 + "\n" for bottom border
    
    print(header)
    print(f"Subtotal: ${subtotal:.2f}")
    print(f"Tax: ${tax:.2f}")
    print(f"Total: ${total:.2f}")
    
    return "Step 2 complete!"

# Test data
sample_items = [
    {"name": "Coffee", "price": 3.50},
    {"name": "Bagel", "price": 2.25},
    {"name": "Orange Juice", "price": 4.00}
]

receipt = create_receipt(sample_items)
print(receipt)
```

### Solution Code
```python
from datetime import datetime

def create_receipt(items):
    """Generate a receipt from a list of items"""
    
    # Step 1: Calculate totals (COMPLETED)
    subtotal = 0
    for item in items:
        subtotal += item["price"]
    
    tax = round(subtotal * 0.085, 2)
    total = round(subtotal + tax, 2)
    
    # Create a professional receipt header
    header = "\n"
    header += "=" * 35 + "\n"
    header += "    PYTHON CORNER STORE    \n"
    header += "=" * 35 + "\n"
    header += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    header += "-" * 35 + "\n"
    
    print(header)
    print(f"Subtotal: ${subtotal:.2f}")
    print(f"Tax: ${tax:.2f}")
    print(f"Total: ${total:.2f}")
    
    return "Step 2 complete!"
```

---

## Step 3: Format Item Lines
**Goal**: Master text alignment and f-string formatting

### What You'll Build
Display each item with proper alignment between names and prices.

### Instructions
1. Create an items section starting with empty string
2. Loop through each item in the list
3. Extract item name and price
4. Use f-string formatting for alignment
5. Left-align names, right-align prices

### Starter Code
```python
# 🧾 Receipt Generator - Step 3: Format Item Lines
from datetime import datetime

def create_receipt(items):
    """Generate a receipt from a list of items"""
    
    # Steps 1-2: Calculate totals and create header (COMPLETED)
    subtotal = 0
    for item in items:
        subtotal += item["price"]
    
    tax = round(subtotal * 0.085, 2)
    total = round(subtotal + tax, 2)
    
    header = "\n"
    header += "=" * 35 + "\n"
    header += "    PYTHON CORNER STORE    \n"
    header += "=" * 35 + "\n"
    header += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    header += "-" * 35 + "\n"
    
    # TODO: Format each item with proper alignment
    items_section = ???  # Start with empty string ""
    ??? # Write a for loop: for item in items:
        name = ??? # Get item["name"]
        price = ??? # Get item["price"]
        items_section += ??? # Add formatted line: f"{name:<25} ${price:>6.2f}\n"
    
    print(header)
    print(items_section)
    print(f"Subtotal: ${subtotal:.2f}")
    print(f"Tax: ${tax:.2f}")
    print(f"Total: ${total:.2f}")
    
    return "Step 3 complete!"

# Test data
sample_items = [
    {"name": "Coffee", "price": 3.50},
    {"name": "Bagel", "price": 2.25},
    {"name": "Orange Juice", "price": 4.00}
]

receipt = create_receipt(sample_items)
print(receipt)
```

### Solution Code
```python
# Format each item with proper alignment
items_section = ""
for item in items:
    name = item["name"]
    price = item["price"]
    items_section += f"{name:<25} ${price:>6.2f}\n"
```

---

## Step 4: Add Totals Section
**Goal**: Create a professional totals display

### Instructions
1. Add separator line before totals
2. Display subtotal with proper alignment
3. Display tax amount with percentage
4. Add emphasis line before total
5. Display final total prominently

### Starter Code
```python
# Previous steps completed...

# TODO: Create formatted totals section
totals = ??? # Start with "-" * 35 + "\n" for separator
totals += ??? # Add f"{'Subtotal:':<25} ${subtotal:>6.2f}\n"
totals += ??? # Add f"{'Tax (8.5%):':<25} ${tax:>6.2f}\n"
totals += ??? # Add "=" * 35 + "\n" for emphasis line
totals += ??? # Add f"{'TOTAL:':<25} ${total:>6.2f}\n"
```

### Solution Code
```python
totals = "-" * 35 + "\n"
totals += f"{'Subtotal:':<25} ${subtotal:>6.2f}\n"
totals += f"{'Tax (8.5%):':<25} ${tax:>6.2f}\n"
totals += "=" * 35 + "\n"
totals += f"{'TOTAL:':<25} ${total:>6.2f}\n"
```

---

## Step 5: Complete Receipt
**Goal**: Combine all sections and add footer

### Instructions
1. Create footer with thank you message
2. Combine header + items + totals + footer
3. Return the complete receipt string

### Starter Code
```python
# TODO: Add footer and combine everything
footer = ??? # Start with "=" * 35 + "\n"
footer += ??? # Add "   Thank you for shopping!   \n"
footer += ??? # Add "    Have a great day! 😊     \n"
footer += ??? # Add "=" * 35 + "\n"

complete_receipt = ??? # Combine: header + items_section + totals + footer
return ??? # Return the complete_receipt string
```

### Solution Code
```python
footer = "=" * 35 + "\n"
footer += "   Thank you for shopping!   \n"
footer += "    Have a great day! 😊     \n"
footer += "=" * 35 + "\n"

complete_receipt = header + items_section + totals + footer
return complete_receipt
```

---

## Step 6: Input Parsing Function
**Goal**: Handle user input strings like "Coffee 3.50"

### Instructions
1. Split input string into parts
2. Extract price (last part) and name (everything else)
3. Join name parts back together
4. Convert price to float

### Starter Code
```python
def parse_item_input(item_string):
    """Parse user input like 'Coffee 3.50' into name and price"""
    
    parts = ??? # Split the input: item_string.strip().split()
    
    if len(parts) < 2:
        return {"name": "Unknown Item", "price": 0.0}
    
    price_str = ??? # Get the last part: parts[-1]
    name_parts = ??? # Get everything except last: parts[:-1]
    name = ??? # Join name parts: " ".join(name_parts)
    
    try:
        price = ??? # Convert to float: float(price_str)
    except ValueError:
        price = 0.0
    
    return ??? # Return dictionary: {"name": name, "price": price}
```

### Solution Code
```python
def parse_item_input(item_string):
    """Parse user input like 'Coffee 3.50' into name and price"""
    
    parts = item_string.strip().split()
    
    if len(parts) < 2:
        return {"name": "Unknown Item", "price": 0.0}
    
    price_str = parts[-1]
    name_parts = parts[:-1]
    name = " ".join(name_parts)
    
    try:
        price = float(price_str)
    except ValueError:
        price = 0.0
    
    return {"name": name, "price": price}
```

---

## Step 7: Price Validation
**Goal**: Add robust input validation

### Instructions
1. Create validation function for prices
2. Handle invalid inputs gracefully
3. Ensure prices are positive
4. Round to 2 decimal places

### Starter Code
```python
def validate_price(price_str):
    """Validate and convert price string to float"""
    
    try:
        price = ??? # Convert to float: float(price_str)
        
        if ??? # Check if price < 0:
            return 0.0
            
        return ??? # Round to 2 decimals: round(price, 2)
        
    except ???: # Catch ValueError:
        return 0.0
```

### Solution Code
```python
def validate_price(price_str):
    """Validate and convert price string to float"""
    
    try:
        price = float(price_str)
        
        if price < 0:
            return 0.0
            
        return round(price, 2)
        
    except ValueError:
        return 0.0
```

### Final Complete Code
```python
from datetime import datetime

def validate_price(price_str):
    """Validate and convert price string to float"""
    try:
        price = float(price_str)
        if price < 0:
            return 0.0
        return round(price, 2)
    except ValueError:
        return 0.0

def parse_item_input(item_string):
    """Parse user input like 'Coffee 3.50' into name and price"""
    parts = item_string.strip().split()
    if len(parts) < 2:
        return {"name": "Unknown Item", "price": 0.0}
    
    price_str = parts[-1]
    name_parts = parts[:-1]
    name = " ".join(name_parts)
    
    price = validate_price(price_str)
    return {"name": name, "price": price}

def create_receipt(items):
    """Generate a formatted text receipt from a list of items"""
    
    # Calculate totals
    subtotal = 0
    for item in items:
        subtotal += item["price"]
    
    tax = round(subtotal * 0.085, 2)
    total = round(subtotal + tax, 2)
    
    # Create header
    header = "\n" + "=" * 35 + "\n"
    header += "    PYTHON CORNER STORE    \n"
    header += "=" * 35 + "\n"
    header += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    header += "-" * 35 + "\n"
    
    # Format items
    items_section = ""
    for item in items:
        name = item["name"]
        price = item["price"]
        items_section += f"{name:<25} ${price:>6.2f}\n"
    
    # Add totals
    totals = "-" * 35 + "\n"
    totals += f"{'Subtotal:':<25} ${subtotal:>6.2f}\n"
    totals += f"{'Tax (8.5%):':<25} ${tax:>6.2f}\n"
    totals += "=" * 35 + "\n"
    totals += f"{'TOTAL:':<25} ${total:>6.2f}\n"
    
    # Add footer
    footer = "=" * 35 + "\n"
    footer += "   Thank you for shopping!   \n"
    footer += "    Have a great day! 😊     \n"
    footer += "=" * 35 + "\n"
    
    return header + items_section + totals + footer

# Test the complete system
test_items = [
    parse_item_input("Coffee 3.50"),
    parse_item_input("Chocolate Chip Cookie 2.75"),
    parse_item_input("Fresh Orange Juice 4.00")
]

print("🧾 Complete Receipt Generator")
print(create_receipt(test_items))
```

---

## Lesson Complete! 🎉

**What You Built**: A complete receipt generator with input parsing and validation

**Skills Mastered**:
- ✅ Loops and iteration
- ✅ String formatting and alignment  
- ✅ Mathematical operations
- ✅ Input validation and error handling
- ✅ Function design and documentation
- ✅ Text layout and professional formatting

**Next Steps**: Try building a tip calculator, inventory tracker, or simple point-of-sale system! 