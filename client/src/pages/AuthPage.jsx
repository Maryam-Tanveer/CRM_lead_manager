import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Lock, Mail, User, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loginFormSchema, registerFormSchema } from '../validations/authSchema';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const schema = isLogin ? loginFormSchema : registerFormSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        (isLogin ? 'Failed to log in' : 'Failed to register account');
      const backendErrors = err.response?.data?.errors || {};
      if (backendMessage.toLowerCase().includes('email')) {
        backendErrors.email = backendMessage;
      }
      setErrors({ form: backendMessage, ...backendErrors });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (roleType = 'admin') => {
    if (roleType === 'admin') {
      setFormData({
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'password123',
        role: 'admin'
      });
    } else {
      setFormData({
        name: 'Demo Member',
        email: 'agent@demo.com',
        password: 'password123',
        role: 'user'
      });
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-surface-base relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-medium text-content-muted hover:text-content-main transition-colors"
        >
          ← Back to Home
        </button>
      </div>

      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl border border-borderTheme bg-surface-card hover:bg-surface-hover text-content-muted hover:text-content-main transition-colors shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-amber-500 shadow-xl shadow-primary-500/25 text-white mb-4">
            <Flame className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-content-main">
            LeadPulse CRM
          </h1>
          <p className="text-xs text-content-muted mt-1">
            {isLogin
              ? 'Enter your credentials to access your pipeline'
              : 'Create an account to start managing CRM leads'}
          </p>
        </div>

        <div className="bg-surface-card border border-borderTheme rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-surface-base border border-borderTheme text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className={`py-2 rounded-lg transition-all ${
                isLogin
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
                  : 'text-content-muted hover:text-content-main'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className={`py-2 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
                  : 'text-content-muted hover:text-content-main'
              }`}
            >
              Register
            </button>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-content-main mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-subtle" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-content-main mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-subtle" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-content-main mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-subtle" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-content-main mb-1.5">
                  Account Role (RBAC)
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-subtle" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-surface-base border border-borderTheme text-content-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    <option value="user">Member (Standard User)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : isLogin ? 'Sign In to Dashboard' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-borderTheme">
            <p className="text-[11px] text-content-subtle text-center mb-2.5">
              Quick test presets:
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="px-3 py-1 text-xs rounded-lg border border-borderTheme bg-surface-hover hover:border-primary-500/50 text-content-muted hover:text-content-main transition-colors"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('user')}
                className="px-3 py-1 text-xs rounded-lg border border-borderTheme bg-surface-hover hover:border-primary-500/50 text-content-muted hover:text-content-main transition-colors"
              >
                Member Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
