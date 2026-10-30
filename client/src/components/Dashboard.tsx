import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Building2,
  Landmark,
  Clock,
  Sparkles,
  LogOut,
  FileUp,
  Fingerprint,
  Zap,
  CheckCheck,
  Database,
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  userEmail?: string;
}

interface VerifiedFDRData {
  bankName: string;
  branchName: string;
  fdrNumber: string;
  amount: number;
  issueDate: string;
  maturityDate: string;
  lienStatus: string;
  lienBeneficiary: string;
  verificationSource: string;
  consentId: string;
  cryptographicLockHash: string;
  cbsReference: string;
  timestamp: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, userEmail = 'finance.officer@iit-delhi.ac.in' }) => {
  // Legacy PDF Form State
  const [legacyFDRNumber, setLegacyFDRNumber] = useState('FDR-2023-MAN-7721');
  const [legacyBank, setLegacyBank] = useState('Punjab National Bank');
  const [legacyAmount, setLegacyAmount] = useState('5000000');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [legacySubmitted, setLegacySubmitted] = useState(false);

  // Account Aggregator (AA) State
  const [isFetchingAA, setIsFetchingAA] = useState(false);
  const [aaStep, setAaStep] = useState<number>(0);
  const [verifiedData, setVerifiedData] = useState<VerifiedFDRData | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [webhookTriggered, setWebhookTriggered] = useState(false);

  // Simulated Account Aggregator Fetch
  const handleInitiateAAFetch = () => {
    setIsFetchingAA(true);
    setVerifiedData(null);
    setAaStep(1);

    setTimeout(() => {
      setAaStep(2);
      setTimeout(() => {
        setAaStep(3);
        setTimeout(() => {
          setAaStep(4);
          setTimeout(() => {
            setIsFetchingAA(false);
            setVerifiedData({
              bankName: 'State Bank of India',
              branchName: 'CAG Branch, Parliament Street, New Delhi (IFSC: SBIN0000691)',
              fdrNumber: 'SBIN-FDR-2026-9948201',
              amount: 5000000,
              issueDate: '2026-10-30',
              maturityDate: '2031-10-30',
              lienStatus: 'ACTIVE LIEN MARKED',
              lienBeneficiary: 'MEMBER SECRETARY, AICTE NEW DELHI',
              verificationSource: 'ACCOUNT_AGGREGATOR (Setu FIP Network)',
              consentId: `setu_consent_${Math.random().toString(36).substring(2, 12)}`,
              cryptographicLockHash:
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a02f6',
              cbsReference: 'CBS-TXN-SBI-99210-ENCRYPTED',
              timestamp: new Date().toLocaleTimeString(),
            });
          }, 800);
        }, 900);
      }, 900);
    }, 800);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleLegacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLegacySubmitted(true);
    setTimeout(() => setLegacySubmitted(false), 4000);
  };

  const handleSimulateWebhook = async () => {
    setWebhookTriggered(true);
    setTimeout(() => setWebhookTriggered(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Cyber-Gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[300px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              AICTE
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                  FDR Institutional Security Vault
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Phase 3 • Zero Trust
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Statutory Fixed Deposit Verification & Lien Monitoring System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{userEmail}</span>
              <span className="text-[11px] text-cyan-400 font-mono">
                AICTE Perm ID: 1-938491028 • Region: North-NW
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Return to Portal Home"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Exit Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Institutional Summary Ribbon */}
        <section className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-white">
                    National Institute of Technology & Advanced Technology
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold uppercase">
                    Affiliated
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mandatory AICTE Endowment / Joint FDR Requirement: <span className="text-slate-200 font-mono">₹50,00,000.00</span> • Statutory Validity: 5 Years
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span className="text-slate-400 text-[11px] block">Lien Status</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Enforced</span>
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span className="text-slate-400 text-[11px] block">Time-Lock Seal</span>
                <span className="text-cyan-400 font-mono font-semibold flex items-center space-x-1 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>HMAC-SHA256</span>
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span className="text-slate-400 text-[11px] block">Maturity Cron</span>
                <span className="text-purple-400 font-semibold flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Daily Midnight</span>
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                <span className="text-slate-400 text-[11px] block">AA Rail Status</span>
                <span className="text-blue-400 font-semibold flex items-center space-x-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Setu Live Mock</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* USP Architectural Comparison Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-cyan-300">Phase 3 Dual-Engine Architecture:</strong> Contrast the legacy manual paper/PDF workflow with the automated RBI Account Aggregator + Cryptographic Time-Lock verification engine.
            </span>
          </div>
          <button
            onClick={handleSimulateWebhook}
            className="shrink-0 flex items-center space-x-1 px-3 py-1 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-700/60 text-cyan-200 text-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{webhookTriggered ? 'Webhook Received ✓' : 'Simulate Setu Webhook'}</span>
          </button>
        </div>

        {/* SPLIT-SCREEN COMPARISON: Left = Legacy PDF Upload | Right = Zero-Trust Bank Fetch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* LEFT PANEL: LEGACY PDF UPLOAD FORM (Clunky, Manual, Risky) */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/90 p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Legacy Manual Submission</h2>
                  <p className="text-xs text-slate-400">Traditional PDF / Scanned Receipt Process</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>High Fraud Risk</span>
              </span>
            </div>

            {/* Pain Point Callouts */}
            <div className="space-y-2 mb-5">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Manual Verification Bottleneck:</strong> Requires 15–30 days for AICTE regional officers to send manual courier letters to bank branch managers.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Vulnerable to Forgery:</strong> No cryptographic seal. Institutions could submit doctored PDF scans while premature liquidation occurs at the bank.
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLegacySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Fixed Deposit Receipt (FDR) Number
                </label>
                <input
                  type="text"
                  value={legacyFDRNumber}
                  onChange={(e) => setLegacyFDRNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
                  placeholder="e.g. FDR-PNB-0029108"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Issuing Bank Name
                  </label>
                  <input
                    type="text"
                    value={legacyBank}
                    onChange={(e) => setLegacyBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Deposit Amount (INR)
                  </label>
                  <input
                    type="number"
                    value={legacyAmount}
                    onChange={(e) => setLegacyAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Scanned Physical FDR Document (.PDF)
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-5 text-center cursor-pointer bg-slate-950/50 transition-colors">
                  <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">
                    {selectedFile ? selectedFile.name : 'Click to select or drag scanned certificate PDF'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Requires manual rubber stamp from Branch Manager (Max 15MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    className="hidden"
                    id="legacy-file-input"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  />
                  <label
                    htmlFor="legacy-file-input"
                    className="mt-3 inline-block px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>
                </div>
              </div>

              {legacySubmitted && (
                <div className="p-3 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-200 text-xs">
                  ⚠️ PDF submitted into manual AICTE queue. Status set to <code className="font-mono bg-amber-900/80 px-1 py-0.5 rounded">PENDING_VERIFICATION</code>. Awaiting postal bank confirmation.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Submit to Manual AICTE Inspection Queue</span>
              </button>
            </form>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: ZERO-TRUST BANK FETCH (Account Aggregator)   */}
          {/* ======================================================== */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/30 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
            {/* Top Cyan Accent Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                    <Fingerprint className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center space-x-1.5">
                      <span>Zero-Trust Bank Fetch</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                        Setu AA
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      RBI-Regulated Account Aggregator & CBS Direct Fetch
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 shadow-sm shadow-emerald-950">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tamper-Proof Guarantee</span>
                </span>
              </div>

              {/* Technical Proposition */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Fetches institutional deposit balances directly from partner bank Core Banking Systems (CBS) via consent token. Applies an immutable <strong className="text-cyan-300 font-mono">HMAC-SHA256 Time-Lock</strong> signature preventing unauthorized liquidation prior to maturity.
              </p>

              {/* Trigger Button */}
              {!isFetchingAA && !verifiedData && (
                <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-3 mb-4">
                  <Landmark className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
                  <div>
                    <h3 className="text-sm font-bold text-white">No Deposit Linked in Vault</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Click below to request institutional signatory consent through Setu AA and stream live CBS balance with lien lock.
                    </p>
                  </div>

                  <button
                    id="trigger-aa-fetch-btn"
                    onClick={handleInitiateAAFetch}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 border border-cyan-400/40 transition-all flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4 text-cyan-200" />
                    <span>Initiate Zero-Trust Bank Fetch (Account Aggregator)</span>
                  </button>
                </div>
              )}

              {/* Fetching Stepper UI */}
              {isFetchingAA && (
                <div className="p-5 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-4 mb-4">
                  <div className="flex items-center justify-between text-xs text-cyan-300 font-medium">
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Contacting RBI Account Aggregator FIP Rails...</span>
                    </span>
                    <span className="font-mono">{aaStep}/4 Completed</span>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-2 text-xs">
                    <div
                      className={`p-2 rounded-lg flex items-center space-x-2 border ${
                        aaStep >= 1
                          ? 'bg-cyan-950/70 border-cyan-800 text-cyan-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      {aaStep >= 1 ? (
                        <CheckCheck className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                      <span>1. Issuing Setu AA Digital Consent Artifact (consent_id)</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg flex items-center space-x-2 border ${
                        aaStep >= 2
                          ? 'bg-cyan-950/70 border-cyan-800 text-cyan-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      {aaStep >= 2 ? (
                        <CheckCheck className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                      <span>2. Querying State Bank of India Core Banking System (CBS)</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg flex items-center space-x-2 border ${
                        aaStep >= 3
                          ? 'bg-cyan-950/70 border-cyan-800 text-cyan-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      {aaStep >= 3 ? (
                        <CheckCheck className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                      <span>3. Confirming Active AICTE Lien Marking & Balance (₹50,00,000)</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg flex items-center space-x-2 border ${
                        aaStep >= 4
                          ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      {aaStep >= 4 ? (
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                      <span>4. Minting Cryptographic SHA-256 HMAC Time-Lock Signature</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Result Card */}
              {verifiedData && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 relative">
                    {/* Live Verification Tag */}
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Direct Bank Verification Complete
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Verified at {verifiedData.timestamp} • Source: {verifiedData.verificationSource}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        STATUS: ACTIVE
                      </span>
                    </div>

                    {/* Core Deposit Data Table */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          Bank & CBS Branch
                        </span>
                        <span className="text-white font-medium">{verifiedData.bankName}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {verifiedData.branchName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          FDR Number (Verified)
                        </span>
                        <span className="font-mono text-cyan-300 font-semibold">
                          {verifiedData.fdrNumber}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          Principal Amount
                        </span>
                        <span className="text-emerald-400 font-mono font-bold text-sm">
                          ₹{verifiedData.amount.toLocaleString('en-IN')}.00
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          Statutory Lien Status
                        </span>
                        <span className="text-emerald-300 font-semibold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{verifiedData.lienStatus}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          Issue Date
                        </span>
                        <span className="text-slate-300 font-mono">{verifiedData.issueDate}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          Maturity Date (Locked)
                        </span>
                        <span className="text-slate-300 font-mono">{verifiedData.maturityDate}</span>
                      </div>
                    </div>

                    {/* Cryptographic Seal Display */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-cyan-400 flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-cyan-400" />
                          <span>HMAC-SHA256 Cryptographic Time-Lock Seal</span>
                        </span>
                        <button
                          onClick={() => handleCopyHash(verifiedData.cryptographicLockHash)}
                          className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedHash ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Hash</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300 break-all select-all">
                        {verifiedData.cryptographicLockHash}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        🔒 Sealed with <code className="text-cyan-400">process.env.CRYPTO_SECRET_SALT</code>. Early status release before maturity date triggers a 403 Security Breach.
                      </p>
                    </div>

                    {/* Consent ID & Actions */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                      <span className="font-mono truncate max-w-[200px]">
                        ID: {verifiedData.consentId}
                      </span>
                      <button
                        onClick={handleInitiateAAFetch}
                        className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-Verify Live</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Benefit Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero manual courier • Instant verification</span>
              </span>
              <span className="text-slate-500 font-mono">Setu AA Gateway v2.4</span>
            </div>
          </div>
        </div>

        {/* Phase 3 Architecture Footer Information Bar */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-slate-200 mb-1 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cryptographic Time-Lock</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every deposit receives an HMAC-SHA256 signature calculated from the FDR record ID and maturity date. Any status transition to RELEASED prior to maturity triggers a 403 Security Breach exception.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-1 flex items-center space-x-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
              <span>Account Aggregator Rails</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Automated consent flow through Setu AA. Asynchronous webhooks at <code className="text-cyan-400 font-mono">/api/webhooks/setu</code> mark records as ACTIVE with verified institutional lien status.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-1 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Automated Maturity Cron</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Daily midnight cron job (<code className="text-purple-300 font-mono">0 0 * * *</code>) monitors FDRs within 30 days of expiry and flags deposits within 5 days as RENEWAL_REQUIRED.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
