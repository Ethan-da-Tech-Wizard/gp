# 🏛️ Master Operational Execution Handbook
## Building & Scaling Your Mesa, Arizona Custom Software & Automation Business

---

## 🎯 Executive Summary & Core Identity

You are **Ethan**, an **On-Call Custom Software Developer for Arizona Businesses** based in **Mesa, AZ**.

- **What You Sell**: Solved operational headaches, lead capture speed, double-data entry elimination, automated status tracking, custom dashboards, document extraction, and software integration.
- **What You Do NOT Sell**: Generic "AI hype", unvalidated LLM prompts, hourly coding suffering, or $200 static websites.
- **Your Primary Prospecting Question**:
  > *"Show me the most annoying repetitive thing your business still does manually."*

---

## 💰 Financial Roadmap & Cash Governance

```
  +-----------------------+     +-----------------------+     +-----------------------+
  |    MONTH 1 BASELINE   |     |   GROWTH RETAINERS    |     |     SCALE EMPIRE      |
  |       $3,000/mo       | --> |       $9,000/mo       | --> |      $32,000/mo       |
  | 3 x $1,000 Core Builds|     | 6 x $500/mo Retainers |     | 12 x $1,000 Retainers |
  | (Covers $1.5k expenses|     | + 3 x $2,000 Builds   |     | + 5 x $4,000 Builds   |
  +-----------------------+     +-----------------------+     +-----------------------+
```

### Cash Governance Rules:
1. **The 30% Tax Reserve Rule**: Transfer 30% of EVERY gross customer payment into a dedicated tax savings sub-account immediately upon receipt.
2. **Upfront Deposit Requirements**:
   - Micro Fixes ($75–$250): 100% upfront payment.
   - Core Builds ($500–$2,000): **50% deposit required before production work begins**; 50% balance upon final acceptance.
   - Larger Builds ($2,000+): Milestone billing (e.g., 40% deposit, 30% milestone, 30% handoff).
3. **Managed Software Retainers**: Recurring monthly maintenance and automation support ($100–$1,000/mo) billed via autopay in advance on the 1st of each month.

---

## 🛡️ Legal, Regulatory, Tax, & Compliance Matrix

| Area | Rule / Requirement | Action Required |
| :--- | :--- | :--- |
| **Arizona LLC** | Single-member, member-managed LLC | File online via Arizona Corporation Commission ($85 fee). Retain Operating Agreement internally. No annual report required in AZ. |
| **Federal EIN** | Employer Identification Number | Free direct application at IRS.gov immediately post-LLC approval. |
| **Mesa License** | Mesa General Business License | File online ($25 fee). Use 10–30 day processing period to build pipeline and demos. |
| **FinCEN BOI** | Beneficial Ownership Information | **2026 Rule Exemption**: U.S. domestic LLCs are exempt under updated Aug 11, 2026 FinCEN rules. |
| **Mesa TPT Tax** | Transaction Privilege Tax | Confirm TPT licensing with ADOR prior to billing for hosted software, SaaS, or bundled hardware/services. |
| **E&O Insurance** | Technology E&O / Cyber Liability | Obtain broker quotes before taking on client production databases or critical infrastructure. |
| **HIPAA Red Line** | Protected Health Information (PHI) | Strict boundary: Non-PHI administrative tools only for medical clients until formal BAA and security architecture are established. |
| **FTC CAN-SPAM** | Commercial Email Regulations | Physical postal address, non-deceptive subject lines, valid opt-out mechanism (processed within 10 business days). |
| **FCC TCPA** | Outbound Call Regulations | **Zero AI Robocalling**: AI prepares talking points & account research; Ethan makes live human calls. |

---

## 🗓️ Daily Operating Cadence (Night-Owl Optimized)

| Block | Hours | Primary Operational Focus |
| :--- | :--- | :--- |
| **Morning Outbound** | 8:30 AM – 11:30 AM | Live cold calls, discovery calls, and follow-ups with owners/operations managers. |
| **Midday Research** | 11:30 AM – 2:00 PM | Account research, evidence gathering, personalized email drafting (25 accounts/day). |
| **Afternoon Field Visits** | 2:00 PM – 5:00 PM | Scheduled client discovery walks & clustered in-person drop-ins (Mesa/Gilbert Tue, Chandler/Tempe Wed, Phoenix Thu). |
| **Evening Proposals** | 5:00 PM – 7:30 PM | SOW drafting, proposal delivery, CRM timeline updates, and metrics analysis. |
| **Night Production** | 8:30 PM – 2:00 AM | Deep coding, AI-assisted development, ETL pipeline building, and automated testing. |

---

## 🏬 Industry-Specific Pain & Solution Matrix

### 1. HVAC, Plumbing, Electrical, Roofing (Home Services)
- **Visible Fact**: Static PDF quote forms or standard contact forms.
- **Pain Hypothesis**: Double entry between inquiry inbox, scheduling software, and manual customer SMS follow-ups.
- **Ethan Solution**: Branded lead intake portal + instant estimate generator + dispatch board.

### 2. Independent Auto Repair Shops
- **Visible Fact**: Phone calls for estimate approvals; no customer status portal.
- **Pain Hypothesis**: Service advisors repeating vehicle status over 30+ phone calls a day.
- **Ethan Solution**: Live customer repair status board + automated SMS inspection reports.

### 3. Machine Shops & Manufacturing
- **Visible Fact**: Paper traveler cards attached to shop floor job bins.
- **Pain Hypothesis**: End-of-shift manual re-entry of job status into Excel spreadsheets.
- **Ethan Solution**: Digital work-order status board + shop floor production tracker.

### 4. Property Management Companies
- **Visible Fact**: Maintenance requests sent to a central email inbox.
- **Pain Hypothesis**: Double entry between inbox, tracking spreadsheets, and vendor work-order dispatches.
- **Ethan Solution**: Tenant maintenance triage portal + automated vendor routing.

### 5. Local Logistics & Warehouses
- **Visible Fact**: Proof of Delivery (POD) receipts scanned into PDF folders daily.
- **Pain Hypothesis**: Staff manually typing tracking numbers and signatures into accounting software.
- **Ethan Solution**: Document extraction assistant + automated accounting database sync.

---

## 🤖 Technical Architecture & AI Routing Strategy

```
                          +-------------------------------+
                          |    INCOMING WORKLOAD REQUEST  |
                          +-------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
+-------------------+           +-------------------+           +-------------------+
|  PUBLIC RESEARCH  |           |  PRIVATE CLIENT   |           |  HIGH-COMPLEXITY  |
|   Gemini CLI      |           |  Local Ollama GPU |           |   Paid API Token  |
|  (Free / Apache)  |           |  (RTX 3070 VRAM)  |           |  (Billed to SOW)  |
+-------------------+           +-------------------+           +-------------------+
```

### Deterministic Software Wrapper for Probabilistic AI:
```
Raw Input (PDF / Email / CSV)
       ↓
Extractor / Parser
       ↓
Schema Validation Rule (Date / Phone / Required Fields)
       ↓
Business Math Reconciliation (Tax / Line Item Totals)
       ↓
Confidence Scoring & Exception Detection
       ↓
Human Exception Review Drawer (if < 90% confidence)
       ↓
Validated Production Database Update
```

---

## 🛠️ CLI Solution Generator Guide

To spin up a standalone client application micro-repo in seconds:

```bash
# 1. Standalone Customer Quote & Intake Micro-App:
python3 bin/create_client_solution.py "Mesa Air Masters HVAC" --type quote-portal

# 2. Standalone CSV Data Normalizer & Cleaner Script:
python3 bin/create_client_solution.py "Apex Auto Care Chandler" --type ops-cleaner
```

Each generated project is isolated under `deployments/`, ready to deploy independently to Vercel/Netlify, run on a client's local PC, or host on a simple VPS.

---

## 📜 1-Page SOW Governance & Closing Script

### 1-Page SOW Template Structure:
1. **Problem Being Fixed**: Exact observed manual bottleneck.
2. **Exact Deliverables**: Numbered list of specific features produced.
3. **Explicitly Out of Scope**: Explicit list of excluded features to prevent scope creep.
4. **Price & Deposit**: Fixed price + 50% deposit required before production.
5. **Acceptance Criteria**: Objective criteria for project completion.
6. **Support & Ownership**: 30 days included support + IP ownership terms.

### Owner Discovery Closing Script:
> *"Solving this manual bottleneck is costing your business ~$[Total Monthly Pain] every single month in wasted labor and delays. I can build a dedicated automated pipeline to eliminate this headache for a fixed cost of $[Quote Price] (with 50% deposit to start and the rest upon delivery). Should I draft the 1-page SOW?"*
