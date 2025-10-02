from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from datetime import datetime
from typing import List

# ────── DB Setup ──────
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # File-based DB
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ────── Model ──────
class LiveMeeting(Base):
    __tablename__ = "live_meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# ────── Schema ──────
class LiveMeetingCreate(BaseModel):
    title: str
    status: str

class LiveMeetingResponse(BaseModel):
    id: int
    title: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

# ────── App Init ──────
app = FastAPI()
Base.metadata.create_all(bind=engine)

# ────── Dependency ──────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ────── Routes ──────
@app.post("/live-meeting/create", response_model=LiveMeetingResponse)
def create_meeting(meeting: LiveMeetingCreate, db: Session = Depends(get_db)):
    new_meeting = LiveMeeting(**meeting.dict())
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting

@app.get("/live-meeting/all", response_model=List[LiveMeetingResponse])
def get_all_meetings(db: Session = Depends(get_db)):
    return db.query(LiveMeeting).all()
