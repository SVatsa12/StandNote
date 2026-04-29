import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Using sync def since live_transcription_service calls it synchronously
def transcribe_audio(file_path: str) -> dict:
    print(f"[DEBUG] Transcribing file with Gemini: {file_path}")

    if not os.path.exists(file_path):
        raise FileNotFoundError("Audio file not found")

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        with open(file_path, "rb") as f:
            audio_data = f.read()
        
        response = model.generate_content([
            "Transcribe this audio accurately. Return only the transcript text, nothing else.",
            {
                "mime_type": "audio/wav",  # Assuming WAV
                "data": audio_data
            }
        ])
        
        full_text = response.text
        
        return {
            "text": full_text,
            "segments": [] # Gemini plain usage doesn't natively return timed speaker segments
        }

    except Exception as e:
        print("[ERROR] Gemini transcription failed:", str(e))
        raise RuntimeError(f"Transcription failed: {e}")
