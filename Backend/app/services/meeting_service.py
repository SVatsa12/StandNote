from sqlalchemy.orm import Session
from app.models.meeting import Meeting

def save_meeting(db: Session, meeting_data: dict) -> Meeting:
    meeting = Meeting(**meeting_data)
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting

def get_meeting_by_id(db: Session, meeting_id: str):
    return db.query(Meeting).filter_by(meeting_id=meeting_id).first()
