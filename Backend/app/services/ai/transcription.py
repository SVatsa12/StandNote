from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
from app.services.ai.whisper_utils import transcribe_audio
import os

router = APIRouter()

@router.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    try:
        # Save uploaded audio to a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Transcribe and get full result (text + segments)
        result = transcribe_audio(tmp_path)

        # Clean up temp file
        os.remove(tmp_path)

        return {
            "text": result["text"],
            "segments": result["segments"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

