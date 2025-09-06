from gtts import gTTS
import io
import base64
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

class TTSService:
    def __init__(self):
        self.lang_codes = {
            "English": "en",
            "Hindi": "hi",
            "Bengali": "bn"
        }
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def text_to_speech(self, text, language="English"):
        """Convert text to speech and return base64 audio"""
        try:
            # Limit text length for faster processing
            if len(text) > 500:
                text = text[:500] + "..."
            
            lang_code = self.lang_codes.get(language, "en")
            tts = gTTS(text=text, lang=lang_code, slow=False)
            
            # Save to bytes
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            
            # Convert to base64
            audio_base64 = base64.b64encode(fp.read()).decode()
            return f"data:audio/mp3;base64,{audio_base64}"
        except Exception as e:
            print(f"TTS Error: {e}")
            return None
    
    async def text_to_speech_async(self, text, language="English"):
        """Async version of text to speech"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor, 
            self.text_to_speech, 
            text, 
            language
        )
