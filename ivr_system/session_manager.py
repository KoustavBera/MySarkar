from typing import Dict

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, dict] = {}
    
    def get_session(self, call_sid: str) -> dict:
        if call_sid not in self.sessions:
            self.sessions[call_sid] = {"step": "language"}
        return self.sessions[call_sid]
    
    def clear_session(self, call_sid: str):
        if call_sid in self.sessions:
            del self.sessions[call_sid]

session_manager = SessionManager()