import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import uuid

class AuditTrail:
    """Blockchain-inspired immutable audit trail system"""
    
    def __init__(self, db):
        self.db = db
    
    def calculate_hash(self, data: Dict[str, Any]) -> str:
        """Calculate SHA-256 hash of data"""
        data_string = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(data_string.encode()).hexdigest()
    
    async def get_previous_hash(self) -> Optional[str]:
        """Get the hash of the most recent audit log entry"""
        last_log = await self.db.audit_logs.find_one(
            sort=[("timestamp", -1)]
        )
        return last_log["data_hash"] if last_log else None
    
    async def log_action(
        self,
        action: str,
        user_id: str,
        details: Dict[str, Any]
    ) -> str:
        """Log an action with blockchain-like linking"""
        previous_hash = await self.get_previous_hash()
        
        log_entry = {
            "id": str(uuid.uuid4()),
            "action": action,
            "user_id": user_id,
            "timestamp": datetime.now(timezone.utc),
            "previous_hash": previous_hash,
            "details": details
        }
        
        # Calculate hash including previous hash for chain integrity
        hash_data = {
            **log_entry,
            "timestamp": log_entry["timestamp"].isoformat()
        }
        log_entry["data_hash"] = self.calculate_hash(hash_data)
        
        # Convert datetime to ISO string for MongoDB
        log_entry["timestamp"] = log_entry["timestamp"].isoformat()
        
        await self.db.audit_logs.insert_one(log_entry)
        return log_entry["data_hash"]
    
    async def verify_chain_integrity(self) -> bool:
        """Verify the integrity of the audit chain"""
        logs = await self.db.audit_logs.find().sort("timestamp", 1).to_list(None)
        
        if not logs:
            return True
        
        previous_hash = None
        for log in logs:
            # Verify previous hash matches
            if log.get("previous_hash") != previous_hash:
                return False
            
            # Recalculate hash to verify data integrity
            log_copy = log.copy()
            stored_hash = log_copy.pop("data_hash")
            log_copy.pop("_id", None)
            
            calculated_hash = self.calculate_hash(log_copy)
            if calculated_hash != stored_hash:
                return False
            
            previous_hash = stored_hash
        
        return True
