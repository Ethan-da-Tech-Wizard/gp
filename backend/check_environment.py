"""
Ethan Environment Diagnostic Tool
Verifies system specifications, GPU availability (nvidia-smi check), SQLite, and Ollama local server status.
"""

import subprocess
import sys
import sqlite3
import urllib.request

def check_gpu():
    print("[1] Checking GPU status (nvidia-smi)...")
    try:
        out = subprocess.check_output(["nvidia-smi"], stderr=subprocess.STDOUT).decode("utf-8")
        print("    ✅ NVIDIA GPU Detected:")
        for line in out.split("\n")[:8]:
            print(f"       {line}")
    except Exception as e:
        print("    ⚠️ GPU check note (nvidia-smi not in path or CPU mode):", str(e))

def check_sqlite():
    print("\n[2] Checking SQLite version...")
    print(f"    ✅ SQLite Version: {sqlite3.sqlite_version}")

def check_ollama():
    print("\n[3] Checking Local Ollama Server (http://localhost:11434)...")
    try:
        req = urllib.request.urlopen("http://localhost:11434/api/tags", timeout=2)
        if req.status == 200:
            print("    ✅ Local Ollama server is ONLINE and responding!")
    except Exception:
        print("    ⚠️ Local Ollama server is offline (Start with `ollama serve` when using local LLMs).")

if __name__ == "__main__":
    print("=== ETHAN SOFTWARE BUSINESS ENVIRONMENT DIAGNOSTIC ===")
    print(f"Python Version: {sys.version.split()[0]}")
    check_gpu()
    check_sqlite()
    check_ollama()
    print("\n=== DIAGNOSTIC COMPLETE ===")
