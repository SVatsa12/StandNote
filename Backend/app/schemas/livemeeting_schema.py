from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import Field

class LiveMeetingBase(BaseModel):
    title: str
    platform: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class LiveMeetingCreate(LiveMeetingBase):
    transcript: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[str] = None
    # timestamp: Optional[datetime] = None
    user_id: int  # optional unless required
    user_id: int = Field(..., example=1)

class LiveMeetingResponse(LiveMeetingBase):
    id: int
    transcript: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[int] = None



    class Config:
        from_attributes = True
