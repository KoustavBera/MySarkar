import jwt
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer
import os

security = HTTPBearer()

# Use same JWT secret as your JavaScript backend
JWT_SECRET = os.getenv("JWT_SECRET", "mysarkar_jwt_secret_key_2024")

def verify_token(token: str = Depends(security)):
    """Verify JWT token and return user data"""
    try:
        payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("userId")
        role = payload.get("role")
        
        if not user_id or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        return {
            "user_id": user_id,
            "role": role
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def verify_user_only(user_data: dict = Depends(verify_token)):
    """Ensure only 'user' role can access"""
    if user_data["role"] != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Document upload is only available for regular users"
        )
    return user_data["user_id"]

def get_current_user(user_data: dict = Depends(verify_token)):
    """Get current authenticated user ID"""
    return user_data["user_id"]
    