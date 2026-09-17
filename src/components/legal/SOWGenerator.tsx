import React, { useState } from 'react';
import { FileCheck, Shield, CheckSquare, Copy, Check, Download, AlertTriangle, Scale, DollarSign } from 'lucide-react';
import { SplitMode } from '../../App';

interface SOWGeneratorProps {
  splitMode?: SplitMode;
}

interface ChecklistItem {
  id: string;
  task: string;
  cost: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  guidance: string;
}

const INITIAL_LEGAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    task: 'File Single-Member Arizona LLC',
    cost: '$85 ACC Online Expedited',
    status: 'In Progress',
    guidance: 'File directly at azcc.gov ($85 online). AZ single-member LLCs do not file annual reports.'
  },
  {
    id: 'chk-2',
    task: 'Obtain IRS Employer Identification Number (EIN)',
    cost: 'Free from IRS.gov',
    status: 'In Progress',
    guidance: 'Apply directly at IRS.gov right after LLC entity approval. Needed for bank account & taxes.'
  },
  {
    id: 'chk-3',
    task: 'Apply for Mesa General Business License',
    cost: '$25 Initial Fee',
    status: 'Pending',
    guidance: 'Required for home-based/service businesses in Mesa. Takes 10-30 days to process.'
  },
  {
    id: 'chk-4',
    task: 'Check Mesa TPT (Transaction Privilege Tax) Requirements',
    cost: 'City/State filing',
    status: 'Pending',
    guidance: 'Confirm TPT licensing with ADOR for hosted software, SaaS, or bundled services.'
  },
  {
    id: 'chk-5',
    task: 'Verify 2026 FinCEN BOI Reporting Status',
    cost: 'Exempt ($0)',
    status: 'Completed',
    guidance: 'FinCEN current rules state U.S.-created domestic LLCs are exempt from BOI reporting.'
  },
  {
    id: 'chk-6',
    task: 'Open Business Checking Account',
    cost: '$0',
    status: 'Pending',
    guidance: 'Requires Articles of Organization, EIN, and Mesa License. Separate business money from day 1.'
  },
  {
    id: 'chk-7',
    task: 'Obtain Tech E&O / Cyber Liability Quotes',
    cost: 'Broker quote stage',
    status: 'Pending',
    guidance: 'Request Tech E&O + Cyber coverage before taking on production client infrastructure.'
  },
  {
    id: 'chk-8',
    task: 'Establish 30% Tax Savings Bucket',
    cost: '30% of gross payments',
    status: 'In Progress',
    guidance: 'Move 30% of every client payment into a dedicated tax savings sub-account.'
  },
  {
    id: 'chk-9',
    task: 'Enforce Healthcare / HIPAA Red Line',
    cost: 'Risk boundary',
    status: 'Completed',
    guidance: 'For medical clients, begin with non-PHI administrative tools only (BAA required for PHI).'
  }
];

export const SOWGenerator: React.FC<SOWGeneratorProps> = ({ splitMode = 'auto' }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_LEGAL_CHECKLIST);
  const [copied, setCopied] = useState(false);

  // Layout split classes
  const containerClass = `split-container-${splitMode}`;
  const leftClass = `split-left-${splitMode} glass-panel space-y-4`;
  const rightClass = `split-right-${splitMode} glass-panel space-y-4`;

  // SOW Form State
  const [clientName, setClientName] = useState('Desert Sun HVAC & Mechanical');
  const [clientOwner, setClientOwner] = useState('Dave Miller');
  const [projectName, setProjectName] = useState('Automated Lead & Estimate Dispatch System');
  const [problemDescription, setProblemDescription] = useState('Dispatcher currently transcribes web quote requests manually into dispatch software and sends manual SMS follow-ups.');
  const [exactDeliverables, setExactDeliverables] = useState('1. Web Intake Form with phone & date validation\n2. Automated PDF Estimate Generator\n3. Dispatcher Status Board Dashboard\n4. Automated SMS confirmation trigger');
  const [outOfScope, setOutOfScope] = useState('Integration with legacy payroll systems, physical server hosting, 24/7 emergency phone support.');
  const [projectPrice, setProjectPrice] = useState(1200);
  const [depositAmount, setDepositAmount] = useState(600);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('System successfully parses web inquiry, generates accurate estimate draft, and displays lead on dispatch board within 5 seconds.');
  const [supportDuration, setSupportDuration] = useState('30 days included post-deployment support; optional $250/mo managed care thereafter.');

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextStatus = item.status === 'Completed' ? 'Pending' : item.status === 'Pending' ? 'In Progress' : 'Completed';
      return { ...item, status: nextStatus };
    }));
  };

  const sowMarkdownText = `STATEMENT OF WORK (SOW)

Client Company: ${clientName}
Client Representative: ${clientOwner}
Developer: Ethan (On-Call Software Developer, Mesa, AZ)
Date: ${new Date().toLocaleDateString()}
Project Title: ${projectName}

1. PROBLEM TO BE FIXED
${problemDescription}

2. EXACT DELIVERABLES
${exactDeliverables}

3. EXPLICITLY OUT OF SCOPE (NOT INCLUDED)
${outOfScope}

4. INVESTMENT & DEPOSIT TERMS
Total Fixed Project Investment: $${projectPrice.toLocaleString()}
Upfront Deposit Required to Begin Work: $${depositAmount.toLocaleString()}
Remaining Balance Due Upon Final Acceptance: $${(projectPrice - depositAmount).toLocaleString()}

5. ACCEPTANCE CRITERIA FOR COMPLETION
${acceptanceCriteria}

6. SUPPORT & OWNERSHIP
Support Period: ${supportDuration}
IP Ownership: Client owns custom business code upon full payment; Developer retains reusable underlying utility libraries.

7. ACCEPTANCE & SIGNATURES

Developer Signature: ______________________ Date: _________
Client Signature:    ______________________ Date: _________`;

  const copySow = () => {
    navigator.clipboard.writeText(sowMarkdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const downloadSow = () => {
    const blob = new Blob([sowMarkdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOW_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Launch & Legal Checklist Section */}
      <div className="glass-panel space-y-4 border-l-4 border-l-cyan-400">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <div>
            <h3 className="text-lg font-bold text-main flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              Arizona LLC & Mesa Business Launch Infrastructure
            </h3>
            <p className="text-xs text-muted">Legal formation, licensing order, and compliance tracking for Ethan's Mesa business.</p>
          </div>
          <span className="badge badge-cyan">$110 Total Known Govt Fees</span>
        </div>

        <div className="grid-3">
          {checklist.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleChecklist(item.id)}
              className="p-3 bg-slate-900/80 rounded-xl border border-white/5 hover:border-white/20 cursor-pointer space-y-1.5 transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xs text-main">{item.task}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-[11px] text-cyan-400 font-mono">{item.cost}</div>
              <p className="text-[11px] text-slate-400 italic">{item.guidance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SOW Generator Section */}
      <div className={containerClass}>
        
        {/* SOW Form */}
        <div className={leftClass}>
          <h3 className="text-md font-bold text-main flex items-center gap-2 border-b border-white/10 pb-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            1-Page Statement of Work (SOW) Builder
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid-2">
              <div>
                <label className="text-muted block mb-1">Client Business Name</label>
                <input type="text" className="input-field" value={clientName} onChange={e => setClientName(e.target.value)} />
              </div>
              <div>
                <label className="text-muted block mb-1">Client Representative</label>
                <input type="text" className="input-field" value={clientOwner} onChange={e => setClientOwner(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-muted block mb-1">Project Title</label>
              <input type="text" className="input-field" value={projectName} onChange={e => setProjectName(e.target.value)} />
            </div>

            <div>
              <label className="text-muted block mb-1">Problem Being Fixed</label>
              <textarea rows={2} className="textarea-field" value={problemDescription} onChange={e => setProblemDescription(e.target.value)} />
            </div>

            <div>
              <label className="text-muted block mb-1">Exact Deliverables (Numbered List)</label>
              <textarea rows={3} className="textarea-field font-mono" value={exactDeliverables} onChange={e => setExactDeliverables(e.target.value)} />
            </div>

            <div>
              <label className="text-muted block mb-1">Explicitly Out of Scope (Not Included)</label>
              <input type="text" className="input-field text-rose-300" value={outOfScope} onChange={e => setOutOfScope(e.target.value)} />
            </div>

            <div className="grid-2">
              <div>
                <label className="text-muted block mb-1">Fixed Project Investment ($)</label>
                <input type="number" className="input-field" value={projectPrice} onChange={e => setProjectPrice(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-muted block mb-1">Upfront Deposit Required ($)</label>
                <input type="number" className="input-field text-emerald-400 font-bold" value={depositAmount} onChange={e => setDepositAmount(Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="text-muted block mb-1">Acceptance Criteria (Definition of Done)</label>
              <textarea rows={2} className="textarea-field" value={acceptanceCriteria} onChange={e => setAcceptanceCriteria(e.target.value)} />
            </div>

            <div>
              <label className="text-muted block mb-1">Included Support & Terms</label>
              <input type="text" className="input-field" value={supportDuration} onChange={e => setSupportDuration(e.target.value)} />
            </div>
          </div>
        </div>

        {/* SOW Contract Preview */}
        <div className={rightClass}>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="text-md font-bold text-main flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Generated SOW Contract Document
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={downloadSow} className="btn btn-secondary text-xs py-1 px-2.5">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Download .md
              </button>
              <button onClick={copySow} className="btn btn-primary text-xs py-1 px-3">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-y-auto max-h-[560px] border border-slate-800 leading-relaxed">
            {sowMarkdownText}
          </pre>
        </div>

      </div>
    </div>
  );
};
