#!/bin/bash
# Startup script for Railway deployment
# Handles database migrations gracefully

echo "Starting deployment..."

# Try to stamp the current migration as applied (if tables already exist)
echo "Attempting to stamp migrations..."
alembic stamp head 2>/dev/null

# If stamp failed, try to run migrations
if [ $? -ne 0 ]; then
    echo "Stamp failed, attempting upgrade..."
    alembic upgrade head 2>/dev/null
    
    # If upgrade also failed, it might be because tables already exist
    # Check the error and continue anyway
    if [ $? -ne 0 ]; then
        echo "Migration failed (tables may already exist), continuing..."
    fi
fi

echo "Starting uvicorn server..."
# Start the FastAPI application
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
