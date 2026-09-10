import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  demoSkills, demoRoadmap, demoTasks, demoAssessments, demoProjects, demoInternships,
  DEMO_STUDENT_PHONE, DEMO_COMPANY_PHONE, DEMO_COLLEGE_PHONE
} from './demo-data';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isValidUrl = (url?: string) => Boolean(url && /^https?:\/\//i.test(url));

// Initial seed data generator for local storage fallback
function initLocalStore() {
  if (typeof window === 'undefined') return;
  const SEED_VERSION_KEY = 'aip_db_initialized_v2';
  if (localStorage.getItem(SEED_VERSION_KEY)) return;

  const defaultProfiles = [
    {
      id: 'student-demo-id',
      phone: DEMO_STUDENT_PHONE.replace(/\s/g, ''),
      full_name: 'Pratik Lohar',
      role: 'student',
      organization: 'Fergusson College, Pune',
      is_demo: true,
      email: 'pratik.lohar@example.edu',
      location: 'Pune, Maharashtra',
      headline: 'Aspiring Data Analyst & Cloud Practitioner',
      degree: 'B.Tech in Computer Science',
      graduation_year: '2026',
      cgpa: '8.7',
      target_role: 'Data Analyst',
      target_industry: 'FinTech / Enterprise Analytics',
      bio: 'Final year undergraduate passionate about translating raw datasets into actionable business intelligence using SQL, Python, and Power BI.',
      linkedin: 'https://linkedin.com/in/pratiklohar',
      github: 'https://github.com/pratiklohar',
      portfolio: 'https://pratiklohar.dev',
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'company-demo-id',
      phone: DEMO_COMPANY_PHONE.replace(/\s/g, ''),
      full_name: 'Aisha Khan',
      role: 'company',
      organization: 'Nova Analytics',
      is_demo: true,
      email: 'aisha.khan@novaanalytics.com',
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'college-demo-id',
      phone: DEMO_COLLEGE_PHONE.replace(/\s/g, ''),
      full_name: 'Dr. Mehta',
      role: 'college',
      organization: 'Fergusson College',
      is_demo: true,
      email: 'dean.placement@fergusson.edu',
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ];

  localStorage.setItem('aip_table_profiles', JSON.stringify(defaultProfiles));
  
  const studentSkills = demoSkills.map((s, i) => ({
    ...s,
    id: `skill-${i + 1}`,
    profile_id: 'student-demo-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  localStorage.setItem('aip_table_student_skills', JSON.stringify(studentSkills));

  const studentRoadmap = demoRoadmap.map((r, i) => ({
    ...r,
    id: `roadmap-${i + 1}`,
    profile_id: 'student-demo-id',
    created_at: new Date().toISOString(),
  }));
  localStorage.setItem('aip_table_student_roadmap', JSON.stringify(studentRoadmap));

  const studentTasks = demoTasks.map((t, i) => ({
    ...t,
    id: `task-${i + 1}`,
    profile_id: 'student-demo-id',
    roadmap_id: `roadmap-${(i % 5) + 1}`,
    created_at: new Date().toISOString(),
  }));
  localStorage.setItem('aip_table_student_tasks', JSON.stringify(studentTasks));

  const studentAssessments = demoAssessments.map((a, i) => ({
    ...a,
    id: `assessment-${i + 1}`,
    profile_id: 'student-demo-id',
  }));
  localStorage.setItem('aip_table_student_assessments', JSON.stringify(studentAssessments));

  const studentProjects = demoProjects.map((p, i) => ({
    ...p,
    id: `project-${i + 1}`,
    profile_id: 'student-demo-id',
  }));
  localStorage.setItem('aip_table_student_projects', JSON.stringify(studentProjects));

  const internships = demoInternships.map((job, i) => ({
    ...job,
    id: `internship-${i + 1}`,
    profile_id: 'company-demo-id',
    created_at: new Date().toISOString(),
  }));
  localStorage.setItem('aip_table_internships', JSON.stringify(internships));

  localStorage.setItem('aip_table_applications', JSON.stringify([]));

  localStorage.setItem(SEED_VERSION_KEY, 'true');
}

// Fallback Mock Query Builder for offline / unconfigured Supabase
class LocalQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderField: string | null = null;
  private orderAscending = true;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getTableData(): any[] {
    try {
      const raw = localStorage.getItem(`aip_table_${this.tableName}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private setTableData(data: any[]): void {
    try {
      localStorage.setItem(`aip_table_${this.tableName}`, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  select(_columns = '*') {
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  async maybeSingle() {
    let rows = this.getTableData();
    for (const filter of this.filters) {
      rows = rows.filter(filter);
    }
    return { data: rows.length > 0 ? rows[0] : null, error: null };
  }

  async single() {
    const result = await this.maybeSingle();
    return result;
  }

  async insert(recordOrRecords: any | any[]) {
    const records = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords];
    const current = this.getTableData();
    const created: any[] = [];

    for (const item of records) {
      const newRecord = {
        id: item.id || `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        created_at: new Date().toISOString(),
        ...item,
      };
      current.push(newRecord);
      created.push(newRecord);
    }
    this.setTableData(current);

    return {
      data: Array.isArray(recordOrRecords) ? created : created[0],
      error: null,
      select: () => ({
        single: async () => ({ data: created[0], error: null }),
      }),
    };
  }

  async update(updates: any) {
    const current = this.getTableData();
    let updatedCount = 0;
    const modified = current.map((item) => {
      let matches = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          matches = false;
          break;
        }
      }
      if (matches) {
        updatedCount++;
        return { ...item, ...updates, updated_at: new Date().toISOString() };
      }
      return item;
    });

    this.setTableData(modified);
    return { data: modified, error: null, count: updatedCount };
  }

  async delete() {
    const current = this.getTableData();
    const remaining = current.filter((item) => {
      for (const filter of this.filters) {
        if (filter(item)) return false;
      }
      return true;
    });
    this.setTableData(remaining);
    return { data: remaining, error: null };
  }

  // Thenable interface so `await supabase.from('...').select('*')` returns { data, error }
  then(resolve: (value: { data: any[]; error: null }) => void) {
    let rows = this.getTableData();
    for (const filter of this.filters) {
      rows = rows.filter(filter);
    }
    if (this.orderField) {
      rows.sort((a, b) => {
        const valA = a[this.orderField!];
        const valB = b[this.orderField!];
        if (valA < valB) return this.orderAscending ? -1 : 1;
        if (valA > valB) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }
    resolve({ data: rows, error: null });
  }
}

function createFallbackClient(): any {
  initLocalStore();

  return {
    from: (tableName: string) => new LocalQueryBuilder(tableName),
    functions: {
      invoke: async (_name: string, _options?: any) => {
        return { data: null, error: new Error('Edge functions offline fallback') };
      },
    },
  };
}

// Export singleton Supabase client or robust fallback
export const supabase: any = (isValidUrl(rawUrl) && rawKey)
  ? createClient(rawUrl!, rawKey!)
  : createFallbackClient();

export type { UserRole } from './types';
