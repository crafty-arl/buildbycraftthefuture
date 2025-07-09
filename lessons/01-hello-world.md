# Hello World - Your First Python Program

## What You'll Learn
- How to display text with print()
- Basic Python syntax rules
- Running your first program
- Understanding strings in Python

## Explanation

Welcome to Python! Python is one of the most popular programming languages because it's easy to read and write. Let's start with the classic "Hello World" program.

The `print()` function is Python's way of displaying text on the screen. Whatever you put inside the parentheses will be shown to the user.

## Example Code

```python
print("Hello, World!")
```

When you run this code, Python will display: `Hello, World!`

The quotes tell Python that this is text (called a "string"). You can use either single quotes `'` or double quotes `"`.

## Try It Yourself

```python
# Change this message to say hello to yourself
print("Hello, World!")
```

**Challenge**: Modify the code above to print your own name instead of "World".

## Solution

```python
print("Hello, Aaron!")  # Replace with your actual name
```

## Working with Variables

Variables let you store text and reuse it. This makes your code more flexible:

```python
name = "Python Learner"
print("Hello, " + name + "!")
print(f"Welcome to Python, {name}!")
```

The second line uses something called an "f-string" - it's a modern way to insert variables into text.

## Practice Exercise

```python
# Create a variable with your favorite color
# Then print a message using that variable

favorite_color = "blue"
print(f"My favorite color is {favorite_color}!")
```

## Key Takeaways

- `print()` displays text on the screen
- Strings go inside quotes: `"like this"` or `'like this'`
- Variables store values: `name = "value"`
- F-strings make it easy to use variables: `f"Hello {name}!"`

## Next Steps

Great job! You've written your first Python program. Next, we'll learn more about variables and different types of data Python can work with.

---

**Estimated time**: 5 minutes | **Difficulty**: Beginner 