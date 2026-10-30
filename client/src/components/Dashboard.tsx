import React, { useState } from 'react';
import {
  ShieldCheck,
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
  LogOut,
  FileUp,
  Megaphone,
} from 'lucide-react';
import RegulatoryAlertWidget from './RegulatoryAlertWidget';
import RegulatoryAdmin from './RegulatoryAdmin';

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

export const Dashboard: React.FC<DashboardProps> = ({
  onLogout,
  userEmail = 'finance.officer@iit-delhi.ac.in',
}) => {
  // Modal for Phase 4 Regulatory Admin Console
  const [showRegulatoryAdmin, setShowRegulatoryAdmin] = useState(false);

  // Legacy PDF Form State
  const [legacyFDRNumber, setLegacyFDRNumber] = useState('FDR-2023-MAN-7721');
  const [legacyBank, setLegacyBank] = useState('Punjab National Bank');
  const [legacyAmount, setLegacyAmount] = useState('5000000');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [legacySubmitted, setLegacySubmitted] = useState(false);

  // Account Aggregator (AA) State Machine: 1 = Idle, 2 = Loading, 3 = Verified
  const [aaState, setAaState] = useState<'idle' | 'loading' | 'verified'>('idle');
  const [aaStep, setAaStep] = useState<number>(1);
  const [verifiedData, setVerifiedData] = useState<VerifiedFDRData | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Initiate AA verification state-machine flow
  const handleInitiateAA = () => {
    setAaState('loading');
    setAaStep(1);

    setTimeout(() => {
      setAaStep(2);
      setTimeout(() => {
        setAaStep(3);
        setTimeout(() => {
          setAaStep(4);
          setTimeout(() => {
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
                'c24453cec19c63d59d1cb3a6cd1ad11043a16e3fdbbca1711dc722ddd955836e',
              cbsReference: 'CBS-TXN-SBI-99210-ENCRYPTED',
              timestamp: new Date().toLocaleTimeString(),
            });
            setAaState('verified');
          }, 800);
        }, 800);
      }, 800);
    }, 700);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top National Tricolor Indicator Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Solid NIC Blue Government Header */}
      <header className="bg-nicBlue text-white border-b border-nicBlueDark sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-sm bg-white text-nicBlue flex flex-col items-center justify-center font-bold text-xs tracking-tighter shrink-0">
              <span className="text-[11px] leading-tight font-black">AICTE</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                  Institutional Security Deposit Repository
                </span>
                <span className="text-[10px] font-mono uppercase bg-nicBlueDark px-2 py-0.5 rounded-sm border border-blue-400/40 text-blue-100">
                  Zero Trust • NIC Enterprise
                </span>
              </div>
              <p className="text-[11px] text-blue-100 hidden sm:block">
                All India Council for Technical Education • Statutory Fixed Deposit Management System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{userEmail}</span>
              <span className="text-[11px] text-blue-200 font-mono">
                Perm ID: 1-938491028 • Jurisdiction: Northern
              </span>
            </div>

            <button
              onClick={() => setShowRegulatoryAdmin(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-white text-nicBlue hover:bg-slate-100 border border-transparent shadow-sm transition-colors"
              title="Open AICTE Regulatory Console (Authority Mode)"
            >
              <Megaphone className="w-3.5 h-3.5 text-nicBlue" />
              <span>AICTE Policy Console</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-medium text-white bg-nicBlueDark hover:bg-[#072445] border border-blue-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Institution Authority Ribbon */}
        <section className="bg-white border border-slate-300 rounded-sm p-5 shadow-sm text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-sm bg-slate-100 border border-slate-300 text-nicBlue shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    National Institute of Technology & Advanced Technology
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] rounded-sm bg-green-100 text-green-800 border border-green-300 font-semibold uppercase">
                    Affiliated
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Mandatory Endowment Security Deposit: <span className="font-mono font-bold text-slate-900">₹50,00,000.00</span> • Statutory Validity: 5 Years • Region: Northern
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Lien Status</span>
                <span className="text-green-700 font-bold flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Enforced</span>
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Time-Lock Seal</span>
                <span className="text-nicBlue font-mono font-bold flex items-center space-x-1 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>HMAC-SHA256</span>
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Maturity Cron</span>
                <span className="text-slate-800 font-bold flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Daily 00:00</span>
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                <span className="text-slate-500 text-[11px] block uppercase font-semibold">Bank Rail</span>
                <span className="text-nicBlue font-bold block mt-0.5">
                  Setu AA (Live FIP)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Layout: Left = Legacy Upload | Right = Zero-Trust Bank Fetch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-left">
          
          {/* ======================================================== */}
          {/* LEFT PANEL: LEGACY PDF UPLOAD FORM                        */}
          {/* ======================================================== */}
          <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
            {/* Regulatory Alert Widget Interrupting Workflow at Top */}
            <RegulatoryAlertWidget
              institutionName="National Institute of Technology & Advanced Technology"
              region="Northern Jurisdiction"
            />

            <div>
              {/* Panel Header */}
              <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Legacy Manual Submission
                  </h3>
                  <p className="text-xs text-slate-500">
                    Traditional Scanned PDF Document Queue
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-300">
                  Manual Audit Queue
                </span>
              </div>

              {/* Warning Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 space-y-1 mb-4">
                <div className="flex items-center space-x-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Vulnerability & Verification Bottleneck Advisory</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Requires 15–30 days for AICTE regional verification letters to be delivered to bank branches. No cryptographic tamper-proof guarantee; susceptible to forged seals or unauthorized encashment.
                </p>
              </div>

              {/* Strict Form */}
              <form onSubmit={handleLegacySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Fixed Deposit Receipt (FDR) Number
                  </label>
                  <input
                    type="text"
                    value={legacyFDRNumber}
                    onChange={(e) => setLegacyFDRNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-nicBlue focus:border-nicBlue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Issuing Bank
                    </label>
                    <input
                      type="text"
                      value={legacyBank}
                      onChange={(e) => setLegacyBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-nicBlue focus:border-nicBlue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Principal Amount (INR)
                    </label>
                    <input
                      type="number"
                      value={legacyAmount}
                      onChange={(e) => setLegacyAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-nicBlue focus:border-nicBlue"
                    />
                  </div>
                </div>

                {/* File Attachment Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Scanned FDR Certificate (.PDF)
                  </label>
                  <div className="border border-slate-300 bg-slate-50 rounded-sm p-4 text-center">
                    <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-700 font-medium">
                      {selectedFile ? selectedFile.name : 'Select scanned FDR certificate document'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Must bear branch manager rubber stamp and signature (Max 15MB)
                    </p>
                    <input
                      type="file"
                      id="fdr-file-input"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <label
                      htmlFor="fdr-file-input"
                      className="mt-2.5 inline-block px-3 py-1 rounded-sm bg-white hover:bg-slate-100 text-xs text-slate-700 font-semibold border border-slate-300 cursor-pointer shadow-sm transition-colors"
                    >
                      Browse Document
                    </label>
                  </div>
                </div>

                {legacySubmitted && (
                  <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-sm">
                    ⚠️ Submission queued. Record marked as <code className="font-mono font-bold">PENDING_VERIFICATION</code>. Physical verification dispatched.
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-sm bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Submit Document to Manual Inspection Queue</span>
                </button>
              </form>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: ZERO-TRUST BANK FETCH (ACCOUNT AGGREGATOR)  */}
          {/* ======================================================== */}
          <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Panel Header */}
              <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-nicBlue">
                    Zero-Trust Bank Fetch (Account Aggregator)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct Core Banking System (CBS) Ledger Verification
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-sm bg-green-100 text-green-800 border border-green-300">
                  RBI Regulated AA Rails
                </span>
              </div>

              {/* State 1: Idle (Ready to initiate) */}
              {aaState === 'idle' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-300 rounded-sm p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-nicBlue font-bold text-xs uppercase tracking-wider">
                      <Landmark className="w-4 h-4" />
                      <span>Direct Banking Interface via Setu FIP</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Fetches institutional deposit balances directly from partner bank CBS via digital consent. Automatically mints an immutable HMAC-SHA256 time-lock signature to prevent premature liquidation before maturity.
                    </p>
                  </div>

                  <div className="text-center py-6 border border-dashed border-slate-300 rounded-sm bg-slate-50 space-y-3">
                    <Landmark className="w-10 h-10 text-nicBlue mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        No Fixed Deposit Linked Yet
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                        Initiate electronic consent via Setu AA to authenticate principal balance and register the statutory AICTE lien.
                      </p>
                    </div>

                    <button
                      id="trigger-aa-fetch-btn"
                      onClick={handleInitiateAA}
                      className="py-3 px-6 rounded-sm bg-nicBlue hover:bg-nicBlueDark text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors inline-flex items-center space-x-2"
                    >
                      <span>Initiate Account Aggregator Verification</span>
                    </button>
                  </div>
                </div>
              )}

              {/* State 2: Loading State (Sequential steps with animate-pulse) */}
              {aaState === 'loading' && (
                <div className="border border-slate-300 rounded-sm p-5 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-nicBlue border-b border-slate-200 pb-2.5">
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-nicBlue" />
                      <span>Interrogating RBI Account Aggregator FIP Network...</span>
                    </span>
                    <span className="font-mono text-slate-600">Step {aaStep} of 4</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div
                      className={`p-2.5 rounded-sm border ${
                        aaStep >= 1
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={`flex items-center space-x-2 ${aaStep === 1 ? 'animate-pulse' : ''}`}>
                        <span className="font-mono text-[11px] font-bold">1.</span>
                        <span>Verifying Consent Artifact (Setu AA)...</span>
                      </div>
                    </div>

                    <div
                      className={`p-2.5 rounded-sm border ${
                        aaStep >= 2
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={`flex items-center space-x-2 ${aaStep === 2 ? 'animate-pulse' : ''}`}>
                        <span className="font-mono text-[11px] font-bold">2.</span>
                        <span>Querying Core Banking System (State Bank of India)...</span>
                      </div>
                    </div>

                    <div
                      className={`p-2.5 rounded-sm border ${
                        aaStep >= 3
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={`flex items-center space-x-2 ${aaStep === 3 ? 'animate-pulse' : ''}`}>
                        <span className="font-mono text-[11px] font-bold">3.</span>
                        <span>Enforcing AICTE Statutory Joint Lien Hold...</span>
                      </div>
                    </div>

                    <div
                      className={`p-2.5 rounded-sm border ${
                        aaStep >= 4
                          ? 'bg-green-50 border-green-300 text-green-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={`flex items-center space-x-2 ${aaStep === 4 ? 'animate-pulse' : ''}`}>
                        <span className="font-mono text-[11px] font-bold">4.</span>
                        <span>Minting Cryptographic SHA-256 HMAC Time-Lock Seal...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* State 3: Verified Crisp Certificate Table */}
              {aaState === 'verified' && verifiedData && (
                <div className="space-y-4">
                  <div className="border-l-4 border-green-600 bg-green-50 border-t border-r border-b border-slate-300 rounded-sm p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-green-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-700" />
                        <div>
                          <span className="text-xs font-bold uppercase text-green-950 block">
                            Core Banking Verification Confirmed
                          </span>
                          <span className="text-[11px] text-green-800">
                            Verified at {verifiedData.timestamp} • Source: {verifiedData.verificationSource}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-green-100 text-green-800 border border-green-400">
                        STATUS: ACTIVE
                      </span>
                    </div>

                    {/* Certificate Table */}
                    <div className="border border-slate-300 rounded-sm bg-white overflow-hidden text-xs">
                      <table className="w-full border-collapse">
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3 border-r border-slate-200">
                              Issuing Bank
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {verifiedData.bankName}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">
                              Branch Details
                            </td>
                            <td className="py-2 px-3 text-slate-800 text-[11px]">
                              {verifiedData.branchName}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">
                              FDR Number
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-nicBlue">
                              {verifiedData.fdrNumber}
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">
                              Principal Amount
                            </td>
                            <td className="py-2 px-3 font-mono font-black text-green-800 text-sm">
                              ₹{verifiedData.amount.toLocaleString('en-IN')}.00
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">
                              Lien Beneficiary
                            </td>
                            <td className="py-2 px-3 font-semibold text-green-800 flex items-center space-x-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                              <span>{verifiedData.lienBeneficiary}</span>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">
                              Maturity Date
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-900">
                              {verifiedData.maturityDate} (Statutory 5-Year Tenure)
                            </td>
                          </tr>

                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">
                              Consent Artifact
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                              {verifiedData.consentId}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Cryptographic Hash Monospace Block */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                          <Lock className="w-3.5 h-3.5 text-nicBlue" />
                          <span>HMAC-SHA256 Cryptographic Time-Lock Seal</span>
                        </span>
                        <button
                          onClick={() => handleCopyHash(verifiedData.cryptographicLockHash)}
                          className="flex items-center space-x-1 text-[11px] text-nicBlue hover:underline font-semibold"
                        >
                          {copiedHash ? (
                            <>
                              <Check className="w-3 h-3 text-green-700" />
                              <span className="text-green-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Hash</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-sm bg-slate-100 border border-slate-300 font-mono text-[11px] text-slate-900 break-all select-all">
                        {verifiedData.cryptographicLockHash}
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1">
                        Protected by <code className="font-mono text-slate-700 font-semibold">process.env.CRYPTO_SECRET_SALT</code>. Early status release prior to maturity date enforces an automated 403 Security Breach.
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleInitiateAA}
                        className="text-xs font-semibold text-nicBlue hover:underline flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-Verify Ledger</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Panel Metadata */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>National Informatics Centre (NIC) Gateway</span>
              <span className="font-mono">Setu AA FIP API v2.4</span>
            </div>
          </div>
        </div>

        {/* Enterprise Bottom Specifications Strip */}
        <section className="bg-white border border-slate-300 rounded-sm p-4 text-xs text-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-nicBlue" />
              <span>Cryptographic Time-Lock</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every deposit receives an HMAC-SHA256 signature calculated from the FDR record UUID and maturity date. Any status transition to RELEASED prior to maturity triggers an immediate 403 Security Breach exception.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-nicBlue" />
              <span>Account Aggregator Rails</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Automated consent flow through Setu AA. Asynchronous webhooks at <code className="text-nicBlue font-mono">/api/webhooks/setu</code> mark records as ACTIVE with verified institutional lien status.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-nicBlue" />
              <span>Automated Maturity Cron</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Daily midnight cron job (<code className="text-slate-800 font-mono">0 0 * * *</code>) monitors FDRs within 30 days of expiry and flags deposits within 5 days as RENEWAL_REQUIRED.
            </p>
          </div>
        </section>
      </main>

      {/* Phase 4 Regulatory Admin Modal */}
      {showRegulatoryAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-none animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <RegulatoryAdmin onClose={() => setShowRegulatoryAdmin(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
