import os
import io
import json
from pydub import AudioSegment
import asyncio
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from typing import List, Optional
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy.orm import sessionmaker
from groq import Groq

from app.database import engine
from app.models.livemeeting_model import LiveMeeting
from app.services.ai.summarization import summarize_transcript, clean_summary

load_dotenv()
router = APIRouter()

# PostgreSQL session setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- THIS IS THE CORRECTED DATABASE FUNCTION FOR POSTGRESQL ---
def save_results_to_db(title: str, transcript: str, summary: str, created_at: datetime):
    db = SessionLocal()
    try:
        new_meeting = LiveMeeting(
            title=title,
            transcript=transcript,
            summary=summary,
            created_at=created_at
        )
        db.add(new_meeting)
        db.commit()
        print(f"[DB] Successfully saved meeting '{title}' to the database. Record ID: {new_meeting.id}")
    except Exception as err:
        print(f"[DB] Error saving to database: {err}")
        db.rollback()
    finally:
        db.close()

# ... (Your ConnectionManager and detect_audio_format functions remain the same) ...
class ConnectionManager:
    def __init__(self):
        self.listeners: List[WebSocket] = []
        self.recorder_websocket: Optional[WebSocket] = None
        self._lock = asyncio.Lock()
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
    def disconnect(self, websocket: WebSocket):
        if websocket in self.listeners: self.listeners.remove(websocket)
        if websocket == self.recorder_websocket: self.recorder_websocket = None
    async def add_listener(self, websocket: WebSocket):
        self.listeners.append(websocket)
    async def set_recorder(self, websocket: WebSocket) -> bool:
        async with self._lock:
            if self.recorder_websocket is None:
                self.recorder_websocket = websocket
                return True
            return False
    async def broadcast_json(self, data: dict):
        if not self.listeners: return
        for listener in self.listeners[:]:
            try: await listener.send_json(data)
            except (RuntimeError, WebSocketDisconnect): self.disconnect(listener)

manager = ConnectionManager()

def detect_audio_format(audio_data: bytes) -> str:
    if audio_data.startswith(b'RIFF') and b'WAVE' in audio_data[:12]: return 'wav'
    elif audio_data.startswith(b'ID3') or audio_data.startswith(b'\xff\xfb') or audio_data.startswith(b'\xff\xf3'): return 'mp3'
    elif audio_data.startswith(b'OggS'): return 'ogg'
    elif audio_data.startswith(b'fLaC'): return 'flac'
    elif audio_data.startswith(b'\x00\x00\x00\x20ftypM4A'): return 'm4a'
    elif b'webm' in audio_data[:50].lower(): return 'webm'
    else: return 'webm'

# --- THIS IS THE CORRECTED RECORDING SESSION HANDLER ---
async def handle_recording_session(recorder_websocket: WebSocket, initial_message: dict):
    
    full_audio_buffer = bytearray()
    meeting_title = initial_message.get("title", "Untitled Meeting")
    print(f"[Recorder Task] Starting session for: {meeting_title}")
    
    try:
        # ... (Your `while True` loop for receiving audio is correct) ...
        while True:
            message = await recorder_websocket.receive()
            if 'text' in message:
                try:
                    data = json.loads(message['text'])
                    if data.get("text") == "__END__":
                        print("[Recorder Task] Received __END__ signal.")
                        break
                except (json.JSONDecodeError, TypeError): pass
            elif 'bytes' in message:
                full_audio_buffer.extend(message['bytes'])
    except (WebSocketDisconnect, RuntimeError) as e:
        print(f"[Recorder Task] Client disconnected gracefully. Reason: {type(e).__name__}")
    except Exception as e:
        print(f"[Recorder Task] An unexpected error occurred in the receive loop: {e}")
    
    finally:
        if not full_audio_buffer:
            print("[Recorder Task] No audio was received before disconnect.")
        else:
            try:
                # ... (Your audio processing and transcription logic is correct) ...
                print("[Recorder Task] Processing received audio...")
                audio_format = detect_audio_format(full_audio_buffer)
                audio_file = io.BytesIO(full_audio_buffer)
                audio_segment = AudioSegment.from_file(audio_file, format=audio_format).set_channels(1).set_frame_rate(16000)
                
                print("[Recorder Task] Starting transcription with Groq...")
                
                # Export audio segment to wav format in memory for Groq
                wav_io = io.BytesIO()
                audio_segment.export(wav_io, format="wav")
                wav_io.seek(0)  # Reset file pointer to beginning
                
                api_key = os.getenv("GROQ_API_KEY")
                if not api_key:
                    raise RuntimeError("GROQ_API_KEY is not set")
                client = Groq(api_key=api_key)

                # Groq's transcription API requires file-like object
                response = client.audio.transcriptions.create(
                    file=("audio.wav", wav_io, "audio/wav"),
                    model="whisper-large-v3-turbo",
                    language="en",
                )
                print("[Recorder Task] Transcription finished.")
                
                final_transcript = response.text.strip() if hasattr(response, 'text') and response.text else "No speech was detected."
                final_summary = clean_summary(summarize_transcript(final_transcript)) or "Could not generate a summary."
                
                # --- THIS IS THE CRITICAL FIX ---
                # 1. Capture the current server time.
                recording_time = datetime.now()
                
                # 2. Pass all four arguments to the corrected database function.
                save_results_to_db(meeting_title, final_transcript, final_summary, recording_time)
                
                await manager.broadcast_json({"full_transcript": final_transcript, "full_summary": final_summary})
            except Exception as e:
                print(f"[Recorder Task] A critical error occurred during final processing: {e}")
                await manager.broadcast_json({"full_transcript": "Error processing audio.", "full_summary": f"Audio processing failed: {str(e)}"})
        
        print("[Recorder Task] Cleanup complete.")

# ... (Your `handle_listener_session` and `websocket_endpoint` functions are correct and remain the same) ...
async def handle_listener_session(websocket: WebSocket):
    await manager.add_listener(websocket)
    try: await asyncio.Future()
    except (WebSocketDisconnect, asyncio.CancelledError): pass

@router.websocket("/ws/live-meeting")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        initial_text = await websocket.receive_text()
        initial_message = json.loads(initial_text)
        role = initial_message.get("role")
        if role == "recorder":
            if await manager.set_recorder(websocket):
                await handle_recording_session(websocket, initial_message)
            else:
                await websocket.close(code=4001, reason="A recorder is already connected.")
        elif role == "listener":
            await handle_listener_session(websocket)
        else:
            await websocket.close(code=4002, reason="Invalid role specified.")
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[Server] An error occurred in the websocket endpoint: {e}")
    finally:
        manager.disconnect(websocket)