import random
import os
from google import genai
from config import GEMINI_API_KEY, SYSTEM_PROMPT, FEW_SHOT_TOPICS

def generate_macro_shitpost(topic: str = None) -> str:
    """
    Generates a financial macro-shitpost using Gemini API.
    """
    api_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing. Please set it in your .env or environment.")

    client = genai.Client(api_key=api_key)
    
    selected_topic = topic or random.choice(FEW_SHOT_TOPICS)
    
    prompt = f"""
    Write 1 tweet about the following financial/macro topic: '{selected_topic}'.
    Follow the system persona rules strictly.
    Return ONLY the raw tweet text without quotes or preamble.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "system_instruction": SYSTEM_PROMPT,
            "temperature": 0.9,
        }
    )
    
    tweet_text = response.text.strip().strip('"').strip("'")
    return tweet_text

if __name__ == "__main__":
    try:
        tweet = generate_macro_shitpost()
        print("Generated Tweet Sample:\n", tweet)
    except Exception as e:
        print("Error generating tweet:", e)
