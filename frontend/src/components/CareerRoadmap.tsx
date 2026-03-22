import React from 'react';
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

    const rawSkills = careerData.core_skills || careerData.in_demand_skills || [];
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
        title: match ? match[1] : res,
        description: `Comprehensive guide to ${match ? match[1] : res}`,
        provider: match ? match[2] : "Online Course",
        duration: "Self-paced"
      };
    });
  };

  const learningResources = parseResources();

  // Parse job roles / growth path
  const parseJobRoles = () => {
    if (!careerData) {
      return [
        { title: "Junior Data Scientist", salary: "$70,000 - $95,000", experience: "0-2 years" },
        { title: "Data Scientist", salary: "$95,000 - $130,000", experience: "2-5 years" },
        { title: "Senior Data Scientist", salary: "$130,000 - $180,000", experience: "5+ years" }
      ];
    }

    const growthPath = careerData.growth_path || "";
    // Growth path might be "Role A -> Role B -> Role C"
    const roles = growthPath.split(/->|→/).map((r: string) => r.trim());
    
    // Create salary ranges based on the expected_salary string potentially
    const baseSalary = careerData.expected_salary || "Competitve";

    return roles.map((role: string, index: number) => ({
      title: role,
      salary: index === 0 ? baseSalary : "Higher", // Placeholder
      experience: `${index * 2}-${(index + 1) * 2 + 1} years`
    }));
  };

  const jobRoles = parseJobRoles();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
      case "Advanced": return "bg-red-500/20 text-red-700 dark:text-red-300";
      default: return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/recommendations')}
            className="mb-4 p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recommendations
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedCareer}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your complete career roadmap and learning path
            </p>
          </div>
        </div>

        {/* Key Skills Required */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Key Skills Required
            </h2>
          </div>
          
          <div className="grid gap-4">
            {skills.map((skill, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <skill.icon className="w-5 h-5 text-primary mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                    <Badge className={getDifficultyColor(skill.difficulty)}>
                      {skill.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={skill.level} className="flex-1" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[3rem]">
                      {skill.level}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* Learning Resources */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Learning Resources
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningResources.map((resource, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {resource.provider}
                    </span>
                    <Badge variant="secondary">
                      {resource.duration}
                    </Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* Job Roles & Salaries */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <DollarSign className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Job Roles & Salaries
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {jobRoles.map((role, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                  <CardDescription>{role.experience}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {role.salary}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Average annual salary
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* Future Scope */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <Sparkles className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Future Scope
            </h2>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {careerData?.future_scope || (
                  careerData ? (
                    <>
                      The field of <strong>{careerData.career_name}</strong> within the <strong>{careerData.category}</strong> sector creates significant value in the modern economy. {careerData.description} With the continuous evolution of technology and industry practices, professionals in this domain can expect a robust career trajectory, typically advancing through roles such as: <strong>{careerData.growth_path}</strong>.
                    </>
                  ) : "Future scope information is currently unavailable for this career path."
                )}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Action Buttons */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/assessment')}
            className="mr-4"
          >
            Take Another Assessment
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/user-dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};