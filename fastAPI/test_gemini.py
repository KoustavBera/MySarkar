import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def test_gemini_api():
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("❌ No GOOGLE_API_KEY found in environment")
            return False
            
        print(f"🔑 Using API Key: {api_key[:10]}...")
        
        genai.configure(api_key=api_key)
        
        # List available models first
        print("Available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"  - {m.name}")
        
        # Use the current model name
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content("Hello, are you working? Reply with 'Yes, I am working!'")
        print("✅ Gemini API is working!")
        print(f"Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        print("Try getting a new API key from: https://makersuite.google.com/app/apikey")
        return False

if __name__ == "__main__":
    test_gemini_api()