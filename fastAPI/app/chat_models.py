from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class ChatType(str, Enum):
    GENERAL_QUERY = "general_query"
    SCHEME_SEARCH = "scheme_search"
    ELIGIBILITY_CHECK = "eligibility_check"
    APPLICATION_HELP = "application_help"
    FORM_ASSISTANCE = "form_assistance"
    STATUS_INQUIRY = "status_inquiry"

class ChatRequest(BaseModel):
    message: str
    language: str = "English"
    chat_type: Optional[ChatType] = ChatType.GENERAL_QUERY
    user_context: Optional[Dict] = None
    session_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    response: str
    audio_url: Optional[str] = None
    suggested_actions: List[str] = Field(default_factory=list)
    related_schemes: List[Dict] = Field(default_factory=list)
    confidence_score: Optional[float] = None
    response_time: Optional[float] = None
    
class FormAnalysis(BaseModel):
    fields: List[Dict]
    suggestions: Dict
    language: str
    completion_percentage: Optional[float] = None
    missing_fields: List[str] = Field(default_factory=list)
    auto_fill_suggestions: Dict = Field(default_factory=dict)

class ConversationContext(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    conversation_history: List[Dict] = Field(default_factory=list)
    current_intent: Optional[str] = None
    extracted_entities: Dict = Field(default_factory=dict)
    user_preferences: Dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SmartSuggestion(BaseModel):
    type: str  # "scheme", "document", "action", "question"
    title: str
    description: str
    priority: int = 1
    action_url: Optional[str] = None
    
class EnhancedChatResponse(ChatResponse):
    smart_suggestions: List[SmartSuggestion] = Field(default_factory=list)
    user_journey_stage: Optional[str] = None
    next_best_action: Optional[str] = None
    personalization_applied: bool = False
