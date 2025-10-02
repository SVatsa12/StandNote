from fastapi import APIRouter
from app.api.v1.endpoints import (
    meetings,
    extension,
    meeting_router,
    user,
    auth,
    livemeeting_router,
    live_transcription_ws, 
)
from app.api.v1.endpoints import live_transcription_ws
from app.api.v1.endpoints.transcription_router import router as transcription_router
from app.api.v1.endpoints.summarization_router import router as summarization_router
from app.api.v1.endpoints.action_extraction_router import router as action_extraction_router
from app.api.v1.endpoints import (
    live_transcription_router,
    # ... other routers
)
api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(meetings.router, prefix="/meetings", tags=["Meetings"])
api_router.include_router(extension.router, prefix="/extension", tags=["Extension"])
api_router.include_router(transcription_router, prefix="/transcribe", tags=["Transcription"])
api_router.include_router(summarization_router, prefix="/summarize", tags=["Summarization"])
api_router.include_router(action_extraction_router, prefix="/extract", tags=["Action Extraction"])
api_router.include_router(meeting_router.router, prefix="/meeting", tags=["Meeting"])
api_router.include_router(user.router, prefix="/users", tags=["users"]) 
api_router.include_router(livemeeting_router.router, prefix="/live-meeting", tags=["LiveMeeting"])
api_router.include_router(
    live_transcription_router.router,
    prefix="/livemeeting",
    tags=["LiveMeeting Transcription"]
)
api_router.include_router(live_transcription_ws.router)
