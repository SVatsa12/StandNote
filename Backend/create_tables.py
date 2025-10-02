from app.database import Base, engine
from app.models.meeting import Meeting

print("Engine URL:", engine.url)
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")
