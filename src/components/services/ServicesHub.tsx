"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  useGetServiceCategoriesQuery,
  useGetProvidersQuery,
  useGetMerchantCategoriesQuery,
  useGetMerchantsQuery,
  useGetCommunityNoticesQuery,
  LocalServiceProvider,
  LocalMerchant,
} from "@/redux/features/services/servicesApi";
import ProviderRegistrationModal from "./ProviderRegistrationModal";
import ReportInaccuracyModal from "./ReportInaccuracyModal";

type ActiveTab = "providers" | "merchants" | "notices";

export default function ServicesHub() {
  const { locale, t } = useLocale();
  const isBn = locale === "bn";

  const [activeTab, setActiveTab] = useState<ActiveTab>("providers");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    isOpen: boolean;
    type: string;
    id: number;
    name: string;
  }>({
    isOpen: false,
    type: "SERVICE",
    id: 0,
    name: "",
  });

  // Queries
  const { data: serviceCategories = [] } = useGetServiceCategoriesQuery();
  const { data: providers = [], isLoading: isProvidersLoading } = useGetProvidersQuery({
    categorySlug: selectedCategory !== "all" ? selectedCategory : undefined,
    area: selectedArea !== "all" ? selectedArea : undefined,
    emergencyOnly: emergencyOnly ? true : undefined,
    search: searchTerm || undefined,
  });

  const { data: merchantCategories = [] } = useGetMerchantCategoriesQuery();
  const { data: merchants = [], isLoading: isMerchantsLoading } = useGetMerchantsQuery({
    categorySlug: selectedCategory !== "all" ? selectedCategory : undefined,
    area: selectedArea !== "all" ? selectedArea : undefined,
    search: searchTerm || undefined,
  });

  const { data: notices = [], isLoading: isNoticesLoading } = useGetCommunityNoticesQuery({
    search: searchTerm || undefined,
  });

  const handleOpenReport = (type: string, id: number, name: string) => {
    setReportTarget({
      isOpen: true,
      type,
      id,
      name,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-900 text-white p-6 sm:p-10 mb-8 shadow-xl border border-teal-700/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-medium mb-3 border border-white/10">
            <span>🏛️</span>
            <span>{isBn ? "বরিশাল নাগরিক ডিরেক্টরি" : "Barishal Citizen Directory"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-white">
            {t.services.title}
          </h1>
          <p className="text-teal-100 text-base sm:text-lg mb-6 leading-relaxed">
            {t.services.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2"
            >
              <span>➕</span>
              <span>{t.services.applyAsProvider}</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-black/25 backdrop-blur-md text-xs text-teal-200 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isBn ? "প্রমাণিত ও যাচাইকৃত তথ্য" : "Field-Verified Data & Provenance"}</span>
            </div>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab("providers");
            setSelectedCategory("all");
            setSearchTerm("");
          }}
          className={`pb-4 px-3 sm:px-5 font-semibold text-sm sm:text-base whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "providers"
              ? "border-teal-600 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>🛠️</span>
          <span>{t.services.providers}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold">
            {providers.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("merchants");
            setSelectedCategory("all");
            setSearchTerm("");
          }}
          className={`pb-4 px-3 sm:px-5 font-semibold text-sm sm:text-base whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "merchants"
              ? "border-teal-600 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>🏪</span>
          <span>{t.services.merchants}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
            {merchants.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("notices");
            setSelectedCategory("all");
            setSearchTerm("");
          }}
          className={`pb-4 px-3 sm:px-5 font-semibold text-sm sm:text-base whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "notices"
              ? "border-teal-600 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span>📢</span>
          <span>{t.services.notices}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
            {notices.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PROVIDERS */}
      {activeTab === "providers" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.services.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
              </div>

              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">{isBn ? "সকল এলাকা (বরিশাল)" : "All Barishal Areas"}</option>
                <option value="Sadar">{isBn ? "সদর রোড ও চকবাজার" : "Sadar Road & Chawkbazar"}</option>
                <option value="Rupatali">{isBn ? "রুপাতলী ও জিরো পয়েন্ট" : "Rupatali & Zero Point"}</option>
                <option value="Nathullabad">{isBn ? "নথুল্লাবাদ ও সিঅ্যান্ডবি" : "Nathullabad & C&B Road"}</option>
                <option value="Alekanda">{isBn ? "আলেকান্দা ও সাগরদী" : "Alekanda & Sagardi"}</option>
                <option value="Brown">{isBn ? "ব্রাউন কম্পাউন্ড ও জিলা স্কুল" : "Brown Compound"}</option>
                <option value="Medical">{isBn ? "মেডিকেল ও বান্দ রোড" : "Medical & Band Road"}</option>
              </select>

              <button
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  emergencyOnly
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-rose-400"
                }`}
              >
                <span>🚨</span>
                <span>{t.services.emergency247}</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {t.services.allCategories}
              </button>
              {serviceCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === c.slug
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{isBn ? c.nameBn : c.name}</span>
                  {c.providerCount !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === c.slug ? "bg-teal-800 text-white" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      {c.providerCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Providers Grid */}
          {isProvidersLoading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-8 h-8 mx-auto border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>{t.common.loading}</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 mb-3">{t.common.noResults}</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedArea("all");
                  setEmergencyOnly(false);
                  setSearchTerm("");
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-medium"
              >
                {t.common.reset}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {providers.map((p) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  isBn={isBn}
                  t={t}
                  onReport={() => handleOpenReport("SERVICE", p.id, isBn ? p.nameBn : p.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MERCHANTS */}
      {activeTab === "merchants" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.services.searchMerchantPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
              </div>

              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">{isBn ? "সকল এলাকা" : "All Areas"}</option>
                <option value="Sadar">{isBn ? "চকবাজার ও সদর রোড" : "Chawkbazar & Sadar Road"}</option>
                <option value="Port Road">{isBn ? "পোর্ট রোড মৎস্য অবতরণ কেন্দ্র" : "Port Road Fishery Ghat"}</option>
                <option value="Zilla School">{isBn ? "জিলা স্কুল মোড়" : "Zilla School Mor"}</option>
                <option value="C&B">{isBn ? "সিঅ্যান্ডবি ও চৌমাথা" : "C&B Road & Chowmatha"}</option>
                <option value="Natun Bazar">{isBn ? "নতুন বাজার" : "Natun Bazar"}</option>
              </select>
            </div>

            {/* Merchant Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                {t.services.allCategories}
              </button>
              {merchantCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === c.slug
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{isBn ? c.nameBn : c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Merchants Grid */}
          {isMerchantsLoading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-8 h-8 mx-auto border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>{t.common.loading}</p>
            </div>
          ) : merchants.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 mb-3">{t.common.noResults}</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedArea("all");
                  setSearchTerm("");
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-medium"
              >
                {t.common.reset}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {merchants.map((m) => (
                <MerchantCard
                  key={m.id}
                  merchant={m}
                  isBn={isBn}
                  t={t}
                  onReport={() => handleOpenReport("MERCHANT", m.id, isBn ? m.nameBn : m.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOTICES */}
      {activeTab === "notices" && (
        <div className="space-y-6">
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {t.services.officialAlerts}
                </h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  {isBn
                    ? "বিআইডব্লিউটিএ নদী বন্দর, সিটি কর্পোরেশন ও বিদ্যুৎ বিভাগের সরাসরি বিজ্ঞপ্তি"
                    : "Direct alerts from BIWTA River Port, City Corporation & Power Board"}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold">
              {notices.length} {isBn ? "টি সক্রিয় বার্তা" : "Active Bulletins"}
            </span>
          </div>

          {isNoticesLoading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-8 h-8 mx-auto border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>{t.common.loading}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((n) => (
                <NoticeCard key={n.id} notice={n} isBn={isBn} t={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ProviderRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <ReportInaccuracyModal
        isOpen={reportTarget.isOpen}
        onClose={() => setReportTarget({ ...reportTarget, isOpen: false })}
        entityType={reportTarget.type}
        entityId={reportTarget.id}
        entityName={reportTarget.name}
      />
    </div>
  );
}

// -------------------------------------------------------------
// Sub-Components: ProviderCard, MerchantCard, NoticeCard
// -------------------------------------------------------------

function ProviderCard({
  provider,
  isBn,
  t,
  onReport,
}: {
  provider: LocalServiceProvider;
  isBn: boolean;
  t: any;
  onReport: () => void;
}) {
  const cleanPhone = provider.phone.replace(/[^0-9]/g, "");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/40 mb-1.5">
              {provider.category.icon} {isBn ? provider.category.nameBn : provider.category.name}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
              {isBn ? provider.nameBn : provider.name}
            </h3>
          </div>

          {provider.isEmergency && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
              🚨 24/7
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
          <p className="flex items-center gap-1.5">
            <span className="text-slate-400">📍</span>
            <span>{isBn ? provider.areaBn : provider.area}</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              ★ {provider.rating.toFixed(1)}
              <span className="text-slate-400 font-normal">({provider.reviewCount})</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>
              {provider.experienceYears} {t.services.experience}
            </span>
          </div>
          {provider.pricingNoteBn && (
            <p className="text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded-lg">
              💰 {isBn ? provider.pricingNoteBn : provider.pricingNoteEn || provider.pricingNoteBn}
            </p>
          )}
          {provider.descriptionBn && (
            <p className="text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 text-[11px]">
              {isBn ? provider.descriptionBn : provider.descriptionEn || provider.descriptionBn}
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] mb-3">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span>✓</span> {t.common.verified}
          </span>
          <button
            onClick={onReport}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
          >
            {t.services.reportError}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${provider.phone}`}
            className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>📞</span>
            <span>{t.services.callDirect}</span>
          </a>

          <a
            href={`https://wa.me/880${cleanPhone.replace(/^0+/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function MerchantCard({
  merchant,
  isBn,
  t,
  onReport,
}: {
  merchant: LocalMerchant;
  isBn: boolean;
  t: any;
  onReport: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 mb-1.5">
              {merchant.category.icon} {isBn ? merchant.category.nameBn : merchant.category.name}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              {isBn ? merchant.nameBn : merchant.name}
            </h3>
          </div>

          {merchant.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-900/60">
              ★ {isBn ? "ঐতিহ্যবাহী" : "Heritage"}
            </span>
          )}
        </div>

        {merchant.taglineBn && (
          <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-3">
            &ldquo;{isBn ? merchant.taglineBn : merchant.taglineEn || merchant.taglineBn}&rdquo;
          </p>
        )}

        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
          <p className="flex items-center gap-1.5">
            <span className="text-slate-400">📍</span>
            <span>{isBn ? merchant.addressBn : merchant.address}</span>
          </p>
          {merchant.openingHoursBn && (
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>🕒</span>
              <span>{isBn ? merchant.openingHoursBn : merchant.openingHoursEn}</span>
            </p>
          )}

          {merchant.specialtiesBn && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                {t.services.specialties}:
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {isBn ? merchant.specialtiesBn : merchant.specialtiesEn || merchant.specialtiesBn}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] mb-3">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span>✓</span> {t.common.verified}
          </span>
          <button
            onClick={onReport}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
          >
            {t.services.reportError}
          </button>
        </div>

        {merchant.phone ? (
          <a
            href={`tel:${merchant.phone}`}
            className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>📞</span>
            <span>{t.services.callDirect} ({merchant.phone})</span>
          </a>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {isBn ? "দোকানে সরাসরি পরিদর্শন করুন" : "Visit in person"}
          </div>
        )}
      </div>
    </div>
  );
}

function NoticeCard({
  notice,
  isBn,
  t,
}: {
  notice: any;
  isBn: boolean;
  t: any;
}) {
  const isEmergency = notice.severity === "EMERGENCY";
  const isWarning = notice.severity === "WARNING";

  const colorStyles = isEmergency
    ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20"
    : isWarning
    ? "border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20"
    : "border-sky-300 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20";

  const badgeStyles = isEmergency
    ? "bg-rose-600 text-white"
    : isWarning
    ? "bg-amber-500 text-slate-950 font-bold"
    : "bg-sky-600 text-white";

  return (
    <div className={`p-5 rounded-2xl border ${colorStyles} shadow-sm transition-all`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles}`}>
            {isEmergency
              ? t.services.emergencyNotice
              : isWarning
              ? t.services.warningSignal
              : t.services.publicNotice}
          </span>
          {notice.isPinned && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              📌 {isBn ? "গুরুত্বপূর্ণ" : "Pinned"}
            </span>
          )}
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(notice.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
        {isBn ? notice.titleBn : notice.titleEn}
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {isBn ? notice.contentBn : notice.contentEn}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <span>🏛️</span>
          <span className="font-medium">
            {isBn ? notice.sourceOrganization : notice.sourceOrganizationEn || notice.sourceOrganization}
          </span>
        </div>

        {notice.actionPhone && (
          <a
            href={`tel:${notice.actionPhone}`}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span>📞</span>
            <span>{isBn ? "কন্ট্রোল রুম / হটলাইন" : "Control Room"}: {notice.actionPhone}</span>
          </a>
        )}
      </div>
    </div>
  );
}
