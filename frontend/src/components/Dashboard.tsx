import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ThemeSwitcher } from './ThemeSwitcher';
import { 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  User, 
  LogOut,
  BarChart3,
  Book,
  Trophy,
  Clock,
  ArrowRight,
  Settings
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const stats = [
    {
      icon: Target,
      label: 'Career Match Score',
      value: '94%',
      change: '+12%',
      color: 'text-green-600'
    },
    {
      icon: Book,
      label: 'Skills Completed',
      value: '28',
      change: '+5',
      color: 'text-blue-600'
    },
    {
      icon: Trophy,
      label: 'Achievements',
      value: '12',
      change: '+3',
      color: 'text-amber-600'
    },
    {
      icon: Clock,
      label: 'Hours Learned',
      value: '156',
      change: '+23',
      color: 'text-purple-600'
    }
  ];

  const recommendations = [
    {
      title: 'Complete Python Fundamentals',
      description: 'Boost your programming skills with our comprehensive Python course',
      progress: 75,
      type: 'Course'
    },
    {
      title: 'Data Analysis Certification',
      description: 'Industry-recognized certification to advance your data science career',
      progress: 45,
      type: 'Certification'
    },
    {
      title: 'Machine Learning Workshop',
      description: 'Hands-on workshop covering ML algorithms and practical applications',
      progress: 0,
      type: 'Workshop'
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
                <span className="text-xl font-bold text-heading bg-gradient-primary bg-clip-text text-transparent">
                  CareerAI
                </span>
                <div className="text-xs text-muted-foreground hidden sm:block">Dashboard</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <Button variant="ghost" size="sm" className="hover:bg-muted/60 focus-ring">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  onLogout();
                  navigate('/');
                }}
                className="hover:bg-muted/60 focus-ring"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to continue your career transformation journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6 bg-gradient-card border-0 shadow-smooth hover:shadow-floating transition-all duration-300 hover-lift">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-heading">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-heading">Your Learning Path</h2>
              <Button variant="outline" size="sm" className="focus-ring">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <Card key={index} className="p-6 bg-gradient-card border-0 shadow-smooth hover:shadow-floating transition-all duration-300 group hover-lift">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-heading group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity focus-ring">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {item.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-heading">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-card border-0 shadow-smooth">
              <h3 className="text-lg font-semibold text-heading mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start focus-ring">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Take Skills Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start focus-ring">
                  <Target className="w-4 h-4 mr-2" />
                  Explore Careers
                </Button>
                <Button variant="outline" className="w-full justify-start focus-ring">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Market Trends
                </Button>
              </div>
            </Card>

            {/* Profile Completion */}
            <Card className="p-6 bg-gradient-primary text-white border-0 shadow-smooth">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Profile Completion</h3>
                    <p className="text-white/80 text-sm">85% Complete</p>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  Complete Profile
                </Button>
              </div>
            </Card>

            {/* Achievement Badge */}
            <Card className="p-6 bg-gradient-accent text-white border-0 shadow-smooth">
              <div className="text-center space-y-3">
                <Trophy className="w-8 h-8 mx-auto" />
                <div>
                  <h3 className="font-semibold">Latest Achievement</h3>
                  <p className="text-white/80 text-sm">Completed 25 Skills</p>
                </div>
                <Button variant="secondary" size="sm">
                  View All Badges
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}