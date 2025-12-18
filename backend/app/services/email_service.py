"""
Email service for sending winner notifications using Resend.
"""
import os
import resend
from app.core.config import settings
from app.models.customer import Customer


class EmailService:
    """Service for sending emails via Resend API."""
    
    def __init__(self):
        """Initialize Resend client with API key."""
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY
        else:
            raise ValueError("RESEND_API_KEY not configured")
    
    def send_winner_notification(self, customer: Customer) -> tuple[bool, str]:
        """
        Send winner notification email to customer.
        
        Args:
            customer: Customer object with email and name
            
        Returns:
            tuple: (success: bool, message: str)
        """
        try:
            # Create HTML email content
            html_content = self._create_winner_email_html(customer)
            
            # Determine subject based on place
            place_str = {1: "1st", 2: "2nd", 3: "3rd"}.get(customer.winner_place, "")
            subject = f"🎉 Congratulations! You won the {place_str} Prize!" if place_str else "🎉 Congratulations! You're a Winner!"

            # Send email via Resend
            params = {
                "from": f"{settings.FROM_NAME} <{settings.FROM_EMAIL}>",
                "to": [customer.email],
                "subject": subject,
                "html": html_content,
            }
            
            email = resend.Emails.send(params)
            
            return True, f"Email sent successfully to {customer.email} (ID: {email.get('id')})"
            
        except Exception as e:
            error_message = f"Failed to send email to {customer.email}: {str(e)}"
            print(f"Email error: {error_message}")
            return False, error_message
    
    def _create_winner_email_html(self, customer: Customer) -> str:
        """
        Create HTML email template for winner notification.
        
        Loads template from file and substitutes customer data.
        
        Args:
            customer: Customer object
            
        Returns:
            str: HTML email content
        """
        # Prize details
        prizes = {
            1: "Whipped Shampoo for Eyelash",
            2: "Eyelash Coating Gel",
            3: "Eyelash Adhesive Remover"
        }
        prize_name = prizes.get(customer.winner_place, "a special prize")
        place_str = {1: "1st", 2: "2nd", 3: "3rd"}.get(customer.winner_place, "")

        # Substitute customer data
        html_content = template.format(
            customer_name=customer.name,
            customer_feedback=customer.feedback,
            prize_name=prize_name,
            place_str=place_str,
            service_provider='Didi Beauty Studio'
        )
        
        return html_content
