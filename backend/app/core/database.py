from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create the SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping= True, # Verifies connections before using them
    echo=settings.ENVIRONMENT == "production" # Log SQL queries in development
    )

# Factory Design Pattern

# SessionLocal class - each instance is a database session
# Sessions are used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
Base = declarative_base()


# Dependency Injection Pattern
def get_db():
    """ 
    Dependency function to get database session.
    
    This is used with FastAPI's dependency injection system.
    It yields a session and ensures it's closed after use.

    Usage in endpoints:
        def read_times(db: Session = Depends(get_db)):
            # Use db to query the database
    """
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()
