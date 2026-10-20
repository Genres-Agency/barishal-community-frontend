"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n";
import { useRegisterBloodDonorMutation } from "@/redux/features/healthcare/healthcareApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BloodDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BloodDonorModal({ isOpen, onClose }: BloodDonorModalProps) {
  const { t, locale } = useLocale();
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Barishal Sadar");
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [consent, setConsent] = useState(false);

  const [registerDonor, { isLoading }] = useRegisterBloodDonorMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error(
        locale === "bn"
          ? "জরুরি প্রয়োজনে ফোন পাওয়ার সম্মতি প্রদান করুন"
          : "Please consent to emergency contact to register",
      );
      return;
    }
    if (!name.trim() || !phone.trim()) {
      toast.error(locale === "bn" ? "নাম ও ফোন নম্বর দিন" : "Please provide name and phone");
      return;
    }

    try {
      await registerDonor({
        name,
        bloodGroup,
        phone,
        area,
        areaBn: area,
        lastDonationDate: lastDonationDate || undefined,
      }).unwrap();

      toast.success(
        locale === "bn"
          ? "স্বেচ্ছাসেবী রক্তদাতা হিসেবে সফলভাবে নিবন্ধিত হয়েছেন!"
          : "Registered as a voluntary blood donor!",
      );
      onClose();
      setName("");
      setPhone("");
      setConsent(false);
    } catch {
      toast.error(locale === "bn" ? "নিবন্ধনে সমস্যা হয়েছে" : "Registration failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-4 sm:p-6 bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <span>{t.healthcare.registerAsDonor}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {locale === "bn" ? "আপনার নাম" : "Your Name"} *
            </label>
            <input
              id="input-donor-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tanvir Ahmed"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t.healthcare.bloodGroup} *
              </label>
              <select
                id="select-donor-blood-group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-bold text-red-700"
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t.healthcare.donorArea} *
              </label>
              <select
                id="select-donor-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="Barishal Sadar">{locale === "bn" ? "বরিশাল সদর" : "Barishal Sadar"}</option>
                <option value="Rupatali">{locale === "bn" ? "রুপাতলী" : "Rupatali"}</option>
                <option value="Nathullabad">{locale === "bn" ? "নথুল্লাবাদ" : "Nathullabad"}</option>
                <option value="Chowmatha">{locale === "bn" ? "চৌমাথা" : "Chowmatha"}</option>
                <option value="Band Road">{locale === "bn" ? "বান্দ রোড / SBMCH" : "Band Road / SBMCH"}</option>
                <option value="Babuganj">{locale === "bn" ? "বাবুগঞ্জ" : "Babuganj"}</option>
                <option value="Bakerganj">{locale === "bn" ? "বাকেরগঞ্জ" : "Bakerganj"}</option>
                <option value="Barishal University">{locale === "bn" ? "বরিশাল বিশ্ববিদ্যালয়" : "Barishal University"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {locale === "bn" ? "মোবাইল নম্বর" : "Phone Number"} *
            </label>
            <input
              id="input-donor-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {locale === "bn" ? "সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)" : "Last Donation Date (Optional)"}
            </label>
            <input
              id="input-donor-last-date"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={lastDonationDate}
              onChange={(e) => setLastDonationDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Explicit Consent */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
              <input
                id="checkbox-donor-consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 h-4 w-4 border-gray-300"
              />
              <span>
                {locale === "bn"
                  ? "আমি সম্মতি দিচ্ছি যে রোগীদের জরুরি রক্তের প্রয়োজনে আমার এই নম্বরটি প্ল্যাটফর্মে প্রদর্শিত হবে।"
                  : "I consent to display my contact number for genuine emergency blood requirements."}
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              id="btn-submit-donor-register"
              type="submit"
              disabled={isLoading || !consent}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              {isLoading ? t.common.loading : t.healthcare.registerAsDonor}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
