#!/usr/bin/env python3
"""
Comprehensive test script for all services
"""
import os
import sys
from dotenv import load_dotenv

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

load_dotenv()

def test_imports():
    """Test if all required packages are installed"""
    print("🧪 Testing imports...")
    try:
        import google.generativeai as genai
        print("✅ google.generativeai imported")
        
        from deep_translator import GoogleTranslator
        print("✅ deep_translator imported")
        
        from langdetect import detect
        print("✅ langdetect imported")
        
        from gtts import gTTS
        print("✅ gtts imported")
        
        import pytesseract
        print("✅ pytesseract imported")
        
        from PIL import Image
        print("✅ PIL imported")
        
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def test_gemini_api():
    """Test Gemini API connection"""
    print("\n🤖 Testing Gemini API...")
    try:
        import google.generativeai as genai
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("❌ No GOOGLE_API_KEY found")
            return False
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        response = model.generate_content("Say 'Hello from Gemini!'")
        print(f"✅ Gemini API working: {response.text[:50]}...")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return False

def test_translation():
    """Test translation service"""
    print("\n🌐 Testing translation...")
    try:
        from deep_translator import GoogleTranslator
        from langdetect import detect
        
        # Test translation
        translator = GoogleTranslator(source='en', target='hi')
        result = translator.translate("Hello, how are you?")
        print(f"✅ Translation working: {result}")
        
        # Test language detection
        detected = detect("Hello world")
        print(f"✅ Language detection working: {detected}")
        return True
        
    except Exception as e:
        print(f"❌ Translation error: {e}")
        return False

def test_tts():
    """Test text-to-speech"""
    print("\n🔊 Testing TTS...")
    try:
        from gtts import gTTS
        import io
        
        tts = gTTS(text="Hello world", lang='en')
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        print(f"✅ TTS working: Generated {len(fp.getvalue())} bytes of audio")
        return True
        
    except Exception as e:
        print(f"❌ TTS error: {e}")
        return False

def test_services():
    """Test all services"""
    print("\n🔧 Testing services...")
    try:
        from services.rag_service import RAGService
        from services.translation_service import TranslationService
        from services.tts_service import TTSService
        
        # Test RAG service
        rag = RAGService()
        response = rag.search_schemes("Tell me about PM KISAN scheme", "English")
        print(f"✅ RAG service working: {response[:100]}...")
        
        # Test translation service
        trans = TranslationService()
        result = trans.translate_text("Hello", "Hindi")
        print(f"✅ Translation service working: {result}")
        
        # Test TTS service
        tts = TTSService()
        audio = tts.text_to_speech("Test", "English")
        print(f"✅ TTS service working: {audio is not None}")
        
        return True
        
    except Exception as e:
        print(f"❌ Services error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting comprehensive service tests...\n")
    
    tests = [
        ("Imports", test_imports),
        ("Gemini API", test_gemini_api),
        ("Translation", test_translation),
        ("Text-to-Speech", test_tts),
        ("Services", test_services)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ {name} test failed with exception: {e}")
            results.append((name, False))
    
    print("\n" + "="*50)
    print("📊 TEST RESULTS:")
    print("="*50)
    
    all_passed = True
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{name:20} {status}")
        if not passed:
            all_passed = False
    
    print("="*50)
    if all_passed:
        print("🎉 All tests passed! Your multilingual agent should work!")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        print("\nCommon fixes:")
        print("- Install missing packages: pip install deep-translator langdetect gtts")
        print("- Check your GOOGLE_API_KEY in .env file")
        print("- Ensure tesseract is installed for OCR")

if __name__ == "__main__":
    main()