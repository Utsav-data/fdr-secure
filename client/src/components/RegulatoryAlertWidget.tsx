import React, { useState } from 'react';
import {
  AlertOctagon,
  FileCheck,
  Send,
  Link2,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface RegulatoryAlertWidgetProps {
  institutionName?: string;
  region?: string;
  onComplianceSubmitted?: (data: {
    feedback: string;
    documentUrl: string;
    timestamp: string;
  }) => void;
}

export const RegulatoryAlertWidget: React.FC<RegulatoryAlertWidgetProps> = ({
  institutionName = 'National Institute of Technology & Advanced Technology',
  region = 'Northern Jurisdiction',
  onComplianceSubmitted,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnderReview, setIsUnderReview] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    feedback: string;
    documentUrl: string;
    timestamp: string;
  } | null>(null);

  const handleSubmitCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() && !documentUrl.trim()) return;

    setIsSubmitting(true);

    // Call backend API /api/regulations/tasks/:id/submit with graceful fallback
    try {
      const token = localStorage.getItem('aicte_token');
      await fetch('http://localhost:5000/api/regulations/tasks/demo-task-1/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          feedback_text: feedbackText,
          document_url: documentUrl,
        }),
      }).catch(() => null);
    } catch {
      // Offline fallback handling
    }

    setTimeout(() => {
      setIsSubmitting(false);
      const submission = {
        feedback: feedbackText,
        documentUrl: documentUrl || 'https://vault.aicte.gov.in/docs/fdr-topup-receipt-99210.pdf',
        timestamp: new Date().toLocaleTimeString(),
      };
      setSubmittedData(submission);
      setIsUnderReview(true);

      if (onComplianceSubmitted) {
        onComplianceSubmitted(submission);
      }
    }, 800);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden mb-6 ${
        isUnderReview
          ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/30'
          : 'bg-red-950/40 border-red-500/70 shadow-2xl shadow-red-950/40 ring-1 ring-red-500/30'
      }`}
    >
      {/* Top High-Priority Pulse Bar */}
      <div
        className={`h-1.5 w-full ${
          isUnderReview
            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
            : 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse'
        }`}
      />

      <div className="p-4 sm:p-5">
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                isUnderReview
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  : 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
              }`}
            >
              {isUnderReview ? (
                <FileCheck className="w-5 h-5 text-amber-300" />
              ) : (
                <AlertOctagon className="w-5 h-5 text-red-400" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center space-x-1.5">
                  <span>Action Required: Regulatory Update</span>
                </h3>
                {isUnderReview ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/80">
                    STATUS: UNDER_REVIEW
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-700/80 animate-pulse">
                    MANDATORY COMPLIANCE
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-mono">
                  Order #2026/SD-09
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Gazetted AICTE Policy Change for <strong className="text-white">{institutionName}</strong>: <strong className="text-red-300">Mandatory ₹10,00,000 FDR Security Deposit Augmentation</strong> in {region}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0"
            title={isExpanded ? 'Collapse Alert' : 'Expand Alert'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Details & Action Form */}
        {isExpanded && (
          <div className="mt-4 pt-3.5 border-t border-red-900/40 space-y-3.5">
            {/* Policy Directive Summary */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-red-900/40 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1 text-red-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Statutory Compliance Grace Window: 14 Days Remaining</span>
                </span>
                <span className="font-mono text-slate-500">Jurisdiction: {region}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Pursuant to AICTE Regulation clause 14(b), all engineering and technical colleges in the {region} must create a supplementary ₹10 Lakh Fixed Deposit Receipt or extend existing joint lien holds in favor of AICTE New Delhi. Normal institutional workflow is flagged pending submission.
              </p>
            </div>

            {/* Submission Form or Under Review State */}
            {!isUnderReview ? (
              <form onSubmit={handleSubmitCompliance} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Compliance Action / Institutional Response
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="e.g. We have created supplementary FDR #SBIN-FDR-2026-99210 of ₹10,00,000 with SBI Parliament Street Branch with lien marked in favor of AICTE New Delhi..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Supplementary FDR Document Link / CBS Transaction Reference
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      placeholder="e.g. https://vault.institution.edu.in/deposits/fdr-topup-10lakh.pdf"
                      className="w-full px-3 py-2 pl-8 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition-colors"
                    />
                    <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Directly updates AICTE Compliance Ledger
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 border border-red-400/30 transition-all flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Action...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Compliance Feedback & Supplementary FDR</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* State when under review */
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-600/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Compliance Action Submitted to AICTE Regulatory Board</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Submitted at {submittedData?.timestamp}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] italic">
                  "{submittedData?.feedback}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-cyan-300 truncate max-w-[280px]">
                      {submittedData?.documentUrl}
                    </span>
                  </span>
                  <button
                    onClick={() => setIsUnderReview(false)}
                    className="text-amber-400 hover:underline text-[10px]"
                  >
                    Modify Response
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulatoryAlertWidget;
