import React, { useState } from 'react';
import { Target, Search, Mail, Phone, Building2, TrendingUp, DollarSign, AlertCircle, CheckCircle2, ShieldCheck, FileText, ChevronRight, Calculator } from 'lucide-react';
import { SplitMode } from '../../App';

interface ProspectingCRMProps {
  splitMode?: SplitMode;
}

export interface Prospect {
  id: string;
  name: string;
  city: 'Mesa' | 'Gilbert' | 'Chandler' | 'Tempe' | 'Phoenix';
  vertical: 'HVAC/Home Services' | 'Auto Repair' | 'Manufacturing' | 'Property Management' | 'Logistics' | 'Professional Services';
  decisionMaker: string;
  role: string;
  contactEmail: string;
  contactPhone: string;
  observation: string;
  painHypothesis: string;
  evidenceType: 'Observed Fact' | 'Hypothesis';
  riskLevel: 'Low' | 'Medium (Sensitive Data)' | 'High (HIPAA/Regulated)';
  status: 'New' | 'Researched' | 'Email Sent' | 'Called' | 'Discovery Scheduled' | 'Proposal Sent' | 'Closed Won';
  opportunityBand: 'Micro ($75-$250)' | 'Small ($250-$750)' | 'Core ($500-$2k)' | 'Managed ($100-$750/mo)';
}

const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: 'p1',
    name: 'Desert Sun HVAC & Mechanical',
    city: 'Mesa',
    vertical: 'HVAC/Home Services',
    decisionMaker: 'Dave Miller',
    role: 'Owner & General Manager',
    contactEmail: 'dave@desertsunhvac.com',
    contactPhone: '(480) 555-0192',
    observation: 'Website quote request downloads a static PDF form that customers email or fax in.',
    painHypothesis: 'Dispatcher manually transcribes customer inquiries into dispatch software and sends SMS updates by hand.',
    evidenceType: 'Observed Fact',
    riskLevel: 'Low',
    status: 'Researched',
    opportunityBand: 'Core ($500-$2k)'
  },
  {
    id: 'p2',
    name: 'Mesa Precision Machine & Tooling',
    city: 'Mesa',
    vertical: 'Manufacturing',
    decisionMaker: 'Karen Vance',
    role: 'Operations Director',
    contactEmail: 'kvance@mesaprecisiontooling.com',
    contactPhone: '(480) 555-0481',
    observation: 'Work orders are printed onto paper cards attached to shop floor bins.',
    painHypothesis: 'End-of-day job status requires manual entry from physical shop traveler tags into Excel spreadsheets.',
    evidenceType: 'Observed Fact',
    riskLevel: 'Low',
    status: 'New',
    opportunityBand: 'Core ($500-$2k)'
  },
  {
    id: 'p3',
    name: 'Apex Auto Care & Collision',
    city: 'Chandler',
    vertical: 'Auto Repair',
    decisionMaker: 'Marco Reyes',
    role: 'Shop Owner',
    contactEmail: 'marco@apexautochandler.com',
    contactPhone: '(480) 555-0811',
    observation: 'Customers drop off vehicles and receive phone calls for approval; no status portal.',
    painHypothesis: 'Service advisors repeat vehicle status, part delivery status, and estimate updates over 30+ phone calls a day.',
    evidenceType: 'Hypothesis',
    riskLevel: 'Low',
    status: 'Email Sent',
    opportunityBand: 'Small ($250-$750)'
  },
  {
    id: 'p4',
    name: 'East Valley Property Management',
    city: 'Gilbert',
    vertical: 'Property Management',
    decisionMaker: 'Sarah Jenkins',
    role: 'Maintenance Coordinator',
    contactEmail: 'sjenkins@eastvalleypm.com',
    contactPhone: '(480) 555-0322',
    observation: 'Tenant maintenance requests go to a central inbox with Google Sheet logging.',
    painHypothesis: 'Double entry between email inbox, Google Sheet tracking log, and vendor work-order dispatches.',
    evidenceType: 'Observed Fact',
    riskLevel: 'Low',
    status: 'Discovery Scheduled',
    opportunityBand: 'Managed ($100-$750/mo)'
  },
  {
    id: 'p5',
    name: 'Copper State Freight & Storage',
    city: 'Tempe',
    vertical: 'Logistics',
    decisionMaker: 'Tom Bradley',
    role: 'Fleet Ops Manager',
    contactEmail: 'tbradley@copperstatefreight.com',
    contactPhone: '(480) 555-0944',
    observation: 'Proof of Delivery (POD) documents are scanned into PDF folders daily.',
    painHypothesis: 'Staff manually types tracking numbers, delivery dates, and signatures into accounting software.',
    evidenceType: 'Observed Fact',
    riskLevel: 'Low',
    status: 'New',
    opportunityBand: 'Core ($500-$2k)'
  }
];

export const ProspectingCRM: React.FC<ProspectingCRMProps> = ({ splitMode = 'auto' }) => {
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [selectedProspect, setSelectedProspect] = useState<Prospect>(INITIAL_PROSPECTS[0]);
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [verticalFilter, setVerticalFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Layout split classes
  const containerClass = `split-container-${splitMode}`;
  const leftClass = `split-left-${splitMode} glass-panel space-y-4`;
  const rightClass = `split-right-${splitMode} space-y-6`;

  // New Prospect Form State
  const [newCompany, setNewCompany] = useState('');
  const [newCity, setNewCity] = useState<Prospect['city']>('Mesa');
  const [newVertical, setNewVertical] = useState<Prospect['vertical']>('HVAC/Home Services');
  const [newDecisionMaker, setNewDecisionMaker] = useState('');
  const [newRole, setNewRole] = useState('Owner / Operations Manager');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newObservation, setNewObservation] = useState('');
  const [newPainHypothesis, setNewPainHypothesis] = useState('');

  // Value quantification calculator state
  const [hoursWastedPerWeek, setHoursWastedPerWeek] = useState<number>(10);
  const [hourlyStaffRate, setHourlyStaffRate] = useState<number>(25);
  const [errorCostPerMonth, setErrorCostPerMonth] = useState<number>(300);

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newDecisionMaker) return;

    const created: Prospect = {
      id: `p-${Date.now()}`,
      name: newCompany,
      city: newCity,
      vertical: newVertical,
      decisionMaker: newDecisionMaker,
      role: newRole,
      contactEmail: newEmail || `${newDecisionMaker.toLowerCase().replace(/\s+/g, '.')}@${newCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contactPhone: newPhone || '(480) 555-0100',
      observation: newObservation || 'Observed manual PDF or spreadsheet intake workflow on website.',
      painHypothesis: newPainHypothesis || 'Possible double entry between customer requests and scheduling/accounting software.',
      evidenceType: 'Observed Fact',
      riskLevel: 'Low',
      status: 'Researched',
      opportunityBand: 'Core ($500-$2k)'
    };

    setProspects([created, ...prospects]);
    setSelectedProspect(created);
    setShowAddModal(false);
    setNewCompany('');
    setNewDecisionMaker('');
    setNewObservation('');
    setNewPainHypothesis('');
  };

  const filteredProspects = prospects.filter(p => {
    const matchesCity = cityFilter === 'All' || p.city === cityFilter;
    const matchesVertical = verticalFilter === 'All' || p.vertical === verticalFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.decisionMaker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesVertical && matchesSearch;
  });

  const updateStatus = (id: string, newStatus: Prospect['status']) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (selectedProspect.id === id) {
      setSelectedProspect(prev => ({ ...prev, status: newStatus }));
    }
  };

  // ROI calculations
  const monthlyLaborCostWasted = hoursWastedPerWeek * hourlyStaffRate * 4.33;
  const totalMonthlyPain = monthlyLaborCostWasted + errorCostPerMonth;
  const annualPain = totalMonthlyPain * 12;
  const recommendedFixQuote = Math.min(Math.max(Math.round(totalMonthlyPain * 0.8 / 50) * 50, 300), 2500);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header & Funnel Tracker */}
      <div className="grid-3">
        <div className="glass-panel border-l-4 border-l-cyan-400">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Target Objective</span>
            <span className="badge badge-cyan">Month 1</span>
          </div>
          <div className="text-2xl font-bold text-main mb-1">$3,000 / mo</div>
          <p className="text-xs text-muted">3 × $1,000 builds or 6 × $500 automation projects to cover $1.5k life expenses.</p>
        </div>

        <div className="glass-panel border-l-4 border-l-amber-400">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Daily Outbound Cadence</span>
            <span className="badge badge-amber">25 / Day</span>
          </div>
          <div className="text-2xl font-bold text-main mb-1">125 / week</div>
          <p className="text-xs text-muted">Research Mesa → Gilbert → Chandler → Tempe → Phoenix corridor. High research, zero spam.</p>
        </div>

        <div className="glass-panel border-l-4 border-l-emerald-400">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Scale Roadmap</span>
            <span className="badge badge-emerald">Recurring Engine</span>
          </div>
          <div className="text-2xl font-bold text-main mb-1">$9k → $32k / mo</div>
          <p className="text-xs text-muted">Transition micro fixes into $500/mo Managed Software & Automation retainers.</p>
        </div>
      </div>

      {/* Main CRM Grid */}
      <div className={containerClass}>
        
        {/* Left Column: Prospect List */}
        <div className={leftClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-main flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Mesa Prospect Pipeline
            </h2>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary py-1 px-2.5 text-xs">
              + Research AZ Account
            </button>
          </div>

          {/* Modal for adding custom prospect */}
          {showAddModal && (
            <div className="p-4 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-3 animate-fade-in shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-bold text-xs text-main">Add Researched Arizona Target Account</span>
                <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleAddProspect} className="space-y-2 text-xs">
                <div className="grid-2">
                  <div>
                    <label className="text-muted block mb-0.5">Company Name</label>
                    <input type="text" required placeholder="e.g. Mesa Air Masters" className="input-field py-1 text-xs" value={newCompany} onChange={e => setNewCompany(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-muted block mb-0.5">Decision Maker Name</label>
                    <input type="text" required placeholder="e.g. John Miller" className="input-field py-1 text-xs" value={newDecisionMaker} onChange={e => setNewDecisionMaker(e.target.value)} />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="text-muted block mb-0.5">City</label>
                    <select className="select-field py-1 text-xs" value={newCity} onChange={e => setNewCity(e.target.value as Prospect['city'])}>
                      <option value="Mesa">Mesa</option>
                      <option value="Gilbert">Gilbert</option>
                      <option value="Chandler">Chandler</option>
                      <option value="Tempe">Tempe</option>
                      <option value="Phoenix">Phoenix</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-muted block mb-0.5">Vertical</label>
                    <select className="select-field py-1 text-xs" value={newVertical} onChange={e => setNewVertical(e.target.value as Prospect['vertical'])}>
                      <option value="HVAC/Home Services">HVAC / Home Services</option>
                      <option value="Auto Repair">Auto Repair</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Property Management">Property Management</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-muted block mb-0.5">Specific Observable Fact</label>
                  <input type="text" placeholder="e.g. Website quote request downloads PDF form" className="input-field py-1 text-xs" value={newObservation} onChange={e => setNewObservation(e.target.value)} />
                </div>

                <div>
                  <label className="text-muted block mb-0.5">Pain Hypothesis</label>
                  <input type="text" placeholder="e.g. Staff manually re-enters quote data into dispatch system" className="input-field py-1 text-xs" value={newPainHypothesis} onChange={e => setNewPainHypothesis(e.target.value)} />
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="submit" className="btn btn-primary py-1 px-3 text-xs flex-1">Save Target & Generate Dossier</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary py-1 px-3 text-xs">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Search & Filter Controls */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search business or owner name..." 
                className="input-field pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                className="select-field text-xs" 
                value={cityFilter} 
                onChange={e => setCityFilter(e.target.value)}
              >
                <option value="All">All Cities</option>
                <option value="Mesa">Mesa</option>
                <option value="Gilbert">Gilbert</option>
                <option value="Chandler">Chandler</option>
                <option value="Tempe">Tempe</option>
                <option value="Phoenix">Phoenix</option>
              </select>

              <select 
                className="select-field text-xs" 
                value={verticalFilter} 
                onChange={e => setVerticalFilter(e.target.value)}
              >
                <option value="All">All Industry Verticals</option>
                <option value="HVAC/Home Services">HVAC / Home Services</option>
                <option value="Auto Repair">Auto Repair</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Property Management">Property Management</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>
          </div>

          {/* Prospects Cards List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredProspects.map(prospect => (
              <div
                key={prospect.id}
                onClick={() => setSelectedProspect(prospect)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedProspect.id === prospect.id 
                    ? 'bg-slate-800/90 border-cyan-400/50 shadow-md' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-main">{prospect.name}</span>
                  <span className="badge badge-cyan text-[10px]">{prospect.city}</span>
                </div>
                <div className="text-xs text-muted mb-2">{prospect.vertical} • {prospect.decisionMaker}</div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    prospect.status === 'Closed Won' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    prospect.status === 'Discovery Scheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {prospect.status}
                  </span>
                  <span className="text-slate-400 font-mono">{prospect.opportunityBand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Account Dossier & Outbound Script Engine */}
        <div className={rightClass}>
          
          {/* Dossier Card */}
          <div className="glass-panel space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-xl font-bold text-main flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  {selectedProspect.name}
                </h3>
                <p className="text-xs text-muted">
                  {selectedProspect.city}, AZ • {selectedProspect.vertical} • Contact: <strong className="text-slate-200">{selectedProspect.decisionMaker}</strong> ({selectedProspect.role})
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Pipeline State:</span>
                <select 
                  className="select-field text-xs py-1"
                  value={selectedProspect.status}
                  onChange={e => updateStatus(selectedProspect.id, e.target.value as Prospect['status'])}
                >
                  <option value="New">New</option>
                  <option value="Researched">Researched</option>
                  <option value="Email Sent">Email Sent</option>
                  <option value="Called">Called</option>
                  <option value="Discovery Scheduled">Discovery Scheduled</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed Won">Closed Won</option>
                </select>
              </div>
            </div>

            {/* Evidence vs Hypothesis Breakdown */}
            <div className="grid-2">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Specific Observable Fact
                </div>
                <p className="text-xs text-slate-300 italic">"{selectedProspect.observation}"</p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  Pain Hypothesis (Unverified)
                </div>
                <p className="text-xs text-slate-300 italic">"{selectedProspect.painHypothesis}"</p>
              </div>
            </div>

            {/* CAN-SPAM Compliant Cold Email Generator */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-main flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  CAN-SPAM Compliant Cold Email Draft
                </span>
                <button 
                  className="btn btn-secondary text-xs py-1 px-2"
                  onClick={() => navigator.clipboard.writeText(`Subject: Quick software idea for ${selectedProspect.name}\n\nHi ${selectedProspect.decisionMaker.split(' ')[0]},\n\nI'm Ethan, a local software developer based in Mesa.\n\nI work on the annoying operational stuff that falls between normal software products—repetitive data entry, spreadsheets, quoting, reports, follow-up, integrations, dashboards and small internal tools.\n\nI noticed ${selectedProspect.observation}\n\nI don't know whether it's actually a problem on your end, but it made me wonder whether ${selectedProspect.painHypothesis.toLowerCase()} is still being handled manually.\n\nI'm not trying to sell you a giant software package. I'd rather understand the workflow first. If there's something worth fixing, you can tell me what solving it is worth to the business, and I'll tell you whether I can responsibly make that work.\n\nWorth a fifteen-minute conversation?\n\nEthan\nOn-Call Software Developer\nMesa, AZ | (480) 555-0100\nethan@ethanazsoftware.com\n\nP.S. If you'd rather I don't email again, reply 'opt out' and I won't.`)}
                >
                  Copy Email Text
                </button>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
                <p><strong>Subject:</strong> Quick software idea for {selectedProspect.name}</p>
                <div className="border-t border-slate-800 pt-2 space-y-2">
                  <p>Hi {selectedProspect.decisionMaker.split(' ')[0]},</p>
                  <p>I'm Ethan, a local software developer based in Mesa.</p>
                  <p>I work on the annoying operational stuff that falls between normal software products—repetitive data entry, spreadsheets, quoting, reports, follow-up, integrations, dashboards and small internal tools.</p>
                  <p>I noticed {selectedProspect.observation}</p>
                  <p>I don't know whether it's actually a problem on your end, but it made me wonder whether {selectedProspect.painHypothesis.toLowerCase()} is still being handled manually.</p>
                  <p>I'm not trying to sell you a giant software package. I'd rather understand the workflow first. If there's something worth fixing, you can tell me what solving it is worth to the business, and I'll tell you whether I can responsibly make that work.</p>
                  <p>Worth a fifteen-minute conversation?</p>
                  <p className="text-slate-400 mt-2">
                    Ethan • On-Call Software Developer<br />
                    Mesa, AZ | (480) 555-0100<br />
                    <span className="text-[10px] text-slate-500">P.S. If you'd rather I don't email again, just say so and I won't.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Cold Phone Script */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Phone className="w-4 h-4" />
                Live Cold Call Script (Direct & Respectful)
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 space-y-1.5 border border-slate-800">
                <p><strong>Opening:</strong> "Hey {selectedProspect.decisionMaker.split(' ')[0]}, Ethan here. I'm a software developer in Mesa. This isn't a website or marketing pitch."</p>
                <p><strong>Pitch:</strong> "I work with local businesses on annoying manual processes—things like duplicate data entry, reports, quotes, spreadsheets, follow-up and software that doesn't talk to other software."</p>
                <p><strong>Hook:</strong> "I noticed {selectedProspect.observation.toLowerCase()} at {selectedProspect.name}, and I wanted to ask: what's one computer process around there that your people absolutely hate doing?"</p>
                <p className="text-emerald-400 font-semibold mt-1">[Stop talking and listen to their response!]</p>
              </div>
            </div>

          </div>

          {/* Discovery & Pain Value Calculator */}
          <div className="glass-panel space-y-4">
            <h4 className="text-md font-bold text-main flex items-center gap-2 border-b border-white/10 pb-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              Owner Discovery & Pain Value Quantification Calculator
            </h4>
            <p className="text-xs text-muted">
              Use this tool during or after a discovery call to quantify operational pain into a transparent project budget.
            </p>

            <div className="grid-3">
              <div>
                <label className="text-xs text-muted block mb-1">Hours wasted / week</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={hoursWastedPerWeek} 
                  onChange={e => setHoursWastedPerWeek(Number(e.target.value))} 
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Staff Hourly Rate ($)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={hourlyStaffRate} 
                  onChange={e => setHourlyStaffRate(Number(e.target.value))} 
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Monthly Error/Delay Cost ($)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={errorCostPerMonth} 
                  onChange={e => setErrorCostPerMonth(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-emerald-500/20 grid-3 text-center">
              <div>
                <div className="text-xs text-muted">Monthly Labor Wasted</div>
                <div className="text-lg font-bold text-amber-400">${monthlyLaborCostWasted.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Total Annual Business Pain</div>
                <div className="text-lg font-bold text-rose-400">${annualPain.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Recommended Win-Win Quote</div>
                <div className="text-lg font-bold text-emerald-400">${recommendedFixQuote.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-lg text-xs text-cyan-200">
              <strong>Owner Closing Script:</strong> "Solving this issue is costing your business ~${Math.round(totalMonthlyPain)} every single month. I can build a dedicated automated pipeline to eliminate this headache for a fixed cost of ${recommendedFixQuote} (or $500 deposit + balance on delivery). Should I draft the 1-page SOW?"
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
