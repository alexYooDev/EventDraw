# Backend Dockerfile for Railway deployment
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code from backend directory
COPY backend/ .

# Expose port (Railway will set $PORT automatically)
EXPOSE 8000

# Run migrations and start the server
# Note: main.py is in app/ directory, so we use app.main:app
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}