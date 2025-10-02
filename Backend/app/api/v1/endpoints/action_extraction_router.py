from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai.action_extractor import extract_action_items

router = APIRouter()

class TranscriptInput(BaseModel):
    transcript: str

@router.post("/extract-actions")
async def extract_actions(data: TranscriptInput):
    try:
        action_items =extract_action_items(data.transcript)
        return {"action_items": action_items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
