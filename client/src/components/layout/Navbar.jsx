import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, ShieldCheck, User as UserIcon, Flame, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-borderTheme bg-surface-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-content-main">LeadPulse</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-primary-500/10 text-primary-600 dark:text-primary-400">
                  CRM
                </span>
              </div>
              <p className="text-xs text-content-muted hidden sm:block">Pipeline & Lead Operations</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-borderTheme">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-surface-hover text-primary-500'
                  : 'text-content-muted hover:text-content-main hover:bg-surface-hover'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-surface-hover text-primary-500'
                  : 'text-content-muted hover:text-content-main hover:bg-surface-hover'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-content-muted hover:text-content-main rounded-xl hover:bg-surface-hover border border-borderTheme/50 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          <div className="h-6 w-px bg-borderTheme hidden sm:block" />

          <div className="flex items-center gap-3 pl-1">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-medium text-content-main leading-none">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-content-muted leading-tight mt-1 flex items-center gap-1">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-primary-500" />
                    <span className="text-primary-600 dark:text-primary-400 font-medium">Administrator</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3 h-3 text-content-subtle" />
                    <span>Member</span>
                  </>
                )}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 text-content-muted hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
