import { baseApi } from "@/redux/api/baseApi";

export interface TransitScheduleItem {
  id: number;
  vehicleName: string;
  vehicleNameBn?: string;
  departureTime: string;
  arrivalTime?: string;
  daysOfWeek: string;
  fareEconomy?: number;
  fareBusiness?: number;
  fareVip?: number;
  cabinTypesJson?: string;
  boardingPoint?: string;
  counterPhone?: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED_DEMO" | "PENDING_REVIEW" | "REJECTED";
  dataSource: string;
  lastVerifiedAt?: string;
  route: {
    id: number;
    origin: string;
    originBn?: string;
    destination: string;
    destinationBn?: string;
    transitType: "LAUNCH" | "BUS" | "EASY_BIKE" | "FERRY";
    terminal: "BARISHAL_RIVER_PORT" | "NATHULLABAD_TERMINAL" | "RUPATALI_TERMINAL" | "OTHER";
    viaStops?: string;
    estimatedDuration?: string;
  };
  operator?: {
    id: number;
    name: string;
    nameBn?: string;
    contactPhone?: string;
    counterAddress?: string;
    websiteUrl?: string;
  };
}

export interface FareGuideItem {
  id: number;
  origin: string;
  originBn: string;
  destination: string;
  destinationBn: string;
  vehicleType: string;
  indicativeFareMin: number;
  indicativeFareMax: number;
  distanceKm?: number;
  notesBn?: string;
  notesEn?: string;
  disclaimer: string;
}

export interface KuakataPlanResponse {
  origin: string;
  originBn: string;
  destination: string;
  destinationBn: string;
  totalDurationMin: number;
  totalDurationMax: number;
  totalEstimatedHours: string;
  legs: {
    step: number;
    mode: string;
    modeBn: string;
    from: string;
    fromBn: string;
    to: string;
    toBn: string;
    estimatedDuration: string;
    estimatedDurationBn: string;
    bufferMinutes: number;
    indicativeFare: string;
    instructionsBn: string;
    instructionsEn: string;
  }[];
  disclaimerBn: string;
  disclaimerEn: string;
  lastUpdated: string;
}

export interface RideShareItem {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  vehicleType: string;
  availableSeats: number;
  contactName: string;
  contactPhone: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export const transitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransitSchedules: builder.query<TransitScheduleItem[], { type?: string; terminal?: string; search?: string }>({
      query: (params) => ({
        url: "/transit/schedules",
        method: "GET",
        params,
      }),
    }),
    getFareGuide: builder.query<FareGuideItem[], void>({
      query: () => ({
        url: "/transit/fare-guide",
        method: "GET",
      }),
    }),
    getKuakataPlan: builder.query<KuakataPlanResponse, { origin?: string }>({
      query: (params) => ({
        url: "/transit/kuakata-plan",
        method: "GET",
        params,
      }),
    }),
    getRideShares: builder.query<RideShareItem[], void>({
      query: () => ({
        url: "/transit/ride-shares",
        method: "GET",
      }),
    }),
    createRideShare: builder.mutation<RideShareItem, Partial<RideShareItem>>({
      query: (body) => ({
        url: "/transit/ride-shares",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetTransitSchedulesQuery,
  useGetFareGuideQuery,
  useGetKuakataPlanQuery,
  useGetRideSharesQuery,
  useCreateRideShareMutation,
} = transitApi;
