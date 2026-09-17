#!/usr/bin/env python3
"""
Unit tests for Quote Portal backend server.
Uses Python stdlib unittest so it can run anywhere without external test runners.
"""

import unittest
import os
import json
import sqlite3
import threading
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import time

# Import server module
import server

TEST_DB = "test_quote_portal.db"

class TestQuotePortalServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.port = 8089
        os.environ["QUOTE_PORTAL_DB"] = TEST_DB
        server.DB_FILE = TEST_DB
        if os.path.exists(TEST_DB):
            os.remove(TEST_DB)
        
        server.init_db(TEST_DB)
        cls.server_thread = threading.Thread(target=server.run_server, args=(cls.port,), daemon=True)
        cls.server_thread.start()
        time.sleep(0.5) # Wait for server to bind

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(TEST_DB):
            os.remove(TEST_DB)

    def _request(self, path, method="GET", body=None):
        url = f"http://127.0.0.1:{self.port}{path}"
        data = json.dumps(body).encode("utf-8") if body else None
        req = Request(url, data=data, headers={"Content-Type": "application/json"}, method=method)
        try:
            with urlopen(req) as resp:
                resp_body = resp.read().decode("utf-8")
                return resp.status, json.loads(resp_body)
        except HTTPError as e:
            resp_body = e.read().decode("utf-8")
            return e.code, json.loads(resp_body)

    def test_01_health(self):
        status, data = self._request("/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(data["status"], "healthy")
        self.assertIn("quotes_count", data)

    def test_02_get_quotes(self):
        status, data = self._request("/api/quotes")
        self.assertEqual(status, 200)
        self.assertIn("quotes", data)
        self.assertTrue(len(data["quotes"]) >= 2) # Seed quotes

    def test_03_create_quote(self):
        payload = {
            "client_name": "Gilbert Electrical LLC",
            "phone": "480-555-9988",
            "service_type": "Field Dispatch Board",
            "square_feet": 2400,
            "estimated_cost": 1850.0
        }
        status, data = self._request("/api/quotes", method="POST", body=payload)
        self.assertEqual(status, 201)
        self.assertIn("quote_id", data)
        self.assertEqual(data["status"], "Pending")

    def test_04_update_quote_status(self):
        payload = {"status": "Scheduled"}
        status, data = self._request("/api/quotes/1", method="PATCH", body=payload)
        self.assertEqual(status, 200)
        self.assertIn("updated", data["message"])

    def test_05_dispatch_notes(self):
        note_payload = {
            "dispatcher": "Ethan Tech Wizard",
            "note": "Client scheduled for site audit on Tuesday at 9 AM."
        }
        status, data = self._request("/api/quotes/1/dispatch", method="POST", body=note_payload)
        self.assertEqual(status, 201)
        
        status, data = self._request("/api/quotes/1/dispatch")
        self.assertEqual(status, 200)
        self.assertGreaterEqual(len(data["notes"]), 1)

    def test_06_sms_webhook(self):
        sms_payload = {
            "From": "+14805550122",
            "Body": "Need emergency repair quote for AC automation"
        }
        status, data = self._request("/api/sms-webhook", method="POST", body=sms_payload)
        self.assertEqual(status, 200)
        self.assertEqual(data["status"], "received")

if __name__ == "__main__":
    unittest.main()
