from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute  # import APIRoute

from app.api.v1.api_v1 import api_router
from app.database import Base, engine
from app.models.livemeeting_model import LiveMeeting 
 # needed to register model


app = FastAPI(title="StandNote.AI - Smart Meeting Summarizer")

# Create DB tables
Base.metadata.create_all(bind=engine)

# CORS Configuration
origins = ["http://localhost:5173", "http://127.0.0.1:5173","http://localhost",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routes under /api/v1
app.include_router(api_router, prefix="/api/v1")

