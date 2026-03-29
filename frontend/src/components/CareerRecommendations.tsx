import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  BrainCircuit,
  Code,
  Palette,
  TrendingUp,
  Heart,
  Users,
  ChevronLeft,
  ArrowRight,
  Star,
  Target,
  Award,
  Briefcase,
  DollarSign,
  TrendingUp as Growth
} from 'lucide-react';

// Icon mapping for different career categories
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: React.ElementType } = {
    'Technology & Development': Code,
    'Design & Creative': Palette,
    'Business & Management': TrendingUp,
    'Healthcare': Heart,
    'Education': Users,
    'Finance': DollarSign,
    'Law & Legal': Briefcase,
    'Marketing': Growth,
  };
  
  return iconMap[category] || Briefcase;
};

// Color mapping for different career categories
const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    'Technology & Development': 'bg-blue-500',
    'Design & Creative': 'bg-purple-500',
    'Business & Management': 'bg-green-500',
    'Healthcare': 'bg-red-500',
    'Education': 'bg-amber-500',
    'Finance': 'bg-emerald-500',
    'Law & Legal': 'bg-slate-600',
    'Marketing': 'bg-pink-500',
  };
  
  return colorMap[category] || 'bg-gray-500';
};

/* ─── StatCard with count-up ─── */
function StatCard({ icon: Icon, value, label, suffix = '' }: { icon: React.ElementType; value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(90,170,120,0.4)', borderRadius: 16, backdropFilter: 'blur(12px)', padding: 24, textAlign: 'center' }}>
      <Icon style={{ width: 28, height: 28, color: '#6db88a', margin: '0 auto 12px' }} />
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: 4, lineHeight: 1 }}>{count}{suffix}</div>
      <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' as const }}>{label}</div>
    </div>
  );
}

/* ─── StatCard with circular ring ─── */
function StatCardWithRing({ icon: Icon, value, label, suffix = '' }: { icon: React.ElementType; value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(() => setDrawn(true), 50);
  }, [value]);
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(90,170,120,0.4)', borderRadius: 16, backdropFilter: 'blur(12px)', padding: 24, textAlign: 'center' }}>
      <Icon style={{ width: 28, height: 28, color: '#6db88a', margin: '0 auto 12px' }} />
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: 4, lineHeight: 1 }}>{count}{suffix}</div>
      <svg width="60" height="60" style={{ margin: '8px auto 4px', display: 'block' }}>
        <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="30" cy="30" r="26" fill="none" stroke="#6db88a" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={drawn ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1200ms ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      </svg>
      <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' as const }}>{label}</div>
    </div>
  );
}

export function CareerRecommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();
  
  // DEBUG: Log what we're working with
  useEffect(() => {
    console.log('🎨 CareerRecommendations mounted');
    console.log('📦 userData:', userData);
    console.log('📊 recommendations:', userData?.recommendations);
  }, [userData]);

  // Get recommendations from route state (fresh) or userData (fallback)
  const recommendations = location.state?.freshRecommendations || userData?.recommendations || [];

  // Card entrance observer
  const cardGridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = cardGridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          const bar = el.querySelector('[data-progress-bar]') as HTMLElement;
          if (bar) bar.style.width = bar.dataset.targetWidth || '0%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    Array.from(grid.children).forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [recommendations]);
  
  // If no recommendations, show message
  if (recommendations.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 420, padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, backdropFilter: 'blur(12px)' }}>
          <BrainCircuit style={{ width: 64, height: 64, color: 'rgba(255,255,255,0.4)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>No Recommendations Found</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
            Please complete the career assessment first to get personalized recommendations.
          </p>
          <button onClick={() => navigate('/assessment')} style={{ background: 'linear-gradient(135deg, #4a9060, #6db88a)', color: 'white', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Take Assessment</button>
        </div>
      </div>
    );
  }

  // Get top match percentage for stats
  const topMatchPercentage = Math.round(recommendations[0]?.similarity_score * 100);

  const getMatchColorHex = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 70) return '#6db88a';
    if (percentage >= 45) return '#f0a050';
    return '#e06060';
  };

  const getProgressColorHex = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 70) return '#6db88a';
    if (percentage >= 45) return '#f0a050';
    return '#e06060';
  };

  // Parse skills if they're strings
  const parseSkills = (skills: string | string[]) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
      return skills.split(',').map(s => s.trim()).slice(0, 3);
    }
    return [];
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'rgba(255,255,255,0.85)', fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
      {/* Atmospheric green glow */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(80,120,90,0.25) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navbar — matches assessment page */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/assessment')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', fontWeight: 300, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <ChevronLeft size={16} />
            Back to Assessment
          </button>
          <span style={{ fontSize: '1rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}>CareerAI</span>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '100px 24px 48px', position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(90,170,120,0.1)', border: '1px solid rgba(90,170,120,0.2)', color: '#6db88a', fontSize: '0.85rem', fontWeight: 500, marginBottom: 24 }}>
            <Target size={16} />
            <span>AI Analysis Complete</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Your Recommended{' '}
            <span style={{ color: '#6db88a' }}>Career Paths</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, maxWidth: '48rem', margin: '0 auto' }}>
            Based on your profile: <strong style={{ color: '#6db88a', fontWeight: 600 }}>{userData?.education}</strong>, here are the career paths that align best with you
          </p>
        </div>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 48 }}>
          <StatCard icon={Award} value={recommendations.length} label="Career Matches" />
          <StatCardWithRing icon={Star} value={topMatchPercentage} suffix="%" label="Top Match Score" />
          <StatCard icon={Target} value={userData?.skills?.length || 0} label="Your Skills" />
        </div>

        {/* Career Recommendations Grid */}
        <div ref={cardGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
          {recommendations.map((career: any, index: number) => {
            const IconComponent = getCategoryIcon(career.category);
            const matchPercentage = Math.round(career.similarity_score * 100);
            const skills = parseSkills(career.key_skills || []);
            const matchColor = getMatchColorHex(career.similarity_score);
            const barColor = getProgressColorHex(career.similarity_score);
            
            console.log(`🎨 Rendering career ${index + 1}:`, career.career_name);
            
            return (
              <div
                key={`${career.career_name}-${career.similarity_score}-${index}`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: 0,
                  transform: 'translateY(30px)',
                  transition: `opacity 600ms cubic-bezier(0.23,1,0.32,1) ${index * 100}ms, transform 600ms cubic-bezier(0.23,1,0.32,1) ${index * 100}ms, border-color 0.25s ease, box-shadow 0.25s ease`,
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.borderColor = 'rgba(90,170,120,0.3)'; el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(90,170,120,0.15)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.boxShadow = 'none'; }}
              >
                {/* Card Header */}
                <div style={{ padding: '24px 24px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent style={{ width: 24, height: 24, color: '#6db88a' }} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: matchColor, marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>{matchPercentage}%</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Match</div>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'white', marginBottom: 8 }}>{career.career_name}</h3>
                  {/* Progress bar — animates from 0 via observer */}
                  <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 10 }}>
                    <div data-progress-bar data-target-width={`${matchPercentage}%`} style={{ height: 4, borderRadius: 4, background: barColor, width: '0%', transition: 'width 900ms ease-out' }} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{career.description}</p>
                </div>

                {/* Card Body */}
                <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Why This Suits You */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 6 }}>Why This Suits You</div>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{career.why_suited || "Well aligned with your skills and education."}</p>
                    </div>

                    {/* Key Skills */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Key Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {skills.slice(0, 5).map((skill: string, idx: number) => (
                          <span key={`${skill}-${idx}`} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '4px 12px', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* Education Gap */}
                    {career.education_gap && career.education_gap.toLowerCase() !== "none" && (
                      <div style={{ background: 'rgba(240,160,50,0.08)', border: '1px solid rgba(240,160,50,0.25)', borderLeft: '3px solid #f0a050', borderRadius: 8, padding: 16, marginTop: 8 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f0a050', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>Education Gap</div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{career.education_gap}</p>
                      </div>
                    )}
                  </div>

                  {/* View Roadmap Button */}
                  <div style={{ paddingTop: 20, marginTop: 'auto' }}>
                    <button
                      onClick={() => navigate('/roadmap', { state: { career, hasRoadmap: true } })}
                      style={{
                        background: 'linear-gradient(135deg, #4a9060, #6db88a)', color: 'white',
                        border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s ease',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(90,170,120,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; const arrow = e.currentTarget.querySelector('.rm-arrow') as HTMLElement; if (arrow) arrow.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; const arrow = e.currentTarget.querySelector('.rm-arrow') as HTMLElement; if (arrow) arrow.style.transform = 'translateX(0)'; }}
                    >
                      View Roadmap
                      <span className="rm-arrow" style={{ display: 'inline-flex', transition: 'transform 0.2s ease' }}><ArrowRight size={16} /></span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, backdropFilter: 'blur(12px)', padding: '48px 32px',
            boxShadow: '0 0 80px rgba(80,160,100,0.12)',
          }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
              Ready to Start Your{' '}
              <span style={{ color: '#6db88a' }}>Career Journey?</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '40rem', margin: '0 auto 24px' }}>
              Explore detailed roadmaps, skill assessments, and personalized guidance for your top career match
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 8 }}>
              <button
                onClick={() => navigate('/roadmap', { state: { career: recommendations[0], hasRoadmap: true } })}
                style={{
                  background: 'linear-gradient(135deg, #4a9060, #6db88a)', color: 'white', border: 'none',
                  borderRadius: 10, padding: '16px 32px', fontSize: '1.05rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s ease',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(90,170,120,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                View Top Career Roadmap
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/assessment')}
                style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                  borderRadius: 10, padding: '16px 32px', fontSize: '1.05rem', fontWeight: 500,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}