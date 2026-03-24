import os
import json
import time
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env
load_dotenv()

# Initialize Groq client
# This automatically picks up GROQ_API_KEY from the environment
client = Groq()

def generate_careers():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "careers.json")

    # 1. Load existing careers.json
    all_careers = []
    seen_names = set()
    
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            try:
                all_careers = json.load(f)
                for career in all_careers:
                    name = career.get("name", "").strip()
                    if name:
                        seen_names.add(name.lower())
                print(f"✅ Loaded {len(all_careers)} existing careers from careers.json")
            except Exception as e:
                print(f"❌ Error loading existing careers: {e}")

    # 2. Define specific underrepresented domains and careers
    batches = [
        {
            "name": "Sports",
            "careers": "Cricketer, Footballer, Basketball Player, Tennis Player, Swimmer, Sprinter, Wrestler, Hockey Player, Badminton Player, Sports Coach, Sports Manager, Sports Analyst, Sports Commentator, Esports Player, Sports Physiotherapist"
        },
        {
            "name": "Music & Performing Arts",
            "careers": "Classical Musician, Singer, Music Producer, Music Composer, Music Director, Tabla Player, Vocalist, Guitarist, Music Therapist, Sound Engineer, Lyricist, Music Teacher"
        },
        {
            "name": "Entertainment & Film",
            "careers": "Actor, Film Director, Screenwriter, Cinematographer, Film Producer, Casting Director, Stunt Performer, Voice Artist, Comedian, Stand-up Comedian, Theater Artist, Dance Choreographer"
        },
        {
            "name": "Specialized Journalism",
            "careers": "Political Journalist, Sports Journalist, Investigative Journalist, War Correspondent, Environmental Journalist, Tech Journalist, Food Critic, Travel Writer, Photo Journalist"
        },
        {
            "name": "Politics & Civil Services",
            "careers": "Politician, IAS Officer, IPS Officer, Diplomat, Civil Servant, Policy Analyst, Political Analyst, Government Administrator"
        }
    ]

    print(f"🚀 Calling Groq API to generate new careers for {len(batches)} batches...")
    
    new_added = 0

    for i, batch in enumerate(batches, 1):
        batch_name = batch["name"]
        career_list = batch["careers"]
        print(f"\n📦 Processing Batch {i}/{len(batches)}: {batch_name}")
        
        prompt = f"""
        Please generate the details specifically for the following careers in the {batch_name} domain:
        {career_list}
        
        For each career, provide exactly two fields:
        - "name": The title of the career (use the exact name provided above).
        - "description": One rich sentence explaining what the career involves and what kind of person suits it.
        
        IMPORTANT INSTRUCTIONS:
        1. Your entire response must be a single, valid JSON array of objects.
        2. Do NOT include any markdown formatting, backticks, or introduction/conclusion text.
        3. Return ONLY pure JSON.
        
        Example format:
        [
            {{"name": "Career Name", "description": "Career description goes here."}}
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
                    new_added += 1
            
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
                            new_added += 1
                    print(f"✅ Recovered Partial Batch {i}: Added {added_this_batch} new careers.")
                except Exception as inner_e:
                    print(f"❌ Recovery failed: {inner_e}")
            else:
                print("Could not find a valid JSON object in the response.")
        except Exception as e:
            print(f"❌ An error occurred in batch {i}: {e}")
            
        # Avoid hitting Groq API rate limits
        if i < len(batches):
            print("⏳ Sleeping for 5 seconds to avoid rate limits...")
            time.sleep(5)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_careers, f, indent=4, ensure_ascii=False)

    print(f"\n🎉 Success! Added {new_added} new careers.")
    print(f"📈 Total careers now available: {len(all_careers)} (saved to {output_path})")

if __name__ == "__main__":
    generate_careers()