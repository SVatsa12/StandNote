from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=True)
    username = Column(String(255), nullable=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)

    avatar = Column(String(1024), nullable=True)
    facebook = Column(String(1024), nullable=True)
    twitter = Column(String(1024), nullable=True)

    created_at = Column(DateTime, server_default=func.now(), nullable=True)

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    username = Column(String(255), unique=True, index=True, nullable=True)  # Add username field
    avatar = Column(String(255), nullable=True)  # Add avatar field
    facebook = Column(String(255), nullable=True)  # Add facebook field
    twitter = Column(String(255), nullable=True)   # Add twitter field
    created_at = Column(DateTime, default=datetime.utcnow)