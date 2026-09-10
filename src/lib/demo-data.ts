import type { Skill, RoadmapStep, Task, Internship, AssessmentRecord, ProjectRecord } from './types';

export const DEMO_STUDENT_PHONE = '+91 98765 43210';
export const DEMO_COMPANY_PHONE = '+91 98765 11111';
export const DEMO_COLLEGE_PHONE = '+91 98765 22222';
export const DEMO_OTP = '123456';

export const demoSkills: Omit<Skill, 'id' | 'profile_id'>[] = [
  { skill_name: 'Python', current_level: 100, target_level: 100, verified: true, verified_score: 9, verified_date: '2026-08-15', verified_through: 'Python Assessment', color: '#17a673' },
  { skill_name: 'SQL', current_level: 90, target_level: 100, verified: true, verified_score: 9, verified_date: '2026-08-20', verified_through: 'SQL Assessment', color: '#17a673' },
  { skill_name: 'Power BI', current_level: 40, target_level: 80, verified: false, verified_score: null, verified_date: null, verified_through: null, color: '#f0ad2e' },
  { skill_name: 'React', current_level: 70, target_level: 60, verified: false, verified_score: null, verified_date: null, verified_through: null, color: '#4385df' },
  { skill_name: 'Communication', current_level: 60, target_level: 60, verified: false, verified_score: null, verified_date: null, verified_through: null, color: '#4385df' },
];

export const demoRoadmap: Omit<RoadmapStep, 'id' | 'profile_id'>[] = [
  { skill_name: 'Power BI', step_index: 0, day_range: '01–02', title: 'Power BI Basics', meta: '4 hours · 4 lessons', step_type: 'Learn', done: true, resources: ['Power BI Intro Video (22 min)', 'Power BI Interface Guide (PDF)'], practical_env: null },
  { skill_name: 'Power BI', step_index: 1, day_range: '03–05', title: 'Power Query', meta: '6 hours · 3 lessons', step_type: 'Practice', done: true, resources: ['Power Query Tutorial (35 min)', 'Data Transformation Notes'], practical_env: null },
  { skill_name: 'Power BI', step_index: 2, day_range: '06–08', title: 'Data Modelling', meta: '6 hours · 5 lessons', step_type: 'Learn', done: false, resources: ['Data Modelling Video (40 min)', 'Star Schema Guide'], practical_env: null },
  { skill_name: 'Power BI', step_index: 3, day_range: '09–11', title: 'DAX Fundamentals', meta: '6 hours · 4 lessons', step_type: 'Practice', done: false, resources: ['DAX Basics Tutorial (30 min)', 'DAX Functions Reference'], practical_env: null },
  { skill_name: 'Power BI', step_index: 4, day_range: '12–13', title: 'Dashboard Build', meta: '4 hours · 2 lessons', step_type: 'Project', done: false, resources: ['Dashboard Design Guide', 'Sample Dataset'], practical_env: null },
  { skill_name: 'Power BI', step_index: 5, day_range: '14', title: 'Power BI Assessment', meta: '30 minutes · 10 questions', step_type: 'Assessment', done: false, resources: [], practical_env: null },
];

export const demoTasks: Omit<Task, 'id' | 'profile_id' | 'roadmap_id'>[] = [
  { title: 'Complete Data Modelling lesson', estimated_time: '2 hours', due_date: 'Today', category: 'today', task_type: 'learn', skill_name: 'Power BI', completed: false, completed_at: null },
  { title: 'Watch Star Schema Guide video', estimated_time: '45 minutes', due_date: 'Today', category: 'today', task_type: 'learn', skill_name: 'Power BI', completed: false, completed_at: null },
  { title: 'Practice SQL JOIN queries', estimated_time: '1 hour', due_date: 'Today', category: 'today', task_type: 'practice', skill_name: 'SQL', completed: false, completed_at: null },
  { title: 'Complete DAX Fundamentals lesson', estimated_time: '2 hours', due_date: 'Tomorrow', category: 'upcoming', task_type: 'learn', skill_name: 'Power BI', completed: false, completed_at: null },
  { title: 'Build sample Power BI dashboard', estimated_time: '3 hours', due_date: 'Wednesday', category: 'upcoming', task_type: 'project', skill_name: 'Power BI', completed: false, completed_at: null },
  { title: 'Take Power BI Assessment', estimated_time: '30 minutes', due_date: 'Friday', category: 'upcoming', task_type: 'assessment', skill_name: 'Power BI', completed: false, completed_at: null },
  { title: 'Complete Power BI Basics', estimated_time: '4 hours', due_date: 'Completed', category: 'completed', task_type: 'learn', skill_name: 'Power BI', completed: true, completed_at: '2026-09-05T10:00:00Z' },
  { title: 'Complete Power Query exercises', estimated_time: '6 hours', due_date: 'Completed', category: 'completed', task_type: 'practice', skill_name: 'Power BI', completed: true, completed_at: '2026-09-08T14:00:00Z' },
];

export const demoInternships: Omit<Internship, 'id' | 'profile_id'>[] = [
  { company_name: 'Nova Analytics', title: 'Data Analyst Intern', location: 'Hybrid', duration: '3 months', status: 'Active', required_skills: [{ name: 'SQL', level: 80 }, { name: 'Python', level: 60 }, { name: 'Power BI', level: 70 }], applicants_count: 24, posted_text: '3 days ago' },
  { company_name: 'Atlas Systems', title: 'Business Analyst Intern', location: 'Remote', duration: '6 months', status: 'Active', required_skills: [{ name: 'SQL', level: 70 }, { name: 'Power BI', level: 60 }, { name: 'Communication', level: 50 }], applicants_count: 18, posted_text: '5 days ago' },
  { company_name: 'TechVista', title: 'Frontend Developer Intern', location: 'On-site', duration: '4 months', status: 'Active', required_skills: [{ name: 'React', level: 60 }, { name: 'Python', level: 40 }], applicants_count: 31, posted_text: '1 week ago' },
];

export const demoAssessments: Omit<AssessmentRecord, 'id' | 'profile_id'>[] = [
  { skill_name: 'Python', score: 9, total_questions: 10, pass_mark: 7, passed: true, attempted_at: '2026-08-15T10:30:00Z' },
  { skill_name: 'SQL', score: 9, total_questions: 10, pass_mark: 7, passed: true, attempted_at: '2026-08-20T11:00:00Z' },
];

export const demoProjects: Omit<ProjectRecord, 'id' | 'profile_id'>[] = [
  { title: 'Employee Salary Analysis', description: 'Python script to analyze and visualize employee salary data using pandas', skill_name: 'Python', environment: 'python', status: 'graded', score: 95, submitted_at: '2026-08-14T15:00:00Z' },
  { title: 'SQL Employee Database Queries', description: 'Complex SQL queries on employee database including JOINs and aggregations', skill_name: 'SQL', environment: 'sql', status: 'graded', score: 90, submitted_at: '2026-08-19T16:00:00Z' },
];

export interface PracticalTask {
  id: string;
  title: string;
  level: 'Basic' | 'Intermediate';
  description: string;
  hint: string;
  starterCode: string;
  expectedOutput: string;
  solution: string;
}

export interface PracticalEnvironment {
  key: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  tasks: PracticalTask[];
  tables?: { name: string; columns: string[] }[];
}

export const PRACTICAL_ENVIRONMENTS: PracticalEnvironment[] = [
  {
    key: 'python',
    label: 'Python',
    icon: '🐍',
    description: 'Write and run real Python code in an isolated Docker container',
    color: '#17a673',
    bgColor: '#e1f5e9',
    tasks: [
      {
        id: 'py-1',
        title: 'Hello World & Variables',
        level: 'Basic',
        description: 'Create variables for a student\'s name, age, and course. Print a sentence combining them.',
        hint: 'Use print() with f-strings: print(f"{name} is {age} years old and studies {course}")',
        starterCode: `# Create variables
name = "Pratik"
age = 21
course = "Data Analytics"

# Print a sentence using an f-string
# TODO: Write your print statement here

`,
        expectedOutput: 'Pratik is 21 years old and studies Data Analytics',
        solution: `name = "Pratik"
age = 21
course = "Data Analytics"
print(f"{name} is {age} years old and studies {course}")`,
      },
      {
        id: 'py-2',
        title: 'List Operations',
        level: 'Basic',
        description: 'Given a list of exam scores, find the highest score, the lowest score, and the average. Print all three.',
        hint: 'Use max(), min(), and sum() / len() to compute the average.',
        starterCode: `scores = [78, 92, 65, 88, 95, 72, 84]

# TODO: Find the highest score
# TODO: Find the lowest score
# TODO: Calculate the average

# Print all three
# print(f"Highest: {highest}")
# print(f"Lowest: {lowest}")
# print(f"Average: {average}")

`,
        expectedOutput: 'Highest: 95\nLowest: 65\nAverage: 82.0',
        solution: `scores = [78, 92, 65, 88, 95, 72, 84]
highest = max(scores)
lowest = min(scores)
average = sum(scores) / len(scores)
print(f"Highest: {highest}")
print(f"Lowest: {lowest}")
print(f"Average: {average}")`,
      },
      {
        id: 'py-3',
        title: 'Dictionary Basics',
        level: 'Basic',
        description: 'Create a dictionary for a product with name, price, and quantity. Calculate the total value (price × quantity) and print it.',
        hint: 'Access dictionary values with product["price"] and product["quantity"].',
        starterCode: `product = {
    "name": "Laptop",
    "price": 55000,
    "quantity": 3
}

# TODO: Calculate total value = price * quantity
# total_value = ...

# print(f"Total value of {product['name']}s: Rs.{total_value}")

`,
        expectedOutput: 'Total value of Laptops: Rs.165000',
        solution: `product = {
    "name": "Laptop",
    "price": 55000,
    "quantity": 3
}
total_value = product["price"] * product["quantity"]
print(f"Total value of {product['name']}s: Rs.{total_value}")`,
      },
      {
        id: 'py-4',
        title: 'If-Else Conditions',
        level: 'Basic',
        description: 'Write a function that takes a score (0–100) and returns a grade: A (≥90), B (≥80), C (≥70), D (≥60), or F (<60). Test it with scores 95, 72, and 55.',
        hint: 'Use if/elif/else with comparison operators like >=',
        starterCode: `def get_grade(score):
    # TODO: Write if/elif/else logic here
    pass

# Test with different scores
print(get_grade(95))
print(get_grade(72))
print(get_grade(55))

`,
        expectedOutput: 'A\nC\nF',
        solution: `def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

print(get_grade(95))
print(get_grade(72))
print(get_grade(55))`,
      },
      {
        id: 'py-5',
        title: 'Loops & Summation',
        level: 'Basic',
        description: 'Use a for loop to calculate the sum of all even numbers from 1 to 20 (inclusive). Print the result.',
        hint: 'Use range(2, 21, 2) to get even numbers, or use an if condition with the modulo operator %.',
        starterCode: `# TODO: Use a for loop to sum all even numbers from 1 to 20
# total = 0
# for i in range(...):
#     total += i

# print(f"Sum of even numbers 1-20: {total}")

`,
        expectedOutput: 'Sum of even numbers 1-20: 110',
        solution: `total = 0
for i in range(2, 21, 2):
    total += i
print(f"Sum of even numbers 1-20: {total}")`,
      },
      {
        id: 'py-6',
        title: 'Functions with Parameters',
        level: 'Intermediate',
        description: 'Write a function `calculate_bmi(weight, height)` that computes BMI (weight / height²) and returns the BMI rounded to 1 decimal. Test with weight=70, height=1.75.',
        hint: 'BMI = weight / (height ** 2). Use round(bmi, 1) to round.',
        starterCode: `def calculate_bmi(weight, height):
    # TODO: Calculate BMI = weight / (height squared)
    # Round to 1 decimal place
    pass

bmi = calculate_bmi(70, 1.75)
print(f"BMI: {bmi}")

`,
        expectedOutput: 'BMI: 22.9',
        solution: `def calculate_bmi(weight, height):
    bmi = weight / (height ** 2)
    return round(bmi, 1)

bmi = calculate_bmi(70, 1.75)
print(f"BMI: {bmi}")`,
      },
      {
        id: 'py-7',
        title: 'String Manipulation',
        level: 'Intermediate',
        description: 'Write a function that takes a full name string and returns a username: first 3 letters of first name + last 2 letters of last name, all lowercase. Example: "Pratik Lohar" → "praar".',
        hint: 'Use .split() to separate first and last name, then slice with [:3] and [-2:]. Use .lower().',
        starterCode: `def create_username(full_name):
    # TODO: Split the name, take first 3 of first name + last 2 of last name
    # Convert to lowercase
    pass

print(create_username("Pratik Lohar"))
print(create_username("Aisha Khan"))

`,
        expectedOutput: 'praar\naishan',
        solution: `def create_username(full_name):
    parts = full_name.split()
    first = parts[0][:3]
    last = parts[-1][-2:]
    return (first + last).lower()

print(create_username("Pratik Lohar"))
print(create_username("Aisha Khan"))`,
      },
      {
        id: 'py-8',
        title: 'List Comprehension & Filtering',
        level: 'Intermediate',
        description: 'Given a list of numbers, use a list comprehension to create a new list containing only the numbers greater than 50, squared. Print the result.',
        hint: 'Syntax: [x**2 for x in numbers if x > 50]',
        starterCode: `numbers = [12, 55, 30, 78, 90, 45, 62, 18]

# TODO: Use a list comprehension to filter and square
# result = [...]

print(result)

`,
        expectedOutput: '[3025, 6084, 8100, 3844]',
        solution: `numbers = [12, 55, 30, 78, 90, 45, 62, 18]
result = [x**2 for x in numbers if x > 50]
print(result)`,
      },
      {
        id: 'py-9',
        title: 'Salary Analysis with Functions',
        level: 'Intermediate',
        description: 'Write a function that takes a list of employee salaries and returns a dictionary with the average, median, and top 3 highest salaries.',
        hint: 'Use statistics.mean(), statistics.median(), and sorted(salaries, reverse=True)[:3].',
        starterCode: `import statistics

def analyze_salaries(salaries):
    # TODO: Return a dict with "average", "median", and "top3"
    pass

salaries = [45000, 62000, 38000, 71000, 55000, 89000, 43000]
result = analyze_salaries(salaries)
print(f"Average: {result['average']}")
print(f"Median: {result['median']}")
print(f"Top 3: {result['top3']}")

`,
        expectedOutput: 'Average: 57571.42857142857\nMedian: 55000\nTop 3: [89000, 71000, 62000]',
        solution: `import statistics

def analyze_salaries(salaries):
    avg = statistics.mean(salaries)
    med = statistics.median(salaries)
    top3 = sorted(salaries, reverse=True)[:3]
    return {"average": avg, "median": med, "top3": top3}

salaries = [45000, 62000, 38000, 71000, 55000, 89000, 43000]
result = analyze_salaries(salaries)
print(f"Average: {result['average']}")
print(f"Median: {result['median']}")
print(f"Top 3: {result['top3']}")`,
      },
      {
        id: 'py-10',
        title: 'Data Class with Methods',
        level: 'Intermediate',
        description: 'Create a BankAccount class with deposit and withdraw methods. Start with balance=1000. Deposit 500, withdraw 300, then print the final balance.',
        hint: 'Define __init__(self, balance), then deposit(self, amount) adds to balance and withdraw(self, amount) subtracts.',
        starterCode: `class BankAccount:
    def __init__(self, balance):
        # TODO: Store the balance
        pass

    def deposit(self, amount):
        # TODO: Add amount to balance
        pass

    def withdraw(self, amount):
        # TODO: Subtract amount from balance
        pass

account = BankAccount(1000)
account.deposit(500)
account.withdraw(300)
print(f"Final balance: Rs.{account.balance}")

`,
        expectedOutput: 'Final balance: Rs.1200',
        solution: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        self.balance -= amount

account = BankAccount(1000)
account.deposit(500)
account.withdraw(300)
print(f"Final balance: Rs.{account.balance}")`,
      },
    ],
  },
  {
    key: 'sql',
    label: 'SQL / PostgreSQL',
    icon: '🗄️',
    description: 'Practice real SQL queries against a live sample database',
    color: '#3b82c4',
    bgColor: '#e5effc',
    tables: [
      { name: 'departments', columns: ['id', 'department_name', 'location'] },
      { name: 'employees', columns: ['id', 'employee_name', 'department_id', 'hire_date'] },
      { name: 'salaries', columns: ['id', 'employee_id', 'amount', 'from_date'] },
      { name: 'projects', columns: ['id', 'project_name', 'department_id', 'budget'] },
    ],
    tasks: [
      {
        id: 'sql-1',
        title: 'SELECT All Columns',
        level: 'Basic',
        description: 'Retrieve all columns and all rows from the employees table.',
        hint: 'SELECT * FROM employees;',
        starterCode: `-- Write a query to get all employees
SELECT

`,
        expectedOutput: '',
        solution: 'SELECT * FROM employees;',
      },
      {
        id: 'sql-2',
        title: 'SELECT Specific Columns',
        level: 'Basic',
        description: 'Retrieve only the employee_name and hire_date columns from the employees table.',
        hint: 'SELECT column1, column2 FROM table_name;',
        starterCode: `-- Get only names and hire dates
SELECT

`,
        expectedOutput: '',
        solution: 'SELECT employee_name, hire_date FROM employees;',
      },
      {
        id: 'sql-3',
        title: 'Filtering with WHERE',
        level: 'Basic',
        description: 'Find all employees who were hired after January 1, 2023. Show their name and hire date.',
        hint: 'Use WHERE hire_date > \'2023-01-01\'',
        starterCode: `-- Find employees hired after 2023-01-01
SELECT
FROM
WHERE

`,
        expectedOutput: '',
        solution: `SELECT employee_name, hire_date
FROM employees
WHERE hire_date > '2023-01-01';`,
      },
      {
        id: 'sql-4',
        title: 'Sorting with ORDER BY',
        level: 'Basic',
        description: 'Retrieve all employees sorted by their hire date in descending order (newest first). Show name and hire_date.',
        hint: 'Use ORDER BY column DESC',
        starterCode: `-- Sort employees by hire date, newest first
SELECT
FROM
ORDER BY

`,
        expectedOutput: '',
        solution: `SELECT employee_name, hire_date
FROM employees
ORDER BY hire_date DESC;`,
      },
      {
        id: 'sql-5',
        title: 'LIMIT Results',
        level: 'Basic',
        description: 'Find the 3 most recently hired employees. Show their names and hire dates.',
        hint: 'Combine ORDER BY hire_date DESC with LIMIT 3',
        starterCode: `-- Get the 3 newest employees
SELECT
FROM
ORDER BY
LIMIT

`,
        expectedOutput: '',
        solution: `SELECT employee_name, hire_date
FROM employees
ORDER BY hire_date DESC
LIMIT 3;`,
      },
      {
        id: 'sql-6',
        title: 'Aggregation with COUNT',
        level: 'Basic',
        description: 'Count the total number of employees in the company.',
        hint: 'Use COUNT(*) with an alias: SELECT COUNT(*) AS total_employees',
        starterCode: `-- Count all employees
SELECT
FROM

`,
        expectedOutput: '',
        solution: 'SELECT COUNT(*) AS total_employees FROM employees;',
      },
      {
        id: 'sql-7',
        title: 'JOIN Two Tables',
        level: 'Intermediate',
        description: 'Join the employees and departments tables. Show each employee\'s name along with their department name.',
        hint: 'Use JOIN ON employees.department_id = departments.id',
        starterCode: `-- Show employee names with their department names
SELECT
FROM employees e
JOIN

`,
        expectedOutput: '',
        solution: `SELECT e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;`,
      },
      {
        id: 'sql-8',
        title: 'JOIN with Aggregation',
        level: 'Intermediate',
        description: 'Find the average salary for each department. Show department name and average salary (rounded). Use the employees, salaries, and departments tables.',
        hint: 'JOIN all three tables, then GROUP BY department name and use AVG(s.amount).',
        starterCode: `-- Average salary per department
SELECT
FROM
JOIN
JOIN
GROUP BY

`,
        expectedOutput: '',
        solution: `SELECT d.department_name, ROUND(AVG(s.amount)) AS avg_salary
FROM employees e
JOIN salaries s ON e.id = s.employee_id
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name;`,
      },
      {
        id: 'sql-9',
        title: 'Top N with JOIN',
        level: 'Intermediate',
        description: 'Find the top 3 highest-paid employees. Show their names and salary amounts.',
        hint: 'JOIN employees with salaries, ORDER BY amount DESC, LIMIT 3',
        starterCode: `-- Top 3 highest-paid employees
SELECT
FROM
JOIN
ORDER BY
LIMIT

`,
        expectedOutput: '',
        solution: `SELECT e.employee_name, s.amount AS salary
FROM employees e
JOIN salaries s ON e.id = s.employee_id
ORDER BY s.amount DESC
LIMIT 3;`,
      },
      {
        id: 'sql-10',
        title: 'GROUP BY & HAVING',
        level: 'Intermediate',
        description: 'Find departments that have more than 1 employee. Show department name and the employee count.',
        hint: 'GROUP BY department, then use HAVING COUNT(*) > 1',
        starterCode: `-- Departments with more than 1 employee
SELECT
FROM
JOIN
GROUP BY
HAVING

`,
        expectedOutput: '',
        solution: `SELECT d.department_name, COUNT(*) AS employee_count
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
HAVING COUNT(*) > 1;`,
      },
    ],
  },
];

export const ASSESSMENT_QUESTIONS: Record<string, { question: string; options: string[]; correct: number }[]> = {
  'Power BI': [
    { question: 'What is the primary purpose of Power BI?', options: ['Data visualization', 'Word processing', 'Video editing', 'Accounting'], correct: 0 },
    { question: 'Which tool is used for data transformation in Power BI?', options: ['Power Query', 'Power Point', 'Power Shell', 'Power Plant'], correct: 0 },
    { question: 'What does DAX stand for?', options: ['Data Analysis Expressions', 'Digital Analysis XML', 'Data Access Extension', 'Dynamic Axis'], correct: 0 },
    { question: 'Which view allows you to build visualizations?', options: ['Report view', 'Data view', 'Model view', 'Table view'], correct: 0 },
    { question: 'What is a star schema?', options: ['A schema with a central fact table and surrounding dimension tables', 'A schema shaped like a star constellation', 'A schema for astronomical data', 'A schema with no relationships'], correct: 0 },
    { question: 'Which connector type retrieves data from a web page?', options: ['Web connector', 'File connector', 'Database connector', 'Azure connector'], correct: 0 },
    { question: 'What is the purpose of a calculated column?', options: ['To compute values row by row', 'To delete rows', 'To import data', 'To export reports'], correct: 0 },
    { question: 'Which function returns the current date in DAX?', options: ['TODAY()', 'NOW()', 'CURRENT()', 'DATE()'], correct: 0 },
    { question: 'What does a measure do in Power BI?', options: ['Performs calculations on aggregated data', 'Measures screen size', 'Measures data size in bytes', 'Measures query performance'], correct: 0 },
    { question: 'Which feature allows sharing reports with others?', options: ['Power BI Service', 'Power BI Desktop only', 'Export to PDF', 'Screenshot'], correct: 0 },
  ],
  'Python': [
    { question: 'What is the correct way to create a variable in Python?', options: ['x = 5', 'var x = 5', 'int x = 5', 'variable x = 5'], correct: 0 },
    { question: 'Which method adds an element to the end of a list?', options: ['append()', 'add()', 'insert()', 'push()'], correct: 0 },
    { question: 'What does len() return?', options: ['The length of an object', 'The last element', 'A line number', 'The logarithm'], correct: 0 },
    { question: 'Which library is commonly used for data analysis?', options: ['pandas', 'numpy', 'matplotlib', 'All of the above'], correct: 3 },
    { question: 'What does the range(5) function return?', options: ['0,1,2,3,4', '1,2,3,4,5', '0,1,2,3,4,5', '5'], correct: 0 },
    { question: 'How do you define a function in Python?', options: ['def function_name():', 'function function_name()', 'func function_name()', 'define function_name()'], correct: 0 },
    { question: 'What is a dictionary in Python?', options: ['A key-value pair collection', 'A list of words', 'A text file', 'A type of string'], correct: 0 },
    { question: 'Which statement is used for conditional execution?', options: ['if', 'when', 'case', 'switch'], correct: 0 },
    { question: 'What does CSV stand for?', options: ['Comma-Separated Values', 'Computer System Variable', 'Code Syntax Validator', 'Common Standard View'], correct: 0 },
    { question: 'Which method is used to read a CSV file in pandas?', options: ['read_csv()', 'load_csv()', 'open_csv()', 'import_csv()'], correct: 0 },
  ],
  'SQL': [
    { question: 'Which keyword is used to retrieve data?', options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'], correct: 0 },
    { question: 'Which clause filters rows?', options: ['WHERE', 'FILTER', 'IF', 'MATCH'], correct: 0 },
    { question: 'What does JOIN do?', options: ['Combines rows from two tables', 'Joins text strings', 'Connects to a server', 'Merges databases'], correct: 0 },
    { question: 'Which keyword sorts results?', options: ['ORDER BY', 'SORT BY', 'ARRANGE BY', 'GROUP BY'], correct: 0 },
    { question: 'What does COUNT() return?', options: ['The number of rows', 'A count of columns', 'The total value', 'The average'], correct: 0 },
    { question: 'Which JOIN returns only matching rows?', options: ['INNER JOIN', 'OUTER JOIN', 'LEFT JOIN', 'CROSS JOIN'], correct: 0 },
    { question: 'What does GROUP BY do?', options: ['Groups rows with same values', 'Groups tables together', 'Groups databases', 'Groups columns by type'], correct: 0 },
    { question: 'Which keyword limits results?', options: ['LIMIT', 'MAX', 'TOP', 'RESTRICT'], correct: 0 },
    { question: 'What is a primary key?', options: ['A unique identifier for each row', 'The first key on a keyboard', 'A password', 'The main index'], correct: 0 },
    { question: 'Which function returns the highest value?', options: ['MAX()', 'HIGH()', 'TOP()', 'PEAK()'], correct: 0 },
  ],
  'React': [
    { question: 'What is JSX?', options: ['A syntax extension for JavaScript', 'A new programming language', 'A database query language', 'A CSS framework'], correct: 0 },
    { question: 'What does useState return?', options: ['A state value and a setter function', 'Only a state value', 'Only a setter function', 'A component'], correct: 0 },
    { question: 'How do you pass data to a child component?', options: ['Via props', 'Via imports', 'Via globals', 'Via state only'], correct: 0 },
    { question: 'What is a component in React?', options: ['A reusable UI piece', 'A CSS class', 'A HTML tag', 'A JavaScript module'], correct: 0 },
    { question: 'Which hook manages side effects?', options: ['useEffect', 'useSide', 'useAction', 'useEffectHook'], correct: 0 },
    { question: 'What does Virtual DOM do?', options: ['Efficiently updates the real DOM', 'Creates virtual reality', 'Manages browser memory', 'Stores virtual data'], correct: 0 },
    { question: 'How do you create a functional component?', options: ['function MyComponent() { return <div/> }', 'class MyComponent extends React', 'component MyComponent()', 'new React.Component()'], correct: 0 },
    { question: 'What is the purpose of keys in lists?', options: ['To help React identify items', 'To encrypt data', 'To sort elements', 'To style items'], correct: 0 },
    { question: 'Which method handles form submission?', options: ['onSubmit', 'onSend', 'onSubmitForm', 'onFormSubmit'], correct: 0 },
    { question: 'What does npm stand for?', options: ['Node Package Manager', 'New Programming Method', 'Network Protocol Module', 'Next Project Manager'], correct: 0 },
  ],
};
