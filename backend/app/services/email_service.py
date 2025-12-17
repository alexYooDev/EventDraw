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
            
            # Send email via Resend
            params = {
                "from": f"{settings.FROM_NAME} <{settings.FROM_EMAIL}>",
                "to": [customer.email],
                "subject": "🎉 Congratulations! You're a Winner!",
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
        # Get template file path
        template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
        template_path = os.path.join(template_dir, 'winner_email.html')
        
        # Read template file
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Substitute customer data
        html_content = template.format(
            customer_name=customer.name,
            customer_feedback=customer.feedback,
            service_provider='Didi Beauty Studio'
        )
        
        return html_content
