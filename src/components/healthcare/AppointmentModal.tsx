"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n";
import {
  DoctorItem,
  DoctorChamberItem,
  useCreateAppointmentMutation,
  AppointmentBookingItem,
} from "@/redux/features/healthcare/healthcareApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  PhoneCall,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

interface AppointmentModalProps {
  doctor: DoctorItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentModal({
  doctor,
  isOpen,
  onClose,
}: AppointmentModalProps) {
  const { t, locale, toBnDigits, formatCurrency } = useLocale();
  const [selectedChamberId, setSelectedChamberId] = useState<number | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("MALE");
  const [patientPhone, setPatientPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [bookingResult, setBookingResult] = useState<AppointmentBookingItem | null>(null);

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  // Reset or initialize state
  React.useEffect(() => {
    if (doctor?.chambers?.length) {
      setSelectedChamberId(doctor.chambers[0].id);
    }
    setBookingResult(null);
  }, [doctor, isOpen]);

  if (!doctor) return null;

  const selectedChamber = doctor.chambers.find((c) => c.id === selectedChamberId) || doctor.chambers[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChamber) {
      toast.error(locale === "bn" ? "দয়া করে চেম্বার নির্বাচন করুন" : "Please select a chamber");
      return;
    }
    if (!patientName.trim() || !patientPhone.trim() || !appointmentDate) {
      toast.error(
        locale === "bn"
          ? "দয়া করে রোগীর নাম, ফোন নম্বর এবং তারিখ দিন"
          : "Please provide patient name, phone number, and appointment date",
      );
      return;
    }

    try {
      const res = await createAppointment({
        doctorId: doctor.id,
        chamberId: selectedChamber.id,
        patientName,
        patientAge: parseInt(patientAge, 10) || 30,
        patientGender,
        patientPhone,
        appointmentDate: new Date(appointmentDate).toISOString(),
        chiefComplaint,
      }).unwrap();

      setBookingResult(res);
      toast.success(t.healthcare.bookingSuccess);
    } catch {
      toast.error(
        locale === "bn"
          ? "সিরিয়াল অনুরোধ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
          : "Failed to submit appointment request. Please try again.",
      );
    }
  };

  const copyBookingCode = () => {
    if (bookingResult?.bookingCode) {
      navigator.clipboard.writeText(bookingResult.bookingCode);
      toast.success(locale === "bn" ? "কোড কপি করা হয়েছে!" : "Booking code copied!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>{t.healthcare.bookSerialOnline}</span>
          </DialogTitle>
        </DialogHeader>

        {bookingResult ? (
          // Success Confirmation Screen
          <div className="py-4 space-y-4">
            <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
              <h3 className="text-lg font-extrabold text-emerald-950">
                {t.healthcare.bookingSuccess}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                {t.healthcare.bookingNotice}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs text-gray-500">{t.healthcare.serialCode}</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md text-sm">
                  <span>{bookingResult.bookingCode}</span>
                  <button
                    onClick={copyBookingCode}
                    className="hover:text-emerald-900 transition-colors"
                    title="Copy Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs text-gray-500">{t.healthcare.serialNumber}</span>
                <span className="font-extrabold text-gray-900 text-base">
                  #{toBnDigits(bookingResult.estimatedSerialNo || 1)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs text-gray-500">{t.healthcare.patientName}</span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {bookingResult.patientName} ({toBnDigits(bookingResult.patientAge)} yr)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs text-gray-500">{locale === "bn" ? "ডাক্তার" : "Doctor"}</span>
                <span className="font-semibold text-gray-800 text-xs text-right">
                  {locale === "bn" && bookingResult.doctor.nameBn ? bookingResult.doctor.nameBn : bookingResult.doctor.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{t.healthcare.chamberLocation}</span>
                <span className="text-xs font-medium text-gray-700 text-right max-w-[200px] truncate">
                  {locale === "bn" && bookingResult.chamber.hospitalOrClinicNameBn
                    ? bookingResult.chamber.hospitalOrClinicNameBn
                    : bookingResult.chamber.hospitalOrClinicName}
                </span>
              </div>
            </div>

            {selectedChamber?.serialPhone && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {locale === "bn" ? "চেম্বার সিরিয়াল হেল্পলাইন: " : "Chamber Helpline: "}
                  </span>
                  <a
                    href={`tel:${selectedChamber.serialPhone}`}
                    className="font-extrabold text-emerald-800 underline ml-1"
                  >
                    {selectedChamber.serialPhone}
                  </a>
                  <p className="mt-1 text-[11px] text-amber-800">
                    {locale === "bn" && selectedChamber.serialInstructionBn
                      ? selectedChamber.serialInstructionBn
                      : selectedChamber.serialInstruction}
                  </p>
                </div>
              </div>
            )}

            <button
              id="btn-close-appointment-modal"
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm shadow-md"
            >
              {t.common.close}
            </button>
          </div>
        ) : (
          // Appointment Request Form
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Doctor Info Card Summary */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                {doctor.name.charAt(0)}
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-emerald-950">
                  {locale === "bn" && doctor.nameBn ? doctor.nameBn : doctor.name}
                </h4>
                <p className="text-emerald-800 line-clamp-1">
                  {locale === "bn" && doctor.designationBn ? doctor.designationBn : doctor.designation}
                </p>
                <p className="text-gray-600 text-[11px]">
                  {locale === "bn" && doctor.institutionBn ? doctor.institutionBn : doctor.institution}
                </p>
              </div>
            </div>

            {/* Chamber Selector if multiple */}
            {doctor.chambers.length > 1 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.healthcare.chamberLocation}
                </label>
                <select
                  value={selectedChamberId || ""}
                  onChange={(e) => setSelectedChamberId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {doctor.chambers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {locale === "bn" && c.hospitalOrClinicNameBn ? c.hospitalOrClinicNameBn : c.hospitalOrClinicName} -{" "}
                      {locale === "bn" && c.visitingHoursBn ? c.visitingHoursBn : c.visitingHours}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chamber Visiting Hours & Fee Pill */}
            {selectedChamber && (
              <div className="bg-gray-50 border p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    {locale === "bn" && selectedChamber.hospitalOrClinicNameBn
                      ? selectedChamber.hospitalOrClinicNameBn
                      : selectedChamber.hospitalOrClinicName}
                  </span>
                  {selectedChamber.roomNumber && (
                    <span className="text-gray-500">({selectedChamber.roomNumber})</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {locale === "bn" && selectedChamber.visitingDaysBn
                      ? selectedChamber.visitingDaysBn
                      : selectedChamber.visitingDays}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {locale === "bn" && selectedChamber.visitingHoursBn
                      ? selectedChamber.visitingHoursBn
                      : selectedChamber.visitingHours}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  {t.healthcare.newPatientFee}:{" "}
                  <span className="font-bold">{formatCurrency(selectedChamber.newPatientFee)}</span>
                  {selectedChamber.returnPatientFee && (
                    <span className="text-gray-500 ml-2">
                      ({t.healthcare.returnPatientFee}: {formatCurrency(selectedChamber.returnPatientFee)})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Patient Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.healthcare.patientName} *
                </label>
                <input
                  id="input-patient-name"
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={locale === "bn" ? "রোগীর নাম লিখুন" : "e.g. Kamal Hossain"}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.healthcare.patientAge} *
                  </label>
                  <input
                    id="input-patient-age"
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="35"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.healthcare.patientGender}
                  </label>
                  <select
                    id="select-patient-gender"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="MALE">{locale === "bn" ? "পুরুষ" : "Male"}</option>
                    <option value="FEMALE">{locale === "bn" ? "নারী" : "Female"}</option>
                    <option value="OTHER">{locale === "bn" ? "অন্যান্য" : "Other"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.healthcare.patientPhone} *
                </label>
                <input
                  id="input-patient-phone"
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.healthcare.appointmentDate} *
                </label>
                <input
                  id="input-appointment-date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.healthcare.chiefComplaint}
                </label>
                <textarea
                  id="input-chief-complaint"
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder={
                    locale === "bn"
                      ? "উপসর্গ বা শারীরিক সমস্যা সংক্ষেপে লিখুন..."
                      : "Brief description of symptoms or health problem..."
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Transparency Note */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-2.5 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {locale === "bn"
                  ? "সিরিয়াল অনুরোধ পাঠানোর পর চেম্বারের সিরিয়াল অনুযায়ী সিরিয়াল নম্বর প্রদান করা হবে। নির্ধারিত সময়ে উপস্থিত থাকুন।"
                  : "Serial will be processed according to chamber schedule. Please arrive on time."}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                id="btn-submit-appointment"
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                {isLoading ? t.common.loading : t.healthcare.requestSerial}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
