import React, { useEffect } from 'react';
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
  
  // If no recommendations, show message
  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 dark:from-background dark:via-background dark:to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-heading mb-2">No Recommendations Found</h2>
            <p className="text-muted-foreground mb-6">
              Please complete the career assessment first to get personalized recommendations.
            </p>
            <Button onClick={() => navigate('/assessment')}>
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get top match percentage for stats
  const topMatchPercentage = Math.round(recommendations[0]?.similarity_score * 100);

  const getMatchColor = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 30) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getProgressColor = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-amber-500';
    return 'bg-gray-500';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 dark:from-background dark:via-background dark:to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 dark:bg-gradient-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-2 hover:bg-muted/60"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Assessment</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-smooth">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-heading">CareerAI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            <span>AI Analysis Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            Your Recommended 
            <span className="block bg-gradient-primary bg-clip-text text-transparent">Career Paths</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Based on your profile: <strong>{userData?.education}</strong>, here are the career paths that align best with you
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <Card className="bg-white/70 dark:bg-gradient-card border-0 shadow-smooth">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-smooth mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-heading mb-1">{recommendations.length}</div>
              <div className="text-sm text-muted-foreground">Career Matches</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-gradient-card border-0 shadow-smooth">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-smooth mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-heading mb-1">{topMatchPercentage}%</div>
              <div className="text-sm text-muted-foreground">Top Match Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-gradient-card border-0 shadow-smooth">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-smooth mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-heading mb-1">
                {userData?.skills?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Your Skills</div>
            </CardContent>
          </Card>
        </div>

        {/* Career Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {recommendations.map((career: any, index: number) => {
            const IconComponent = getCategoryIcon(career.category);
            const colorClass = getCategoryColor(career.category);
            const matchPercentage = Math.round(career.similarity_score * 100);
            const skills = parseSkills(career.key_skills || []);
            
            // DEBUG: Log each career being rendered
            console.log(`🎨 Rendering career ${index + 1}:`, career.career_name);
            
            return (
              <Card 
                key={`${career.career_name}-${career.similarity_score}-${index}`}
                className="group hover:shadow-floating transition-all duration-300 cursor-pointer bg-white/70 dark:bg-gradient-card border-0 shadow-smooth hover-scale animate-fade-in flex flex-col"
                style={{animationDelay: `${0.1 * (index + 1)}s`}}
              >
                <CardHeader className="space-y-4 pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center shadow-smooth group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMatchColor(career.similarity_score)} mb-1`}>
                        {matchPercentage}%
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">Match</div>
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-xl font-bold text-heading group-hover:text-primary transition-colors duration-200 mb-2">
                      {career.career_name}
                    </CardTitle>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(career.similarity_score)}`}
                        style={{ width: `${matchPercentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {career.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 flex-1 flex flex-col justify-between pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-heading mb-1">Why This Suits You</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {career.why_suited || "Well aligned with your skills and education."}
                      </p>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-heading mb-2">Key Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 5).map((skill: string, idx: number) => (
                          <span 
                            key={`${skill}-${idx}`}
                            className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {career.education_gap && career.education_gap.toLowerCase() !== "none" && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Education Gap</span>
                        </div>
                        <p className="text-sm text-amber-700 dark:text-amber-300/90 leading-snug">
                          {career.education_gap}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 mt-auto">
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-smooth group-hover:shadow-floating"
                      onClick={() => {
                        console.log('🗺️ Navigating to roadmap for:', career.career_name);
                        // Store selected career in userData for roadmap page
                        navigate('/roadmap', { 
                          state: { 
                            career: career,
                            hasRoadmap: true
                          } 
                        });
                      }}
                    >
                      <span>View Roadmap</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 dark:from-primary/10 dark:via-accent/10 dark:to-primary/10 border-0 shadow-smooth">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-heading">
                  Ready to Start Your 
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">Career Journey?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore detailed roadmaps, skill assessments, and personalized guidance for your top career match
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => {
                      // Navigate to roadmap for top recommendation
                      navigate('/roadmap', { 
                        state: { 
                          career: recommendations[0],
                          hasRoadmap: true
                        } 
                      });
                    }}
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-floating ai-glow text-lg px-8 py-4 h-auto"
                  >
                    <span>View Top Career Roadmap</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/assessment')}
                    className="border-2 hover:bg-muted/60 transition-all duration-200 text-lg px-8 py-4 h-auto"
                  >
                    <span>Retake Assessment</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}