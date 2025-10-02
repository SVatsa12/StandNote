from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

# Your imports are correct.
from app.database import get_db
from app.models.livemeeting_model import LiveMeeting
from app.schemas.livemeeting_schema import LiveMeetingCreate, LiveMeetingResponse
# --- THIS IS THE KEY IMPORT ---
from app.services.ai.livemeeting_service import (
    create_live_meeting,
    get_live_meeting_by_id,
    delete_live_meeting,
)

router = APIRouter()


@router.post("/create", response_model=LiveMeetingResponse)
def create_meeting(
    meeting_data: LiveMeetingCreate,
    db: Session = Depends(get_db)
):
    # This route is unchanged and uses the service function correctly.
    try:
        return create_live_meeting(db=db, meeting_data=meeting_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================================
# === THIS IS THE NEW, CORRECTED /save ENDPOINT ===
# It now uses your existing service function, just like /create.
# =========================================================================
@router.post("/save", response_model=LiveMeetingResponse)
def save_meeting(
    meeting: LiveMeetingCreate, 
    db: Session = Depends(get_db)
):
    print("\n--- [Backend] '/save' endpoint entered. Calling service function. ---")
    try:
        # We simply pass the validated data from the frontend to your existing
        # service function. This is clean, safe, and reuses your code.
        saved_meeting = create_live_meeting(db=db, meeting_data=meeting)
        print(f"✅ [Backend] Service function successful. Saved meeting with new ID: {saved_meeting.id}")
        return saved_meeting
        
    except Exception as e:
        # If the service function fails, we catch the error and report it.
        print(f"❌ [Backend] The 'create_live_meeting' service failed: {e}")
        # You might already have error handling inside the service, but this is a good safety net.
        raise HTTPException(status_code=500, detail=f"An error occurred while saving the meeting: {e}")
# =========================================================================


@router.get("/all", response_model=List[LiveMeetingResponse])
def get_all_meetings(db: Session = Depends(get_db)):
    return db.query(LiveMeeting).all()


@router.get("/{meeting_id}", response_model=LiveMeetingResponse)
def get_meeting_by_id(meeting_id: int, db: Session = Depends(get_db)):
    meeting = get_live_meeting_by_id(db=db, meeting_id=meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Live meeting not found")
    return meeting


@router.delete("/{meeting_id}", response_model=dict)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = delete_live_meeting(db=db, meeting_id=meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {"message": "Meeting deleted successfully"}


@router.get("/user/{user_id}", response_model=List[LiveMeetingResponse])
def get_meetings_by_user(user_id: int, db: Session = Depends(get_db)):
    meetings = db.query(LiveMeeting).filter(LiveMeeting.user_id == user_id).all()
    if not meetings:
        return []
    return meetings