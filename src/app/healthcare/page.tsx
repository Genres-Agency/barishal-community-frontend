import React from "react";
import type { Metadata } from "next";
import HealthcareHub from "@/components/healthcare/HealthcareHub";

export const metadata: Metadata = {
  title: "বরিশাল স্বাস্থ্যসেবা ও ডাক্তার ডিরেক্টরি | Barishal Healthcare & Doctor Chambers",
  description:
    "শের-ই-বাংলা মেডিকেল কলেজ (SBMCH) আউটডোর ও জরুরি সেবা, বরিশালের বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিরিয়াল বুকিং, ডায়াগনস্টিক পরীক্ষার খরচ এবং রক্তদাতা সহায়তা।",
  keywords: [
    "Barishal Doctor Chamber",
    "বরিশাল ডাক্তার চেম্বার",
    "SBMCH Barishal Emergency",
    "শের-ই-বাংলা মেডিকেল কলেজ",
    "Barishal Doctor Serial",
    "Barishal Blood Donor",
    "Diagnostic Test Price Barishal",
  ],
};

export default function HealthcarePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <HealthcareHub />
    </div>
  );
}
