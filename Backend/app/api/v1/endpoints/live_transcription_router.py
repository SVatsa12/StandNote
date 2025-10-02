# app/api/v1/endpoints/live_transcription_router.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ai.live_transcription_service import process_audio_chunk
import tempfile, os

router = APIRouter()

@router.post("/livemeeting/stream-audio")
async def stream_audio_chunk(file: UploadFile = File(...)):
    try:
        # Save uploaded chunk to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Transcribe the chunk
        result = process_audio_chunk(tmp_path)

        # Cleanup
        os.remove(tmp_path)

        return {
            "text": result["text"],
            "segments": result["segments"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live transcription error: {str(e)}")
