"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  useGetTransitSchedulesQuery,
  useGetFareGuideQuery,
  useGetKuakataPlanQuery,
  useGetRideSharesQuery,
  useCreateRideShareMutation,
  TransitScheduleItem,
} from "@/redux/features/transit/transitApi";
import {
  Ship,
  Bus,
  Car,
  Compass,
  Users,
  Clock,
  MapPin,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  Search,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TransitHub({ initialTab = "launches" }: { initialTab?: string }) {
  const { t, locale, toBnDigits, formatCurrency } = useLocale();
  const [activeTab, setActiveTab] = useState<"launches" | "buses" | "easybike" | "kuakata" | "rideshare">(
    initialTab as any || "launches"
  );
  const [busTerminalFilter, setBusTerminalFilter] = useState<string>("ALL");
  const [searchFilter, setSearchFilter] = useState("");
  const [kuakataOrigin, setKuakataOrigin] = useState<"RIVER_PORT" | "NATHULLABAD">("RIVER_PORT");

  // Ride share modal state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [rideForm, setRideForm] = useState({
    origin: "Barishal (Rupatali)",
    destination: "Kuakata Zero Point",
    departureTime: "",
    vehicleType: "MICROBUS",
    availableSeats: "3",
    contactName: "",
    contactPhone: "",
    notes: "",
  });

  // Queries
  const { data: schedules = [], isLoading: isSchedulesLoading } = useGetTransitSchedulesQuery({});
  const { data: fareGuide = [], isLoading: isFareGuideLoading } = useGetFareGuideQuery();
  const { data: kuakataPlan, isLoading: isKuakataLoading } = useGetKuakataPlanQuery({ origin: kuakataOrigin });
  const { data: rideShares = [], isLoading: isRidesLoading } = useGetRideSharesQuery();
  const [createRideShare, { isLoading: isPostingRide }] = useCreateRideShareMutation();

  // Filtered schedules
  const launches = schedules.filter((s) => s.route.transitType === "LAUNCH");
  const buses = schedules.filter((s) => {
    if (s.route.transitType !== "BUS") return false;
    if (busTerminalFilter === "NATHULLABAD") return s.route.terminal === "NATHULLABAD_TERMINAL";
    if (busTerminalFilter === "RUPATALI") return s.route.terminal === "RUPATALI_TERMINAL";
    return true;
  });

  const filterBySearch = (item: TransitScheduleItem) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      item.vehicleName.toLowerCase().includes(query) ||
      (item.vehicleNameBn && item.vehicleNameBn.includes(query)) ||
      item.route.origin.toLowerCase().includes(query) ||
      item.route.destination.toLowerCase().includes(query) ||
      (item.route.destinationBn && item.route.destinationBn.includes(query)) ||
      (item.operator?.name && item.operator.name.toLowerCase().includes(query))
    );
  };

  const filteredLaunches = launches.filter(filterBySearch);
  const filteredBuses = buses.filter(filterBySearch);

  const handlePostRideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rideForm.contactPhone || !rideForm.contactName) {
      toast.error(locale === "bn" ? "দয়া করে নাম ও ফোন নম্বর দিন" : "Please provide name and phone number");
      return;
    }
    try {
      await createRideShare({
        ...rideForm,
        availableSeats: parseInt(rideForm.availableSeats, 10) || 1,
      }).unwrap();
      toast.success(locale === "bn" ? "রাইড শেয়ার সফলভাবে পোস্ট হয়েছে!" : "Ride share posted successfully!");
      setIsPostModalOpen(false);
      setRideForm({
        origin: "Barishal (Rupatali)",
        destination: "Kuakata Zero Point",
        departureTime: "",
        vehicleType: "MICROBUS",
        availableSeats: "3",
        contactName: "",
        contactPhone: "",
        notes: "",
      });
    } catch {
      toast.error(locale === "bn" ? "পোস্ট করতে সমস্যা হয়েছে" : "Failed to post ride share");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>{locale === "bn" ? "যাতায়াত সেবা পোর্টাল" : "Barishal Mobility Hub"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
            {t.mobility.title}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t.mobility.subtitle}
          </p>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-1.5 flex overflow-x-auto no-scrollbar gap-1">
        <button
          id="tab-btn-launches"
          onClick={() => setActiveTab("launches")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "launches"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>{t.mobility.launches}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
            {toBnDigits(launches.length)}
          </span>
        </button>

        <button
          id="tab-btn-buses"
          onClick={() => setActiveTab("buses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "buses"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>{t.mobility.buses}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
            {toBnDigits(buses.length)}
          </span>
        </button>

        <button
          id="tab-btn-easybike"
          onClick={() => setActiveTab("easybike")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "easybike"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Car className="w-4 h-4" />
          <span>{t.mobility.easyBike}</span>
        </button>

        <button
          id="tab-btn-kuakata"
          onClick={() => setActiveTab("kuakata")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "kuakata"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.mobility.kuakataPlanner}</span>
          <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full font-bold">
            {locale === "bn" ? "জনপ্রিয়" : "Hot"}
          </span>
        </button>

        <button
          id="tab-btn-rideshare"
          onClick={() => setActiveTab("rideshare")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "rideshare"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.mobility.sharedRides}</span>
        </button>
      </div>

      {/* TAB 1: LAUNCHES */}
      {activeTab === "launches" && (
        <div className="space-y-4">
          {/* Search bar and disclaimer */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={locale === "bn" ? "লঞ্চের নাম বা গন্তব্য খুঁজুন..." : "Filter launches by name or destination..."}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-100 px-3 py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.mobility.riverPort}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t.common.disclaimer}</p>
              <p>{t.mobility.scheduleDisclaimer}</p>
            </div>
          </div>

          {/* Launch Cards List */}
          {isSchedulesLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm">{t.common.loading}</div>
          ) : filteredLaunches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border text-gray-500 text-sm">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLaunches.map((launch) => {
                const cabinTiers = launch.cabinTypesJson ? JSON.parse(launch.cabinTypesJson) : [];
                return (
                  <div
                    key={launch.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Ship className="w-3.5 h-3.5" />
                          {locale === "bn" && launch.operator?.nameBn ? launch.operator.nameBn : launch.operator?.name}
                        </span>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            launch.verificationStatus === "VERIFIED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {launch.verificationStatus === "VERIFIED" ? t.common.verified : t.common.unverifiedDemo}
                        </span>
                      </div>

                      {/* Vessel Name & Route */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {locale === "bn" && launch.vehicleNameBn ? launch.vehicleNameBn : launch.vehicleName}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {locale === "bn" && launch.route.originBn ? launch.route.originBn : launch.route.origin}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="font-semibold text-gray-700">
                          {locale === "bn" && launch.route.destinationBn ? launch.route.destinationBn : launch.route.destination}
                        </span>
                        {launch.route.estimatedDuration && (
                          <span className="text-gray-400 ml-1">({launch.route.estimatedDuration})</span>
                        )}
                      </p>

                      {/* Timing & Boarding */}
                      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4 text-xs">
                        <div>
                          <span className="text-gray-500 block text-[11px] mb-0.5">{t.mobility.departure}</span>
                          <span className="font-bold text-gray-800 text-sm flex items-center gap-1 text-emerald-800">
                            <Clock className="w-3.5 h-3.5" />
                            {launch.departureTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[11px] mb-0.5">{t.mobility.arrival}</span>
                          <span className="font-medium text-gray-700">
                            {launch.arrivalTime || (locale === "bn" ? "ভোর ৫:০০-৫:৩০" : "5:00-5:30 AM")}
                          </span>
                        </div>
                        {launch.boardingPoint && (
                          <div className="col-span-2 pt-1 border-t border-gray-200/60 text-[11px] text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{launch.boardingPoint}</span>
                          </div>
                        )}
                      </div>

                      {/* Cabin Classes & Fare breakdown */}
                      <div className="space-y-1.5 mb-4">
                        <span className="text-xs font-semibold text-gray-700 block mb-1">
                          {t.mobility.cabinTypes}:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                          {cabinTiers.length > 0 ? (
                            cabinTiers.map((c: any, i: number) => (
                              <div key={i} className="bg-gray-50 border p-1.5 rounded text-center">
                                <span className="block text-[10px] text-gray-500 truncate">{c.class}</span>
                                <span className="font-bold text-emerald-700">{formatCurrency(c.price)}</span>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="bg-gray-50 border p-1.5 rounded text-center">
                                <span className="block text-[10px] text-gray-500">{t.mobility.deckFare}</span>
                                <span className="font-bold text-emerald-700">{formatCurrency(launch.fareEconomy || 350)}</span>
                              </div>
                              <div className="bg-gray-50 border p-1.5 rounded text-center">
                                <span className="block text-[10px] text-gray-500">{t.mobility.singleAc}</span>
                                <span className="font-bold text-emerald-700">{formatCurrency(launch.fareBusiness || 1400)}</span>
                              </div>
                              <div className="bg-gray-50 border p-1.5 rounded text-center">
                                <span className="block text-[10px] text-gray-500">{t.mobility.vipCabin}</span>
                                <span className="font-bold text-emerald-700">{formatCurrency(launch.fareVip || 4500)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Data Provenance & Direct Call Button */}
                    <div className="pt-3 border-t flex items-center justify-between gap-2 text-xs">
                      <div className="text-[10px] text-gray-500">
                        <span>{t.common.dataSource}: </span>
                        <span className="font-medium text-gray-700 truncate max-w-[140px] inline-block align-bottom">
                          {launch.dataSource}
                        </span>
                      </div>
                      {launch.counterPhone && (
                        <a
                          href={`tel:${launch.counterPhone}`}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t.common.callNow}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUSES */}
      {activeTab === "buses" && (
        <div className="space-y-4">
          {/* Terminal Switcher & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                id="btn-terminal-all"
                onClick={() => setBusTerminalFilter("ALL")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  busTerminalFilter === "ALL" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.common.all}
              </button>
              <button
                id="btn-terminal-nathullabad"
                onClick={() => setBusTerminalFilter("NATHULLABAD")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  busTerminalFilter === "NATHULLABAD" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.mobility.nathullabad}
              </button>
              <button
                id="btn-terminal-rupatali"
                onClick={() => setBusTerminalFilter("RUPATALI")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  busTerminalFilter === "RUPATALI" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.mobility.rupatali}
              </button>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={locale === "bn" ? "বাসের নাম বা গন্তব্য..." : "Filter buses..."}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Bus Cards List */}
          {isSchedulesLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm">{t.common.loading}</div>
          ) : filteredBuses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border text-gray-500 text-sm">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5" />
                        {locale === "bn" && bus.operator?.nameBn ? bus.operator.nameBn : bus.operator?.name}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          bus.route.terminal === "NATHULLABAD_TERMINAL"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        {bus.route.terminal === "NATHULLABAD_TERMINAL" ? "নথুল্লাবাদ টার্মিনাল" : "রূপাতলী টার্মিনাল"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {locale === "bn" && bus.vehicleNameBn ? bus.vehicleNameBn : bus.vehicleName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <span>{locale === "bn" && bus.route.originBn ? bus.route.originBn : bus.route.origin}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="font-semibold text-gray-700">
                        {locale === "bn" && bus.route.destinationBn ? bus.route.destinationBn : bus.route.destination}
                      </span>
                    </p>

                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[11px]">{t.mobility.departure}</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          {bus.departureTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[11px]">{t.mobility.fare}</span>
                        <span className="font-bold text-emerald-700 text-sm">
                          {formatCurrency(bus.fareEconomy || 500)}
                        </span>
                      </div>
                      {bus.boardingPoint && (
                        <div className="col-span-2 text-[11px] text-gray-500 pt-1 border-t flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{bus.boardingPoint}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400">{bus.dataSource}</span>
                    {bus.counterPhone && (
                      <a
                        href={`tel:${bus.counterPhone}`}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-md text-xs transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{t.common.callNow}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EASY-BIKE FARE GUIDE */}
      {activeTab === "easybike" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3.5 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t.mobility.easyBike} ({locale === "bn" ? "বরিশাল সিটি" : "Barishal City Guide"})</p>
              <p>{t.mobility.fareGuideDisclaimer}</p>
            </div>
          </div>

          {isFareGuideLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm">{t.common.loading}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fareGuide.map((fare) => (
                <div
                  key={fare.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {fare.vehicleType === "EASY_BIKE" ? "ইজি-বাইক / ব্যাটারি অটো" : fare.vehicleType}
                      </span>
                      {fare.distanceKm && (
                        <span className="text-[10px] text-gray-500">
                          ~{toBnDigits(fare.distanceKm)} {locale === "bn" ? "কিমি" : "km"}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500">{locale === "bn" ? "যাত্রার স্থান" : "From"}</p>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {locale === "bn" ? fare.originBn : fare.origin}
                      </p>
                      <p className="text-xs text-gray-500">{locale === "bn" ? "গন্তব্য" : "To"}</p>
                      <p className="text-sm font-semibold text-emerald-800">
                        {locale === "bn" ? fare.destinationBn : fare.destination}
                      </p>
                    </div>

                    {fare.notesBn && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3">
                        {locale === "bn" ? fare.notesBn : fare.notesEn || fare.notesBn}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-gray-500">{t.mobility.indicativeFare}:</span>
                    <span className="font-extrabold text-base text-emerald-700">
                      {formatCurrency(fare.indicativeFareMin)} - {formatCurrency(fare.indicativeFareMax)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: KUAKATA JOURNEY PLANNER */}
      {activeTab === "kuakata" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-5 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-lg font-bold">{t.mobility.planKuakataTrip}</h2>
            </div>
            <p className="text-xs text-teal-100 max-w-2xl mb-4">
              {locale === "bn"
                ? "বরিশাল হয়ে কুয়াকাটা ভ্রমণের নির্ভুল ধাপ, টার্মিনাল পরিবর্তন বাফার এবং বাস সংযোগ সহায়িকা।"
                : "Step-by-step connection guide from Barishal River Port / Nathullabad to Kuakata beach via Rupatali."}
            </p>

            {/* Origin Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-teal-200">
                {locale === "bn" ? "আপনি বরিশাল পৌঁছাবেন:" : "Starting point in Barishal:"}
              </span>
              <div className="inline-flex bg-teal-900/60 p-1 rounded-lg border border-teal-500/30">
                <button
                  onClick={() => setKuakataOrigin("RIVER_PORT")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    kuakataOrigin === "RIVER_PORT" ? "bg-white text-teal-900 shadow-xs" : "text-teal-200 hover:text-white"
                  }`}
                >
                  {t.mobility.riverPort}
                </button>
                <button
                  onClick={() => setKuakataOrigin("NATHULLABAD")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    kuakataOrigin === "NATHULLABAD" ? "bg-white text-teal-900 shadow-xs" : "text-teal-200 hover:text-white"
                  }`}
                >
                  {t.mobility.nathullabad}
                </button>
              </div>
            </div>
          </div>

          {/* Kuakata Itinerary Roadmap */}
          {isKuakataLoading || !kuakataPlan ? (
            <div className="text-center py-12 text-gray-500 text-sm">{t.common.loading}</div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">
                      {locale === "bn" ? "মোট আনুমানিক সময়" : "Total Estimated Duration"}
                    </span>
                    <span className="text-lg font-extrabold text-emerald-800">
                      {kuakataPlan.totalEstimatedHours}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">
                      {locale === "bn" ? "চূড়ান্ত গন্তব্য" : "Final Destination"}
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {locale === "bn" ? kuakataPlan.destinationBn : kuakataPlan.destination}
                    </span>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {kuakataPlan.legs.map((leg, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {/* Step Number Circle */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {toBnDigits(leg.step)}
                        </div>
                        {i < kuakataPlan.legs.length - 1 && (
                          <div className="w-0.5 bg-emerald-200 flex-1 my-1" />
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex-1 mb-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {locale === "bn" ? leg.fromBn : leg.from} → {locale === "bn" ? leg.toBn : leg.to}
                          </span>
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                            {locale === "bn" ? leg.modeBn : leg.mode}
                          </span>
                        </div>

                        <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                          {locale === "bn" ? leg.instructionsBn : leg.instructionsEn}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-200/60">
                          <div>
                            <span className="text-gray-500 block text-[11px]">{locale === "bn" ? "যাত্রার আনুমানিক সময়" : "Duration"}</span>
                            <span className="font-semibold text-gray-800">
                              {locale === "bn" ? leg.estimatedDurationBn : leg.estimatedDuration}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">{locale === "bn" ? "প্রস্তাবিত বাফার সময়" : "Recommended Buffer"}</span>
                            <span className="font-semibold text-amber-700">
                              +{toBnDigits(leg.bufferMinutes)} {locale === "bn" ? "মিনিট" : "mins"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[11px]">{locale === "bn" ? "আনুমানিক ভাড়া" : "Est. Fare"}</span>
                            <span className="font-bold text-emerald-700">{leg.indicativeFare}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Advice Box */}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <p className="font-bold mb-1">
                    {locale === "bn" ? "গুরুত্বপূর্ণ ট্রাভেল টিপস:" : "Important Travel Advice:"}
                  </p>
                  <p className="leading-relaxed mb-2">
                    {locale === "bn"
                      ? "লঞ্চ থেকে ভোরে নামলে কোনো দালাল বা অতিরিক্ত ভাড়ার ফাঁদে না পড়ে নদী বন্দরের বাইরে নির্ধারিত স্ট্যান্ড থেকে রূপাতলীমুখী ইজি-বাইকে উঠুন।"
                      : "Avoid intermediaries at the river port early morning; board Rupatali bound shared electric autos from the authorized stand."}
                  </p>
                  <p className="text-[11px] text-amber-800 italic">
                    {locale === "bn" ? kuakataPlan.disclaimerBn : kuakataPlan.disclaimerEn}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SHARED RIDES */}
      {activeTab === "rideshare" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">{t.mobility.rideShareBoard}</h2>
              <p className="text-xs text-gray-500">
                {locale === "bn"
                  ? "স্থানীয় বাসিন্দা ও যাত্রীদের পারস্পরিক রাইড শেয়ার তালিকা (নন-কমার্শিয়াল)"
                  : "Community carpool and shared seats for Kuakata, Dhaka and nearby districts"}
              </p>
            </div>

            <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>{t.mobility.postRide}</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">
                    {t.mobility.postRide}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handlePostRideSubmit} className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">{t.mobility.origin}</label>
                    <input
                      type="text"
                      required
                      value={rideForm.origin}
                      onChange={(e) => setRideForm({ ...rideForm, origin: e.target.value })}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 block mb-1">{t.mobility.destination}</label>
                    <input
                      type="text"
                      required
                      value={rideForm.destination}
                      onChange={(e) => setRideForm({ ...rideForm, destination: e.target.value })}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1">{t.mobility.departureTime}</label>
                      <input
                        type="datetime-local"
                        required
                        value={rideForm.departureTime}
                        onChange={(e) => setRideForm({ ...rideForm, departureTime: e.target.value })}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1">{t.mobility.availableSeats}</label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={rideForm.availableSeats}
                        onChange={(e) => setRideForm({ ...rideForm, availableSeats: e.target.value })}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-medium text-gray-700 block mb-1">
                        {locale === "bn" ? "আপনার নাম" : "Your Name"}
                      </label>
                      <input
                        type="text"
                        required
                        value={rideForm.contactName}
                        onChange={(e) => setRideForm({ ...rideForm, contactName: e.target.value })}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-gray-700 block mb-1">
                        {locale === "bn" ? "ফোন নম্বর" : "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={rideForm.contactPhone}
                        onChange={(e) => setRideForm({ ...rideForm, contactPhone: e.target.value })}
                        className="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 block mb-1">{t.mobility.notes}</label>
                    <textarea
                      rows={2}
                      value={rideForm.notes}
                      onChange={(e) => setRideForm({ ...rideForm, notes: e.target.value })}
                      placeholder={locale === "bn" ? "গাড়ির ধরন, লাগেজ স্পেস ও বিশেষ শর্ত..." : "Vehicle model, luggage space, conditions..."}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPostingRide}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors mt-2"
                  >
                    {isPostingRide ? t.common.loading : t.common.submit}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* List of Ride Shares */}
          {isRidesLoading ? (
            <div className="text-center py-12 text-gray-500 text-sm">{t.common.loading}</div>
          ) : rideShares.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border text-gray-500 text-sm">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rideShares.map((ride) => (
                <div key={ride.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {ride.vehicleType}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {toBnDigits(ride.availableSeats)} {locale === "bn" ? "সিট খালি" : "seats left"}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {ride.origin} → {ride.destination}
                  </p>
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(ride.departureTime).toLocaleDateString()}</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400 ml-2" />
                    <span>{new Date(ride.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </p>

                  {ride.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3 italic">
                      &ldquo;{ride.notes}&rdquo;
                    </p>
                  )}

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-gray-500">{ride.contactName}</span>
                    <a
                      href={`tel:${ride.contactPhone}`}
                      className="inline-flex items-center gap-1 bg-emerald-600 text-white font-semibold px-2.5 py-1 rounded text-xs hover:bg-emerald-700"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{t.common.callNow}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
