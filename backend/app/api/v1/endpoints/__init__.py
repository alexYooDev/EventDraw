"""
API v1 router. 
Combines all v1 endpoints into a single router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import customers

# Create the main v1 router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(customers.router)