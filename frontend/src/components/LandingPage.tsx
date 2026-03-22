import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ThemeSwitcher } from './ThemeSwitcher';
import heroImage from '../assets/hero-illustration.jpg';
import featuresImage from '../assets/features-bg.jpg';
import dashboardImage from '../assets/dashboard-preview.jpg';
import { 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  Users, 
  ChevronRight, 
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Rocket,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Target,
      title: 'AI-Powered Career Matching',
      description: 'Advanced algorithms analyze your skills, interests, and goals to recommend perfect career paths.',
      color: 'bg-gradient-primary'
    },
    {
      icon: TrendingUp,
      title: 'Smart Skill Assessment',
      description: 'Comprehensive tests that adapt to your responses and provide detailed insights.',
      color: 'bg-gradient-accent'
    },
    {
      icon: BrainCircuit,
      title: 'Personalized Learning',
      description: 'Custom roadmaps and resources tailored to your unique career journey.',
      color: 'bg-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Real-Time Market Insights',
      description: 'Stay ahead with live job market trends and salary data.',
      color: 'bg-amber-500'
    },
    {
      icon: Shield,
      title: 'Progress Tracking',
      description: 'Monitor your growth with detailed analytics and achievement systems.',
      color: 'bg-blue-500'
    },
    {
      icon: Rocket,
      title: 'Career Acceleration',
      description: 'Fast-track your career with AI-optimized learning paths.',
      color: 'bg-indigo-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      content: 'CareerAI helped me transition from marketing to tech in just 6 months. The personalized roadmap was incredibly accurate.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager',
      content: 'The skill assessments revealed gaps I never knew I had. Now I\'m leading product teams at a Fortune 500 company.',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Priya Patel',
      role: 'UX Designer',
      content: 'Amazing AI insights! The career matching was spot-on and helped me land my dream job in just 3 weeks.',
      rating: 5,
      avatar: 'PP'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="nav-sticky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-smooth ai-pulse">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-heading bg-gradient-primary bg-clip-text text-transparent relative z-content">
                  CareerAI
                </span>
                <div className="text-xs text-muted-foreground hidden sm:block">AI Career Mentor</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium focus-ring rounded-md px-2 py-1">
                Features
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium focus-ring rounded-md px-2 py-1">
                Success Stories
              </a>
              <button 
                onClick={() => navigate('/about')}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium focus-ring rounded-md px-2 py-1"
              >
                About
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-9 h-9 p-0 focus-ring"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Desktop CTA Buttons */}
              <div className="hidden sm:flex items-center gap-3">
                {isLoggedIn ? (
                  <Button onClick={() => navigate('/dashboard')} className="bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-smooth focus-ring">
                    <span>Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/login')} className="hover:bg-muted/60 focus-ring">
                      Login
                    </Button>
                    <Button onClick={() => navigate('/login')} className="bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-smooth focus-ring">
                      <span>Start Free</span>
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-4">
                <a 
                  href="#features" 
                  className="block text-muted-foreground hover:text-primary transition-colors duration-200 font-medium focus-ring rounded-md px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#testimonials" 
                  className="block text-muted-foreground hover:text-primary transition-colors duration-200 font-medium focus-ring rounded-md px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Success Stories
                </a>
                <button 
                  onClick={() => {
                    navigate('/about');
                    setMobileMenuOpen(false);
                  }}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-200 font-medium focus-ring rounded-md px-2 py-2 w-full text-left"
                >
                  About
                </button>
              </nav>
              
              <div className="pt-4 border-t border-border space-y-3">
                {isLoggedIn ? (
                  <Button 
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }} 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-smooth focus-ring"
                  >
                    <span>Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }} 
                      className="w-full hover:bg-muted/60 focus-ring"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }} 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-smooth focus-ring"
                    >
                      <span>Start Free</span>
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5 z-0"></div>
        <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl ai-float z-0"></div>
        <div className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl ai-float z-0" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-content">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Powered by Advanced AI Technology</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-heading leading-none">
                Your AI-Powered
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Career Mentor
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Discover your perfect career path, master relevant skills, and accelerate your professional growth with personalized AI guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 pt-6 sm:pt-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/assessment')} 
                  className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-floating ai-glow text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto focus-ring"
                >
                  <span>Begin Your Journey</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/user-dashboard')}
                  className="w-full sm:w-auto border-2 hover:bg-muted/60 transition-all duration-200 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto focus-ring"
                >
                  <span>View Dashboard</span>
                  <Target className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:order-last">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="AI-powered career development dashboard interface"
                  className="w-full h-auto rounded-2xl shadow-floating"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center shadow-floating ai-float">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-floating ai-float" style={{animationDelay: '1s'}}>
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-heading mb-6">
              See CareerAI in 
              <span className="bg-gradient-primary bg-clip-text text-transparent">Action</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of AI-driven career insights with our intuitive dashboard
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-floating bg-gradient-card border border-border/50">
              <img 
                src={dashboardImage} 
                alt="CareerAI dashboard showing personalized career insights and learning paths"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="bg-white/90 hover:bg-white text-primary hover:text-primary border-0 shadow-floating backdrop-blur-sm w-16 h-16 rounded-full p-0 ai-pulse"
                >
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -left-4 top-1/4 hidden lg:block">
              <Card className="p-4 bg-gradient-card border-0 shadow-floating w-48 ai-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Career Match</div>
                    <div className="text-lg font-bold text-heading">94%</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute -right-4 bottom-1/4 hidden lg:block">
              <Card className="p-4 bg-gradient-card border-0 shadow-floating w-48 ai-float" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Skills Gained</div>
                    <div className="text-lg font-bold text-heading">28</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
        {/* Background illustration */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src={featuresImage} 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-content">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Intelligent Features</span>
            </div>
            <h2 className="text-display font-bold text-heading mb-6">
              Everything You Need to 
              <span className="block bg-gradient-accent bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven career development methodologies
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 sm:p-8 hover:shadow-floating transition-all duration-300 group cursor-pointer bg-gradient-card border-0 shadow-smooth hover-lift focus-ring"
                tabIndex={0}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl ${feature.color} flex items-center justify-center shadow-smooth group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-heading group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all duration-200">
                    <span className="text-sm sm:text-base">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-display font-bold text-heading mb-6">
              Trusted by Career Changers
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with CareerAI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-6 sm:p-8 bg-gradient-card border-0 shadow-smooth hover:shadow-floating transition-all duration-300 group hover-lift"
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-foreground leading-relaxed text-sm sm:text-base">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold shadow-smooth text-sm sm:text-base">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-heading text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-display font-bold text-heading">
              Ready to Transform 
              <span className="block bg-gradient-primary bg-clip-text text-transparent">Your Career?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with AI-powered guidance
            </p>
            <div className="pt-6 sm:pt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/assessment')} 
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-floating ai-glow text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 h-auto focus-ring"
              >
                <span>Start Your Free Assessment</span>
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="sm:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-smooth">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-heading">CareerAI</span>
                  <div className="text-xs text-muted-foreground">AI Career Mentor</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md text-sm sm:text-base">
                Empowering professionals worldwide with AI-driven career insights and personalized guidance for accelerated growth.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-heading text-sm sm:text-base">Product</h4>
              <div className="space-y-3 text-muted-foreground text-sm sm:text-base">
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Features</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Pricing</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">API</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Enterprise</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-heading text-sm sm:text-base">Company</h4>
              <div className="space-y-3 text-muted-foreground text-sm sm:text-base">
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">About</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Blog</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Careers</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Press</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-heading text-sm sm:text-base">Support</h4>
              <div className="space-y-3 text-muted-foreground text-sm sm:text-base">
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Help Center</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Contact</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Privacy</div>
                <div className="hover:text-primary cursor-pointer transition-colors focus-ring rounded px-1">Terms</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-muted-foreground text-sm">
            <p>© 2024 CareerAI. All rights reserved. Built with AI for the future of work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}