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
            # Determine prize name and place string
            place_str = {1: "1st", 2: "2nd", 3: "3rd"}.get(customer.winner_place, "")
            
            # Find the prize in the database
            prize_name = "a special prize"
            if customer.organization and customer.organization.prizes:
                for prize in customer.organization.prizes:
                    if prize.place == customer.winner_place:
                        prize_name = prize.name
                        break
            
            # Create HTML email content
            html_content = self._create_winner_email_html(customer, prize_name, place_str)
            
            subject = f"🎉 Congratulations! You won the {place_str} Prize!" if place_str else "🎉 Congratulations! You're a Winner!"

            # Send email via Resend
            # Use organization name in from field if available
            from_name = customer.organization.name if customer.organization else settings.FROM_NAME
            params = {
                "from": f"{from_name} <{settings.FROM_EMAIL}>",
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
    
    def _create_winner_email_html(self, customer: Customer, prize_name: str, place_str: str) -> str:
        """
        Create HTML email template for winner notification.
        
        Loads template from file and substitutes customer data.
        
        Args:
            customer: Customer object
            prize_name: Name of the prize
            place_str: String representation of the place (e.g., "1st")
            
        Returns:
            str: HTML email content
        """
        # Load template from file
        template_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'templates',
            'winner_email.html'
        )
        
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                template_content = f.read()
        except Exception as e:
            print(f"Error loading email template: {str(e)}")
            # Fallback simple template if file load fails
            template_content = "<h1>Congratulations, {customer_name}!</h1><p>You won the {place_str} prize: {prize_name}</p>"

        # Substitute customer data
        service_provider = customer.organization.name if customer.organization else 'Our Team'
        
        html_content = template_content.format(
            customer_name=customer.name,
            customer_feedback=customer.feedback if customer.feedback else 'Your kind feedback',
            prize_name=prize_name,
            place_str=place_str,
            service_provider=service_provider
        )
        
        return html_content
