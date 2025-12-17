#!/bin/bash
# Startup script for Railway deployment
# Handles database migrations gracefully

echo "Starting deployment..."

# Try to run migrations with a 10-second timeout
# If it hangs or fails, continue anyway
echo "Attempting migrations with timeout..."
timeout 10s alembic upgrade head 2>&1 || echo "Migration failed or timed out, continuing..."

echo "Starting uvicorn server..."
# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
