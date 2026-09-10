import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { Profile, UserRole, Skill, RoadmapStep, Task, AssessmentRecord, ProjectRecord, Internship, Application } from './types';
import {
  DEMO_OTP,
  demoSkills, demoRoadmap, demoTasks, demoAssessments, demoProjects, demoInternships,
} from './demo-data';


interface AuthState {
  profile: Profile | null;
  loading: boolean;
  otpSent: boolean;
  pendingPhone: string | null;
  pendingRole: UserRole | null;
  demoOtp: string | null;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  selectRole: (role: UserRole) => void;
  sendOtp: (phone: string) => Promise<{ demoOtp: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loginDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'aip_session_profile_id';
const PHONE_FORMAT = /^(\+91\s?\d{5}\s?\d{5}|\+91\d{10})$/;

function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, '');
}

/** Fixed demo profile IDs that match the pre-seeded localStorage store */
const DEMO_PROFILE_IDS: Record<UserRole, string> = {
  student: 'student-demo-id',
  company: 'company-demo-id',
  college: 'college-demo-id',
};

/** Hardcoded fallback profiles in case localStorage was cleared */
const DEMO_FALLBACK_PROFILES: Record<UserRole, Profile> = {
  student: {
    id: 'student-demo-id',
    phone: '+919876543210',
    full_name: 'Pratik Lohar',
    role: 'student',
    organization: 'Fergusson College, Pune',
    is_demo: true,
    email: 'pratik.lohar@example.edu',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  } as Profile,
  company: {
    id: 'company-demo-id',
    phone: '+919876511111',
    full_name: 'Aisha Khan',
    role: 'company',
    organization: 'Nova Analytics',
    is_demo: true,
    email: 'aisha.khan@novaanalytics.com',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  } as Profile,
  college: {
    id: 'college-demo-id',
    phone: '+919876522222',
    full_name: 'Dr. Mehta',
    role: 'college',
    organization: 'Fergusson College',
    is_demo: true,
    email: 'dean.placement@fergusson.edu',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  } as Profile,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    profile: null,
    loading: true,
    otpSent: false,
    pendingPhone: null,
    pendingRole: null,
    demoOtp: null,
    error: null,
  });

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const savedId = localStorage.getItem(SESSION_KEY);
    if (!savedId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', savedId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        const profile = data as Profile;
        setState((s) => ({ ...s, profile, loading: false }));
      } else {
        localStorage.removeItem(SESSION_KEY);
        setState((s) => ({ ...s, loading: false }));
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
      setState((s) => ({ ...s, loading: false }));
    }
  }

  function selectRole(role: UserRole) {
    setState((s) => ({ ...s, pendingRole: role, error: null }));
  }

  async function sendOtp(phone: string): Promise<{ demoOtp: string }> {
    const normalized = normalizePhone(phone);
    if (!PHONE_FORMAT.test(normalized)) {
      setState((s) => ({ ...s, error: 'Enter a valid +91 mobile number' }));
      throw new Error('Invalid phone');
    }
    setState((s) => ({ ...s, error: null }));
    await new Promise((r) => setTimeout(r, 600));
    setState((s) => ({ ...s, otpSent: true, pendingPhone: normalized, demoOtp: DEMO_OTP }));
    return { demoOtp: DEMO_OTP };
  }

  async function verifyOtp(phone: string, otp: string): Promise<void> {
    const normalized = normalizePhone(phone);
    if (otp !== DEMO_OTP) {
      setState((s) => ({ ...s, error: 'Invalid OTP. Use 123456 for demo mode.' }));
      throw new Error('Invalid OTP');
    }
    const role = state.pendingRole;
    if (!role) throw new Error('No role selected');

    const { data: existing, error: lookupErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', normalized)
      .maybeSingle();
    if (lookupErr) {
      setState((s) => ({ ...s, error: lookupErr.message }));
      throw lookupErr;
    }

    let profile: Profile;

    if (existing) {
      profile = existing as Profile;
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profile.id);
    } else {
      const demoInfo = DEMO_FALLBACK_PROFILES[role] ?? DEMO_FALLBACK_PROFILES.student;
      const insertData = {
        phone: normalized,
        full_name: demoInfo.full_name,
        role,
        organization: demoInfo.organization ?? null,
        is_demo: true,
        email: null,
        last_login: new Date().toISOString(),
      };
      // insert returns the created record directly from LocalQueryBuilder
      const result = await supabase.from('profiles').insert(insertData);
      const insertErr = result?.error;
      if (insertErr) {
        setState((s) => ({ ...s, error: insertErr.message }));
        throw insertErr;
      }
      // result.data is the created record (or array)
      const created = Array.isArray(result.data) ? result.data[0] : result.data;
      profile = created as Profile;
      await seedDemoData(profile.id, role);
    }

    localStorage.setItem(SESSION_KEY, profile.id);
    setState((s) => ({
      ...s,
      profile,
      otpSent: false,
      pendingPhone: null,
      pendingRole: null,
      demoOtp: null,
      error: null,
    }));
  }


  async function loginDemo(role: UserRole): Promise<void> {
    // Look up by the known fixed ID — never by phone, never insert
    const profileId = DEMO_PROFILE_IDS[role];

    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .maybeSingle();

    // Use found profile, or fall back to hardcoded object (handles cleared localStorage)
    const profile: Profile = (existing as Profile) ?? DEMO_FALLBACK_PROFILES[role];

    // Persist session and update last_login silently
    localStorage.setItem(SESSION_KEY, profile.id);
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', profile.id);

    setState((s) => ({ ...s, profile, loading: false, error: null }));
  }

  async function seedDemoData(profileId: string, role: UserRole) {
    if (role === 'student') {
      await supabase.from('student_skills').insert(
        demoSkills.map((s) => ({ ...s, profile_id: profileId }))
      );
      await supabase.from('student_roadmap').insert(
        demoRoadmap.map((r) => ({ ...r, profile_id: profileId }))
      );
      await supabase.from('student_tasks').insert(
        demoTasks.map((t) => ({ ...t, profile_id: profileId }))
      );
      await supabase.from('student_assessments').insert(
        demoAssessments.map((a) => ({ ...a, profile_id: profileId }))
      );
      await supabase.from('student_projects').insert(
        demoProjects.map((p) => ({ ...p, profile_id: profileId }))
      );
    }
    if (role === 'company') {
      await supabase.from('internships').insert(
        demoInternships.map((i) => ({ ...i, profile_id: profileId }))
      );
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setState({
      profile: null,
      loading: false,
      otpSent: false,
      pendingPhone: null,
      pendingRole: null,
      demoOtp: null,
      error: null,
    });
  }

  function clearError() {
    setState((s) => ({ ...s, error: null }));
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        selectRole,
        sendOtp,
        verifyOtp,
        logout,
        clearError,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
