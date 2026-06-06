from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.services.ai.summarization import summarize_transcript, clean_summary
from app.services.ai.transcription import transcribe_audio
import tempfile
import os
import uuid
from app.database import get_db
from app.services.meeting_service import save_meeting
from pypdf import PdfReader

from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()

class TranscriptInput(BaseModel):
    transcript: str

@router.post("/transcript")
async def summarize(data: TranscriptInput):
    try:
        summary = summarize_transcript(data.transcript)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize-audio")
async def summarize_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(status_code=400, detail="Invalid audio format")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        transcript_text = transcribe_audio(tmp_path).get("text", "")
        summary = summarize_transcript(transcript_text)

        os.remove(tmp_path)

        # Save to database
        meeting_data = {
            "platform": "custom_upload",
            "meeting_id": str(uuid.uuid4()),
            "transcript": transcript_text,
            "summary": clean_summary(summary),
            "processed": 2
        }

        saved_meeting = save_meeting(db, meeting_data)

        return {
            "message": "Audio summarized and stored successfully",
            "meeting": {
                "id": saved_meeting.id,
                "meeting_id": saved_meeting.meeting_id,
                "platform": saved_meeting.platform,
                "transcript": saved_meeting.transcript,
                "summary": saved_meeting.summary,
                "processed": saved_meeting.processed,
                "created_at": saved_meeting.created_at
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/summarize-file")
async def summarize_file(file: UploadFile = File(...)):
    contents = await file.read()
    if file.filename.endswith(".txt"):
        text = contents.decode("utf-8")
    elif file.filename.endswith(".pdf"):
        import io
        reader = PdfReader(io.BytesIO(contents))
        text = " ".join([page.extract_text() or "" for page in reader.pages])
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    summary = summarize_transcript(text)
    return {"summary": summary}
    


