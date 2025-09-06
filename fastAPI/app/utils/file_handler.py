# file_handler.py
import os, shutil
from fastapi import UploadFile
from fastapi.responses import FileResponse
from PIL import Image
import pdfplumber
from sentence_transformers import SentenceTransformer, util
from ocr_utils import ocr_image

# Upload directory
UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Your keyword dictionary (as before)
document_keywords = {
    "Aadhar Card": ["aadhaar", "uidai", "enrolment id", "आधार"],
    "PAN Card": ["pan card", "income tax", "पैन"],
    "Driving License": ["driving licence", "dl number", "ड्राइविंग"],
    "Voter ID": ["voter id", "epic", "मतदाता"],
    "Birth Certificate": ["birth certificate", "जन्म प्रमाण पत्र"],
    "Passport": ["passport", "passport seva", "पासपोर्ट"],
    # ... (add more)
}

def save_upload_file(upload_file: UploadFile, dest: str):
    """Save uploaded file to disk."""
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

def extract_text_from_file(file_path: str) -> str:
    """Extract text from image/pdf using pytesseract."""
    text = ""
    if file_path.lower().endswith((".jpg", ".jpeg", ".png")):
        img = Image.open(file_path)
        text = ocr_image(img)
    elif file_path.lower().endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                else:  # OCR fallback for scanned PDF
                    pil_img = page.to_image(resolution=300).original
                    text += ocr_image(pil_img) + "\n"
    return text.strip()

def classify_document(text: str) -> str:
    """Hybrid classification: keywords first, then semantic similarity."""
    text_lower = text.lower()

    # Step 1: keyword matching
    for doc_type, keywords in document_keywords.items():
        if any(k.lower() in text_lower for k in keywords):
            return doc_type

    # Step 2: embedding similarity
    doc_emb = model.encode(text, convert_to_tensor=True)
    similarities = {}
    for doc_type, keywords in document_keywords.items():
        keyword_text = " ".join(keywords)
        kw_emb = model.encode(keyword_text, convert_to_tensor=True)
        similarities[doc_type] = util.pytorch_cos_sim(doc_emb, kw_emb).item()
    best_doc_type = max(similarities.items(), key=lambda x: x[1])[0]
    return best_doc_type

def save_document(file: UploadFile, doc_type: str) -> str:
    """Save document into folder based on classification."""
    folder_path = os.path.join(UPLOAD_DIR, doc_type)
    os.makedirs(folder_path, exist_ok=True)
    filename = file.filename if file.filename else "default_filename.txt"
    file_path = os.path.join(folder_path, filename)
    save_upload_file(file, file_path)
    return file_path
    
def download_file(doc_type: str, filename: str):
    """Return file as response for download."""
    file_path = os.path.join(UPLOAD_DIR, doc_type, filename)
    return FileResponse(path=file_path, filename=filename)
    