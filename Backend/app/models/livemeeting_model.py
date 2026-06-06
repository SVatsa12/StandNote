from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime


class LiveMeeting(Base):
    __tablename__ = "live_meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    platform = Column(String(100), nullable=True)  # Zoom, Google Meet, etc.

    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    
    meeting_url = Column(String(500), nullable=True)
    audio_file_path = Column(String(1000), nullable=True)
    
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    def __repr__(self):
        return (
            f"<LiveMeeting(id={self.id}, title='{self.title}', "
            f"platform='{self.platform}', start_time={self.start_time}, end_time={self.end_time})>"
        )
