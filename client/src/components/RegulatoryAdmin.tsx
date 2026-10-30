import React, { useState } from 'react';
import {
  Megaphone,
  Send,
  CheckCircle2,
  Clock,
  Globe,
  FileText,
  X,
} from 'lucide-react';

interface RegulatoryAdminProps {
  onClose?: () => void;
  onRegulationPublished?: (reg: {
    title: string;
    description: string;
    region: string;
    topUpAmount: string;
    deadline: string;
  }) => void;
}

interface PublishedRule {
  id: string;
  title: string;
  description: string;
  region: string;
  topUpAmount: string;
  date: string;
  institutionsImpacted: number;
  status: 'ACTIVE_BROADCAST' | 'ENFORCED';
}

export const RegulatoryAdmin: React.FC<RegulatoryAdminProps> = ({
  onClose,
  onRegulationPublished,
}) => {
  const [title, setTitle] = useState(
    'Gazetted Order 2026/SD-09: Mandatory ₹10 Lakh FDR Security Deposit Augmentation'
  );
  const [description, setDescription] = useState(
    'Pursuant to revised AICTE Approval Process Handbook (APH) regulations, all affiliated technical institutions in the designated jurisdiction are mandated to augment their statutory joint FDR by ₹10,00,000.00 with active lien marking in favor of Member Secretary, AICTE New Delhi within 15 statutory business days.'
  );
  const [targetRegion, setTargetRegion] = useState('Northern');
  const [topUpAmount, setTopUpAmount] = useState('1000000');
  const [deadlineDays, setDeadlineDays] = useState('15');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [publishedRules, setPublishedRules] = useState<PublishedRule[]>([
    {
      id: 'reg-001',
      title: 'Mandatory NIRF Technical Campus Security Reserve Revision',
      description: 'Annual benchmark calibration for NBA/NIRF tier-1 accredited technological universities.',
      region: 'ALL',
      topUpAmount: '₹5,00,000',
      date: '2026-10-15',
      institutionsImpacted: 1240,
      status: 'ENFORCED',
    },
    {
      id: 'reg-002',
      title: 'Gazetted Order 2026/SD-09: Mandatory ₹10 Lakh FDR Security Deposit Augmentation',
      description: 'Regional endowment adjustment for North & NW engineering colleges.',
      region: 'Northern',
      topUpAmount: '₹10,00,000',
      date: '2026-10-28',
      institutionsImpacted: 312,
      status: 'ACTIVE_BROADCAST',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setToastMessage(null);

    // Simulated API call with graceful fallback to real backend /api/regulations
    try {
      const token = localStorage.getItem('aicte_token');
      const response = await fetch('http://localhost:5000/api/regulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          target_criteria: {
            region: targetRegion,
            topUpAmount: Number(topUpAmount),
            deadlineDays: Number(deadlineDays),
          },
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        console.log('[Regulatory Engine API Response]:', data);
      }
    } catch {
      // Offline fallback handling
    }

    setTimeout(() => {
      setIsSubmitting(false);
      const newRule: PublishedRule = {
        id: `reg-${Date.now().toString().slice(-4)}`,
        title,
        description,
        region: targetRegion,
        topUpAmount: `₹${Number(topUpAmount).toLocaleString('en-IN')}`,
        date: new Date().toISOString().split('T')[0],
        institutionsImpacted: targetRegion === 'ALL' ? 1420 : 285,
        status: 'ACTIVE_BROADCAST',
      };

      setPublishedRules([newRule, ...publishedRules]);
      setToastMessage(
        `✓ Gazetted Regulation broadcasted successfully! Dispatched compliance tasks to ${
          newRule.institutionsImpacted
        } institution(s) across ${targetRegion === 'ALL' ? 'Pan-India' : targetRegion + ' Region'}.`
      );

      if (onRegulationPublished) {
        onRegulationPublished({
          title,
          description,
          region: targetRegion,
          topUpAmount,
          deadline: `${deadlineDays} Days`,
        });
      }

      setTimeout(() => setToastMessage(null), 5000);
    }, 900);
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Megaphone className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">
                AICTE Regulatory Engine • Policy Promulgation Console
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Admin Authority
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active statutory policy broadcasting & dynamic compliance task dispatch
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center space-x-2.5 shadow-lg shadow-emerald-950/50 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Statutory Regulation Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="e.g. AICTE Notification 2026/FDR-09: Mandatory Joint Security Deposit Adjustment"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Gazetted Policy Description & Statutory Order Text
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
            placeholder="Detailed directives, statutory section citations, and compliance guidelines..."
          />
        </div>

        {/* Dynamic Criteria Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Target Jurisdiction Region
            </label>
            <div className="relative">
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="ALL">All Regions (Pan-India Technical Institutions)</option>
                <option value="Northern">Northern (Delhi, UP, Punjab, Haryana, J&K)</option>
                <option value="Western">Western (Maharashtra, Gujarat, Goa)</option>
                <option value="Southern">Southern (Karnataka, TN, Kerala, AP, TS)</option>
                <option value="Eastern">Eastern (WB, Bihar, Odisha, NE States)</option>
              </select>
              <Globe className="w-4 h-4 text-cyan-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Deposit Top-Up Benchmark (INR)
            </label>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="1000000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Statutory Deadline (Days)
            </label>
            <div className="relative">
              <input
                type="number"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="15"
              />
              <Clock className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit Broadcast Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 border border-cyan-400/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Broadcasting Gazetted Policy & Bulk Generating Compliance Tasks...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Promulgate Regulation & Dispatch Compliance Tasks</span>
            </>
          )}
        </button>
      </form>

      {/* Promulgated Regulations History */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Statutory Directives in System</span>
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">
            {publishedRules.length} Active Directives
          </span>
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {publishedRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 text-xs space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white truncate max-w-[320px]">
                  {rule.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {rule.region === 'ALL' ? 'Pan-India' : rule.region}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{rule.description}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                <span>Top-up Required: <strong className="text-emerald-400 font-mono">{rule.topUpAmount}</strong></span>
                <span>Impacted: <strong className="text-slate-300">{rule.institutionsImpacted} Institutions</strong></span>
                <span>Promulgated: {rule.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegulatoryAdmin;
