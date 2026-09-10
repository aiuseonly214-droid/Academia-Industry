import { useState, useEffect } from 'react';
import {
  ArrowUpRight, Building2, BriefcaseBusiness, Check, ChevronRight, Users, TrendingUp,
  Search, Bell, MoreHorizontal, Sparkles, Filter, Eye, Download, MapPin, Clock3,
  ShieldCheck, FileText, UserPlus, BarChart3, Star, Send, X, LogOut, Plus, XCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Internship } from '@/lib/types';

type View = 'Dashboard' | 'Candidates' | 'Internships' | 'Analytics' | 'Profile';

const navItems: { label: View; icon: typeof Building2 }[] = [
  { label: 'Dashboard', icon: Building2 },
  { label: 'Candidates', icon: Users },
  { label: 'Internships', icon: BriefcaseBusiness },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Profile', icon: FileText },
];

export default function CompanyDashboard({ onExit }: { onExit: () => void }) {
  const { profile } = useAuth();
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [toast, setToast] = useState('');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = profile?.full_name.split(' ')[0] || 'User';
  const orgName = profile?.organization || 'Your Company';

  useEffect(() => {
    if (profile) {
      supabase.from('internships').select('*').eq('profile_id', profile.id).then(({ data, error }) => {
        if (error) {
          setToast('Failed to load internships');
        }
        setInternships((data as Internship[]) || []);
        setLoading(false);
      });
    }
  }, [profile]);

  let currentPage: React.ReactNode;
  if (activeView === 'Dashboard') currentPage = <CompanyOverview onNavigate={setActiveView} onToast={setToast} orgName={orgName} firstName={firstName} internships={internships} loading={loading} />;
  else if (activeView === 'Candidates') currentPage = <CandidatesView onToast={setToast} />;
  else if (activeView === 'Internships') currentPage = <InternshipsView onToast={setToast} internships={internships} profileId={profile?.id || ''} companyName={orgName} onRefresh={() => {
    if (profile) {
      supabase.from('internships').select('*').eq('profile_id', profile.id).then(({ data, error }) => {
        if (error) setToast('Failed to refresh internships');
        setInternships((data as Internship[]) || []);
      });
    }
  }} />;
  else if (activeView === 'Analytics') currentPage = <AnalyticsView />;
  else currentPage = <ProfileView orgName={orgName} firstName={firstName} />;

  return (
    <div className="app-shell">
      <aside className="sidebar sidebar-company">
        <div className="brand"><div className="brand-mark brand-mark-company"><Building2 size={19} /></div><span>Academia<span className="brand-dash">—</span>Industry</span></div>
        <div className="workspace-label">COMPANY WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activeView === label ? 'active' : ''}`} key={label} onClick={() => setActiveView(label)}>
              <Icon size={17} strokeWidth={activeView === label ? 2.3 : 1.8} /><span>{label}</span>
              {label === 'Candidates' && <span className="nav-dot nav-dot-amber" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><span>Help center</span></div>
          <div className="profile-mini"><div className="avatar avatar-company">{firstName.slice(0, 2).toUpperCase()}</div><div><strong>{profile?.full_name}</strong><span>{orgName}</span></div><MoreHorizontal size={17} /></div>
          <button className="switch-role-button" onClick={onExit}><LogOut size={15} /> Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="crumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeView}</strong></div>
          <div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar top-avatar-company">{firstName.slice(0, 2).toUpperCase()}</div></div>
        </header>
        <div className="page-wrap">{currentPage}</div>
      </main>
      {toast && <button className="toast" onClick={() => setToast('')}><Check size={15} />{toast}<X size={14} /></button>}
    </div>
  );
}

const candidates = [
  { name: 'Pratik Lohar', role: 'Data Analyst', skills: ['Python', 'SQL', 'Power BI'], match: 92, verified: 2, status: 'New', college: 'Fergusson College' },
  { name: 'Ananya Sharma', role: 'Frontend Developer', skills: ['React', 'JavaScript', 'CSS'], match: 88, verified: 3, status: 'Shortlisted', college: 'COEP Pune' },
  { name: 'Rohan Mehta', role: 'Business Analyst', skills: ['SQL', 'Excel', 'Power BI'], match: 85, verified: 1, status: 'New', college: 'Symbiosis' },
  { name: 'Sneha Patil', role: 'Data Analyst', skills: ['Python', 'SQL', 'Tableau'], match: 81, verified: 2, status: 'Reviewed', college: 'Fergusson College' },
  { name: 'Karan Joshi', role: 'Full Stack Developer', skills: ['React', 'Node.js', 'PostgreSQL'], match: 79, verified: 3, status: 'Shortlisted', college: 'VIT Pune' },
];

function CompanyOverview({ onNavigate, onToast, orgName, firstName, internships, loading }: { onNavigate: (v: View) => void; onToast: (m: string) => void; orgName: string; firstName: string; internships: Internship[]; loading: boolean }) {
  const activeCount = internships.filter((i) => i.status === 'Active').length;
  const totalApplicants = internships.reduce((acc, i) => acc + i.applicants_count, 0);
  return (
    <>
      <section className="hero-row">
        <div><div className="eyebrow"><span className="pulse pulse-blue" /> Tuesday, 10 September 2026</div><h1>Good morning, {firstName}<span className="blue-dot">.</span></h1><p className="hero-copy">{orgName} has 5 new matched candidates ready to review.</p></div>
        <button className="primary-button primary-blue" onClick={() => onNavigate('Internships')}><BriefcaseBusiness size={16} /> Post an internship</button>
      </section>
      <section className="stats-grid">
        <StatCard label="Active candidates" value="142" caption="5 new this week" icon={<Users size={18} />} color="blue" progress={68} />
        <StatCard label="Open positions" value={`${activeCount}`} caption={loading ? 'Loading...' : `${activeCount} active`} icon={<BriefcaseBusiness size={18} />} color="green" />
        <StatCard label="Avg. match score" value="84%" caption="Above industry average" icon={<TrendingUp size={18} />} color="amber" progress={84} />
        <StatCard label="Total applicants" value={`${totalApplicants}`} caption="Across all positions" icon={<Star size={18} />} color="coral" />
      </section>
      <div className="dashboard-grid">
        <section className="panel roadmap-panel">
          <div className="panel-header"><div><p className="section-kicker">TOP MATCHED CANDIDATES</p><h2>Recommended for your roles</h2></div><button className="text-button" onClick={() => onNavigate('Candidates')}>View all candidates <ArrowUpRight size={15} /></button></div>
          <div className="candidate-list">
            {candidates.slice(0, 4).map((c) => (
              <div className="candidate-row" key={c.name}>
                <div className="candidate-avatar">{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                <div className="candidate-info"><strong>{c.name}</strong><span>{c.role} · {c.college}</span></div>
                <div className="candidate-skills">{c.skills.slice(0, 2).map((s) => <span key={s} className="skill-tag">{s}</span>)}</div>
                <div className="candidate-match"><strong>{c.match}%</strong><span>match</span></div>
                <button className="timeline-action" onClick={() => onToast(`Opening ${c.name}'s profile`)}>View <ChevronRight size={15} /></button>
              </div>
            ))}
          </div>
        </section>
        <section className="panel skill-panel">
          <div className="panel-header"><div><p className="section-kicker">HIRING SNAPSHOT</p><h2>Posted internships</h2></div><button className="icon-button small" onClick={() => onNavigate('Internships')}><ArrowUpRight size={16} /></button></div>
          <div className="posted-list">
            {loading && <div className="posted-row"><div className="posted-info"><strong>Loading...</strong><span>Please wait</span></div></div>}
            {!loading && internships.length === 0 && <div className="posted-row"><div className="posted-info"><strong>No internships yet</strong><span>Post your first internship</span></div></div>}
            {internships.map((job) => (
              <div className="posted-row" key={job.id}>
                <div className="posted-info"><strong>{job.title}</strong><span>{job.applicants_count} applicants · {job.posted_text}</span></div>
                <span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span>
              </div>
            ))}
          </div>
          <button className="soft-button" onClick={() => onNavigate('Internships')}><BriefcaseBusiness size={15} /> Manage internships</button>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel assessment-card assessment-card-blue">
          <div className="assessment-icon assessment-icon-blue"><UserPlus size={20} /></div>
          <div className="assessment-copy"><p className="section-kicker">TALENT PIPELINE</p><h2>5 new candidates matched</h2><p>Review and shortlist before they accept other offers.</p></div>
          <button className="primary-button primary-blue" onClick={() => onNavigate('Candidates')}>Review now <ArrowUpRight size={15} /></button>
        </section>
        <section className="panel internship-card">
          <div className="panel-header"><div><p className="section-kicker">RECENT ACTIVITY</p><h2>Hiring activity</h2></div></div>
          <div className="activity-item"><div className="activity-dot activity-dot-green" /><div><strong>Ananya Sharma shortlisted</strong><span>For Frontend Developer Intern · 2h ago</span></div></div>
          <div className="activity-item"><div className="activity-dot activity-dot-blue" /><div><strong>New application from Karan Joshi</strong><span>For Full Stack Developer Intern · 5h ago</span></div></div>
          <div className="activity-item"><div className="activity-dot activity-dot-amber" /><div><strong>Data Analyst Intern posted</strong><span>3 days ago · 24 applicants so far</span></div></div>
        </section>
      </div>
    </>
  );
}

function CandidatesView({ onToast }: { onToast: (m: string) => void }) {
  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><Users size={15} /> TALENT POOL</div><h1>Matched candidates<span className="blue-dot">.</span></h1><p className="hero-copy">Students whose verified skills match your open positions.</p></div><button className="primary-button primary-blue" onClick={() => onToast('Filter panel opened')}><Filter size={16} /> Filter candidates</button></section>
      <section className="panel">
        <div className="candidate-table-head">
          <span>Candidate</span><span>Target role</span><span>Verified skills</span><span>Match</span><span>Status</span><span></span>
        </div>
        {candidates.map((c) => (
          <div className="candidate-table-row" key={c.name}>
            <div className="candidate-cell"><div className="candidate-avatar">{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div><div><strong>{c.name}</strong><span>{c.college}</span></div></div>
            <span className="candidate-cell">{c.role}</span>
            <span className="candidate-cell"><ShieldCheck size={13} /> {c.verified} verified</span>
            <span className="candidate-cell match-cell"><strong>{c.match}%</strong></span>
            <span className={`candidate-cell status-badge status-${c.status.toLowerCase()}`}>{c.status}</span>
            <span className="candidate-cell"><button className="timeline-action" onClick={() => onToast(`Opening ${c.name}'s profile`)}><Eye size={14} /> View</button></span>
          </div>
        ))}
      </section>
    </>
  );
}

function InternshipsView({ onToast, internships, profileId, companyName, onRefresh }: { onToast: (m: string) => void; internships: Internship[]; profileId: string; companyName: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Hybrid');
  const [duration, setDuration] = useState('3 months');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(70);
  const [requiredSkills, setRequiredSkills] = useState<{ name: string; level: number }[]>([]);
  const [saving, setSaving] = useState(false);

  function addSkill() {
    if (!skillName.trim()) return;
    setRequiredSkills((s) => [...s, { name: skillName.trim(), level: skillLevel }]);
    setSkillName('');
    setSkillLevel(70);
  }

  function removeSkill(idx: number) {
    setRequiredSkills((s) => s.filter((_, i) => i !== idx));
  }

  async function handlePost() {
    if (!title.trim() || requiredSkills.length === 0) {
      onToast('Add a title and at least one required skill');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('internships').insert({
      profile_id: profileId,
      company_name: companyName,
      title: title.trim(),
      location,
      duration,
      status: 'Active',
      required_skills: requiredSkills,
      applicants_count: 0,
      posted_text: 'Just now',
    });
    setSaving(false);
    if (error) {
      onToast('Failed to post internship');
      return;
    }
    onToast('Internship posted successfully!');
    setTitle(''); setLocation('Hybrid'); setDuration('3 months'); setRequiredSkills([]);
    setShowForm(false);
    onRefresh();
  }

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><BriefcaseBusiness size={15} /> INTERNSHIP MANAGEMENT</div><h1>Your internships<span className="blue-dot">.</span></h1><p className="hero-copy">Create, manage, and track all your posted internship positions.</p></div><button className="primary-button primary-blue" onClick={() => setShowForm(true)}><Plus size={16} /> Post new internship</button></section>
      {showForm && (
        <section className="panel" style={{ padding: 23, marginBottom: 18 }}>
          <div className="panel-header"><div><p className="section-kicker">NEW INTERNSHIP</p><h2>Create a position</h2></div><button className="icon-button small" onClick={() => setShowForm(false)}><XCircle size={18} /></button></div>
          <div className="internship-form">
            <div className="form-field"><label>Job Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Data Analyst Intern" /></div>
            <div className="form-row">
              <div className="form-field"><label>Location</label><select value={location} onChange={(e) => setLocation(e.target.value)}><option>Hybrid</option><option>Remote</option><option>On-site</option></select></div>
              <div className="form-field"><label>Duration</label><select value={duration} onChange={(e) => setDuration(e.target.value)}><option>3 months</option><option>6 months</option><option>1 year</option></select></div>
            </div>
            <div className="form-field"><label>Required Skills</label>
              <div className="skill-input-row">
                <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Skill name (e.g. SQL)" />
                <input type="number" min={0} max={100} value={skillLevel} onChange={(e) => setSkillLevel(parseInt(e.target.value) || 0)} style={{ width: 80 }} />
                <span>%</span>
                <button className="soft-button" onClick={addSkill}><Plus size={15} /> Add</button>
              </div>
              {requiredSkills.length > 0 && (
                <div className="required-skills-list">
                  {requiredSkills.map((s, i) => (
                    <span key={i} className="required-skill-chip">{s.name} {s.level}% <button onClick={() => removeSkill(i)}><X size={12} /></button></span>
                  ))}
                </div>
              )}
            </div>
            <button className="primary-button primary-blue" onClick={handlePost} disabled={saving}>{saving ? 'Posting...' : 'Post Internship'}</button>
          </div>
        </section>
      )}
      <div className="internship-grid">
        {internships.length === 0 && !showForm && (
          <section className="panel internship-new-card" onClick={() => setShowForm(true)}>
            <div className="internship-new-icon"><BriefcaseBusiness size={24} /></div>
            <strong>Post a new internship</strong>
            <span>Reach matched students instantly</span>
          </section>
        )}
        {internships.map((job) => (
          <section className="panel internship-detail-card" key={job.id}>
            <div className="internship-detail-head"><div><h3>{job.title}</h3><span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span></div><button className="icon-button small"><MoreHorizontal size={16} /></button></div>
            <div className="internship-meta"><span><MapPin size={13} /> {job.location}</span><span><Clock3 size={13} /> {job.duration}</span><span><Users size={13} /> {job.applicants_count} applicants</span></div>
            <div className="internship-skills-required">
              {job.required_skills.map((req) => (
                <div key={req.name} className="internship-skill-req">
                  <span>{req.name}</span>
                  <span className="req-level">Min {req.level}%</span>
                </div>
              ))}
            </div>
            <div className="internship-match-info"><div><strong>{job.applicants_count}</strong><span>applicants</span></div></div>
            <div className="internship-actions"><button className="soft-button" onClick={() => onToast(`Viewing applicants for ${job.title}`)}><Eye size={15} /> View applicants</button><button className="outline-button" onClick={() => onToast('Opening edit form')}><FileText size={15} /> Edit</button></div>
          </section>
        ))}
      </div>
    </>
  );
}

function AnalyticsView() {
  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><BarChart3 size={15} /> HIRING ANALYTICS</div><h1>Recruitment insights<span className="blue-dot">.</span></h1><p className="hero-copy">Track your hiring funnel, match quality, and time-to-hire.</p></div><button className="outline-button" onClick={() => {}}><Download size={16} /> Export report</button></section>
      <div className="stats-grid">
        <StatCard label="Total applicants" value="73" caption="Across all positions" icon={<Users size={18} />} color="blue" />
        <StatCard label="Shortlisted" value="15" caption="20% shortlist rate" icon={<Star size={18} />} color="green" />
        <StatCard label="Avg. time to hire" value="18d" caption="4 days faster than Q2" icon={<Clock3 size={18} />} color="amber" />
        <StatCard label="Offer acceptance" value="87%" caption="Above benchmark" icon={<Check size={18} />} color="coral" />
      </div>
      <section className="panel" style={{ padding: 23 }}>
        <div className="panel-header"><div><p className="section-kicker">FUNNEL OVERVIEW</p><h2>Hiring pipeline</h2></div></div>
        <div className="funnel">
          <div className="funnel-step"><div className="funnel-bar funnel-bar-1" style={{ width: '100%' }} /><div className="funnel-label"><strong>73</strong><span>Applicants</span></div></div>
          <div className="funnel-step"><div className="funnel-bar funnel-bar-2" style={{ width: '75%' }} /><div className="funnel-label"><strong>55</strong><span>Reviewed</span></div></div>
          <div className="funnel-step"><div className="funnel-bar funnel-bar-3" style={{ width: '45%' }} /><div className="funnel-label"><strong>15</strong><span>Shortlisted</span></div></div>
          <div className="funnel-step"><div className="funnel-bar funnel-bar-4" style={{ width: '20%' }} /><div className="funnel-label"><strong>7</strong><span>Hired</span></div></div>
        </div>
      </section>
    </>
  );
}

function ProfileView({ orgName, firstName }: { orgName: string; firstName: string }) {
  return (
    <section className="empty-state">
      <div className="empty-icon empty-icon-blue"><Building2 size={29} /></div>
      <p className="section-kicker">COMPANY PROFILE</p>
      <h1>{orgName}<span className="blue-dot">.</span></h1>
      <p>Manage your company branding, hiring preferences, and team members. A complete profile attracts 40% more matched candidates.</p>
      <div className="empty-actions"><button className="primary-button primary-blue"><FileText size={15} /> Edit profile</button></div>
    </section>
  );
}

function StatCard({ label, value, caption, icon, color, progress }: { label: string; value: string; caption: string; icon: React.ReactNode; color: string; progress?: number }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-caption">{caption}</div>{progress !== undefined && <div className="stat-progress"><span style={{ width: `${progress}%` }} /></div>}</div>;
}
