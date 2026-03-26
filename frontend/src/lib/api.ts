// src/lib/api.ts
import axios from 'axios';

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL;

// -------------------------
// Type Definitions
// -------------------------

export interface StudentProfile {
  education: string;
  skills: string[];
  interests: string[];
  subjects: string[];
  goals: string;
}

export interface CareerRecommendation {
  career_name: string;
  similarity_score: number;
  category: string;
  description: string;
  expected_salary: string;
  in_demand_skills: string | string[];
  core_skills: string | string[];
  learning_resources: string | string[];
  growth_path: string;
  roadmap: string | null;
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: CareerRecommendation[];
  profile_summary: {
    education: string;
    skills_count: number;
    interests_count: number;
  };
}

// -------------------------
// API Functions
// -------------------------

/**
 * Get career recommendations from backend
 */
export async function getCareerRecommendations(
  formData: {
    name?: string;
    education: string;
    skills: string[];
    interests: string[];
  }
): Promise<RecommendationResponse> {
  try {
    // Transform frontend form data to match backend expected format
   const studentProfile: StudentProfile = {
  education: formData.education || '',
  skills: formData.skills || [],
  interests: formData.interests || [],
  subjects: formData.subjects || [],
  goals: formData.goals || ''
};

    console.log('Sending to backend:', studentProfile);

    // Make POST request to backend
    const response = await axios.post<RecommendationResponse>(
      `${API_URL}/recommend-career`,
      studentProfile,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout (roadmap generation takes time)
      }
    );

    console.log('Received from backend:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response) {
        // Backend returned an error response
        console.error('Backend error:', error.response.data);
        throw new Error(
          error.response.data.detail || 
          'Failed to get career recommendations. Please try again.'
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.message);
        throw new Error(
          `Could not connect to the career advisor service. Please make sure the backend is running on ${API_URL}`
        );
      }
    }
    
    // Generic error
    console.error('Error getting recommendations:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Health check - verify backend is running
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000,
    });
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}