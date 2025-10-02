from sqlalchemy.orm import Session
from app import models, schemas



def create_live_meeting(db: Session, meeting_data: schemas.LiveMeetingCreate):
    """
    This is the final, correct version. It now handles start_time and end_time.
    """
    print("\n--- [Service] Entered 'create_live_meeting' with FINAL method. ---")
    
    try:
        db_meeting = models.LiveMeeting()

        # Set all the fields from the Pydantic schema
        db_meeting.title = meeting_data.title
        db_meeting.transcript = meeting_data.transcript
        db_meeting.summary = meeting_data.summary
        db_meeting.user_id = meeting_data.user_id
        
        # === THIS IS THE KEY CHANGE ===
        # We now set the start and end times that came from the frontend.
        db_meeting.start_time = meeting_data.start_time
        db_meeting.end_time = meeting_data.end_time
        
        # The 'created_at' field is handled automatically by the database default.

        print(f"[Service] Populated model. Title: '{db_meeting.title}'.")
        
        db.add(db_meeting)
        print("[Service] Added to session. Committing...")
        db.commit()
        print("✅ [Service] COMMIT SUCCESSFUL.")
        
        db.refresh(db_meeting)
        print(f"[Service] Refreshed instance. New meeting ID is: {db_meeting.id}")
        
        return db_meeting

    except Exception as e:
        print(f"❌ [Service] AN ERROR OCCURRED. Rolling back transaction. Error: {e}")
        db.rollback()
        raise e



def get_all_live_meetings(db: Session):
    return db.query(models.LiveMeeting).all()


def get_live_meeting_by_id(db: Session, meeting_id: int):
    return db.query(models.LiveMeeting).filter(models.LiveMeeting.id == meeting_id).first()


def delete_live_meeting(db: Session, meeting_id: int):
    meeting = db.query(models.LiveMeeting).filter(models.LiveMeeting.id == meeting_id).first()
    if meeting:
        db.delete(meeting)
        db.commit()
    return meeting
