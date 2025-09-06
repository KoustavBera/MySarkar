from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from app.auth import verify_user_only, get_current_user
from app.services.ocr_service import OCRService
import os
import uuid
from datetime import datetime

router = APIRouter(prefix="/documents", tags=["documents"])
ocr_service = OCRService()

# In-memory storage for demo (replace with your database)
documents_db = []

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_user_only)  # Only users can upload
):
    """Upload and process document - Users only"""
    try:
        # Create user-specific directory
        user_dir = f"uploads/users/{user_id}"
        os.makedirs(user_dir, exist_ok=True)
        
        file_id = str(uuid.uuid4())
        file_path = f"{user_dir}/{file_id}_{file.filename}"
        
        # Save file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process with OCR and classification
        ocr_result = ocr_service.extract_text_from_image(content)
        doc_type = ocr_service.classify_document(ocr_result["text"])
        
        # Save to database
        document = {
            "_id": file_id,
            "user_id": user_id,
            "filename": file.filename,
            "file_path": file_path,
            "doc_type": doc_type,
            "extracted_text": ocr_result["text"],
            "created_at": datetime.now().isoformat()
        }
        documents_db.append(document)
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_documents(user_id: str = Depends(get_current_user)):
    """Get current user's documents only"""
    try:
        user_documents = [doc for doc in documents_db if doc["user_id"] == user_id]
        return user_documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{doc_id}/download")
async def download_document(
    doc_id: str,
    user_id: str = Depends(get_current_user)
):
    """Download user's own document only"""
    try:
        # Find document and verify ownership
        document = next((doc for doc in documents_db 
                        if doc["_id"] == doc_id and doc["user_id"] == user_id), None)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        if not os.path.exists(document["file_path"]):
            raise HTTPException(status_code=404, detail="File not found")
            
        return FileResponse(
            document["file_path"],
            filename=document["filename"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        