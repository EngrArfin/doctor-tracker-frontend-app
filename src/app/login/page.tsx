"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid clinical work email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@doctortracker.com',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Realistic simulation of authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    toast.success('Welcome back, Clinical Administrator!', {
      description: `Signed in as ${data.email}. Redirecting to your dashboard...`,
    });

    router.push('/dashboard');
  };

  const fillDemoCredentials = (role: 'admin' | 'doctor') => {
    if (role === 'admin') {
      setValue('email', 'admin@doctortracker.com', { shouldValidate: true });
      setValue('password', 'adminPass2026!', { shouldValidate: true });
      toast.info('Admin credentials loaded', {
        description: 'admin@doctortracker.com',
      });
    } else {
      setValue('email', 'sarah.jenkins@mayoclinic.org', { shouldValidate: true });
      setValue('password', 'doctorPass2026!', { shouldValidate: true });
      toast.info('Chief Physician credentials loaded', {
        description: 'sarah.jenkins@mayoclinic.org',
      });
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setShowForgotModal(false);
    toast.success('Recovery link sent', {
      description: `Password recovery instructions sent to ${forgotEmail}`,
    });
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left side: Premium Healthcare Brand Showcase (visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A2540] p-12 text-white flex-col justify-between overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <HeartPulse className="h-6 w-6 text-teal-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Doctor<span className="text-teal-400">Tracker</span>
              </span>
              <span className="block text-[11px] font-medium tracking-wider uppercase text-slate-400">
                Healthcare SaaS Platform
              </span>
            </div>
          </div>
        </div>

        {/* Central Value Proposition */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-medium text-blue-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>Next-Gen Medical Operations & Analytics</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Unified physician workflow and real-time patient intelligence.
          </h1>

          <p className="mt-4 text-slate-300 text-sm leading-relaxed">
            Engineered for hospital administrators, clinics, and health systems to track physician specializations, balance caseloads, and accelerate patient recovery.
          </p>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-teal-400 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Security</span>
              </div>
              <p className="text-xl font-bold text-white">HIPAA Ready</p>
              <p className="text-xs text-slate-400 mt-0.5">Encrypted audit logging</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Scale</span>
              </div>
              <p className="text-xl font-bold text-white">100% Client-Side</p>
              <p className="text-xs text-slate-400 mt-0.5">Fast local state reactive UX</p>
            </div>
          </div>

          {/* Feature checks */}
          <div className="mt-8 space-y-2.5">
            {[
              'Interactive multi-specialty physician directory',
              'Real-time patient caseload and admission trend charts',
              'Quick-action modal for rapid patient and doctor onboarding',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>&copy; {new Date().getFullYear()} Doctor Tracker System</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            System operational • v2.4.0
          </span>
        </div>
      </div>

      {/* Right side: Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible on small screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Doctor<span className="text-teal-600">Tracker</span>
              </span>
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Clinical Admin Portal
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your clinical credentials to access the Doctor Tracker administrative dashboard.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Quick Demo Accounts:
              </span>
              <span className="text-[11px] text-blue-600 font-medium">Click to fill</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="flex-1 py-1.5 px-2.5 bg-white hover:bg-blue-50 text-slate-800 text-xs font-medium rounded-lg border border-blue-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('doctor')}
                className="flex-1 py-1.5 px-2.5 bg-white hover:bg-teal-50 text-slate-800 text-xs font-medium rounded-lg border border-teal-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                Physician
              </button>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@hospital.org"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your security password"
                  {...register('password')}
                  className={`w-full pl-10 pr-11 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Remember this workstation for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo note */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Hospital Management System • Frontend Demo Edition • All data is stored locally in-memory.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Visual Only with Toast feedback) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Reset Password
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your registered clinical email
                </p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

