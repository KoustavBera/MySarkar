from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from config import config
from datetime import datetime

class SMSService:
    def __init__(self):
        try:
            self.client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN) if config.TWILIO_ACCOUNT_SID else None
        except Exception as e:
            print(f"Failed to initialize Twilio client: {e}")
            self.client = None
    
    def send_call_report(self, session_data: dict, caller_number: str, suggested_schemes: list):
        """Send SMS report of completed call with suggested schemes"""
        if not self.client:
            print("SMS service not configured - missing Twilio credentials")
            return
            
        if not config.ADMIN_PHONE:
            print("SMS service not configured - missing ADMIN_PHONE")
            return
            
        if not config.TWILIO_PHONE_NUMBER:
            print("SMS service not configured - missing TWILIO_PHONE_NUMBER")
            return
        
        try:
            print(f"Sending SMS to: {config.ADMIN_PHONE}")
            
            # Format report message
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Format schemes list (limit to first 2)
            schemes_list = "\n".join([f"{i+1}. {scheme}" for i, scheme in enumerate(suggested_schemes[:2])]) if suggested_schemes else "No schemes available"
            
            report = f"IVR Report\nCaller: {caller_number}\nLanguage: {'Hindi' if session_data.get('language') == 'hi' else 'English'}\nRegion: {session_data.get('region', 'Unknown')}\nGender: {session_data.get('gender', 'Unknown')}\nScheme Type: {session_data.get('scheme_type', 'Unknown')}\n\nSuggested Schemes:\n{schemes_list}\n\nTime: {timestamp}"
            
            # Send SMS with error handling
            print(f"Attempting SMS: From {config.TWILIO_PHONE_NUMBER} To {config.ADMIN_PHONE}")
            print(f"Message length: {len(report)} chars")
            
            message = self.client.messages.create(
                body=report[:1600],  # Limit message length
                from_=config.TWILIO_PHONE_NUMBER,
                to=config.ADMIN_PHONE
            )
            
            print(f"SMS sent! SID: {message.sid}")
            print(f"SMS Status: {message.status}")
            
        except TwilioRestException as e:
            print(f"Twilio SMS error: {e.msg}")
            print(f"Error code: {e.code}")
            if e.code == 21614:  # Invalid phone number
                print("Fix: Check phone number format in ADMIN_PHONE (include country code)")
            elif e.code == 21608:  # Unverified number
                print(f"Fix: Verify {config.ADMIN_PHONE} in Twilio Console")
        except Exception as e:
            print(f"SMS error: {e}")
            print(f"Error type: {type(e).__name__}")

sms_service = SMSService()