#!/usr/bin/env python3
"""
Quote Portal REST Backend & Dispatch Database Server
Zero-dependency Python stdlib HTTP server + SQLite implementation.
Can run stand-alone or be deployed inside Docker / Systemd service.
"""

import sys
import os
import json
import sqlite3
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from datetime import datetime, timezone

DB_FILE = os.environ.get("QUOTE_PORTAL_DB", "quote_portal.db")

def init_db(db_path=DB_FILE):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_type TEXT NOT NULL,
        square_feet INTEGER DEFAULT 0,
        estimated_cost REAL DEFAULT 0.0,
        status TEXT DEFAULT 'Pending',
        created_at TEXT NOT NULL
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dispatch_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_id INTEGER NOT NULL,
        dispatcher TEXT NOT NULL,
        note TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (quote_id) REFERENCES quotes (id)
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sms_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT NOT NULL,
        direction TEXT NOT NULL,
        message_body TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    """)
    
    # Insert sample seed quote if empty
    cursor.execute("SELECT COUNT(*) FROM quotes")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO quotes (client_name, phone, service_type, square_feet, estimated_cost, status, created_at)
        VALUES ('Mesa HVAC Corp', '480-555-0199', 'Commercial HVAC Automation', 4500, 3250.00, 'Approved', ?)
        """, (datetime.now(timezone.utc).isoformat(),))
        cursor.execute("""
        INSERT INTO quotes (client_name, phone, service_type, square_feet, estimated_cost, status, created_at)
        VALUES ('Valley Plumbing Co', '602-555-0144', 'Field Dispatch Portal', 1800, 1450.00, 'Pending', ?)
        """, (datetime.now(timezone.utc).isoformat(),))
        conn.commit()
        
    conn.close()

class QuotePortalHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path == "/api/health":
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM quotes")
            count = cursor.fetchone()[0]
            conn.close()
            self._send_json({"status": "healthy", "service": "Quote Portal Backend", "quotes_count": count})
            return

        if path == "/api/quotes":
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM quotes ORDER BY id DESC")
            rows = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self._send_json({"quotes": rows})
            return

        if path.startswith("/api/quotes/") and path.endswith("/dispatch"):
            try:
                quote_id = int(path.split("/")[3])
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM dispatch_notes WHERE quote_id = ? ORDER BY id ASC", (quote_id,))
                notes = [dict(r) for r in cursor.fetchall()]
                conn.close()
                self._send_json({"quote_id": quote_id, "notes": notes})
            except ValueError:
                self._send_json({"error": "Invalid quote ID"}, 400)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        content_length = int(self.headers.get('Content-Length', 0))
        body_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        try:
            payload = json.loads(body_data) if body_data else {}
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON body"}, 400)
            return

        if path == "/api/quotes":
            client_name = payload.get("client_name", "").strip()
            phone = payload.get("phone", "").strip()
            service_type = payload.get("service_type", "General Custom Software").strip()
            sqft = int(payload.get("square_feet", 0))
            cost = float(payload.get("estimated_cost", 0.0))
            
            if not client_name or not phone:
                self._send_json({"error": "client_name and phone are required"}, 400)
                return

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            created_at = datetime.now(timezone.utc).isoformat()
            cursor.execute("""
            INSERT INTO quotes (client_name, phone, service_type, square_feet, estimated_cost, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'Pending', ?)
            """, (client_name, phone, service_type, sqft, cost, created_at))
            quote_id = cursor.lastrowid
            conn.commit()
            conn.close()

            self._send_json({
                "message": "Quote request created successfully",
                "quote_id": quote_id,
                "status": "Pending"
            }, 201)
            return

        if path.startswith("/api/quotes/") and path.endswith("/dispatch"):
            try:
                quote_id = int(path.split("/")[3])
                dispatcher = payload.get("dispatcher", "Dispatcher").strip()
                note = payload.get("note", "").strip()
                if not note:
                    self._send_json({"error": "Note text is required"}, 400)
                    return
                
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                ts = datetime.now(timezone.utc).isoformat()
                cursor.execute("""
                INSERT INTO dispatch_notes (quote_id, dispatcher, note, timestamp)
                VALUES (?, ?, ?, ?)
                """, (quote_id, dispatcher, note, ts))
                conn.commit()
                conn.close()
                self._send_json({"message": "Dispatch note added", "quote_id": quote_id}, 201)
            except ValueError:
                self._send_json({"error": "Invalid quote ID"}, 400)
            return

        if path == "/api/sms-webhook":
            from_phone = payload.get("From", payload.get("from_phone", "Unknown"))
            body = payload.get("Body", payload.get("body", ""))
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            ts = datetime.now(timezone.utc).isoformat()
            cursor.execute("""
            INSERT INTO sms_logs (phone_number, direction, message_body, timestamp)
            VALUES (?, 'INBOUND', ?, ?)
            """, (from_phone, body, ts))
            conn.commit()
            conn.close()
            
            self._send_json({
                "status": "received",
                "phone": from_phone,
                "auto_reply": f"Thanks for contacting Arizona Mobile Dev! We received your message: '{body[:30]}...'"
            })
            return

        self._send_json({"error": "Endpoint not found"}, 404)

    def do_PATCH(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path.startswith("/api/quotes/"):
            try:
                quote_id = int(path.split("/")[3])
                content_length = int(self.headers.get('Content-Length', 0))
                body_data = self.rfile.read(content_length).decode('utf-8')
                payload = json.loads(body_data)
                
                new_status = payload.get("status")
                if not new_status:
                    self._send_json({"error": "Status is required"}, 400)
                    return

                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute("UPDATE quotes SET status = ? WHERE id = ?", (new_status, quote_id))
                conn.commit()
                conn.close()
                
                self._send_json({"message": f"Quote {quote_id} status updated to {new_status}"})
            except (ValueError, IndexError):
                self._send_json({"error": "Invalid URL or quote ID"}, 400)
            return

        self._send_json({"error": "Endpoint not found"}, 404)

def run_server(port=8080):
    init_db()
    server_address = ('', port)
    httpd = HTTPServer(server_address, QuotePortalHandler)
    print(f"🚀 Quote Portal Backend running on http://0.0.0.0:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    run_server(port)
