import React, { useState } from 'react';
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

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-green-100 text-green-800';
      case 'Part-time': return 'bg-blue-100 text-blue-800';
      case 'Contract': return 'bg-purple-100 text-purple-800';
      case 'Internship': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 shadow-sm">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-heading">CareerAI</span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'home') {
                        navigate('/');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Profile Section */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userProfile.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userProfile.education}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Zap className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-heading">CareerAI</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onLogout();
                navigate('/');
              }}
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-heading mb-2">
                Welcome back, {userProfile.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Ready to continue your career journey?
              </p>
            </div>

            {/* Profile Summary Card */}
            <Card className="mb-8 shadow-smooth hover:shadow-floating transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-heading mb-2">{userProfile.name}</h3>
                    <p className="text-muted-foreground mb-3">{userProfile.education}</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Member since</p>
                    <p className="font-semibold text-heading">{userProfile.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Careers Section */}
            <Card className="mb-8 shadow-smooth hover:shadow-floating transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Saved Careers
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {savedCareers.map((career) => (
                    <Card key={career.id} className="p-4 hover:shadow-md transition-all duration-200 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-heading text-lg mb-1">{career.title}</h4>
                          <p className="text-muted-foreground text-sm mb-2">{career.company} • {career.location}</p>
                          <p className="text-primary font-medium">{career.salary}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getMatchScoreColor(career.matchScore)}`}>
                            {career.matchScore}% match
                          </Badge>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getTypeColor(career.type)}`}>
                          {career.type}
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                          {career.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Saved {career.savedDate}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Progress Tracker */}
            <Card className="shadow-smooth hover:shadow-floating transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Skills Progress Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillsProgress.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${skill.color} bg-opacity-10`}>
                              <Icon className={`w-4 h-4 ${skill.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="font-medium text-heading">{skill.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-heading">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
