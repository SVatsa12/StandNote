import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# This ensures the script can find your 'app' module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- MODEL IMPORTS ---
# The database's Foreign Key rule FORCES us to import both models
# so SQLAlchemy can understand the relationship.
from app.models.livemeeting_model import LiveMeeting
from app.models.user import User  # This MUST point to your user.py file

from app.database import DATABASE_URL


# --- DATABASE CONNECTION SETUP ---
try:
    DATABASE_URL = "mysql+pymysql://root:SVatsa27!@localhost/StandNote_db"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
except Exception as e:
    print(f"Error connecting to the database: {e}")
    sys.exit(1)


# --- DATA TO ADD ---
# This list contains only the columns we want to populate.
# `meeting_url` and `audio_file_path` will be left as NULL since they are optional.
meetings_to_add = [
    {
        "title": "Q3 Product Strategy & Roadmap Planning",
        "platform": "Google Meet",
        "start_time": datetime.fromisoformat("2025-07-18T14:00:00.000Z"),
        "end_time": datetime.fromisoformat("2025-07-18T15:30:00.000Z"),
        "summary": "Deep dive into the product strategy for the upcoming quarter. Finalized the feature roadmap and assigned owners for key initiatives.",
        "action_items": "1. Draft PRD for new analytics dashboard.\n2. Schedule user feedback sessions.\n3. Finalize budget with finance.",
        "user_id": 1
    },
    {
        "title": "Client Kick-off: Project Artemis",
        "platform": "Zoom",
        "start_time": datetime.fromisoformat("2025-07-22T11:00:00.000Z"),
        "end_time": datetime.fromisoformat("2025-07-22T11:45:00.000Z"),
        "summary": "Initial kick-off meeting with the new client for Project Artemis. Discussed project goals, timelines, and communication protocols.",
        "action_items": "1. Send welcome package to client.\n2. Set up shared Slack channel.",
        "user_id": 1
    },
    # This is the cluster of 3 meetings for testing your frontend UI
    {
        "title": "Weekly Engineering Sync",
        "platform": "Zoom",
        "start_time": datetime.fromisoformat("2025-07-25T10:00:00.000Z"),
        "end_time": datetime.fromisoformat("2025-07-25T10:25:00.000Z"),
        "summary": "Standard weekly sync to review sprint progress and address blockers.",
        "action_items": "1. Investigate API latency issue.\n2. Document new caching strategy.",
        "user_id": 1
    },
    {
        "title": "1-on-1 with Design Lead",
        "platform": "Google Meet",
        "start_time": datetime.fromisoformat("2025-07-25T14:30:00.000Z"),
        "end_time": datetime.fromisoformat("2025-07-25T15:00:00.000Z"),
        "summary": "Career development discussion focusing on leadership opportunities.",
        "action_items": "1. Enroll lead in management training course.",
        "user_id": 1
    },
    {
        "title": "API Performance Review",
        "platform": "Internal",
        "start_time": datetime.fromisoformat("2025-07-25T11:00:00.000Z"),
        "end_time": datetime.fromisoformat("2025-07-25T12:00:00.000Z"),
        "summary": "Technical review of the v1 API performance. Identified several endpoints for optimization.",
        "action_items": "1. Create tickets for endpoint optimization.",
        "user_id": 1
    }
]


# --- SCRIPT EXECUTION LOGIC ---
if __name__ == "__main__":
    try:
        print("Starting database seeding process...")
        
        # Step 1: Check that a user with ID=1 actually exists.
        # This is required to satisfy the foreign key constraint.
        user_id_to_check = 1
        user = db.query(User).filter(User.id == user_id_to_check).first()
        
        if not user:
            print(f"FATAL ERROR: User with ID {user_id_to_check} does not exist in the 'users' table.")
            print("Please create this user before running the seeder.")
            db.close()
            sys.exit(1)

        print(f"Verified user '{user.email}' exists. Proceeding to reset and seed meetings...")

        # Step 2: Delete all existing meetings from the table to start fresh.
        num_deleted = db.query(LiveMeeting).delete()
        print(f"Deleted {num_deleted} old meeting(s).")
        
        # Step 3: Add the new list of meetings.
        print(f"Adding {len(meetings_to_add)} new meeting(s)...")
        for meeting_data in meetings_to_add:
            new_meeting = LiveMeeting(**meeting_data)
            db.add(new_meeting)
        
        # Step 4: Commit the transaction to save all changes.
        db.commit()
        print(f"Database seeded successfully with {len(meetings_to_add)} new meetings.")

    except Exception as e:
        print(f"\nAn error occurred during seeding: {e}")
        print("Rolling back any changes.")
        db.rollback()
    finally:
        # Step 5: Always close the database connection.
        print("Closing database connection.")
        db.close()