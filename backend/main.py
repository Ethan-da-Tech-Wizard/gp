"""
Ethan Stack Starter Server - FastAPI + SQLite
On-Call Software Developer for Arizona Businesses
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI(
    title="Ethan Business Platform API",
    description="Backend API starter kit for custom Arizona business automation.",
    version="1.0.0"
)

# Enable CORS for local Vite dev frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "app.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service_type TEXT NOT NULL,
            city TEXT NOT NULL,
            status TEXT DEFAULT 'Inquiry Received',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

@app.on_event("startup")
def startup_event():
    init_db()

class LeadCreate(BaseModel):
    customer_name: str
    phone: str
    service_type: str
    city: str

@app.get("/api/health")
def health_check():
    return {"status": "ok", "business": "Ethan Software LLC", "city": "Mesa, AZ"}

@app.post("/api/leads")
def create_lead(lead: LeadCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO leads (customer_name, phone, service_type, city) VALUES (?, ?, ?, ?)",
        (lead.customer_name, lead.phone, lead.service_type, lead.city)
    )
    conn.commit()
    lead_id = cursor.lastrowid
    conn.close()
    return {"id": lead_id, "message": "Lead captured successfully", "status": "Inquiry Received"}

@app.get("/api/leads")
def get_leads():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM leads ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
