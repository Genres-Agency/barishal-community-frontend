"use client";

import React, { useState } from "react";
import HomeHero from "@/components/home/HomeHero";
import TransitHub from "@/components/transit/TransitHub";
import CommunityFeed from "@/components/feed/CommunityFeed";
import CommunityEvent from "@/components/community-event/CommunityEvent";
import HealthcareHub from "@/components/healthcare/HealthcareHub";
import ServicesHub from "@/components/services/ServicesHub";
import LeftSidebar from "@/components/navigation/leftSide/LeftSidebar";
import RightSidebar from "@/components/navigation/rightSide/RightSidebar";
import { useLocale } from "@/lib/i18n";
import { Compass, MessageSquareText, Calendar, Stethoscope, Wrench } from "lucide-react";

export default function Home() {
  const { t, locale } = useLocale();
  const [activeView, setActiveView] = useState<"mobility" | "healthcare" | "services" | "community">("mobility");

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
      {/* Hero Welcome Banner */}
      <HomeHero />

      {/* Main View Switcher */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            id="view-btn-mobility"
            onClick={() => setActiveView("mobility")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeView === "mobility"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.navigation.mobility}</span>
            <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-extrabold hidden sm:inline-block">
              {locale === "bn" ? "প্রয়োজনীয়" : "Essential"}
            </span>
          </button>

          <button
            id="view-btn-healthcare"
            onClick={() => setActiveView("healthcare")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeView === "healthcare"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t.navigation.healthcare}</span>
            <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-extrabold hidden sm:inline-block">
              {locale === "bn" ? "ডাক্তার" : "Doctors"}
            </span>
          </button>

          <button
            id="view-btn-services"
            onClick={() => setActiveView("services")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeView === "services"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{t.navigation.services}</span>
            <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold hidden sm:inline-block">
              {locale === "bn" ? "নোটিশ" : "Notices"}
            </span>
          </button>

          <button
            id="view-btn-community"
            onClick={() => setActiveView("community")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeView === "community"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>{t.navigation.communityNews}</span>
          </button>
        </div>

        <span className="text-xs text-gray-500 hidden md:block">
          {locale === "bn" ? "বরিশাল বিভাগের জন্য সার্বক্ষণিক সক্রিয়" : "Live for Barishal Division"}
        </span>
      </div>

      {/* Conditional Active View */}
      {activeView === "mobility" ? (
        <div className="w-full">
          <TransitHub />
        </div>
      ) : activeView === "healthcare" ? (
        <div className="w-full">
          <HealthcareHub />
        </div>
      ) : activeView === "services" ? (
        <div className="w-full">
          <ServicesHub />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <CommunityFeed />
        </div>
      )}
    </div>
  );
}
