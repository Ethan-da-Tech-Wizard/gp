#!/usr/bin/env python3
"""
Arizona Customer Data Sanitizer & Phone Standardizer CLI
Formated phone numbers, removes duplicate records, standardizes Arizona area codes.
"""

import sys
import re
import csv
import json
import argparse

AZ_AREA_CODES = {'480', '602', '520', '928'}

def format_phone(phone_str: str) -> dict:
    if not phone_str:
        return {"formatted": "", "valid": False, "reason": "empty"}
    
    digits = re.sub(r'\D', '', phone_str)
    if len(digits) == 11 and digits.startswith('1'):
        digits = digits[1:]
    
    if len(digits) == 10:
        area = digits[:3]
        prefix = digits[3:6]
        line = digits[6:]
        is_az = area in AZ_AREA_CODES
        return {
            "formatted": f"({area}) {prefix}-{line}",
            "valid": True,
            "is_arizona": is_az,
            "area_code": area
        }
    
    return {"formatted": phone_str, "valid": False, "reason": "invalid_length"}

def clean_records(records: list) -> dict:
    cleaned = []
    seen = set()
    dup_count = 0
    fixed_count = 0

    for item in records:
        name = item.get("name", "").strip()
        raw_phone = item.get("phone", "").strip()
        extra = item.get("city", item.get("notes", "")).strip()

        phone_res = format_phone(raw_phone)
        formatted_phone = phone_res["formatted"]
        
        if phone_res["valid"]:
            fixed_count += 1

        dedup_key = (name.lower(), formatted_phone)
        if dedup_key in seen:
            dup_count += 1
            continue
        
        seen.add(dedup_key)
        cleaned.append({
            "name": name,
            "phone": formatted_phone,
            "raw_phone": raw_phone,
            "phone_valid": phone_res["valid"],
            "is_arizona": phone_res.get("is_arizona", False),
            "notes": extra
        })

    return {
        "records": cleaned,
        "total_processed": len(records),
        "duplicates_removed": dup_count,
        "phones_standardized": fixed_count
    }

def main():
    parser = argparse.ArgumentParser(description="Arizona Customer Data Sanitizer")
    parser.add_argument("--input", "-i", help="Input CSV file path")
    parser.add_argument("--output", "-o", help="Output CSV file path")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    args = parser.parse_args()

    if not args.input:
        # Interactive demo mode
        sample = [
            {"name": "John Doe", "phone": "4805550199", "city": "Mesa"},
            {"name": "Jane Smith", "phone": "(602) 555-0144", "city": "Phoenix"},
            {"name": "John Doe", "phone": "480-555-0199", "city": "Mesa AZ"},
            {"name": "Desert Plumbing LLC", "phone": "520.555.0188", "city": "Tucson"}
        ]
        res = clean_records(sample)
        print(json.dumps(res, indent=2))
        return

    records = []
    with open(args.input, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)

    result = clean_records(records)

    if args.json:
        print(json.dumps(result, indent=2))
    elif args.output:
        with open(args.output, "w", encoding="utf-8", newline="") as f:
            fieldnames = ["name", "phone", "raw_phone", "phone_valid", "is_arizona", "notes"]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(result["records"])
        print(f"✨ Cleaned data written to {args.output} ({len(result['records'])} records, {result['duplicates_removed']} duplicates removed)")
    else:
        print(f"Total: {result['total_processed']} | Clean: {len(result['records'])} | Dups Removed: {result['duplicates_removed']}")

if __name__ == "__main__":
    main()
