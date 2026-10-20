"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  useGetServiceCategoriesQuery,
  useRegisterProviderMutation,
} from "@/redux/features/services/servicesApi";
import { toast } from "sonner";

interface ProviderRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProviderRegistrationModal({
  isOpen,
  onClose,
}: ProviderRegistrationModalProps) {
  const { locale, t } = useLocale();
  const isBn = locale === "bn";
  const { data: categories = [] } = useGetServiceCategoriesQuery();
  const [registerProvider, { isLoading }] = useRegisterProviderMutation();

  const [form, setForm] = useState({
    name: "",
    nameBn: "",
    categorySlug: "",
    phone: "",
    whatsapp: "",
    area: "Sadar",
    areaBn: "সদর রোড ও আশপাশ",
    address: "",
    experienceYears: 5,
    isEmergency: false,
    pricingNoteBn: "",
    descriptionBn: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nameBn || !form.phone || !form.categorySlug) {
      toast.error(
        isBn
          ? "অনুগ্রহ করে নাম, ক্যাটাগরি এবং ফোন নম্বর সঠিকভাবে পূরণ করুন।"
          : "Please fill in your name, category and phone number."
      );
      return;
    }

    try {
      await registerProvider({
        name: form.name || form.nameBn,
        nameBn: form.nameBn,
        categorySlug: form.categorySlug,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        area: form.area,
        areaBn: form.areaBn,
        address: form.address,
        experienceYears: Number(form.experienceYears),
        isEmergency: form.isEmergency,
        pricingNoteBn: form.pricingNoteBn || "ভিজিট ফি ২০০ টাকা",
        descriptionBn: form.descriptionBn,
      }).unwrap();

      setIsSuccess(true);
      toast.success(
        isBn
          ? "আপনার আবেদন সফলভাবে জমা হয়েছে!"
          : "Application submitted successfully!"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          (isBn ? "আবেদন জমা দিতে সমস্যা হয়েছে।" : "Failed to submit application.")
      );
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isBn ? "আবেদন সফলভাবে গৃহীত হয়েছে!" : "Registration Submitted!"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 text-sm">
              {isBn
                ? "বরিশাল কমিউনিটি অ্যাডমিন টিম আপনার তথ্য ও ফোন নম্বর যাচাই করে দ্রুত ডিরেক্টরিতে তালিকাভুক্ত করবে।"
                : "The Barishal Community team will verify your credentials and list your profile in the directory shortly."}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors shadow-md shadow-teal-600/20"
            >
              {t.common.close}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 mb-2">
                {isBn ? "কারিগর অন্তর্ভুক্তি" : "Trade Listing"}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t.services.registerTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t.services.registerSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "আপনার পুরো নাম (বাংলায়) *" : "Full Name (Bengali) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nameBn}
                    onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                    placeholder={isBn ? "যেমন: মোঃ রফিকুল ইসলাম" : "e.g. Md. Rafiqul Islam"}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "নাম (ইংরেজি)" : "Full Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Md. Rafiqul Islam"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "সেবার ক্যাটাগরি *" : "Service Category *"}
                </label>
                <select
                  required
                  value={form.categorySlug}
                  onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">{isBn ? "ক্যাটাগরি নির্বাচন করুন" : "Select Category"}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.icon} {isBn ? c.nameBn : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "মোবাইল নম্বর *" : "Contact Phone *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="017XX-XXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "হোয়াটসঅ্যাপ নম্বর" : "WhatsApp Number"}
                  </label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="017XX-XXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "কাজের এলাকা (বরিশাল) *" : "Operating Area (Barishal) *"}
                  </label>
                  <select
                    value={form.area}
                    onChange={(e) => {
                      const val = e.target.value;
                      const bnMap: Record<string, string> = {
                        Sadar: "সদর রোড ও চকবাজার",
                        Rupatali: "রুপাতলী ও জিরো পয়েন্ট",
                        Nathullabad: "নথুল্লাবাদ ও সিঅ্যান্ডবি",
                        Alekanda: "আলেকান্দা ও সাগরদী",
                        BrownCompound: "ব্রাউন কম্পাউন্ড ও জিলা স্কুল রোড",
                        Amrajuri: "কাউনিয়া ও আমানতগঞ্জ",
                      };
                      setForm({
                        ...form,
                        area: val,
                        areaBn: bnMap[val] || val,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Sadar">{isBn ? "সদর রোড ও চকবাজার" : "Sadar Road & Chawkbazar"}</option>
                    <option value="Rupatali">{isBn ? "রুপাতলী ও জিরো পয়েন্ট" : "Rupatali & Zero Point"}</option>
                    <option value="Nathullabad">{isBn ? "নথুল্লাবাদ ও সিঅ্যান্ডবি" : "Nathullabad & C&B Road"}</option>
                    <option value="Alekanda">{isBn ? "আলেকান্দা ও সাগরদী" : "Alekanda & Sagardi"}</option>
                    <option value="BrownCompound">{isBn ? "ব্রাউন কম্পাউন্ড ও জিলা স্কুল রোড" : "Brown Compound & Zilla School"}</option>
                    <option value="Amrajuri">{isBn ? "কাউনিয়া ও আমানতগঞ্জ" : "Kawnia & Amanatganj"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "বাস্তব অভিজ্ঞতা (বছর)" : "Years of Experience"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "ভিজিট ফি বা মজুরি বিষয়ক তথ্য" : "Indicative Fee / Pricing Note"}
                </label>
                <input
                  type="text"
                  value={form.pricingNoteBn}
                  onChange={(e) => setForm({ ...form, pricingNoteBn: e.target.value })}
                  placeholder={isBn ? "যেমন: ভিজিট ফি ২০০ টাকা (কাজের পরিধি অনুযায়ী মজুরি)" : "e.g. Visit fee BDT 200"}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "দক্ষতা ও সেবার বিবরণ" : "Service Description"}
                </label>
                <textarea
                  rows={2}
                  value={form.descriptionBn}
                  onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })}
                  placeholder={isBn ? "যেমন: বাসাবাড়ির ওয়্যারিং, মোটর ফিটিংস, শর্টসার্কিট সমাধান..." : "Summary of services offered..."}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-900/50">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={form.isEmergency}
                  onChange={(e) => setForm({ ...form, isEmergency: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="isEmergency" className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {isBn
                    ? "জরুরি প্রয়োজনে রাতে ও ছুটির দিনেও ২৪ ঘণ্টা সার্ভিস প্রদানে আগ্রহী"
                    : "Available for 24/7 urgent callouts including holidays and nights"}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 text-sm rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md shadow-teal-600/20 disabled:opacity-50 transition-colors"
                >
                  {isLoading
                    ? isBn
                      ? "জমা হচ্ছে..."
                      : "Submitting..."
                    : isBn
                    ? "আবেদন জমা দিন"
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
