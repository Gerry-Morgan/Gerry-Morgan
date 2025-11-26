from fastapi import Request, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os

async def get_current_user(request: Request, db: AsyncIOMotorClient):
    """Get current authenticated user from session token"""
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check session in database
    session = await db.user_sessions.find_one({"session_token": session_token})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check if session expired
    if session["expires_at"] < datetime.now(timezone.utc):
        await db.user_sessions.delete_one({"session_token": session_token})
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user = await db.users.find_one({"_id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Map _id to id for Pydantic
    user["id"] = user.pop("_id")
    return user

def require_roles(allowed_roles: list):
    """Decorator to check if user has required role"""
    async def role_checker(request: Request, db: AsyncIOMotorClient):
        user = await get_current_user(request, db)
        if user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker
