"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import {
  Ship,
  Bus,
  Car,
  Compass,
  Stethoscope,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HomeHero() {
  const { t, locale } = useLocale();

  const quickBadges = [
    {
      label: locale === "bn" ? "লঞ্চ সময়সূচি ও কেবিন" : "Launch Schedules & Cabins",
      href: "/transit?tab=launches",
      icon: Ship,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    },
    {
      label: locale === "bn" ? "নথুল্লাবাদ বাস টার্মিনাল" : "Nathullabad Bus Terminal",
      href: "/transit?tab=buses",
      icon: Bus,
      color: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
    },
    {
      label: locale === "bn" ? "রূপাতলী (কুয়াকাটা বাস)" : "Rupatali (Kuakata Route)",
      href: "/transit?tab=buses",
      icon: Bus,
      color: "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100",
    },
    {
      label: locale === "bn" ? "ইজি-বাইক ও রিকশা ভাড়া" : "Easy-Bike Fare Guide",
      href: "/transit?tab=easybike",
      icon: Car,
      color: "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100",
    },
    {
      label: locale === "bn" ? "কুয়াকাটা ট্রিপ প্ল্যানার" : "Kuakata Itinerary Planner",
      href: "/transit?tab=kuakata",
      icon: Compass,
      color: "bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100",
    },
    {
      label: locale === "bn" ? "ডাক্তার ও SBMCH ডিরেক্টরি" : "Doctors & SBMCH",
      href: "/healthcare",
      icon: Stethoscope,
      color: "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
      {/* Background Decorative Rings */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{locale === "bn" ? "বরিশাল বিভাগীয় স্থানীয় প্ল্যাটফর্ম" : "Barishal Division Community Platform"}</span>
          <span className="w-1 h-1 rounded-full bg-emerald-300" />
          <span className="text-emerald-300">{locale === "bn" ? "মোবাইল ফ্রেন্ডলি" : "Mobile-First"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
          {locale === "bn" ? (
            <>
              বরিশালে আপনার প্রয়োজনীয় <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">যাতায়াত ও স্থানীয় সেবা</span> এক জায়গায়
            </>
          ) : (
            <>
              High-Frequency <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">Local Mobility & Healthcare</span> for Barishal
            </>
          )}
        </h1>

        <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
          {t.common.siteTagline}. {locale === "bn" ? "নদী বন্দর, নথুল্লাবাদ ও রূপাতলী টার্মিনালের যাচাইকৃত সময়সূচি এবং জরুরি তথ্যের নির্ভরযোগ্য মাধ্যম।" : "Verified river launch schedules, inter-district buses, easy-bike tariffs, and direct SBMCH emergency services."}
        </p>

        {/* Quick Service Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {quickBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <Link
                key={idx}
                href={badge.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs hover:scale-102 ${badge.color}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{badge.label}</span>
                <ArrowRight className="w-3 h-3 opacity-60 ml-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
