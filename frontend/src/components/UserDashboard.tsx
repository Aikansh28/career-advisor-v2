import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useUser } from '../contexts/UserContext';
import { 
  Home, 
  User, 
  Briefcase, 
  Settings, 
  Star,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Heart,
  BookOpen,
  Code,
  MessageSquare,
  Users,
  BarChart3,
  Target,
  Brain,
  Zap
} from 'lucide-react';

interface UserDashboardProps {
  onLogout: () => void;
}

interface SavedCareer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  savedDate: string;
  matchScore: number;
  tags: string[];
}

interface SkillProgress {
  name: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const { userData } = useUser();

  // Get user data from context or use defaults
  const userProfile = {
    name: userData?.name || 'Guest User',
    education: userData?.education || 'Not specified',
    interests: userData?.interests?.map(interestId => {
      const interestMap: { [key: string]: string } = {
        'tech': 'Technology',
        'design': 'Design',
        'business': 'Business',
        'healthcare': 'Healthcare',
        'science': 'Science',
        'writing': 'Writing',
        'social': 'Social Work',
        'finance': 'Finance',
        'international': 'International',
        'arts': 'Arts',
        'media': 'Media'
      };
      return interestMap[interestId] || interestId;
    }) || ['General Interest'],
    avatar: '/placeholder.svg',
    joinDate: 'January 2024'
  };

  // Mock saved careers data
  const savedCareers: SavedCareer[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      savedDate: '2 days ago',
      matchScore: 94,
      tags: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: '2',
      title: 'Data Scientist',
      company: 'DataFlow Solutions',
      location: 'Remote',
      salary: '$100k - $130k',
      type: 'Full-time',
      savedDate: '1 week ago',
      matchScore: 87,
      tags: ['Python', 'Machine Learning', 'SQL']
    },
    {
      id: '3',
      title: 'AI Research Intern',
      company: 'AI Innovations Lab',
      location: 'New York, NY',
      salary: '$25 - $35/hr',
      type: 'Internship',
      savedDate: '2 weeks ago',
      matchScore: 91,
      tags: ['Deep Learning', 'TensorFlow', 'Research']
    },
    {
      id: '4',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      salary: '$80k - $100k',
      type: 'Full-time',
      savedDate: '3 weeks ago',
      matchScore: 82,
      tags: ['Vue.js', 'Python', 'PostgreSQL']
    }
  ];

  // Generate skills progress based on user's skills or use defaults
  const getSkillsProgress = (): SkillProgress[] => {
    const userSkills = userData?.skills || [];
    const defaultSkills: SkillProgress[] = [
      { name: 'Communication', level: 85, icon: MessageSquare, color: 'bg-blue-500' },
      { name: 'Coding', level: 92, icon: Code, color: 'bg-green-500' },
      { name: 'AI & ML', level: 78, icon: Brain, color: 'bg-purple-500' },
      { name: 'Management', level: 65, icon: Users, color: 'bg-orange-500' },
      { name: 'Data Analysis', level: 88, icon: BarChart3, color: 'bg-indigo-500' },
      { name: 'Problem Solving', level: 90, icon: Target, color: 'bg-red-500' }
    ];

    // If user has skills, create progress for them
    if (userSkills.length > 0) {
      return userSkills.slice(0, 6).map((skill, index) => {
        const icons = [MessageSquare, Code, Brain, Users, BarChart3, Target];
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-indigo-500', 'bg-red-500'];
        return {
          name: skill,
          level: Math.floor(Math.random() * 40) + 60, // Random level between 60-100
          icon: icons[index % icons.length],
          color: colors[index % colors.length]
        };
      });
    }

    return defaultSkills;
  };

  const skillsProgress = getSkillsProgress();

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'careers', label: 'My Careers', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getMatchColor = (score: number) => {
    if (score >= 90) return '#6db88a';
    if (score >= 80) return '#a8d8b0';
    if (score >= 70) return '#f0c070';
    return '#f0a050';
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Full-time': return { bg: 'rgba(90,170,120,0.12)', border: '1px solid rgba(90,170,120,0.25)', color: '#6db88a' };
      case 'Part-time': return { bg: 'rgba(100,150,220,0.1)', border: '1px solid rgba(100,150,220,0.25)', color: '#7ab0e0' };
      case 'Contract': return { bg: 'rgba(90,170,120,0.1)', border: '1px solid rgba(90,170,120,0.2)', color: '#5aaa78' };
      case 'Internship': return { bg: 'rgba(240,160,50,0.1)', border: '1px solid rgba(240,160,50,0.25)', color: '#f0a050' };
      default: return { bg: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' };
    }
  };

  // Skills bar + percentage count-up observer
  const skillsGridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = skillsGridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate bars
          const bars = entry.target.querySelectorAll('[data-dash-bar]') as NodeListOf<HTMLElement>;
          bars.forEach(bar => { bar.style.width = bar.dataset.targetWidth || '0%'; });
          // Animate percentage numbers
          const nums = entry.target.querySelectorAll('[data-count-target]') as NodeListOf<HTMLElement>;
          nums.forEach(num => {
            const target = parseInt(num.dataset.countTarget || '0', 10);
            const start = performance.now();
            const step = (now: number) => {
              const p = Math.min((now - start) / 800, 1);
              num.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + '%';
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [skillsProgress]);

  // Section entrance observer
  const mainContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = mainContentRef.current;
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
      {/* Green glow */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 50% 40% at 80% 0%, rgba(80,120,90,0.18) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
        {/* Sidebar Navigation — desktop only */}
        <div style={{ display: 'none', position: 'fixed', top: 0, bottom: 0, left: 0, width: 256, zIndex: 50, flexDirection: 'column', background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)' }} className="md:!flex">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '24px 20px 32px', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(90,170,120,0.2)', border: '1px solid rgba(90,170,120,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain style={{ width: 18, height: 18, color: '#6db88a' }} />
            </div>
            <span style={{ fontSize: '1.15rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>CareerAI</span>
          </div>

          {/* Nav Items */}
          <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'home') navigate('/');
                    else setActiveTab(item.id);
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 8, border: isActive ? '1px solid rgba(90,170,120,0.2)' : '1px solid transparent',
                    background: isActive ? 'rgba(90,170,120,0.12)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                    fontSize: '0.9rem', fontWeight: isActive ? 500 : 400, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'white'; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; } }}
                >
                  <Icon style={{ width: 18, height: 18, color: isActive ? '#6db88a' : 'rgba(255,255,255,0.4)' }} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div style={{ padding: '16px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{userProfile.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userProfile.education}</p>
            </div>
            <button
              onClick={() => { onLogout(); navigate('/'); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
            >
              <Zap style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Mobile Header */}
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(90,170,120,0.2)', border: '1px solid rgba(90,170,120,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain style={{ width: 16, height: 16, color: '#6db88a' }} />
              </div>
              <span style={{ fontSize: '1rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'white' }}>CareerAI</span>
            </div>
            <button onClick={() => { onLogout(); navigate('/'); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <Zap style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Main Dashboard Content */}
          <div ref={mainContentRef} style={{ flex: 1, padding: 24, color: 'rgba(255,255,255,0.82)' }}>
            {/* Welcome Section */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.8rem', color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>
                Welcome back, {userProfile.name.split(' ')[0]}! 👋
              </h1>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>
                Ready to continue your career journey?
              </p>
            </div>

            {/* Profile Summary Card */}
            <div data-animate-section data-animate-delay="0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 32, padding: '24px 28px', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <User style={{ width: 18, height: 18, color: '#6db88a' }} />
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'white', margin: 0 }}>Profile Summary</h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", flexShrink: 0, boxShadow: '0 0 20px rgba(90,170,120,0.15)' }}>
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>{userProfile.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: 12 }}>{userProfile.education}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {userProfile.interests.map((interest, index) => (
                      <span key={index} style={{ background: 'rgba(90,170,120,0.12)', border: '1px solid rgba(90,170,120,0.25)', color: '#6db88a', borderRadius: 20, padding: '2px 12px', fontSize: '0.75rem', fontWeight: 500 }}>{interest}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: 0 }}>Member since</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, margin: '2px 0 0' }}>{userProfile.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Saved Careers Section */}
            <div data-animate-section data-animate-delay="100" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 32, padding: '24px 28px', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Briefcase style={{ width: 18, height: 18, color: '#6db88a' }} />
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'white', margin: 0 }}>Saved Careers</h2>
                </div>
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#6db88a'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  View All
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {savedCareers.map((career) => {
                  const typeStyle = getTypeBadgeStyle(career.type);
                  const matchColor = getMatchColor(career.matchScore);
                  return (
                    <div
                      key={career.id}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, transition: 'all 0.2s ease', cursor: 'default' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = 'rgba(90,170,120,0.25)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35)'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: 'white', fontSize: '0.95rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{career.title}</h4>
                          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{career.company} • {career.location}</p>
                          <p style={{ color: '#6db88a', fontWeight: 600, fontSize: '0.9rem' }}>{career.salary}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: matchColor }}>{career.matchScore}% match</span>
                          <button
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s, transform 0.2s' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#e06060'; el.style.transform = 'scale(1.2)'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.25)'; el.style.transform = 'scale(1)'; }}
                          >
                            <Heart style={{ width: 15, height: 15 }} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ background: typeStyle.bg, border: typeStyle.border, color: typeStyle.color, borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 500 }}>{career.type}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {career.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: 8 }}>Saved {career.savedDate}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Progress Tracker */}
            <div data-animate-section data-animate-delay="200" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 500ms ease-out, transform 500ms ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <TrendingUp style={{ width: 18, height: 18, color: '#6db88a' }} />
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'white', margin: 0 }}>Skills Progress Tracker</h2>
              </div>
              <div ref={skillsGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                {skillsProgress.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(90,170,120,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{ width: 16, height: 16, color: '#6db88a' }} />
                          </div>
                          <span style={{ fontWeight: 500, color: 'white', fontSize: '0.9rem' }}>{skill.name}</span>
                        </div>
                        <span data-count-target={skill.level} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>0%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                        <div data-dash-bar data-target-width={`${skill.level}%`} style={{ height: 6, borderRadius: 3, background: 'linear-gradient(90deg, #4a9060, #6db88a)', width: '0%', transition: 'width 800ms ease-out' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Beginner</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Expert</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
