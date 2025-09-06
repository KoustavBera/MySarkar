from twilio.twiml.voice_response import VoiceResponse
from models import Language, Region, Gender, SchemeType
from data import MESSAGES
from session_manager import session_manager
from scheme_service import get_schemes
from sms_service import sms_service

class IVRHandler:
    def handle_language(self, call_sid: str, digits: str) -> VoiceResponse:
        session = session_manager.get_session(call_sid)
        response = VoiceResponse()
        
        if digits == "1":
            session["language"] = Language.ENGLISH
        elif digits == "2":
            session["language"] = Language.HINDI
        else:
            response.say("Invalid selection. Please try again.", voice="alice")
            response.gather(num_digits=1, action="/handle_language", method="POST")
            return response
        
        session["step"] = "name"
        lang = session["language"]
        response.say(MESSAGES["collect_name"][lang], voice="Polly.Aditi" if lang == Language.HINDI else "alice")
        response.record(action="/handle_name", max_length=5, finish_on_key="#", timeout=3)
        return response
    
    def handle_name(self, call_sid: str, speech_result: str) -> VoiceResponse:
        session = session_manager.get_session(call_sid)
        session["name"] = speech_result or "User"
        session["step"] = "region"
        
        response = VoiceResponse()
        lang = session["language"]
        response.say(MESSAGES["collect_region"][lang], voice="Polly.Aditi" if lang == Language.HINDI else "alice")
        response.gather(num_digits=1, action="/handle_region", method="POST")
        return response
    
    def handle_region(self, call_sid: str, digits: str) -> VoiceResponse:
        session = session_manager.get_session(call_sid)
        regions = {
            "1": Region.NORTH, "2": Region.SOUTH, "3": Region.EAST,
            "4": Region.WEST, "5": Region.CENTRAL
        }
        session["region"] = regions.get(digits, Region.NORTH).value
        session["step"] = "gender"
        
        response = VoiceResponse()
        lang = session["language"]
        response.say(MESSAGES["collect_gender"][lang], voice="Polly.Aditi" if lang == Language.HINDI else "alice")
        response.gather(num_digits=1, action="/handle_gender", method="POST")
        return response
    
    def handle_gender(self, call_sid: str, digits: str) -> VoiceResponse:
        session = session_manager.get_session(call_sid)
        genders = {"1": Gender.MALE, "2": Gender.FEMALE, "3": Gender.OTHER}
        session["gender"] = genders.get(digits, Gender.OTHER).value
        session["step"] = "scheme"
        
        response = VoiceResponse()
        lang = session["language"]
        response.say(MESSAGES["collect_scheme"][lang], voice="Polly.Aditi" if lang == Language.HINDI else "alice")
        response.gather(num_digits=1, action="/handle_scheme", method="POST")
        return response
    
    def handle_scheme(self, call_sid: str, digits: str) -> VoiceResponse:
        session = session_manager.get_session(call_sid)
        schemes_map = {
            "1": SchemeType.AGRICULTURE, "2": SchemeType.EDUCATION,
            "3": SchemeType.HEALTHCARE, "4": SchemeType.EMPLOYMENT,
            "5": SchemeType.HOUSING, "6": SchemeType.WOMEN
        }
        scheme_type = schemes_map.get(digits, SchemeType.EDUCATION).value
        
        # Get relevant schemes
        schemes = get_schemes(session["region"], session["gender"], scheme_type)
        
        response = VoiceResponse()
        lang = session["language"]
        
        try:
            voice = "Polly.Aditi" if lang == Language.HINDI else "alice"
            
            if lang == Language.HINDI:
                response.say("आपके लिए उपलब्ध योजनाएं हैं:", voice=voice)
            else:
                response.say("Available schemes for you are:", voice=voice)
            
            for i, scheme in enumerate(schemes, 1):
                response.say(f"Scheme {i}: {scheme}", voice=voice)
            
            response.say(MESSAGES["thank_you"][lang], voice=voice)
        except Exception as e:
            print(f"Scheme response error: {e}")
            response.say("Thank you for calling. Goodbye!", voice="alice")
        response.hangup()
        
        # Send SMS report before cleanup
        try:
            caller_number = session.get('caller_number', 'Unknown')
            session['scheme_type'] = scheme_type
            sms_service.send_call_report(session, caller_number, schemes)
        except Exception as e:
            print(f"SMS report error: {e}")
        
        # Clean up session
        session_manager.clear_session(call_sid)
        return response

ivr_handler = IVRHandler()