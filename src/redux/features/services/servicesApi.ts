import { baseApi } from "@/redux/api/baseApi";

export interface ServiceCategory {
  id: number;
  slug: string;
  name: string;
  nameBn: string;
  icon?: string;
  descriptionBn?: string;
  providerCount?: number;
}

export interface LocalServiceProvider {
  id: number;
  name: string;
  nameBn: string;
  categoryId: number;
  category: ServiceCategory;
  phone: string;
  whatsapp?: string;
  area: string;
  areaBn: string;
  address?: string;
  addressBn?: string;
  experienceYears?: number;
  rating: number;
  reviewCount: number;
  isEmergency: boolean;
  pricingNoteBn?: string;
  pricingNoteEn?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED_DEMO" | "PENDING_REVIEW" | "REJECTED";
  dataSource: string;
}

export interface MerchantCategory {
  id: number;
  slug: string;
  name: string;
  nameBn: string;
  icon?: string;
  merchantCount?: number;
}

export interface LocalMerchant {
  id: number;
  name: string;
  nameBn: string;
  categoryId: number;
  category: MerchantCategory;
  taglineBn?: string;
  taglineEn?: string;
  area: string;
  areaBn: string;
  address: string;
  addressBn: string;
  phone?: string;
  openingHoursBn?: string;
  openingHoursEn?: string;
  specialtiesBn?: string;
  specialtiesEn?: string;
  isFeatured: boolean;
  verificationStatus: "VERIFIED" | "UNVERIFIED_DEMO" | "PENDING_REVIEW";
  dataSource: string;
}

export interface CommunityNotice {
  id: number;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  sourceOrganization: string;
  sourceOrganizationEn?: string;
  severity: "INFO" | "WARNING" | "EMERGENCY";
  actionUrl?: string;
  actionPhone?: string;
  expiresAt?: string;
  isPinned: boolean;
  verificationStatus: "VERIFIED" | "UNVERIFIED_DEMO";
  createdAt: string;
}

export interface RegisterProviderInput {
  name: string;
  nameBn: string;
  categorySlug: string;
  phone: string;
  whatsapp?: string;
  area: string;
  areaBn: string;
  address?: string;
  experienceYears?: number;
  isEmergency?: boolean;
  pricingNoteBn?: string;
  descriptionBn?: string;
}

export interface InaccuracyReportInput {
  entityType: string;
  entityId: number;
  reporterName?: string;
  reporterPhone?: string;
  issueDescription: string;
}

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCategories: builder.query<ServiceCategory[], void>({
      query: () => ({ url: "/services-directory/service-categories" }),
      providesTags: ["Services"],
    }),

    getProviders: builder.query<
      LocalServiceProvider[],
      { categorySlug?: string; area?: string; search?: string; emergencyOnly?: boolean }
    >({
      query: (params) => ({
        url: "/services-directory/providers",
        params,
      }),
      providesTags: ["Services"],
    }),

    getProviderById: builder.query<LocalServiceProvider, number>({
      query: (id) => ({ url: `/services-directory/providers/${id}` }),
      providesTags: ["Services"],
    }),

    registerProvider: builder.mutation<
      { success: boolean; message: string; provider: LocalServiceProvider },
      RegisterProviderInput
    >({
      query: (body) => ({
        url: "/services-directory/register-provider",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),

    getMerchantCategories: builder.query<MerchantCategory[], void>({
      query: () => ({ url: "/services-directory/merchant-categories" }),
      providesTags: ["Services"],
    }),

    getMerchants: builder.query<
      LocalMerchant[],
      { categorySlug?: string; area?: string; search?: string; featuredOnly?: boolean }
    >({
      query: (params) => ({
        url: "/services-directory/merchants",
        params,
      }),
      providesTags: ["Services"],
    }),

    getMerchantById: builder.query<LocalMerchant, number>({
      query: (id) => ({ url: `/services-directory/merchants/${id}` }),
      providesTags: ["Services"],
    }),

    getCommunityNotices: builder.query<
      CommunityNotice[],
      { severity?: string; search?: string }
    >({
      query: (params) => ({
        url: "/services-directory/notices",
        params,
      }),
      providesTags: ["Services"],
    }),

    reportInaccuracy: builder.mutation<
      { success: boolean; message: string; reportId: number },
      InaccuracyReportInput
    >({
      query: (body) => ({
        url: "/services-directory/report-inaccuracy",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetServiceCategoriesQuery,
  useGetProvidersQuery,
  useGetProviderByIdQuery,
  useRegisterProviderMutation,
  useGetMerchantCategoriesQuery,
  useGetMerchantsQuery,
  useGetMerchantByIdQuery,
  useGetCommunityNoticesQuery,
  useReportInaccuracyMutation,
} = servicesApi;
