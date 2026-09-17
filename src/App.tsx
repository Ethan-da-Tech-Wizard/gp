import React, { useState, useEffect } from 'react';
import { Target, Layers, FileText, Code2, Zap, Palette, Sparkles, Building, ChevronRight, ShieldCheck } from 'lucide-react';
import { ProspectingCRM } from './components/crm/ProspectingCRM';
import { HomeServiceQuoteDemo } from './components/demos/HomeServiceQuoteDemo';
import { OpsDashboardDemo } from './components/demos/OpsDashboardDemo';
import { DocumentExtractionDemo } from './components/demos/DocumentExtractionDemo';
import { SOWGenerator } from './components/legal/SOWGenerator';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crm' | 'demos' | 'legal' | 'stack'>('crm');
  const [activeDemo, setActiveDemo] = useState<'quote' | 'ops' | 'doc'>('quote');
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<'cyber' | 'emerald' | 'sunset' | 'cosmic'>('cyber');
  const [customAccent, setCustomAccent] = useState<string>('#00f3ff');
  const [clientBrandName, setClientBrandName] = useState<string>('Desert Breeze Solutions');
  const [showThemeCustomizer, setShowThemeCustomizer] = useState<boolean>(false);

  // Apply theme attributes to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleCustomColorChange = (hex: string) => {
    setCustomAccent(hex);
    document.documentElement.style.setProperty('--primary-accent', hex);
    document.documentElement.style.setProperty('--primary-glow', `${hex}66`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Dynamic Theme & Personalization Control Bar */}
      <div className="bg-slate-950/90 border-b border-white/10 py-1.5 px-4 text-xs">
        <div className="container flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Client Showcase Personalizer:
            </span>
            
            {/* Theme Presets */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => { setCurrentTheme('cyber'); handleCustomColorChange('#00f3ff'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${currentTheme === 'cyber' ? 'bg-cyan-500 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                ⚡ Cyber Neon
              </button>
              <button 
                onClick={() => { setCurrentTheme('emerald'); handleCustomColorChange('#10b981'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${currentTheme === 'emerald' ? 'bg-emerald-500 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                💎 Emerald Gold
              </button>
              <button 
                onClick={() => { setCurrentTheme('sunset'); handleCustomColorChange('#f97316'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${currentTheme === 'sunset' ? 'bg-orange-500 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                🔥 Sunset Flare
              </button>
              <button 
                onClick={() => { setCurrentTheme('cosmic'); handleCustomColorChange('#a855f7'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${currentTheme === 'cosmic' ? 'bg-purple-500 text-black font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                🔮 Cosmic Violet
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Accent Picker */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-white/10">
              <span className="text-slate-400 text-[11px]">Brand Accent:</span>
              <input 
                type="color" 
                value={customAccent} 
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-4 h-4 rounded cursor-pointer bg-transparent border-0"
              />
            </div>

            {/* Client Business Name Customizer */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-white/10">
              <span className="text-slate-400 text-[11px]">Client Name:</span>
              <input 
                type="text" 
                value={clientBrandName}
                onChange={(e) => setClientBrandName(e.target.value)}
                placeholder="Enter client company..."
                className="bg-transparent text-main font-semibold text-[11px] outline-none w-36"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 shimmer-effect">
        <div className="container py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/30">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-main">Ethan</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                  Mesa, AZ
                </span>
              </div>
              <p className="text-[11px] text-muted font-medium">On-Call Custom Software Developer for Arizona Businesses</p>
            </div>
          </div>

          {/* Primary View Switcher */}
          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/15 shadow-xl">
            <button 
              onClick={() => setActiveTab('crm')} 
              className={`tab-btn ${activeTab === 'crm' ? 'active' : ''}`}
            >
              <Target className="w-4 h-4" />
              Mesa Outbound CRM
            </button>

            <button 
              onClick={() => setActiveTab('demos')} 
              className={`tab-btn ${activeTab === 'demos' ? 'active' : ''}`}
            >
              <Layers className="w-4 h-4" />
              Client Showcase Demos
            </button>

            <button 
              onClick={() => setActiveTab('legal')} 
              className={`tab-btn ${activeTab === 'legal' ? 'active' : ''}`}
            >
              <FileText className="w-4 h-4" />
              SOW & Legal Toolkit
            </button>

            <button 
              onClick={() => setActiveTab('stack')} 
              className={`tab-btn ${activeTab === 'stack' ? 'active' : ''}`}
            >
              <Code2 className="w-4 h-4" />
              Ethan Stack Blueprint
            </button>
          </nav>
        </div>
      </header>

      {/* Sub-Header Demo Switcher if in Demos mode */}
      {activeTab === 'demos' && (
        <div className="bg-slate-900/80 border-b border-white/10 py-2.5">
          <div className="container flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-xs text-muted font-bold uppercase tracking-wider">Active Demo:</span>
              <button 
                onClick={() => setActiveDemo('quote')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDemo === 'quote' 
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                1. Home-Service Quote & Intake
              </button>
              <button 
                onClick={() => setActiveDemo('ops')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDemo === 'ops' 
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/20' 
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                2. Ops Dashboard & Data Cleaner
              </button>
              <button 
                onClick={() => setActiveDemo('doc')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDemo === 'doc' 
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                3. Document-to-Data Assistant
              </button>
            </div>

            <button 
              onClick={() => setShowScriptModal(!showScriptModal)} 
              className="btn btn-secondary py-1 px-3 text-xs font-bold"
            >
              📹 1-Min Video Recording Talking Points
            </button>
          </div>

          {/* Screen Recording Talking Points Guide Modal */}
          {showScriptModal && (
            <div className="container mt-2">
              <div className="p-4 bg-slate-900/95 border border-cyan-500/50 rounded-xl space-y-2 text-xs animate-fade-in shadow-2xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="font-bold text-cyan-400">📹 60-Second Video Pitch Talking Points ({activeDemo.toUpperCase()} DEMO)</span>
                  <button onClick={() => setShowScriptModal(false)} className="text-muted hover:text-white">✕</button>
                </div>
                {activeDemo === 'quote' && (
                  <div className="space-y-1.5 text-slate-300">
                    <p><strong>1. Annoying Problem (0-15s):</strong> "HVAC & plumbing businesses lose up to 30% of incoming leads because inquiries hit a static PDF or email inbox, requiring manual transcription."</p>
                    <p><strong>2. Normal Workaround (15-30s):</strong> "Normally, a dispatcher re-enters customer name, address, and issue into three separate scheduling spreadsheets."</p>
                    <p><strong>3. Workflow & Result (30-45s):</strong> "Here, the customer inquiry auto-cleans the phone number, generates an estimate draft instantly, and alerts the dispatcher board."</p>
                    <p><strong>4. Exception Handling (45-60s):</strong> "If a phone number is incomplete, validation rules prevent corrupt data from ever hitting your CRM."</p>
                  </div>
                )}
                {activeDemo === 'ops' && (
                  <div className="space-y-1.5 text-slate-300">
                    <p><strong>1. Annoying Problem (0-15s):</strong> "Every morning staff exports CSVs with unformatted dates like `01012024`, untrimmed text, and raw numbers."</p>
                    <p><strong>2. Normal Workaround (15-30s):</strong> "Staff manually fixes dates line-by-line, leading to aging revenue tracking errors."</p>
                    <p><strong>3. Workflow & Result (30-45s):</strong> "One click cleans and normalizes all 5 fields into a clear executive aging dashboard with instant search."</p>
                    <p><strong>4. Exception Handling (45-60s):</strong> "Any unparseable record is flagged with a warning badge for quick manager review."</p>
                  </div>
                )}
                {activeDemo === 'doc' && (
                  <div className="space-y-1.5 text-slate-300">
                    <p><strong>1. Annoying Problem (0-15s):</strong> "Paper invoices and work orders require tedious manual data entry."</p>
                    <p><strong>2. Normal Workaround (15-30s):</strong> "Companies either type receipts by hand or trust unvalidated OCR that hallucinates numbers."</p>
                    <p><strong>3. Workflow & Result (30-45s):</strong> "This system extracts structured data while running strict math validation rules."</p>
                    <p><strong>4. Exception Handling (45-60s):</strong> "Any line-item mismatch is routed to an Exception Review drawer before updating accounting."</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="container flex-1 py-6 space-y-6">
        
        {activeTab === 'crm' && <ProspectingCRM />}

        {activeTab === 'demos' && (
          <>
            {activeDemo === 'quote' && <HomeServiceQuoteDemo clientBrandName={clientBrandName} />}
            {activeDemo === 'ops' && <OpsDashboardDemo clientBrandName={clientBrandName} />}
            {activeDemo === 'doc' && <DocumentExtractionDemo clientBrandName={clientBrandName} />}
          </>
        )}

        {activeTab === 'legal' && <SOWGenerator />}

        {activeTab === 'stack' && (
          <div className="animate-fade-in space-y-6">
            <div className="glass-panel border-l-4 border-l-cyan-400">
              <h2 className="text-xl font-bold text-main mb-1">The Private "Ethan Stack" Starter Architecture</h2>
              <p className="text-xs text-muted">
                Pre-assembled Python FastAPI + SQLite + Ollama/Gemini CLI blueprints located in <code className="text-cyan-400">/backend/</code> to deploy client solutions in hours.
              </p>
            </div>

            <div className="grid-3">
              <div className="glass-panel space-y-2">
                <div className="text-xs font-bold text-cyan-400">backend/main.py</div>
                <p className="text-xs text-muted">FastAPI REST server with SQLite persistence, CORS, and data validation pipeline.</p>
              </div>

              <div className="glass-panel space-y-2">
                <div className="text-xs font-bold text-amber-400">backend/ai_router.py</div>
                <p className="text-xs text-muted">Dual-routing AI client (Local Ollama for private data, Gemini CLI fallback for public research).</p>
              </div>

              <div className="glass-panel space-y-2">
                <div className="text-xs font-bold text-emerald-400">backend/data_cleaner.py</div>
                <p className="text-xs text-muted">Reusable ETL pipeline engine for date parsing, string trimming, and phone normalization.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-4 text-center text-xs text-muted">
        <div className="container flex flex-wrap justify-between items-center gap-2">
          <span>Ethan • On-Call Software Developer for Arizona Businesses</span>
          <span className="font-mono text-cyan-400">Mesa • Gilbert • Chandler • Tempe • Phoenix</span>
        </div>
      </footer>

    </div>
  );
};

export default App;

