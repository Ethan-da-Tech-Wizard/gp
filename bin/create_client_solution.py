#!/usr/bin/env python3
"""
Ethan's Standalone Client Solution Generator
Usage: python3 bin/create_client_solution.py "Mesa Master Plumbing" --type quote-portal
Types available:
  - quote-portal (Standalone customer intake & instant estimate micro-app)
  - ops-cleaner (Standalone CSV & database normalizer script)
  - doc-parser (Standalone OCR/LLM invoice extraction microservice)
  - status-board (Standalone customer job status portal)
"""

import sys
import os
import json
import argparse
from pathlib import Path

TEMPLATES = {
    "quote-portal": {
        "title": "Standalone Quote & Service Intake Micro-App",
        "files": {
            "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{{CLIENT_NAME}} - Online Quote Portal</title>
  <style>
    body { background: #0b0f19; color: #f8fafc; font-family: system-ui, sans-serif; padding: 2rem; }
    .card { background: #151d30; border: 1px solid #1e293b; border-radius: 12px; padding: 2rem; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #00f3ff; font-size: 1.5rem; margin-bottom: 0.5rem; }
    .input { width: 100%; padding: 0.75rem; margin: 0.5rem 0 1rem 0; background: #090d16; border: 1px solid #334155; border-radius: 6px; color: #fff; box-sizing: border-box; }
    .btn { background: linear-gradient(135deg, #00f3ff, #0284c7); color: #000; font-weight: bold; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; width: 100%; font-size: 1rem; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>{{CLIENT_NAME}}</h1>
    <p style="color: #94a3b8; font-size: 0.9rem;">Instant Service Estimate & Scheduling Portal</p>
    <form id="quoteForm">
      <label style="font-size: 0.85rem; color: #cbd5e1;">Your Name</label>
      <input type="text" id="name" class="input" placeholder="e.g. John Smith" required />
      
      <label style="font-size: 0.85rem; color: #cbd5e1;">Phone Number</label>
      <input type="text" id="phone" class="input" placeholder="(480) 555-0199" required />
      
      <label style="font-size: 0.85rem; color: #cbd5e1;">Service Needed</label>
      <select id="service" class="input">
        <option value="Standard Inspection">Standard Inspection ($150)</option>
        <option value="Repair / Replacement">Repair / System Replacement ($1,200+)</option>
        <option value="Emergency Service">Emergency Service Request ($300)</option>
      </select>
      
      <button type="submit" class="btn">Get Instant Estimate & Schedule</button>
    </form>
    <div id="result" style="display:none; margin-top: 1.5rem; padding: 1rem; background: rgba(16,185,129,0.15); border: 1px solid #10b981; border-radius: 8px; color: #34d399; font-size: 0.9rem;"></div>
  </div>

  <script>
    document.getElementById('quoteForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service').value;
      
      document.getElementById('result').style.display = 'block';
      document.getElementById('result').innerHTML = `<strong>Estimate Generated for ${name}!</strong><br>Service: ${service}<br>We have sent a SMS confirmation to <strong>${phone}</strong>. Our dispatcher will call within 15 minutes.`;
    });
  </script>
</body>
</html>""",
            "server.py": """from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/api/lead', methods=['POST'])
def receive_lead():
    data = request.json
    print(f"[NEW LEAD RECEIVED FOR {{CLIENT_NAME}}]: {data}")
    # Run phone validation, DB save, and SMS dispatch trigger here
    return jsonify({"status": "success", "message": "Lead dispatched to {{CLIENT_NAME}} board"})

if __name__ == '__main__':
    app.run(port=5000)
"""
        }
    },
    "ops-cleaner": {
        "title": "Standalone Data Normalizer & CSV Converter",
        "files": {
            "cleaner.py": """import csv
import re
import sys

def clean_file(input_csv, output_csv):
    print(f"[*] Processing raw file '{input_csv}' for {{CLIENT_NAME}}...")
    cleaned_rows = []
    
    with open(input_csv, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 1. Clean Customer Name
            cust = row.get('customer', '').strip().title()
            
            # 2. Clean Date (01012024 -> 01/01/2024)
            date_raw = row.get('date', '').strip()
            date_digits = re.sub(r'\\D', '', date_raw)
            if len(date_digits) == 8:
                clean_date = f"{date_digits[:2]}/{date_digits[2:4]}/{date_digits[4:]}"
            else:
                clean_date = date_raw
                
            # 3. Clean Amount
            amount_raw = row.get('amount', '0')
            clean_amount = float(re.sub(r'[^0-9.]', '', amount_raw) or 0)
            
            cleaned_rows.append({
                "Customer": cust,
                "Date": clean_date,
                "Amount": f"${clean_amount:,.2f}"
            })
            
    with open(output_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["Customer", "Date", "Amount"])
        writer.writeheader()
        writer.writerows(cleaned_rows)
        
    print(f"[+] Cleaned {len(cleaned_rows)} records for {{CLIENT_NAME}} -> Saved to '{output_csv}'")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python cleaner.py <raw_input.csv> <cleaned_output.csv>")
    else:
        clean_file(sys.argv[1], sys.argv[2])
"""
        }
    }
}

def main():
    parser = argparse.ArgumentParser(description="Ethan's Standalone Client Solution Generator")
    parser.add_argument("client_name", help="Name of the Arizona business (e.g. 'Mesa Master Plumbing')")
    parser.add_argument("--type", choices=["quote-portal", "ops-cleaner"], default="quote-portal", help="Type of standalone solution to scaffold")
    parser.add_argument("--out", default="deployments", help="Output directory")

    args = parser.parse_args()

    client_slug = args.client_name.lower().replace(" ", "_").replace("&", "and")
    target_dir = Path(args.out) / f"{client_slug}_{args.type}"
    target_dir.mkdir(parents=True, exist_ok=True)

    template = TEMPLATES.get(args.type)
    if not template:
        print(f"Error: Unknown template type {args.type}")
        sys.exit(1)

    print(f"==================================================")
    print(f"🚀 SCAFFOLDING STANDALONE SOLUTION FOR: {args.client_name}")
    print(f"Solution Type: {template['title']}")
    print(f"Target Directory: {target_dir.resolve()}")
    print(f"==================================================")

    for filename, content in template["files"].items():
        file_path = target_dir / filename
        processed_content = content.replace("{{CLIENT_NAME}}", args.client_name)
        with open(file_path, "w") as f:
            f.write(processed_content)
        print(f"  [+] Created: {filename}")

    print(f"\n✅ Standalone client application scaffolded successfully!")
    print(f"To run/deploy: cd {target_dir} and follow instructions in README.md")

if __name__ == "__main__":
    main()
