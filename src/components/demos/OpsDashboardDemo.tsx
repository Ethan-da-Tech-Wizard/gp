import React, { useState } from 'react';
import { BarChart3, Database, Wand2, RefreshCw, Search, CheckCircle2, AlertTriangle, ArrowUpDown, Filter, DollarSign, Target } from 'lucide-react';
import { SplitMode } from '../../App';

interface OpsDashboardDemoProps {
  clientBrandName?: string;
  splitMode?: SplitMode;
}

interface MessyRecord {
  id: string;
  rawCustomer: string;
  rawDate: string;
  rawAmount: string;
  rawStatus: string;
  cleanCustomer?: string;
  cleanDate?: string;
  cleanAmount?: number;
  cleanStatus?: 'Paid' | 'Pending' | 'Overdue';
  isCleaned: boolean;
}

const RAW_MESSY_DATA: MessyRecord[] = [
  { id: '1001', rawCustomer: '   desert air llc  ', rawDate: '01012024', rawAmount: '$1,450.00 ', rawStatus: 'paid', isCleaned: false },
  { id: '1002', rawCustomer: 'apex auto repair', rawDate: '2024/01/15', rawAmount: '750', rawStatus: 'PENDING ', isCleaned: false },
  { id: '1003', rawCustomer: ' valley plumbing & heating ', rawDate: '02-04-2024', rawAmount: '$2,890.50', rawStatus: 'overdue', isCleaned: false },
  { id: '1004', rawCustomer: 'Mesa Tooling Inc.', rawDate: '02182024', rawAmount: '$ 5,100', rawStatus: 'PAID', isCleaned: false },
  { id: '1005', rawCustomer: '  copper state freight', rawDate: '03012024', rawAmount: '920.00', rawStatus: 'OVERDUE', isCleaned: false },
];

export const OpsDashboardDemo: React.FC<OpsDashboardDemoProps> = ({ 
  clientBrandName = 'Apex Auto & Manufacturing',
  splitMode = 'auto'
}) => {
  const [data, setData] = useState<MessyRecord[]>(RAW_MESSY_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningDone, setCleaningDone] = useState(false);
  const [monthlyTargetGoal, setMonthlyTargetGoal] = useState<number>(15000);

  // Messy data cleaner function (demonstrates 01012024 -> 01/01/2024 and text cleaning)
  const cleanData = () => {
    setIsCleaning(true);
    setTimeout(() => {
      const cleaned = data.map(item => {
        // 1. Clean Customer Name
        const cleanCustomer = item.rawCustomer.trim().replace(/\s+/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

        // 2. Clean Date e.g. 01012024 -> 01/01/2024
        let cleanDate = item.rawDate;
        const digits = item.rawDate.replace(/\D/g, '');
        if (digits.length === 8) {
          const month = digits.slice(0, 2);
          const day = digits.slice(2, 4);
          const year = digits.slice(4, 8);
          cleanDate = `${month}/${day}/${year}`;
        } else if (item.rawDate.includes('/')) {
          const parts = item.rawDate.split('/');
          cleanDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
        } else if (item.rawDate.includes('-')) {
          const parts = item.rawDate.split('-');
          cleanDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
        }

        // 3. Clean Amount e.g. '$1,450.00 ' -> 1450
        const numericAmount = parseFloat(item.rawAmount.replace(/[^0-9.]/g, '')) || 0;

        // 4. Clean Status
        let cleanStatus: 'Paid' | 'Pending' | 'Overdue' = 'Pending';
        const st = item.rawStatus.trim().toLowerCase();
        if (st.includes('paid')) cleanStatus = 'Paid';
        if (st.includes('overdue')) cleanStatus = 'Overdue';

        return {
          ...item,
          cleanCustomer,
          cleanDate,
          cleanAmount: numericAmount,
          cleanStatus,
          isCleaned: true
        };
      });

      setData(cleaned);
      setIsCleaning(false);
      setCleaningDone(true);
    }, 750);
  };

  const resetData = () => {
    setData(RAW_MESSY_DATA);
    setCleaningDone(false);
  };

  // Metric aggregates
  const totalRevenue = data.reduce((acc, curr) => acc + (curr.cleanAmount || 0), 0);
  const overdueCount = data.filter(d => d.cleanStatus === 'Overdue').length;
  const overdueAmount = data.filter(d => d.cleanStatus === 'Overdue').reduce((acc, curr) => acc + (curr.cleanAmount || 0), 0);
  const targetPct = Math.min(100, Math.round((totalRevenue / monthlyTargetGoal) * 100));

  const filteredData = data.filter(item => {
    const cust = item.cleanCustomer || item.rawCustomer;
    const matchesSearch = cust.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.cleanStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="glass-panel border-l-4 border-l-amber-400 bg-slate-900/90 flex flex-wrap justify-between items-center gap-4 shimmer-effect">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-amber">Custom Branded Ops</span>
            <span className="text-xs text-muted font-bold">Personalized for: <strong className="text-amber-300">{clientBrandName}</strong></span>
          </div>
          <h2 className="text-xl font-extrabold title-gradient">{clientBrandName} • Operations & Data Normalizer</h2>
          <p className="text-xs text-muted mt-1">
            Reconciles messy raw exports (`01012024` $\rightarrow$ `01/01/2024`, untrimmed strings, raw digits) into one clear executive view.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!cleaningDone ? (
            <button onClick={cleanData} disabled={isCleaning} className="btn btn-accent shadow-lg shadow-amber-500/20">
              <Wand2 className="w-4 h-4" />
              {isCleaning ? 'Normalizing Records...' : 'Execute Auto Data Normalization'}
            </button>
          ) : (
            <button onClick={resetData} className="btn btn-secondary text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Raw Messy Export
            </button>
          )}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid-3">
        <div className="glass-panel border-l-4 border-l-emerald-400 shadow-xl">
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Cleaned Total Revenue</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${totalRevenue ? totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '11,110.50'}
          </div>
          <div className="text-[11px] text-muted mt-0.5">5 active accounts reconciled</div>
        </div>

        <div className="glass-panel border-l-4 border-l-rose-400 shadow-xl">
          <div className="text-xs text-muted font-bold uppercase tracking-wider">Overdue Aging Accounts</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            ${overdueAmount ? overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '3,810.50'}
          </div>
          <div className="text-[11px] text-rose-300 mt-0.5 font-bold">{overdueCount} accounts requiring follow-up</div>
        </div>

        {/* Interactive Target Goal Card */}
        <div className="glass-panel border-l-4 border-l-cyan-400 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-bold uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" /> Revenue Target Pace:
            </span>
            <span className="font-mono font-bold text-cyan-300">{targetPct}% of Goal</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 border border-white/10 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-500 shadow-glow"
              style={{ width: `${targetPct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Monthly Target Goal:</span>
            <input 
              type="number" 
              step="1000"
              value={monthlyTargetGoal}
              onChange={e => setMonthlyTargetGoal(Number(e.target.value))}
              className="bg-slate-950 text-cyan-400 font-mono font-bold w-20 text-right px-1.5 py-0.5 rounded border border-white/10 outline-none text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel space-y-4">
        
        {/* Table Search & Filters */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search customer or company..."
              className="input-field pl-9 text-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted flex items-center gap-1 font-bold">
              <Filter className="w-3.5 h-3.5" /> Status Filter:
            </span>
            <select className="select-field text-xs py-1.5 font-semibold" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-white/15 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 font-bold border-b border-white/15 uppercase tracking-wider text-[11px]">
                <th className="p-3">Record ID</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Invoice Date</th>
                <th className="p-3">Amount ($)</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Data Quality Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/70 font-mono">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-900/70 transition-colors">
                  <td className="p-3 text-slate-400 font-bold">#{item.id}</td>
                  
                  <td className="p-3">
                    {item.isCleaned ? (
                      <span className="text-main font-sans font-bold">{item.cleanCustomer}</span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        "{item.rawCustomer}"
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {item.isCleaned ? (
                      <span className="text-cyan-400 font-bold">{item.cleanDate}</span>
                    ) : (
                      <span className="text-slate-400">{item.rawDate}</span>
                    )}
                  </td>

                  <td className="p-3 font-black">
                    {item.isCleaned ? (
                      <span className="text-emerald-400">${item.cleanAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    ) : (
                      <span className="text-slate-400">{item.rawAmount}</span>
                    )}
                  </td>

                  <td className="p-3">
                    {item.isCleaned ? (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-sans font-extrabold uppercase ${
                        item.cleanStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm' :
                        item.cleanStatus === 'Overdue' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      }`}>
                        {item.cleanStatus}
                      </span>
                    ) : (
                      <span className="text-slate-400 uppercase">{item.rawStatus}</span>
                    )}
                  </td>

                  <td className="p-3 font-sans font-medium">
                    {item.isCleaned ? (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Parsed & Validated
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[11px] flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Needs Normalization
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

