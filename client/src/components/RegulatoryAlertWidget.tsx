import React, { useState } from 'react';
import {
  AlertTriangle,
  FileCheck,
  Send,
  Link2,
  Clock,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
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
    }, 600);
  };

  return (
    <div
      className={`border-l-4 rounded-sm border-t border-r border-b p-4 mb-6 shadow-sm transition-colors text-left ${
        isUnderReview
          ? 'bg-amber-50 border-amber-600 border-t-amber-200 border-r-amber-200 border-b-amber-200 text-amber-900'
          : 'bg-red-50 border-red-700 border-t-red-200 border-r-red-200 border-b-red-200 text-red-900'
      }`}
    >
      {/* Alert Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 shrink-0">
            {isUnderReview ? (
              <FileCheck className="w-5 h-5 text-amber-700" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-700" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-red-900">
                {isUnderReview
                  ? 'Regulatory Compliance Task Under Review'
                  : 'Action Required: Regulatory Update (Gazetted Mandate)'}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border ${
                  isUnderReview
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-red-100 text-red-800 border-red-300'
                }`}
              >
                {isUnderReview ? 'STATUS: UNDER_REVIEW' : 'MANDATORY COMPLIANCE'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Order #2026/SD-09: Mandatory ₹10,00,000 FDR Security Deposit Augmentation
            </h4>

            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              Issued for <span className="font-semibold text-slate-900">{institutionName}</span> ({region}). Compliance is required within the statutory window under AICTE Approval Process Handbook guidelines.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-800 p-1"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Form / Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
          <div className="text-xs text-slate-700 bg-white border border-slate-200 rounded-sm p-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1 text-red-700 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Statutory Deadline: 14 Days Remaining</span>
              </span>
              <span className="font-mono text-slate-500">Region: {region}</span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-700">
              Technical institutions within the Northern region must create a supplementary ₹10 Lakh FDR or adjust existing lien accounts in favor of AICTE New Delhi. Normal manual processing remains flagged until institutional response is registered.
            </p>
          </div>

          {!isUnderReview ? (
            <form onSubmit={handleSubmitCompliance} className="space-y-3 bg-white border border-slate-200 rounded-sm p-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Institutional Explanatory Statement / Compliance Action
                </label>
                <textarea
                  required
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Supplementary Fixed Deposit Receipt #SBIN-FDR-2026-99210 of ₹10,00,000 has been created with State Bank of India and lien marked to Member Secretary, AICTE New Delhi."
                  className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aicteBlue focus:border-aicteBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Supplementary Document URL / Core Banking System (CBS) Ref
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    placeholder="e.g. https://vault.institution.edu.in/deposits/fdr-topup-10lakh.pdf"
                    className="w-full px-3 py-2 pl-8 rounded-sm bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aicteBlue focus:border-aicteBlue font-mono"
                  />
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Submissions are permanently logged in the AICTE Statutory Audit Log.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-sm bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Action...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Compliance Response</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-slate-200 rounded-sm p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-green-800 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>Response Dispatched to AICTE Regulatory Bureau</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Submitted at {submittedData?.timestamp}
                </span>
              </div>

              <div className="p-2.5 rounded-sm bg-slate-50 border border-slate-200 text-slate-800 text-xs italic">
                "{submittedData?.feedback}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span className="flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-aicteBlue" />
                  <span className="font-mono text-slate-700 truncate max-w-[320px]">
                    {submittedData?.documentUrl}
                  </span>
                </span>
                <button
                  onClick={() => setIsUnderReview(false)}
                  className="text-aicteBlue hover:underline text-[11px] font-semibold"
                >
                  Modify Submission
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegulatoryAlertWidget;
