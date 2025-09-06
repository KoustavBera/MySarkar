from pydantic import BaseModel, Field
from datetime import datetime

class DocumentModel(BaseModel):
    filename: str
    doc_type: str
    gridfs_id: str
    upload_date: datetime
    content_type: str
    user_id: str = Field(..., description="ID of the user who uploaded the document")