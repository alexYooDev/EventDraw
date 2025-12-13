from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

# Create FastAPI application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
)

# Configure CORS middleware
# This allows your frontend to make requests to the backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

@app.get("/")
async def root():
    """ 
    Root endpoint - Health check.
    """
    return {
        "message": "Luck of a Draw Roulette API",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """ 
    Health check endpoint.
    """
    return {"status": "healthy"}
