import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck, Zap, BarChart3, Users, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-base text-content-main flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-40 w-full border-b border-borderTheme bg-surface-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-content-main">LeadPulse</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-primary-500/10 text-primary-600 dark:text-primary-400">
                CRM
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-content-muted hover:text-content-main rounded-xl hover:bg-surface-hover border border-borderTheme/50 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-md shadow-primary-500/25 transition-all"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-content-muted hover:text-rose-500 rounded-xl hover:bg-surface-hover transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs font-medium text-content-main hover:bg-surface-hover rounded-xl transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-md shadow-primary-500/25 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium mb-6 animate-in fade-in zoom-in-95">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Modern MERN Stack Lead Operations</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-content-main max-w-4xl leading-[1.15]">
          Manage, track, and convert sales leads with{' '}
          <span className="bg-gradient-to-r from-primary-500 to-amber-500 bg-clip-text text-transparent">
            instant precision
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-content-muted max-w-2xl leading-relaxed">
          LeadPulse is a full-featured Mini CRM built for speed. Capture leads, assign team representatives, update pipeline stages in real time, and monitor conversion metrics.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-95"
            >
              <span>Go to Your CRM Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-95"
              >
                <span>Launch CRM Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-5 py-3 text-sm font-medium text-content-main rounded-xl border border-borderTheme bg-surface-card hover:bg-surface-hover transition-colors"
              >
                Explore Demo Accounts
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-20 text-left">
          <div className="p-6 rounded-2xl bg-surface-card border border-borderTheme shadow-sm hover:border-primary-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-main mb-2">
              Full Pipeline Operations
            </h3>
            <p className="text-xs text-content-muted leading-relaxed">
              Add leads, assign agents, change statuses inline with zero latency, and filter through live debounced searches.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-card border border-borderTheme shadow-sm hover:border-primary-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-main mb-2">
              Automated Analytics
            </h3>
            <p className="text-xs text-content-muted leading-relaxed">
              Instant metric cards calculate totals, active outreach, won conversions, and live win rate percentages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-card border border-borderTheme shadow-sm hover:border-primary-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-content-main mb-2">
              JWT & RBAC Architecture
            </h3>
            <p className="text-xs text-content-muted leading-relaxed">
              Short-lived access tokens, automatic refresh rotation, duplicate lead prevention, and Zod runtime schema validation.
            </p>
          </div>
        </div>

        <div className="mt-16 w-full max-w-2xl p-6 rounded-2xl border border-borderTheme bg-surface-card/60 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-xs text-content-muted text-left">
              Turnkey MERN setup: In-memory MongoDB fallback enabled for zero-config evaluation.
            </span>
          </div>
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="text-xs font-semibold text-primary-500 hover:text-primary-600 whitespace-nowrap"
          >
            Enter Dashboard →
          </button>
        </div>
      </main>

      <footer className="w-full border-t border-borderTheme py-6 bg-surface-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary-500" />
            <span>LeadPulse Mini CRM</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>React 18</span>
            <span>•</span>
            <span>Node.js & Express</span>
            <span>•</span>
            <span>MongoDB</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Zod</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
