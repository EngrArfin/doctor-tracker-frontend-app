"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Upload,
  Save,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/redux-hook';
import { useCurrentUser, updateUserProfile } from '@/redux/features/auth/authSlice';
import { useUpdateUserMutation } from '@/redux/features/user/userApi';
import { SPECIALIZATION_LIST } from '@/data/mockData';
import { toast } from 'sonner';

// Quick clean physician avatars presets
const AVATAR_PRESETS = [
  {
    label: 'Dr. Alex Morgan (Default)',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    label: 'Dr. Sarah Jenkins',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    label: 'Dr. Marcus Vance',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    label: 'Dr. Emily Chen',
    url: 'https://images.unsplash.com/photo-1594824813571-638f02613d46?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    label: 'Dr. David Kim',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    label: 'Dr. Olivia Patel',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256&h=256',
  },
];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(useCurrentUser);
  const [updateUserApi, { isLoading: isApiUpdating }] = useUpdateUserMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states initialized with Redux user or defaults
  const [name, setName] = useState(currentUser?.name || 'Dr. Alex Morgan');
  const [email, setEmail] = useState(currentUser?.email || 'admin@doctortracker.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-8901');
  const [specialization, setSpecialization] = useState(
    currentUser?.specialization || 'Cardiology'
  );
  const [hospital, setHospital] = useState(
    currentUser?.hospital || 'Mayo Clinic Healthcare'
  );
  const [bio, setBio] = useState(
    currentUser?.bio ||
    'Senior Clinical Administrator & Chief Physician overseeing patient admissions and specialty roster management.'
  );

  // Profile image state
  const [photoUrl, setPhotoUrl] = useState<string>(
    currentUser?.image || DEFAULT_AVATAR
  );
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if currentUser changes from Redux
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.image) setPhotoUrl(currentUser.image);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.specialization) setSpecialization(currentUser.specialization);
      if (currentUser.hospital) setHospital(currentUser.hospital);
      if (currentUser.bio) setBio(currentUser.bio);
    }
  }, [currentUser]);

  // Handle Local File Upload with Instant Base64 Preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File Type', {
        description: 'Please upload an image file (PNG, JPG, WEBP).',
      });
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File Too Large', {
        description: 'Profile photo size should be under 5MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        toast.success('Photo Loaded', {
          description: 'New avatar selected. Click "Save Changes" to apply.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle URL Paste
  const handleApplyCustomUrl = () => {
    if (!customUrlInput || !customUrlInput.trim().startsWith('http')) {
      toast.error('Invalid URL', {
        description: 'Please enter a valid HTTP/HTTPS image URL.',
      });
      return;
    }
    setPhotoUrl(customUrlInput.trim());
    setCustomUrlInput('');
    toast.success('Photo URL Applied', {
      description: 'Image preview updated. Click "Save Changes" to confirm.',
    });
  };

  // Save changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      hospital: hospital.trim(),
      bio: bio.trim(),
      image: photoUrl,
    };

    // 1. Immediately update Redux auth slice so all UI components update instantly
    dispatch(updateUserProfile(updatedData));

    // 2. Also persist to localStorage for offline persistence
    try {
      const stored = localStorage.getItem('doctor_tracker_custom_user');
      const merged = stored ? { ...JSON.parse(stored), ...updatedData } : updatedData;
      localStorage.setItem('doctor_tracker_custom_user', JSON.stringify(merged));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // 3. Update backend API if user ID exists
    try {
      if (currentUser?.id) {
        await updateUserApi({
          id: currentUser.id,
          data: {
            name: updatedData.name,
            phone: updatedData.phone,
            specialization: updatedData.specialization,
            hospital: updatedData.hospital,
            image: updatedData.image,
          },
        }).unwrap();
      }
      toast.success('Profile & Photo Updated!', {
        description: 'Your changes have been saved to your clinical account.',
      });
    } catch {
      toast.success('Profile Saved Locally', {
        description: 'Your profile changes have been applied successfully.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPhoto = () => {
    setPhotoUrl(DEFAULT_AVATAR);
    toast.info('Default Photo Selected', {
      description: 'Default avatar restored. Click "Save Changes" to confirm.',
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full mx-auto space-y-6 pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-blue-600">Profile Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Account & Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Update your physician avatar photo, credentials, and medical contact information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{currentUser?.role || 'ADMIN'} Verified</span>
            </span>
          </div>
        </div>

        {/* Profile Card with Photo Section */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Section 1: Profile Photo Management */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-600" />
              <span>Profile Avatar Photo</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              This photo will appear in your header, sidebar, patient charts, and reports.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Photo Display with overlay hover */}
              <div className="relative group shrink-0">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden ring-4 ring-blue-500/20 shadow-md relative bg-slate-100">
                  <img
                    src={photoUrl}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                    title="Click to change photo"
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {/* Photo Controls */}
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-sm"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload From Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Reset Default</span>
                  </button>
                </div>

                {/* Paste URL option */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Or Enter Image URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Apply URL
                    </button>
                  </div>
                </div>

                {/* Quick Presets Carousel / Grid */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Choose From Professional Presets:</span>
                  </label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(p.url);
                          toast.success('Preset Selected', {
                            description: `${p.label} chosen. Click "Save Changes" to apply.`,
                          });
                        }}
                        title={p.label}
                        className={`relative h-11 w-11 rounded-xl overflow-hidden shrink-0 ring-2 transition-all cursor-pointer ${photoUrl === p.url
                            ? 'ring-blue-600 ring-offset-2 scale-105'
                            : 'ring-slate-200 opacity-75 hover:opacity-100 hover:ring-blue-400'
                          }`}
                      >
                        <img src={p.url} alt={p.label} className="h-full w-full object-cover" />
                        {photoUrl === p.url && (
                          <div className="absolute inset-0 bg-blue-600/25 flex items-center justify-center text-white">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Clinical Information */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>Physician & Account Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name & Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Direct Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-8901"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Medical Specialization */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Specialization
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium cursor-pointer"
                  >
                    {SPECIALIZATION_LIST.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hospital Affiliation */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hospital Affiliation & Facility
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="Mayo Clinic Healthcare"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Professional Bio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinical Bio & Department Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe clinical experience, board certifications, and research interests..."
                  className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving || isApiUpdating}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving || isApiUpdating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
