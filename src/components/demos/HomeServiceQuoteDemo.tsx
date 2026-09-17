import React, { useState } from 'react';
import { Wrench, Phone, Calendar, User, CheckCircle2, Clock, ArrowRight, ShieldAlert, Sparkles, Send } from 'lucide-react';

interface QuoteLead {
  id: string;
  customerName: string;
  phone: string;
  serviceType: 'AC Replacement' | 'Ductless Mini-Split' | 'Water Heater Leak' | 'Main Line Jetting' | 'Electrical Panel Upgrade';
  city: string;
  notes: string;
  estimatedCost: number;
  status: 'Inquiry Received' | 'Estimate Drafted' | 'Customer Approved' | 'Dispatched';
  createdAt: string;
}

const INITIAL_LEADS: QuoteLead[] = [
  {
    id: 'L-101',
    customerName: 'Robert Martinez',
    phone: '(480) 921-4819',
    serviceType: 'AC Replacement',
    city: 'Mesa, AZ (85204)',
    notes: 'Unit blowing warm air, 15 year old Lennox system. Needs 4-ton replacement quote.',
    estimatedCost: 6800,
    status: 'Customer Approved',
    createdAt: '10 mins ago'
  },
  {
    id: 'L-102',
    customerName: 'Jennifer Sterling',
    phone: '(480) 332-9011',
    serviceType: 'Water Heater Leak',
    city: 'Gilbert, AZ (85234)',
    notes: '50 gallon tank leaking from bottom pan in garage.',
    estimatedCost: 1850,
    status: 'Estimate Drafted',
    createdAt: '35 mins ago'
  }
];

export const HomeServiceQuoteDemo: React.FC = () => {
  const [leads, setLeads] = useState<QuoteLead[]>(INITIAL_LEADS);
  const [customerName, setCustomerName] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [serviceType, setServiceType] = useState<QuoteLead['serviceType']>('AC Replacement');
  const [city, setCity] = useState('Mesa');
  const [notes, setNotes] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Phone auto-formatter (e.g. 4805550192 -> (480) 555-0192)
  const formatPhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawPhone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !rawPhone) return;

    // Smart pricing calculation logic
    let est = 1200;
    if (serviceType === 'AC Replacement') est = 6500;
    if (serviceType === 'Ductless Mini-Split') est = 4200;
    if (serviceType === 'Water Heater Leak') est = 1800;
    if (serviceType === 'Electrical Panel Upgrade') est = 3200;

    const newLead: QuoteLead = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      phone: rawPhone,
      serviceType,
      city: `${city}, AZ`,
      notes: notes || 'Standard operational inquiry submitted online.',
      estimatedCost: est,
      status: 'Inquiry Received',
      createdAt: 'Just now'
    };

    setLeads([newLead, ...leads]);
    setCustomerName('');
    setRawPhone('');
    setNotes('');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const advanceStatus = (id: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      if (l.status === 'Inquiry Received') return { ...l, status: 'Estimate Drafted' };
      if (l.status === 'Estimate Drafted') return { ...l, status: 'Customer Approved' };
      if (l.status === 'Customer Approved') return { ...l, status: 'Dispatched' };
      return l;
    }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Demo Banner */}
      <div className="glass-panel border-l-4 border-l-cyan-400 bg-slate-900/90 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-cyan">Demo #1</span>
            <span className="text-xs text-muted">Synthetic HVAC/Plumbing Interactive Workflow</span>
          </div>
          <h2 className="text-xl font-bold text-main">Home-Service Lead & Automated Quoting Portal</h2>
          <p className="text-xs text-muted mt-1">
            Shows how a custom web intake form instantly cleans inputs, generates estimate drafts, and dispatches field techs without double entry.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted block">Observed ROI</span>
          <span className="text-lg font-bold text-emerald-400">Save 14 hrs/week dispatcher time</span>
        </div>
      </div>

      {showNotification && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span><strong>Lead Processed!</strong> Automated SMS estimate sent to customer & lead added to Dispatch Board.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Customer Intake Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel space-y-4">
          <h3 className="text-md font-bold text-main flex items-center gap-2 border-b border-white/10 pb-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Customer Service Inquiry Form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-muted block mb-1">Customer Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="e.g. Marcus Vance" 
                  required
                  className="input-field pl-9"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">Phone Number (Auto-Formats)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="(480) 555-0199" 
                  required
                  className="input-field pl-9 font-mono"
                  value={rawPhone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="text-xs text-muted block mb-1">Service Required</label>
                <select 
                  className="select-field text-xs"
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as QuoteLead['serviceType'])}
                >
                  <option value="AC Replacement">AC Replacement</option>
                  <option value="Ductless Mini-Split">Ductless Mini-Split</option>
                  <option value="Water Heater Leak">Water Heater Leak</option>
                  <option value="Main Line Jetting">Main Line Jetting</option>
                  <option value="Electrical Panel Upgrade">Electrical Panel Upgrade</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">City</label>
                <select className="select-field text-xs" value={city} onChange={e => setCity(e.target.value)}>
                  <option value="Mesa">Mesa</option>
                  <option value="Gilbert">Gilbert</option>
                  <option value="Chandler">Chandler</option>
                  <option value="Tempe">Tempe</option>
                  <option value="Phoenix">Phoenix</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1">Job Notes / System Issue</label>
              <textarea 
                rows={2} 
                placeholder="Describe equipment age, leak location, noise, etc..."
                className="textarea-field"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Send className="w-4 h-4" />
              Submit Service Request
            </button>
          </form>

          <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-400 space-y-1 border border-slate-800">
            <div className="font-semibold text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Behind-The-Scenes Automation Rules
            </div>
            <p>• Clean phone string → validate length → format to standard `(XXX) XXX-XXXX` format.</p>
            <p>• Instant pricing matrix lookup → generate auto-draft estimate PDF.</p>
            <p>• Push notification payload to dispatcher dashboard & schedule follow-up trigger.</p>
          </div>
        </div>

        {/* Dispatcher Board (7 cols) */}
        <div className="lg:col-span-7 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="text-md font-bold text-main flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Live Dispatcher Operations Board
            </h3>
            <span className="text-xs text-muted">{leads.length} active inquiries</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {leads.map(lead => (
              <div key={lead.id} className="p-4 bg-slate-900/90 rounded-xl border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-main">{lead.customerName}</span>
                      <span className="text-xs text-slate-400 font-mono">[{lead.id}]</span>
                    </div>
                    <div className="text-xs text-muted flex items-center gap-3 mt-0.5">
                      <span>📱 {lead.phone}</span>
                      <span>📍 {lead.city}</span>
                      <span>🕒 {lead.createdAt}</span>
                    </div>
                  </div>
                  <span className={`badge ${
                    lead.status === 'Dispatched' ? 'badge-emerald' :
                    lead.status === 'Customer Approved' ? 'badge-cyan' :
                    lead.status === 'Estimate Drafted' ? 'badge-amber' :
                    'badge-rose'
                  }`}>
                    {lead.status}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-lg text-xs text-slate-300 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400">Issue:</span> <strong>{lead.serviceType}</strong> — <em>"{lead.notes}"</em>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm ml-2">
                    ${lead.estimatedCost.toLocaleString()}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-slate-500">Auto-SMS: Estimate link sent to {lead.phone}</span>
                  {lead.status !== 'Dispatched' && (
                    <button 
                      onClick={() => advanceStatus(lead.id)}
                      className="btn btn-secondary text-xs py-1 px-2.5"
                    >
                      Advance Status <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
