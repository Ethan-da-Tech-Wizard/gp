#!/usr/bin/env python3
"""
Unit test suite for Arizona Data Cleaner module.
"""

import unittest
from cleaner import format_phone, clean_records

class TestDataCleaner(unittest.TestCase):
    def test_phone_formatting(self):
        res1 = format_phone("4805550199")
        self.assertTrue(res1["valid"])
        self.assertEqual(res1["formatted"], "(480) 555-0199")
        self.assertTrue(res1["is_arizona"])

        res2 = format_phone("1-602-555-0144")
        self.assertTrue(res2["valid"])
        self.assertEqual(res2["formatted"], "(602) 555-0144")
        self.assertTrue(res2["is_arizona"])

        res3 = format_phone("520.555.0188")
        self.assertTrue(res3["valid"])
        self.assertEqual(res3["formatted"], "(520) 555-0188")

        res4 = format_phone("invalid_phone")
        self.assertFalse(res4["valid"])

    def test_deduplication(self):
        raw_data = [
            {"name": "John Doe", "phone": "480-555-0199", "city": "Mesa"},
            {"name": "John Doe", "phone": "(480) 555-0199", "city": "Mesa AZ"},
            {"name": "Jane Smith", "phone": "6025550144", "city": "Phoenix"}
        ]
        res = clean_records(raw_data)
        self.assertEqual(res["total_processed"], 3)
        self.assertEqual(len(res["records"]), 2)
        self.assertEqual(res["duplicates_removed"], 1)

if __name__ == "__main__":
    unittest.main()
