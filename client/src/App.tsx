import React, { useState } from 'react';
import {
  Landmark,
  Lock,
  Building2,
  LogIn,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import useScrollReveal from './hooks/useScrollReveal';
import heroBgImage from './assets/watermarked_img_7625952228657544422.png';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initialize native IntersectionObserver scroll-reveal transitions
  useScrollReveal([isAuthenticated]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Verifying institutional credentials with AICTE Single Sign-On...');
    setTimeout(() => {
      setStatusMessage('Authentication successful. Loading institutional repository...');
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
    <div className="min-h-screen bg-govNeutral text-slate-900 flex flex-col font-sans">
      {/* Top National Tricolor Indicator Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Top Institutional Utility Masthead */}
      <div className="bg-[#072749] text-slate-300 py-1.5 px-4 sm:px-6 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-200">भारत सरकार | Government of India</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">शिक्षा मंत्रालय | Ministry of Education</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center space-x-1">
              <Phone className="w-3 h-3 text-aicteYellow" />
              <span>Toll Free: 1800-11-3023</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">National Academic Depository (NAD)</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-aicteYellow font-semibold cursor-pointer">English / हिन्दी</span>
          </div>
        </div>
      </div>

      {/* Main White Institutional Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & National Authority Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 rounded-sm bg-aicteBlue text-white flex flex-col items-center justify-center font-bold text-xs tracking-tighter shadow-sm border border-aicteBlueDark shrink-0">
              <span className="text-[14px] leading-tight font-black">AICTE</span>
              <span className="text-[9px] uppercase tracking-normal font-medium text-aicteYellow">India</span>
            </div>

            <div>
              <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                Statutory Body Under Ministry of Education, Govt. of India
              </div>
              <h1 className="text-base sm:text-lg font-bold text-aicteBlue leading-tight tracking-tight">
                All India Council for Technical Education
              </h1>
              <div className="text-xs text-slate-600 font-medium">
                Central Security Deposit & FDR Management Portal (Zero-Trust)
              </div>
            </div>
          </div>

          {/* Navigation Links & Action Button */}
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex items-center space-x-5 text-xs font-semibold text-slate-700">
              <a href="#overview" className="hover:text-aicteBlue transition-colors">
                Portal Overview
              </a>
              <a href="#architecture" className="hover:text-aicteBlue transition-colors">
                Zero-Trust Engine
              </a>
              <a href="#regulations" className="hover:text-aicteBlue transition-colors">
                Statutory Mandates
              </a>
              <a href="#helpdesk" className="hover:text-aicteBlue transition-colors">
                Helpdesk
              </a>
            </nav>

            <button
              onClick={() => handleDirectDemoAccess()}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <span>Instant Vault Demo</span>
            </button>

            <button
              id="header-login-btn"
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-sm text-xs font-bold text-white bg-aicteBlue hover:bg-aicteBlueDark border border-aicteBlueDark shadow-sm transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-aicteYellow" />
              <span>Institutional Sign-In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Hero Banner with Architectural Background Image */}
      <section
        className="relative bg-cover bg-center border-b border-slate-300 overflow-hidden"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        {/* Deep Official AICTE Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3A6B]/95 via-[#0A3A6B]/85 to-[#0A3A6B]/60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 relative z-10 text-white text-left">
          {/* Official Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-aicteYellow/20 border border-aicteYellow/40 text-aicteYellow text-xs font-bold uppercase tracking-wider mb-5">
            <Building2 className="w-3.5 h-3.5" />
            <span>AICTE Approval Process Handbook (APH) Statutory Repository</span>
          </div>

          {/* Hero Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
            AICTE Security Deposit & FDR Management Portal - National Rollout
          </h2>

          {/* Hero Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-normal">
            Automating institutional endowment verification through zero-trust cryptographic time-locks, direct Core Banking System (CBS) joint lien synchronization via RBI-regulated Account Aggregators, and continuous compliance oversight.
          </p>

          {/* Two Flat Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="hero-login-button"
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-aicteYellow hover:bg-aicteYellowDark text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>Login to AICTE Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-demo-button"
              onClick={() => handleDirectDemoAccess()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-transparent hover:bg-white hover:text-aicteBlue text-white font-bold text-xs uppercase tracking-wider border-2 border-white transition-colors flex items-center justify-center space-x-2"
            >
              <span>Enter Institutional Vault Demo</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Core Matrix Row (Overlapping Stark White Feature/Stats Cards) */}
      <section className="-mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Card 1 */}
          <div className="bg-white border border-slate-300 rounded-sm p-5 shadow-sm hover:border-aicteBlue transition-colors scroll-reveal stagger-1">
            <div className="p-2 bg-slate-100 border border-slate-200 text-aicteBlue rounded-sm w-fit mb-3">
              <Lock className="w-5 h-5 text-aicteBlue" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Immutable Anti-Tamper
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Zero-Trust Security
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every fixed deposit is sealed with an HMAC-SHA256 signature. Early release triggers a strict 403 Security Breach.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-300 rounded-sm p-5 shadow-sm hover:border-aicteBlue transition-colors scroll-reveal stagger-2">
            <div className="p-2 bg-slate-100 border border-slate-200 text-aicteBlue rounded-sm w-fit mb-3">
              <Landmark className="w-5 h-5 text-aicteBlue" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Core Banking System
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              100% Verified AA Rails
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Automated consent flow directly interrogates partner bank CBS ledgers via RBI-regulated Setu Account Aggregators.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-300 rounded-sm p-5 shadow-sm hover:border-aicteBlue transition-colors scroll-reveal stagger-3">
            <div className="p-2 bg-slate-100 border border-slate-200 text-aicteBlue rounded-sm w-fit mb-3">
              <ShieldCheck className="w-5 h-5 text-green-700" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Statutory 5-Year Lock
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Enforced Joint Liens
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Active statutory lien hold recorded in favor of Member Secretary, AICTE New Delhi across all accredited branches.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-300 rounded-sm p-5 shadow-sm hover:border-aicteBlue transition-colors scroll-reveal stagger-4">
            <div className="p-2 bg-slate-100 border border-slate-200 text-aicteBlue rounded-sm w-fit mb-3">
              <Clock className="w-5 h-5 text-aicteBlue" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Daily Midnight Cron
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Automated Audits
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Continuous maturity inspection dispatches 30-day alerts and flags deposits within 5 days as RENEWAL_REQUIRED.
            </p>
          </div>
        </div>
      </section>

      {/* Alternating Content Section 1 (White Background): Statutory Mandate */}
      <section id="overview" className="bg-white py-16 px-4 sm:px-6 mt-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-left">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-aicteBlue">
              Section 01 • Institutional Mandates
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              AICTE Approval Process Handbook (APH) Statutory Regulations
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Statutory framework governing security deposits, joint fixed deposit accounts, and endowment reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-govNeutral border border-slate-200 rounded-sm p-6 scroll-reveal stagger-1">
              <div className="flex items-center space-x-2 text-aicteBlue font-bold text-sm mb-2">
                <FileText className="w-4 h-4" />
                <span>Clause 14: Joint FDR Creation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandates all affiliated technical institutions, engineering universities, and polytechnics to create joint FDRs in favor of Member Secretary, AICTE New Delhi for the prescribed statutory term.
              </p>
            </div>

            <div className="bg-govNeutral border border-slate-200 rounded-sm p-6 scroll-reveal stagger-2">
              <div className="flex items-center space-x-2 text-aicteBlue font-bold text-sm mb-2">
                <Landmark className="w-4 h-4" />
                <span>Direct Banking Ledger Integration</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eliminates forged bank guarantee certificates, postal delays, and manual courier verifications by establishing electronic Account Aggregator connectivity to commercial bank core systems.
              </p>
            </div>

            <div className="bg-govNeutral border border-slate-200 rounded-sm p-6 scroll-reveal stagger-3">
              <div className="flex items-center space-x-2 text-aicteBlue font-bold text-sm mb-2">
                <BadgeAlert className="w-4 h-4 text-red-700" />
                <span>Dynamic Policy Promulgation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allows AICTE Central Directorate to enact gazetted endowment augmentations across designated regions and automatically generate compliance tasks for institutional finance officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Content Section 2 (GovNeutral Background): Architectural Comparison */}
      <section id="architecture" className="bg-govNeutral py-16 px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-left">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-aicteBlue">
              Section 02 • Enterprise Architecture
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Comparative Analysis: Legacy Manual Verification vs Zero-Trust Bank Fetch
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Transformation from physical paper-bound workflows to cryptographically sealed electronic banking rails.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legacy Column */}
            <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-sm scroll-reveal stagger-1">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Legacy Document Upload (Paper PDF)
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-300">
                  High Operational Friction
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span><strong>15–30 Days Delay:</strong> Requires postal courier letters sent to branch managers.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span><strong>Tamper Vulnerability:</strong> Lack of cryptographic seal allows scanned PDF manipulation.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span><strong>No Real-Time Lien Sync:</strong> Unauthorized early encashments go undetected at AICTE.</span>
                </li>
              </ul>
            </div>

            {/* Zero-Trust Column */}
            <div className="bg-white border-l-4 border-l-green-600 border border-slate-300 rounded-sm p-6 shadow-sm scroll-reveal stagger-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-aicteBlue">
                  Zero-Trust Bank Fetch (Setu AA)
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-green-100 text-green-800 border border-green-300">
                  RBI Regulated Standard
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Instant Ledger Verification:</strong> Direct Core Banking System fetch in seconds.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>HMAC-SHA256 Time-Lock:</strong> Cryptographic seal prevents early status release.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Automated Maturity Cron:</strong> Daily midnight inspection prevents compliance lapses.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Content Section 3 (White Background): Regional Jurisdictions */}
      <section id="regulations" className="bg-white py-16 px-4 sm:px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-left">
          <div className="border-b border-slate-200 pb-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-aicteBlue">
              Section 03 • Pan-India Coverage
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Jurisdictional Oversight & Regional Directorates
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Active statutory coverage across all 8 AICTE Regional Offices.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-govNeutral border border-slate-200 rounded-sm p-4 scroll-reveal stagger-1">
              <span className="font-bold text-slate-900 block text-sm">Northern Region</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Campuses: Delhi, UP, Punjab, Haryana, J&K</span>
              <span className="font-mono text-aicteBlue font-bold block mt-2">3,120 Institutions</span>
            </div>

            <div className="bg-govNeutral border border-slate-200 rounded-sm p-4 scroll-reveal stagger-2">
              <span className="font-bold text-slate-900 block text-sm">Western Region</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Campuses: Maharashtra, Gujarat, Goa</span>
              <span className="font-mono text-aicteBlue font-bold block mt-2">2,840 Institutions</span>
            </div>

            <div className="bg-govNeutral border border-slate-200 rounded-sm p-4 scroll-reveal stagger-3">
              <span className="font-bold text-slate-900 block text-sm">Southern Region</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Campuses: TN, Karnataka, Kerala, AP, TS</span>
              <span className="font-mono text-aicteBlue font-bold block mt-2">4,450 Institutions</span>
            </div>

            <div className="bg-govNeutral border border-slate-200 rounded-sm p-4 scroll-reveal stagger-4">
              <span className="font-bold text-slate-900 block text-sm">Eastern Region</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Campuses: WB, Bihar, Odisha, NE States</span>
              <span className="font-mono text-aicteBlue font-bold block mt-2">2,070 Institutions</span>
            </div>
          </div>
        </div>
      </section>

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
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                AICTE Secure Single Sign-On
              </div>
              <h3 className="text-lg font-bold text-aicteBlue">Institutional Sign-In</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Enter your institutional AICTE Permanent ID or registered officer credentials.
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
                  className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-aicteBlue focus:border-aicteBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-aicteBlue focus:border-aicteBlue"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-sm bg-aicteBlue hover:bg-aicteBlueDark text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
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

      {/* Dark aicteBlue Footer with Saffron Border Top */}
      <footer id="helpdesk" className="bg-aicteBlue text-slate-200 border-t-4 border-aicteYellow py-12 px-4 sm:px-6 text-xs text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-blue-900">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-8 w-8 rounded-sm bg-white text-aicteBlue flex items-center justify-center font-bold text-xs">
                AICTE
              </div>
              <span className="font-bold text-white text-sm">Security Deposit Portal</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              All India Council for Technical Education (AICTE), Statutory Body Under Ministry of Education, Government of India.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-aicteYellow mb-3 text-xs">
              Portal Directory
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><a href="#overview" className="hover:text-white">Approval Process Handbook (APH)</a></li>
              <li><a href="#architecture" className="hover:text-white">Account Aggregator Guidelines</a></li>
              <li><a href="#regulations" className="hover:text-white">Gazetted Policy Notifications</a></li>
              <li><a href="#helpdesk" className="hover:text-white">Grievance Redressal Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-aicteYellow mb-3 text-xs">
              Statutory Bureau
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>Central Approval Bureau (CAB)</li>
              <li>Finance & Joint Account Depository</li>
              <li>National Institutional Ranking (NIRF)</li>
              <li>Core Banking System (CBS) Audit Cell</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-aicteYellow mb-3 text-xs">
              Official Headquarters
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-aicteYellow shrink-0 mt-0.5" />
                <span>Nelson Mandela Marg, Vasant Kunj, New Delhi-110070</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-aicteYellow shrink-0" />
                <span>Helpline: 011-29581000 / 1800-11-3023</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-aicteYellow shrink-0" />
                <span>support-fdr@aicte-india.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 All India Council for Technical Education (AICTE). All Rights Reserved.
          </div>
          <div>
            Designed, Developed and Hosted by National Informatics Centre (NIC) • Government of India
          </div>
        </div>
      </footer>
    </div>
  );
}
