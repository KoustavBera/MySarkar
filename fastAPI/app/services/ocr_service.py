import pytesseract
from PIL import Image
import io
import base64
import re
import logging

try:
    import cv2
    import numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OCRService:
    def extract_text_from_image(self, image_data, language="eng"):
        """
        Extract text from image data (base64 or bytes).
        Supports multiple languages: e.g., "eng", "eng+hin", "ben", "ori".
        """
        try:
            # Handle different input types
            if isinstance(image_data, str):
                if ',' in image_data:  # Data URL format
                    image_bytes = base64.b64decode(image_data.split(',')[1])
                else:  # Plain base64
                    image_bytes = base64.b64decode(image_data)
            else:  # Raw bytes (file upload)
                image_bytes = image_data

            image = Image.open(io.BytesIO(image_bytes))

            # Preprocess image for better OCR
            image = self._preprocess_image(image)

            # Extract text with Tesseract
            text = pytesseract.image_to_string(image, lang=language)

            if not text.strip():
                text = "No text detected in the image. Please ensure the image is clear and contains readable text."

            # Detect form fields
            fields = self._detect_form_fields(text)

            # Document classification
            doc_type = self.classify_document(text)

            return {"text": text, "fields": fields, "document_type": doc_type}

        except Exception as e:
            logger.error(f"OCR Error: {e}", exc_info=True)
            return {"error": f"Could not process image: {str(e)}"}

    def _preprocess_image(self, image):
        """Enhance image for better OCR results"""
        try:
            if HAS_CV2:
               img = np.array(image)

               
                #If already grayscale, skip conversion
               if len(img.shape) == 2: #(H, W)
                  gray = img
               else:
                  gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
                  _, img_bin = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
                  return Image.fromarray(img_bin)
            else:
                # Fallback to PIL-only preprocessing
                return image.convert('L')
        except Exception as e:
            logger.warning(f"Preprocessing failed, using raw image. Error: {e}")
            return image
            
    def _detect_form_fields(self, text):
        """Improved form field detection with synonyms"""
        fields = []
        lines = text.split('\n')

        field_patterns = {
            "name": [r"name", r"full\s*name"],
            "email": [r"email", r"e-mail"],
            "phone": [r"phone", r"mobile", r"contact"],
            "address": [r"address", r"addr"],
            "date": [r"date", r"d\.o\.b", r"dob"],
            "signature": [r"sign", r"signature"],
            "amount": [r"amount", r"rs\.?", r"rupees"],
        }

        for line in lines:
            line_clean = line.lower().strip()
            for field_type, patterns in field_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, line_clean):
                        fields.append({
                            "field": line.strip(),
                            "type": field_type,
                            "required": True
                        })
                        break  # Stop checking once matched

        return fields

    def classify_document(self, text):
        """Smarter classification based on keyword sets"""
        text_lower = text.lower()

        doc_keywords = {
            "aadhaar_card": ["aadhaar", "aadhar", "uidai"],
            "pan_card": ["permanent account number", "income tax department", "pan"],
            "passport": ["passport", "republic of india", "ministry of external affairs"],
            "driving_license": ["driving licence", "dl", "transport department"],
            "voter_id": ["election commission", "voter id", "epic no"],
            "birth_certificate": ["birth certificate", "municipal corporation"],
        }

        for doc_type, keywords in doc_keywords.items():
            if any(word in text_lower for word in keywords):
                return doc_type

        return "other_document"
        