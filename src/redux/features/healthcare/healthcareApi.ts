import { baseApi } from "@/redux/api/baseApi";

export interface HospitalDeskItem {
  id: number;
  name: string;
  nameBn: string;
  type: string;
  address: string;
  addressBn: string;
  emergencyPhone: string;
  bloodBankPhone?: string;
  ambulanceDeskPhone?: string;
  outdoorTicketFee: number;
  outdoorTicketHoursBn: string;
  outdoorTicketHoursEn: string;
  emergencyHours: string;
  emergencyGuideBn?: string;
  emergencyGuideEn?: string;
}

export interface DoctorSpecialtyItem {
  id: number;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  description?: string;
  doctorCount: number;
}

export interface DoctorChamberItem {
  id: number;
  doctorId: number;
  hospitalOrClinicName: string;
  hospitalOrClinicNameBn?: string;
  address: string;
  addressBn?: string;
  roomNumber?: string;
  visitingDays: string;
  visitingDaysBn?: string;
  visitingHours: string;
  visitingHoursBn?: string;
  newPatientFee: number;
  returnPatientFee?: number;
  serialPhone: string;
  serialInstruction?: string;
  serialInstructionBn?: string;
  isDirectBookingEnabled: boolean;
}

export interface DoctorItem {
  id: number;
  name: string;
  nameBn?: string;
  degrees: string;
  degreesBn?: string;
  designation: string;
  designationBn?: string;
  institution: string;
  institutionBn?: string;
  specialtyId: number;
  specialty: DoctorSpecialtyItem;
  experienceYears?: number;
  bmdcRegNumber?: string;
  photoUrl?: string;
  gender?: string;
  bio?: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED_DEMO" | "PENDING_REVIEW" | "REJECTED";
  dataSource: string;
  lastVerifiedAt?: string;
  chambers: DoctorChamberItem[];
}

export interface AppointmentBookingItem {
  id: number;
  bookingCode: string;
  doctorId: number;
  chamberId: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  appointmentDate: string;
  chiefComplaint?: string;
  status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  estimatedSerialNo?: number;
  adminNotes?: string;
  createdAt: string;
  doctor: DoctorItem;
  chamber: DoctorChamberItem;
}

export interface DiagnosticTestItem {
  id: number;
  testName: string;
  testNameBn: string;
  category: string;
  indicativeFeeMin: number;
  indicativeFeeMax: number;
  turnaroundHours?: number;
  preparationEn?: string;
  preparationBn?: string;
  dataSource: string;
}

export interface BloodDonorItem {
  id: number;
  name: string;
  bloodGroup: string;
  phone: string;
  area: string;
  areaBn?: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  consentToPublish: boolean;
}

export interface CreateAppointmentPayload {
  doctorId: number;
  chamberId: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  appointmentDate: string;
  chiefComplaint?: string;
}

export interface RegisterBloodDonorPayload {
  name: string;
  bloodGroup: string;
  phone: string;
  area: string;
  areaBn?: string;
  lastDonationDate?: string;
}

export const healthcareApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHospitalDesks: builder.query<HospitalDeskItem[], void>({
      query: () => ({ url: "/healthcare/hospital-desks" }),
      providesTags: ["Healthcare"],
    }),

    getSpecialties: builder.query<DoctorSpecialtyItem[], void>({
      query: () => ({ url: "/healthcare/specialties" }),
      providesTags: ["Healthcare"],
    }),

    getDoctors: builder.query<
      DoctorItem[],
      { specialtyId?: number; search?: string; day?: string; area?: string }
    >({
      query: (params) => ({
        url: "/healthcare/doctors",
        params,
      }),
      providesTags: ["Healthcare"],
    }),

    getDoctorById: builder.query<DoctorItem, number>({
      query: (id) => ({ url: `/healthcare/doctors/${id}` }),
      providesTags: ["Healthcare"],
    }),

    createAppointment: builder.mutation<AppointmentBookingItem, CreateAppointmentPayload>({
      query: (body) => ({
        url: "/healthcare/appointments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Healthcare"],
    }),

    getAppointmentByCode: builder.query<AppointmentBookingItem, string>({
      query: (code) => ({ url: `/healthcare/appointments/${code}` }),
      providesTags: ["Healthcare"],
    }),

    getDiagnosticTests: builder.query<
      DiagnosticTestItem[],
      { category?: string; search?: string } | void
    >({
      query: (params) => ({
        url: "/healthcare/diagnostic-tests",
        params: params || {},
      }),
      providesTags: ["Healthcare"],
    }),

    getBloodDonors: builder.query<
      BloodDonorItem[],
      { bloodGroup?: string; area?: string } | void
    >({
      query: (params) => ({
        url: "/healthcare/blood-donors",
        params: params || {},
      }),
      providesTags: ["Healthcare"],
    }),

    registerBloodDonor: builder.mutation<BloodDonorItem, RegisterBloodDonorPayload>({
      query: (body) => ({
        url: "/healthcare/blood-donors",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Healthcare"],
    }),
  }),
});

export const {
  useGetHospitalDesksQuery,
  useGetSpecialtiesQuery,
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateAppointmentMutation,
  useLazyGetAppointmentByCodeQuery,
  useGetDiagnosticTestsQuery,
  useGetBloodDonorsQuery,
  useRegisterBloodDonorMutation,
} = healthcareApi;
