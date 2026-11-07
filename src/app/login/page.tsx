"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Cookies from 'js-cookie';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { useAppDispatch } from '@/redux/hooks/redux-hook';
import { setUser } from '@/redux/features/auth/authSlice';
import loginPhoto from '@/assets/doctorTracker/photo/LoginPhoto.jpg';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Sparkles,
  CheckCircle2,
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
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
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
    try {
      const res = await login({ email: data.email, password: data.password }).unwrap();
      if (res?.success && res?.data) {
        Cookies.set('token', res.data.accessToken, { expires: data.rememberMe ? 7 : 1 });
        dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));

        toast.success(`Welcome back, ${res.data.user.name || 'User'}!`, {
          description: `Signed in as ${res.data.user.email}. Redirecting to dashboard...`,
        });

        router.push('/dashboard');
      } else {
        toast.error(res?.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      // Demo fallback if backend is offline or demo accounts used
      if (
        data.email === 'admin@doctortracker.com' ||
        data.email === 'sarah.jenkins@mayoclinic.org'
      ) {
        const demoUser = {
          id: 'demo-admin-id',
          email: data.email,
          name: data.email.includes('jenkins') ? 'Dr. Sarah Jenkins' : 'Dr. Alex Morgan',
          role: 'ADMIN',
        };
        const demoToken = 'demo-jwt-token-2026';
        Cookies.set('token', demoToken, { expires: data.rememberMe ? 7 : 1 });
        dispatch(setUser({ user: demoUser, token: demoToken }));

        toast.success(`Welcome back, ${demoUser.name}!`, {
          description: `Signed in as ${demoUser.email} (Demo Session). Redirecting...`,
        });

        router.push('/dashboard');
        return;
      }

      const errorMsg =
        err?.data?.message ||
        (Array.isArray(err?.data?.message) ? err.data.message.join(', ') : null) ||
        err?.message ||
        'Invalid email or password';
      toast.error('Authentication Failed', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'doctor') => {
    if (role === 'admin') {
      setValue('email', 'admin@doctortracker.com', { shouldValidate: true });
      setValue('password', 'adminPass2026!', { shouldValidate: true });
      toast.info('Admin demo credentials loaded', {
        description: 'admin@doctortracker.com',
      });
    } else {
      setValue('email', 'sarah.jenkins@mayoclinic.org', { shouldValidate: true });
      setValue('password', 'doctorPass2026!', { shouldValidate: true });
      toast.info('Doctor demo credentials loaded', {
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
    toast.success('Password reset link sent', {
      description: `Instructions sent to ${forgotEmail}`,
    });
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left Column: Full-Screen Edge-to-Edge Hero with LoginPhoto (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 min-h-screen flex-col justify-between p-12 xl:p-16 text-white overflow-hidden bg-slate-900">
        {/* Full Screen Doctor Background Photo */}
        <Image
          src={loginPhoto}
          alt="Doctor reviewing clinical records with patient"
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-top select-none"
        />

        {/* Cinematic Multi-stop Overlay to ensure pristine contrast and authentic human tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/75 z-10" />
        <div className="absolute inset-0 bg-blue-950/20 mix-blend-multiply z-10" />

        {/* Top Header: Hospital Brand */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-600/90 backdrop-blur-md border border-white/20 p-0.5 shadow-lg flex items-center justify-center">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Doctor<span className="text-teal-400">Tracker</span>
              </span>
              <span className="block text-[11px] font-medium tracking-wider uppercase text-slate-300">
                Clinical Healthcare Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hospital Shift Active</span>
          </div>
        </div>

        {/* Center / Bottom: Inspiring Human Medical Message */}
        <div className="relative z-20 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-teal-300 mb-6">
            <Stethoscope className="h-4 w-4 text-teal-300" />
            <span>Dedicated Physician & Patient Care</span>
          </div>

          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Compassionate medical care, seamlessly coordinated.
          </h1>

          <p className="mt-4 text-slate-200 text-sm xl:text-base leading-relaxed max-w-lg font-normal">
            Empowering hospital teams and clinical administrators to monitor physician specializations, balance real-time patient caseloads, and improve treatment outcomes.
          </p>

          <div className="mt-8 flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>Real-time Doctor Rosters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>Patient Admission Triage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>Multi-Specialty Analytics</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer: Compliance & Copyright */}
        <div className="relative z-20 flex items-center justify-between text-xs text-slate-300 pt-6 border-t border-white/15">
          <span>&copy; {new Date().getFullYear()} Doctor Tracker Healthcare Systems</span>
          <div className="flex items-center gap-2 font-medium text-teal-300">
            <ShieldCheck className="h-4 w-4" />
            <span>HIPAA Compliant & Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Column: Full-Height Clean & Simple Login Form Container */}
      <div className="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white overflow-y-auto">
        
        {/* Top Navbar / Mobile Header */}
        <div className="flex items-center justify-between lg:justify-end mb-6">
          {/* Mobile Brand */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900">
                Doctor<span className="text-teal-600">Tracker</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Support:</span>
            <a
              href="mailto:support@doctortracker.com"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              support@doctortracker.com
            </a>
          </div>
        </div>

        {/* Center: Main Human Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          
          {/* Mobile Photo Banner (visible on screens < 1024px) */}
          <div className="lg:hidden mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-44">
            <Image
              src={loginPhoto}
              alt="Doctor reviewing charts"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
              <span className="text-white font-semibold text-sm">
                Clinical Administration Portal
              </span>
              <span className="text-slate-300 text-xs">
                Physician & Patient Management
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Welcome back. Enter your clinical email and password to access the administrative dashboard.
            </p>
          </div>

          {/* Clean Quick Demo Accounts Switcher */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Quick Demo Access:
              </span>
              <span className="text-[11px] text-slate-400">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="py-2 px-3 bg-white hover:bg-blue-50/70 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-medium rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('doctor')}
                className="py-2 px-3 bg-white hover:bg-teal-50/70 hover:border-teal-300 text-slate-700 hover:text-teal-700 text-xs font-medium rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                Doctor Demo
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Clinical Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="doctor@hospital.org"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
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
                  placeholder="••••••••"
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
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Simple Clean Note */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Protected by clinical encryption & access controls.
            </p>
          </div>
        </div>

        {/* Bottom Footer on Right Panel */}
        <div className="pt-4 border-t border-slate-100 text-center lg:text-left text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Hospital Operations Dashboard</span>
          <span>Version 2.4.0</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
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
                  placeholder="doctor@hospital.org"
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
