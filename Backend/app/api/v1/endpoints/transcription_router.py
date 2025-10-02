from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
from app.services.ai.transcription import transcribe_audio

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file.")
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        transcript_result = transcribe_audio(tmp_path)
        os.remove(tmp_path)

        print("[DEBUG] Transcription result:", transcript_result)

        return {
            "text": transcript_result["text"],
            "segments": transcript_result["segments"]
        }

    except Exception as e:
        print("[ERROR] Transcription failed:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
