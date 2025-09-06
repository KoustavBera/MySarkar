import requests
import os

def test_fastapi_connection():
    """Test if FastAPI server is running"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"FastAPI Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"FastAPI server not accessible: {e}")
        return False

def test_upload_endpoint():
    """Test upload endpoint with a dummy file"""
    try:
        # Create a simple test image
        from PIL import Image
        import io
        
        # Create a simple white image with text
        img = Image.new('RGB', (200, 100), color='white')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test.png', img_bytes, 'image/png')}
        headers = {'Authorization': 'Bearer your_test_token_here'}
        
        response = requests.post("http://localhost:8000/documents/upload", 
                               files=files, headers=headers)
        print(f"Upload Test: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Upload test failed: {e}")

if __name__ == "__main__":
    print("Testing FastAPI server...")
    if test_fastapi_connection():
        print("\nTesting upload endpoint...")
        test_upload_endpoint()