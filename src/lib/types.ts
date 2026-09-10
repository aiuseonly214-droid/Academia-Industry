export type UserRole = 'student' | 'company' | 'college';

export interface Profile {
  id: string;
  phone: string | null;
  email: string | null;
  full_name: string;
  role: UserRole;
  organization: string | null;
  is_demo: boolean;
  created_at: string;
  last_login: string | null;
}

export interface Skill {
  id: string;
  profile_id: string;
  skill_name: string;
  current_level: number;
  target_level: number;
  verified: boolean;
  verified_score: number | null;
  verified_date: string | null;
  verified_through: string | null;
  color: string;
}

export interface RoadmapStep {
  id: string;
  profile_id: string;
  skill_name: string;
  step_index: number;
  day_range: string;
  title: string;
  meta: string;
  step_type: 'Learn' | 'Practice' | 'Project' | 'Assessment';
  done: boolean;
  resources: string[];
  practical_env: string | null;
}

export interface Task {
  id: string;
  profile_id: string;
  roadmap_id: string | null;
  title: string;
  estimated_time: string;
  due_date: string;
  category: 'today' | 'upcoming' | 'completed';
  task_type: 'learn' | 'practice' | 'project' | 'assessment';
  skill_name: string | null;
  completed: boolean;
  completed_at: string | null;
}

export interface AssessmentRecord {
  id: string;
  profile_id: string;
  skill_name: string;
  score: number;
  total_questions: number;
  pass_mark: number;
  passed: boolean;
  attempted_at: string;
}

export interface ProjectRecord {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  skill_name: string | null;
  environment: string | null;
  status: 'in_progress' | 'submitted' | 'graded';
  score: number | null;
  submitted_at: string | null;
}

export interface Internship {
  id: string;
  profile_id: string | null;
  company_name: string;
  title: string;
  location: string;
  duration: string;
  status: 'Active' | 'Draft' | 'Closed';
  required_skills: { name: string; level: number }[];
  applicants_count: number;
  posted_text: string;
}

export interface Application {
  id: string;
  internship_id: string;
  student_profile_id: string;
  student_name: string;
  match_score: number;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  applied_at: string;
}

export interface AuthSession {
  profile: Profile;
  otpSent: boolean;
  demoOtp: string | null;
}
