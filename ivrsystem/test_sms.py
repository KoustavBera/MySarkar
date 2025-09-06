#!/usr/bin/env python3
"""
SMS Test Script - Debug SMS functionality
"""
from sms_service import sms_service
from config import config

def test_sms():
    print("Testing SMS Service...")
    print(f"Twilio Account SID: {config.TWILIO_ACCOUNT_SID[:10]}..." if config.TWILIO_ACCOUNT_SID else "Missing TWILIO_ACCOUNT_SID")
    print(f"Twilio Phone: {config.TWILIO_PHONE_NUMBER}")
    print(f"Admin Phone: {config.ADMIN_PHONE}")
    
    if not config.ADMIN_PHONE:
        print("ADMIN_PHONE not configured in .env file")
        print("Add this line to your .env file:")
        print("ADMIN_PHONE=+1234567890  # Replace with your actual phone number")
        return
    
    if config.ADMIN_PHONE == "+1234567890":
        print("ADMIN_PHONE is still the placeholder value")
        print("Update ADMIN_PHONE in .env with your real phone number")
        return
    
    # Test SMS
    test_session = {
        'language': 'en',
        'region': 'north',
        'gender': 'male',
        'scheme_type': 'agriculture'
    }
    
    test_schemes = [
        "PM-KISAN Scheme - Rs 6000/year direct support",
        "Crop Insurance Scheme"
    ]
    
    print("\nSending test SMS...")
    sms_service.send_call_report(test_session, "+1234567890", test_schemes)
    print("\nTest completed. Check your phone for SMS!")

if __name__ == "__main__":
    test_sms()