from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ocr_service import OCRService

router = APIRouter(prefix="/ocr", tags=["OCR"])
ocr_service = OCRService()

class OCRRequest(BaseModel):
    image_data: str
    language: str = "eng"  # default English

@router.post("/extract")
async def extract_text(request: OCRRequest):
    """Extract text + structured fields from an image"""
    try:
        result = ocr_service.extract_text_from_image(request.image_data, request.language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def ocr_health():
    """Check OCR service health"""
    return {"status": "ok", "engine": "pytesseract"}
    