import csv
import re
import sys

def clean_file(input_csv, output_csv):
    print(f"[*] Processing raw file '{input_csv}' for Apex Auto Care Chandler...")
    cleaned_rows = []
    
    with open(input_csv, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 1. Clean Customer Name
            cust = row.get('customer', '').strip().title()
            
            # 2. Clean Date (01012024 -> 01/01/2024)
            date_raw = row.get('date', '').strip()
            date_digits = re.sub(r'\D', '', date_raw)
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
        
    print(f"[+] Cleaned {len(cleaned_rows)} records for Apex Auto Care Chandler -> Saved to '{output_csv}'")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python cleaner.py <raw_input.csv> <cleaned_output.csv>")
    else:
        clean_file(sys.argv[1], sys.argv[2])
