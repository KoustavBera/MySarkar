import google.generativeai as genai
import os

class TranslationService:
    def __init__(self):
        # Use Gemini for translation instead of googletrans
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        self.lang_codes = {
            "English": "en",
            "Hindi": "hi", 
            "Bengali": "bn"
        }
    
    def translate_text(self, text, target_language):
        """Use Gemini for translation"""
        try:
            if target_language == "English":
                return text
            
            prompt = f"Translate this text to {target_language}. Only respond with the translation: {text}"
            response = self.gemini_model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"Translation error: {e}")
            return text
    
    def detect_language(self, text):
        """Detect language using Gemini"""
        try:
            prompt = f"Detect the language of this text and respond with only 'English', 'Hindi', or 'Bengali': {text}"
            response = self.gemini_model.generate_content(prompt)
            detected = response.text.strip()
            
            if detected in ["English", "Hindi", "Bengali"]:
                return detected
            return "English"
            
        except Exception as e:
            print(f"Language detection error: {e}")
            return "English"
