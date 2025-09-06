# ocr_utils.py
import re, base64, io
from PIL import Image, ImageOps, ImageEnhance
import pytesseract

try:
    import cv2, numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

# languages: English + Hindi + Bengali (add more if installed)
LANGS = "eng+hin+ben"
TESS_CONFIG = f"--oem 3 --psm 6 -l {LANGS}"

def _correct_orientation(img: Image.Image) -> Image.Image:
    """Detect orientation and rotate if needed."""
    try:
        osd = pytesseract.image_to_osd(img)
        match = re.search(r"Orientation in degrees:\s+(\d+)", osd)
        if match:
            angle = int(match.group(1)) % 360
            if angle:
                return img.rotate(360 - angle, expand=True)
    except Exception:
        pass
    return img

def _preprocess_pil(img: Image.Image) -> Image.Image:
    """Light preprocessing with PIL."""
    img = ImageOps.grayscale(img)
    img = ImageEnhance.Contrast(img).enhance(1.5)
    return img.point(lambda p: 255 if p > 180 else 0)

def _preprocess_cv(img: Image.Image) -> Image.Image:
    """Advanced preprocessing with OpenCV if available."""
    arr = np.array(img)
    if len(arr.shape) == 3:
        gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    else:
        gray = arr
    gray = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)
    thr = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 2
    )
    return Image.fromarray(thr)

def preprocess_image(img: Image.Image) -> Image.Image:
    img = _correct_orientation(img)
    return _preprocess_cv(img) if HAS_CV2 else _preprocess_pil(img)

def ocr_image(img: Image.Image) -> str:
    """Run pytesseract OCR with preprocessing."""
    preprocessed = preprocess_image(img)
    text = pytesseract.image_to_string(preprocessed, config=TESS_CONFIG)
    return text.strip()

def image_bytes_to_pil(image_data: bytes | str) -> Image.Image:
    """Accept raw bytes or base64 and return a PIL image."""
    if isinstance(image_data, str):
        if "," in image_data:  # handle data URL
            image_data = image_data.split(",")[1]
        image_data = base64.b64decode(image_data)
    return Image.open(io.BytesIO(image_data))
    