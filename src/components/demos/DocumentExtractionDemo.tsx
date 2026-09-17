import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Bot, Eye, HelpCircle, ArrowRight, Zap } from 'lucide-react';

interface DocumentExtractionDemoProps {
  clientBrandName?: string;
}

interface ExtractedDoc {
  id: string;
  filename: string;
  vendorName: string;
  invoiceNum: string;
  invoiceDate: string;
  amount: number;
  confidenceScore: number;
  flaggedReason?: string;
  status: 'Validated' | 'Requires Review' | 'Flagged Error';
  rawTextPreview: string;
}

const SAMPLE_DOCS: ExtractedDoc[] = [
  {
    id: 'doc-1',
    filename: 'Invoice_8901_LennoxSupply.pdf',
    vendorName: 'Lennox HVAC Supply Wholesale',
    invoiceNum: 'INV-8901',
    invoiceDate: '03/02/2026',
    amount: 3450.00,
    confidenceScore: 98,
    status: 'Validated',
    rawTextPreview: 'INVOICE INV-8901 Lennox HVAC Supply Wholesale. Date: 03/02/2026. Items: 4-ton condenser coil ($2,850.00), R-410A refrigerant 25lb ($600.00). Total: $3,450.00'
  },
  {
    id: 'doc-2',
    filename: 'WorkOrder_MesaAutoParts.pdf',
    vendorName: 'Mesa Auto Warehouse',
    invoiceNum: 'WO-4412',
    invoiceDate: '03/04/2026',
    amount: 875.50,
    confidenceScore: 82,
    flaggedReason: 'Tax line item mismatch ($42.50 expected vs $45.50 OCR scanned)',
    status: 'Requires Review',
    rawTextPreview: 'Mesa Auto Warehouse WO-4412. Brake rotor set (4x) $600. Ceramic pads $230. Tax $45.50. Total $875.50'
  },
  {
    id: 'doc-3',
    filename: 'ScannedReceipt_UnreadableDate.pdf',
    vendorName: 'Unknown Vendor / Hand-written',
    invoiceNum: 'REC-009',
    invoiceDate: 'INVALID_DATE',
    amount: 140.00,
    confidenceScore: 54,
    flaggedReason: 'Date field unreadable from hand-written receipt crop',
    status: 'Flagged Error',
    rawTextPreview: 'Handwritten receipt REC-009. Total $140.00. Date blurry/unreadable.'
  }
];

export const DocumentExtractionDemo: React.FC<DocumentExtractionDemoProps> = ({ 
  clientBrandName = 'Sun Valley Logistics & Supply' 
}) => {
  const [docs, setDocs] = useState<ExtractedDoc[]>(SAMPLE_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<ExtractedDoc>(SAMPLE_DOCS[0]);
  const [userQuery, setUserQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Simulated document upload & OCR processing
  const handleSimulatedUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const newDoc: ExtractedDoc = {
        id: `doc-${Date.now()}`,
        filename: 'New_Customer_Invoice_Uploaded.pdf',
        vendorName: 'Sun Valley Plumbing Distributors',
        invoiceNum: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceDate: '03/10/2026',
        amount: 1250.75,
        confidenceScore: 96,
        status: 'Validated',
        rawTextPreview: 'Sun Valley Plumbing Distributors. Invoice INV-9102. 2-inch Copper pipe bundle ($950.00), Brass fittings ($300.75). Total $1,250.75'
      };
      setDocs([newDoc, ...docs]);
      setSelectedDoc(newDoc);
      setUploading(false);
    }, 1200);
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery) return;
    setIsProcessingQuery(true);

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      if (q.includes('total') || q.includes('sum') || q.includes('amount')) {
        const total = docs.reduce((acc, d) => acc + d.amount, 0);
        setAiAnswer(`Based on the 3 extracted documents for ${clientBrandName}, the total combined invoice expense is $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`);
      } else if (q.includes('flag') || q.includes('error') || q.includes('review')) {
        const flagged = docs.filter(d => d.status !== 'Validated');
        setAiAnswer(`There are ${flagged.length} documents requiring human attention: ${flagged.map(f => f.filename).join(', ')}.`);
      } else {
        setAiAnswer(`Local Ollama Model Summary: Identified ${docs.length} processed invoices for ${clientBrandName} across HVAC supply, auto parts, and receipt vendors. All deterministic fields parsed with validation rules.`);
      }
      setIsProcessingQuery(false);
    }, 600);
  };

  const resolveFlag = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'Validated', confidenceScore: 100, flaggedReason: undefined } : d));
    if (selectedDoc.id === id) {
      setSelectedDoc(prev => ({ ...prev, status: 'Validated', confidenceScore: 100, flaggedReason: undefined }));
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="glass-panel border-l-4 border-l-emerald-400 bg-slate-900/90 flex flex-wrap justify-between items-center gap-4 shimmer-effect">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-emerald">Custom AI Extraction</span>
            <span className="text-xs text-muted font-bold">Personalized for: <strong className="text-emerald-300">{clientBrandName}</strong></span>
          </div>
          <h2 className="text-xl font-extrabold title-gradient">{clientBrandName} • Document-to-Data Assistant</h2>
          <p className="text-xs text-muted mt-1">
            Combines OCR/LLM extraction with strict schema validation rules so unverified numbers never hit your accounting system.
          </p>
        </div>

        <button 
          onClick={handleSimulatedUpload} 
          disabled={uploading}
          className="btn btn-primary text-xs shadow-lg shadow-emerald-500/20"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Scanning PDF with Laser AI...' : 'Simulate PDF Dropzone Upload'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Document List & Extraction Table (7 cols) */}
        <div className={`lg:col-span-7 glass-panel space-y-4 ${uploading ? 'laser-scanner border-cyan-400/80 shadow-2xl' : ''}`}>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="text-md font-bold text-main flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Extracted Invoice Queue
            </h3>
            <span className="text-xs text-muted font-bold">{docs.length} documents processed</span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {docs.map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDoc.id === doc.id 
                    ? 'bg-slate-800/90 border-cyan-400/60 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-extrabold text-sm text-main">{doc.filename}</span>
                    <div className="text-xs text-muted font-medium">{doc.vendorName} • Invoice #{doc.invoiceNum}</div>
                  </div>
                  <span className={`badge ${
                    doc.status === 'Validated' ? 'badge-emerald' :
                    doc.status === 'Requires Review' ? 'badge-amber' :
                    'badge-rose'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="grid-3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-400">Date:</span> <span className="text-slate-200 font-bold">{doc.invoiceDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Amount:</span> <span className="text-emerald-400 font-black">${doc.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Confidence:</span> <span className={`font-bold ${doc.confidenceScore > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{doc.confidenceScore}%</span>
                  </div>
                </div>

                {doc.flaggedReason && (
                  <div className="mt-2 text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      {doc.flaggedReason}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); resolveFlag(doc.id); }}
                      className="btn btn-accent py-0.5 px-2.5 text-[10px] font-bold"
                    >
                      Approve Override
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Exception Review Drawer & Local LLM Assistant (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Document Inspection Panel */}
          <div className="glass-panel space-y-3">
            <h4 className="text-sm font-bold text-main flex items-center gap-2 border-b border-white/10 pb-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Document Inspector: <span className="text-cyan-300">{selectedDoc.filename}</span>
            </h4>

            <div className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
              <div className="text-slate-400 font-sans text-[11px] uppercase font-bold tracking-wider">Raw OCR Scan Preview</div>
              <p className="italic text-slate-300">"{selectedDoc.rawTextPreview}"</p>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl text-xs space-y-2 border border-slate-800">
              <div className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">Schema Validation Checkpoints:</div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Vendor Name Match</span>
                <span className="text-emerald-400 font-bold">PASSED</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Invoice Date Format (MM/DD/YYYY)</span>
                <span className={selectedDoc.invoiceDate.includes('/') ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {selectedDoc.invoiceDate.includes('/') ? 'PASSED' : 'FLAGGED'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Line Item Math Reconciliation</span>
                <span className={selectedDoc.confidenceScore > 90 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedDoc.confidenceScore}% ACCURACY
                </span>
              </div>
            </div>
          </div>

          {/* Local LLM Assistant Panel */}
          <div className="glass-panel space-y-3">
            <h4 className="text-sm font-bold text-main flex items-center gap-2 border-b border-white/10 pb-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              Local LLM Extraction Assistant
            </h4>

            <form onSubmit={handleAskAI} className="space-y-2">
              <input 
                type="text" 
                placeholder="Ask about this document set (e.g. 'What is the total expense?')..."
                className="input-field text-xs"
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
              />
              <button type="submit" disabled={isProcessingQuery} className="btn btn-secondary text-xs w-full py-2 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {isProcessingQuery ? 'Analyzing with Ollama...' : 'Ask Local Assistant'}
              </button>
            </form>

            {aiAnswer && (
              <div className="p-3.5 bg-cyan-950/50 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 animate-fade-in space-y-1 shadow-lg">
                <div className="font-bold text-cyan-400">Local LLM Summary Output:</div>
                <p>{aiAnswer}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

