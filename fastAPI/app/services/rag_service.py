import os
from dotenv import load_dotenv
import google.generativeai as genai
import requests
import json

class RAGService:
    def __init__(self):
        load_dotenv()

        # ---- Gemini Setup ----
        gemini_key = os.getenv("GOOGLE_API_KEY")
        if not gemini_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        genai.configure(api_key=gemini_key)
        self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Backend URL for scheme search
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:5000")



    # ---------------- Gemini functions ----------------
    def search_schemes(self, query, language="English", user_profile=None):
        """Enhanced RAG with vectorized scheme search"""
        # Get vectorized schemes from backend
        relevant_schemes = self._get_vectorized_schemes(query)
        
        # Enhanced government services context
        gov_context = self._get_government_services_context()
        
        prompt = f"""
        You are an Indian Government Services Assistant. Answer directly without preambles or disclaimers.
        
        User Query: {query}
        Language: {language}
        
        Relevant Schemes Found:
        {relevant_schemes}
        
        Government Services Context:
        {gov_context}
        
        Instructions:
        - Answer the query directly
        - List relevant schemes with eligibility and benefits
        - Include required documents and application process
        - No introductory text or disclaimers
        - Be concise and helpful
        - Respond in {language}
        """
        
        response = self.gemini_model.generate_content(prompt)
        return response.text

    def generate_form_help(self, fields, language="English"):
        """Enhanced form filling assistance"""
        prompt = f"""
        You are a government form filling assistant for India.
        
        Form Fields: {fields}
        Language: {language}
        
        Provide step-by-step guidance including:
        1. What information is needed for each field
        2. Where to find required documents
        3. Common mistakes to avoid
        4. Tips for faster processing
        
        Be helpful and explain in simple {language}.
        """
        response = self.gemini_model.generate_content(prompt)
        return response.text
    
    def get_universal_help(self, query, language="English"):
        """Universal government services helper"""
        return self.search_schemes(query, language)



    # ---------------- Helpers ----------------
    def _get_vectorized_schemes(self, query):
        """Fetch relevant schemes using vector search"""
        try:
            response = requests.post(
                f"{self.backend_url}/api/v1/schemes/search",
                json={"query": query},
                timeout=10
            )
            if response.status_code == 200:
                schemes = response.json().get("schemes", [])
                return self._format_schemes_for_context(schemes)
        except Exception as e:
            print(f"Vector search failed: {e}")
        
        # Fallback to basic schemes data
        return self._get_basic_schemes_data()
    
    def _format_schemes_for_context(self, schemes):
        """Format schemes data for AI context"""
        if not schemes:
            return "No specific schemes found for this query."
        
        formatted = []
        for scheme in schemes[:5]:  # Limit to top 5
            formatted.append(f"""
            Scheme: {scheme.get('name', 'N/A')}
            Overview: {scheme.get('overview', 'N/A')[:200]}...
            Eligibility: {scheme.get('eligibility', 'N/A')[:150]}...
            Benefits: {scheme.get('benefits', 'N/A')[:150]}...
            Documents: {scheme.get('documents', 'N/A')[:100]}...
            """)
        
        return "\n".join(formatted)
    
    def _get_government_services_context(self):
        """Universal government services knowledge base"""
        return """
        INSURANCE SERVICES:
        - Pradhan Mantri Jeevan Jyoti Bima Yojana (Life Insurance - ₹2 lakh)
        - Pradhan Mantri Suraksha Bima Yojana (Accident Insurance - ₹2 lakh)
        - Pradhan Mantri Fasal Bima Yojana (Crop Insurance)
        - Ayushman Bharat (Health Insurance - ₹5 lakh)
        
        HEALTHCARE SERVICES:
        - AIIMS hospitals and government medical colleges
        - Primary Health Centers (PHCs) and Community Health Centers
        - Jan Aushadhi stores for affordable medicines
        - National Health Mission programs
        
        EDUCATION & SCHOLARSHIPS:
        - National Scholarship Portal (scholarships.gov.in)
        - PM YASASVI Scheme for OBC/EBC/DNT students
        - Post Matric Scholarship for SC/ST/OBC
        - Merit-cum-Means Scholarship
        
        EMPLOYMENT & SKILLS:
        - MGNREGA (100 days guaranteed employment)
        - Pradhan Mantri Kaushal Vikas Yojana (Skill Development)
        - Startup India and Stand Up India
        - Rozgar Mela (Government job fairs)
        
        DIGITAL SERVICES:
        - Aadhaar services and updates
        - PAN card application and services
        - Passport services (passportindia.gov.in)
        - Driving license and vehicle registration
        - Income/caste/domicile certificates
        
        FINANCIAL SERVICES:
        - Jan Dhan Yojana (Bank accounts)
        - PM Mudra Yojana (Business loans)
        - Kisan Credit Card
        - Direct Benefit Transfer (DBT)
        
        SOCIAL WELFARE:
        - Public Distribution System (PDS/Ration)
        - Widow pension schemes
        - Disability pension and certificates
        - Senior citizen benefits
        """
    
    def _get_basic_schemes_data(self):
        """Fallback schemes data when vector search fails"""
        return """
        PM-KISAN: ₹6,000/year for farmers, Land records + Aadhaar required
        Ayushman Bharat: ₹5 lakh health insurance for BPL families
        PM Mudra Yojana: Business loans up to ₹10 lakh
        MGNREGA: 100 days guaranteed employment in rural areas
        PM Awas Yojana: Housing assistance for eligible families
        """


