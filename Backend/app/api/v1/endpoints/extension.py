from fastapi import APIRouter, Request
from app.services.meeting_service import save_meeting


router = APIRouter()

@router.post("/submit-transcript/")
async def receive_transcript(request: Request):
    data = await request.json()
    transcript = data.get("transcript")
    platform = data.get("platform", "unknown")
    meeting_id = data.get("meeting_id", "extension_" + platform)

    if not transcript:
        return {"error": "Transcript missing"}

    # You could run summarization/action extraction here if needed
    meeting_data = {
        "platform": platform,
        "meeting_id": meeting_id,
        "transcript": transcript,
        "summary": "To be processed",
        "action_items": "To be processed"
    }

    saved_meeting = save_meeting(meeting_data)
    return {"message": "Transcript received", "meeting": saved_meeting} 