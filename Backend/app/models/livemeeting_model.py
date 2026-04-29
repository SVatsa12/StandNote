from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class LiveMeeting(Base):
    __tablename__ = "live_meetings"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False, index=True)
    platform = Column(String(100), nullable=True)

    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)

    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)

    user_id = Column(Integer, nullable=True, index=True)

    created_at = Column(DateTime, server_default=func.now(), nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=True)

# app/models/livemeeting_model.py

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime
from sqlalchemy import ForeignKey
class LiveMeeting(Base):
    __tablename__ = "live_meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    platform = Column(String(100), nullable=True)  # Zoom, Google Meet, etc.

    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
        # --- ADD THE MISSING COLUMNS HERE ---
    meeting_url = Column(String(500), nullable=True)
    audio_file_path = Column(String(1000), nullable=True)
    # ------------------------------------
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    # Optional future use: link to users table
    # user_id = Column(Integer, ForeignKey("users.id"))

    def __repr__(self):
        return (
            f"<LiveMeeting(id={self.id}, title='{self.title}', "
            f"platform='{self.platform}', start_time={self.start_time}, end_time={self.end_time})>"
        )
