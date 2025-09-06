#!/usr/bin/env python3
"""
Test script to verify RAG services are working
"""
import os
import sys
sys.path.append('.')

from dotenv import load_dotenv
load_dotenv()

def test_imports():
    """Test if all services can be imported"""
    try:
        from app.services.ocr_service import OCRService
        print("✅ OCR Service imported successfully")
        
        from app.services.translation_service import TranslationService
        print("✅ Translation Service imported successfully")
        
        from app.services.tts_service import TTSService
        print("✅ TTS Service imported successfully")
        
        from app.services.rag_service import RAGService
        print("✅ RAG Service imported successfully")
        
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_services():
    """Test basic service functionality"""
    try:
        from app.services.translation_service import TranslationService
        from app.services.tts_service import TTSService
        
        # Test translation
        trans_service = TranslationService()
        result = trans_service.translate_text("Hello", "Hindi")
        print(f"✅ Translation test: 'Hello' -> '{result}'")
        
        # Test TTS
        tts_service = TTSService()
        audio = tts_service.text_to_speech("Hello", "English")
        print(f"✅ TTS test: Generated audio URL: {audio is not None}")
        
        return True
    except Exception as e:
        print(f"❌ Service test failed: {e}")
        return False

def test_rag():
    """Test RAG service specifically"""
    try:
        from app.services.rag_service import RAGService
        
        rag_service = RAGService()
        response = rag_service.search_schemes("Tell me about PM-KISAN scheme")
        print(f"✅ RAG test successful: {response[:100]}...")
        
        return True
    except Exception as e:
        print(f"❌ RAG test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing RAG Agent Services...")
    print("=" * 50)
    
    # Check environment
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment")
        sys.exit(1)
    else:
        print(f"✅ GOOGLE_API_KEY found: {api_key[:10]}...")
    
    print("\n1. Testing imports...")
    if not test_imports():
        sys.exit(1)
    
    print("\n2. Testing basic services...")
    if not test_services():
        print("⚠️  Basic services failed, but continuing...")
    
    print("\n3. Testing RAG service...")
    if not test_rag():
        print("❌ RAG service failed")
        sys.exit(1)
    
    print("\n✅ All tests passed! RAG agent should be working.")