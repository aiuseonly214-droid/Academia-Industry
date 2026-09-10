import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { StudentDataProvider } from '@/lib/student-data';
import RoleSelect from '@/pages/RoleSelect';
import StudentDashboard from '@/pages/StudentDashboard';
import CompanyDashboard from '@/pages/CompanyDashboard';
import CollegeDashboard from '@/pages/CollegeDashboard';

function AppContent() {
  const { profile, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  if (!profile) return <RoleSelect />;

  if (profile.role === 'student') {
    return (
      <StudentDataProvider>
        <StudentDashboard onExit={logout} />
      </StudentDataProvider>
    );
  }
  if (profile.role === 'company') return <CompanyDashboard onExit={logout} />;
  if (profile.role === 'college') return <CollegeDashboard onExit={logout} />;

  return <RoleSelect />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
