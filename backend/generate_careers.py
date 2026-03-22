import os
import json
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env
load_dotenv()

# Initialize Groq client
# This automatically picks up GROQ_API_KEY from the environment
client = Groq()

def generate_careers():
    print("🚀 Calling Groq API to generate 400 diverse careers in batches...")
    
    batches = [
        "Technology, Software Engineering, IT",
        "Hardware, Electronics, Robotics",
        "Medicine, Healthcare",
        "Psychology, Nursing, Therapy",
        "Business, Management, Entrepreneurship",
        "Finance, Accounting, Marketing",
        "Science, Research, Mathematics",
        "Data Science, Artificial Intelligence",
        "Arts, Entertainment, Content Creation",
        "Trades, Agriculture, Manufacturing"
    ]
    
    import time
    import re
    all_careers = []
    seen_names = set()

    for i, domains in enumerate(batches, 1):
        print(f"\n📦 Processing Batch {i}/10: {domains}")
        
        prompt = f"""
        Please generate exactly 35 diverse career options strictly from the following domains:
        {domains}
        
        For each career, provide exactly two fields:
        - "name": The title of the career.
        - "description": One rich sentence explaining what the career involves and what kind of person suits it.
        
        IMPORTANT INSTRUCTIONS:
        1. Your entire response must be a single, valid JSON array of objects.
        2. Do NOT include any markdown formatting, backticks, or introduction/conclusion text.
        3. Return ONLY pure JSON.
        
        Example format:
        [
            {{"name": "Software Engineer", "description": "Software engineers design, develop, and maintain software applications, suited for logical thinkers who enjoy solving complex problems."}},
            {{"name": "Professional Athlete", "description": "Professional athletes train and compete in sports at the highest level, suited for highly disciplined individuals with exceptional physical abilities and competitive drive."}}
        ]
        """

        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful career advisor assistant that outputs strictly in JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.7,
            )

            # Get the response text
            content = response.choices[0].message.content.strip()

            # Parse to ensure it's valid JSON
            # Sometimes models return markdown like ```json ... ```, so let's strip it just in case
            if content.startswith("```json"):
                content = content[7:]
                if content.endswith("```"):
                    content = content[:-3]
            elif content.startswith("```"):
                content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
            content = content.strip()
            
            careers_data = json.loads(content)
            
            # Verify and deduplicate
            added_this_batch = 0
            for career in careers_data:
                name = career.get("name", "").strip()
                if name.lower() not in seen_names:
                    seen_names.add(name.lower())
                    all_careers.append(career)
                    added_this_batch += 1
            
            print(f"✅ Batch {i} complete: Parsed {len(careers_data)} careers, added {added_this_batch} new unique careers.")

        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse JSON response for batch {i}. Error: {e}")
            
            # Use regex to forcibly extract the outermost valid JSON array from the content
            print("Attempting aggressive JSON extraction for partial results...")
            
            # Clean up potentially broken JSON at the end
            # Find the last valid closing brace }
            last_brace = content.rfind("}")
            if last_brace != -1:
                # Truncate anything after the last } and add a closing bracket
                cleaned_content = content[:last_brace+1] + "\n]"
                try:
                    careers_data = json.loads(cleaned_content)
                    added_this_batch = 0
                    for career in careers_data:
                        name = career.get("name", "").strip()
                        if name.lower() not in seen_names:
                            seen_names.add(name.lower())
                            all_careers.append(career)
                            added_this_batch += 1
                    print(f"✅ Recovered Partial Batch {i}: Added {added_this_batch} new careers.")
                except Exception as inner_e:
                    print(f"❌ Recovery failed: {inner_e}")
            else:
                print("Could not find a valid JSON object in the response.")
        except Exception as e:
            print(f"❌ An error occurred in batch {i}: {e}")
            
        # Avoid hitting Groq API rate limits
        print("⏳ Sleeping for 5 seconds to avoid rate limits...")
        time.sleep(5)

    # Get the absolute path for careers.json in the backend directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "careers.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_careers, f, indent=4, ensure_ascii=False)

    print(f"\n🎉 Success! Saved a total of {len(all_careers)} unique careers to {output_path}")

if __name__ == "__main__":
    generate_careers()