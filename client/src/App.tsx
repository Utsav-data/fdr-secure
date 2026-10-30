import { useState } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Authenticating credentials with Zero-Trust Identity Provider...');
    setTimeout(() => {
      setStatusMessage('Authentication successful! Loading Institutional Security Dashboard...');
      setTimeout(() => {
        setShowLoginModal(false);
        setStatusMessage(null);
        setIsAuthenticated(true);
      }, 700);
    }, 600);
  };

  const handleQuickDemoLogin = (roleEmail = 'finance.officer@iit-delhi.ac.in') => {
    setEmail(roleEmail);
    setShowLoginModal(false);
    setIsAuthenticated(true);
  };

  // If user is authenticated, route directly to the Phase 3 Split-Screen Dashboard
  if (isAuthenticated) {
    return (
      <Dashboard
        onLogout={() => setIsAuthenticated(false)}
        userEmail={email || 'finance.officer@iit-delhi.ac.in'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-indigo-700/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation */}
      <nav className="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-cyan-500/25">
              AICTE
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">FDR Management Portal</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                v1.0 • Zero Trust
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AA Consent Network: Operational</span>
            </div>
            <button
              id="nav-login-btn"
              onClick={() => setShowLoginModal(true)}
              className="text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center justify-center text-center">
        {/* Security Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-8 shadow-sm">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Statutory Compliance & Automated Lien Verification</span>
        </div>

        {/* Primary Header */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          AICTE FDR Management Portal - Zero Trust Architecture
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Cryptographically sealed security deposit management, automated bank Account Aggregator verification, and real-time regulatory compliance monitoring for affiliated institutions.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            id="hero-login-button"
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-cyan-400/30 flex items-center justify-center space-x-2"
          >
            <span>Login to Dashboard</span>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            id="demo-direct-button"
            onClick={() => handleQuickDemoLogin()}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white font-semibold text-base border border-cyan-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>⚡ Open Live Vault Demo</span>
          </button>

          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-base border border-slate-800 transition-all duration-200"
          >
            Explore Specifications
          </a>
        </div>

        {/* System Pillars Cards */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cryptographic Time-Lock</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every deposit is signed with an HMAC-SHA256 seal. Attempted early status release before statutory maturity date triggers a 403 Security Breach.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Setu Account Aggregator</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated consent-driven banking rails verify FDR principal amounts, issuance dates, and active lien holds directly with partner CBS banks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Maturity Cron</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Daily midnight cron (<code className="text-emerald-400 font-mono">0 0 * * *</code>) monitors FDR expirations, dispatching 30-day alerts and flagging deposits within 5 days as RENEWAL_REQUIRED.
            </p>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Institutional Sign In</h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter your credentials to access the AICTE FDR Security Dashboard.
              </p>
            </div>

            {statusMessage && (
              <div className="mb-4 p-3 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-sm">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Official Email / AICTE ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@institution.edu.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20"
              >
                Authenticate Session
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin()}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                ⚡ Instant Demo Login (Institution Officer)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        All India Council for Technical Education (AICTE) • Secure FDR Repository Architecture
      </footer>
    </div>
  );
}
