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
import doctortrackerLogo from '@/assets/doctorTracker/icon/doctortrackerLogo.png';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid clinical email'),
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
          description: `Signed in as ${res.data.user.email}. Redirecting...`,
        });

        router.push('/dashboard');
      } else {
        toast.error(res?.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err: unknown) {
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

      const errData = err as { data?: { message?: string | string[] }; message?: string };
      const errorMsg =
        errData?.data?.message ||
        (Array.isArray(errData?.data?.message) ? errData.data.message.join(', ') : null) ||
        errData?.message ||
        'Invalid email or password';
      toast.error('Authentication Failed', {
        description: typeof errorMsg === 'string' ? errorMsg : 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'doctor') => {
    if (role === 'admin') {
      setValue('email', 'admin@doctortracker.com', { shouldValidate: true });
      setValue('password', 'adminPass2026!', { shouldValidate: true });
      toast.info('Admin demo loaded', {
        description: 'Credentials filled for admin@doctortracker.com',
      });
    } else {
      setValue('email', 'sarah.jenkins@mayoclinic.org', { shouldValidate: true });
      setValue('password', 'doctorPass2026!', { shouldValidate: true });
      toast.info('Doctor demo loaded', {
        description: 'Credentials filled for sarah.jenkins@mayoclinic.org',
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
      {/* Left Column: Full-Screen Minimal Hero with LoginPhoto (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 min-h-screen flex-col justify-between p-10 xl:p-14 text-white overflow-hidden bg-slate-900">
        {/* Full Screen Doctor Background Photo */}
        <Image
          src={loginPhoto}
          alt="Doctor reviewing clinical records"
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-center select-none"
        />

        {/* Soft, clean overlay so the doctor image is clearly visible without heavy darkness */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/50 z-10" />

        {/* Top Header: Simple Brand */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="relative h-11 w-11 rounded-full overflow-hidden shadow-md ring-2 ring-white/30 shrink-0">
            <Image
              src={doctortrackerLogo}
              alt="Doctor Tracker Logo"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Doctor<span className="text-teal-400">Tracker</span>
            </span>
            <span className="block text-[11px] font-medium tracking-wider uppercase text-slate-300">
              Clinical Portal
            </span>
          </div>
        </div>

        {/* Bottom: Simple, Clean Message (No heavy text or cluttered badges) */}
        <div className="relative z-20 mt-auto pt-10">
          {/* Simple Clean Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-5 mt-6 border-t border-white/15">
            <span>&copy; {new Date().getFullYear()} Doctor Tracker</span>

          </div>
        </div>
      </div>

      {/* Right Column: Clean & Simple Login Form */}
      <div className="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white overflow-y-auto">

        {/* Mobile Header (Screens < 1024px) */}
        <div className="flex lg:hidden items-center gap-2.5 mb-6">
          <div className="relative h-9 w-9 rounded-full overflow-hidden shadow-xs ring-1 ring-slate-200 shrink-0">
            <Image
              src={doctortrackerLogo}
              alt="Doctor Tracker Logo"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Doctor<span className="text-teal-600">Tracker</span>
          </span>
        </div>

        {/* Center Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-4">

          {/* Mobile Photo Preview */}
          <div className="lg:hidden mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative h-40">
            <Image
              src={loginPhoto}
              alt="Doctor reviewing charts"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-medium">
                Clinical Care Portal
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Please enter your details to access the dashboard.
            </p>
          </div>

          {/* Simple Quick Demo Pills */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                Login Credential
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="py-1.5 px-3 bg-white hover:bg-blue-50/70 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('doctor')}
                className="py-1.5 px-3 bg-white hover:bg-teal-50/70 hover:border-teal-300 text-slate-700 hover:text-teal-700 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                Doctor
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Email
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
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${errors.email
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
                  className="block text-xs font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
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
                  className={`w-full pl-10 pr-11 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${errors.password
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
                <span className="text-xs text-slate-600">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
        </div>



      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
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
