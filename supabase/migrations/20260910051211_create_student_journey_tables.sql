/*
# Create student journey tables

1. New Tables
- `student_skills` — skill levels, targets, verification status per student
- `student_roadmap` — learning roadmap steps generated from skill gaps
- `student_tasks` — auto-generated tasks from roadmap steps
- `student_assessments` — assessment attempts and scores
- `student_projects` — practical project submissions
- `internships` — posted internship positions
- `applications` — student applications to internships

2. Security
- All tables allow anon+authenticated CRUD (demo mode, custom OTP auth)
- No user_id FK to auth.users — we use a `profile_id` text field linked to profiles.id

3. Important Notes
- All student journey tables reference profile_id (UUID from profiles table)
- Tasks are generated from roadmap steps
- Assessment pass → skill.verified = true
- Internship match is calculated from student_skills data
*/

-- Student skills: tracks current level, target, verification
CREATE TABLE IF NOT EXISTS student_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  current_level int NOT NULL DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 100),
  target_level int NOT NULL DEFAULT 80 CHECK (target_level >= 0 AND target_level <= 100),
  verified boolean NOT NULL DEFAULT false,
  verified_score int,
  verified_date timestamptz,
  verified_through text,
  color text DEFAULT '#17a673',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_student_skills" ON student_skills;
CREATE POLICY "anon_select_student_skills" ON student_skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_skills" ON student_skills;
CREATE POLICY "anon_insert_student_skills" ON student_skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_student_skills" ON student_skills;
CREATE POLICY "anon_update_student_skills" ON student_skills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_student_skills" ON student_skills;
CREATE POLICY "anon_delete_student_skills" ON student_skills FOR DELETE TO anon, authenticated USING (true);

-- Student roadmap: learning steps generated from skill gaps
CREATE TABLE IF NOT EXISTS student_roadmap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  step_index int NOT NULL,
  day_range text NOT NULL,
  title text NOT NULL,
  meta text NOT NULL,
  step_type text NOT NULL DEFAULT 'Learn' CHECK (step_type IN ('Learn', 'Practice', 'Project', 'Assessment')),
  done boolean NOT NULL DEFAULT false,
  resources text[] DEFAULT '{}',
  practical_env text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_roadmap ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_student_roadmap" ON student_roadmap;
CREATE POLICY "anon_select_student_roadmap" ON student_roadmap FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_roadmap" ON student_roadmap;
CREATE POLICY "anon_insert_student_roadmap" ON student_roadmap FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_student_roadmap" ON student_roadmap;
CREATE POLICY "anon_update_student_roadmap" ON student_roadmap FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_student_roadmap" ON student_roadmap;
CREATE POLICY "anon_delete_student_roadmap" ON student_roadmap FOR DELETE TO anon, authenticated USING (true);

-- Student tasks: auto-generated from roadmap
CREATE TABLE IF NOT EXISTS student_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  roadmap_id uuid REFERENCES student_roadmap(id) ON DELETE CASCADE,
  title text NOT NULL,
  estimated_time text NOT NULL,
  due_date text NOT NULL,
  category text NOT NULL DEFAULT 'today' CHECK (category IN ('today', 'upcoming', 'completed')),
  task_type text NOT NULL DEFAULT 'learn' CHECK (task_type IN ('learn', 'practice', 'project', 'assessment')),
  skill_name text,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_student_tasks" ON student_tasks;
CREATE POLICY "anon_select_student_tasks" ON student_tasks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_tasks" ON student_tasks;
CREATE POLICY "anon_insert_student_tasks" ON student_tasks FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_student_tasks" ON student_tasks;
CREATE POLICY "anon_update_student_tasks" ON student_tasks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_student_tasks" ON student_tasks;
CREATE POLICY "anon_delete_student_tasks" ON student_tasks FOR DELETE TO anon, authenticated USING (true);

-- Student assessments: quiz attempts
CREATE TABLE IF NOT EXISTS student_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  score int NOT NULL,
  total_questions int NOT NULL DEFAULT 10,
  pass_mark int NOT NULL DEFAULT 7,
  passed boolean NOT NULL DEFAULT false,
  attempted_at timestamptz DEFAULT now()
);

ALTER TABLE student_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_student_assessments" ON student_assessments;
CREATE POLICY "anon_select_student_assessments" ON student_assessments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_assessments" ON student_assessments;
CREATE POLICY "anon_insert_student_assessments" ON student_assessments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_student_assessments" ON student_assessments;
CREATE POLICY "anon_update_student_assessments" ON student_assessments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_student_assessments" ON student_assessments;
CREATE POLICY "anon_delete_student_assessments" ON student_assessments FOR DELETE TO anon, authenticated USING (true);

-- Student projects: practical submissions
CREATE TABLE IF NOT EXISTS student_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  skill_name text,
  environment text,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  score int,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_student_projects" ON student_projects;
CREATE POLICY "anon_select_student_projects" ON student_projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_projects" ON student_projects;
CREATE POLICY "anon_insert_student_projects" ON student_projects FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_student_projects" ON student_projects;
CREATE POLICY "anon_update_student_projects" ON student_projects FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_student_projects" ON student_projects;
CREATE POLICY "anon_delete_student_projects" ON student_projects FOR DELETE TO anon, authenticated USING (true);

-- Internships: posted positions
CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  title text NOT NULL,
  location text DEFAULT 'Hybrid',
  duration text DEFAULT '3 months',
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Closed')),
  required_skills jsonb NOT NULL DEFAULT '[]',
  applicants_count int NOT NULL DEFAULT 0,
  posted_text text DEFAULT 'Recently',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_internships" ON internships;
CREATE POLICY "anon_select_internships" ON internships FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_internships" ON internships;
CREATE POLICY "anon_insert_internships" ON internships FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_internships" ON internships;
CREATE POLICY "anon_update_internships" ON internships FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_internships" ON internships;
CREATE POLICY "anon_delete_internships" ON internships FOR DELETE TO anon, authenticated USING (true);

-- Applications: student applies to internships
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  match_score int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired')),
  applied_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_applications" ON applications;
CREATE POLICY "anon_select_applications" ON applications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_applications" ON applications;
CREATE POLICY "anon_update_applications" ON applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_applications" ON applications;
CREATE POLICY "anon_delete_applications" ON applications FOR DELETE TO anon, authenticated USING (true);