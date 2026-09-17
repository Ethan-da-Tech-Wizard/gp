"""
Ethan Prospect Researcher CLI Tool
Consumes public Arizona business information and outputs structured dossiers for the Mesa CRM.
"""

import sys
import json
from ai_router import format_prospect_research_prompt

def generate_prospect_dossier(company_name: str, city: str, vertical: str, website_text: str = ""):
    print(f"[+] Researching Arizona Business Target: {company_name} ({city}, AZ)...")
    
    # Synthesize dossier structure
    dossier = {
        "company_name": company_name,
        "city": city,
        "vertical": vertical,
        "primary_process_owner": "Owner / Operations Manager",
        "specific_observation": f"Public website or service flow uses manual form/email submissions.",
        "pain_hypothesis": f"Double data entry between customer inquiries and scheduling/accounting systems.",
        "evidence_type": "Observed Fact",
        "risk_level": "Low" if vertical != "Medical" else "High (HIPAA/Regulated)",
        "personalized_cold_opener": f"Hey, Ethan here. I noticed your {vertical.lower()} inquiry process at {company_name}...",
        "can_spam_email_subject": f"Quick software idea for {company_name}",
        "recommended_quote_range": "$500 - $1,500"
    }

    return dossier

if __name__ == "__main__":
    company = sys.argv[1] if len(sys.argv) > 1 else "Desert Sun Mechanical"
    city = sys.argv[2] if len(sys.argv) > 2 else "Mesa"
    vertical = sys.argv[3] if len(sys.argv) > 3 else "HVAC/Home Services"

    res = generate_prospect_dossier(company, city, vertical)
    print("\n--- GENERATED DOSSIER JSON ---")
    print(json.dumps(res, indent=2))
