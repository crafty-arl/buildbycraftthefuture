import { Course } from '../types/builderTypes'

export const courses: Course[] = [
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    description: 'Learn Python basics with automatic validation and instant feedback',
    category: 'beginner',
    difficulty: 'easy',
    estimatedTime: '30 minutes',
    prerequisites: [],
    rewards: {
      xp: 300,
      achievement: 'python_basics_master',
      tool: {
        name: 'python_calculator',
        description: 'Interactive Python calculator with variables and functions',
        code: `# Python Calculator Tool
# Built through Python Fundamentals course

class PythonCalculator:
    def __init__(self):
        self.history = []
        self.variables = {}
    
    def calculate(self, expression):
        try:
            result = eval(expression, {"__builtins__": {}}, self.variables)
            self.history.append(f"{expression} = {result}")
            return result
        except Exception as e:
            return f"Error: {e}"
    
    def set_variable(self, name, value):
        self.variables[name] = value
        return f"Set {name} = {value}"
    
    def show_history(self):
        return "\\n".join(self.history) if self.history else "No calculations yet"

# Example usage
calc = PythonCalculator()
print(calc.calculate("2 + 3"))
print(calc.set_variable("x", 10))
print(calc.calculate("x * 2"))
print(calc.show_history())`
      }
    },
    lessons: [
      {
        id: 'hello-world',
        title: 'Hello World - Your First Program',
        type: 'practice',
        content: `Welcome to Python! Let's start with the classic "Hello, World!" program.

The \`print()\` function displays text on the screen. It's one of the most basic and important functions in Python.

Your task: Create a program that prints "Hello, World!" to the screen.`,
        codeTemplate: `# Your first Python program
# Use the print() function to display "Hello, World!"

`,
        expectedOutcomes: {
          output: 'Hello, World!',
          containsKeywords: ['print'],
          hasNoErrors: true,
          testCases: [
            {
              description: 'Prints "Hello, World!" exactly',
              expectedOutput: 'Hello, World!',
              points: 50
            }
          ]
        },
        rewards: {
          xp: 100,
          bonusXP: 25,
          partialCredit: true
        },
        hints: [
          'Use the print() function',
          'Put your text in quotes: "Hello, World!"',
          'Make sure the capitalization matches exactly'
        ],
        isCompleted: false
      },
      {
        id: 'variables-basics',
        title: 'Variables - Storing Information',
        type: 'practice',
        content: `Variables are like labeled boxes that store information. You can put data in them and use that data later.

To create a variable, use the format: \`variable_name = value\`

Your task: Create a variable called \`name\` with your name, and another called \`age\` with your age. Then print both using f-strings.`,
                 codeTemplate: `# Create variables and print them
# Create a variable called 'name' with your name
name = "Your Name Here"

# Create a variable called 'age' with your age
age = 25

# Print a message with your information
print("Hello! My name is", name, "and I am", age, "years old.")
`,
                 expectedOutcomes: {
           containsKeywords: ['name', 'age', 'print'],
           hasNoErrors: true,
           testCases: [
             {
               description: 'Creates a name variable',
               expectedOutput: /name\s*=\s*["'].*["']/,
               points: 25
             },
             {
               description: 'Creates an age variable', 
               expectedOutput: /age\s*=\s*\d+/,
               points: 25
             },
             {
               description: 'Uses print statement',
               expectedOutput: /print\s*\(/,
               points: 25
             },
             {
               description: 'Shows personal information',
               expectedOutput: /Hello.*name.*age/,
               points: 25
             }
           ]
         },
        rewards: {
          xp: 150,
          bonusXP: 50,
          partialCredit: true
        },
        hints: [
          'Use quotes for text values: name = "John"',
          'Numbers don\'t need quotes: age = 25',
          'F-strings start with f" and use {variable} for values',
          'Example: f"Hello {name}!"'
        ],
        isCompleted: false
      },
      {
        id: 'basic-math',
        title: 'Math Operations',
        type: 'practice',
        content: `Python can perform mathematical calculations using operators:
- Addition: +
- Subtraction: -
- Multiplication: *
- Division: /

Your task: Create a simple calculator that adds two numbers and shows the result.`,
        codeTemplate: `# Simple calculator
# Create two variables with numbers
# Add them together and print the result

`,
        expectedOutcomes: {
          containsKeywords: ['print', '+'],
          hasNoErrors: true,
          testCases: [
            {
              description: 'Creates two number variables',
              expectedOutput: /.*=.*\d+.*\n.*=.*\d+/,
              points: 30
            },
            {
              description: 'Adds the numbers together',
              expectedOutput: /.*\+.*/,
              points: 35
            },
            {
              description: 'Shows the result',
              expectedOutput: /\d+/,
              points: 35
            }
          ]
        },
        rewards: {
          xp: 120,
          bonusXP: 30,
          partialCredit: true
        },
        hints: [
          'Create two variables: num1 = 10, num2 = 5',
          'Add them: result = num1 + num2',
          'Print the result: print(result)'
        ],
        isCompleted: false
      },
      {
        id: 'user-input',
        title: 'Getting User Input',
        type: 'challenge',
        content: `The \`input()\` function lets you get text from the user. It always returns a string, so you might need to convert it to a number using \`int()\` or \`float()\`.

Your challenge: Create a program that asks for the user's name and age, then prints a personalized message.`,
        codeTemplate: `# Interactive program
# Ask for user's name and age
# Print a personalized message

`,
        expectedOutcomes: {
          containsKeywords: ['input', 'print'],
          hasNoErrors: true,
          testCases: [
            {
              description: 'Asks for user name',
              expectedOutput: /input.*[Nn]ame/,
              points: 25
            },
            {
              description: 'Asks for user age',
              expectedOutput: /input.*[Aa]ge/,
              points: 25
            },
            {
              description: 'Prints personalized message',
              expectedOutput: /print.*f["'].*\{.*\}.*["']/,
              points: 50
            }
          ]
        },
        rewards: {
          xp: 200,
          bonusXP: 75,
          partialCredit: true
        },
        hints: [
          'Use input("What is your name? ") to get user input',
          'Convert age to number: age = int(input("How old are you? "))',
          'Use f-strings for the message: f"Hello {name}, you are {age} years old!"'
        ],
        isCompleted: false
      }
    ],
    isUnlocked: true,
    isCompleted: false,
    progress: 0
  },
  {
    id: 'receipt-generator-basics',
    title: 'Receipt Generator Mastery',
    description: 'Learn to build a stylized receipt generator from scratch. Master string formatting, input parsing, and math operations for real-world applications.',
    category: 'data-science',
    difficulty: 'medium',
    estimatedTime: '45 minutes',
    prerequisites: ['python_basics_master'], // Requires completing Python Fundamentals
    rewards: {
      xp: 500,
      achievement: 'data_wizard',
      tool: {
        name: 'receipt_generator_pro',
        description: 'Advanced receipt generator with multiple formatting and calculation features',
        code: `import datetime
from typing import List, Dict, Any, Optional

class ReceiptGeneratorPro:
    """
    Professional Receipt Generator Tool
    Built through the Receipt Generator Mastery course
    """
    
    def __init__(self, file_path: str):
        """Initialize with CSV file path"""
        self.file_path = file_path
        self.df = None
        self.original_shape = None
        self.cleaning_log = []
    
    def load_data(self) -> pd.DataFrame:
        """Load CSV data with error handling"""
        try:
            self.df = pd.read_csv(self.file_path)
            self.original_shape = self.df.shape
            self.log_action(f"Loaded data: {self.original_shape[0]} rows, {self.original_shape[1]} columns")
            return self.df
        except Exception as e:
            print(f"Error loading CSV: {e}")
            return None
    
    def remove_duplicates(self, subset: Optional[List[str]] = None) -> 'CSVCleanerPro':
        """Remove duplicate rows"""
        if self.df is None:
            print("No data loaded!")
            return self
        
        initial_rows = len(self.df)
        self.df = self.df.drop_duplicates(subset=subset)
        removed = initial_rows - len(self.df)
        self.log_action(f"Removed {removed} duplicate rows")
        return self
    
    def handle_missing_data(self, strategy: str = 'drop', fill_value: Any = None) -> 'CSVCleanerPro':
        """Handle missing data with different strategies"""
        if self.df is None:
            print("No data loaded!")
            return self
        
        missing_before = self.df.isnull().sum().sum()
        
        if strategy == 'drop':
            self.df = self.df.dropna()
        elif strategy == 'fill' and fill_value is not None:
            self.df = self.df.fillna(fill_value)
        elif strategy == 'forward_fill':
            self.df = self.df.fillna(method='ffill')
        elif strategy == 'backward_fill':
            self.df = self.df.fillna(method='bfill')
        elif strategy == 'mean':
            numeric_cols = self.df.select_dtypes(include=[np.number]).columns
            self.df[numeric_cols] = self.df[numeric_cols].fillna(self.df[numeric_cols].mean())
        
        missing_after = self.df.isnull().sum().sum()
        self.log_action(f"Handled missing data: {missing_before} → {missing_after} missing values")
        return self
    
    def clean_text_columns(self, columns: List[str]) -> 'CSVCleanerPro':
        """Clean text data in specified columns"""
        if self.df is None:
            print("No data loaded!")
            return self
        
        for col in columns:
            if col in self.df.columns:
                # Remove extra whitespace, convert to lowercase
                self.df[col] = self.df[col].astype(str).str.strip().str.lower()
                # Remove special characters (optional)
                self.df[col] = self.df[col].str.replace(r'[^a-zA-Z0-9\\s]', '', regex=True)
        
        self.log_action(f"Cleaned text columns: {', '.join(columns)}")
        return self
    
    def convert_data_types(self, type_mapping: Dict[str, str]) -> 'CSVCleanerPro':
        """Convert column data types"""
        if self.df is None:
            print("No data loaded!")
            return self
        
        for col, dtype in type_mapping.items():
            if col in self.df.columns:
                try:
                    if dtype == 'datetime':
                        self.df[col] = pd.to_datetime(self.df[col])
                    else:
                        self.df[col] = self.df[col].astype(dtype)
                    self.log_action(f"Converted {col} to {dtype}")
                except Exception as e:
                    self.log_action(f"Failed to convert {col} to {dtype}: {e}")
        
        return self
    
    def remove_outliers(self, column: str, method: str = 'iqr', threshold: float = 1.5) -> 'CSVCleanerPro':
        """Remove outliers from numeric columns"""
        if self.df is None or column not in self.df.columns:
            print("No data loaded or column not found!")
            return self
        
        initial_rows = len(self.df)
        
        if method == 'iqr':
            Q1 = self.df[column].quantile(0.25)
            Q3 = self.df[column].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - threshold * IQR
            upper = Q3 + threshold * IQR
            self.df = self.df[(self.df[column] >= lower) & (self.df[column] <= upper)]
        
        elif method == 'zscore':
            z_scores = np.abs((self.df[column] - self.df[column].mean()) / self.df[column].std())
            self.df = self.df[z_scores < threshold]
        
        removed = initial_rows - len(self.df)
        self.log_action(f"Removed {removed} outliers from {column}")
        return self
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate cleaning summary report"""
        if self.df is None:
            return {"error": "No data loaded"}
        
        return {
            "original_shape": self.original_shape,
            "final_shape": self.df.shape,
            "rows_processed": self.original_shape[0] - self.df.shape[0] if self.original_shape else 0,
            "data_types": self.df.dtypes.to_dict(),
            "missing_values": self.df.isnull().sum().to_dict(),
            "cleaning_log": self.cleaning_log,
            "memory_usage": f"{self.df.memory_usage(deep=True).sum() / 1024**2:.2f} MB"
        }
    
    def save_cleaned_data(self, output_path: str) -> str:
        """Save cleaned data to new CSV file"""
        if self.df is None:
            return "No data to save!"
        
        try:
            self.df.to_csv(output_path, index=False)
            self.log_action(f"Saved cleaned data to {output_path}")
            return f"Successfully saved {len(self.df)} rows to {output_path}"
        except Exception as e:
            return f"Error saving file: {e}"
    
    def log_action(self, action: str):
        """Log cleaning actions"""
        self.cleaning_log.append(f"{pd.Timestamp.now().strftime('%H:%M:%S')} - {action}")

# Example usage function
def demo_csv_cleaner():
    """Demonstrate the CSV Cleaner Pro in action"""
    print("🧹 CSV Cleaner Pro - Demo Mode")
    print("=" * 50)
    
    # Create sample messy data
    import io
    sample_data = '''Name,Age,Salary,Department,Join_Date
John Doe,25,50000.0,Engineering,2023-01-15
Jane Smith,,55000.0,Marketing,2023-02-20
Bob Johnson,30,60000.0,Engineering,2023-01-10
Alice Brown,28,52000.0,,2023-03-05
John Doe,25,50000.0,Engineering,2023-01-15
Charlie Wilson,35,,Sales,2023-04-12
Diana Lee,29,58000.0,Marketing,2023-02-28'''
    
    # Save sample data
    with open('sample_messy_data.csv', 'w') as f:
        f.write(sample_data)
    
    # Use the cleaner
    cleaner = CSVCleanerPro('sample_messy_data.csv')
    
    # Load and clean data
    cleaner.load_data()
    print("\\nOriginal data loaded!")
    print(f"Shape: {cleaner.df.shape}")
    print(f"Missing values: {cleaner.df.isnull().sum().sum()}")
    
    # Perform cleaning operations
    cleaner.remove_duplicates()
    cleaner.handle_missing_data(strategy='drop')
    cleaner.clean_text_columns(['Name', 'Department'])
    cleaner.convert_data_types({
        'Age': 'int64',
        'Join_Date': 'datetime'
    })
    
    # Generate summary
    summary = cleaner.generate_summary()
    print("\\n📊 Cleaning Summary:")
    print(f"Original shape: {summary['original_shape']}")
    print(f"Final shape: {summary['final_shape']}")
    print(f"Rows removed: {summary['rows_processed']}")
    
    print("\\n📝 Cleaning Log:")
    for log_entry in summary['cleaning_log']:
        print(f"  {log_entry}")
    
    # Save cleaned data
    result = cleaner.save_cleaned_data('cleaned_data.csv')
    print(f"\\n💾 {result}")
    
    print("\\n🎉 CSV Cleaning Complete! Your tool is ready to use.")
    return cleaner

def demo_receipt_generator():
    """Demonstrate the Receipt Generator Pro in action"""
    print("🧾 Receipt Generator Pro - Demo Mode")
    print("=" * 50)
    
    # Create generator instance
    generator = ReceiptGeneratorPro("Joe's Corner Store")
    
    # Sample transaction
    sample_items = [
        {"name": "Coffee", "price": 3.50},
        {"name": "Bagel", "price": 2.25},
        {"name": "Orange Juice", "price": 4.00}
    ]
    
    # Generate receipt
    receipt = generator.create_receipt(sample_items, "John Doe")
    print("\\nSample Receipt:")
    print(receipt)
    
    print("\\n🎉 Receipt Generator Demo Complete!")
    return generator

if __name__ == "__main__":
    demo_receipt_generator()
`
      }
    },
    lessons: [
      {
        id: 'lesson-1-intro',
        title: 'Introduction to Data Cleaning',
        type: 'theory',
        content: `# Welcome to CSV Cleaner Mastery! 🧹

Data cleaning is one of the most important skills for any programmer working with real-world data. In this course, you'll build a professional-grade CSV cleaning tool from scratch.

## What You'll Learn:
- **Pandas fundamentals** for data manipulation
- **Handling missing data** with different strategies
- **Removing duplicates** and outliers
- **Data type conversions** and validation
- **Building reusable tools** for your portfolio

## Why This Matters:
Real-world data is messy! Whether you're analyzing sales data, processing user information, or preparing datasets for machine learning, data cleaning is always the first step.

## Course Structure:
1. **Theory lessons** - Learn the concepts
2. **Practice exercises** - Code along with examples  
3. **Challenges** - Test your skills

## Your Reward:
Complete this course to unlock the **CSV Cleaner Pro** tool - a powerful, reusable script you can use in any project!

Ready to become a data cleaning expert? Let's get started! 🚀`,
        isCompleted: false
      },
      {
        id: 'lesson-2-pandas-basics',
        title: 'Pandas Essentials for Data Cleaning',
        type: 'practice',
        content: `# Pandas Essentials 🐼

Pandas is Python's most powerful data manipulation library. Let's master the essentials for data cleaning.

## Key Pandas Concepts:

### 1. Loading Data
\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
\`\`\`

### 2. Exploring Data Structure
\`\`\`python
df.shape          # (rows, columns)
df.info()         # column info & data types
df.head()         # first 5 rows
df.describe()     # statistical summary
\`\`\`

### 3. Handling Missing Data
\`\`\`python
df.isnull().sum()           # count missing values
df.dropna()                 # remove rows with missing data
df.fillna(value)           # fill missing values
\`\`\`

## Practice Time! 💻

Create a simple data explorer that shows the structure of any CSV file.`,
        codeTemplate: `import pandas as pd

def explore_csv(file_path):
    """
    Explore the structure of a CSV file
    Complete this function to analyze any CSV!
    """
    # Step 1: Load the CSV file
    df = # Your code here
    
    # Step 2: Print basic information
    print(f"Dataset Shape: {df.shape}")
    print(f"\\nColumn Names: {list(df.columns)}")
    
    # Step 3: Check for missing data
    missing_data = # Your code here
    print(f"\\nMissing Values:\\n{missing_data}")
    
    # Step 4: Show data types
    print(f"\\nData Types:\\n{df.dtypes}")
    
    # Step 5: Display first few rows
    print(f"\\nFirst 5 rows:\\n{df.head()}")
    
    return df

# Test with sample data
# explore_csv('your_file.csv')
print("Complete the function above to explore CSV files!")`,
        expectedOutput: "Dataset exploration completed with shape, missing values, and data types displayed",
        hints: [
          "Use pd.read_csv() to load the file",
          "Use df.isnull().sum() to count missing values",
          "The df.dtypes attribute shows column data types"
        ],
        isCompleted: false
      },
      {
        id: 'lesson-3-missing-data',
        title: 'Mastering Missing Data',
        type: 'practice',
        content: `# Handling Missing Data Like a Pro 🎯

Missing data is everywhere in real datasets. Let's learn multiple strategies to handle it effectively.

## Missing Data Strategies:

### 1. **Drop Strategy**
- Remove rows/columns with missing values
- Good when: Small amount of missing data
- Risk: Losing valuable information

### 2. **Fill Strategy**
- Replace missing values with:
  - **Fixed value**: 0, "Unknown", etc.
  - **Mean/Median**: For numeric data
  - **Mode**: For categorical data
  - **Forward/Backward fill**: Use adjacent values

### 3. **Smart Filling**
- Different strategies for different columns
- Business logic-based decisions

## Your Challenge 🚀

Build a flexible missing data handler!`,
        codeTemplate: `import pandas as pd
import numpy as np

def handle_missing_data(df, strategy_map):
    """
    Handle missing data using different strategies for different columns
    
    strategy_map example:
    {
        'column1': 'drop',
        'column2': ('fill', 0),
        'column3': ('fill', 'mean'),
        'column4': ('fill', 'forward')
    }
    """
    df_cleaned = df.copy()
    
    for column, strategy in strategy_map.items():
        if column not in df_cleaned.columns:
            continue
            
        if strategy == 'drop':
            # Remove rows where this column has missing values
            df_cleaned = # Your code here
            
        elif isinstance(strategy, tuple) and strategy[0] == 'fill':
            fill_method = strategy[1]
            
            if fill_method == 'mean':
                # Fill with mean (for numeric columns)
                fill_value = # Your code here
                df_cleaned[column] = df_cleaned[column].fillna(fill_value)
                
            elif fill_method == 'median':
                # Fill with median
                fill_value = # Your code here
                df_cleaned[column] = df_cleaned[column].fillna(fill_value)
                
            elif fill_method == 'forward':
                # Forward fill (use previous value)
                df_cleaned[column] = # Your code here
                
            else:
                # Fill with specific value
                df_cleaned[column] = df_cleaned[column].fillna(fill_method)
    
    return df_cleaned

# Test your function
sample_data = {
    'Name': ['Alice', 'Bob', None, 'Diana'],
    'Age': [25, None, 30, 28],
    'Salary': [50000, 55000, None, 52000],
    'Department': ['IT', 'HR', 'IT', None]
}

df_test = pd.DataFrame(sample_data)
print("Original data:")
print(df_test)
print("\\nMissing values:")
print(df_test.isnull().sum())

# Define your strategy
strategy = {
    'Name': 'drop',
    'Age': ('fill', 'mean'),
    'Salary': ('fill', 'median'),
    'Department': ('fill', 'Unknown')
}

# Apply your function
df_clean = handle_missing_data(df_test, strategy)
print("\\nCleaned data:")
print(df_clean)`,
        expectedOutput: "Successfully handled missing data using different strategies per column",
        hints: [
          "Use df.dropna(subset=[column]) to drop rows with missing values in specific column",
          "Use df[column].mean() to calculate mean for numeric columns",
          "Use df[column].fillna(method='ffill') for forward fill"
        ],
        isCompleted: false
      },
      {
        id: 'lesson-4-duplicates-outliers',
        title: 'Removing Duplicates and Outliers',
        type: 'practice',
        content: `# Cleaning Duplicates and Outliers 🎯

Clean data means removing unwanted duplicates and extreme outliers that could skew your analysis.

## Duplicate Removal:
- **Exact duplicates**: Identical rows
- **Partial duplicates**: Same values in specific columns
- **Business logic**: Define what makes a "duplicate"

## Outlier Detection:
- **IQR Method**: Interquartile Range (most common)
- **Z-Score Method**: Standard deviations from mean
- **Domain knowledge**: Business-specific rules

## The Math Behind IQR:
\`\`\`
Q1 = 25th percentile
Q3 = 75th percentile  
IQR = Q3 - Q1
Lower bound = Q1 - 1.5 * IQR
Upper bound = Q3 + 1.5 * IQR
\`\`\`

Build a comprehensive cleaner! 🚀`,
        codeTemplate: `import pandas as pd
import numpy as np

def remove_duplicates_and_outliers(df, duplicate_subset=None, outlier_columns=None):
    """
    Remove duplicates and outliers from a dataset
    
    Parameters:
    - duplicate_subset: list of columns to check for duplicates (None = all columns)
    - outlier_columns: list of numeric columns to check for outliers
    """
    df_clean = df.copy()
    
    # Step 1: Remove duplicates
    initial_rows = len(df_clean)
    df_clean = # Your code here (use drop_duplicates)
    duplicates_removed = initial_rows - len(df_clean)
    print(f"Removed {duplicates_removed} duplicate rows")
    
    # Step 2: Remove outliers using IQR method
    if outlier_columns:
        for column in outlier_columns:
            if column in df_clean.columns and df_clean[column].dtype in ['int64', 'float64']:
                
                # Calculate Q1, Q3, and IQR
                Q1 = # Your code here
                Q3 = # Your code here
                IQR = # Your code here
                
                # Define outlier bounds
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                # Count outliers before removal
                outliers_count = len(df_clean[(df_clean[column] < lower_bound) | (df_clean[column] > upper_bound)])
                
                # Remove outliers
                df_clean = df_clean[(df_clean[column] >= lower_bound) & (df_clean[column] <= upper_bound)]
                
                print(f"Removed {outliers_count} outliers from {column}")
    
    return df_clean

# Test data with duplicates and outliers
test_data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Alice', 'Diana', 'Eve'],
    'Age': [25, 30, 28, 25, 150, 27],  # 150 is an outlier
    'Salary': [50000, 55000, 52000, 50000, 51000, 1000000],  # 1M is an outlier
    'Department': ['IT', 'HR', 'IT', 'IT', 'Sales', 'IT']
}

df_test = pd.DataFrame(test_data)
print("Original data:")
print(df_test)
print(f"Shape: {df_test.shape}")

# Clean the data
df_clean = remove_duplicates_and_outliers(
    df_test, 
    duplicate_subset=['Name', 'Age', 'Department'],  # Check these columns for duplicates
    outlier_columns=['Age', 'Salary']  # Check these columns for outliers
)

print("\\nCleaned data:")
print(df_clean)
print(f"Final shape: {df_clean.shape}")`,
        expectedOutput: "Successfully removed duplicates and outliers with count reporting",
        hints: [
          "Use df.drop_duplicates(subset=duplicate_subset) to remove duplicates",
          "Use df[column].quantile(0.25) for Q1 and quantile(0.75) for Q3",
          "Filter data with boolean indexing: df[(condition1) & (condition2)]"
        ],
        isCompleted: false
      },
      {
        id: 'lesson-5-final-challenge',
        title: 'Build Your CSV Cleaner Pro',
        type: 'challenge',
        content: `# Final Challenge: CSV Cleaner Pro 🏆

Time to put it all together! Build a complete CSV cleaning tool that you can use in real projects.

## Your Mission:
Create a \`CSVCleanerPro\` class that can:
1. **Load any CSV file** with error handling
2. **Remove duplicates** with flexible column selection
3. **Handle missing data** with multiple strategies
4. **Clean text data** (strip whitespace, normalize case)
5. **Convert data types** safely
6. **Remove outliers** using IQR method
7. **Generate cleaning reports** 
8. **Save cleaned data** to new files

## Success Criteria:
- ✅ Class-based design for reusability
- ✅ Method chaining support (return self)
- ✅ Comprehensive error handling
- ✅ Detailed logging of all operations
- ✅ Professional code documentation

## Bonus Features:
- Memory usage reporting
- Progress tracking for large files
- Multiple output formats (CSV, Excel, JSON)

Ready to build your professional tool? 🚀`,
        codeTemplate: `import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional

class CSVCleanerPro:
    """
    Professional CSV Cleaning Tool
    Your final project for the CSV Cleaner Mastery course!
    """
    
    def __init__(self, file_path: str):
        """Initialize the cleaner with a CSV file path"""
        self.file_path = file_path
        self.df = None
        self.original_shape = None
        self.cleaning_log = []
    
    def load_data(self) -> pd.DataFrame:
        """Load CSV data with error handling"""
        try:
            # Your code here: Load the CSV file
            # Store original shape for reporting
            # Log the loading action
            pass
        except Exception as e:
            print(f"Error loading CSV: {e}")
            return None
    
    def remove_duplicates(self, subset: Optional[List[str]] = None) -> 'CSVCleanerPro':
        """Remove duplicate rows"""
        # Your code here:
        # - Check if data is loaded
        # - Count initial rows
        # - Remove duplicates
        # - Log the action
        # - Return self for method chaining
        return self
    
    def handle_missing_data(self, strategy: str = 'drop', fill_value: Any = None) -> 'CSVCleanerPro':
        """Handle missing data with different strategies"""
        # Your code here:
        # - Support strategies: 'drop', 'fill', 'forward_fill', 'backward_fill', 'mean'
        # - Count missing values before and after
        # - Log the action
        return self
    
    def clean_text_columns(self, columns: List[str]) -> 'CSVCleanerPro':
        """Clean text data in specified columns"""
        # Your code here:
        # - Strip whitespace
        # - Convert to lowercase
        # - Optional: Remove special characters
        # - Log the action
        return self
    
    def convert_data_types(self, type_mapping: Dict[str, str]) -> 'CSVCleanerPro':
        """Convert column data types"""
        # Your code here:
        # - Support common types: int, float, datetime, string
        # - Handle conversion errors gracefully
        # - Log successful and failed conversions
        return self
    
    def remove_outliers(self, column: str, method: str = 'iqr', threshold: float = 1.5) -> 'CSVCleanerPro':
        """Remove outliers from numeric columns"""
        # Your code here:
        # - Implement IQR method
        # - Optional: Z-score method
        # - Count and log removed outliers
        return self
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate comprehensive cleaning summary"""
        # Your code here:
        # - Original vs final shape
        # - Data types summary
        # - Missing values count
        # - Complete cleaning log
        # - Memory usage info
        pass
    
    def save_cleaned_data(self, output_path: str) -> str:
        """Save cleaned data to new CSV file"""
        # Your code here:
        # - Save to CSV with error handling
        # - Return success/error message
        # - Log the save action
        pass
    
    def log_action(self, action: str):
        """Log cleaning actions with timestamps"""
        # Your code here:
        # - Add timestamp
        # - Append to cleaning_log
        pass

# Test your CSV Cleaner Pro
def test_csv_cleaner():
    """Test the CSV Cleaner Pro with sample data"""
    
    # Create sample messy data
    sample_data = '''Name,Age,Salary,Department,Join_Date
John Doe,25,50000.0,Engineering,2023-01-15
Jane Smith,,55000.0,Marketing,2023-02-20
Bob Johnson,30,60000.0,Engineering,2023-01-10
Alice Brown,28,52000.0,,2023-03-05
John Doe,25,50000.0,Engineering,2023-01-15
Charlie Wilson,35,,Sales,2023-04-12
Diana Lee,29,58000.0,Marketing,2023-02-28
Outlier Person,999,9999999.0,Sales,2023-05-01'''
    
    # Save sample data
    with open('sample_data.csv', 'w') as f:
        f.write(sample_data)
    
    print("🧹 Testing CSV Cleaner Pro")
    print("=" * 40)
    
    # Initialize and test your cleaner
    cleaner = CSVCleanerPro('sample_data.csv')
    
    # Chain multiple cleaning operations
    cleaner.load_data()\\
           .remove_duplicates()\\
           .handle_missing_data(strategy='drop')\\
           .clean_text_columns(['Name', 'Department'])\\
           .convert_data_types({'Age': 'int64', 'Join_Date': 'datetime'})\\
           .remove_outliers('Age')\\
           .remove_outliers('Salary')
    
    # Generate and display summary
    summary = cleaner.generate_summary()
    print("\\n📊 Cleaning Summary:")
    for key, value in summary.items():
        print(f"{key}: {value}")
    
    # Save cleaned data
    result = cleaner.save_cleaned_data('cleaned_sample.csv')
    print(f"\\n💾 {result}")
    
    print("\\n🎉 Congratulations! Your CSV Cleaner Pro is ready!")
    return cleaner

# Run the test
if __name__ == "__main__":
    test_csv_cleaner()`,
        expectedOutput: "Complete CSV Cleaner Pro class with all methods implemented and successful test run",
        hints: [
          "Remember to check if self.df is None before operations",
          "Use method chaining by returning 'self' from each method",
          "Use pd.Timestamp.now() for logging timestamps",
          "Handle exceptions in each method to make it robust"
        ],
        isCompleted: false
      }
    ],
    isUnlocked: false,
    isCompleted: false,
    progress: 0
  }
]

// Helper function to check if course should be unlocked
export function updateCourseUnlockStatus(courses: Course[], unlockedAchievements: string[]): Course[] {
  return courses.map(course => ({
    ...course,
    isUnlocked: course.prerequisites.every(prereq => 
      unlockedAchievements.includes(prereq) || prereq === 'hello_builder'
    )
  }))
}

// Helper function to calculate course progress
export function calculateCourseProgress(course: Course): number {
  if (course.lessons.length === 0) return 0
  const completedLessons = course.lessons.filter(lesson => lesson.isCompleted).length
  return Math.round((completedLessons / course.lessons.length) * 100)
} 