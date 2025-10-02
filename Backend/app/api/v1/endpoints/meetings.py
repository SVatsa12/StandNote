# app/api/v1/endpoints/meetings.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ai.transcription import transcribe_audio
from app.services.ai.summarization import summarize_transcript
from app.services.ai.action_extractor import extract_action_items
from app.services.meeting_service import save_meeting
from app.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
import tempfile
import os
from app.models.livemeeting_model import LiveMeeting

router = APIRouter()

@router.post("/process-audio/")
async def process_meeting_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(status_code=400, detail="Invalid file format")

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        transcript = transcribe_audio(tmp_path)
        
        summary = summarize_transcript(transcript)
        action_items = extract_action_items(transcript)

        meeting_data = {
            "platform": "custom_upload",
            "meeting_id": file.filename,
            "transcript": transcript,
            "summary": summary,
            "action_items": "\n".join(action_items),
            "processed": 0
        }

        saved_meeting = save_meeting(db, meeting_data)

        os.remove(tmp_path)

        return {"message": "Meeting processed successfully", "meeting": saved_meeting}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/summarize-audio/")
async def summarize_meeting_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(status_code=400, detail="Invalid file format")

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        transcript = transcribe_audio(tmp_path)
        print("[DEBUG] Transcript from audio:", transcript[:300]) 
        summary = summarize_transcript(transcript)
        print("[DEBUG] Final summary:", summary)

        meeting_data = {
            "platform": "custom_upload",
            "meeting_id": file.filename,
            "transcript": transcript,
            "summary": summary,
            "action_items": "",  # No action items in this route
            "processed": 0
        }

        saved_meeting = save_meeting(db, meeting_data)

        os.remove(tmp_path)

        return {
            "message": "Meeting summarized successfully",
            "meeting": saved_meeting
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/latest", response_model=dict) # Use your schema here if you have one
def get_latest_meeting(db: Session = Depends(get_db)):
    """
    Fetches the most recently recorded meeting.
    """
    latest_meeting = db.query(LiveMeeting).order_by(LiveMeeting.id.desc()).first()

    if latest_meeting:
        return {
            "title": latest_meeting.title,
            "transcript": latest_meeting.transcript,
            "summary": latest_meeting.summary,
            "created_at": latest_meeting.created_at
        }
    else:
        return {
            "title": "No meetings recorded yet",
            "transcript": "The transcript of the last meeting will appear here.",
            "summary": "The summary will appear here."
        }