"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  Doctor,
  Patient,
  DashboardStats,
  PatientRegistrationTrend,
  PatientsPerDoctorMetric,
  SpecializationDistribution,
} from '@/types';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  MOCK_REGISTRATION_TREND,
  MOCK_SPECIALIZATION_DISTRIBUTION,
} from '@/data/mockData';
import { toast } from 'sonner';

interface DoctorTrackerContextType {
  doctors: Doctor[];
  patients: Patient[];
  stats: DashboardStats;
  registrationTrends: PatientRegistrationTrend[];
  patientsPerDoctor: PatientsPerDoctorMetric[];
  specializations: SpecializationDistribution[];
  addDoctor: (doctor: Omit<Doctor, 'id' | 'patientsCount' | 'joinedDate' | 'rating' | 'avatarUrl'> & { avatarUrl?: string }) => void;
  deleteDoctor: (id: string) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => void;
  deletePatient: (id: string) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientsByDoctorId: (doctorId: string) => Patient[];
}

const DoctorTrackerContext = createContext<DoctorTrackerContextType | undefined>(undefined);

export const DoctorTrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);

  // Dynamically computed stats
  const stats = useMemo<DashboardStats>(() => {
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    const avg = totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;
    
    // Count new patients this current month (assume 2024-02 or last 30 days)
    const newPatientsThisMonth = patients.filter((p) => {
      const regYearMonth = p.registeredDate.slice(0, 7);
      return regYearMonth === '2024-02' || regYearMonth === '2024-01';
    }).length;

    return {
      totalDoctors,
      totalPatients,
      newPatientsThisMonth,
      averagePatientsPerDoctor: avg,
      doctorsGrowthPct: 12.5,
      patientsGrowthPct: 18.2,
      newPatientsGrowthPct: 24.1,
      avgRatioGrowthPct: 5.4,
    };
  }, [doctors, patients]);

  // Dynamically computed patients per doctor for bar chart
  const patientsPerDoctor = useMemo<PatientsPerDoctorMetric[]>(() => {
    return doctors.map((doc) => {
      const assignedCount = patients.filter((p) => p.doctorId === doc.id).length;
      return {
        doctorName: doc.name.replace('Dr. ', ''),
        patientCount: doc.patientsCount + assignedCount,
        specialization: doc.specialization,
      };
    });
  }, [doctors, patients]);

  // Add doctor
  const addDoctor = (data: Omit<Doctor, 'id' | 'patientsCount' | 'joinedDate' | 'rating' | 'avatarUrl'> & { avatarUrl?: string }) => {
    const newDoc: Doctor = {
      ...data,
      id: `doc-${Date.now()}`,
      patientsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      avatarUrl:
        data.avatarUrl ||
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
    };

    setDoctors((prev) => [newDoc, ...prev]);
    toast.success('Doctor registered successfully', {
      description: `${newDoc.name} has been added to the hospital directory.`,
    });
  };

  // Delete doctor
  const deleteDoctor = (id: string) => {
    const docToDelete = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    // Unassign or keep patients intact
    toast.success('Doctor record removed', {
      description: docToDelete ? `${docToDelete.name} was removed.` : 'Record deleted.',
    });
  };

  // Update doctor
  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    toast.success('Doctor profile updated');
  };

  // Add patient
  const addPatient = (data: Omit<Patient, 'id' | 'registeredDate'>) => {
    const newPat: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPat, ...prev]);

    // Update doctor's patient count
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === data.doctorId
          ? { ...doc, patientsCount: doc.patientsCount + 1 }
          : doc
      )
    );

    toast.success('Patient admitted & registered', {
      description: `${newPat.name} assigned to ${newPat.doctorName}.`,
    });
  };

  // Delete patient
  const deletePatient = (id: string) => {
    const patToDelete = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    toast.success('Patient record archived', {
      description: patToDelete ? `${patToDelete.name}'s record removed.` : 'Record removed.',
    });
  };

  // Update patient
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    toast.success('Patient record updated');
  };

  const getDoctorById = (id: string) => doctors.find((d) => d.id === id);

  const getPatientsByDoctorId = (doctorId: string) =>
    patients.filter((p) => p.doctorId === doctorId);

  return (
    <DoctorTrackerContext.Provider
      value={{
        doctors,
        patients,
        stats,
        registrationTrends: MOCK_REGISTRATION_TREND,
        patientsPerDoctor,
        specializations: MOCK_SPECIALIZATION_DISTRIBUTION,
        addDoctor,
        deleteDoctor,
        updateDoctor,
        addPatient,
        deletePatient,
        updatePatient,
        getDoctorById,
        getPatientsByDoctorId,
      }}
    >
      {children}
    </DoctorTrackerContext.Provider>
  );
};

export const useDoctorTracker = () => {
  const context = useContext(DoctorTrackerContext);
  if (!context) {
    throw new Error('useDoctorTracker must be used within a DoctorTrackerProvider');
  }
  return context;
};
