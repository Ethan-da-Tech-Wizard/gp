"""
Reusable ETL Data Normalization Engine
Fixes unformatted dates (e.g. 01012024 -> 01/01/2024), phone strings, and dirty CSV text.
"""

import re

def normalize_date(raw_date: str) -> str:
    """
    Normalizes unformatted dates like '01012024' into '01/01/2024'.
    """
    digits = re.sub(r'\D', '', str(raw_date))
    if len(digits) == 8:
        month, day, year = digits[:2], digits[2:4], digits[4:]
        return f"{month}/{day}/{year}"
    return str(raw_date).strip()

def normalize_phone(raw_phone: str) -> str:
    """
    Formats raw phone digits into (XXX) XXX-XXXX format.
    """
    digits = re.sub(r'\D', '', str(raw_phone))
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return str(raw_phone).strip()

def normalize_currency(raw_val: str) -> float:
    """
    Parses messy financial strings like '$ 1,450.00 ' into 1450.0.
    """
    cleaned = re.sub(r'[^0-9.]', '', str(raw_val))
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

if __name__ == "__main__":
    # Self-test execution
    print("Testing Date Cleaner '01012024' ->", normalize_date("01012024"))
    print("Testing Phone Cleaner '4805550192' ->", normalize_phone("4805550192"))
    print("Testing Currency Cleaner '$ 1,450.00 ' ->", normalize_currency("$ 1,450.00 "))
