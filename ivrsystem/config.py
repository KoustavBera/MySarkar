import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
    ADMIN_PHONE = os.getenv("ADMIN_PHONE")  # Your phone number for SMS reports
    
config = Config()