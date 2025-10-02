# test_livemeeting.py

from fastapi.testclient import TestClient
from app.main import app  # ✅ Make sure this points to your actual FastAPI app

client = TestClient(app)

def test_get_all_live_meetings():
    response = client.get("/api/v1/live-meeting/all")
    assert response.status_code == 200
