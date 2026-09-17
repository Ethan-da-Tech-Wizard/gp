import React, { useState } from 'react';
import { Wrench, Phone, Calendar, User, CheckCircle2, Clock, ArrowRight, ShieldAlert, Sparkles, Send, Tag, Flame } from 'lucide-react';

interface HomeServiceQuoteDemoProps {
  clientBrandName?: string;
}

interface QuoteLead {
  id: string;
  customerName: string;
  phone: string;
  serviceType: 'AC Replacement' | 'Ductless Mini-Split' | 'Water Heater Leak' | 'Main Line Jetting' | 'Electrical Panel Upgrade';
  city: string;
  notes: string;
  estimatedCost: number;
  discountPct: number;
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
    discountPct: 10,
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
    discountPct: 5,
    status: 'Estimate Drafted',
    createdAt: '35 mins ago'
  }
];

export const HomeServiceQuoteDemo: React.FC<HomeServiceQuoteDemoProps> = ({ 
  clientBrandName = 'Desert Breeze HVAC & Plumbing' 
}) => {
  const [leads, setLeads] = useState<QuoteLead[]>(INITIAL_LEADS);
  const [customerName, setCustomerName] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [serviceType, setServiceType] = useState<QuoteLead['serviceType']>('AC Replacement');
  const [city, setCity] = useState('Mesa');
  const [notes, setNotes] = useState('');
  const [webDiscount, setWebDiscount] = useState<number>(10);
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
    let baseEst = 1200;
    if (serviceType === 'AC Replacement') baseEst = 6500;
    if (serviceType === 'Ductless Mini-Split') baseEst = 4200;
    if (serviceType === 'Water Heater Leak') baseEst = 1800;
    if (serviceType === 'Electrical Panel Upgrade') baseEst = 3200;

    const finalEst = Math.round(baseEst * (1 - webDiscount / 100));

    const newLead: QuoteLead = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      phone: rawPhone,
      serviceType,
      city: `${city}, AZ`,
      notes: notes || 'Standard operational inquiry submitted online.',
      estimatedCost: finalEst,
      discountPct: webDiscount,
      status: 'Inquiry Received',
      createdAt: 'Just now'
    };

    setLeads([newLead, ...leads]);
    setCustomerName('');
    setRawPhone('');
    setNotes('');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4500);
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
      <div className="glass-panel border-l-4 border-l-cyan-400 bg-slate-900/90 flex flex-wrap justify-between items-center gap-4 shimmer-effect">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-cyan">Custom Branded Portal</span>
            <span className="text-xs text-muted font-bold">Personalized for: <strong className="text-cyan-300">{clientBrandName}</strong></span>
          </div>
          <h2 className="text-xl font-extrabold title-gradient">{clientBrandName} • Lead & Quoting Portal</h2>
          <p className="text-xs text-muted mt-1">
            Shows how a custom web intake form instantly cleans inputs, applies instant web discount rules, generates estimate drafts, and dispatches field techs.
          </p>
        </div>
        <div className="text-right bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30">
          <span className="text-[11px] text-muted block uppercase font-bold tracking-wider">Observed ROI</span>
          <span className="text-lg font-black text-emerald-400">Save 14 hrs/week dispatcher time</span>
        </div>
      </div>

      {showNotification && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fade-in shadow-xl shadow-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span><strong>Lead Processed for {clientBrandName}!</strong> Automated SMS estimate link sent to customer & lead added to Dispatch Board.</span>
          </div>
          <span className="badge badge-emerald">SMS Sent</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Customer Intake Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="text-md font-bold text-main flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Service Inquiry Intake
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {clientBrandName}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs text-muted block mb-1 font-medium">Customer Full Name</label>
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
              <label className="text-xs text-muted block mb-1 font-medium">Phone Number (Auto-Formats Live)</label>
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
                <label className="text-xs text-muted block mb-1 font-medium">Service Type</label>
                <select 
                  className="select-field text-xs font-medium"
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
                <label className="text-xs text-muted block mb-1 font-medium">City Locus</label>
                <select className="select-field text-xs font-medium" value={city} onChange={e => setCity(e.target.value)}>
                  <option value="Mesa">Mesa</option>
                  <option value="Gilbert">Gilbert</option>
                  <option value="Chandler">Chandler</option>
                  <option value="Tempe">Tempe</option>
                  <option value="Phoenix">Phoenix</option>
                </select>
              </div>
            </div>

            {/* Custom Interactive Web Discount Slider */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Instant Online Lead Discount:
                </span>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {webDiscount}% OFF
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="25" 
                step="5" 
                value={webDiscount} 
                onChange={e => setWebDiscount(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-muted block mb-1 font-medium font-medium">Job Notes / Equipment Details</label>
              <textarea 
                rows={2} 
                placeholder="Describe equipment age, leak location, noise, etc..."
                className="textarea-field"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full shadow-lg">
              <Send className="w-4 h-4" />
              Submit Branded Service Request
            </button>
          </form>

          <div className="p-3 bg-slate-900/90 rounded-xl text-xs text-slate-400 space-y-1 border border-slate-800">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Behind-The-Scenes Automation Rules
            </div>
            <p>• Phone string clean $\rightarrow$ length validation $\rightarrow$ standard format `(XXX) XXX-XXXX`.</p>
            <p>• Apply {webDiscount}% discount matrix $\rightarrow$ generate auto-draft estimate PDF.</p>
            <p>• Push payload to dispatcher dashboard & schedule follow-up triggers.</p>
          </div>
        </div>

        {/* Dispatcher Board (7 cols) */}
        <div className="lg:col-span-7 glass-panel space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="text-md font-bold text-main flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Live Operations Board: <span className="text-cyan-300">{clientBrandName}</span>
            </h3>
            <span className="text-xs text-muted font-bold">{leads.length} active inquiries</span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {leads.map(lead => (
              <div key={lead.id} className="p-4 bg-slate-900/90 rounded-xl border border-white/15 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-main text-base">{lead.customerName}</span>
                      <span className="text-xs text-slate-400 font-mono font-bold">[{lead.id}]</span>
                    </div>
                    <div className="text-xs text-muted flex items-center gap-3 mt-0.5 font-medium">
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

                <div className="p-3 bg-slate-950/90 rounded-xl text-xs text-slate-300 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 font-medium">Requested Service:</span> <strong className="text-white">{lead.serviceType}</strong>
                    <div className="text-slate-400 italic text-[11px] mt-0.5">"{lead.notes}"</div>
                  </div>
                  <div className="text-right ml-3">
                    {lead.discountPct > 0 && (
                      <span className="text-[10px] text-amber-400 font-bold block">{lead.discountPct}% Web Promo</span>
                    )}
                    <div className="font-mono text-emerald-400 font-extrabold text-base">
                      ${lead.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Auto-SMS: Branded estimate link sent to {lead.phone}</span>
                  {lead.status !== 'Dispatched' && (
                    <button 
                      onClick={() => advanceStatus(lead.id)}
                      className="btn btn-secondary text-xs py-1 px-3 font-bold"
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

