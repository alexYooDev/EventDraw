""" 
Pydantic schemas for Notification API.
These define the structure of data for notification requests and responses
"""

from pydantic import BaseModel, EmailStr

class WinnerNotification(BaseModel):
    """
    Schema for sending winner notification.
    """
    customer_id: int
    send_immediately: bool = True

class NotificationResponse(BaseModel):
    """
    Schema for notification response
    """
    success: bool
    message: str
    email_sent_to: str | None = None
