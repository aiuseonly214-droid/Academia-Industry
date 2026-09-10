import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';
import type { Skill, RoadmapStep, Task, AssessmentRecord, ProjectRecord, Internship, Application } from './types';

interface StudentData {
  skills: Skill[];
  roadmap: RoadmapStep[];
  tasks: Task[];
  assessments: AssessmentRecord[];
  projects: ProjectRecord[];
  internships: Internship[];
  applications: Application[];
  loading: boolean;
  refresh: () => Promise<void>;
  updateSkill: (skill: Skill) => Promise<void>;
  toggleTask: (taskId: string, completed: boolean) => Promise<void>;
  completeRoadmapStep: (stepId: string) => Promise<void>;
  addAssessment: (record: Omit<AssessmentRecord, 'id' | 'profile_id'>) => Promise<AssessmentRecord | null>;
  addProject: (record: Omit<ProjectRecord, 'id' | 'profile_id'>) => Promise<void>;
  submitProject: (record: Omit<ProjectRecord, 'id' | 'profile_id'>) => Promise<void>;
  applyToInternship: (internshipId: string, matchScore: number) => Promise<void>;
}

const StudentDataContext = createContext<StudentData | null>(null);

export function StudentDataProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const [skillsRes, roadmapRes, tasksRes, assessmentsRes, projectsRes, internshipsRes, applicationsRes] = await Promise.all([
        supabase.from('student_skills').select('*').eq('profile_id', profile.id),
        supabase.from('student_roadmap').select('*').eq('profile_id', profile.id).order('step_index'),
        supabase.from('student_tasks').select('*').eq('profile_id', profile.id),
        supabase.from('student_assessments').select('*').eq('profile_id', profile.id).order('attempted_at', { ascending: false }),
        supabase.from('student_projects').select('*').eq('profile_id', profile.id),
        supabase.from('internships').select('*').eq('status', 'Active'),
        supabase.from('applications').select('*').eq('student_profile_id', profile.id),
      ]);

      setSkills((skillsRes.data as Skill[]) || []);
      setRoadmap((roadmapRes.data as RoadmapStep[]) || []);
      setTasks((tasksRes.data as Task[]) || []);
      setAssessments((assessmentsRes.data as AssessmentRecord[]) || []);
      setProjects((projectsRes.data as ProjectRecord[]) || []);
      setInternships((internshipsRes.data as Internship[]) || []);
      setApplications((applicationsRes.data as Application[]) || []);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.role === 'student') {
      refresh();
    }
  }, [profile, refresh]);

  const updateSkill = useCallback(async (skill: Skill) => {
    const { error } = await supabase
      .from('student_skills')
      .update({
        current_level: skill.current_level,
        verified: skill.verified,
        verified_score: skill.verified_score,
        verified_date: skill.verified_date,
        verified_through: skill.verified_through,
        updated_at: new Date().toISOString(),
      })
      .eq('id', skill.id);
    if (error) throw error;
    await refresh();
  }, [refresh]);

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const { error } = await supabase
      .from('student_tasks')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        category: completed ? 'completed' : task.due_date === 'Today' ? 'today' : 'upcoming',
      })
      .eq('id', taskId);
    if (error) throw error;
    await refresh();
  }, [tasks, refresh]);

  const completeRoadmapStep = useCallback(async (stepId: string) => {
    const step = roadmap.find((r) => r.id === stepId);
    if (!step) return;
    const { error } = await supabase
      .from('student_roadmap')
      .update({ done: true })
      .eq('id', stepId);
    if (error) throw error;

    const nextStep = roadmap.find((r) => !r.done && r.id !== stepId);
    if (nextStep && !nextStep.done) {
      const { error: taskErr } = await supabase.from('student_tasks').insert({
        profile_id: profile!.id,
        roadmap_id: nextStep.id,
        title: `Complete ${nextStep.title}`,
        estimated_time: nextStep.meta.split(' · ')[0],
        due_date: 'Today',
        category: 'today',
        task_type: nextStep.step_type.toLowerCase() as 'learn' | 'practice' | 'project' | 'assessment',
        skill_name: nextStep.skill_name,
        completed: false,
      });
      if (taskErr) console.error('Failed to create next task:', taskErr);
    }

    await refresh();
  }, [roadmap, profile, refresh]);

  const addAssessment = useCallback(async (record: Omit<AssessmentRecord, 'id' | 'profile_id'>) => {
    if (!profile) return null;
    const { data, error } = await supabase
      .from('student_assessments')
      .insert({ ...record, profile_id: profile.id })
      .select()
      .single();
    if (error) throw error;

    if (record.passed) {
      const skill = skills.find((s) => s.skill_name === record.skill_name);
      if (skill) {
        await supabase.from('student_skills').update({
          verified: true,
          verified_score: record.score,
          verified_date: new Date().toISOString(),
          verified_through: `${record.skill_name} Assessment`,
          current_level: Math.max(skill.current_level, skill.target_level),
          updated_at: new Date().toISOString(),
        }).eq('id', skill.id);
      }
      const step = roadmap.find((r) => r.step_type === 'Assessment' && r.skill_name === record.skill_name && !r.done);
      if (step) {
        await supabase.from('student_roadmap').update({ done: true }).eq('id', step.id);
      }
    }

    await refresh();
    return data as AssessmentRecord;
  }, [profile, skills, roadmap, refresh]);

  const addProject = useCallback(async (record: Omit<ProjectRecord, 'id' | 'profile_id'>) => {
    if (!profile) return;
    const { error } = await supabase
      .from('student_projects')
      .insert({ ...record, profile_id: profile.id });
    if (error) throw error;
    await refresh();
  }, [profile, refresh]);

  const submitProject = useCallback(async (record: Omit<ProjectRecord, 'id' | 'profile_id'>) => {
    if (!profile) return;
    const { error } = await supabase
      .from('student_projects')
      .insert({ ...record, profile_id: profile.id });
    if (error) throw error;

    if (record.skill_name) {
      const skill = skills.find((s) => s.skill_name === record.skill_name);
      if (skill && skill.current_level < skill.target_level) {
        const newLevel = Math.min(skill.current_level + 10, skill.target_level);
        await supabase.from('student_skills').update({
          current_level: newLevel,
          updated_at: new Date().toISOString(),
        }).eq('id', skill.id);
      }

      const projectStep = roadmap.find((r) => r.step_type === 'Project' && r.skill_name === record.skill_name && !r.done);
      if (projectStep) {
        await supabase.from('student_roadmap').update({ done: true }).eq('id', projectStep.id);
      }

      const practiceTask = tasks.find((t) => t.task_type === 'project' && t.skill_name === record.skill_name && !t.completed);
      if (practiceTask) {
        await supabase.from('student_tasks').update({
          completed: true,
          completed_at: new Date().toISOString(),
          category: 'completed',
        }).eq('id', practiceTask.id);
      }
    }

    await refresh();
  }, [profile, skills, roadmap, tasks, refresh]);

  const applyToInternship = useCallback(async (internshipId: string, matchScore: number) => {
    if (!profile) return;
    const { error } = await supabase.from('applications').insert({
      internship_id: internshipId,
      student_profile_id: profile.id,
      student_name: profile.full_name,
      match_score: matchScore,
      status: 'New',
    });
    if (error) throw error;
    await refresh();
  }, [profile, refresh]);

  return (
    <StudentDataContext.Provider
      value={{
        skills, roadmap, tasks, assessments, projects, internships, applications,
        loading, refresh, updateSkill, toggleTask, completeRoadmapStep,
        addAssessment, addProject, submitProject, applyToInternship,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
}

export function useStudentData() {
  const ctx = useContext(StudentDataContext);
  if (!ctx) throw new Error('useStudentData must be used within StudentDataProvider');
  return ctx;
}

export function calculateMatch(skills: Skill[], requiredSkills: { name: string; level: number }[]): number {
  if (requiredSkills.length === 0) return 0;
  let totalWeight = 0;
  let achievedWeight = 0;
  for (const req of requiredSkills) {
    const skill = skills.find((s) => s.skill_name === req.name);
    const current = skill ? skill.current_level : 0;
    const ratio = Math.min(current / req.level, 1);
    totalWeight += req.level;
    achievedWeight += ratio * req.level;
  }
  return Math.round((achievedWeight / totalWeight) * 100);
}
