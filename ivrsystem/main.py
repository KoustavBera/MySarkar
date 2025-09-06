from fastapi import FastAPI, Form, Request
from fastapi.responses import Response, JSONResponse
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from config import config
from models import Language
from data import MESSAGES
from session_manager import session_manager
from ivr_handler import ivr_handler

app = FastAPI(title="Government Scheme IVR", version="1.0.0")

# Initialize Twilio client
try:
    twilio_client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN) if config.TWILIO_ACCOUNT_SID else None
except:
    twilio_client = None

@app.get("/")
async def root():
    html = '''<!DOCTYPE html>
<html><head>
<title>Government Scheme IVR</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5}
.container{max-width:500px;margin:0 auto;background:white;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
h1{color:#333;text-align:center;margin-bottom:30px}
.form-group{margin-bottom:20px}
label{display:block;margin-bottom:8px;font-weight:bold;color:#555}
input{width:100%;padding:12px;border:2px solid #ddd;border-radius:5px;font-size:16px;box-sizing:border-box}
button{width:100%;padding:12px;background:#007bff;color:white;border:none;border-radius:5px;font-size:16px;cursor:pointer;margin-top:10px}
button:hover{background:#0056b3}
button:disabled{background:#ccc;cursor:not-allowed}
.result{margin-top:20px;padding:15px;border-radius:5px;display:none}
.success{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
.error{background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
.loading{background:#d1ecf1;color:#0c5460;border:1px solid #bee5eb}
.info{background:#e2e3e5;color:#383d41;border:1px solid #d6d8db;margin-bottom:20px}
</style>
</head>
<body>
<div class="container">
<h1>🏛️ Government Scheme Helpline</h1>
<div class="info">Enter a phone number to initiate an IVR call for government scheme information.</div>
<form id="callForm">
<div class="form-group">
<label for="phoneNumber">Phone Number:</label>
<input type="tel" id="phoneNumber" placeholder="+1234567890" required>
</div>
<button type="submit" id="callBtn">📞 Make Call</button>
</form>
<div id="result" class="result"></div>
</div>
<script>
document.getElementById('callForm').onsubmit = async function(e) {
e.preventDefault();
const phoneNumber = document.getElementById('phoneNumber').value;
const resultDiv = document.getElementById('result');
const callBtn = document.getElementById('callBtn');
callBtn.disabled = true;
callBtn.textContent = 'Calling...';
resultDiv.className = 'result loading';
resultDiv.style.display = 'block';
resultDiv.innerHTML = 'Initiating call...';
try {
const response = await fetch('/make_call', {
method: 'POST',
headers: {'Content-Type': 'application/x-www-form-urlencoded'},
body: 'to_number=' + encodeURIComponent(phoneNumber)
});
const text = await response.text();
let result;
try { result = JSON.parse(text); } catch { result = {status: 'error', message: text}; }
if (result.status === 'success') {
resultDiv.className = 'result success';
resultDiv.innerHTML = '✅ Call initiated successfully to ' + result.to + '<br><small>Call SID: ' + result.call_sid + '</small>';
} else {
resultDiv.className = 'result error';
resultDiv.innerHTML = '❌ Error: ' + result.message;
}
} catch (error) {
resultDiv.className = 'result error';
resultDiv.innerHTML = '❌ Network error: Unable to connect to server';
} finally {
callBtn.disabled = false;
callBtn.textContent = '📞 Make Call';
}
};
</script>
</body></html>'''
    return Response(content=html, media_type="text/html")

@app.post("/")
async def root_webhook(request: Request):
    # Redirect Twilio calls from root to proper webhook
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    
    if call_sid:
        # This is a Twilio call, handle it
        return await webhook(request)
    else:
        # Not a Twilio call
        return JSONResponse({"error": "Invalid request"})


@app.post("/make_call")
async def make_call(to_number: str = Form(...)):
    try:
        if not twilio_client:
            return JSONResponse({"status": "error", "message": "Twilio not configured"})
        
        call = twilio_client.calls.create(
            to=to_number,
            from_=config.TWILIO_PHONE_NUMBER,
            url=f"{config.BASE_URL}/webhook"
        )
        import html
        return JSONResponse({"status": "success", "call_sid": call.sid, "to": html.escape(to_number)})
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)})

@app.post("/webhook")
async def webhook(request: Request):
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    
    if not call_sid:
        response = VoiceResponse()
        response.say("Invalid call session")
        response.hangup()
        return Response(content=str(response), media_type="application/xml")
    
    session = session_manager.get_session(call_sid)
    
    # Store caller number for SMS report
    from_number = form_data.get("From")
    if from_number:
        session['caller_number'] = from_number
    
    response = VoiceResponse()
    
    if session["step"] == "language":
        response.say(MESSAGES["welcome"][Language.ENGLISH], voice="alice")
        response.gather(num_digits=1, action="/handle_language", method="POST")
    
    return Response(content=str(response), media_type="application/xml")

@app.post("/handle_language")
async def handle_language(request: Request):
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    digits = form_data.get("Digits")
    
    response = ivr_handler.handle_language(call_sid, digits)
    return Response(content=str(response), media_type="application/xml")

@app.post("/handle_name")
async def handle_name(request: Request):
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    speech_result = form_data.get("SpeechResult", "")
    
    response = ivr_handler.handle_name(call_sid, speech_result)
    return Response(content=str(response), media_type="application/xml")

@app.post("/handle_region")
async def handle_region(request: Request):
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    digits = form_data.get("Digits")
    
    response = ivr_handler.handle_region(call_sid, digits)
    return Response(content=str(response), media_type="application/xml")

@app.post("/handle_gender")
async def handle_gender(request: Request):
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    digits = form_data.get("Digits")
    
    response = ivr_handler.handle_gender(call_sid, digits)
    return Response(content=str(response), media_type="application/xml")

@app.post("/handle_scheme")
async def handle_scheme(request: Request):
    form_data = await request.form()
    call_sid = form_data.get("CallSid")
    digits = form_data.get("Digits")
    
    response = ivr_handler.handle_scheme(call_sid, digits)
    return Response(content=str(response), media_type="application/xml")

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Government Scheme IVR"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)