import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = onLoginSuccess(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-tsw-bg flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Decorative Gold Radial Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-tsw-gold/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-tsw-terracotta/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Studio Branding Banner */}
        <div className="text-center space-y-3">
          <div className="inline-block bg-white p-3.5 rounded-2xl border border-tsw-border shadow-tsw-card mb-1">
            <img 
              src="/Logo-01.png" 
              alt="The Shubh Wedding Logo" 
              className="h-14 sm:h-16 w-auto mx-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/public/Logo-01.png';
              }}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tsw-ink tracking-tight">
            The Shubh Wedding
          </h1>
          <p className="text-xs sm:text-sm text-tsw-muted font-medium">
            Studio CRM & Payment Portal • Admin Login
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-tsw-border shadow-tsw-modal space-y-5">
          
          <div className="flex items-center justify-between border-b border-tsw-border pb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-tsw-gold" />
              <h2 className="text-sm sm:text-base font-bold text-tsw-ink uppercase tracking-wider">
                Admin Authentication
              </h2>
            </div>
            <span className="text-[10px] font-semibold bg-tsw-gold-light text-tsw-gold-dark px-2.5 py-1 rounded-full border border-tsw-gold/30">
              Encrypted Session
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-tsw-brick-light/50 border border-tsw-brick/30 text-tsw-brick text-xs font-semibold animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="admin@theshubhwedding.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-tsw-border text-sm text-tsw-ink bg-white focus:outline-none focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-tsw-ink mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-tsw-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-tsw-border text-sm text-tsw-ink bg-white focus:outline-none focus:border-tsw-gold focus:ring-1 focus:ring-tsw-gold font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-tsw-muted hover:text-tsw-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-tsw-muted hover:text-tsw-ink font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-tsw-gold focus:ring-tsw-gold h-4 w-4"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-tsw-gold hover:bg-tsw-gold-hover text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to CRM Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Security Footer */}
        <p className="text-center text-[11px] text-tsw-muted font-medium">
          Protected & Encrypted • Authorization Required for Studio Staff
        </p>

      </div>
    </div>
  );
}
