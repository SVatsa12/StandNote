from sqlalchemy import Column, String, Integer, DateTime, Text
from datetime import datetime
from app.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)
    meeting_id = Column(String(100), unique=True, index=True, nullable=False)
    transcript = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    action_items = Column(Text)
    processed = Column(Integer, default=0)  # 0 = not started, 1 = processing, 2 = complete
    created_at = Column(DateTime, default=datetime.utcnow)
