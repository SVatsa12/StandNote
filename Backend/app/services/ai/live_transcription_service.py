# app/services/ai/live_transcription_service.py

import os
from app.services.ai.whisper_utils import transcribe_audio

def process_audio_chunk(file_path: str):
    if not os.path.exists(file_path):
        raise FileNotFoundError("Audio chunk file not found")

    result = transcribe_audio(file_path)

    return {
        "text": result["text"],
        "segments": result["segments"]  # Optional: segment-wise breakdown
    }
