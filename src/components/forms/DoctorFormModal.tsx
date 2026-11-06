"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, UserPlus, Stethoscope, Building2, Mail, Phone, Clock } from 'lucide-react';
import { SPECIALIZATION_LIST } from '@/data/mockData';

const doctorSchema = z.object({
  name: z.string().min(3, 'Doctor name must be at least 3 characters'),
  email: z.string().email('Please enter a valid hospital email'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  specialization: z.enum([
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Oncology',
    'Psychiatry',
    'General Medicine',
  ]),
  hospital: z.string().min(2, 'Hospital affiliation is required'),
  status: z.enum(['Active', 'On Leave', 'Inactive']),
  experienceYears: z.number().min(1, 'Years of experience must be at least 1').max(60),
  bio: z.string().optional(),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDoctor: (data: DoctorFormData) => void;
}

export const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitDoctor,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: 'Dr. ',
      email: '',
      phone: '+1 (555) ',
      specialization: 'Cardiology',
      hospital: 'Mayo Clinic Healthcare',
      status: 'Active',
      experienceYears: 10,
      bio: '',
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: DoctorFormData) => {
    onSubmitDoctor(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Doctor</h2>
              <p className="text-xs text-slate-500">
                Register a physician into the hospital directory
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 overflow-y-auto space-y-4">
          {/* Doctor Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name & Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Stethoscope className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Dr. Jane Watson"
                {...register('name')}
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Specialization & Hospital Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Specialization *
              </label>
              <select
                {...register('specialization')}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
              >
                {SPECIALIZATION_LIST.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Hospital Affiliation *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Hospital name"
                  {...register('hospital')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              {errors.hospital && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.hospital.message}</p>
              )}
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Hospital Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="doctor@hospital.org"
                  {...register('email')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Direct Phone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Status & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Clinical Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Experience (Years)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="50"
                  {...register('experienceYears', { valueAsNumber: true })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Brief Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Clinical Background & Special Interests
            </label>
            <textarea
              rows={2}
              placeholder="Board certifications, focus areas, clinic room number..."
              {...register('bio')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Register Doctor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormModal;
