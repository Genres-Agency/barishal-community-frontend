"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  useLazyGetAppointmentByCodeQuery,
  AppointmentBookingItem,
} from "@/redux/features/healthcare/healthcareApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  FileSearch,
} from "lucide-react";

interface SerialTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SerialTrackerModal({
  isOpen,
  onClose,
}: SerialTrackerModalProps) {
  const { t, locale, toBnDigits, formatCurrency } = useLocale();
  const [queryCode, setQueryCode] = useState("");
  const [triggerLookup, { data: appointment, isLoading, isError }] =
    useLazyGetAppointmentByCodeQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryCode.trim()) {
      triggerLookup(queryCode.trim());
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: locale === "bn" ? "নিশ্চিতকৃত" : "Confirmed",
          cls: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "COMPLETED":
        return {
          label: locale === "bn" ? "সম্পন্ন" : "Completed",
          cls: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "CANCELLED":
        return {
          label: locale === "bn" ? "বাতিল" : "Cancelled",
          cls: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          label: locale === "bn" ? "অনুরোধ প্রক্রিয়াধীন" : "Requested (Pending)",
          cls: "bg-amber-100 text-amber-800 border-amber-300",
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-4 sm:p-6 bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-emerald-600" />
            <span>{t.healthcare.trackSerial}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="mt-3">
          <div className="flex gap-2">
            <input
              id="input-tracker-code"
              type="text"
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              placeholder={
                locale === "bn"
                  ? "বুকিং কোড (উদাঃ BSL-DOC-1-XXXX) বা ফোন নম্বর..."
                  : "Booking Code or Phone..."
              }
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              id="btn-submit-tracker"
              type="submit"
              disabled={isLoading || !queryCode.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{locale === "bn" ? "খুঁজুন" : "Search"}</span>
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="py-8 text-center text-xs text-gray-500">
            {t.common.loading}...
          </div>
        )}

        {isError && (
          <div className="my-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {locale === "bn"
                ? "এই কোড বা নম্বরে কোনো সিরিয়াল পাওয়া যায়নি।"
                : "No appointment found for this reference code."}
            </span>
          </div>
        )}

        {appointment && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  {t.healthcare.serialCode}
                </span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {appointment.bookingCode}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  getStatusBadge(appointment.status).cls
                }`}
              >
                {getStatusBadge(appointment.status).label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <div>
                <span className="text-gray-500 block text-[11px]">{t.healthcare.serialNumber}:</span>
                <span className="font-extrabold text-base text-gray-900">
                  #{toBnDigits(appointment.estimatedSerialNo || 1)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">{t.healthcare.patientName}:</span>
                <span className="font-bold text-gray-800 truncate block">
                  {appointment.patientName}
                </span>
              </div>
            </div>

            <div className="text-xs pt-2 border-t space-y-1">
              <p className="font-semibold text-emerald-900">
                {locale === "bn" && appointment.doctor.nameBn
                  ? appointment.doctor.nameBn
                  : appointment.doctor.name}
              </p>
              <p className="text-gray-600 text-[11px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  {locale === "bn" && appointment.chamber.hospitalOrClinicNameBn
                    ? appointment.chamber.hospitalOrClinicNameBn
                    : appointment.chamber.hospitalOrClinicName}
                </span>
              </p>
              <p className="text-gray-600 text-[11px] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    locale === "bn" ? "bn-BD" : "en-US",
                    { weekday: "short", month: "short", day: "numeric" },
                  )}
                </span>
                <span className="ml-2 font-medium text-emerald-700">
                  ({appointment.chamber.visitingHours})
                </span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
