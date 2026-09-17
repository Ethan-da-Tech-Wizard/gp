# WEAPONIZATION MASTER OPERATING HANDBOOK
## Ethan • On-Call Software Developer for Arizona Businesses (Mesa, AZ)

---

## 📍 1. PUBLIC POSITIONING & CORE VALUE PROPOSITION

### Positioning Statements
- **Primary**: "On-Call Software Developer for Arizona Businesses"
- **Tagline**: "I fix the repetitive stuff your software should already be doing."
- **Alternative**: "Local Software & Automation for Arizona Businesses. If your staff repeatedly copies, clicks, types, searches, reconciles, uploads, downloads, or waits for information, let me look at it."

### The Golden Question
> **"Show me the most annoying repetitive thing your business still does manually."**

### What Business Owners Actually Buy
- Quotes going out faster
- Leads getting followed up automatically
- Fewer duplicate entries between systems
- Reports that generate themselves
- Jobs not falling through the cracks
- Documents turning into usable structured data
- Systems talking to one another
- Software that fits their workflow instead of fighting it

---

## 🏛️ 2. LEGAL, LICENSING & COMPLIANCE INFRASTRUCTURE

| Step | Action Item | Filing Portal / Cost | Legal Guidance & Notes |
| :--- | :--- | :--- | :--- |
| **1** | File Single-Member Arizona LLC | [azcc.gov](https://azcc.gov) ($85 online) | Arizona single-member LLCs do not file annual reports. File member-managed. |
| **2** | Obtain IRS EIN | [irs.gov](https://www.irs.gov) (Free) | Apply online in minutes immediately after LLC entity approval. |
| **3** | Apply for Mesa Business License | City of Mesa ($25 fee) | Required for service/home-based businesses operating in Mesa (takes 10-30 days). |
| **4** | Mesa TPT Tax Check | ADOR / Mesa Licensing | Confirm Transaction Privilege Tax requirements if bundling hosted services or SaaS. |
| **5** | 2026 FinCEN BOI Exemption | FinCEN ($0 Exempt) | FinCEN current rules state U.S.-created domestic LLCs are exempt from BOI reporting. |
| **6** | Business Checking Account | Local Bank ($0) | Requires Articles of Organization, EIN, and Mesa License. Separate business money Day 1. |
| **7** | Tech E&O Insurance Quotes | Insurance Broker | Technology Errors & Omissions + Cyber coverage before managing client infrastructure. |
| **8** | 30% Tax Savings Bucket | Bank Sub-account | Transfer 30% of every customer payment into a separate tax bucket immediately. |
| **9** | Healthcare / HIPAA Red Line | Boundary Policy | For medical clients, begin with non-PHI administrative tools only (BAA required for PHI). |

---

## 📞 3. OUTBOUND SALES ENGINE & SCRIPTS

### Daily Cadence
- **Target**: 25 researched accounts per day (125/week, 500/month).
- **Geographic Corridor**: Mesa → Gilbert → Chandler → Tempe → Phoenix.
- **Vertical Breakdown**: 30% Home Services (HVAC/Plumbing/Roofing), 15% Auto Repair, 15% Manufacturing, 15% Property Management, 10% Logistics, 10% Professional Services.

### Script #1: CAN-SPAM Compliant Cold Email
```text
Subject: Quick software idea for [Company Name]

Hi [Decision Maker Name],

I'm Ethan, a local software developer based in Mesa.

I work on the annoying operational stuff that falls between normal software products—repetitive data entry, spreadsheets, quoting, reports, follow-up, integrations, dashboards and small internal tools.

I noticed [specific observable fact e.g. website quote request downloads a PDF form].

I don't know whether it's actually a problem on your end, but it made me wonder whether [pain hypothesis e.g. service requests are re-entered manually into dispatch software] is still being handled manually.

I'm not trying to sell you a giant software package. I'd rather understand the workflow first. If there's something worth fixing, you can tell me what solving it is worth to the business, and I'll tell you whether I can responsibly make that work.

Worth a fifteen-minute conversation?

Ethan
On-Call Software Developer
Mesa, AZ | (480) 555-0100
ethan@ethanazsoftware.com

P.S. If you'd rather I don't email again, just say so and I won't.
```

### Script #2: Cold Phone Call Opener
> **"Hey [Name], Ethan here. I'm a software developer in Mesa. This isn't a website or marketing pitch. I work with businesses on annoying manual processes—things like duplicate data entry, reports, quotes, spreadsheets, follow-up and software that doesn't talk to other software. I noticed [specific observation] at your company, and I wanted to ask you something: what's one computer process around there that your people absolutely hate doing?"**
> *(Then STOP and listen!)*

### Script #3: In-Person Walk-In Opener
> **"Hey, is whoever handles operations or owns the place around? I'm Ethan. I'm a local software developer. I fix repetitive computer and process problems for businesses. I'm not selling a specific package—I basically want to know what software around here makes everybody swear at it."**

---

## 💰 4. DISCOVERY & PRICING METHODOLOGY

### The 5-Step Owner Discovery Model
1. **Understand**: *"Show me exactly what happens from start to finish."*
2. **Quantify**: *"How often does this happen? Who touches it? How much time does it take?"*
3. **Value**: *"Suppose it just worked tomorrow. What would solving that be worth to the business?"*
4. **Budget**: *"Is that roughly what you're willing to put into solving it?"*
5. **Scope**: Match scope to budget:
   - *"Yes, I can build the useful version inside that."*
   - *"At that number, I can solve Part A, but not Part B."*
   - *"I can't responsibly take it on at that amount."*

### Price Bands & Deposit Rules
- **Micro Fix**: $75 – $250 (100% upfront payment)
- **Diagnostic / Spec**: $100 – $400 (Delivers written architecture/spec)
- **Small Automation**: $250 – $750 (50% deposit, balance on delivery)
- **Core Small Business Build**: $500 – $2,000 (50% deposit, milestone acceptance)
- **Managed Care Retainer**: $100 – $750+/month (Paid monthly in advance)

---

## 🖥️ 5. CODEBASE ARCHITECTURE & EXECUTABLE UTILITIES

### System Overview (`/home/ethan/gp`)
```bash
/home/ethan/gp/
├── src/
│   ├── App.tsx                          # Primary View Switcher + 60s Video Script Guide
│   ├── index.css                        # Glassmorphism Design System
│   ├── main.tsx                         # React 18 root
│   └── components/
│       ├── crm/ProspectingCRM.tsx       # Mesa Prospect Pipeline & Target Generator
│       ├── demos/
│       │   ├── HomeServiceQuoteDemo.tsx # Demo #1: HVAC Lead Intake & Dispatch Board
│       │   ├── OpsDashboardDemo.tsx     # Demo #2: Messy Data Cleaner ('01012024' -> '01/01/2024')
│       │   └── DocumentExtractionDemo.tsx # Demo #3: Invoice OCR & Exception Review
│       └── legal/SOWGenerator.tsx       # Launch Checklist + 1-Page SOW Generator & Exporter
├── backend/
│   ├── main.py                          # FastAPI starter server + SQLite
│   ├── ai_router.py                     # Dual-routing AI handler (Ollama + Gemini CLI)
│   ├── data_cleaner.py                  # Reusable ETL normalization engine
│   ├── prospect_researcher.py          # CLI dossier generator
│   └── check_environment.py             # Diagnostic tool (GPU, SQLite, Python status)
```

### Essential Commands
```bash
# Launch interactive web application
npm run dev

# Run frontend production build test
npm run build

# Run system diagnostic
python3 backend/check_environment.py

# Generate AI dossier via CLI
python3 backend/prospect_researcher.py "Mesa Air Masters" "Mesa" "HVAC/Home Services"
```
