CREATE TABLE departments (
  id integer PRIMARY KEY,
  department_name text NOT NULL,
  location text NOT NULL
);

CREATE TABLE employees (
  id integer PRIMARY KEY,
  employee_name text NOT NULL,
  department_id integer NOT NULL REFERENCES departments(id),
  hire_date date NOT NULL
);

CREATE TABLE salaries (
  id integer PRIMARY KEY,
  employee_id integer NOT NULL REFERENCES employees(id),
  amount integer NOT NULL,
  from_date date NOT NULL
);

CREATE TABLE projects (
  id integer PRIMARY KEY,
  project_name text NOT NULL,
  department_id integer NOT NULL REFERENCES departments(id),
  budget integer NOT NULL
);

INSERT INTO departments VALUES
  (1, 'Analytics', 'Pune'),
  (2, 'Engineering', 'Bengaluru'),
  (3, 'Operations', 'Mumbai');

INSERT INTO employees VALUES
  (1, 'Alice Chen', 1, '2022-01-10'),
  (2, 'Bob Patel', 2, '2021-06-15'),
  (3, 'Carol White', 1, '2023-02-20'),
  (4, 'Dave Kumar', 3, '2020-09-01'),
  (5, 'Eve Sharma', 2, '2024-01-08'),
  (6, 'Farah Ali', 1, '2024-04-18');

INSERT INTO salaries VALUES
  (1, 1, 92000, '2025-01-01'),
  (2, 2, 89000, '2025-01-01'),
  (3, 3, 71000, '2025-01-01'),
  (4, 4, 67000, '2025-01-01'),
  (5, 5, 62000, '2025-01-01'),
  (6, 6, 58000, '2025-01-01');

INSERT INTO projects VALUES
  (1, 'Insight Dashboard', 1, 125000),
  (2, 'Hiring Platform', 2, 240000),
  (3, 'Ops Forecast', 3, 90000);
