from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.meeting_service import get_meeting_by_id

router = APIRouter()

@router.get("/meetings/{meeting_id}")
def fetch_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = get_meeting_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return {
        "id": meeting.id,
        "meeting_id": meeting.meeting_id,
        "platform": meeting.platform,
        "transcript": meeting.transcript,
        "summary": meeting.summary,
        "action_items": meeting.action_items,
        "processed": meeting.processed,
        "created_at": meeting.created_at,
    }
