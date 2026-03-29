import React from 'react';

/* ─── Particle Burst (Enhancement 3) ─── */
export function emitParticles(e: React.MouseEvent, isDeselecting: boolean = false) {
  const x = e.clientX;
  const y = e.clientY;
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5);
    const dist = 20 + Math.random() * 20;
    const color = isDeselecting
      ? 'rgba(255,100,100,0.7)'
      : Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : '#6db88a';
    Object.assign(p.style, {
      position: 'fixed', left: `${x}px`, top: `${y}px`,
      width: '4px', height: '4px', borderRadius: '50%',
      backgroundColor: color, pointerEvents: 'none',
      zIndex: '10000', transition: 'all 400ms ease-out', opacity: '1',
    });
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 450);
  }
}

/* ─── Encouragement Messages (Enhancement 4) ─── */
export function getSubjectEncouragement(count: number) {
  if (count === 0) return { text: 'Select the subjects that shaped you', color: 'rgba(255,255,255,0.35)' };
  if (count <= 2) return { text: 'Keep going — more selections = better recommendations', color: 'rgba(255,255,255,0.5)' };
  if (count <= 5) return { text: 'Good start! Your profile is taking shape 🎯', color: '#5aaa78' };
  if (count <= 9) return { text: "Great selection! You're giving us a lot to work with ✨", color: '#5aaa78' };
  return { text: "Impressive depth! We'll find some excellent matches 🚀", color: '#6db88a' };
}

export function getSkillEncouragement(count: number) {
  return getSubjectEncouragement(count);
}

export function getInterestEncouragement(count: number) {
  if (count === 0) return { text: 'What areas excite you most?', color: 'rgba(255,255,255,0.35)' };
  if (count <= 2) return { text: 'Pick a few more for a fuller picture', color: 'rgba(255,255,255,0.5)' };
  if (count <= 4) return { text: 'Nice mix of interests! 🎯', color: '#5aaa78' };
  return { text: "You're well-rounded — great for career matching ✨", color: '#5aaa78' };
}

/* ─── Thinking Overlay (Enhancement 1) ─── */
const thinkingMessages = ['Mapping your profile...', 'Analyzing your inputs...', 'Calibrating recommendations...'];

export function ThinkingOverlay({ visible, msgIdx }: { visible: boolean; msgIdx: number }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'ca-fadeIn 150ms ease',
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: 'radial-gradient(circle, #6db88a, #4a9060)',
        animation: 'ca-orbPulse 700ms ease-in-out infinite',
      }} />
      <p style={{
        marginTop: 24, fontFamily: "'Syne', sans-serif",
        color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem',
        animation: 'ca-fadeIn 200ms ease',
      }}>
        {thinkingMessages[msgIdx % thinkingMessages.length]}
      </p>
    </div>
  );
}

/* ─── Live Profile Card (Enhancement 2) ─── */
const eduLabels: Record<string, string> = {
  'high-school': 'High School', 'associate': 'Associate', 'bachelor': "Bachelor's",
  'master': "Master's", 'phd': 'PhD', 'bootcamp': 'Bootcamp', 'other': 'Other',
};

export function LiveProfileCard({ formData }: {
  formData: { name: string; education: string; skills: string[]; interests: string[] }
}) {
  const rows = [
    { label: 'Name', val: formData.name || null, display: formData.name },
    { label: 'Education', val: formData.education || null, display: eduLabels[formData.education] || null },
    { label: 'Skills', val: formData.skills.length > 0 ? true : null, display: `${formData.skills.length} skill${formData.skills.length !== 1 ? 's' : ''}` },
    { label: 'Interests', val: formData.interests.length > 0 ? true : null, display: `${formData.interests.length} interest${formData.interests.length !== 1 ? 's' : ''}` },
  ];
  return (
    <div style={{
      position: 'fixed', right: 32, top: '50%', transform: 'translateY(-50%)',
      width: 200, background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
      padding: 20, backdropFilter: 'blur(12px)', zIndex: 100,
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase' as const, marginBottom: 16, fontWeight: 500,
      }}>Your Profile</div>
      {rows.map(r => (
        <div key={r.label} style={{
          padding: '8px 0 8px 12px', marginBottom: 6,
          borderLeft: r.val ? '2px solid #5aaa78' : '2px solid transparent',
          transition: 'all 300ms ease',
          opacity: r.val ? 1 : 0.5,
          transform: r.val ? 'translateY(0)' : 'translateY(6px)',
        }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginBottom: 2, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{r.label}</div>
          <div style={{ fontSize: '0.85rem', color: r.val ? 'white' : 'rgba(255,255,255,0.2)' }}>{r.val ? r.display : '—'}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Progress Bar Nodes (Fix 2) ─── */
export function ProgressNodes({ currentStep, completedSteps, bounceNode, progressFlash, totalSteps }: {
  currentStep: number; completedSteps: number[]; bounceNode: number | null; progressFlash: boolean; totalSteps: number;
}) {
  const fillPct = `${(completedSteps.length / totalSteps) * 100}%`;
  return (
    <div style={{ position: 'relative', width: '100%', height: 24, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
      <div style={{
        position: 'absolute', left: 0, height: 4, borderRadius: 2,
        width: fillPct,
        background: progressFlash ? '#8dffc0' : 'linear-gradient(to right, #4a9060, #6db88a)',
        transition: 'width 0.5s ease, background 0.4s ease',
      }} />
      {Array.from({ length: totalSteps }, (_, step) => {
        const done = completedSteps.includes(step);
        const active = currentStep === step && !done;
        return (
          <div key={step} style={{
            position: 'absolute', left: `${((step + 1) / totalSteps) * 100}%`, transform: 'translateX(-50%)',
            width: 16, height: 16, borderRadius: '50%',
            border: `2px solid ${done ? '#5aaa78' : 'rgba(255,255,255,0.15)'}`,
            background: done ? '#5aaa78' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease',
            animation: active ? 'ca-nodePulse 2s ease-in-out infinite' : bounceNode === step ? 'ca-nodeBounce 300ms ease' : 'none',
            zIndex: 2,
          }}>
            {done && <span style={{ color: 'white', fontSize: '9px', fontWeight: 700, animation: 'ca-checkIn 300ms cubic-bezier(0.34,1.56,0.64,1)', display: 'block' }}>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ─── CSS Keyframes ─── */
export const ASSESSMENT_KEYFRAMES = `
@keyframes ca-orbPulse {
  0% { box-shadow: 0 0 0 0 rgba(90,170,120,0.6); }
  50% { box-shadow: 0 0 0 20px rgba(90,170,120,0); }
  100% { box-shadow: 0 0 0 0 rgba(90,170,120,0.6); }
}
@keyframes ca-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ca-nodePulse {
  0% { box-shadow: 0 0 0 0 rgba(90,170,120,0.3); }
  50% { box-shadow: 0 0 0 4px rgba(90,170,120,0.3); }
  100% { box-shadow: 0 0 0 0 rgba(90,170,120,0.3); }
}
@keyframes ca-checkIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
@keyframes ca-nodeBounce {
  0% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.4); }
  100% { transform: translateX(-50%) scale(1); }
}
@keyframes ca-msgFade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
