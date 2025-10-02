# scripts/seed_live_meeting.py

from app.database import SessionLocal
from Backend.app.models.livemeeting_model import LiveMeeting

db = SessionLocal()

test_meeting = LiveMeeting(
    user_id=1,
    title="Test Meeting",
    transcript="This is a test transcript.",
    summary="This is a test summary.",
    audio_file_path="test_audio.mp3"
)

db.add(test_meeting)
db.commit()
db.close()

print("✅ Test live meeting inserted!")
