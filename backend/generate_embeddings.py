import json
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle
import os

def generate_embeddings():
    """Generate embeddings using Hugging Face model"""
    
    print("🚀 Starting embedding generation with Hugging Face...")
    
    # Load the model
    print("📦 Loading Sentence-Transformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Model loaded!")
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Build path to JSON file
    json_path = os.path.join(script_dir, "careers.json")
    
    # Check if file exists
    if not os.path.exists(json_path):
        print(f"❌ ERROR: File not found at: {json_path}")
        print(f"📂 Current directory: {os.getcwd()}")
        print(f"📂 Script directory: {script_dir}")
        return
    
    # Load careers JSON
    print(f"📂 Loading careers from {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        careers_data = json.load(f)
    print(f"✅ Loaded {len(careers_data)} careers")
    
    # Dictionary to store {career_name: embedding_vector}
    career_embeddings = {}
    
    # Generate embeddings
    for idx, career in enumerate(careers_data):
        name = career['name']
        description = career['description']
        
        # Generate embedding for the description
        embedding = model.encode(description, convert_to_numpy=True)
        career_embeddings[name] = embedding
        
        # Progress
        if (idx + 1) % 10 == 0:
            print(f"   ✅ Processed {idx + 1}/{len(careers_data)} careers")
    
    # Save to pickle in the same directory as the script
    output_path = os.path.join(script_dir, "careers_embeddings.pkl")
    with open(output_path, 'wb') as f:
        pickle.dump(career_embeddings, f)
    
    print(f"✅ Saved embeddings dictionary to {output_path}")
    
    print(f"✨ Complete! Generated {len(career_embeddings)} embeddings")
    
    # Safely get the embedding dimension length from the first item
    if len(career_embeddings) > 0:
        first_key = list(career_embeddings.keys())[0]
        dimension = len(career_embeddings[first_key])
        print(f"📊 Embedding dimension: {dimension}")
    

if __name__ == "__main__":
    generate_embeddings()