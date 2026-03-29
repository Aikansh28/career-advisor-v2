import React, { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

interface LandingPageProps {
  isLoggedIn: boolean;
}

const heroLabels = [
  { name: 'ML Engineer',      value: '+4.2%', x: '8%',  y: '22%' },
  { name: 'System Design',    value: '+2.8%', x: '78%', y: '18%' },
  { name: 'Cloud Architect',  value: '+6.1%', x: '85%', y: '55%' },
  { name: 'React',            value: '+3.4%', x: '5%',  y: '62%' },
  { name: 'DevOps',           value: '+5.0%', x: '72%', y: '78%' },
  { name: 'Data Science',     value: '+7.3%', x: '18%', y: '82%' },
];

/* Parallax speed multipliers for each label — varying depths */
const parallaxMultipliers = [
  { x: 30, y: 25 },   // ML Engineer — fast
  { x: -20, y: 15 },  // System Design — medium reversed
  { x: 25, y: -30 },  // Cloud Architect — fast, inverted Y
  { x: -15, y: 20 },  // React — medium
  { x: 18, y: -18 },  // DevOps — medium
  { x: -28, y: 22 },  // Data Science — fast reversed
];

const partners = ['Vercel', 'GitHub', 'HuggingFace', 'Groq', 'React', 'TypeScript'];

/* Bar data: sorted by height so we can assign graduated opacity */
const barData = [
  { label: 'Python', h: 40 },
  { label: 'DevOps', h: 48 },
  { label: 'System', h: 55 },
  { label: 'Cloud',  h: 65 },
  { label: 'ML/AI',  h: 75 },
  { label: 'React',  h: 90 },
];

/* Exact graduated opacities per display order (L→R): Python, System, React, Cloud, ML/AI, DevOps */
const barColors: Record<string, string> = {
  Python: 'rgba(255,255,255,0.22)',
  System: 'rgba(255,255,255,0.42)',
  React:  'rgba(255,255,255,0.78)',
  Cloud:  'rgba(255,255,255,0.35)',
  'ML/AI':'rgba(255,255,255,0.58)',
  DevOps: 'rgba(255,255,255,0.72)',
};

/* Display order for chart (not sorted by height) */
const chartBars = [
  { label: 'Python', h: 40 },
  { label: 'System', h: 55 },
  { label: 'React',  h: 90 },
  { label: 'Cloud',  h: 65 },
  { label: 'ML/AI',  h: 75 },
  { label: 'DevOps', h: 48 },
];

const features = [
  { icon: 'psychology', title: 'Smart Assessments',    desc: 'Neural networks analyze 50+ career dimensions to discover your professional DNA.' },
  { icon: 'insights',   title: 'Market Intelligence',  desc: 'Hyper-localized salary data and trend forecasting powered by real-time scraping.' },
  { icon: 'forum',      title: 'Interview Simulation', desc: 'Real-time voice simulation with emotional intelligence feedback and scoring.' },
];

/* ─── 3D Tilt Hook ─── */
function use3DTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply perspective to parent context
    el.style.perspective = '800px';
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease';

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // ±12deg based on cursor position within the card
      const rotateY = ((x - centerX) / centerX) * 12;
      const rotateX = ((centerY - y) / centerY) * 12;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Intensify glow on the hovered edge
      const shadowX = (x - centerX) / centerX * 40;
      const shadowY = (y - centerY) / centerY * 40;
      el.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(90,170,120,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`;
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref]);
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  const navigate = useNavigate();

  /* Chart dimensions for SVG overlay */
  const chartH = 160;
  const barCount = chartBars.length;

  /* ─── Refs ─── */
  const heroRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const openAppBtnRef = useRef<HTMLButtonElement>(null);
  const discoverBtnRef = useRef<HTMLButtonElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const syncRateRef = useRef<HTMLSpanElement>(null);
  const svgLineRef = useRef<SVGPolylineElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Card tilt refs
  const analyticsCardRef = useRef<HTMLDivElement>(null);
  const roleSecurityCardRef = useRef<HTMLDivElement>(null);
  const trajectoryCardRef = useRef<HTMLDivElement>(null);
  const neuralResumeCardRef = useRef<HTMLDivElement>(null);
  const featureCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Apply 3D tilt to all cards
  use3DTilt(analyticsCardRef);
  use3DTilt(roleSecurityCardRef);
  use3DTilt(trajectoryCardRef);
  use3DTilt(neuralResumeCardRef);

  /* Feature card tilts — manual useEffect since we have an array */
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    featureCardRefs.current.forEach((el) => {
      if (!el) return;
      el.style.perspective = '800px';
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease';

      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 12;
        const rotateX = ((centerY - y) / centerY) * 12;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        const shadowX = (x - centerX) / centerX * 40;
        const shadowY = (y - centerY) / centerY * 40;
        el.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(90,170,120,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`;
      };
      const handleLeave = () => {
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)';
      };
      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);
      cleanups.push(() => {
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
      });
    });
    return () => cleanups.forEach(fn => fn());
  }, []);

  /* ─── EFFECT 1: Constellation Label Parallax ─── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      // Normalized -1 to 1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      labelRefs.current.forEach((label, i) => {
        if (!label) return;
        const m = parallaxMultipliers[i];
        const tx = nx * m.x;
        const ty = ny * m.y;
        label.style.transform = `translate(${tx}px, ${ty}px)`;
        label.style.transition = 'transform 0.15s ease-out';
      });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* ─── EFFECT 2: Magnetic Buttons ─── */
  const applyMagnet = useCallback((btn: HTMLButtonElement | null, isOpenApp: boolean) => {
    if (!btn) return () => {};
    const RADIUS = 120;
    const MAX_PULL = 18;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = 1 - (dist / RADIUS);
        const tx = (dx / RADIUS) * MAX_PULL * pull;
        const ty = (dy / RADIUS) * MAX_PULL * pull;
        btn.style.transform = `translate(${tx}px, ${ty}px)`;
        btn.style.transition = 'transform 0.12s ease-out';
      } else {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
      }
    };

    const handleEnter = () => {
      if (isOpenApp) {
        btn.style.backgroundColor = '#e8ffe0';
        btn.style.boxShadow = '0 0 30px rgba(90,170,120,0.6)';
      } else {
        btn.style.borderColor = 'rgba(90,170,120,0.5)';
        btn.style.boxShadow = '0 0 25px rgba(90,170,120,0.4)';
        btn.style.color = '#fff';
      }
    };

    const handleLeave = () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
      if (isOpenApp) {
        btn.style.backgroundColor = 'white';
        btn.style.boxShadow = 'none';
      } else {
        btn.style.borderColor = 'rgba(255,255,255,0.15)';
        btn.style.boxShadow = 'none';
        btn.style.color = 'rgba(255,255,255,0.7)';
      }
    };

    // The magnetic effect uses window mousemove for long-range detection
    window.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseenter', handleEnter);
    btn.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseenter', handleEnter);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useEffect(() => {
    const c1 = applyMagnet(openAppBtnRef.current, true);
    const c2 = applyMagnet(discoverBtnRef.current, false);
    return () => { c1(); c2(); };
  }, [applyMagnet]);

  /* ─── EFFECT 3: Scroll-triggered Bar Chart Animation ─── */
  useEffect(() => {
    const section = analyticsRef.current;
    if (!section) return;

    let triggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();

          // Animate bars from 0 to final height
          barRefs.current.forEach((bar, i) => {
            if (!bar) return;
            const finalH = chartBars[i].h;
            bar.style.height = '0%';
            bar.style.transition = 'none';
            // Force reflow
            void bar.offsetHeight;
            requestAnimationFrame(() => {
              bar.style.transition = 'height 800ms ease-out';
              bar.style.height = `${finalH}%`;
            });
          });

          // Animate SVG line draw
          const line = svgLineRef.current;
          if (line) {
            const length = line.getTotalLength();
            line.style.strokeDasharray = `${length}`;
            line.style.strokeDashoffset = `${length}`;
            line.style.transition = 'none';
            void line.getBoundingClientRect();
            requestAnimationFrame(() => {
              line.style.transition = 'stroke-dashoffset 1000ms ease-out';
              line.style.strokeDashoffset = '0';
            });
          }

          // Stagger fade-in for trend pills
          pillRefs.current.forEach((pill, i) => {
            if (!pill) return;
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(16px)';
            pill.style.transition = 'none';
            void pill.offsetHeight;
            setTimeout(() => {
              pill.style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';
              pill.style.opacity = '1';
              pill.style.transform = 'translateY(0)';
            }, 600 + i * 150);
          });

          // Count up 0 → 88
          const statEl = syncRateRef.current;
          if (statEl) {
            let current = 0;
            const target = 88;
            const duration = 800;
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.round(eased * target);
              statEl.textContent = `${current}%`;
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* ─── EFFECT 5: Cursor Glow Trail in Hero ─── */
  useEffect(() => {
    const hero = heroRef.current;
    const glow = cursorGlowRef.current;
    if (!hero || !glow) return;

    let raf: number;
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let isInHero = false;

    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      if (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      ) {
        isInHero = true;
        glow.style.opacity = '1';
      } else {
        isInHero = false;
        glow.style.opacity = '0';
      }
    };

    const handleLeave = () => {
      isInHero = false;
      glow.style.opacity = '0';
    };

    const animate = () => {
      if (isInHero) {
        // Smooth lag
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        glow.style.transform = `translate(${glowX - 180}px, ${glowY - 180}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    hero.addEventListener('mousemove', handleMove);
    hero.addEventListener('mouseleave', handleLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener('mousemove', handleMove);
      hero.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] font-body text-white antialiased overflow-x-hidden selection:bg-white/10">

      {/* ─── Navigation (UNCHANGED) ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center max-w-6xl mx-auto px-6 py-5">
        <span className="text-base font-headline font-bold tracking-tight text-white/90">CareerAI</span>
        <div className="hidden md:flex items-center gap-7">
          <a href="#features" className="text-[13px] font-light text-white/50 hover:text-white/90 transition-colors tracking-wide">Features</a>
          <a href="#analytics" className="text-[13px] font-light text-white/50 hover:text-white/90 transition-colors tracking-wide">Analytics</a>
          <a href="#footer" className="text-[13px] font-light text-white/50 hover:text-white/90 transition-colors tracking-wide">About</a>
        </div>
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="text-[13px] font-light text-white/70 hover:text-white border border-white/15 px-4 py-1.5 rounded-lg transition-all hover:border-white/30"
            >
              Sign In
            </button>
          )}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ─── Hero (UNCHANGED) ─── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 technical-grid overflow-hidden">
        <div className="hero-glow"></div>

        {/* EFFECT 5: Cursor glow element */}
        <div
          ref={cursorGlowRef}
          style={{
            position: 'absolute',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle 180px, rgba(80,200,120,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 5,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            willChange: 'transform',
          }}
        ></div>

        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="12%" y1="26%" x2="40%" y2="42%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="80%" y1="22%" x2="60%" y2="42%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="87%" y1="58%" x2="65%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="8%" y1="65%" x2="38%" y2="55%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="74%" y1="80%" x2="58%" y2="60%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="20%" y1="85%" x2="42%" y2="60%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="12%" y1="26%" x2="80%" y2="22%" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="8%" y1="65%" x2="87%" y2="58%" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </svg>
          {heroLabels.map((label, i) => (
            <div
              key={i}
              ref={(el) => { labelRefs.current[i] = el; }}
              className="absolute flex flex-col items-start"
              style={{ left: label.x, top: label.y, willChange: 'transform' }}
            >
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <span className="text-[11px] font-light text-white/50 tracking-wide">{label.name}</span>
              </div>
              <span className="text-[10px] font-light text-white/25 mt-1 ml-5">{label.value}</span>
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto pt-28 pb-8">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-white mb-7 leading-[1.08]">
            One-click for<br />Career Defense
          </h1>
          <p className="text-white/40 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto mb-12" style={{ letterSpacing: '0.02em' }}>
            Precision engineering for the modern professional. Protect your trajectory with AI-driven market intelligence and skill synchronization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <button
              ref={openAppBtnRef}
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")}
              className="bg-white text-[#0a0a0a] px-7 py-3 rounded-lg font-medium text-sm hover:bg-white/90 transition-all"
              style={{ willChange: 'transform' }}
            >
              {isLoggedIn ? "Launch Dashboard" : "Open App"}
            </button>
            <button
              ref={discoverBtnRef}
              className="text-white/70 border border-white/15 px-7 py-3 rounded-lg font-medium text-sm hover:border-white/30 hover:text-white transition-all"
              style={{ willChange: 'transform' }}
            >
              Discover More
            </button>
          </div>
          <div className="flex items-end justify-center gap-[3px] h-12 opacity-[0.12]">
            {[40, 55, 70, 45, 80, 60, 90, 50, 75, 35].map((h, i) => (
              <div key={i} className="w-[1.5px] bg-white rounded-full" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center gap-0 mt-12 mb-20">
          {partners.map((name, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-px h-4 bg-white/10 mx-5"></div>}
              <span className="text-[11px] text-white/30 tracking-widest uppercase font-light">{name}</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ─── Bento Analytics Section ─── */}
      <section id="analytics" className="relative max-w-6xl mx-auto px-6 pb-40" ref={analyticsRef}>
        <div className="section-glow"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* ── Market Demand vs Current Capability ── */}
          <div ref={analyticsCardRef} className="md:col-span-8 glass-card p-10 flex flex-col relative overflow-hidden min-h-[480px]">
            {/* Header row */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-white/30 font-light uppercase mb-3 block" style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>Precision Analytics</span>
                <h3 className="text-2xl font-headline font-bold text-white/90">Market Demand vs. Current Capability</h3>
              </div>
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-5 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  <span className="text-white/50 font-light" style={{ fontSize: '0.7rem' }}>Market Demand</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#5aaa78' }}></div>
                  <span className="text-white/50 font-light" style={{ fontSize: '0.7rem' }}>Your Skills</span>
                </div>
              </div>
            </div>

            {/* Chart area */}
            <div className="flex-1 flex items-end gap-0 mt-auto relative" style={{ height: `${chartH + 24}px` }}>
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between h-full pr-3 pb-6 flex-shrink-0" style={{ height: `${chartH}px` }}>
                {['100%', '75%', '50%', '25%'].map((lbl) => (
                  <span key={lbl} className="text-white/25 font-light leading-none" style={{ fontSize: '0.65rem' }}>{lbl}</span>
                ))}
              </div>

              {/* Bars + grid container */}
              <div className="flex-1 relative" style={{ height: `${chartH}px` }}>
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}></div>
                  ))}
                </div>

                {/* Bars */}
                <div className="relative h-full flex items-end gap-4 z-10">
                  {chartBars.map((bar, i) => (
                    <div key={i} className="flex-1 h-full flex flex-col justify-end items-center">
                    <div
                      ref={(el) => { barRefs.current[i] = el; }}
                      className="w-full rounded-t-sm"
                      style={{ height: `${bar.h}%`, background: barColors[bar.label] || 'rgba(255,255,255,0.3)' }}
                    ></div>
                      <span className="text-white/20 mt-2 font-light tracking-wider" style={{ fontSize: '0.6rem' }}>{bar.label}</span>
                    </div>
                  ))}
                </div>

                {/* SVG line graph overlay */}
                <svg
                  className="absolute inset-0 z-20 pointer-events-none"
                  viewBox={`0 0 600 ${chartH}`}
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: `${chartH}px` }}
                >
                  <polyline
                    ref={svgLineRef}
                    fill="none"
                    stroke="rgba(90,170,120,0.5)"
                    strokeWidth="1.5"
                    points={chartBars.map((bar, i) => {
                      const x = (i + 0.5) * (600 / barCount);
                      const y = chartH * (1 - bar.h / 100);
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  {chartBars.map((bar, i) => {
                    const x = (i + 0.5) * (600 / barCount);
                    const y = chartH * (1 - bar.h / 100);
                    return <circle key={i} cx={x} cy={y} r="3" fill="#5aaa78" />;
                  })}
                </svg>
              </div>

              {/* Sync Rate stat */}
              <div className="text-right pl-6 flex-shrink-0 self-start">
                <div className="flex items-center gap-2">
                  <span ref={syncRateRef} className="text-3xl font-headline font-bold text-white/80">88%</span>
                  {/* Sparkline */}
                  <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-60">
                    <polyline fill="none" stroke="#5aaa78" strokeWidth="1.5" points="0,15 8,12 16,8 24,10 32,5 40,3" />
                  </svg>
                </div>
                <div className="text-white/20 mt-0.5 font-light uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>Sync Rate</div>
                <div className="mt-1 font-light" style={{ fontSize: '0.7rem', color: '#5aaa78' }}>↑ +3.2% this month</div>
              </div>
            </div>

            {/* Trend pills */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {[
                { text: '↑ React trending', green: true },
                { text: '↑ ML/AI rising', green: true },
                { text: '→ DevOps stable', green: false },
              ].map((pill, i) => (
                <span
                  key={i}
                  ref={(el) => { pillRefs.current[i] = el; }}
                  className="font-light"
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${pill.green ? 'rgba(90,170,120,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '20px',
                    padding: '3px 10px',
                  }}
                >
                  {pill.text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Role Security ── */}
          <div ref={roleSecurityCardRef} className="md:col-span-4 glass-card p-10 flex flex-col justify-center items-center text-center min-h-[480px]">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="#5aaa78"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - 0.74)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white/80">74%</span>
                <span className="text-white/25 mt-0.5 font-light uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}>Secure</span>
              </div>
            </div>
            <div className="font-light mb-3" style={{ fontSize: '0.7rem', color: '#5aaa78' }}>↑ +2.1% vs last quarter</div>
            <h4 className="text-lg font-headline font-bold text-white/80 mb-2">Role Security</h4>
            <p className="text-[13px] text-white/30 leading-relaxed max-w-[220px] font-light mb-4">Probability score based on recent technical market shifts.</p>
            <div className="text-left w-full max-w-[220px] space-y-1">
              <p className="text-white/40 font-light" style={{ fontSize: '0.7rem' }}>• 847 roles analyzed</p>
              <p className="text-white/40 font-light" style={{ fontSize: '0.7rem' }}>• 23 skill vectors matched</p>
              <p className="text-white/40 font-light" style={{ fontSize: '0.7rem' }}>• Updated 2h ago</p>
            </div>
          </div>

          {/* ── Trajectory Shield ── */}
          <div ref={trajectoryCardRef} className="md:col-span-4 glass-card p-8 flex flex-col justify-between min-h-[340px]">
            <div className="flex justify-between items-start">
              <div
                className="p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl"
                style={{ boxShadow: '0 0 20px rgba(80, 160, 100, 0.2)' }}
              >
                <span className="material-symbols-outlined text-white/50 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"></div>
                <span className="text-white/30 font-light uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>Active</span>
              </div>
            </div>
            <div className="mt-auto space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>
                  <span className="text-white/20 font-light">Shield Strength</span>
                  <span className="text-white/40 font-light">85%</span>
                </div>
                <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] rounded-full" style={{ background: 'linear-gradient(to right, #4a9060, #6db88a)' }}></div>
                </div>
              </div>
              <h4 className="text-lg font-headline font-bold text-white/80 pt-2">Trajectory Shield</h4>
              <p className="text-[13px] text-white/30 leading-relaxed font-light">Automated protection against industry obsolescence.</p>
            </div>
          </div>

          {/* ── Neural Resume Optimization ── */}
          <div ref={neuralResumeCardRef} className="md:col-span-8 glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[340px]">
            <div className="max-w-md">
              <span className="text-white/30 font-light uppercase mb-3 block" style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>AI Engine</span>
              <h4 className="text-2xl font-headline font-bold text-white/80 mb-4">Neural Resume Optimization</h4>
              <p className="text-[13px] text-white/30 leading-relaxed mb-7 font-light">Our AI rewrites your professional narrative in real-time based on live hiring signals from 2M+ job postings.</p>
              <div className="flex gap-8">
                <div>
                  <div className="text-xl font-bold text-white/70">2.4M</div>
                  <div className="text-white/20 mt-0.5 font-light uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>Jobs Analyzed</div>
                </div>
                <div className="border-l border-white/[0.08] pl-8">
                  <div className="text-xl font-bold text-white/70">+37%</div>
                  <div className="text-white/20 mt-0.5 font-light uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}>Response Rate</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block flex-shrink-0 opacity-[0.15]">
              <svg width="180" height="180" viewBox="0 0 200 200">
                {[[30,50],[30,100],[30,150],[100,30],[100,80],[100,130],[100,170],[170,60],[170,110],[170,160]].map(([cx,cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3" fill="white" />
                ))}
                {[[30,50,100,30],[30,50,100,80],[30,100,100,80],[30,100,100,130],[30,150,100,130],[30,150,100,170],[100,30,170,60],[100,80,170,60],[100,80,170,110],[100,130,170,110],[100,130,170,160],[100,170,170,160]].map(([x1,y1,x2,y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.5" opacity="0.4" />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section
        id="features"
        className="relative max-w-6xl mx-auto px-6 pt-4 pb-[60px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Heading glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top: 0,
            width: '700px',
            height: '300px',
            background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(50,100,65,0.18) 0%, transparent 70%)',
          }}
        ></div>

        <div className="relative text-center mb-16 pt-16">
          <h2 className="relative z-10 font-headline text-3xl md:text-4xl font-bold text-white/85 tracking-tight mb-4">Built for precision</h2>
          <p className="relative z-10 text-white/30 text-sm max-w-md mx-auto leading-relaxed font-light" style={{ letterSpacing: '0.02em' }}>
            Every tool calibrated to protect your professional trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              ref={(el) => { featureCardRefs.current[i] = el; }}
              className="feature-card p-8 flex flex-col gap-6"
            >
              <div className="p-2.5 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.13)' }}>
                <span className="material-symbols-outlined text-white/70 text-xl">{feature.icon}</span>
              </div>
              <div>
                <h4 className="text-base font-headline font-bold text-white/80 mb-2">{feature.title}</h4>
                <p className="text-[13px] text-white/30 leading-relaxed font-light">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grounding glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none"
          style={{
            width: '700px',
            height: '200px',
            background: 'radial-gradient(ellipse 40% 30% at 50% 100%, rgba(50,100,65,0.12) 0%, transparent 70%)',
          }}
        ></div>
      </section>

      {/* ─── Footer ─── */}
      <footer id="footer" className="border-t border-white/[0.06] py-14 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-white/50 text-sm font-headline font-bold">CareerAI</span>
          <div className="flex gap-8">
            <a className="text-[11px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors font-light" href="#">Privacy</a>
            <a className="text-[11px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors font-light" href="#">Terms</a>
            <a className="text-[11px] uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors font-light" href="#">Contact</a>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-white/15 font-light">© 2025 CareerAI</span>
        </div>
      </footer>

    </div>
  );
}
