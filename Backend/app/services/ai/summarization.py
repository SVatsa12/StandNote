import os
import re
from groq import Groq
from groq import APIConnectionError, RateLimitError, AuthenticationError, APIStatusError

def clean_summary(text: str) -> str:
    if not text:
        return text
    lines = text.splitlines()
    cleaned = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        stripped = re.sub(r'\*\*(.*?)\*\*', r'\1', stripped)
        stripped = re.sub(r'^\s*[-•]\s+', '', stripped)
        stripped = stripped.strip()
        if stripped:
            cleaned.append(stripped)
    return "\n".join(cleaned)

def summarize_transcript(transcript: str) -> str:
    if not transcript.strip():
        return "[No content found in the uploaded file.]"

    MAX_LENGTH = 15000
    trimmed_transcript = transcript[:MAX_LENGTH]

    prompt = f"Summarize this meeting transcript:\n\n{trimmed_transcript}"

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return "[Summarization skipped: API key not configured.]"
            
        client = Groq(api_key=api_key)
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes any provided text. Produce a detailed, comprehensive summary covering all key points, context, and important information. Do NOT use markdown formatting. Write in plain text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_completion_tokens=2048
        )
        
        summary = response.choices[0].message.content
        if not summary:
            return "[Summarization returned empty content.]"
        print("[DEBUG] Final generated summary:", summary)
        return clean_summary(summary)
        
    except AuthenticationError:
        print("[ERROR] Groq API authentication failed.")
        return "[Summarization failed: Invalid API key.]"
    except RateLimitError:
        print("[ERROR] Groq API rate limit exceeded.")
        return "[Summarization failed: Rate limit exceeded. Please try again later.]"
    except APIConnectionError:
        print("[ERROR] Groq API connection failed.")
        return "[Summarization failed: Could not connect to AI service.]"
    except APIStatusError as e:
        print(f"[ERROR] Groq API status error: {e.status_code} - {e.message}")
        return f"[Summarization failed: AI service error ({e.status_code}).]"
    except Exception as e:
        print(f"[ERROR] Summarization failed: {str(e)}")
        return f"[Summarization failed: {str(e)}]"
