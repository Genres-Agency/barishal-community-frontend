"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useReportInaccuracyMutation } from "@/redux/features/services/servicesApi";
import { toast } from "sonner";

interface ReportInaccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number;
  entityName: string;
}

export default function ReportInaccuracyModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
}: ReportInaccuracyModalProps) {
  const { locale, t } = useLocale();
  const isBn = locale === "bn";
  const [reportInaccuracy, { isLoading }] = useReportInaccuracyMutation();

  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueDescription.trim()) {
      toast.error(
        isBn
          ? "অনুগ্রহ করে কী তথ্য ভুল তা সংক্ষেপে লিখুন।"
          : "Please describe what information is inaccurate."
      );
      return;
    }

    try {
      await reportInaccuracy({
        entityType,
        entityId,
        reporterName,
        reporterPhone,
        issueDescription,
      }).unwrap();

      setIsSuccess(true);
      toast.success(
        isBn
          ? "আপনার রিপোর্ট সফলভাবে জমা হয়েছে। ধন্যবাদ!"
          : "Report submitted successfully. Thank you!"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          (isBn ? "রিপোর্ট জমা দিতে সমস্যা হয়েছে।" : "Failed to submit report.")
      );
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIssueDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {isBn ? "রিপোর্ট গ্রহণ করা হয়েছে!" : "Report Received!"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              {isBn
                ? "আমাদের মডারেটর টিম দ্রুত তথ্যটি যাচাই করে আপডেট করবে। কমিউনিটিকে সঠিক রাখতে সহযোগিতার জন্য ধন্যবাদ।"
                : "Our moderator team will verify the details and update the listing shortly. Thank you for helping keep Barishal Community accurate."}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 mb-2">
                {isBn ? "নাগরিক যাচাই ও সংশোধন" : "Provenance Verification"}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.services.reportTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isBn ? "প্রতিষ্ঠান / কারিগর: " : "Listing: "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{entityName}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "কী তথ্য ভুল বা সংশোধন প্রয়োজন? *" : "What information needs update? *"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder={
                    isBn
                      ? "যেমন: নম্বরটি বন্ধ বা ভুল / দোকানটি অন্য রোডে স্থানান্তরিত হয়েছে / ফি পরিবর্তিত হয়েছে..."
                      : "e.g. Phone number changed / shop relocated / updated rates..."
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "আপনার নাম (ঐচ্ছিক)" : "Your Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder={isBn ? "নাম" : "Your name"}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "যোগাযোগের ফোন (ঐচ্ছিক)" : "Contact Phone (Optional)"}
                  </label>
                  <input
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
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
                  className="px-5 py-2 text-sm rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md shadow-amber-600/20 disabled:opacity-50 transition-colors"
                >
                  {isLoading
                    ? isBn
                      ? "জমা হচ্ছে..."
                      : "Submitting..."
                    : isBn
                    ? "রিপোর্ট জমা দিন"
                    : "Submit Report"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
