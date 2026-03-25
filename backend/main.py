import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import pickle
import json
from dotenv import load_dotenv
from groq import Groq

# -------------------------
# Environment & Setup
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv()

# Initialize Groq client
client = Groq()

# -------------------------
# Schemas
# -------------------------
class StudentProfile(BaseModel):
    name: Optional[str] = "Student"
    education: Optional[str] = ""
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    subjects: Optional[List[str]] = []
    goals: Optional[str] = ""

# -------------------------
# Globals (Lazy Loaded)
# -------------------------
embedding_model = None
career_embeddings_dict = None
careers_lookup = None

def get_model():
    global embedding_model
    if embedding_model is None:
        print("📦 Loading Hugging Face embedding model (Lazy Load)...")
        try:
            from sentence_transformers import SentenceTransformer
            embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ Embedding model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading embedding model: {e}")
            raise HTTPException(status_code=500, detail="Failed to load embedding model.")
    return embedding_model

def get_data():
    global career_embeddings_dict, careers_lookup
    if career_embeddings_dict is None or careers_lookup is None:
        print("📂 Loading careers data (Lazy Load)...")
        
        # 1. Load the description json
        careers_json_path = os.path.join(BASE_DIR, "careers.json")
        try:
            with open(careers_json_path, 'r', encoding='utf-8') as f:
                careers_data = json.load(f)
            careers_lookup = {c["name"]: c["description"] for c in careers_data}
            
            # 2. Generate embeddings dynamically
            print("🧠 Generating embeddings dynamically...")
            model = get_model()
            career_names = [c["name"] for c in careers_data]
            career_texts = [c["description"] for c in careers_data]
            embeddings = model.encode(career_texts)
            
            career_embeddings_dict = {name: embedding for name, embedding in zip(career_names, embeddings)}
            print("✅ Dynamic embeddings generated successfully!")
            
        except Exception as e:
            print(f"❌ Error loading careers.json or generating embeddings: {e}")
            careers_lookup = {}
            career_embeddings_dict = {}
            
    return career_embeddings_dict, careers_lookup

# -------------------------
# FastAPI app with CORS
# -------------------------
app = FastAPI(
    title="Personalized Career & Skills Advisor",
    description="AI-powered career guidance system for Indian students",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helper functions
# -------------------------
def generate_student_embedding(profile: StudentProfile):
    """Generate local text embedding using student data."""
    text_input = (
        f"Education: {profile.education}. "
        f"Skills: {', '.join(profile.skills) if profile.skills else 'None'}. "
        f"Interests: {', '.join(profile.interests) if profile.interests else 'None'}. "
        f"Subjects: {', '.join(profile.subjects) if profile.subjects else 'None'}. "
        f"Goals: {profile.goals if profile.goals else 'None'}"
    )
    
    model = get_model()
    embedding = model.encode(text_input, convert_to_numpy=True)
    return np.array(embedding, dtype=np.float32)

def generate_career_details_with_groq(profile: StudentProfile, career_name: str, career_desc: str):
    """Calls Groq to generate customized details strictly in JSON."""
    
    prompt = f"""
    You are a professional career advisor. Look at this student's profile and recommend details for the career '{career_name}'.
    
    Student Profile:
    - Name: {profile.name}
    - Education: {profile.education}
    - Skills: {', '.join(profile.skills) if profile.skills else 'None'}
    - Interests: {', '.join(profile.interests) if profile.interests else 'None'}
    - Subjects: {', '.join(profile.subjects) if profile.subjects else 'None'}
    - Goals: {profile.goals if profile.goals else 'None'}
    
    Career Info:
    - {career_name}: {career_desc}

    Return a purely valid JSON object with EXACTLY the following keys:
    {{
        "why_suited": "Why this career suits this specific student based on their profile.",
        "roadmap": "A step by step learning roadmap personalized to the student's current skills and education level.",
        "key_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
        "learning_resources": ["Resource 1 (Course/Certification/Website)", "Resource 2", "Resource 3"],
        "future_scope": "One paragraph on the future outlook of this career.",
        "education_gap": "What additional education the student needs if any, or 'None' if they already meet requirements."
    }}
    
    Do NOT output markdown (NO ```json decorators). ONLY pure JSON characters.
    """

    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You output strict pure JSON objects."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
        )

        content = response.choices[0].message.content.strip()

        # Safely strip out markdown formatting if the model disobeys
        if content.startswith("```json"): content = content[7:]
        elif content.startswith("```"): content = content[3:]
        if content.endswith("```"): content = content[:-3]
        content = content.strip()

        return json.loads(content)
        
    except Exception as e:
        print(f"❌ Error generating roadmap for {career_name} via Groq: {e}")
        # Return fallback dictionary if Groq fails
        return {
            "why_suited": "Could not generate reasoning.",
            "roadmap": "Could not generate roadmap.",
            "key_skills": [],
            "learning_resources": [],
            "future_scope": "Information currently unavailable.",
            "education_gap": "Unknown."
        }

# -------------------------
# API Endpoints
# -------------------------
@app.get("/")
def home():
    """Root endpoint - API health check"""
    return {
        "message": "🚀 Career Advisor API is running",
        "status": "healthy"
    }

@app.post("/recommend-career")
def recommend_career(profile: StudentProfile):
    """
    Find top 5 careers based on embedding cosine similarity 
    and fetch full roadmaps using Groq for each.
    """
    try:
        # Load models and data lazily
        get_model()
        embeddings_dict, lookups = get_data()

        if not embeddings_dict or not lookups:
            raise HTTPException(status_code=500, detail="Data could not be loaded.")

        # 1. Embed student
        student_vec = generate_student_embedding(profile)

        # 2. Extract careers and vectors for matching
        career_names = list(embeddings_dict.keys())
        career_vectors_array = np.vstack(list(embeddings_dict.values()))

        # 3. Compute cosine similarities
        sims = cosine_similarity([student_vec], career_vectors_array)[0]

        # 4. Find Top 5 indices
        top_indices = np.argsort(sims)[::-1][:5]
        
        # 5. Build responses via Groq API
        final_recommendations = []
        for idx in top_indices:
            career_name = career_names[idx]
            match_score = float(sims[idx])
            career_desc = lookups.get(career_name, "No description available.")

            print(f"🗺️  Consulting Groq for: {career_name} (Score: {match_score:.3f})")
            groq_details = generate_career_details_with_groq(profile, career_name, career_desc)

            final_recommendations.append({
                "career_name": career_name,
                "similarity_score": round(match_score, 3),
                "description": career_desc,
                **groq_details
            })

        print(f"✅ Successfully generated {len(final_recommendations)} recommendations")
        
        return {
            "success": True,
            "recommendations": final_recommendations
        }

    except Exception as e:
        print(f"❌ Unexpected error in /recommend: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
