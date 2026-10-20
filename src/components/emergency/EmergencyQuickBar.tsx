"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n";
import { PhoneCall, AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, HeartPulse, Flame, Phone } from "lucide-react";

export default function EmergencyQuickBar() {
  const { t, locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const emergencyContacts = [
    {
      title: locale === "bn" ? "শের-ই-বাংলা মেডিকেল (SBMCH) জরুরি বিভাগ" : "SBMCH Hospital Emergency Casualty",
      phone: "01712-000000",
      icon: HeartPulse,
      badge: locale === "bn" ? "২৪/৭ খোলা" : "24/7 Open",
      badgeColor: "bg-red-100 text-red-700",
    },
    {
      title: locale === "bn" ? "বরিশাল অ্যাম্বুলেন্স সার্ভিস" : "Barishal Ambulance Service",
      phone: "01711-123456",
      icon: ShieldAlert,
      badge: locale === "bn" ? "জরুরি অ্যাম্বুলেন্স" : "Emergency Ambulance",
      badgeColor: "bg-amber-100 text-amber-700",
    },
    {
      title: locale === "bn" ? "বরিশাল মেট্রোপলিটন পুলিশ কন্ট্রোল রুম" : "Barishal Metropolitan Police",
      phone: "01713-374256",
      icon: Phone,
      badge: locale === "bn" ? "পুলিশ কন্ট্রোল" : "Police Control",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      title: locale === "bn" ? "ফায়ার সার্ভিস ও সিভিল ডিফেন্স বরিশাল" : "Fire Service & Civil Defence",
      phone: "0431-62222",
      icon: Flame,
      badge: locale === "bn" ? "ফায়ার স্টেশন" : "Fire Station",
      badgeColor: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="bg-red-50 border-b border-red-200 text-xs sm:text-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{t.emergency.sbmchHospital}:</span>
            <a
              href={`tel:${t.emergency.sbmchPhone}`}
              className="inline-flex items-center gap-1 font-bold text-red-800 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.emergency.sbmchPhone}</span>
            </a>
          </div>

          <button
            id="emergency-drawer-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-red-700 hover:text-red-900 font-medium ml-2 py-1 px-2 rounded hover:bg-red-100/60 transition-colors"
            aria-expanded={isOpen}
          >
            <span>{locale === "bn" ? "সব জরুরি হেল্পলাইন" : "All Helplines"}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-2 pt-2 border-t border-red-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pb-1">
            {emergencyContacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-red-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.badgeColor}`}>
                        {c.badge}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 text-xs line-clamp-1 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      {c.title}
                    </p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{t.common.callNow}: {c.phone}</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
