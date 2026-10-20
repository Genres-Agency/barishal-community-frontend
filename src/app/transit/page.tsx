import React from "react";
import type { Metadata } from "next";
import TransitHub from "@/components/transit/TransitHub";

export const metadata: Metadata = {
  title: "বরিশাল যাতায়াত ও ট্রানজিট হাব | Barishal Mobility & Transit Hub",
  description:
    "বরিশাল নদী বন্দর লঞ্চের সময়সূচি ও ভাড়া, নথুল্লাবাদ ও রূপাতলী বাস টার্মিনাল, ইজি-বাইক ভাড়া এবং কুয়াকাটা ভ্রমণের নির্ভুল নির্দেশিকা।",
  keywords: [
    "Barishal Launch Schedule",
    "বরিশাল লঞ্চ সময়সূচি",
    "Nathullabad Bus Terminal",
    "Rupatali Bus Terminal",
    "Barishal Easy-Bike Fare",
    "Kuakata Trip Planner",
  ],
};

export default function TransitPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <TransitHub />
    </div>
  );
}
