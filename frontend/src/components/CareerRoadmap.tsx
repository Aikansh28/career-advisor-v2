import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Brain, 
  Database, 
  BarChart3, 
  Code, 
  TrendingUp,
  BookOpen,
  ExternalLink,
  DollarSign,
  Target,
  Sparkles
} from 'lucide-react';

interface CareerRoadmapProps {
  // Props are optional since we use route state
  selectedCareer?: string;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ 
  selectedCareer: propCareer 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const careerData = (location.state as any)?.career;

  console.log('🗺️ CareerRoadmap: Received career data:', careerData);

  // Use career name from route state or fallback
  const selectedCareer = careerData?.career_name || propCareer || "Data Scientist";

  // Parse skills from backend data or use defaults
  const parseSkills = () => {
    if (!careerData) {
      // Return default hardcoded skills if no data
      return [
        { name: "Python Programming", icon: Code, level: 85, difficulty: "Intermediate" },
        { name: "Machine Learning", icon: Brain, level: 70, difficulty: "Advanced" },
        { name: "Data Analysis", icon: BarChart3, level: 90, difficulty: "Intermediate" },
        { name: "SQL & Databases", icon: Database, level: 75, difficulty: "Beginner" },
        { name: "Statistics", icon: TrendingUp, level: 65, difficulty: "Intermediate" }
      ];
    }

    const rawSkills = careerData.key_skills || [];
    const skillList = Array.isArray(rawSkills) 
      ? rawSkills 
      : (typeof rawSkills === 'string' ? rawSkills.split(',').map((s: string) => s.trim()) : []);
    
    // Map to the object structure expected by the UI
    return skillList.slice(0, 6).map((skill: string, index: number) => ({
      name: skill,
      icon: [Code, Brain, BarChart3, Database, TrendingUp, Target][index % 6],
      level: 60 + (index * 5), // Mock level
      difficulty: ["Beginner", "Intermediate", "Advanced"][index % 3] // Mock difficulty
    }));
  };

  const skills = parseSkills();

  // Parse learning resources
  const parseResources = () => {
    if (!careerData) {
      return [
        {
          title: "Python for Data Science",
          description: "Complete course covering pandas, numpy, and data manipulation",
          provider: "DataCamp",
          duration: "40 hours"
        },
        {
          title: "Machine Learning Specialization",
          description: "From basic algorithms to deep learning fundamentals",
          provider: "Coursera",
          duration: "3 months"
        },
        {
          title: "SQL for Data Analysis",
          description: "Master database queries and data extraction techniques",
          provider: "Udacity",
          duration: "2 weeks"
        }
      ];
    }

    const rawResources = careerData.learning_resources || [];
    const resourceList = Array.isArray(rawResources)
      ? rawResources
      : (typeof rawResources === 'string' ? rawResources.split(',').map((s: string) => s.trim()) : []);

    return resourceList.map((res: string) => {
      // Try to extract provider from parentheses if present, e.g. "Course Name (Provider)"
      const match = res.match(/(.*?)\s*\((.*?)\)/);
      return {
        title: match ? match[1].trim() : res.trim(),
        description: `Comprehensive resource for ${match ? match[1].trim() : res.trim()}`,
        provider: match ? match[2].trim() : "Recommended",
        duration: "Self-paced"
      };
    });
  };

  const learningResources = parseResources();

  const getLevelStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return { bg: 'rgba(90,170,120,0.15)', border: '1px solid rgba(90,170,120,0.3)', color: '#6db88a', barColor: '#6db88a' };
      case 'Intermediate': return { bg: 'rgba(240,160,50,0.12)', border: '1px solid rgba(240,160,50,0.3)', color: '#f0a050', barColor: '#f0a050' };
      case 'Advanced': return { bg: 'rgba(220,80,80,0.12)', border: '1px solid rgba(220,80,80,0.3)', color: '#e06060', barColor: '#e06060' };
      default: return { bg: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', barColor: 'rgba(255,255,255,0.3)' };
    }
  };

  // Skill bar observer
  const skillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('[data-skill-bar]') as NodeListOf<HTMLElement>;
          bars.forEach(bar => { bar.style.width = bar.dataset.targetWidth || '0%'; });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [skills]);

  // Section entrance observer
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('[data-animate-section]') as NodeListOf<HTMLElement>;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.animateDelay || '0', 10);
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.08 });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'rgba(255,255,255,0.82)', fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
      {/* Atmospheric green glow */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 60% 35% at 50% 0%, rgba(80,120,90,0.22) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/recommendations')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', fontWeight: 300, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <ArrowLeft size={16} />
            Back to Recommendations
          </button>
          <span style={{ fontSize: '1rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}>CareerAI</span>
        </div>
      </nav>

      <div ref={contentRef} style={{ maxWidth: '56rem', margin: '0 auto', padding: '88px 24px 48px', position: 'relative', zIndex: 1 }}>
        {/* Page Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {selectedCareer}
          </h1>
          <p style={{ fontSize: '1.05rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>
            Your complete career roadmap and learning path
          </p>
        </div>

        {/* Key Skills Required */}
        <section data-animate-section data-animate-delay="0" style={{ marginBottom: 40, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Target style={{ width: 22, height: 22, color: '#6db88a' }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white', margin: 0 }}>Key Skills Required</h2>
          </div>

          <div ref={skillsRef} style={{ display: 'grid', gap: 12 }}>
            {skills.map((skill, index) => {
              const ls = getLevelStyle(skill.difficulty);
              return (
                <div
                  key={index}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', transition: 'border-color 0.2s ease, transform 0.2s ease', cursor: 'default' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.18)'; el.style.transform = 'translateX(6px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <skill.icon style={{ width: 18, height: 18, color: '#6db88a' }} />
                      <span style={{ fontWeight: 500, color: 'white', fontSize: '0.95rem' }}>{skill.name}</span>
                    </div>
                    <span style={{ background: ls.bg, border: ls.border, color: ls.color, borderRadius: 20, padding: '3px 12px', fontSize: '0.72rem', fontWeight: 500 }}>{skill.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                      <div data-skill-bar data-target-width={`${skill.level}%`} style={{ height: 6, borderRadius: 3, background: ls.barColor, width: '0%', transition: 'width 900ms ease-out' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: '2.5rem', textAlign: 'right' }}>{skill.level}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '40px 0' }} />

        {/* Personalized Roadmap */}
        {careerData?.roadmap && (
          <section data-animate-section data-animate-delay="80" style={{ marginBottom: 40, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '1.2rem' }}>🗺️</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white', margin: 0 }}>Your Personalized Roadmap</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.isArray(careerData.roadmap) ? (
                careerData.roadmap.map((step: string, index: number) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid rgba(90,170,120,0.4)', borderRadius: 14, backdropFilter: 'blur(8px)', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: 'rgba(90,170,120,0.15)', color: '#6db88a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Syne', sans-serif" }}>
                      {index + 1}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, fontSize: '1rem', fontWeight: 300, paddingTop: 4, margin: 0 }}>
                      {step}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid rgba(90,170,120,0.4)', borderRadius: 14, backdropFilter: 'blur(8px)', padding: '24px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, fontSize: '1rem', fontWeight: 300, margin: 0 }}>
                    {careerData.roadmap}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '40px 0' }} />

        {/* Learning Resources */}
        <section data-animate-section data-animate-delay="160" style={{ marginBottom: 40, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <BookOpen style={{ width: 22, height: 22, color: '#6db88a' }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white', margin: 0 }}>Learning Resources</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {learningResources.map((resource, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, backdropFilter: 'blur(8px)', padding: 24, display: 'flex', flexDirection: 'column', transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px)'; el.style.borderColor = 'rgba(90,170,120,0.25)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.boxShadow = 'none'; }}
              >
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: 'white', marginBottom: 6 }}>{resource.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 16, flex: 1 }}>{resource.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{resource.provider}</span>
                  <span style={{ background: 'rgba(90,170,120,0.12)', border: '1px solid rgba(90,170,120,0.25)', color: '#6db88a', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 500 }}>{resource.duration}</span>
                </div>
                <button
                  style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'white', borderRadius: 8, padding: 10, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#5aaa78'; el.style.color = '#6db88a'; el.style.background = 'rgba(90,170,120,0.08)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'white'; el.style.background = 'transparent'; }}
                >
                  <ExternalLink size={14} />
                  Explore
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '40px 0' }} />

        {/* Career Insights */}
        <section data-animate-section data-animate-delay="240" style={{ marginBottom: 40, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Target style={{ width: 22, height: 22, color: '#6db88a' }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white', margin: 0 }}>Career Insights</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {/* Why This Suits You */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(90,170,120,0.3)', borderRadius: 14, backdropFilter: 'blur(8px)', padding: 24, transition: 'transform 0.25s ease, border-color 0.25s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 12 }}>Why This Suits You</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                {careerData?.why_suited || "Well aligned with your skills and education."}
              </p>
            </div>

            {/* Education Gap */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid rgba(240,160,50,0.4)', borderRadius: 14, backdropFilter: 'blur(8px)', padding: 24, transition: 'transform 0.25s ease, border-color 0.25s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f0a050', marginBottom: 12 }}>Education Gap</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                {careerData?.education_gap || "None."}
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '40px 0' }} />

        {/* Future Scope */}
        <section data-animate-section data-animate-delay="320" style={{ marginBottom: 40, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Sparkles style={{ width: 22, height: 22, color: '#6db88a' }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white', margin: 0 }}>Future Scope</h2>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(90,170,120,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, backdropFilter: 'blur(8px)', padding: 32, boxShadow: '0 0 40px rgba(90,170,120,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 300, margin: 0 }}>
              {careerData?.future_scope || "Future scope information is currently unavailable for this career path."}
            </p>
          </div>
        </section>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, paddingTop: 8, paddingBottom: 32 }}>
          <button
            onClick={() => navigate('/assessment')}
            style={{ background: 'linear-gradient(135deg, #4a9060, #6db88a)', color: 'white', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(90,170,120,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            Take Another Assessment
          </button>
          <button
            onClick={() => navigate('/user-dashboard')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 10, padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};