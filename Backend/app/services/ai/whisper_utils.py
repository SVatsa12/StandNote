import os
from groq import Groq
from groq import APIConnectionError, RateLimitError, AuthenticationError, APIStatusError

def transcribe_audio(file_path: str) -> dict:
    print(f"[DEBUG] Transcribing file with Groq: {file_path}")

    if not os.path.exists(file_path):
        return {
            "text": "[Transcription failed: Audio file not found.]",
            "segments": []
        }

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return {
                "text": "[Transcription skipped: API key not configured.]",
                "segments": []
            }
        client = Groq(api_key=api_key)
        
        with open(file_path, "rb") as f:
            audio_file = f
            response = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3-turbo",
                language="en",
                response_format="verbose_json"
            )
        
        full_text = response.text.strip() if hasattr(response, 'text') and response.text else "No speech was detected."
        
        segments = []
        if hasattr(response, 'segments') and response.segments:
            for i, seg in enumerate(response.segments):
                segments.append({
                    "start": seg.get("start", 0) if isinstance(seg, dict) else getattr(seg, "start", 0),
                    "end": seg.get("end", 0) if isinstance(seg, dict) else getattr(seg, "end", 0),
                    "text": seg.get("text", "") if isinstance(seg, dict) else getattr(seg, "text", ""),
                    "speaker": f"Speaker {i % 2 + 1}"
                })
        
        return {
            "text": full_text,
            "segments": segments
        }

    except AuthenticationError:
        print("[ERROR] Groq API authentication failed.")
        return {
            "text": "[Transcription failed: Invalid API key.]",
            "segments": []
        }
    except RateLimitError:
        print("[ERROR] Groq API rate limit exceeded.")
        return {
            "text": "[Transcription failed: Rate limit exceeded. Please try again later.]",
            "segments": []
        }
    except APIConnectionError:
        print("[ERROR] Groq API connection failed.")
        return {
            "text": "[Transcription failed: Could not connect to AI service.]",
            "segments": []
        }
    except APIStatusError as e:
        print(f"[ERROR] Groq API status error: {e.status_code} - {e.message}")
        return {
            "text": f"[Transcription failed: AI service error ({e.status_code}).]",
            "segments": []
        }
    except Exception as e:
        print(f"[ERROR] Transcription failed: {str(e)}")
        return {
            "text": f"[Transcription failed: {str(e)}]",
            "segments": []
        }
