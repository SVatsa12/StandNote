from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)

    meeting_id = Column(String(255), nullable=False, index=True)
    platform = Column(String(100), nullable=True)

    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)

    processed = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, server_default=func.now(), nullable=True)

from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from app.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)                      # fixed
    meeting_id = Column(String(100), unique=True, index=True, nullable=False)  # fixed
    transcript = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    action_items = Column(Text)
    processed = Column(Integer, default=0)  # 0 = not started, 1 = processing, 2 = complete
    created_at = Column(DateTime, default=datetime.utcnow)
