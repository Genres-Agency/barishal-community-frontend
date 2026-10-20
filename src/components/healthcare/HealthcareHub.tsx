"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  useGetSpecialtiesQuery,
  useGetDoctorsQuery,
  useGetHospitalDesksQuery,
  useGetDiagnosticTestsQuery,
  useGetBloodDonorsQuery,
  DoctorItem,
} from "@/redux/features/healthcare/healthcareApi";
import {
  Stethoscope,
  Building2,
  TestTube2,
  Heart,
  PhoneCall,
  Search,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  Info,
  Activity,
  Plus,
  HeartPulse,
  BadgeAlert,
  Ticket,
} from "lucide-react";
import AppointmentModal from "./AppointmentModal";
import SerialTrackerModal from "./SerialTrackerModal";
import BloodDonorModal from "./BloodDonorModal";

export default function HealthcareHub({
  initialTab = "doctors",
}: {
  initialTab?: string;
}) {
  const { t, locale, toBnDigits, formatCurrency } = useLocale();
  const [activeTab, setActiveTab] = useState<"doctors" | "sbmch" | "diagnostics" | "blood">(
    (initialTab as any) || "doctors"
  );

  // Filters
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(null);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedTestCategory, setSelectedTestCategory] = useState("ALL");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("ALL");

  // Modals
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorItem | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  // Queries
  const { data: specialties = [], isLoading: isSpecsLoading } = useGetSpecialtiesQuery();
  const { data: doctors = [], isLoading: isDocsLoading } = useGetDoctorsQuery({
    specialtyId: selectedSpecialtyId || undefined,
    search: doctorSearch.trim() || undefined,
  });
  const { data: hospitalDesks = [], isLoading: isDesksLoading } = useGetHospitalDesksQuery();
  const { data: diagnosticTests = [], isLoading: isTestsLoading } = useGetDiagnosticTestsQuery({
    category: selectedTestCategory,
  });
  const { data: bloodDonors = [], isLoading: isDonorsLoading } = useGetBloodDonorsQuery({
    bloodGroup: selectedBloodGroup,
  });

  const sbmchDesk = hospitalDesks[0];

  return (
    <div className="space-y-6">
      {/* Healthcare Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-cyan-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold mb-3">
              <Stethoscope className="w-4 h-4 text-teal-300" />
              <span>{locale === "bn" ? "স্বাস্থ্যসেবা ও ডাক্তার পোর্টাল" : "Healthcare & Medical Services"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
              {t.healthcare.title}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
              {t.healthcare.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-open-serial-tracker"
              onClick={() => setIsTrackerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-md shadow-sm"
            >
              <FileSearch className="w-4 h-4 text-teal-300" />
              <span>{t.healthcare.trackSerial}</span>
            </button>
            <button
              id="btn-open-blood-donor-modal"
              onClick={() => setIsDonorModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t.healthcare.registerAsDonor}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-1.5 flex overflow-x-auto no-scrollbar gap-1">
        <button
          id="tab-btn-doctors"
          onClick={() => setActiveTab("doctors")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "doctors"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{t.healthcare.doctors}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
            {toBnDigits(doctors.length)}
          </span>
        </button>

        <button
          id="tab-btn-sbmch"
          onClick={() => setActiveTab("sbmch")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "sbmch"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.healthcare.sbmchHub}</span>
          <span className="text-[10px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
            ২৪/৭
          </span>
        </button>

        <button
          id="tab-btn-diagnostics"
          onClick={() => setActiveTab("diagnostics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "diagnostics"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <TestTube2 className="w-4 h-4" />
          <span>{t.healthcare.diagnosticTests}</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
            ৳
          </span>
        </button>

        <button
          id="tab-btn-blood"
          onClick={() => setActiveTab("blood")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === "blood"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>{t.healthcare.bloodDonors}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
            {toBnDigits(bloodDonors.length)}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DOCTORS & CHAMBERS */}
      {/* ======================================================== */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              id="spec-pill-all"
              onClick={() => setSelectedSpecialtyId(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialtyId === null
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.healthcare.allSpecialties}
            </button>
            {specialties.map((spec) => (
              <button
                key={spec.id}
                id={`spec-pill-${spec.slug}`}
                onClick={() => setSelectedSpecialtyId(spec.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialtyId === spec.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {locale === "bn" ? spec.nameBn : spec.name}
                {spec.doctorCount > 0 && (
                  <span className="ml-1 text-[10px] opacity-80">({toBnDigits(spec.doctorCount)})</span>
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="input-search-doctors"
              type="text"
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              placeholder={t.healthcare.searchDoctorPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>

          {/* Doctors Grid */}
          {isDocsLoading ? (
            <div className="text-center py-12 text-gray-500 text-xs sm:text-sm">
              {t.common.loading}...
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border text-gray-500 text-xs sm:text-sm">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => {
                const primaryChamber = doc.chambers[0];
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Doctor Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                            {doc.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                              {locale === "bn" && doc.nameBn ? doc.nameBn : doc.name}
                            </h3>
                            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                              {locale === "bn" && doc.degreesBn ? doc.degreesBn : doc.degrees}
                            </p>
                            <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                              {locale === "bn" && doc.designationBn ? doc.designationBn : doc.designation}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium">
                              {locale === "bn" && doc.institutionBn ? doc.institutionBn : doc.institution}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{t.common.verified}</span>
                        </span>
                      </div>

                      {/* Primary Chamber Card */}
                      {primaryChamber && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs space-y-2 mb-3">
                          <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                              {locale === "bn" && primaryChamber.hospitalOrClinicNameBn
                                ? primaryChamber.hospitalOrClinicNameBn
                                : primaryChamber.hospitalOrClinicName}
                            </span>
                            {primaryChamber.roomNumber && (
                              <span className="text-gray-500 font-normal">
                                ({primaryChamber.roomNumber})
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {locale === "bn" && primaryChamber.visitingDaysBn
                                ? primaryChamber.visitingDaysBn
                                : primaryChamber.visitingDays}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {locale === "bn" && primaryChamber.visitingHoursBn
                                ? primaryChamber.visitingHoursBn
                                : primaryChamber.visitingHours}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-[11px]">
                            <div>
                              <span className="text-gray-500">{t.healthcare.newPatientFee}: </span>
                              <span className="font-bold text-emerald-800">
                                {formatCurrency(primaryChamber.newPatientFee)}
                              </span>
                            </div>
                            {primaryChamber.returnPatientFee && (
                              <div>
                                <span className="text-gray-500">{t.healthcare.returnPatientFee}: </span>
                                <span className="font-semibold text-gray-700">
                                  {formatCurrency(primaryChamber.returnPatientFee)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t flex items-center justify-between gap-2">
                      {primaryChamber?.serialPhone && (
                        <a
                          id={`call-doc-${doc.id}`}
                          href={`tel:${primaryChamber.serialPhone}`}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-emerald-800 font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{primaryChamber.serialPhone}</span>
                        </a>
                      )}

                      <button
                        id={`btn-book-serial-${doc.id}`}
                        onClick={() => setSelectedDoctorForBooking(doc)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors ml-auto"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{t.healthcare.requestSerial}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SBMCH SHER-E-BANGLA MEDICAL COLLEGE HUB */}
      {/* ======================================================== */}
      {activeTab === "sbmch" && (
        <div className="space-y-6">
          {/* Emergency 24/7 Casualty Banner */}
          <div className="bg-gradient-to-r from-red-700 to-rose-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold mb-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span>{t.healthcare.emergencyCasualty}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {locale === "bn"
                    ? "শের-ই-বাংলা মেডিকেল কলেজ ও হাসপাতাল (SBMCH) জরুরি বিভাগ"
                    : "SBMCH 24/7 Emergency Casualty Department"}
                </h2>
                <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
                  {locale === "bn"
                    ? "বান্দ রোড, বরিশাল। সড়ক দুর্ঘটনা, বিষক্রিয়া, স্ট্রোক ও তীব্র শারীরিক অসুস্থতায় ২৪/৭ নিরবচ্ছিন্ন সেবা।"
                    : "Band Road, Barishal. Continuous 24/7 emergency care for trauma, accidents, and acute illness."}
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <a
                  id="btn-call-sbmch-emergency"
                  href={`tel:${sbmchDesk?.emergencyPhone || "01712-000000"}`}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-700 font-extrabold px-5 py-3 rounded-xl shadow-lg transition-colors text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>{locale === "bn" ? "জরুরি বিভাগে কল করুন: " : "Call Emergency: "} {sbmchDesk?.emergencyPhone || "01712-000000"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Helplines Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-1">
                <HeartPulse className="w-4 h-4" />
                <span>{t.healthcare.bloodBank}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {locale === "bn" ? "SBMCH ২য় তলা, রেড ক্রিসেন্ট ব্লাড ব্যাংক" : "SBMCH 2nd Floor, Red Crescent Blood Bank"}
              </p>
              <a
                href={`tel:${sbmchDesk?.bloodBankPhone || "01712-111111"}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{sbmchDesk?.bloodBankPhone || "01712-111111"}</span>
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.healthcare.ambulanceDesk}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {locale === "bn" ? "হাসপাতাল গেট সংলগ্ন সার্বক্ষণিক স্ট্যান্ড" : "Hospital main gate ambulance stand"}
              </p>
              <a
                href={`tel:${sbmchDesk?.ambulanceDeskPhone || "01711-123456"}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{sbmchDesk?.ambulanceDeskPhone || "01711-123456"}</span>
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
                <Ticket className="w-4 h-4" />
                <span>{t.healthcare.outdoorTicketGuide}</span>
              </div>
              <p className="text-xs text-emerald-800 font-bold mb-1">
                {t.healthcare.outdoorFee}
              </p>
              <p className="text-[11px] text-gray-500">
                {sbmchDesk?.outdoorTicketHoursBn || "সকাল ৮:৩০ - দুপুর ১:৩০ (শনি - বৃহস্পতি)"}
              </p>
            </div>
          </div>

          {/* SBMCH Outdoor Ticket Step-by-Step Guide */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" />
                <span>{locale === "bn" ? "SBMCH সরকারি আউটডোর রোগী দেখার নিয়মাবলী" : "SBMCH Government Outdoor Patient Guide"}</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "bn"
                  ? "মধ্যস্থতাকারী বা দালাল ছাড়াই সাধারণ নাগরিক সেবা গ্রহণের সঠিক তথ্য"
                  : "Verified guide to access government outpatient medical care without middlemen."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 relative">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mb-2">
                  ১
                </span>
                <h4 className="font-bold text-emerald-950 text-sm mb-1">
                  {locale === "bn" ? "টিকেট কাউন্টারে লাইন দিন" : "Queue at Ticket Counter"}
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {locale === "bn"
                    ? "সকাল ৮:৩০ থেকে আউটডোর কাউন্টারে মাত্র ১০ টাকার সরকারি টিকেট সংগ্রহ করুন। পুরুষ ও নারীদের আলাদা লাইন রয়েছে।"
                    : "Collect official BDT 10 outpatient slip from the ground floor ticket counter starting at 8:30 AM."}
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 relative">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center mb-2">
                  ২
                </span>
                <h4 className="font-bold text-blue-950 text-sm mb-1">
                  {locale === "bn" ? "নির্ধারিত আউটডোর রুমে গমন" : "Proceed to Designated Room"}
                </h4>
                <p className="text-xs text-blue-900 leading-relaxed">
                  {locale === "bn"
                    ? "রোগের লক্ষণ অনুযায়ী মেডিসিন, শিশু, সার্জারি বা গাইনী বহির্বিভাগ ডাক্তারের রুমে গিয়ে টিকেট জমা দিন।"
                    : "Hand over the slip at the relevant consultation room (Medicine, Surgery, Pediatrics, Gynecology)."}
                </p>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 relative">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center mb-2">
                  ৩
                </span>
                <h4 className="font-bold text-purple-950 text-sm mb-1">
                  {locale === "bn" ? "বিনামূল্যে সরকারি ওষুধ গ্রহণ" : "Collect Prescribed Medicine"}
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed">
                  {locale === "bn"
                    ? "ডাক্তারের পরামর্শের পর প্রেসক্রিপশন নিয়ে হাসপাতালের নিজস্ব সরকারি ডিসপেনসারি থেকে বিনামূল্যে ওষুধ সংগ্রহ করুন।"
                    : "Present the prescription at the hospital pharmacy to receive available government medicines at zero cost."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DIAGNOSTIC TESTS & PRICING */}
      {/* ======================================================== */}
      {activeTab === "diagnostics" && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {["ALL", "PATHOLOGY", "BIOCHEMISTRY", "IMAGING", "CARDIOLOGY"].map((cat) => (
              <button
                key={cat}
                id={`btn-diag-${cat.toLowerCase()}`}
                onClick={() => setSelectedTestCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTestCategory === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat === "ALL"
                  ? t.common.all
                  : cat === "PATHOLOGY"
                  ? (locale === "bn" ? "প্যাথলজি" : "Pathology")
                  : cat === "BIOCHEMISTRY"
                  ? (locale === "bn" ? "বায়োকেমিস্ট্রি" : "Biochemistry")
                  : cat === "IMAGING"
                  ? (locale === "bn" ? "ইমেজিং ও এক্স-রে" : "Imaging / X-Ray")
                  : (locale === "bn" ? "কার্ডিওলজি / ইসিজি" : "Cardiology")}
              </button>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              {locale === "bn"
                ? "বরিশালের প্রধান ডায়াগনস্টিক সেন্টারগুলোর (রাহাত আনোয়ার, পপুলার, মেডিনোভা, সাউথ অ্যাপোলো) গড় খরচের ভিত্তিতে এই মূল্যসীমা তৈরি করা হয়েছে।"
                : "Tariffs reflect benchmark fee ranges across accredited private diagnostic facilities in Barishal."}
            </span>
          </div>

          {/* Diagnostic Test Cards Grid */}
          {isTestsLoading ? (
            <div className="text-center py-12 text-gray-500 text-xs">{t.common.loading}...</div>
          ) : diagnosticTests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border text-gray-500 text-xs">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diagnosticTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {test.category}
                      </span>
                      {test.turnaroundHours && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{toBnDigits(test.turnaroundHours)} {locale === "bn" ? "ঘণ্টা" : "hours"}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-gray-900 text-sm mb-1 leading-tight">
                      {locale === "bn" ? test.testNameBn : test.testName}
                    </h4>
                    <p className="text-[11px] text-gray-500 mb-3">
                      {locale === "bn" ? test.testName : test.testNameBn}
                    </p>

                    {test.preparationBn && (
                      <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-2.5 text-[11px] text-amber-900 mb-3">
                        <span className="font-bold block mb-0.5">{t.healthcare.preparationGuide}:</span>
                        <span>{locale === "bn" ? test.preparationBn : test.preparationEn}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t.healthcare.approxPrice}:</span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {formatCurrency(test.indicativeFeeMin)} - {formatCurrency(test.indicativeFeeMax)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: EMERGENCY BLOOD DONORS DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === "blood" && (
        <div className="space-y-4">
          {/* Header Action & Blood Group Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {["ALL", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <button
                  key={bg}
                  id={`btn-blood-group-${bg.toLowerCase().replace("+", "-plus").replace("-", "-minus")}`}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedBloodGroup === bg
                      ? "bg-red-600 text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {bg === "ALL" ? t.common.all : bg}
                </button>
              ))}
            </div>

            <button
              id="btn-register-blood-donor"
              onClick={() => setIsDonorModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.healthcare.registerAsDonor}</span>
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 text-red-900 text-xs p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{t.healthcare.emergencyCallOnly}</span>
          </div>

          {/* Donors Grid */}
          {isDonorsLoading ? (
            <div className="text-center py-12 text-gray-500 text-xs">{t.common.loading}...</div>
          ) : bloodDonors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border text-gray-500 text-xs">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bloodDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="w-9 h-9 rounded-lg bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {donor.bloodGroup}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t.healthcare.availableDonors}</span>
                      </span>
                    </div>

                    <h4 className="font-extrabold text-gray-900 text-sm">{donor.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{locale === "bn" && donor.areaBn ? donor.areaBn : donor.area}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t mt-3">
                    <a
                      id={`call-donor-${donor.id}`}
                      href={`tel:${donor.phone}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 rounded-lg text-xs transition-colors border border-red-200"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{donor.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appointment Booking Modal */}
      <AppointmentModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />

      {/* Serial Tracker Modal */}
      <SerialTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Blood Donor Registration Modal */}
      <BloodDonorModal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
      />
    </div>
  );
}
