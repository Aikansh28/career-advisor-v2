import pandas as pd
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
    
    # Build path to CSV file
    csv_path = os.path.join(script_dir, "..", "data", "careers_updated_with_embeddings_text.csv")
    
    # Check if file exists
    if not os.path.exists(csv_path):
        print(f"❌ ERROR: File not found at: {csv_path}")
        print(f"📂 Current directory: {os.getcwd()}")
        print(f"📂 Script directory: {script_dir}")
        return
    
    # Load careers CSV
    print(f"📂 Loading careers from {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded {len(df)} careers")
    
    # Generate embeddings
    embeddings = []
    for idx, row in df.iterrows():
        embedding_text = row['embedding_text']
        
        # Generate embedding
        embedding = model.encode(embedding_text, convert_to_numpy=True)
        embeddings.append(embedding)
        
        # Progress
        if (idx + 1) % 10 == 0:
            print(f"   ✅ Processed {idx + 1}/{len(df)} careers")
    
    # Add embeddings to dataframe
    df['career_vector'] = embeddings
    
    # Save to pickle in the same directory as the script
    output_path = os.path.join(script_dir, "careers_final_with_embeddings.pkl")
    df.to_pickle(output_path)
    print(f"✅ Saved embeddings to {output_path}")
    
    print(f"✨ Complete! Generated {len(df)} embeddings")
    print(f"📊 Embedding dimension: {len(embeddings[0])}")

if __name__ == "__main__":
    generate_embeddings()