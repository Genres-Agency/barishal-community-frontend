import React from "react";
import type { Metadata } from "next";
import ServicesHub from "@/components/services/ServicesHub";

export const metadata: Metadata = {
  title: "বরিশাল স্থানীয় সেবা, ব্যবসায়ী ও নোটিশবোর্ড | Barishal Services & Noticeboard",
  description:
    "বরিশালের নির্ভরযোগ্য ইলেকট্রিশিয়ান, প্লাম্বার, এসি টেকনিশিয়ান, ঘোষ মিষ্টান্ন ও পোর্ট রোড ইলিশ মোকামসহ স্থানীয় ব্যবসায়িক প্রতিষ্ঠান এবং বিআইডব্লিউটিএ ও সিটি কর্পোরেশনের জরুরি নোটিশবোর্ড।",
  keywords: [
    "Barishal Local Services",
    "বরিশাল ইলেকট্রিশিয়ান",
    "বরিশাল প্লাম্বার",
    "Ghosh Sweets Barishal",
    "ঘোষ মিষ্টান্ন ভাণ্ডার",
    "Port Road Ilish Mokam",
    "পোর্ট রোড ইলিশ মোকাম",
    "Barishal City Noticeboard",
    "BIWTA Barishal Signal",
    "বরিশাল নোটিশবোর্ড",
  ],
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <ServicesHub />
    </div>
  );
}
