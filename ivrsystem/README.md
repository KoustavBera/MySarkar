# IVR System MVP

A complete Interactive Voice Response (IVR) system built with FastAPI and Twilio, featuring language selection, demographic collection, RAG-based knowledge base querying, translation, and TTS support.

## Features

- **Language Selection**: English and Odia support
- **Demographic Collection**: Name, age, location, gender
- **RAG Knowledge Base**: Query English knowledge base with OpenAI
- **Translation**: English to Odia translation
- **TTS Support**: Twilio Say + Azure Speech for Odia
- **Session Management**: Maintains call state across requests

## Project Structure

```
ivrsystem_demo/
├── main.py                 # FastAPI application
├── config.py              # Configuration management
├── models.py              # Data models
├── ivr_handler.py         # IVR call flow logic
├── session_manager.py     # Session state management
├── services/
│   ├── __init__.py
│   ├── tts_service.py     # Azure TTS service
│   ├── translation_service.py  # Translation service
│   └── rag_service.py     # RAG knowledge base
├── knowledge_base/
│   └── faq.txt           # Sample knowledge base
├── requirements.txt       # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## Setup Instructions

### 1. Environment Setup

```bash
# Clone or create project directory
cd ivrsystem_demo

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
copy .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Azure Speech Configuration
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
APP_HOST=0.0.0.0
APP_PORT=8000
BASE_URL=https://your-ngrok-url.ngrok.io
```

### 3. Get Required API Keys

**Twilio:**
1. Sign up at https://www.twilio.com/
2. Get Account SID and Auth Token from Console
3. Purchase a phone number with voice capabilities

**Azure Speech:**
1. Create Azure account at https://portal.azure.com/
2. Create Speech Service resource
3. Get subscription key and region

**OpenAI:**
1. Sign up at https://platform.openai.com/
2. Generate API key from API Keys section

### 4. Setup Ngrok (for local development)

```bash
# Install ngrok
# Download from https://ngrok.com/

# Expose local server
ngrok http 8000

# Copy the HTTPS URL to .env BASE_URL
```

### 5. Configure Twilio Webhook

1. Go to Twilio Console > Phone Numbers
2. Click on your purchased number
3. Set Webhook URL to: `https://your-ngrok-url.ngrok.io/webhook`
4. Set HTTP method to POST

## Running the Application

```bash
# Activate virtual environment
venv\Scripts\activate

# Run the application
python main.py

# Or use uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Testing the System

1. **Call Flow Test:**
   - Call your Twilio number
   - Select language (1 for English, 2 for Odia)
   - Provide demographic information when prompted
   - Ask a question about the knowledge base

2. **Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```

3. **API Documentation:**
   - Visit http://localhost:8000/docs for Swagger UI

## Call Flow

1. **Welcome**: Language selection (English/Odia)
2. **Demographics Collection**:
   - Name (speech input)
   - Age (speech input)
   - Location (speech input)
   - Gender (speech input)
3. **Question Handling**:
   - User asks question (speech input)
   - RAG system queries knowledge base
   - Response translated to selected language
   - TTS response delivered

## Debugging Tips

### Common Issues

1. **Twilio Webhook Errors:**
   - Check ngrok is running and URL is correct
   - Verify webhook URL in Twilio console
   - Check server logs for errors

2. **Azure TTS Issues:**
   - Verify Azure Speech key and region
   - Check if Odia voice is available in your region
   - Test with English first

3. **OpenAI API Errors:**
   - Check API key validity
   - Verify billing account has credits
   - Monitor rate limits

4. **Translation Errors:**
   - Google Translate may have rate limits
   - Check internet connectivity
   - Fallback to English if translation fails

### Logging

Add logging to debug issues:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Testing Individual Components

```python
# Test RAG service
from services.rag_service import rag_service
result = rag_service.query("What are your business hours?")
print(result)

# Test translation
from services.translation_service import translation_service
translated = translation_service.translate_text("Hello", Language.ODIA)
print(translated)
```

## Production Deployment

1. **Use proper WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Environment variables:**
   - Set production URLs
   - Use secure credential storage
   - Enable HTTPS

3. **Monitoring:**
   - Add application monitoring
   - Set up error tracking
   - Monitor API usage and costs

## Error Prevention

1. **Input Validation**: All user inputs are validated
2. **Fallback Responses**: Default responses for API failures
3. **Session Management**: Proper session cleanup
4. **Rate Limiting**: Consider adding rate limits for production
5. **Error Handling**: Comprehensive try-catch blocks

## Extending the System

1. **Add More Languages**: Update models.py and translation service
2. **Enhanced Knowledge Base**: Add more documents to knowledge_base/
3. **Database Integration**: Replace in-memory session storage
4. **Analytics**: Add call analytics and reporting
5. **Advanced TTS**: Implement custom voice models

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify all API keys are correct
3. Test individual components separately
4. Check Twilio webhook logs in console