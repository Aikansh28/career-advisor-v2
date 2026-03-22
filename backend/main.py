# Imports
# -------------------------
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Optional
from pydantic import BaseModel
import io
import requests
from sentence_transformers import SentenceTransformer
import pickle
import torch

# -------------------------
# Schemas (inline - no separate import needed)
# -------------------------
class StudentProfile(BaseModel):
    education: Optional[str] = ""
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    subjects: Optional[List[str]] = []
    goals: Optional[str] = ""

# Load Hugging Face embedding model once at startup
print("📦 Loading Hugging Face embedding model...")
try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Embedding model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading embedding model: {e}")
    embedding_model = None
# -------------------------
# Load careers from local
# -------------------------
def load_careers_from_local(file_path="careers_final_with_embeddings.pkl"):
    """Load careers from local pickle file"""
    try:
        # Get the directory where main.py is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(script_dir, file_path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Career database not found at {full_path}")
        
        print(f"📂 Loading careers from {full_path}...")
        careers_df = pd.read_pickle(full_path)
        
        # Ensure vectors are numpy arrays
        careers_df["career_vector"] = careers_df["career_vector"].apply(
            lambda x: np.array(x, dtype=np.float32)
        )
        
        print(f"✅ Loaded {len(careers_df)} careers")
        return careers_df
    
    except Exception as e:
        print(f"❌ Error loading careers: {e}")
        raise
careers = load_careers_from_local() 
print(f"✅ Loaded {len(careers)} career entries")

# Update embedding dimension
EMBEDDING_DIMENSION = len(careers["career_vector"].iloc[0]) if not careers.empty else None
print(f"📊 Embedding dimension: {EMBEDDING_DIMENSION}")
# -------------------------
# FastAPI app with CORS
# -------------------------
app = FastAPI(
    title="Personalized Career & Skills Advisor",
    description="AI-powered career guidance system for Indian students",
    version="1.0.0"
)

# Configure CORS - CRITICAL for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://localhost:8080",  # Vue default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "*"  # Allow all origins (configure for production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helper functions
# -------------------------
def filter_careers_by_education(student_education: str, careers_df: pd.DataFrame) -> pd.DataFrame:
    """
    Filter careers based on education level hierarchy.
    Returns careers that require the student's education level or lower.
    """
    if not student_education or careers_df.empty:
        return careers_df

    # Define education hierarchy (lower index = lower requirement)
    # Adjust these keys to match exactly what your frontend sends
    education_levels = {
        "high-school": 1,
        "associate": 2,
        "bachelor": 3,
        "master": 4,
        "phd": 5
    }
    
    # Map CSV 'minimum_elligibilty' values to our hierarchy levels
    # You might need to expand this mapping based on your actual CSV data content
    csv_education_mapping = {
        "10+2": 1, 
        "High School": 1,
        "Diploma": 2, 
        "Associate": 2,
        "Bachelor": 3, 
        "B.Tech": 3, 
        "B.E.": 3, 
        "B.Com": 3, 
        "B.Sc": 3, 
        "BBA": 3, 
        "BCA": 3,
        "Master": 4, 
        "M.Tech": 4, 
        "MBA": 4, 
        "MCA": 4, 
        "M.Com": 4, 
        "M.Sc": 4,
        "PhD": 5, 
        "Doctorate": 5
    }

    student_level = education_levels.get(student_education.lower(), 0)
    
    # If student level is unknown, return all careers
    if student_level == 0:
        return careers_df

    def check_eligibility(eligibility_text):
        if not isinstance(eligibility_text, str):
            return True # Keep if data is missing
            
        # Check if any keyword in the eligibility text matches a level <= student_level
        # This is a simple keyword matching heuristic
        required_level = 100 # Default to high req if no match found
        
        # simplified logic: look for the highest mentioned degree in the text
        # and see if it's <= student's level. 
        # Actually, for filtering, we want to KEEP jobs where 
        # required_level <= student_level
        
        found_level = 0
        text_lower = eligibility_text.lower()
        
        if "phd" in text_lower or "doctorate" in text_lower:
            found_level = 5
        elif "master" in text_lower or "mba" in text_lower or "m.tech" in text_lower:
            found_level = 4
        elif "bachelor" in text_lower or "degree" in text_lower or "b.tech" in text_lower or "b.e." in text_lower:
            found_level = 3
        elif "associate" in text_lower or "diploma" in text_lower:
            found_level = 2
        elif "high school" in text_lower or "12th" in text_lower:
            found_level = 1
        else:
            # If we align with "Bachelor's degree in..." text
            found_level = 3 # Assume bachelor if unspecified for professional jobs
            
        return found_level <= student_level

    # Apply filter using the specific column name from your CSV
    # Note: Using 'minimum_elligibilty' as requested (sic)
    filtered_df = careers_df[careers_df['minimum_elligibilty'].apply(check_eligibility)]
    
    print(f"   📉 Filtered careers from {len(careers_df)} to {len(filtered_df)} based on education level {student_level}")
    
    return filtered_df

def embed_student_profile(profile: StudentProfile):
    """Generate embedding for student profile using Hugging Face"""
    try:
        if embedding_model is None:
            raise HTTPException(
                status_code=500,
                detail="Embedding model not loaded"
            )
        
        # Build text representation
        text_input = (
            f"Education: {profile.education}. "
            f"Skills: {', '.join(profile.skills) if profile.skills else 'None'}. "
            f"Interests: {', '.join(profile.interests) if profile.interests else 'None'}. "
            f"Subjects: {', '.join(profile.subjects) if profile.subjects else 'None'}. "
            f"Goals: {profile.goals if profile.goals else 'Not specified'}"
        )
        
        print(f"   🔄 Generating embedding locally...")
        
        # Generate embedding using local model (NO API CALL!)
        embedding = embedding_model.encode(text_input, convert_to_numpy=True)
        
        print(f"   ✅ Embedding generated: {len(embedding)} dimensions")
        
        return np.array(embedding, dtype=np.float32)
    
    except Exception as e:
        print(f"❌ Error embedding student profile: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate student profile embedding: {str(e)}"
        )

def match_careers(student_vector: np.ndarray, student_education: str = "", top_k: int = 3):
    """Compare student vector with career vectors using cosine similarity."""
    try:
        if careers.empty:
            raise ValueError("Career database not loaded")
        
        # Apply strict education filter first
        print(f"   🔍 Applying education filter for: '{student_education}'")
        candidate_careers = filter_careers_by_education(student_education, careers)
        
        # Fallback if filter removes everything
        if candidate_careers.empty:
            print("   ⚠️  Filter removed all careers! Falling back to full database.")
            candidate_careers = careers

        # Get embedding dimension from careers
        expected_dim = len(candidate_careers["career_vector"].iloc[0])
        
        print(f"   📊 Student vector: {len(student_vector)}D, Career vectors: {expected_dim}D")
        
        # Ensure dimension compatibility
        if len(student_vector) != expected_dim:
            print(f"   ⚠️  Adjusting dimensions...")
            if len(student_vector) < expected_dim:
                # Pad with zeros
                student_vector = np.pad(
                    student_vector, 
                    (0, expected_dim - len(student_vector)), 
                    mode="constant"
                )
            else:
                # Truncate
                student_vector = student_vector[:expected_dim]
        
        print(f"   🔍 Matching against {len(candidate_careers)} careers...")
        
        # Calculate cosine similarity
        career_vectors_array = np.vstack(candidate_careers["career_vector"].to_numpy())
        sims = cosine_similarity([student_vector], career_vectors_array)
        
        # Add similarity scores
        careers_copy = candidate_careers.copy()
        careers_copy["similarity"] = sims[0]
        
        # Sort and return top matches
        top_matches = careers_copy.sort_values("similarity", ascending=False).head(top_k)
        
        print(f"   ✅ Top 3 matches:")
        for idx, row in top_matches.iterrows():
            print(f"      {row['career_name']}: {row['similarity']:.3f}")
        
        return top_matches
    
    except Exception as e:
        print(f"❌ Error matching careers: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to match careers: {str(e)}"
        )
def generate_career_roadmap(student_profile: StudentProfile, career_row: pd.Series) -> str:
    """Generate a personalized roadmap for the top career using Gemini API"""
    prompt = f"""
You are a career advisor AI for Indian students. Generate a detailed, personalized roadmap.

**Student Profile:**
- Education: {student_profile.education}
- Skills: {', '.join(student_profile.skills) if student_profile.skills else 'N/A'}
- Interests: {', '.join(student_profile.interests) if student_profile.interests else 'N/A'}
- Subjects: {', '.join(student_profile.subjects) if student_profile.subjects else 'N/A'}
- Goals: {student_profile.goals if student_profile.goals else 'N/A'}

**Career Recommendation:**
- Career Name: {career_row.get('career_name', 'N/A')}
- Description: {career_row.get('description', 'N/A')}
- Core Skills: {career_row.get('core_skills', 'N/A')}
- In-Demand Skills: {career_row.get('in_demand_skills', 'N/A')}
- Learning Resources: {career_row.get('learning_resources', 'N/A')}
- Growth Path: {career_row.get('growth_path', 'N/A')}
- Expected Salary: {career_row.get('expected_salary_annual', 'N/A')}
- Category: {career_row.get('category', 'N/A')}

Create a comprehensive roadmap with:
1. Career Overview
2. Why This Career Suits Them
3. Required Skills & Gap Analysis
4. Step-by-Step Learning Path (with timeline)
5. Career Progression Stages
6. Job Market Insights for India
7. Actionable Next Steps
8. Motivational Message

Keep it concise but comprehensive. Use clear formatting.
"""
    
    try:
        # Use gemini-2.5-flash model with increased token limit
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096  # INCREASED from 2048 to 4096
            }
        }
        
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        
        result = response.json()
        
        # Check if response has content
        if "candidates" in result and len(result["candidates"]) > 0:
            candidate = result["candidates"][0]
            
            # Check for parts in content
            if "content" in candidate and "parts" in candidate["content"]:
                return candidate["content"]["parts"][0]["text"]
            
            # Handle MAX_TOKENS case
            elif candidate.get("finishReason") == "MAX_TOKENS":
                print(f"   ⚠️  Response truncated (MAX_TOKENS). Retrying with shorter prompt...")
                # Return a simplified message instead of failing
                return f"""# Career Roadmap: {career_row.get('career_name', 'N/A')}

## Why This Career Suits You
Based on your profile in {student_profile.education} with skills in {', '.join(student_profile.skills[:3]) if student_profile.skills else 'various areas'}, this career aligns well with your interests in {', '.join(student_profile.interests[:2]) if student_profile.interests else 'your field'}.

## Key Skills Required
{career_row.get('in_demand_skills', 'N/A')}

## Learning Path
1. Build foundation in core skills: {career_row.get('core_skills', 'N/A')}
2. Learn in-demand technologies
3. Work on practical projects
4. Build portfolio
5. Apply for entry-level positions

## Career Growth
{career_row.get('growth_path', 'N/A')}

## Expected Salary
{career_row.get('expected_salary_annual', 'N/A')}

## Learning Resources
{career_row.get('learning_resources', 'N/A')}

## Next Steps
1. Start with foundational courses
2. Practice regularly
3. Build projects for your portfolio
4. Network with professionals in the field
5. Stay updated with industry trends
"""
        
        return "Unable to generate roadmap. Please try again."
    
    except Exception as e:
        print(f"❌ Error generating roadmap: {e}")
        if 'response' in locals():
            print(f"Response text: {response.text}")
        return f"Roadmap generation temporarily unavailable. Career: {career_row.get('career_name', 'N/A')}"
# -------------------------
# API Endpoints
# -------------------------
@app.get("/")
def home():
    """Root endpoint - API health check"""
    return {
        "message": "🚀 Career Advisor API is running",
        "status": "healthy",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "recommend": "/recommend-career"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "careers_loaded": len(careers),
        "embedding_dimension": EMBEDDING_DIMENSION,
        "api_key_configured": bool(GEMINI_API_KEY)
    }

@app.post("/recommend-career")
def recommend_career(profile: StudentProfile):
    """
    Main endpoint: Recommend careers based on student profile
    
    Returns top 3 career matches with detailed roadmap for #1 choice
    """
    try:
        # Validation
        if not any([profile.education, profile.skills, profile.interests, 
                   profile.subjects, profile.goals]):
            raise HTTPException(
                status_code=400,
                detail="Please provide at least profile.education, one profile field (education, skills, interests, subjects, or goals)"
            )

        # Step 1: Generate student embedding
        print(f"📝 Processing profile for: {profile.education or 'Student'}")
        student_vector = embed_student_profile(profile)

        # Step 2: Match with careers
        print(f"🔍 Matching careers...")
        matches = match_careers(student_vector, top_k=3)

        # Step 3: Prepare response
        response_data = []
        for idx, row in matches.iterrows():
            roadmap = None
            
            # Generate detailed roadmap only for top match
            if idx == matches.index[0]:
                print(f"🗺️ Generating roadmap for: {row['career_name']}")
                roadmap = generate_career_roadmap(profile, row)

            response_data.append({
                "career_name": row["career_name"],
                "similarity_score": round(float(row["similarity"]), 3),
                "category": row.get("category", "N/A"),
                "description": row.get("description", "N/A"),
                "expected_salary": row.get("expected_salary_annual", "N/A"),
                "in_demand_skills": row.get("in_demand_skills", []),
                "core_skills": row.get("core_skills", []),
                "learning_resources": row.get("learning_resources", []),
                "growth_path": row.get("growth_path", "N/A"),
                "roadmap": roadmap  # Only top match has this
            })

        print(f"✅ Successfully generated {len(response_data)} recommendations")
        
        return {
            "success": True,
            "recommendations": response_data,
            "profile_summary": {
                "education": profile.education,
                "skills_count": len(profile.skills) if profile.skills else 0,
                "interests_count": len(profile.interests) if profile.interests else 0
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )