import os
import google.generativeai as genai

# Using sync def since live_transcription_service calls it synchronously
def transcribe_audio(file_path: str) -> dict:
    print(f"[DEBUG] Transcribing file with Gemini: {file_path}")

    if not os.path.exists(file_path):
        raise FileNotFoundError("Audio file not found")

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set")
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel("gemini-2.0-flash")
        
        with open(file_path, "rb") as f:
            audio_data = f.read()

        ext = os.path.splitext(file_path)[1].lower()
        mime_type_by_ext = {
            ".wav": "audio/wav",
            ".mp3": "audio/mpeg",
            ".m4a": "audio/mp4",
            ".aac": "audio/aac",
            ".flac": "audio/flac",
            ".ogg": "audio/ogg",
            ".webm": "audio/webm",
        }
        mime_type = mime_type_by_ext.get(ext, "audio/wav")
        
        response = model.generate_content([
            "Transcribe this audio accurately. Return only the transcript text, nothing else.",
            {
                "mime_type": mime_type,
                "data": audio_data
            }
        ])
        
        full_text = (response.text or "").strip() or "No speech was detected."
        
        return {
            "text": full_text,
            "segments": [] # Gemini plain usage doesn't natively return timed speaker segments
        }

    except Exception as e:
        print("[ERROR] Gemini transcription failed:", str(e))
        raise RuntimeError(f"Transcription failed: {e}")
