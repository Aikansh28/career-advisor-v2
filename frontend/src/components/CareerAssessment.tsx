import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getCareerRecommendations } from '@/lib/api';
import { emitParticles, getSubjectEncouragement, getSkillEncouragement, getInterestEncouragement, ThinkingOverlay, LiveProfileCard, ProgressNodes, ASSESSMENT_KEYFRAMES } from './CareerAssessmentHelpers';
import {
  Computer,
  Palette,
  Building2,
  Heart,
  Beaker,
  PenTool,
  Users,
  Calculator,
  Globe,
  Music,
  Camera,
  ChevronLeft,
  Plus,
  GraduationCap,
  Scale,
  FlaskConical,
  Trophy,
  Leaf,
  Wrench,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

/* ─── Types ─── */
interface Interest {
  id: string;
  name: string;
  icon: React.ElementType;
  emoji: string;
}

/* ─── Data — UNCHANGED values ─── */
const interestsData: Interest[] = [
  { id: 'tech', name: 'Technology', icon: Computer, emoji: '💻' },
  { id: 'design', name: 'Design', icon: Palette, emoji: '🎨' },
  { id: 'business', name: 'Business', icon: Building2, emoji: '🏢' },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, emoji: '❤️' },
  { id: 'science', name: 'Science', icon: Beaker, emoji: '🔬' },
  { id: 'writing', name: 'Writing', icon: PenTool, emoji: '✍️' },
  { id: 'social', name: 'Social Work', icon: Users, emoji: '🤝' },
  { id: 'finance', name: 'Finance', icon: Calculator, emoji: '📊' },
  { id: 'international', name: 'International', icon: Globe, emoji: '🌍' },
  { id: 'arts', name: 'Arts', icon: Music, emoji: '🎵' },
  { id: 'media', name: 'Media', icon: Camera, emoji: '📷' },
  { id: 'education', name: 'Education & Teaching', icon: GraduationCap, emoji: '🎓' },
  { id: 'law', name: 'Law & Justice', icon: Scale, emoji: '⚖️' },
  { id: 'research', name: 'Research & Academia', icon: FlaskConical, emoji: '🧪' },
  { id: 'sports', name: 'Sports & Fitness', icon: Trophy, emoji: '🏆' },
  { id: 'environment', name: 'Environment & Sustainability', icon: Leaf, emoji: '🌿' },
  { id: 'engineering', name: 'Engineering & Infrastructure', icon: Wrench, emoji: '⚙️' },
];

const educationOptions = [
  { value: 'high-school', label: 'High School' },
  { value: 'associate', label: 'Associate' },
  { value: 'bachelor', label: "Bachelor's" },
  { value: 'master', label: "Master's" },
  { value: 'phd', label: 'PhD' },
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'other', label: 'Other' },
];

const predefinedSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML/CSS',
  'Project Management', 'Communication', 'Leadership', 'Problem Solving',
  'Data Analysis', 'Marketing', 'Sales', 'Design', 'Writing',
  'Teaching', 'Research', 'Critical Thinking', 'Public Speaking',
  'Patient Care', 'Legal Research', 'Accounting', 'Financial Analysis',
];

const predefinedSubjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Economics', 'Business Studies', 'Accounting',
  'Psychology', 'Political Science', 'Geography', 'Statistics', 'Engineering',
  'Law', 'Art & Design', 'Medicine', 'Nursing', 'Education',
  'Physical Education', 'Music', 'Fine Arts', 'Drama & Theater',
  'Home Science', 'Agriculture', 'Environmental Science',
];

/* ─── Shared Inline Styles ─── */
const glassInput: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '16px 20px',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  fontFamily: "'DM Sans', sans-serif",
};

const glassInputFocus: React.CSSProperties = {
  borderColor: 'rgba(90,170,120,0.6)',
  boxShadow: '0 0 0 3px rgba(90,170,120,0.15)',
};

/* ─── Component ─── */
export function CareerAssessment() {
  const navigate = useNavigate();
  const { setUserData } = useUser();

  /* Form state — UNCHANGED field names */
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: [] as string[],
    interests: [] as string[],
    subjects: [] as string[],
    goals: '',
  });
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Wizard state */
  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);
  const TOTAL_STEPS = 4;
  const [showThinking, setShowThinking] = useState(false);
  const [thinkingMsgIndex, setThinkingMsgIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progressFlash, setProgressFlash] = useState(false);
  const [bounceNode, setBounceNode] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth > 1100 : false);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth > 1100);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* Focus tracking for green glow */
  const [nameFocused, setNameFocused] = useState(false);
  const [goalsFocused, setGoalsFocused] = useState(false);
  const [customSubjectFocused, setCustomSubjectFocused] = useState(false);
  const [customSkillFocused, setCustomSkillFocused] = useState(false);

  /* ─── Handlers — ALL UNCHANGED logic ─── */
  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()],
      }));
      setCustomSkill('');
      setShowCustomSkill(false);
    }
  };

  const handleAddCustomSubject = () => {
    if (customSubject.trim() && !formData.subjects.includes(customSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, customSubject.trim()],
      }));
      setCustomSubject('');
      setShowCustomSubject(false);
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  /* ─── Submit — UNCHANGED API call ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.education.trim()) {
      setError('Please enter your education background');
      return;
    }
    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }
    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    if (formData.subjects.length === 0) {
      setError('Please select at least one subject');
      return;
    }
    if (!formData.goals.trim()) {
      setError('Please describe your career goals');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      console.log('📤 CareerAssessment: Submitting form data:', formData);
      const response = await getCareerRecommendations(formData);

      console.log('📥 CareerAssessment: Received API response:', response);
      console.log('📊 CareerAssessment: Recommendations array:', response.recommendations);

      response.recommendations.forEach((rec: any, idx: number) => {
        console.log(`   ${idx + 1}. ${rec.career_name} (${(rec.similarity_score * 100).toFixed(1)}%)`);
      });

      const newUserData = {
        name: formData.name,
        education: formData.education,
        skills: formData.skills,
        interests: formData.interests,
        subjects: formData.subjects,
        goals: formData.goals,
        recommendations: response.recommendations,
      };

      console.log('💾 CareerAssessment: Setting userData to:', newUserData);
      setUserData(newUserData);

      console.log('🚀 CareerAssessment: Navigating to /recommendations');
      navigate('/recommendations', {
        state: { freshRecommendations: response.recommendations },
      });
    } catch (err) {
      console.error('❌ CareerAssessment: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Step navigation ─── */
  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 0: return formData.name.trim().length > 0 && formData.education.length > 0;
      case 1: return formData.subjects.length > 0;
      case 2: return formData.skills.length > 0 && formData.interests.length > 0;
      case 3: return formData.goals.trim().length > 0;
      default: return false;
    }
  }, [currentStep, formData]);

  const goNext = () => {
    if (isAnimating || !canProceed()) return;
    // Enhancement 5: celebration flash + node bounce
    setProgressFlash(true);
    setBounceNode(currentStep);
    setTimeout(() => setProgressFlash(false), 400);
    setTimeout(() => setBounceNode(null), 300);
    // Mark step completed
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    // Enhancement 1: thinking overlay
    setThinkingMsgIndex(currentStep % 3);
    setShowThinking(true);
    setSlideDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setShowThinking(false);
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
      setIsAnimating(false);
    }, 700);
  };

  const goBack = () => {
    if (isAnimating) return;
    setSlideDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
      setIsAnimating(false);
    }, 400);
  };

  /* Animation styles */
  const slideStyle: React.CSSProperties = isAnimating
    ? {
        transform: slideDirection === 'left' ? 'translateX(-100%)' : 'translateX(100%)',
        opacity: 0,
        transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms ease',
      }
    : {
        transform: 'translateX(0)',
        opacity: 1,
        transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms ease',
      };

  const progressWidth = `${(completedSteps.length / TOTAL_STEPS) * 100}%`;

  /* ─── Pill renderer (reused for subjects and skills) ─── */
  const renderPill = (
    label: string,
    isSelected: boolean,
    onClick: () => void,
    isCustom: boolean = false,
  ) => (
    <button
      key={label}
      type="button"
      onClick={(e: React.MouseEvent) => { emitParticles(e, isSelected); onClick(); }}
      style={{
        background: isSelected ? 'rgba(90,170,120,0.18)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isSelected ? '#5aaa78' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '20px',
        padding: '8px 18px',
        color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'DM Sans', sans-serif",
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
        }
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      }}
    >
      {isSelected && <span style={{ color: '#5aaa78', fontWeight: 700 }}>✓</span>}
      {label}
      {isCustom && isSelected && <X size={12} style={{ marginLeft: '4px', opacity: 0.6 }} />}
    </button>
  );

  /* ─── RENDER ─── */
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: 'white',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow — persists across all steps */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(80,120,90,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ─── Fixed Header Unit (Fix 1 + Fix 2) ─── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '72rem',
            margin: '0 auto',
            padding: '20px 24px',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 300,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <ChevronLeft size={16} />
            Back to Home
          </button>
          <span
            style={{
              fontSize: '1rem',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            CareerAI
          </span>
        </nav>
        <div
          style={{
            textAlign: 'center',
            padding: '4px 0 6px',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            fontWeight: 400,
          }}
        >
          Step {currentStep + 1} of {TOTAL_STEPS}
        </div>
        <ProgressNodes
          currentStep={currentStep}
          completedSteps={completedSteps}
          bounceNode={bounceNode}
          progressFlash={progressFlash}
          totalSteps={TOTAL_STEPS}
        />
      </div>

      {/* ─── Wizard Content ─── */}
      <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '140px 24px 80px',
            maxWidth: '680px',
            margin: '0 auto',
            ...slideStyle,
          }}
        >
          {/* Error display */}
          {error && (
            <div
              style={{
                width: '100%',
                marginBottom: '24px',
                padding: '14px 20px',
                background: 'rgba(220,60,60,0.12)',
                border: '1px solid rgba(220,60,60,0.3)',
                borderRadius: '12px',
                color: '#ff8888',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          {/* ═══════ STEP 1: Who are you? ═══════ */}
          {currentStep === 0 && (
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'white',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Who are you?
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', fontWeight: 300 }}>
                  Let's start with the basics.
                </p>
              </div>

              {/* Name input */}
              <div style={{ marginBottom: '40px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  style={{
                    ...glassInput,
                    ...(nameFocused ? glassInputFocus : {}),
                  }}
                />
              </div>

              {/* Education level — styled option cards */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '14px',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  Education Level
                </label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {educationOptions.map(opt => {
                    const selected = formData.education === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, education: opt.value }))}
                        style={{
                          background: selected ? 'rgba(90,170,120,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selected ? '#5aaa78' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '12px',
                          padding: '14px 24px',
                          cursor: 'pointer',
                          color: selected ? '#5aaa78' : 'rgba(255,255,255,0.7)',
                          fontSize: '0.9rem',
                          fontWeight: selected ? 600 : 400,
                          fontFamily: "'DM Sans', sans-serif",
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          if (!selected) {
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!selected) {
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                          }
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        }}
                      >
                        {selected && <span style={{ marginRight: '6px' }}>✓</span>}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px' }}>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed()}
                  style={{
                    background: canProceed() ? 'white' : 'rgba(255,255,255,0.15)',
                    color: canProceed() ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 32px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: canProceed() ? 'pointer' : 'not-allowed',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: canProceed() ? 1 : 0.5,
                  }}
                  onMouseEnter={e => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.background = '#e8ffe0';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(90,170,120,0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.background = 'white';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }
                  }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STEP 2: What have you studied? ═══════ */}
          {currentStep === 1 && (
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'white',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  What have you studied?
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', fontWeight: 300 }}>
                  Select every subject you've covered.
                </p>
              </div>

              {/* Subject pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                {predefinedSubjects.map(subject =>
                  renderPill(subject, formData.subjects.includes(subject), () => handleSubjectToggle(subject))
                )}

                {/* Custom subjects */}
                {formData.subjects
                  .filter(s => !predefinedSubjects.includes(s))
                  .map(subject =>
                    renderPill(subject, true, () => handleSubjectToggle(subject), true)
                  )}

                {/* Add custom subject */}
                {!showCustomSubject ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomSubject(true)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      padding: '8px 18px',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                    }}
                  >
                    <Plus size={14} />
                    Add Custom Subject
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      value={customSubject}
                      onChange={e => setCustomSubject(e.target.value)}
                      placeholder="Enter subject"
                      onKeyPress={e => e.key === 'Enter' && handleAddCustomSubject()}
                      onFocus={() => setCustomSubjectFocused(true)}
                      onBlur={() => setCustomSubjectFocused(false)}
                      style={{
                        ...glassInput,
                        width: '180px',
                        padding: '10px 16px',
                        fontSize: '0.85rem',
                        ...(customSubjectFocused ? glassInputFocus : {}),
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSubject}
                      disabled={!customSubject.trim()}
                      style={{
                        background: customSubject.trim() ? '#5aaa78' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        color: 'white',
                        fontSize: '0.85rem',
                        cursor: customSubject.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCustomSubject(false); setCustomSubject(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        padding: '8px',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Smart encouragement (Enhancement 4) */}
              <p style={{ fontSize: '0.8rem', marginTop: '12px', fontWeight: 500, color: getSubjectEncouragement(formData.subjects.length).color, transition: 'all 0.2s ease', animation: 'ca-msgFade 200ms ease' }} key={`subj-enc-${Math.min(formData.subjects.length, 10)}`}>
                {getSubjectEncouragement(formData.subjects.length).text}
              </p>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
                <button
                  type="button"
                  onClick={goBack}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '14px 28px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed()}
                  style={{
                    background: canProceed() ? 'white' : 'rgba(255,255,255,0.15)',
                    color: canProceed() ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 32px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: canProceed() ? 'pointer' : 'not-allowed',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: canProceed() ? 1 : 0.5,
                  }}
                  onMouseEnter={e => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.background = '#e8ffe0';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(90,170,120,0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.background = 'white';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }
                  }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STEP 3: Your skills & interests ═══════ */}
          {currentStep === 2 && (
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'white',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  What drives you?
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', fontWeight: 300 }}>
                  Pick your skills and the areas that excite you.
                </p>
              </div>

              {/* Skills sub-section */}
              <div style={{ marginBottom: '36px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '14px',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  Skills
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {predefinedSkills.map(skill =>
                    renderPill(skill, formData.skills.includes(skill), () => handleSkillToggle(skill))
                  )}

                  {formData.skills
                    .filter(s => !predefinedSkills.includes(s))
                    .map(skill =>
                      renderPill(skill, true, () => handleSkillToggle(skill), true)
                    )}

                  {/* Add custom skill */}
                  {!showCustomSkill ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomSkill(true)}
                      style={{
                        background: 'transparent',
                        border: '1px dashed rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        padding: '8px 18px',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      }}
                    >
                      <Plus size={14} />
                      Add Custom Skill
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        value={customSkill}
                        onChange={e => setCustomSkill(e.target.value)}
                        placeholder="Enter skill"
                        onKeyPress={e => e.key === 'Enter' && handleAddCustomSkill()}
                        onFocus={() => setCustomSkillFocused(true)}
                        onBlur={() => setCustomSkillFocused(false)}
                        style={{
                          ...glassInput,
                          width: '180px',
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          ...(customSkillFocused ? glassInputFocus : {}),
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        disabled={!customSkill.trim()}
                        style={{
                          background: customSkill.trim() ? '#5aaa78' : 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          color: 'white',
                          fontSize: '0.85rem',
                          cursor: customSkill.trim() ? 'pointer' : 'not-allowed',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowCustomSkill(false); setCustomSkill(''); }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          padding: '8px',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {/* Smart encouragement (Enhancement 4) */}
                <p style={{ fontSize: '0.8rem', marginTop: '10px', fontWeight: 500, color: getSkillEncouragement(formData.skills.length).color, transition: 'all 0.2s ease', animation: 'ca-msgFade 200ms ease' }} key={`skill-enc-${Math.min(formData.skills.length, 10)}`}>
                  {getSkillEncouragement(formData.skills.length).text}
                </p>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '36px' }} />

              {/* Interests sub-section */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '14px',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  Interests
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {interestsData.map(interest => {
                    const isSelected = formData.interests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={(e: React.MouseEvent) => { emitParticles(e, isSelected); handleInterestToggle(interest.id); }}
                        style={{
                          background: isSelected ? 'rgba(90,170,120,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isSelected ? '#5aaa78' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '16px',
                          padding: '20px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.25s ease',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          if (!isSelected) el.style.borderColor = 'rgba(255,255,255,0.2)';
                          el.style.transform = 'translateY(-4px) scale(1.03)';
                          el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          if (!isSelected) el.style.borderColor = 'rgba(255,255,255,0.08)';
                          el.style.transform = 'translateY(0) scale(1)';
                          el.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>{interest.emoji}</span>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? '#5aaa78' : 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            lineHeight: 1.3,
                          }}
                        >
                          {interest.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Smart encouragement (Enhancement 4) */}
                <p style={{ fontSize: '0.8rem', marginTop: '12px', fontWeight: 500, color: getInterestEncouragement(formData.interests.length).color, transition: 'all 0.2s ease', animation: 'ca-msgFade 200ms ease' }} key={`int-enc-${Math.min(formData.interests.length, 5)}`}>
                  {getInterestEncouragement(formData.interests.length).text}
                </p>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
                <button
                  type="button"
                  onClick={goBack}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '14px 28px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed()}
                  style={{
                    background: canProceed() ? 'white' : 'rgba(255,255,255,0.15)',
                    color: canProceed() ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 32px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: canProceed() ? 'pointer' : 'not-allowed',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: canProceed() ? 1 : 0.5,
                  }}
                  onMouseEnter={e => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.background = '#e8ffe0';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(90,170,120,0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (canProceed()) {
                      (e.currentTarget as HTMLElement).style.background = 'white';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }
                  }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STEP 4: Your ambition ═══════ */}
          {currentStep === 3 && (
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: 'white',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  What's your goal?
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', fontWeight: 300 }}>
                  Tell us where you want to go. Be as specific as you like.
                </p>
              </div>

              {/* Goals textarea */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={e => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="Example: I want to become a data scientist and work on AI projects that solve real-world problems..."
                  required
                  onFocus={() => setGoalsFocused(true)}
                  onBlur={() => setGoalsFocused(false)}
                  style={{
                    ...glassInput,
                    minHeight: '160px',
                    resize: 'vertical' as const,
                    lineHeight: 1.6,
                    ...(goalsFocused ? glassInputFocus : {}),
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.3)',
                    pointerEvents: 'none',
                  }}
                >
                  {formData.goals.length} characters
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !canProceed()}
                style={{
                  width: '100%',
                  background: (isLoading || !canProceed())
                    ? 'rgba(255,255,255,0.1)'
                    : 'linear-gradient(135deg, #4a9060, #6db88a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '18px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                  cursor: (isLoading || !canProceed()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (isLoading || !canProceed()) ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                onMouseEnter={e => {
                  if (!isLoading && canProceed()) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(90,170,120,0.6)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Analyzing Your Career Path...
                  </>
                ) : (
                  <>
                    Analyze My Career Path
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              <p
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 300,
                }}
              >
                Your assessment will be processed instantly using AI
              </p>

              {/* Back button */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '32px' }}>
                <button
                  type="button"
                  onClick={goBack}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '14px 28px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Enhancement 1: Thinking Overlay */}
      <ThinkingOverlay visible={showThinking} msgIdx={thinkingMsgIndex} />

      {/* Enhancement 2: Live Profile Card (desktop only) */}
      {isDesktop && <LiveProfileCard formData={formData} />}

      {/* Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.25) !important;
        }
        ${ASSESSMENT_KEYFRAMES}
      `}</style>
    </div>
  );
}