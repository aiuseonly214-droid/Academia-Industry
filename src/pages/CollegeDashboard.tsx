import { useState } from 'react';
import {
  ArrowUpRight, School, Users, TrendingUp, Check, ChevronRight, Search, Bell,
  MoreHorizontal, GraduationCap, BarChart3, FileText, Download, ShieldCheck,
  BriefcaseBusiness, Award, MapPin, Clock3, Send, X, Target, UserRound, LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

type View = 'Dashboard' | 'Students' | 'Placements' | 'Analytics' | 'Reports';

const navItems: { label: View; icon: typeof School }[] = [
  { label: 'Dashboard', icon: School },
  { label: 'Students', icon: Users },
  { label: 'Placements', icon: BriefcaseBusiness },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Reports', icon: FileText },
];

const students = [
  { name: 'Pratik Lohar', year: '1st Year', branch: 'BCA', match: 78, verified: 2, status: 'In Progress', placement: null },
  { name: 'Ananya Sharma', year: '3rd Year', branch: 'BSc CS', match: 88, verified: 3, status: 'Placed', placement: 'Nova Analytics' },
  { name: 'Rohan Mehta', year: '2nd Year', branch: 'BCA', match: 65, verified: 1, status: 'At Risk', placement: null },
  { name: 'Sneha Patil', year: '3rd Year', branch: 'BSc IT', match: 81, verified: 2, status: 'Placed', placement: 'Atlas Systems' },
  { name: 'Karan Joshi', year: '3rd Year', branch: 'B.Tech', match: 79, verified: 3, status: 'Interview', placement: null },
  { name: 'Priya Desai', year: '2nd Year', branch: 'BCA', match: 55, verified: 0, status: 'At Risk', placement: null },
];

const placementStats = [
  { company: 'Nova Analytics', hires: 4, roles: 'Data Analyst, Business Analyst' },
  { company: 'Atlas Systems', hires: 3, roles: 'Frontend Developer, Full Stack' },
  { company: 'TechVista', hires: 2, roles: 'Data Analyst' },
  { company: 'CloudEdge', hires: 2, roles: 'DevOps Intern' },
];

export default function CollegeDashboard({ onExit }: { onExit: () => void }) {
  const { profile } = useAuth();
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [toast, setToast] = useState('');

  const profileName = profile?.full_name || 'User';
  const firstName = profileName.split(' ')[0];
  const collegeName = profile?.organization || 'Your College';

  let currentPage: React.ReactNode;
  if (activeView === 'Dashboard') currentPage = <CollegeOverview onNavigate={setActiveView} onToast={setToast} collegeName={collegeName} firstName={firstName} />;
  else if (activeView === 'Students') currentPage = <StudentsView onToast={setToast} />;
  else if (activeView === 'Placements') currentPage = <PlacementsView />;
  else if (activeView === 'Analytics') currentPage = <CollegeAnalyticsView />;
  else currentPage = <ReportsView collegeName={collegeName} />;

  return (
    <div className="app-shell">
      <aside className="sidebar sidebar-college">
        <div className="brand"><div className="brand-mark brand-mark-college"><School size={19} /></div><span>Academia<span className="brand-dash">—</span>Industry</span></div>
        <div className="workspace-label">COLLEGE WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activeView === label ? 'active' : ''}`} key={label} onClick={() => setActiveView(label)}>
              <Icon size={17} strokeWidth={activeView === label ? 2.3 : 1.8} /><span>{label}</span>
              {label === 'Students' && <span className="nav-dot nav-dot-coral" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><span>Help center</span></div>
          <div className="profile-mini"><div className="avatar avatar-college">{firstName.slice(0, 2).toUpperCase()}</div><div><strong>{profileName}</strong><span>{collegeName}</span></div><MoreHorizontal size={17} /></div>
          <button className="switch-role-button" onClick={onExit}><LogOut size={15} /> Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="crumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeView}</strong></div>
          <div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar top-avatar-college">{firstName.slice(0, 2).toUpperCase()}</div></div>
        </header>
        <div className="page-wrap">{currentPage}</div>
      </main>
      {toast && <button className="toast" onClick={() => setToast('')}><Check size={15} />{toast}<X size={14} /></button>}
    </div>
  );
}

function CollegeOverview({ onNavigate, onToast, collegeName, firstName }: { onNavigate: (v: View) => void; onToast: (m: string) => void; collegeName: string; firstName: string }) {
  return (
    <>
      <section className="hero-row">
        <div><div className="eyebrow"><span className="pulse pulse-amber" /> Tuesday, 10 September 2026</div><h1>Good morning, {firstName}<span className="amber-dot">.</span></h1><p className="hero-copy">{collegeName} has 248 enrolled students and 11 placed this semester.</p></div>
        <button className="primary-button primary-amber" onClick={() => onNavigate('Reports')}><Download size={16} /> Export placement report</button>
      </section>
      <section className="stats-grid">
        <StatCard label="Total students" value="248" caption="Across 4 branches" icon={<Users size={18} />} color="blue" progress={62} />
        <StatCard label="Placement rate" value="73%" caption="11 placed this semester" icon={<GraduationCap size={18} />} color="green" progress={73} />
        <StatCard label="Avg. skill match" value="71%" caption="Industry benchmark: 65%" icon={<TrendingUp size={18} />} color="amber" progress={71} />
        <StatCard label="At-risk students" value="18" caption="Need intervention" icon={<Target size={18} />} color="coral" />
      </section>
      <div className="dashboard-grid">
        <section className="panel roadmap-panel">
          <div className="panel-header"><div><p className="section-kicker">STUDENT READINESS</p><h2>Students needing attention</h2></div><button className="text-button" onClick={() => onNavigate('Students')}>View all students <ArrowUpRight size={15} /></button></div>
          <div className="candidate-list">
            {students.filter((s) => s.status === 'At Risk' || s.status === 'In Progress').slice(0, 4).map((s) => (
              <div className="candidate-row" key={s.name}>
                <div className="candidate-avatar candidate-avatar-amber">{s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                <div className="candidate-info"><strong>{s.name}</strong><span>{s.branch} · {s.year}</span></div>
                <div className="candidate-skills"><span className={`status-badge status-${s.status.toLowerCase().replace(' ', '-')}`}>{s.status}</span></div>
                <div className="candidate-match"><strong>{s.match}%</strong><span>match</span></div>
                <button className="timeline-action" onClick={() => onToast(`Opening ${s.name}'s progress report`)}>Review <ChevronRight size={15} /></button>
              </div>
            ))}
          </div>
          <div className="panel-footer panel-footer-amber"><Target size={16} /><span>2 students have dropped below 60% match this month.</span><button onClick={() => onNavigate('Students')}>See list</button></div>
        </section>
        <section className="panel skill-panel">
          <div className="panel-header"><div><p className="section-kicker">PLACEMENT HIGHLIGHTS</p><h2>Top recruiters</h2></div><button className="icon-button small" onClick={() => onNavigate('Placements')}><ArrowUpRight size={16} /></button></div>
          <div className="posted-list">
            {placementStats.slice(0, 3).map((p) => (
              <div className="posted-row" key={p.company}>
                <div className="posted-info"><strong>{p.company}</strong><span>{p.roles}</span></div>
                <span className="hire-count"><strong>{p.hires}</strong> hires</span>
              </div>
            ))}
          </div>
          <button className="soft-button" onClick={() => onNavigate('Placements')}><BriefcaseBusiness size={15} /> View all placements</button>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel assessment-card assessment-card-amber">
          <div className="assessment-icon assessment-icon-amber"><Target size={20} /></div>
          <div className="assessment-copy"><p className="section-kicker">INTERVENTION NEEDED</p><h2>18 students at risk</h2><p>Below 60% industry match. Schedule skill-building sessions.</p></div>
          <button className="primary-button primary-amber" onClick={() => onNavigate('Students')}>Review students <ArrowUpRight size={15} /></button>
        </section>
        <section className="panel internship-card">
          <div className="panel-header"><div><p className="section-kicker">SEMESTER PROGRESS</p><h2>Placement timeline</h2></div></div>
          <div className="activity-item"><div className="activity-dot activity-dot-green" /><div><strong>11 students placed</strong><span>This semester · 4 companies</span></div></div>
          <div className="activity-item"><div className="activity-dot activity-dot-amber" /><div><strong>6 in interview stage</strong><span>Active with 3 companies</span></div></div>
          <div className="activity-item"><div className="activity-dot activity-dot-blue" /><div><strong>18 at-risk students</strong><span>Need skill intervention</span></div></div>
        </section>
      </div>
    </>
  );
}

function StudentsView({ onToast }: { onToast: (m: string) => void }) {
  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><Users size={15} /> STUDENT DIRECTORY</div><h1>All students<span className="amber-dot">.</span></h1><p className="hero-copy">Track readiness, verified skills, and placement status across all branches.</p></div></section>
      <section className="panel">
        <div className="candidate-table-head">
          <span>Student</span><span>Branch</span><span>Verified</span><span>Match</span><span>Status</span><span></span>
        </div>
        {students.map((s) => (
          <div className="candidate-table-row" key={s.name}>
            <div className="candidate-cell"><div className="candidate-avatar">{s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div><div><strong>{s.name}</strong><span>{s.year}</span></div></div>
            <span className="candidate-cell">{s.branch}</span>
            <span className="candidate-cell"><ShieldCheck size={13} /> {s.verified} verified</span>
            <span className="candidate-cell match-cell"><strong>{s.match}%</strong></span>
            <span className={`candidate-cell status-badge status-${s.status.toLowerCase().replace(' ', '-')}`}>{s.status}</span>
            <span className="candidate-cell"><button className="timeline-action" onClick={() => onToast(`Opening ${s.name}'s progress report`)}>View <ChevronRight size={15} /></button></span>
          </div>
        ))}
      </section>
    </>
  );
}

function PlacementsView() {
  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><BriefcaseBusiness size={15} /> PLACEMENT TRACKING</div><h1>Placement records<span className="amber-dot">.</span></h1><p className="hero-copy">Company-wise hiring details and student placement outcomes.</p></div><button className="outline-button"><Download size={16} /> Export placements</button></section>
      <div className="stats-grid">
        <StatCard label="Total placements" value="11" caption="This semester" icon={<Award size={18} />} color="green" />
        <StatCard label="Companies visited" value="4" caption="2 new this month" icon={<BriefcaseBusiness size={18} />} color="blue" />
        <StatCard label="In interview" value="6" caption="Active candidates" icon={<Users size={18} />} color="amber" />
        <StatCard label="Avg. package" value="4.2 LPA" caption="15% above last year" icon={<TrendingUp size={18} />} color="coral" />
      </div>
      <section className="panel" style={{ padding: 23 }}>
        <div className="panel-header"><div><p className="section-kicker">COMPANY-WISE HIRES</p><h2>Recruiter breakdown</h2></div></div>
        <div className="placement-list">
          {placementStats.map((p) => (
            <div className="placement-row" key={p.company}>
              <div className="company-logo company-logo-amber">{p.company[0]}</div>
              <div className="placement-info"><strong>{p.company}</strong><span>{p.roles}</span></div>
              <div className="placement-hires"><strong>{p.hires}</strong><span>students hired</span></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CollegeAnalyticsView() {
  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><BarChart3 size={15} /> COLLEGE ANALYTICS</div><h1>Outcome insights<span className="amber-dot">.</span></h1><p className="hero-copy">Track placement trends, skill gaps, and year-over-year improvement.</p></div><button className="outline-button"><Download size={16} /> Export analytics</button></section>
      <div className="stats-grid">
        <StatCard label="Placement rate" value="73%" caption="+8% vs last year" icon={<TrendingUp size={18} />} color="green" progress={73} />
        <StatCard label="Avg. skill match" value="71%" caption="+6% vs last year" icon={<Target size={18} />} color="amber" progress={71} />
        <StatCard label="Verified skills" value="3.2" caption="Avg. per student" icon={<ShieldCheck size={18} />} color="blue" />
        <StatCard label="Industry partners" value="12" caption="+4 this year" icon={<BriefcaseBusiness size={18} />} color="coral" />
      </div>
      <section className="panel" style={{ padding: 23 }}>
        <div className="panel-header"><div><p className="section-kicker">BRANCH-WISE READINESS</p><h2>Skill match by branch</h2></div></div>
        <div className="branch-bars">
          <div className="branch-row"><span>BSc CS</span><div className="bar-track"><div className="bar-current" style={{ width: '82%', background: '#1b9e6e' }} /></div><strong>82%</strong></div>
          <div className="branch-row"><span>B.Tech</span><div className="bar-track"><div className="bar-current" style={{ width: '76%', background: '#3b82c4' }} /></div><strong>76%</strong></div>
          <div className="branch-row"><span>BCA</span><div className="bar-track"><div className="bar-current" style={{ width: '68%', background: '#d97706' }} /></div><strong>68%</strong></div>
          <div className="branch-row"><span>BSc IT</span><div className="bar-track"><div className="bar-current" style={{ width: '64%', background: '#dd7c61' }} /></div><strong>64%</strong></div>
        </div>
      </section>
    </>
  );
}

function ReportsView({ collegeName }: { collegeName: string }) {
  return (
    <section className="empty-state">
      <div className="empty-icon empty-icon-amber"><FileText size={29} /></div>
      <p className="section-kicker">REPORTS & EXPORTS</p>
      <h1>Placement reports<span className="amber-dot">.</span></h1>
      <p>Generate detailed placement reports for {collegeName}. Export student readiness summaries, company-wise placement data, and accreditation-ready reports.</p>
      <div className="empty-actions">
        <button className="primary-button primary-amber"><Download size={15} /> Generate report</button>
        <button className="outline-button"><FileText size={15} /> Past reports</button>
      </div>
    </section>
  );
}

function StatCard({ label, value, caption, icon, color, progress }: { label: string; value: string; caption: string; icon: React.ReactNode; color: string; progress?: number }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-caption">{caption}</div>{progress !== undefined && <div className="stat-progress"><span style={{ width: `${progress}%` }} /></div>}</div>;
}
