import { useState } from 'react';
import { GraduationCap, Building2, School, ArrowRight, ArrowLeft, Sparkles, Phone, ShieldCheck, Loader2, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

const roles: { key: UserRole; label: string; description: string; icon: typeof GraduationCap; color: string; demoPhone: string }[] = [
  { key: 'student', label: 'Student', description: 'Build skills, get matched to internships, track your career readiness', icon: GraduationCap, color: '#1b9e6e', demoPhone: '+91 98765 43210' },
  { key: 'company', label: 'Company', description: 'Hire from a verified talent pool, manage internships, track applicants', icon: Building2, color: '#3b82c4', demoPhone: '+91 98765 11111' },
  { key: 'college', label: 'College', description: 'Track student readiness, placements, and export outcome reports', icon: School, color: '#d97706', demoPhone: '+91 98765 22222' },
];

type Step = 'role' | 'phone' | 'otp';

export default function RoleSelect() {
  const { selectRole, sendOtp, verifyOtp, loginDemo, pendingRole, otpSent, demoOtp, error, clearError } = useAuth();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  function handleRolePick(role: UserRole) {
    setSelectedRole(role);
    selectRole(role);
    setStep('phone');
  }

  async function handleSendOtp() {
    if (!phone.trim()) return;
    setSending(true);
    try {
      await sendOtp(phone);
      setStep('otp');
    } catch {
      // error is set in context
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) return;
    setVerifying(true);
    try {
      await verifyOtp(phone, otp);
    } catch {
      // error is surfaced via context state
    } finally {
      setVerifying(false);
    }
  }

  async function handleDemoLogin(role: UserRole) {
    setDemoLoading(true);
    try {
      await loginDemo(role);
    } catch {
      // ignore
    } finally {
      setDemoLoading(false);
    }
  }

  const roleColor = selectedRole ? roles.find((r) => r.key === selectedRole)?.color : '#1b9e6e';

  return (
    <div className="role-select-page">
      <div className="role-select-bg" />
      <div className="role-select-content">
        <div className="role-select-brand">
          <div className="role-select-brand-mark"><GraduationCap size={24} /></div>
          <span>Academia<span className="role-select-dash">—</span>Industry</span>
        </div>

        {step === 'role' && (
          <>
            <div className="role-select-hero">
              <div className="role-select-eyebrow"><Sparkles size={14} /> INTERACTIVE PROTOTYPE</div>
              <h1>Bridging classrooms and careers<span className="green-dot">.</span></h1>
              <p>One platform where students build job-ready skills, companies hire verified talent, and colleges track outcomes. Choose a role to begin.</p>
            </div>
            <div className="role-cards-large">
              {roles.map(({ key, label, description, icon: Icon, color }) => (
                <button
                  key={key}
                  className="role-card-large"
                  style={{ borderColor: '#e1eae6' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 12px 30px ${color}25`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e1eae6'; e.currentTarget.style.boxShadow = '0 4px 14px #133c3208'; }}
                  onClick={() => handleRolePick(key)}
                >
                  <div className="role-card-large-icon" style={{ background: '#f4f7f6', color }}>
                    <Icon size={26} />
                  </div>
                  <strong>{label}</strong>
                  <span>{description}</span>
                  <div className="role-card-large-cta" style={{ color }}>
                    Enter dashboard <ArrowRight size={15} />
                  </div>
                  <div className="role-card-large-stripe" style={{ background: color, opacity: 0 }} />
                </button>
              ))}
            </div>
            <div className="demo-login-section">
              <div className="demo-login-label"><Zap size={14} /> Quick demo access — no OTP needed</div>
              <div className="demo-login-buttons">
                {roles.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    className="demo-login-btn"
                    style={{ borderColor: color, color }}
                    onClick={() => handleDemoLogin(key)}
                    disabled={demoLoading}
                  >
                    <Icon size={16} /> Demo {label}
                    {demoLoading && <Loader2 size={14} className="spin" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="role-select-footer">Demo OTP is <strong>123456</strong> for any phone number</div>
          </>
        )}

        {step === 'phone' && (
          <div className="auth-form-card">
            <button className="back-link" onClick={() => { setStep('role'); clearError(); setPhone(''); }}>
              <ArrowLeft size={16} /> Back to role selection
            </button>
            <div className="auth-form-head">
              <div className="auth-form-icon" style={{ background: roleColor }}>
                {selectedRole === 'student' && <GraduationCap size={24} />}
                {selectedRole === 'company' && <Building2 size={24} />}
                {selectedRole === 'college' && <School size={24} />}
              </div>
              <h2>Enter your mobile number</h2>
              <p>You selected: <strong style={{ color: roleColor }}>{roles.find((r) => r.key === selectedRole)?.label}</strong> — we'll send a 6-digit OTP to verify your number.</p>
            </div>
            <div className="auth-form-field">
              <label>Mobile Number</label>
              <div className="auth-input-wrap">
                <Phone size={16} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError(); }}
                  placeholder="+91 XXXXX XXXXX"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                />
              </div>
            </div>
            {error && <div className="auth-error-msg">{error}</div>}
            <button className="auth-submit-btn" style={{ background: roleColor }} onClick={handleSendOtp} disabled={sending}>
              {sending ? <Loader2 size={18} className="spin" /> : <><ShieldCheck size={18} /> Send OTP</>}
            </button>
            <div className="auth-form-hint">
              Demo mode: any +91 number works. Use OTP <strong>123456</strong>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="auth-form-card">
            <button className="back-link" onClick={() => { setStep('phone'); clearError(); setOtp(''); }}>
              <ArrowLeft size={16} /> Change number
            </button>
            <div className="auth-form-head">
              <div className="auth-form-icon" style={{ background: roleColor }}>
                <ShieldCheck size={24} />
              </div>
              <h2>Enter 6-digit OTP</h2>
              <p>OTP sent to <strong>{phone}</strong>. Enter the code below to verify and continue.</p>
            </div>
            <div className="auth-form-field">
              <label>Verification Code</label>
              <div className="auth-otp-input">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); clearError(); }}
                  placeholder="••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                  autoFocus
                />
              </div>
            </div>
            {demoOtp && (
              <div className="auth-demo-otp-hint">
                <Zap size={14} /> Demo OTP: <strong>{demoOtp}</strong>
              </div>
            )}
            {error && <div className="auth-error-msg">{error}</div>}
            <button className="auth-submit-btn" style={{ background: roleColor }} onClick={handleVerifyOtp} disabled={verifying || otp.length < 6}>
              {verifying ? <Loader2 size={18} className="spin" /> : <><ShieldCheck size={18} /> Verify & Continue</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
