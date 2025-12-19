"""
API v1 router.

Combines all v1 endpoints into a single router.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import customers, auth, organizations

# Create the main v1 router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router)
api_router.include_router(customers.router)
api_router.include_router(organizations.router)
