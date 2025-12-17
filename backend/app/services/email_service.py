"""
Email service for sending winner notifications using Resend.
"""
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
        
        Args:
            customer: Customer object
            
        Returns:
            str: HTML email content
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>You're a Winner!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                                        🎰 Luck of a Draw
                                    </h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">
                                        🎉 Congratulations, {customer.name}!
                                    </h2>
                                    
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        We're thrilled to announce that you've been selected as a winner in our customer appreciation draw!
                                    </p>
                                    
                                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            <strong>Your Feedback:</strong><br>
                                            "{customer.feedback}"
                                        </p>
                                    </div>
                                    
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        Thank you for taking the time to share your thoughts with us. Your feedback helps us improve and serve you better!
                                    </p>
                                    
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        We'll be in touch soon with details about claiming your prize.
                                    </p>
                                    
                                    <p style="margin: 30px 0 0 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        Best regards,<br>
                                        <strong>The Luck of a Draw Team</strong>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
                                    <p style="margin: 0; color: #999999; font-size: 14px;">
                                        This email was sent because you participated in our customer feedback draw.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
