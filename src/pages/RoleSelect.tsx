import { useState } from 'react';
import {
  GraduationCap, Building2, School, ArrowRight, Sparkles,
  Phone, ShieldCheck, Loader2, Zap, ChevronRight, Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

/* ─── Role configuration ─────────────────────────────────────────── */
const ROLES: {
  key: UserRole;
  label: string;
  hint: string;
  icon: typeof GraduationCap;
  color: string;
}[] = [
  { key: 'student',  label: 'Student',  hint: 'Skill gap, roadmap, labs, assessments, resume, placements', icon: GraduationCap, color: '#1b9e6e' },
  { key: 'company',  label: 'Company',  hint: 'Internship listings, student search, verified credentials',  icon: Building2,    color: '#3b82c4' },
  { key: 'college',  label: 'College',  hint: 'Student progress, skill analytics, placement tracking',      icon: School,       color: '#d97706' },
];

type Step = 'home' | 'phone' | 'otp';

/* ─── Component ──────────────────────────────────────────────────── */
export default function RoleSelect() {
  const { selectRole, sendOtp, verifyOtp, loginDemo, error, clearError } = useAuth();

  // ── Normal-login state ────────────────────────────────────────────
  const [step, setStep]               = useState<Step>('home');
  const [pickedRole, setPickedRole]   = useState<UserRole | null>(null);
  const [phone, setPhone]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [sending, setSending]         = useState(false);
  const [verifying, setVerifying]     = useState(false);

  // ── Demo state (completely isolated) ─────────────────────────────
  const [demoRole, setDemoRole]       = useState<UserRole | null>(null); // tracks which btn is loading

  /* Normal-login handlers */
  function pickRole(role: UserRole) {
    setPickedRole(role);
    selectRole(role);
    clearError();
    setPhone('');
    setOtp('');
    setStep('phone');
  }

  async function handleSendOtp() {
    if (!phone.trim()) return;
    setSending(true);
    try {
      await sendOtp(phone);
      setStep('otp');
    } catch { /* error surfaced via context */ }
    finally   { setSending(false); }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) return;
    setVerifying(true);
    try   { await verifyOtp(phone, otp); }
    catch { /* error surfaced via context */ }
    finally { setVerifying(false); }
  }

  /* ── DEMO bypass handler — completely separate path ─────────────── */
  async function handleDemoLogin(role: UserRole) {
    setDemoRole(role);
    try   { await loginDemo(role); }
    catch { /* loginDemo sets error in context on failure */ }
    finally { setDemoRole(null); }
  }

  /* helpers */
  const pickedColor = pickedRole ? ROLES.find(r => r.key === pickedRole)!.color : '#1b9e6e';
  function back() { setStep('home'); clearError(); setPhone(''); setOtp(''); }

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="ls-wrap">
      <div className="ls-bg" />

      <div className="ls-card">

        {/* ── Brand ────────────────────────────────────────────────── */}
        <div className="ls-brand">
          <div className="ls-brand-icon"><GraduationCap size={20} /></div>
          Academia<span className="ls-brand-em">—</span>Industry
        </div>

        {/* ════════════════════════════════════════════════════════════
            STEP: home
        ════════════════════════════════════════════════════════════ */}
        {step === 'home' && (
          <>
            <div className="ls-hero">
              <div className="ls-eyebrow"><Sparkles size={12} /> PRODUCTION SaaS · V1.0</div>
              <h1>Bridging classrooms<br />and careers<span className="ls-dot">.</span></h1>
              <p>Choose your role to sign in with your mobile number, or use Demo Mode to explore without an account.</p>
            </div>

            {/* ── Normal login role cards ───────────────────────────── */}
            <div className="ls-section-label">Sign in to your account</div>
            <div className="ls-role-grid">
              {ROLES.map(({ key, label, hint, icon: Icon, color }) => (
                <button
                  key={key}
                  className="ls-role-btn"
                  style={{ '--rc': color } as React.CSSProperties}
                  onClick={() => pickRole(key)}
                >
                  <div className="ls-role-ico" style={{ background: color + '1a', color }}>
                    <Icon size={22} />
                  </div>
                  <div className="ls-role-text">
                    <strong>{label}</strong>
                    <span>{hint}</span>
                  </div>
                  <ChevronRight size={16} className="ls-role-arrow" />
                </button>
              ))}
            </div>

            {/* ── DEMO MODE — visually separated, clearly labelled ─── */}
            <div className="ls-demo-zone">
              <div className="ls-demo-header">
                <div className="ls-demo-badge">
                  <Zap size={12} />
                  DEMO MODE
                </div>
                <p>
                  For judges and evaluators only · No phone number or OTP required ·
                  <Lock size={11} style={{ display:'inline', marginLeft:4, verticalAlign:'middle' }} />
                  &nbsp;Isolated from real accounts
                </p>
              </div>

              <div className="ls-demo-btns">
                {ROLES.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    className="ls-demo-btn"
                    style={{ '--dc': color } as React.CSSProperties}
                    onClick={() => handleDemoLogin(key)}
                    disabled={demoRole !== null}
                    aria-label={`Login as Demo ${label}`}
                  >
                    {demoRole === key
                      ? <Loader2 size={16} className="spin" style={{ color }} />
                      : <div className="ls-demo-btn-ico" style={{ background: color + '1a', color }}><Icon size={16} /></div>
                    }
                    <div className="ls-demo-btn-text">
                      <strong>Demo {label}</strong>
                      <span>1-click · no OTP</span>
                    </div>
                    <ArrowRight size={14} style={{ color, marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>

              <div className="ls-demo-note">
                Demo Student covers: Dashboard → Skill Gap → AI Roadmap → Tasks → SQL Lab → Python Lab → Assessment → Verified Skills → ATS Resume → Internships
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════
            STEP: phone
        ════════════════════════════════════════════════════════════ */}
        {step === 'phone' && pickedRole && (
          <div className="ls-auth-step">
            <button className="ls-back" onClick={back}>← Back</button>

            <div className="ls-auth-icon" style={{ background: pickedColor }}>
              {pickedRole === 'student' && <GraduationCap size={22} />}
              {pickedRole === 'company' && <Building2     size={22} />}
              {pickedRole === 'college' && <School        size={22} />}
            </div>

            <h2>Enter your mobile number</h2>
            <p>
              Signing in as&nbsp;
              <strong style={{ color: pickedColor }}>
                {ROLES.find(r => r.key === pickedRole)!.label}
              </strong>
              &nbsp;— we'll send a 6-digit OTP.
            </p>

            <div className="ls-field">
              <label>Mobile Number</label>
              <div className="ls-input" style={{ '--fc': pickedColor } as React.CSSProperties}>
                <Phone size={15} />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); clearError(); }}
                  placeholder="+91 XXXXX XXXXX"
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  autoFocus
                />
              </div>
            </div>

            {error && <div className="ls-error">{error}</div>}

            <button
              className="ls-submit"
              style={{ background: pickedColor }}
              onClick={handleSendOtp}
              disabled={sending || !phone.trim()}
            >
              {sending
                ? <><Loader2 size={16} className="spin" /> Sending…</>
                : <><ShieldCheck size={16} /> Send OTP</>}
            </button>

            <div className="ls-auth-note">Real OTP authentication · +91 numbers only</div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            STEP: otp
        ════════════════════════════════════════════════════════════ */}
        {step === 'otp' && (
          <div className="ls-auth-step">
            <button className="ls-back" onClick={() => { setStep('phone'); clearError(); setOtp(''); }}>
              ← Change number
            </button>

            <div className="ls-auth-icon" style={{ background: pickedColor }}>
              <ShieldCheck size={22} />
            </div>

            <h2>Enter 6-digit OTP</h2>
            <p>OTP sent to <strong>{phone}</strong></p>

            <div className="ls-field">
              <label>Verification Code</label>
              <input
                className="ls-otp-field"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); clearError(); }}
                placeholder="••••••"
                onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                autoFocus
                style={{ borderColor: otp.length === 6 ? pickedColor : undefined }}
              />
            </div>

            {error && <div className="ls-error">{error}</div>}

            <button
              className="ls-submit"
              style={{ background: pickedColor }}
              onClick={handleVerifyOtp}
              disabled={verifying || otp.length < 6}
            >
              {verifying
                ? <><Loader2 size={16} className="spin" /> Verifying…</>
                : <><ShieldCheck size={16} /> Verify & Continue</>}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
