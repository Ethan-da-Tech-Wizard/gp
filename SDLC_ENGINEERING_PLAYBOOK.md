# Master SDLC Engineering Playbook
## Arizona Mobile Software - Complete Software Development Life Cycle (SDLC) Guide

---

### Executive SDLC Mission & Operating Philosophy
As an on-call custom software developer for Arizona small businesses, your primary competitive edge is **speed to deployment**, **extreme reliability**, and **zero technical overhead for the client**.

You do not sell "code"; you sell **elimination of manual labor**. Every solution you deliver must be:
1. **Standalone & Self-Contained**: Works independently on any Linux/Windows server, cloud VM, or local office machine.
2. **Zero Maintenance**: Backed by SQLite single-file databases, standard library runtimes, and automated systemd/docker restart policies.
3. **Outcome-Verified**: Covered by automated test suites before being presented to the client.

---

### Full 6-Phase SDLC Lifecycle

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 1. Discovery    │───>│ 2. Architecture  │───>│ 3. Scaffolding   │
│ On-site audit   │    │ Template pick    │    │ sdlc_engine.py   │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                                               │
         ▼                                               ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 6. Retainer Ops │<───│ 5. Deployment    │<───│ 4. Verification  │
│ Nightly backups │    │ Docker / Systemd │    │ Automated tests  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

---

### Phase 1: On-Site Process Audit & Requirements Gathering
- **Action**: Sit next to the dispatcher, office manager, or technician for 30–60 minutes.
- **Audit Checklist**:
  - Identify repetitive manual data entry (e.g. typing quotes into 3 different systems).
  - Identify phone number formatting issues and lost inbound SMS leads.
  - Document the exact inputs required and expected visual outputs.
- **Rules of Engagement**:
  - Never discuss frameworks, programming languages, or infrastructure costs with the owner.
  - Frame everything around ROI: *"This portal will save 12 hours per week in dispatching errors."*

---

### Phase 2: Solution Architecture & Template Selection
Match the client's business pain to one of the battle-tested micro-app templates in `templates/`:

| Business Need | Recommended Template | Key Deliverables |
|---|---|---|
| Inbound leads, job quotes, dispatch board | `quote-portal` | Glassmorphism intake UI, SQLite backend, Dispatch API, Twilio SMS webhooks |
| Messy customer lists, duplicate rows, phone formatting | `ops-cleaner` | Drag & drop CSV sanitizer, Arizona phone standardizer `(480) 555-0199` |
| Real-time field status tracking | `status-board` | Multi-view split screen dashboard, live job progress board |

---

### Phase 3: Rapid Prototyping & Standalone Scaffolding
Use the unified `bin/sdlc_engine.py` tool to scaffold a dedicated deployment for the client in seconds:

```bash
# Scaffold a new client solution from template
python3 bin/sdlc_engine.py scaffold --client "SunState Plumbing" --template "quote-portal"

# Generated deployment directory structure:
# deployments/client_sunstate_plumbing/
# ├── index.html            # Standalone client frontend
# ├── server.py             # SQLite REST API backend
# ├── test_server.py        # Automated test suite
# ├── Dockerfile            # Container definition
# ├── docker-compose.yml    # Service composition
# └── quote_portal.service  # Systemd production unit
```

---

### Phase 4: Automated Testing & Security Hardening
Before showing any demo or delivering code to production, run the automated test suite:

```bash
python3 bin/sdlc_engine.py test
```

#### Hardening Checklist:
- [x] Input sanitization on all string fields.
- [x] CORS headers correctly set (`Access-Control-Allow-Origin: *`).
- [x] SQLite database connection safety & parameter binding (prevents SQL injection).
- [x] Deprecation-free datetime handling (`datetime.now(timezone.utc)`).

---

### Phase 5: Containerization, Deployment & Systemd Service Configuration
Package the compiled solution into a deployable bundle:

```bash
python3 bin/sdlc_engine.py package --client "SunState Plumbing"
# Output: deployments/client_sunstate_plumbing_release.tar.gz
```

#### Production Server Setup Options:

**Option A: Systemd Service (Linux Bare-Metal / VPS)**
```bash
# 1. Copy service file to systemd directory
sudo cp quote_portal.service /etc/systemd/system/sunstate_quote_portal.service

# 2. Reload daemon and start service
sudo systemctl daemon-reload
sudo systemctl enable --now sunstate_quote_portal.service
sudo systemctl status sunstate_quote_portal.service
```

**Option B: Docker Compose (Isolated Container)**
```bash
docker-compose up -d --build
```

---

### Phase 6: Production Delivery & Retainer Maintenance Operations

1. **Deploy & Verify**: Verify live status via health check: `curl http://127.0.0.1:8080/api/health`.
2. **Setup Automated Nightly Backups**:
   Add to server `crontab -e`:
   ```bash
   0 2 * * * sqlite3 /opt/quote-portal/quote_portal.db ".backup /var/backups/quote_portal_$(date +\%F).db"
   ```
3. **Execute Retainer Contract**:
   - Monthly Retainer ($500 - $1,000/mo): Covers system health monitoring, minor UI updates, database backups, and emergency on-call response.

---

### Command Cheat Sheet

```bash
# Run full SDLC test suite
python3 bin/sdlc_engine.py test

# Verify Vite frontend build
python3 bin/sdlc_engine.py build

# Scaffold client micro-app
python3 bin/sdlc_engine.py scaffold --client "<client_name>" --template "<template_name>"

# Package release tarball
python3 bin/sdlc_engine.py package --client "<client_name>"

# Generate deployment spec
python3 bin/sdlc_engine.py deploy-spec --client "<client_name>"
```
