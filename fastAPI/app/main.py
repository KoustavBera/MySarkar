# Add these imports at the top
import pickle
import string
from nltk.corpus import stopwords
import nltk
from nltk.stem.porter import PorterStemmer
import warnings
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from pydantic import BaseModel
from app.utils.translator import translate_text
import os
from dotenv import load_dotenv

from app.routes import document, ocr


# Import AI/ML services only
from app.chat_models import ChatRequest, ChatResponse
from app.services.ocr_service import OCRService
from app.services.translation_service import TranslationService
from app.services.tts_service import TTSService
from app.services.rag_service import RAGService

load_dotenv()
warnings.filterwarnings("ignore")

app = FastAPI(title="AI Services API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(document.router)
app.include_router(ocr.router)

# Initialize AI services
ocr_service = OCRService()
translation_service = TranslationService()
tts_service = TTSService()
rag_service = RAGService()

@app.get("/")
def root():
    return {"message": "AI Services API is running"}

# Keep only AI/ML related endpoints
@app.post("/chat")
async def chat(request: ChatRequest):
    """Enhanced chat endpoint with smart features"""
    try:
        print(f"Received chat request: {request.message} in {request.language}")
        response = rag_service.search_schemes(request.message, request.language)
        return ChatResponse(
            response=response, 
            audio_url=None,
            suggested_actions=[],
            confidence_score=0.85
        )
    except Exception as e:
        print(f"Chat error: {e}")
        return ChatResponse(response="Service temporarily unavailable", audio_url=None)

@app.post("/analyze-form")
async def analyze_form(request: dict):
    """Analyze uploaded form image"""
    try:
        image_data = request.get("image_data")
        language = request.get("language", "English")
        
        if not image_data:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        ocr_result = ocr_service.extract_text_from_image(image_data)
        help_text = rag_service.generate_form_help(ocr_result["fields"], language)
        
        if language != "English":
            help_text = translation_service.translate_text(help_text, language)
        
        audio_url = tts_service.text_to_speech(help_text, language)
        
        return {
            "text": ocr_result["text"],
            "fields": ocr_result["fields"],
            "help": help_text,
            "audio_url": audio_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-audio")
async def generate_audio(request: dict):
    """Generate audio for text"""
    try:
        text = request.get("text")
        language = request.get("language", "English")
        
        if not text:
            raise HTTPException(status_code=400, detail="No text provided")
            
        audio_url = tts_service.text_to_speech(text, language)
        return {"audio_url": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "services": ["document", "ocr", "translation", "tts", "rag"],
        "version": "2.0"
    }

@app.post("/debug/token")
async def debug_token(request: dict):
    """Debug endpoint to check token format"""
    try:
        token = request.get("token")
        if not token:
            return {"error": "No token provided"}
        
        import jwt
        JWT_SECRET = os.getenv("JWT_SECRET", "mysarkar_jwt_secret_key_2024")
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            return {"valid": True, "payload": payload}
        except jwt.ExpiredSignatureError:
            return {"valid": False, "error": "Token expired"}
        except jwt.InvalidTokenError as e:
            return {"valid": False, "error": f"Invalid token: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}
        

        # Translator 
class TranslateIn(BaseModel):
    text: str
    language: str = "hi"

class TranslateOut(BaseModel):
    translatedText: str

@app.post("/translate", response_model=TranslateOut)
def translate(body: TranslateIn):
    try:
        if not body.text or not body.text.strip():
            raise HTTPException(status_code=400, detail="Text is required")
        
        translated = translate_text(body.text, body.language)
        return {"translatedText": translated}
    except Exception as e:
        print(f"Translation endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Translation failed")
        
# Add this after your existing imports
class HateSpeechRequest(BaseModel):
    text: str
# Replace the hate speech initialization section with this:
ps = PorterStemmer()
tfidf = None
hate_model = None

try:
    # Try different paths for the pickle files
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Try multiple possible paths
    possible_paths = [
        'Hate-Speech/vectorizer.pkl',
        '../Hate-Speech/vectorizer.pkl',
        os.path.join(current_dir, '..', 'Hate-Speech', 'vectorizer.pkl')
    ]
    
    for path in possible_paths:
        try:
            tfidf = pickle.load(open(path, 'rb'))
            model_path = path.replace('vectorizer.pkl', 'model.pkl')
            hate_model = pickle.load(open(model_path, 'rb'))
            print(f"✅ Loaded hate speech models from: {path}")
            break
        except FileNotFoundError:
            continue
    
    if not tfidf:
        print("❌ Could not find hate speech model files")
        
except Exception as e:
    print(f"❌ Error loading hate speech models: {e}")

# Force download NLTK data
print("📥 Downloading NLTK data...")
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)

# Add the transform_text function with fallback tokenization
def transform_text(text):
    if('!' in text):
        if(':' in text):
            wrd = text[text.index('!'):text.index(':')+1]
            text = text.replace(wrd,'')

    text = text.lower()
    
    # Use simple split as fallback if NLTK fails
    try:
        text = nltk.word_tokenize(text)
    except:
        text = text.split()

    y = []
    for i in text:
        if i.isalpha():
            y.append(i)

    text = y[:]
    y.clear()

    try:
        stop_words = stopwords.words('english')
    except:
        stop_words = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']

    for i in text:
        if i not in stop_words and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    if 'rt' in y:
        y.remove('rt')

    for i in y:
        if (i == 'http' or i == 'like'):
            y.remove(i)

    return " ".join(y)

# Update the endpoint with better error handling:
@app.post("/detect-hatespeech")
async def detect_hate_speech(request: HateSpeechRequest):
    """Detect hate speech in text"""
    try:
        print(f"🔍 Checking text: {request.text[:50]}...")
        
        if not tfidf or not hate_model:
            print("❌ Models not loaded")
            raise HTTPException(status_code=503, detail="Hate speech detection service unavailable")
        
        transformed_text = transform_text(request.text)
        print(f"🔄 Transformed: {transformed_text}")
        
        vector_input = tfidf.transform([transformed_text])
        result = hate_model.predict(vector_input)[0]
        
        print(f"✅ Result: {result}")
        
        return {
            "is_hate_speech": bool(result),
            "text": request.text
        }
    except Exception as e:
        print(f"❌ Error in hate speech detection: {e}")
        raise HTTPException(status_code=500, detail=str(e))