import { useState, useEffect } from 'react';
import {
  ArrowUpRight, BookOpen, BriefcaseBusiness, Check, ChevronRight, Code2, Download,
  FileText, GraduationCap, LayoutDashboard, Lightbulb, LockKeyhole, Play, Radar,
  ShieldCheck, Sparkles, Target, Trophy, UserRound, Zap, Send, X, MoreHorizontal, Bell, Search, LogOut,
  Clock, Circle, CheckCircle2, RotateCcw, Terminal, Eye, AlertCircle, Loader2, TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useStudentData, calculateMatch } from '@/lib/student-data';
import { PRACTICAL_ENVIRONMENTS, ASSESSMENT_QUESTIONS } from '@/lib/demo-data';
import type { PracticalTask, PracticalEnvironment as PracticalEnvType } from '@/lib/demo-data';
import { executePractical } from '@/lib/practical-api';
import type { View } from './student-types';
import type { AssessmentRecord } from '@/lib/types';

export default function StudentDashboard({ onExit }: { onExit: () => void }) {
  const { profile } = useAuth();
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');

  const firstName = profile?.full_name.split(' ')[0] || 'Student';
  const profileName = profile?.full_name || 'Student';

  let currentPage: React.ReactNode;
  if (activeView === 'Dashboard') currentPage = <DashboardView onNavigate={setActiveView} onToast={setToast} firstName={firstName} />;
  else if (activeView === 'Skill Map') currentPage = <SkillMapView onNavigate={setActiveView} />;
  else if (activeView === 'Roadmap') currentPage = <RoadmapView />;
  else if (activeView === 'Tasks') currentPage = <TasksView onToast={setToast} />;
  else if (activeView === 'Practical Hub') currentPage = <PracticalHubView onToast={setToast} />;
  else if (activeView === 'Assessments') currentPage = <AssessmentsView onToast={setToast} />;
  else if (activeView === 'Internships') currentPage = <InternshipsView onToast={setToast} />;
  else if (activeView === 'Resume') currentPage = <ResumeView onToast={setToast} />;
  else if (activeView === 'Progress') currentPage = <ProgressView />;
  else currentPage = <DashboardView onNavigate={setActiveView} onToast={setToast} firstName={firstName} />;

  const navItems: { label: View; icon: typeof LayoutDashboard }[] = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Tasks', icon: CheckCircle2 },
    { label: 'Skill Map', icon: Radar },
    { label: 'Roadmap', icon: Target },
    { label: 'Practical Hub', icon: Code2 },
    { label: 'Assessments', icon: Trophy },
    { label: 'Internships', icon: BriefcaseBusiness },
    { label: 'Resume', icon: FileText },
    { label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><GraduationCap size={19} /></div><span>Academia<span className="brand-dash">—</span>Industry</span></div>
        <div className="workspace-label">STUDENT WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activeView === label ? 'active' : ''}`} key={label} onClick={() => setActiveView(label)}>
              <Icon size={17} strokeWidth={activeView === label ? 2.3 : 1.8} /><span>{label}</span>
              {label === 'Tasks' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><span>Help center</span></div>
          <div className="profile-mini"><div className="avatar">{firstName.slice(0, 2).toUpperCase()}</div><div><strong>{profileName}</strong><span>Student</span></div><MoreHorizontal size={17} /></div>
          <button className="switch-role-button" onClick={onExit}><LogOut size={15} /> Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="crumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeView}</strong></div>
          <div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">{firstName.slice(0, 2).toUpperCase()}</div></div>
        </header>
        <div className="page-wrap">{currentPage}</div>
      </main>
      <button className="assistant-fab" onClick={() => setChatOpen(true)} aria-label="Open AI career assistant"><Sparkles size={20} /><span>Ask Career AI</span></button>
      {chatOpen && <Assistant onClose={() => setChatOpen(false)} />}
      {toast && <button className="toast" onClick={() => setToast('')}><Check size={15} />{toast}<X size={14} /></button>}
      <div className="quick-ask"><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setChatOpen(true)} placeholder="Ask your career assistant anything..." /><button onClick={() => setChatOpen(true)} aria-label="Send question"><Send size={16} /></button></div>
    </div>
  );
}

function DashboardView({ onNavigate, onToast, firstName }: { onNavigate: (v: View) => void; onToast: (m: string) => void; firstName: string }) {
  const { skills, tasks, assessments, roadmap } = useStudentData();
  const verifiedCount = skills.filter((s) => s.verified).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const roadmapDone = roadmap.filter((r) => r.done).length;
  const learningProgress = roadmap.length > 0 ? Math.round((roadmapDone / roadmap.length) * 100) : 0;
  const avgMatch = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + Math.min(s.current_level / s.target_level, 1), 0) / skills.length * 100) : 0;

  return (
    <>
      <section className="hero-row">
        <div><div className="eyebrow"><span className="pulse" /> Tuesday, 10 September 2026</div><h1>Good morning, {firstName}<span className="green-dot">.</span></h1><p className="hero-copy">Small progress today builds the career you want tomorrow.</p></div>
        <button className="outline-button" onClick={() => onNavigate('Resume')}><Download size={16} /> Download resume <ArrowUpRight size={15} /></button>
      </section>
      <section className="stats-grid">
        <StatCard label="Profile completion" value="85%" caption="Keep going · 3 fields left" icon={<UserRound size={18} />} color="blue" progress={85} />
        <StatCard label="Industry skill match" value={`${avgMatch}%`} caption="Top 18% of your cohort" icon={<Radar size={18} />} color="green" progress={avgMatch} />
        <StatCard label="Learning progress" value={`${learningProgress}%`} caption={`${roadmapDone} / ${roadmap.length} steps completed`} icon={<BookOpen size={18} />} color="amber" progress={learningProgress} />
        <StatCard label="Verified skills" value={`${verifiedCount}`} caption={skills.filter((s) => s.verified).map((s) => s.skill_name).join(' · ') || 'None yet'} icon={<ShieldCheck size={18} />} color="coral" />
      </section>
      <div className="dashboard-grid">
        <section className="panel roadmap-panel">
          <div className="panel-header"><div><p className="section-kicker">YOUR NEXT BEST ACTION</p><h2>Learning roadmap</h2></div><button className="text-button" onClick={() => onNavigate('Roadmap')}>View full roadmap <ArrowUpRight size={15} /></button></div>
          <div className="roadmap-summary"><div className="roadmap-progress"><span className="progress-ring"><strong>{learningProgress}</strong><small>%</small></span><div><strong>Power BI sprint</strong><span>Day 7 of 14 · 2 hours left today</span></div></div><div className="streak"><Zap size={15} fill="currentColor" /><strong>4 day streak</strong></div></div>
          <div className="timeline">{roadmap.slice(0, 4).map((item, index) => (
            <div className={`timeline-item ${item.done ? 'done' : index === roadmapDone ? 'current' : ''}`} key={item.id}>
              <div className="timeline-marker">{item.done ? <Check size={13} /> : index === roadmapDone ? <Play size={12} fill="currentColor" /> : <span />}</div>
              <div className="timeline-copy"><div><strong>{item.title}</strong>{index === roadmapDone && <span className="now-tag">UP NEXT</span>}</div><span>{item.day_range} days · {item.meta}</span></div>
              <button className="timeline-action" onClick={() => onToast(item.done ? 'Lesson already completed' : `Opening ${item.title}`)}>{item.done ? 'Review' : 'Start'} <ChevronRight size={15} /></button>
            </div>
          ))}</div>
          <div className="panel-footer"><Lightbulb size={16} /><span>Recommended because Power BI is your highest-impact skill gap.</span><button onClick={() => onNavigate('Skill Map')}>Why this?</button></div>
        </section>
        <section className="panel skill-panel">
          <div className="panel-header"><div><p className="section-kicker">CAREER READINESS</p><h2>Skill gap snapshot</h2></div><button className="icon-button small" onClick={() => onNavigate('Skill Map')}><ArrowUpRight size={16} /></button></div>
          <div className="match-score"><div className="score-circle"><strong>{avgMatch}</strong><span>match</span></div><div><strong>You're close to job-ready</strong><p>Close your top gap to unlock 4 more internships.</p></div></div>
          <div className="skills-list">{skills.slice(0, 4).map((skill) => (
            <div className="skill-row" key={skill.id}><div className="skill-name"><span>{skill.skill_name}</span>{skill.verified && <ShieldCheck size={13} />}</div><div className="bar-track"><div className="bar-current" style={{ width: `${skill.current_level}%`, background: skill.color }} /></div><span className="skill-percent">{skill.current_level}%</span></div>
          ))}</div>
          <button className="soft-button" onClick={() => onNavigate('Skill Map')}>Explore skill map <ArrowUpRight size={15} /></button>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel assessment-card"><div className="assessment-icon"><Trophy size={20} /></div><div className="assessment-copy"><p className="section-kicker">READY TO PROVE IT?</p><h2>Power BI assessment</h2><p>10 questions · 30 minutes · Pass with 7/10 to verify your skill</p></div><button className="primary-button" onClick={() => onNavigate('Assessments')}>Start assessment <ArrowUpRight size={15} /></button></section>
        <section className="panel internship-card"><div className="panel-header"><div><p className="section-kicker">MATCHED FOR YOU</p><h2>Internship opportunities</h2></div><button className="text-button" onClick={() => onNavigate('Internships')}>See all <ArrowUpRight size={15} /></button></div>
          <div className="opportunity"><div className="company-logo teal">N</div><div className="opportunity-info"><strong>Data Analyst Intern</strong><span>Nova Analytics · Hybrid</span></div><b>92% match</b><button className="apply-button" onClick={() => onToast('Application saved to your opportunities')}>Apply</button></div>
          <div className="opportunity"><div className="company-logo dark">A</div><div className="opportunity-info"><strong>Business Analyst Intern</strong><span>Atlas Systems · Remote</span></div><b>86% match</b><button className="apply-button" onClick={() => onToast('Application saved to your opportunities')}>Apply</button></div>
        </section>
      </div>
    </>
  );
}

function TasksView({ onToast }: { onToast: (m: string) => void }) {
  const { tasks, toggleTask, loading } = useStudentData();
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'completed'>('today');

  const todayTasks = tasks.filter((t) => t.category === 'today' && !t.completed);
  const upcomingTasks = tasks.filter((t) => t.category === 'upcoming' && !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const dailyProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const displayTasks = filter === 'today' ? todayTasks : filter === 'upcoming' ? upcomingTasks : completedTasks;

  async function handleToggle(taskId: string, completed: boolean) {
    await toggleTask(taskId, completed);
    onToast(completed ? 'Task marked complete' : 'Task moved back to active');
  }

  if (loading) return <LoadingState />;

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><CheckCircle2 size={15} /> MY TASKS</div><h1>Today's tasks<span className="green-dot">.</span></h1><p className="hero-copy">Auto-generated from your learning roadmap. Complete these to advance your skills.</p></div></section>
      <section className="stats-grid">
        <StatCard label="Tasks completed" value={`${completedCount} / ${totalCount}`} caption={`${dailyProgress}% progress`} icon={<CheckCircle2 size={18} />} color="green" progress={dailyProgress} />
        <StatCard label="Today's tasks" value={`${todayTasks.length}`} caption="Due today" icon={<Clock size={18} />} color="blue" />
        <StatCard label="Upcoming" value={`${upcomingTasks.length}`} caption="This week" icon={<Target size={18} />} color="amber" />
        <StatCard label="Daily progress" value={`${dailyProgress}%`} caption="Keep the streak going" icon={<Zap size={18} />} color="coral" progress={dailyProgress} />
      </section>
      <section className="panel" style={{ padding: 23 }}>
        <div className="task-filter-bar">
          <button className={`task-filter-btn ${filter === 'today' ? 'active' : ''}`} onClick={() => setFilter('today')}>Today ({todayTasks.length})</button>
          <button className={`task-filter-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Upcoming ({upcomingTasks.length})</button>
          <button className={`task-filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed ({completedTasks.length})</button>
        </div>
        <div className="task-list">
          {displayTasks.length === 0 && (
            <div className="task-empty">
              <CheckCircle2 size={28} />
              <p>No {filter} tasks. {filter === 'today' ? "Great job — you're all caught up!" : ''}</p>
            </div>
          )}
          {displayTasks.map((task) => (
            <div className={`task-row ${task.completed ? 'task-done' : ''}`} key={task.id}>
              <button className="task-check" onClick={() => handleToggle(task.id, !task.completed)}>
                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="task-info">
                <strong>{task.title}</strong>
                <div className="task-meta">
                  <span><Clock size={12} /> {task.estimated_time}</span>
                  <span className={`task-due ${task.due_date === 'Today' ? 'task-due-today' : ''}`}>{task.due_date}</span>
                  {task.skill_name && <span className="task-skill-tag">{task.skill_name}</span>}
                  <span className={`task-type-badge task-type-${task.task_type}`}>{task.task_type}</span>
                </div>
              </div>
              {!task.completed && (
                <button className="primary-button task-start-btn" onClick={() => onToast(`Starting: ${task.title}`)}>Start</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SkillMapView({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { skills } = useStudentData();
  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><Radar size={15} /> SKILL INTELLIGENCE</div><h1>Your skill map<span className="green-dot">.</span></h1><p className="hero-copy">See what you know, what the industry needs, and your next highest-impact move.</p></div><button className="primary-button" onClick={() => onNavigate('Roadmap')}><Sparkles size={16} /> Build my roadmap</button></section>
      <div className="skill-map-layout">
        <section className="panel skill-detail-panel"><div className="panel-header"><div><p className="section-kicker">DATA ANALYST · ENTRY LEVEL</p><h2>Industry skill comparison</h2></div><span className="date-chip">Updated today</span></div>
          {skills.map((skill) => (
            <div className="comparison-row" key={skill.id}><div className="comparison-head"><strong>{skill.skill_name}</strong>{skill.verified ? <span className="verified-label"><ShieldCheck size={13} /> Verified</span> : skill.current_level < skill.target_level ? <span className="gap-label">Focus area</span> : null}</div><div className="comparison-bars"><span className="your-bar" style={{ width: `${skill.current_level}%`, background: skill.color }} /><span className="target-marker" style={{ left: `${skill.target_level}%` }} /></div><div className="comparison-numbers"><span>Your level <b>{skill.current_level}%</b></span><span>Industry target <b>{skill.target_level}%</b></span></div></div>
          ))}
        </section>
        <aside className="panel insight-panel"><div className="insight-orb"><Sparkles size={18} /></div><p className="section-kicker">AI INSIGHT</p><h2>Focus on Power BI next</h2><p>Raising Power BI from 40% to 80% could improve your match score by up to 12 points.</p><div className="impact-row"><span>Potential impact</span><strong>+12%</strong></div><button className="primary-button full" onClick={() => onNavigate('Roadmap')}>See recommended plan <ArrowUpRight size={15} /></button></aside>
      </div>
    </>
  );
}

function RoadmapView() {
  const { roadmap, completeRoadmapStep, loading } = useStudentData();
  const completed = roadmap.filter((r) => r.done).length;
  const next = roadmap.find((r) => !r.done);

  if (loading) return <LoadingState />;

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><Target size={15} /> PERSONALIZED LEARNING PLAN</div><h1>Your 14-day roadmap<span className="green-dot">.</span></h1><p className="hero-copy">A focused sprint to turn your biggest skill gap into a verified strength.</p></div><div className="roadmap-metric"><strong>{completed * 2} / 14</strong><span>hours completed</span></div></section>
      <section className="panel full-roadmap">
        <div className="roadmap-topline"><div><p className="section-kicker">POWER BI · DATA ANALYST PATH</p><h2>From gap to verified skill</h2></div><div className="roadmap-bar"><span style={{ width: `${roadmap.length > 0 ? (completed / roadmap.length) * 100 : 0}%` }} /></div></div>
        <div className="full-timeline">{roadmap.map((item, index) => (
          <div className={`full-timeline-item ${item.done ? 'complete' : index === completed ? 'active' : ''}`} key={item.id}><div className="step-number">{item.done ? <Check size={14} /> : index + 1}</div><div className="full-step-copy"><div className="step-head"><div><span className="day-label">DAYS {item.day_range}</span><h3>{item.title}</h3></div><span className="type-label">{item.step_type}</span></div><p>{item.meta} · Build a practical project as you learn.</p>
          {item.resources.length > 0 && (
            <div className="roadmap-resources">
              <span className="resources-label"><BookOpen size={13} /> Resources:</span>
              {item.resources.map((res, i) => <span key={i} className="resource-chip">{res}</span>)}
            </div>
          )}
          {!item.done && index === completed && <button className="primary-button" onClick={() => completeRoadmapStep(item.id)}>Mark lesson complete <Check size={15} /></button>}
          </div></div>
        ))}</div>
        <div className="roadmap-note"><Lightbulb size={17} /><span><strong>{next?.title || 'Roadmap complete'}</strong> {next ? 'is your next step. Stay consistent and your skill passport will update automatically.' : 'You have completed this sprint. Time to take your assessment.'}</span></div>
      </section>
    </>
  );
}

function PracticalHubView({ onToast }: { onToast: (m: string) => void }) {
  const { skills } = useStudentData();
  const [activeEnv, setActiveEnv] = useState<string | null>(null);

  const skillGaps = skills.filter((s) => s.current_level < s.target_level).sort((a, b) => (b.target_level - b.current_level) - (a.target_level - a.current_level));

  if (activeEnv) {
    const env = PRACTICAL_ENVIRONMENTS.find((e) => e.key === activeEnv)!;
    return <PracticalEnvironment env={env} onBack={() => setActiveEnv(null)} onToast={onToast} />;
  }

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><Code2 size={15} /> PRACTICAL HUB</div><h1>Hands-on practice environments<span className="green-dot">.</span></h1><p className="hero-copy">Practice with real code execution in isolated Docker containers. Progress from Basic to Intermediate with 10 tasks each for Python and SQL.</p></div></section>
      <section className="panel" style={{ padding: 23, marginBottom: 18 }}>
        <div className="panel-header"><div><p className="section-kicker">RECOMMENDED FOR YOUR SKILL GAPS</p><h2>Based on your profile</h2></div></div>
        <div className="env-recommendation">
          {skillGaps.map((skill) => {
            const hasEnv = PRACTICAL_ENVIRONMENTS.some((e) => e.key === skill.skill_name.toLowerCase().replace(' ', '') || (skill.skill_name === 'SQL' && e.key === 'sql'));
            return (
              <div key={skill.id} className="env-skill-gap">
                <span className="env-skill-name">{skill.skill_name}</span>
                <div className="env-skill-bar"><div className="bar-current" style={{ width: `${skill.current_level}%`, background: skill.color }} /></div>
                <span className="env-skill-level">{skill.current_level}%</span>
                {hasEnv ? <span className="env-available">Environment available</span> : <span className="env-unavailable">Learning resources only</span>}
              </div>
            );
          })}
        </div>
      </section>
      <div className="internship-grid">
        {PRACTICAL_ENVIRONMENTS.map((env) => {
          const completed = env.tasks.filter((t) => localStorage.getItem(`practical-${t.id}-done`) === 'true').length;
          const progressPct = Math.round((completed / env.tasks.length) * 100);
          return (
            <section className="panel internship-detail-card" key={env.key}>
              <div className="internship-detail-head"><div><h3>{env.icon} {env.label}</h3></div><span className="env-status-badge env-status-running">Running</span></div>
              <p className="env-description">{env.description}</p>
              <div className="practical-task-summary">
                <span className="practical-task-count">{env.tasks.length} tasks</span>
                <span className="practical-task-levels">Basic → Intermediate</span>
              </div>
              <div className="practical-env-progress">
                <div className="practical-env-progress-bar"><span style={{ width: `${progressPct}%`, background: env.color }} /></div>
                <span className="practical-env-progress-text">{completed}/{env.tasks.length} completed</span>
              </div>
              <div className="internship-actions"><button className="primary-button" style={{ background: env.color }} onClick={() => setActiveEnv(env.key)}><Terminal size={15} /> Open Environment</button></div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function PracticalEnvironment({ env, onBack, onToast }: { env: PracticalEnvType; onBack: () => void; onToast: (m: string) => void }) {
  const { submitProject } = useStudentData();
  const [activeTaskId, setActiveTaskId] = useState<string>(env.tasks[0].id);
  const [code, setCode] = useState<string>(env.tasks[0].starterCode);
  const [output, setOutput] = useState<string>('');
  const [runError, setRunError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const activeTask = env.tasks.find((t) => t.id === activeTaskId)!;
  const isExecutable = env.key === 'python' || env.key === 'sql';
  const completedCount = completedTaskIds.size;
  const allDone = completedCount === env.tasks.length;

  function selectTask(task: PracticalTask) {
    setActiveTaskId(task.id);
    setCode(task.starterCode);
    setOutput('');
    setRunError(null);
    setHasRun(false);
    setShowHint(false);
    setShowSolution(false);
  }

  async function runCode() {
    if (!isExecutable) return;
    setRunning(true);
    setOutput('');
    setRunError(null);
    try {
      const result = await executePractical(env.key as 'python' | 'sql', code);
      setOutput(result.output || '(no output)');
      if (result.error) setRunError(result.error);
      setHasRun(result.ok);
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'Execution failed.');
      setHasRun(false);
    } finally {
      setRunning(false);
    }
  }

  function resetCode() {
    setCode(activeTask.starterCode);
    setOutput('');
    setRunError(null);
    setHasRun(false);
    setShowHint(false);
    setShowSolution(false);
  }

  function loadSolution() {
    setCode(activeTask.solution);
    setShowSolution(false);
  }

  async function submitSolution() {
    if (!hasRun) {
      onToast('Run your code successfully before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const skillName = env.key === 'python' ? 'Python' : 'SQL';
      await submitProject({
        title: `${activeTask.title} (${activeTask.level})`,
        description: activeTask.description,
        skill_name: skillName,
        environment: env.key,
        status: 'submitted',
        score: null,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem(`practical-${activeTask.id}-done`, 'true');
      setCompletedTaskIds((prev) => new Set(prev).add(activeTask.id));
      const nextTask = env.tasks.find((t) => t.id !== activeTask.id && !completedTaskIds.has(t.id));
      if (nextTask) {
        onToast(`Task completed! Moving to: ${nextTask.title}`);
        selectTask(nextTask);
      } else {
        onToast('All tasks completed! Your skill level has been updated.');
      }
    } catch {
      onToast('Could not submit your solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const done = new Set<string>();
    for (const task of env.tasks) {
      if (localStorage.getItem(`practical-${task.id}-done`) === 'true') done.add(task.id);
    }
    setCompletedTaskIds(done);
  }, [env]);

  return (
    <>
      <section className="hero-row compact">
        <div><div className="eyebrow"><Terminal size={15} /> {env.label.toUpperCase()} ENVIRONMENT</div><h1>{env.label} practical<span className="green-dot">.</span></h1><p className="hero-copy">{completedCount} of {env.tasks.length} tasks completed · {allDone ? 'All done!' : 'Keep practicing'}</p></div>
        <button className="outline-button" onClick={onBack}><ArrowLeft size={16} /> Back to Hub</button>
      </section>
      <div className="practical-env-layout">
        <aside className="practical-task-sidebar">
          <div className="practical-sidebar-header">
            <span className="section-kicker">TASK LIST</span>
            <span className="practical-progress-pill">{completedCount}/{env.tasks.length}</span>
          </div>
          <div className="practical-progress-bar-env"><span style={{ width: `${(completedCount / env.tasks.length) * 100}%`, background: env.color }} /></div>
          <div className="practical-task-nav">
            {env.tasks.map((task, index) => {
              const isDone = completedTaskIds.has(task.id);
              const isActive = task.id === activeTaskId;
              return (
                <button
                  key={task.id}
                  className={`practical-nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  onClick={() => selectTask(task)}
                >
                  <span className="practical-nav-check">
                    {isDone ? <CheckCircle2 size={16} /> : <span className="practical-nav-num">{index + 1}</span>}
                  </span>
                  <div className="practical-nav-info">
                    <strong>{task.title}</strong>
                    <span className={`practical-level-badge practical-level-${task.level.toLowerCase()}`}>{task.level}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        <div className="practical-main-area">
          <div className="practical-task-detail">
            <div className="practical-task-detail-header">
              <div>
                <span className={`practical-level-badge practical-level-${activeTask.level.toLowerCase()}`}>{activeTask.level}</span>
                <h2>{activeTask.title}</h2>
              </div>
              <span className="env-status-badge env-status-running"><span className="env-dot" /> {env.key === 'python' ? 'python:3.12' : 'postgresql:16'}</span>
            </div>
            <p className="practical-task-desc">{activeTask.description}</p>
            <div className="practical-hint-row">
              <button className="practical-hint-btn" onClick={() => setShowHint(!showHint)}>
                <Lightbulb size={14} /> {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              <button className="practical-hint-btn" onClick={() => setShowSolution(!showSolution)}>
                <Eye size={14} /> {showSolution ? 'Hide solution' : 'Show solution'}
              </button>
            </div>
            {showHint && (
              <div className="practical-hint-box">
                <Lightbulb size={15} />
                <p>{activeTask.hint}</p>
              </div>
            )}
            {showSolution && (
              <div className="practical-solution-box">
                <p className="section-kicker">REFERENCE SOLUTION</p>
                <pre>{activeTask.solution}</pre>
                <button className="soft-button" onClick={loadSolution}>Load into editor</button>
              </div>
            )}
            {env.key === 'sql' && env.tables && (
              <div className="sql-tables">
                <p className="section-kicker" style={{ marginTop: 16 }}>SAMPLE DATABASE TABLES</p>
                {env.tables.map((table) => (
                  <div className="sql-table-chip" key={table.name}>
                    <strong>{table.name}</strong>
                    <span>{table.columns.join(', ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="practical-editor-panel">
            <div className="editor-header">
              <div className="editor-tabs"><span className="editor-tab active">{env.key === 'python' ? 'main.py' : 'query.sql'}</span></div>
              <div className="editor-actions">
                <button className="editor-btn" onClick={resetCode} title="Reset"><RotateCcw size={15} /></button>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={14}
            />
            <div className="editor-toolbar">
              <button className="primary-button" onClick={runCode} disabled={running || !isExecutable}>
                {running ? <><Loader2 size={15} className="spin" /> Running...</> : <><Play size={15} /> Run Code</>}
              </button>
              <button className="outline-button" onClick={submitSolution} disabled={!hasRun || submitting}>
                {submitting ? <><Loader2 size={15} className="spin" /> Submitting...</> : <><Check size={15} /> Submit Task</>}
              </button>
            </div>
            {runError && (
              <div className="code-output code-output-error">
                <div className="output-header output-header-error"><AlertCircle size={14} /> Error</div>
                <pre className="output-content">{runError}</pre>
              </div>
            )}
            {output && (
              <div className="code-output">
                <div className="output-header"><Terminal size={14} /> Output</div>
                <pre className="output-content">{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AssessmentsView({ onToast }: { onToast: (m: string) => void }) {
  const { skills, assessments, addAssessment, loading } = useStudentData();
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);

  if (loading) return <LoadingState />;

  if (activeAssessment) {
    return <AssessmentQuiz skillName={activeAssessment} onBack={() => setActiveAssessment(null)} onToast={onToast} onSubmit={addAssessment} />;
  }

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><Trophy size={15} /> ASSESSMENTS & SKILL PASSPORT</div><h1>Prove your skills<span className="green-dot">.</span></h1><p className="hero-copy">Pass an assessment to verify your skills. Verified skills appear on your resume and boost internship matches.</p></div></section>
      <section className="panel" style={{ padding: 23 }}>
        <div className="panel-header"><div><p className="section-kicker">AVAILABLE ASSESSMENTS</p><h2>Test your knowledge</h2></div></div>
        <div className="assessment-list">
          {skills.map((skill) => {
            const hasAssessment = ASSESSMENT_QUESTIONS[skill.skill_name];
            const pastAttempts = assessments.filter((a) => a.skill_name === skill.skill_name);
            const bestScore = pastAttempts.length > 0 ? Math.max(...pastAttempts.map((a) => a.score)) : null;
            return (
              <div className="assessment-row" key={skill.id}>
                <div className="assessment-row-icon" style={{ background: skill.color + '20', color: skill.color }}>
                  <Trophy size={20} />
                </div>
                <div className="assessment-row-info">
                  <strong>{skill.skill_name} Assessment</strong>
                  <span>10 questions · 30 min · Pass mark: 7/10</span>
                </div>
                <div className="assessment-row-status">
                  {skill.verified ? (
                    <span className="status-badge status-placed"><ShieldCheck size={13} /> Verified · {bestScore}/10</span>
                  ) : bestScore !== null ? (
                    <span className="status-badge status-at-risk">Best: {bestScore}/10 · Retake</span>
                  ) : hasAssessment ? (
                    <span className="status-badge status-new">Available</span>
                  ) : (
                    <span className="status-badge status-draft">Coming soon</span>
                  )}
                </div>
                <button className="primary-button assessment-start-btn" disabled={!hasAssessment || skill.verified} onClick={() => setActiveAssessment(skill.skill_name)}>
                  {skill.verified ? 'Verified' : bestScore !== null ? 'Retake' : 'Start'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
      {assessments.length > 0 && (
        <section className="panel" style={{ padding: 23, marginTop: 18 }}>
          <div className="panel-header"><div><p className="section-kicker">ASSESSMENT HISTORY</p><h2>Past attempts</h2></div></div>
          <div className="assessment-history">
            {assessments.map((a) => (
              <div className="assessment-history-row" key={a.id}>
                <strong>{a.skill_name}</strong>
                <span>Score: {a.score}/{a.total_questions}</span>
                <span className={`status-badge ${a.passed ? 'status-placed' : 'status-at-risk'}`}>{a.passed ? 'PASSED' : 'FAILED'}</span>
                <span className="assessment-date">{new Date(a.attempted_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function AssessmentQuiz({ skillName, onBack, onToast, onSubmit }: { skillName: string; onBack: () => void; onToast: (m: string) => void; onSubmit: (r: { skill_name: string; score: number; total_questions: number; pass_mark: number; passed: boolean; attempted_at: string }) => Promise<AssessmentRecord | null> }) {
  const questions = ASSESSMENT_QUESTIONS[skillName] || [];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function selectAnswer(qIndex: number, optIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  async function handleSubmit() {
    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    setScore(correct);
    setSubmitted(true);
    const passed = correct >= 7;
    await onSubmit({
      skill_name: skillName,
      score: correct,
      total_questions: questions.length,
      pass_mark: 7,
      passed,
      attempted_at: new Date().toISOString(),
    });
    onToast(passed ? `Assessment passed! ${skillName} is now verified.` : `Assessment failed. Score: ${correct}/10. Try again!`);
  }

  return (
    <>
      <section className="hero-row compact">
        <div><div className="eyebrow"><Trophy size={15} /> {skillName.toUpperCase()} ASSESSMENT</div><h1>{skillName} assessment<span className="green-dot">.</span></h1><p className="hero-copy">10 questions · Pass with 7/10 to verify your skill.</p></div>
        <button className="outline-button" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      </section>
      {submitted ? (
        <section className="panel" style={{ padding: 30, textAlign: 'center' }}>
          <div className={`assessment-result ${score >= 7 ? 'passed' : 'failed'}`}>
            <div className="assessment-result-icon">{score >= 7 ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}</div>
            <h2>{score >= 7 ? 'PASSED' : 'FAILED'}</h2>
            <p className="assessment-score">Score: {score} / {questions.length}</p>
            <p className="assessment-pass-mark">Pass mark: 7/10</p>
            {score >= 7 ? <p className="assessment-success-msg"><ShieldCheck size={16} /> {skillName} is now a verified skill on your profile!</p> : <p className="assessment-fail-msg">Review the material and try again.</p>}
            <button className="primary-button" onClick={onBack}>Back to assessments</button>
          </div>
        </section>
      ) : (
        <section className="panel" style={{ padding: 23 }}>
          <div className="quiz-list">
            {questions.map((q, qIndex) => (
              <div className="quiz-question" key={qIndex}>
                <h3>{qIndex + 1}. {q.question}</h3>
                <div className="quiz-options">
                  {q.options.map((opt, optIndex) => (
                    <button
                      key={optIndex}
                      className={`quiz-option ${answers[qIndex] === optIndex ? 'selected' : ''}`}
                      onClick={() => selectAnswer(qIndex, optIndex)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="quiz-submit-bar">
            <span className="quiz-progress">{Object.keys(answers).length} / {questions.length} answered</span>
            <button className="primary-button" onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
              Submit Assessment
            </button>
          </div>
        </section>
      )}
    </>
  );
}

function InternshipsView({ onToast }: { onToast: (m: string) => void }) {
  const { skills, internships, applications, applyToInternship, loading } = useStudentData();

  if (loading) return <LoadingState />;

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><BriefcaseBusiness size={15} /> INTERNSHIP MATCHING</div><h1>Matched internships<span className="green-dot">.</span></h1><p className="hero-copy">Match scores are calculated from your verified skills and current skill levels.</p></div></section>
      <div className="internship-grid">
        {internships.map((job) => {
          const match = calculateMatch(skills, job.required_skills);
          const applied = applications.some((a) => a.internship_id === job.id);
          return (
            <section className="panel internship-detail-card" key={job.id}>
              <div className="internship-detail-head"><div><h3>{job.title}</h3><span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span></div></div>
              <div className="internship-meta"><span>{job.company_name}</span><span>· {job.location}</span><span>· {job.duration}</span></div>
              <div className="internship-skills-required">
                {job.required_skills.map((req) => {
                  const skill = skills.find((s) => s.skill_name === req.name);
                  const current = skill ? skill.current_level : 0;
                  const meets = current >= req.level;
                  return (
                    <div key={req.name} className="internship-skill-req">
                      <span>{req.name}</span>
                      <div className="req-bar"><div className="req-bar-fill" style={{ width: `${current}%`, background: meets ? '#17a673' : '#f0ad2e' }} /></div>
                      <span className="req-level">Need {req.level}% · You {current}%{skill?.verified && ' ✓'}</span>
                    </div>
                  );
                })}
              </div>
              <div className="internship-match-info"><div><strong style={{ color: match >= 80 ? '#17a673' : match >= 60 ? '#f0ad2e' : '#dd7c61' }}>{match}%</strong><span>match score</span></div><div><strong>{job.applicants_count}</strong><span>applicants</span></div></div>
              <div className="internship-actions">
                {applied ? (
                  <button className="outline-button" disabled><Check size={15} /> Applied</button>
                ) : (
                  <button className="primary-button" onClick={() => { applyToInternship(job.id, match); onToast(`Applied to ${job.title} at ${job.company_name}!`); }}>Apply Now</button>
                )}
                <button className="outline-button" onClick={() => onToast(`Viewing details for ${job.title}`)}><Eye size={15} /> Details</button>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function ResumeView({ onToast }: { onToast: (m: string) => void }) {
  const { skills, projects, assessments } = useStudentData();
  const { profile } = useAuth();
  const verifiedSkills = skills.filter((s) => s.verified);
  const unverifiedSkills = skills.filter((s) => !s.verified);
  const gradedProjects = projects.filter((p) => p.status === 'graded' || p.status === 'submitted');

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><FileText size={15} /> ATS RESUME BUILDER</div><h1>Your auto-generated resume<span className="green-dot">.</span></h1><p className="hero-copy">Automatically built from your profile, verified skills, and projects. Updates in real-time.</p></div><button className="outline-button" onClick={() => onToast('Resume downloaded as PDF (demo)')}><Download size={16} /> Download PDF</button></section>
      <div className="resume-document">
        <div className="resume-header">
          <h1>{profile?.full_name}</h1>
          <p>Aspiring Data Analyst · {profile?.phone}</p>
        </div>
        <div className="resume-section">
          <h2>Verified Skills</h2>
          <div className="resume-skills">
            {verifiedSkills.length === 0 && <p className="resume-empty">No verified skills yet. Pass an assessment to verify a skill.</p>}
            {verifiedSkills.map((skill) => (
              <div className="resume-skill-item" key={skill.id}>
                <ShieldCheck size={16} />
                <div>
                  <strong>{skill.skill_name}</strong>
                  <span>Score: {skill.verified_score}/10 · Verified through {skill.verified_through}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {unverifiedSkills.length > 0 && (
          <div className="resume-section">
            <h2>Other Skills (In Progress)</h2>
            <div className="resume-skills">
              {unverifiedSkills.map((skill) => (
                <div className="resume-skill-item unverified" key={skill.id}>
                  <div>
                    <strong>{skill.skill_name}</strong>
                    <span>Current level: {skill.current_level}% · Target: {skill.target_level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {gradedProjects.length > 0 && (
          <div className="resume-section">
            <h2>Projects</h2>
            {gradedProjects.map((proj) => (
              <div className="resume-project-item" key={proj.id}>
                <strong>{proj.title}</strong>
                <p>{proj.description}</p>
                {proj.score && <span className="resume-project-score">Score: {proj.score}/100</span>}
              </div>
            ))}
          </div>
        )}
        {assessments.length > 0 && (
          <div className="resume-section">
            <h2>Assessment Results</h2>
            {assessments.map((a) => (
              <div className="resume-assessment-item" key={a.id}>
                <strong>{a.skill_name}</strong>
                <span>Score: {a.score}/{a.total_questions} · {a.passed ? 'PASSED' : 'FAILED'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ProgressView() {
  const { skills, tasks, assessments, projects, roadmap } = useStudentData();
  const verifiedCount = skills.filter((s) => s.verified).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const roadmapDone = roadmap.filter((r) => r.done).length;
  const learningProgress = roadmap.length > 0 ? Math.round((roadmapDone / roadmap.length) * 100) : 0;
  const avgAssessment = assessments.length > 0 ? Math.round((assessments.reduce((acc, a) => acc + (a.score / a.total_questions) * 100, 0) / assessments.length)) : 0;
  const avgMatch = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + Math.min(s.current_level / s.target_level, 1), 0) / skills.length * 100) : 0;
  const internshipReadiness = Math.round((avgMatch * 0.4 + (verifiedCount / skills.length) * 100 * 0.3 + avgAssessment * 0.3));

  return (
    <>
      <section className="hero-row compact"><div><div className="eyebrow"><TrendingUp size={15} /> CAREER READINESS</div><h1>Your progress<span className="green-dot">.</span></h1><p className="hero-copy">Track your journey from skill gaps to verified skills to internship-ready.</p></div></section>
      <section className="stats-grid">
        <StatCard label="Skill Match" value={`${avgMatch}%`} caption="Industry alignment" icon={<Radar size={18} />} color="green" progress={avgMatch} />
        <StatCard label="Learning Progress" value={`${learningProgress}%`} caption={`${roadmapDone}/${roadmap.length} roadmap steps`} icon={<BookOpen size={18} />} color="amber" progress={learningProgress} />
        <StatCard label="Tasks Completed" value={`${completedTasks}/${totalTasks}`} caption="Total tasks" icon={<CheckCircle2 size={18} />} color="blue" progress={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} />
        <StatCard label="Verified Skills" value={`${verifiedCount}`} caption={skills.filter((s) => s.verified).map((s) => s.skill_name).join(', ') || 'None yet'} icon={<ShieldCheck size={18} />} color="coral" />
      </section>
      <section className="stats-grid">
        <StatCard label="Assessment Average" value={`${avgAssessment}%`} caption={`${assessments.length} attempts`} icon={<Trophy size={18} />} color="green" progress={avgAssessment} />
        <StatCard label="Projects Submitted" value={`${projects.length}`} caption={projects.filter((p) => p.status === 'graded').length + ' graded'} icon={<Code2 size={18} />} color="blue" />
        <StatCard label="Internship Readiness" value={`${internshipReadiness}%`} caption="Composite score" icon={<Target size={18} />} color="amber" progress={internshipReadiness} />
        <StatCard label="Profile Completion" value="85%" caption="3 fields remaining" icon={<UserRound size={18} />} color="coral" progress={85} />
      </section>
      <section className="panel" style={{ padding: 23, marginTop: 18 }}>
        <div className="panel-header"><div><p className="section-kicker">SKILL BREAKDOWN</p><h2>Detailed skill levels</h2></div></div>
        <div className="branch-bars">
          {skills.map((skill) => (
            <div className="branch-row" key={skill.id}>
              <span>{skill.skill_name}{skill.verified && <ShieldCheck size={13} style={{ display: 'inline', marginLeft: 4 }} />}</span>
              <div className="bar-track"><div className="bar-current" style={{ width: `${skill.current_level}%`, background: skill.color }} /></div>
              <strong>{skill.current_level}%</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Assistant({ onClose }: { onClose: () => void }) {
  const { skills, tasks, roadmap } = useStudentData();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: getAssistantGreeting(skills, tasks, roadmap) },
  ]);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      const response = getAssistantResponse(userMsg, skills, tasks, roadmap);
      setMessages((m) => [...m, { role: 'ai', text: response }]);
    }, 800);
  }

  return (
    <div className="assistant-card">
      <div className="assistant-head">
        <div className="assistant-title">
          <div className="assistant-icon"><Sparkles size={16} /></div>
          <div><strong>Career AI</strong><span>Online · knows your goals</span></div>
        </div>
        <button className="icon-button small" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="assistant-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`assistant-msg ${msg.role}`}>
            {msg.role === 'ai' && <span className="assistant-bubble"><Sparkles size={14} /></span>}
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="assistant-prompts">
        <button onClick={() => { setInput('What should I do today?'); }}>What should I do today?</button>
        <button onClick={() => { setInput('Explain my skill gap'); }}>Explain my skill gap</button>
        <button onClick={() => { setInput('I do not have much time today'); }}>I don't have much time today</button>
      </div>
      <div className="assistant-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask anything..." />
        <button onClick={handleSend}><Send size={15} /></button>
      </div>
    </div>
  );
}

function getAssistantGreeting(skills: { skill_name: string; current_level: number; target_level: number; verified: boolean }[], tasks: { title: string; completed: boolean; category: string }[], roadmap: { title: string; done: boolean }[]): string {
  const gap = skills.find((s) => s.current_level < s.target_level);
  const todayTasks = tasks.filter((t) => t.category === 'today' && !t.completed);
  if (gap && todayTasks.length > 0) {
    return `Hi. Your fastest path to a stronger match is ${gap.skill_name}. You have ${todayTasks.length} tasks due today. Want me to walk you through today's plan?`;
  }
  return 'Hi. Your career profile is looking good. Ask me anything about your skills, tasks, or next steps.';
}

function getAssistantResponse(query: string, skills: { skill_name: string; current_level: number; target_level: number; verified: boolean }[], tasks: { title: string; completed: boolean; category: string; estimated_time: string; skill_name: string | null; task_type: string }[], roadmap: { title: string; done: boolean }[]): string {
  const lower = query.toLowerCase();
  const todayTasks = tasks.filter((t) => t.category === 'today' && !t.completed);
  const gap = skills.find((s) => s.current_level < s.target_level);

  if (lower.includes('today') || lower.includes('do today') || lower.includes('what should')) {
    if (todayTasks.length === 0) return 'You have no pending tasks for today. Great job staying ahead!';
    const list = todayTasks.map((t, i) => `${i + 1}. ${t.title} — ${t.estimated_time}`).join('\n');
    const totalTime = todayTasks.reduce((acc, t) => {
      const match = t.estimated_time.match(/(\d+)\s*(hour|minute)/);
      return acc + (match ? (match[2] === 'hour' ? parseInt(match[1]) * 60 : parseInt(match[1])) : 0);
    }, 0);
    return `Today you have ${todayTasks.length} priority tasks:\n\n${list}\n\nTotal estimated time: ${Math.floor(totalTime / 60)} hours ${totalTime % 60} minutes.`;
  }

  if (lower.includes('skill gap') || lower.includes('gap') || lower.includes('explain')) {
    if (!gap) return 'You have no skill gaps. All your skills meet or exceed the industry target!';
    return `Your biggest skill gap is ${gap.skill_name}: you're at ${gap.current_level}% but the industry target is ${gap.target_level}%. Closing this gap could improve your match score by up to 12 points. I recommend focusing on your Power BI roadmap.`;
  }

  if (lower.includes('no time') || lower.includes('dont have') || lower.includes("don't have") || lower.includes('less time') || lower.includes('short')) {
    const practiceTask = todayTasks.find((t) => t.task_type === 'practice') || todayTasks[0];
    if (practiceTask) {
      return `Prioritize "${practiceTask.title}" first because ${practiceTask.skill_name || 'it'} is a high-priority skill gap. It takes ${practiceTask.estimated_time}. You can do the rest tomorrow.`;
    }
    return 'No tasks to prioritize. Take a breather and come back tomorrow!';
  }

  return 'I can help you plan your day, explain skill gaps, or recommend what to learn next. Try asking "What should I do today?" or "Explain my skill gap".';
}

function StatCard({ label, value, caption, icon, color, progress }: { label: string; value: string; caption: string; icon: React.ReactNode; color: string; progress?: number }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-caption">{caption}</div>{progress !== undefined && <div className="stat-progress"><span style={{ width: `${progress}%` }} /></div>}</div>;
}

function LoadingState() {
  return <div className="auth-loading" style={{ minHeight: 300 }}><Loader2 size={28} className="spin" /></div>;
}

function ArrowLeft({ size }: { size: number }) {
  return <ChevronRight size={size} style={{ transform: 'rotate(180deg)' }} />;
}
