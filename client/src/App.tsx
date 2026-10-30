import React, { useState } from 'react';
import {
  Landmark,
  Lock,
  FileCheck2,
  AlertCircle,
  Building2,
  LogIn,
  X,
  ExternalLink,
} from 'lucide-react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Verifying institutional credentials with AICTE Single Sign-On...');
    setTimeout(() => {
      setStatusMessage('Authentication successful. Loading portal repository...');
      setTimeout(() => {
        setShowLoginModal(false);
        setStatusMessage(null);
        setIsAuthenticated(true);
      }, 500);
    }, 500);
  };

  const handleDirectDemoAccess = (roleEmail = 'finance.officer@iit-delhi.ac.in') => {
    setEmail(roleEmail);
    setShowLoginModal(false);
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return (
      <Dashboard
        onLogout={() => setIsAuthenticated(false)}
        userEmail={email || 'finance.officer@iit-delhi.ac.in'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top National Tricolor Indicator Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Classic Government Header */}
      <header className="bg-white border-b border-slate-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & National Authority Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 rounded-sm bg-nicBlue text-white flex flex-col items-center justify-center font-bold text-xs tracking-tighter shadow-sm border border-nicBlueDark shrink-0">
              <span className="text-[13px] leading-tight font-black">AICTE</span>
              <span className="text-[9px] uppercase tracking-normal font-medium">India</span>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                Ministry of Education • Government of India
              </div>
              <h1 className="text-base sm:text-lg font-bold text-nicBlue leading-tight tracking-tight">
                All India Council for Technical Education
              </h1>
              <div className="text-xs text-slate-600 font-medium">
                Central Security Deposit & FDR Management Portal (Zero-Trust)
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleDirectDemoAccess()}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <span>Institution Vault Demo</span>
            </button>

            <button
              id="header-login-btn"
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-sm text-xs font-bold text-white bg-nicBlue hover:bg-nicBlueDark border border-nicBlueDark shadow-sm transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Officer Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Official Advisory Banner */}
      <aside aria-label="Official Notification" className="bg-amber-50 border-b border-amber-200 text-amber-900 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>STATUTORY NOTICE:</strong> All technical institutions must verify existing joint FDR records under APH Clause 14 before the annual approval deadline.
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-amber-800">
            AICTE-REF: 2026/FDR-MANDATE
          </span>
        </div>
      </aside>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
        {/* Authoritative Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <Building2 className="w-3.5 h-3.5 text-nicBlue" />
          <span>Statutory Institutional Compliance Repository</span>
        </div>

        {/* Hero Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          AICTE Institutional Fixed Deposit & Security Deposit Repository
        </h2>

        {/* Hero Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          National platform for cryptographically sealed security deposit management, automated Core Banking System (CBS) lien verification via the RBI Account Aggregator network, and statutory regulatory compliance.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            id="hero-login-button"
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-nicBlue hover:bg-nicBlueDark text-white font-bold text-sm shadow-sm border border-nicBlueDark transition-colors flex items-center justify-center space-x-2"
          >
            <span>Login to AICTE Portal</span>
            <LogIn className="w-4 h-4" />
          </button>

          <button
            id="hero-demo-button"
            onClick={() => handleDirectDemoAccess()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-white hover:bg-slate-100 text-nicBlue font-bold text-sm border border-slate-300 shadow-sm transition-colors flex items-center justify-center space-x-2"
          >
            <span>Enter Institutional Demo Vault</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Enterprise Metrics Bar */}
        <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="bg-white border border-slate-300 rounded-sm p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Affiliated Institutions
            </span>
            <span className="text-2xl font-black text-nicBlue font-mono mt-1 block">12,480+</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Approved Pan-India</span>
          </div>

          <div className="bg-white border border-slate-300 rounded-sm p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Enforced Joint Liens
            </span>
            <span className="text-2xl font-black text-green-700 font-mono mt-1 block">100%</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">CBS Direct Verification</span>
          </div>

          <div className="bg-white border border-slate-300 rounded-sm p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Security Guarantee
            </span>
            <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">HMAC-SHA256</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Cryptographic Time-Lock</span>
          </div>

          <div className="bg-white border border-slate-300 rounded-sm p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Maturity Inspection
            </span>
            <span className="text-2xl font-black text-nicBlue font-mono mt-1 block">Daily 00:00</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Automated Cron Audits</span>
          </div>
        </div>

        {/* Feature Cards: Stark White, 1px Border, Left-Aligned Text, Blue Icons */}
        <section aria-label="Key Core Architecture" className="mt-12 w-full">
          <div className="text-left mb-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Key Core Architecture
            </h3>
            <p className="text-xs text-slate-600">
              National Informatics Centre (NIC) and AICTE Joint Zero-Trust Compliance Specification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Card 1 */}
            <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-sm hover:border-nicBlue transition-colors">
              <div className="p-2.5 rounded-sm bg-slate-100 text-nicBlue w-fit mb-4 border border-slate-200">
                <Landmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Account Aggregator (Setu) CBS Rails
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connects directly to partner bank Core Banking Systems via RBI-regulated Account Aggregators. Eliminates physical branch letter dispatches, paper receipt manipulation, and postal verification delays.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-sm hover:border-nicBlue transition-colors">
              <div className="p-2.5 rounded-sm bg-slate-100 text-nicBlue w-fit mb-4 border border-slate-200">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Cryptographic Time-Lock Seal
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every fixed deposit is cryptographically signed using SHA-256 HMAC derived from the record UUID and statutory maturity date. Attempted premature status release prior to maturity enforces an immediate 403 Security Breach lock.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-sm hover:border-nicBlue transition-colors">
              <div className="p-2.5 rounded-sm bg-slate-100 text-nicBlue w-fit mb-4 border border-slate-200">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Active Regulatory Policy Engine
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Promulgates statutory gazetted updates dynamically across regions. Interrupts institution workflows with high-priority compliance mandates and routes supplementary FDR responses to the AICTE Central Scrutiny Committee.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Strict Enterprise Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-none">
          <div className="bg-white border border-slate-300 rounded-sm w-full max-w-md p-6 shadow-md relative text-left">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3 mb-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                AICTE Secure Access Portal
              </div>
              <h3 className="text-lg font-bold text-nicBlue">Officer / Institutional Login</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Enter your registered AICTE Permanent ID or official institutional email.
              </p>
            </div>

            {statusMessage && (
              <div className="mb-4 p-3 rounded-sm bg-blue-50 border border-blue-300 text-blue-900 text-xs">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Official Email / AICTE Permanent ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="finance.officer@institution.edu.in"
                  className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-nicBlue focus:border-nicBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-nicBlue focus:border-nicBlue"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-sm bg-nicBlue hover:bg-nicBlueDark text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
                >
                  Authenticate Session
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectDemoAccess()}
                  className="w-full py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
                >
                  Quick Demo Access (IIT / NIT Officer View)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classic Enterprise Government Footer */}
      <footer className="bg-slate-900 text-slate-300 py-6 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <div>
            All India Council for Technical Education (AICTE), Nelson Mandela Marg, Vasant Kunj, New Delhi-110070
          </div>
          <div className="text-[11px] text-slate-500">
            Designed, Developed and Hosted by National Informatics Centre (NIC) • Government of India
          </div>
        </div>
      </footer>
    </div>
  );
}
