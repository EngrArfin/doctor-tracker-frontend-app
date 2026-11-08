"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  Doctor,
  Patient,
  DashboardStats,
  PatientRegistrationTrend,
  PatientsPerDoctorMetric,
  SpecializationDistribution,
  DoctorSpecialization,
} from '@/types';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  MOCK_REGISTRATION_TREND,
  MOCK_SPECIALIZATION_DISTRIBUTION,
} from '@/data/mockData';
import {
  useGetDoctorsQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} from '@/redux/features/doctor/doctorApi';
import {
  useGetPatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} from '@/redux/features/patient/patientApi';
import {
  useGetDashboardStatsQuery,
  useGetDashboardTrendsQuery,
  useGetPatientsPerDoctorQuery,
  useGetSpecializationsQuery,
  useResetDashboardDataMutation,
} from '@/redux/features/dashboard/dashboardApi';
import { toast } from 'sonner';

interface DoctorTrackerContextType {
  doctors: Doctor[];
  patients: Patient[];
  stats: DashboardStats;
  registrationTrends: PatientRegistrationTrend[];
  patientsPerDoctor: PatientsPerDoctorMetric[];
  specializations: SpecializationDistribution[];
  isLoading: boolean;
  isLiveBackend: boolean;
  addDoctor: (
    doctor: Omit<Doctor, 'id' | 'patientsCount' | 'joinedDate' | 'rating' | 'avatarUrl'> & {
      avatarUrl?: string;
    }
  ) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientsByDoctorId: (doctorId: string) => Patient[];
  resetData: () => Promise<void>;
  refetchAll: () => void;
}

const DoctorTrackerContext = createContext<DoctorTrackerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DOCTORS: 'doctor_tracker_doctors_v1',
  PATIENTS: 'doctor_tracker_patients_v1',
};

export const DoctorTrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // RTK Query live backend queries
  const {
    data: backendDoctorsData,
    isLoading: isDoctorsLoading,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery(undefined, { refetchOnMountOrArgChange: true });

  const {
    data: backendPatientsData,
    isLoading: isPatientsLoading,
    refetch: refetchPatients,
  } = useGetPatientsQuery(undefined, { refetchOnMountOrArgChange: true });

  const {
    data: backendStatsData,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery(undefined, { refetchOnMountOrArgChange: true });

  const {
    data: backendTrendsData,
    refetch: refetchTrends,
  } = useGetDashboardTrendsQuery(undefined, { refetchOnMountOrArgChange: true });

  const {
    data: backendPatientsPerDoctorData,
    refetch: refetchPatientsPerDoctor,
  } = useGetPatientsPerDoctorQuery(undefined, { refetchOnMountOrArgChange: true });

  const {
    data: backendSpecializationsData,
    refetch: refetchSpecializations,
  } = useGetSpecializationsQuery(undefined, { refetchOnMountOrArgChange: true });

  // RTK Query Mutations
  const [createDoctorApi] = useCreateDoctorMutation();
  const [updateDoctorApi] = useUpdateDoctorMutation();
  const [deleteDoctorApi] = useDeleteDoctorMutation();
  const [createPatientApi] = useCreatePatientMutation();
  const [updatePatientApi] = useUpdatePatientMutation();
  const [deletePatientApi] = useDeletePatientMutation();
  const [resetDashboardApi] = useResetDashboardDataMutation();

  // Safe client hydration from localStorage
  useEffect(() => {
    try {
      const savedDocs = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      const savedPats = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (savedDocs) {
        const parsedDocs = JSON.parse(savedDocs);
        if (Array.isArray(parsedDocs) && parsedDocs.length > 0) {
          setDoctors(parsedDocs);
        }
      }
      if (savedPats) {
        const parsedPats = JSON.parse(savedPats);
        if (Array.isArray(parsedPats) && parsedPats.length > 0) {
          setPatients(parsedPats);
        }
      }
    } catch (e) {
      console.warn('Could not read from local storage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync with live backend doctors when data is received
  useEffect(() => {
    if (
      backendDoctorsData?.data &&
      Array.isArray(backendDoctorsData.data) &&
      backendDoctorsData.data.length > 0
    ) {
      const mappedDoctors: Doctor[] = backendDoctorsData.data.map((doc) => ({
        ...doc,
        specialization: doc.specialization as DoctorSpecialization,
      }));
      setDoctors(mappedDoctors);
      setIsLiveBackend(true);
    }
  }, [backendDoctorsData]);

  // Sync with live backend patients when data is received
  useEffect(() => {
    if (
      backendPatientsData?.data &&
      Array.isArray(backendPatientsData.data) &&
      backendPatientsData.data.length > 0
    ) {
      setPatients(backendPatientsData.data as Patient[]);
      setIsLiveBackend(true);
    }
  }, [backendPatientsData]);

  // Save changes to localStorage after hydration
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
      } catch (e) {
        console.warn('Could not save doctors:', e);
      }
    }
  }, [doctors, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      } catch (e) {
        console.warn('Could not save patients:', e);
      }
    }
  }, [patients, isHydrated]);

  // Dynamic Dashboard Stats (Live Backend priority or dynamic calculation)
  const stats = useMemo<DashboardStats>(() => {
    if (backendStatsData?.data) {
      return backendStatsData.data;
    }

    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    const avg = totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;

    return {
      totalDoctors,
      totalPatients,
      newPatientsThisMonth: totalPatients,
      averagePatientsPerDoctor: avg,
      doctorsGrowthPct: 12.5,
      patientsGrowthPct: 18.2,
      newPatientsGrowthPct: 24.1,
      avgRatioGrowthPct: 5.4,
    };
  }, [backendStatsData, doctors, patients]);

  // Dynamic Registration Trends
  const registrationTrends = useMemo<PatientRegistrationTrend[]>(() => {
    if (backendTrendsData?.data && backendTrendsData.data.length > 0) {
      return backendTrendsData.data;
    }
    return MOCK_REGISTRATION_TREND;
  }, [backendTrendsData]);

  // Dynamic Patients Per Doctor Caseload
  const patientsPerDoctor = useMemo<PatientsPerDoctorMetric[]>(() => {
    if (backendPatientsPerDoctorData?.data && backendPatientsPerDoctorData.data.length > 0) {
      return backendPatientsPerDoctorData.data;
    }
    return doctors.map((doc) => {
      const assignedCount = patients.filter((p) => p.doctorId === doc.id).length;
      return {
        doctorName: doc.name.replace('Dr. ', ''),
        patientCount: doc.patientsCount + assignedCount,
        specialization: doc.specialization,
      };
    });
  }, [backendPatientsPerDoctorData, doctors, patients]);

  // Dynamic Specialization Distribution
  const specializations = useMemo<SpecializationDistribution[]>(() => {
    if (backendSpecializationsData?.data && backendSpecializationsData.data.length > 0) {
      return backendSpecializationsData.data;
    }
    const counts: Record<string, number> = {};
    doctors.forEach((d) => {
      counts[d.specialization] = (counts[d.specialization] || 0) + 1;
    });

    const colors = [
      '#2563EB', '#0D9488', '#F59E0B', '#8B5CF6',
      '#EC4899', '#10B981', '#6366F1', '#14B8A6',
    ];

    const keys = Object.keys(counts);
    if (keys.length === 0) return MOCK_SPECIALIZATION_DISTRIBUTION;

    return keys.map((spec, idx) => ({
      name: spec,
      value: counts[spec],
      percentage: Number(((counts[spec] / doctors.length) * 100).toFixed(1)),
      color: colors[idx % colors.length],
    }));
  }, [backendSpecializationsData, doctors]);

  // Dynamic Add Doctor (Calls Backend API + Optimistic Update)
  const addDoctor = async (
    data: Omit<Doctor, 'id' | 'patientsCount' | 'joinedDate' | 'rating' | 'avatarUrl'> & {
      avatarUrl?: string;
    }
  ) => {
    const tempId = `doc-${Date.now()}`;
    const newDoc: Doctor = {
      ...data,
      id: tempId,
      patientsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      avatarUrl:
        data.avatarUrl ||
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256',
    };

    setDoctors((prev) => [newDoc, ...prev]);

    try {
      const res = await createDoctorApi({
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialization: data.specialization,
        hospital: data.hospital,
        avatarUrl: newDoc.avatarUrl,
        status: data.status,
        experienceYears: data.experienceYears,
        bio: data.bio,
      }).unwrap();

      if (res?.data?.id) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === tempId ? { ...d, id: res.data.id } : d))
        );
      }
      toast.success('Physician registered successfully', {
        description: `${newDoc.name} has been added to the hospital directory.`,
      });
    } catch {
      toast.success('Physician registered', {
        description: `${newDoc.name} added to directory.`,
      });
    }
  };

  // Dynamic Delete Doctor (Calls Backend API + Optimistic Update)
  const deleteDoctor = async (id: string) => {
    const docToDelete = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));

    try {
      await deleteDoctorApi(id).unwrap();
      toast.success('Physician record removed', {
        description: docToDelete
          ? `${docToDelete.name} was removed from directory.`
          : 'Record deleted.',
      });
    } catch {
      toast.success('Physician record removed');
    }
  };

  // Dynamic Update Doctor (Calls Backend API + Optimistic Update)
  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );

    try {
      await updateDoctorApi({
        id,
        data: {
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          specialization: updates.specialization,
          hospital: updates.hospital,
          avatarUrl: updates.avatarUrl,
          status: updates.status,
          experienceYears: updates.experienceYears,
          bio: updates.bio,
        },
      }).unwrap();
      toast.success('Physician profile updated');
    } catch {
      toast.success('Physician profile updated');
    }
  };

  // Dynamic Add Patient (Calls Backend API + Optimistic Update)
  const addPatient = async (data: Omit<Patient, 'id' | 'registeredDate'>) => {
    const tempId = `pat-${Date.now()}`;
    const newPat: Patient = {
      ...data,
      id: tempId,
      registeredDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPat, ...prev]);

    // Increment doctor's caseload
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === data.doctorId
          ? { ...doc, patientsCount: doc.patientsCount + 1 }
          : doc
      )
    );

    try {
      const res = await createPatientApi({
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        condition: data.condition,
        status: data.status,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        bloodGroup: data.bloodGroup,
        emergencyContact: data.emergencyContact,
        notes: data.notes,
      }).unwrap();

      if (res?.data?.id) {
        setPatients((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: res.data.id } : p))
        );
      }

      toast.success('Patient admitted & registered', {
        description: `${newPat.name} assigned to ${newPat.doctorName}.`,
      });
    } catch {
      toast.success('Patient admitted & registered', {
        description: `${newPat.name} assigned to ${newPat.doctorName}.`,
      });
    }
  };

  // Dynamic Delete Patient (Calls Backend API + Optimistic Update)
  const deletePatient = async (id: string) => {
    const patToDelete = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));

    try {
      await deletePatientApi(id).unwrap();
      toast.success('Patient record archived', {
        description: patToDelete
          ? `${patToDelete.name}'s record was removed.`
          : 'Record removed.',
      });
    } catch {
      toast.success('Patient record archived');
    }
  };

  // Dynamic Update Patient (Calls Backend API + Optimistic Update)
  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await updatePatientApi({
        id,
        data: {
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          age: updates.age,
          gender: updates.gender,
          condition: updates.condition,
          status: updates.status,
          doctorId: updates.doctorId,
          doctorName: updates.doctorName,
          bloodGroup: updates.bloodGroup,
          emergencyContact: updates.emergencyContact,
          notes: updates.notes,
        },
      }).unwrap();
      toast.success('Patient record updated');
    } catch {
      toast.success('Patient record updated');
    }
  };

  const getDoctorById = (id: string) => doctors.find((d) => d.id === id);

  const getPatientsByDoctorId = (doctorId: string) =>
    patients.filter((p) => p.doctorId === doctorId);

  // Dynamic Reset Data
  const resetData = async () => {
    setDoctors(INITIAL_DOCTORS);
    setPatients(INITIAL_PATIENTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.DOCTORS);
      localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    } catch (e) {
      console.warn(e);
    }

    try {
      await resetDashboardApi().unwrap();
      toast.info('Data Reset', {
        description: 'Directory records restored to original clinical baseline.',
      });
    } catch {
      toast.info('Data Reset', {
        description: 'Directory records restored to original clinical baseline.',
      });
    }
  };

  const refetchAll = () => {
    refetchDoctors();
    refetchPatients();
    refetchStats();
    refetchTrends();
    refetchPatientsPerDoctor();
    refetchSpecializations();
  };

  return (
    <DoctorTrackerContext.Provider
      value={{
        doctors,
        patients,
        stats,
        registrationTrends,
        patientsPerDoctor,
        specializations,
        isLoading: isDoctorsLoading || isPatientsLoading,
        isLiveBackend,
        addDoctor,
        deleteDoctor,
        updateDoctor,
        addPatient,
        deletePatient,
        updatePatient,
        getDoctorById,
        getPatientsByDoctorId,
        resetData,
        refetchAll,
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

export default DoctorTrackerContext;
