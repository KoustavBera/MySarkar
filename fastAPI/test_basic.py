#!/usr/bin/env python3
"""
Basic test without heavy dependencies
"""
import os
import sys
sys.path.append('.')

from dotenv import load_dotenv
load_dotenv()

def test_basic_imports():
    """Test basic imports"""
    try:
        from app.services.rag_service_simple import RAGService
        print("✅ Simple RAG Service imported")
        
        from app.services.translation_service import TranslationService
        print("✅ Translation Service imported")
        
        from app.services.tts_service import TTSService
        print("✅ TTS Service imported")
        
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_rag_simple():
    """Test simple RAG service"""
    try:
        from app.services.rag_service_simple import RAGService
        
        rag = RAGService()
        response = rag.search_schemes("Tell me about PM-KISAN")
        print(f"✅ RAG response: {response[:100]}...")
        return True
    except Exception as e:
        print(f"❌ RAG test failed: {e}")
        return False

if __name__ == "__main__":
    print("Basic RAG Agent Test")
    print("=" * 30)
    
    # Check API key
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found")
        sys.exit(1)
    print(f"✅ API Key found: {api_key[:10]}...")
    
    if test_basic_imports():
        print("✅ Basic imports working")
        
        if test_rag_simple():
            print("✅ Basic RAG working")
        else:
            print("❌ RAG not working")
    else:
        print("❌ Imports failed")