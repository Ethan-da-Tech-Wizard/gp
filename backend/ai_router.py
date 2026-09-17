"""
Dual-Routing AI Model Handler
Routes private customer code/data to local Ollama API, and public research to Gemini CLI / hosted endpoints.
"""

import json
import urllib.request
import urllib.error

OLLAMA_URL = "http://localhost:11434/api/generate"

def query_local_ollama(prompt: str, model: str = "llama3") -> str:
    """
    Query local Ollama instance for confidential customer data processing.
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(OLLAMA_URL, data=data, headers={"Content-Type": "application/json"})
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result.get("response", "")
    except urllib.error.URLError as e:
        return f"[Ollama Local Offline Fallback]: {str(e)}"

def format_prospect_research_prompt(company_name: str, vertical: str, website_text: str) -> str:
    """
    Generates prospect research prompt for account dossiers.
    """
    return f"""
    Analyze the following Arizona small business for operational automation opportunities:
    Company Name: {company_name}
    Vertical: {vertical}
    Public Text: {website_text}

    Return JSON with fields:
    - primary_process_owner
    - visible_software_clues
    - 3_plausible_repetitive_problems
    - evidence_vs_hypothesis_breakdown
    - personalized_cold_opener
    """

if __name__ == "__main__":
    print("Ethan AI Dual-Router Loaded.")
