"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, UserPlus, HeartPulse, Mail, Phone, Stethoscope } from 'lucide-react';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';

const patientSchema = z.object({
  name: z.string().min(2, 'Patient name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(8, 'Phone number is required'),
  age: z.number().min(0).max(125),
  gender: z.enum(['Male', 'Female', 'Other']),
  condition: z.string().min(2, 'Medical condition is required'),
  status: z.enum(['Active', 'Recovered', 'Under Observation', 'Critical']),
  doctorId: z.string().min(1, 'Please assign a primary physician'),
  bloodGroup: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPatient: (data: PatientFormData & { doctorName: string; lastVisitDate: string }) => void;
  defaultDoctorId?: string;
  initialValues?: Partial<PatientFormData>;
  title?: string;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitPatient,
  defaultDoctorId,
  initialValues,
  title = 'Admit / Register Patient',
}) => {
  const { doctors } = useDoctorTracker();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '+1 (555) ',
      age: 32,
      gender: 'Male',
      condition: '',
      status: 'Active',
      doctorId: defaultDoctorId || (doctors[0]?.id ?? ''),
      bloodGroup: 'O+',
      notes: '',
    },
  });

  useEffect(() => {
    if (defaultDoctorId) {
      setValue('doctorId', defaultDoctorId);
    }
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, val]) => {
        if (val !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(key as any, val);
        }
      });
    }
  }, [defaultDoctorId, initialValues, setValue]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: PatientFormData) => {
    const assignedDoc = doctors.find((d) => d.id === data.doctorId);
    const doctorName = assignedDoc ? assignedDoc.name : 'Unassigned';
    const lastVisitDate = new Date().toISOString().split('T')[0];

    onSubmitPatient({
      ...data,
      doctorName,
      lastVisitDate,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">
                Create new clinical record and assign attending doctor
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
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Patient Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Eleanor Vance"
              {...register('name')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  {...register('email')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Age, Gender, Blood Group */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="0"
                max="125"
                {...register('age', { valueAsNumber: true })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                {...register('gender')}
                className="w-full px-2.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Blood Group
              </label>
              <select
                {...register('bloodGroup')}
                className="w-full px-2 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Medical Condition *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Migraine..."
                  {...register('condition')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                />
              </div>
              {errors.condition && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.condition.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Patient Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Recovered">Recovered</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Assigned Doctor */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Assigned Attending Doctor *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Stethoscope className="h-4 w-4" />
              </div>
              <select
                {...register('doctorId')}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization} ({doc.hospital})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Clinical Assessment & Prescriptions
            </label>
            <textarea
              rows={2}
              placeholder="Initial diagnosis, medication orders, dietary recommendations..."
              {...register('notes')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 resize-none"
            />
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Save Patient Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientFormModal;
