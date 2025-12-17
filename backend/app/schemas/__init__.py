""" 
Pydantic schemas package. 

Import all schemas here for easy access. 
"""

from app.schemas.customer import (
    CustomerBase,
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
    CustomerListResponse,
)

from app.schemas.notification import (
    WinnerNotification,
    NotificationResponse,
)

__all__ = [
    "CustomerBase",
    "CustomerCreate",
    "CustomerUpdate",
    "CustomerResponse",
    "CustomerListResponse",
    "WinnerNotification",
    "NotificationResponse"
]

