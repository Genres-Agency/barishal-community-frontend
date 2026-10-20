"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { useAddPostMutation } from "@/redux/features/post/post.api";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetUserQuery } from "@/redux/features/auth/authApi";
import { useLocale } from "@/lib/i18n";
import { Image as ImageIcon, X, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function PostCreator() {
  const { locale } = useLocale();
  const isBn = locale === "bn";

  const [postContent, setPostContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const currentUser = useAppSelector(selectCurrentUser);
  const { data: userProfile } = useGetUserQuery(undefined, {
    skip: !currentUser?.userId,
  });

  const { data: categories = [] } = useGetAllCategoryQuery(undefined);
  const [addPost, { isLoading }] = useAddPostMutation();

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(String(categories[0].id));
    }
  }, [categories, selectedCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !file) return;

    if (!currentUser?.userId) {
      toast.error(
        isBn
          ? "পোস্ট তৈরি করতে অনুগ্রহ করে প্রথমে সাইন ইন করুন।"
          : "Please sign in to publish a community post."
      );
      return;
    }

    try {
      const data = new FormData();
      data.append("content", postContent.trim());
      data.append("categoryId", selectedCategory || String(categories[0]?.id || 1));

      if (file) {
        data.append("image", file);
      }

      const result = await addPost(data).unwrap();

      toast.success(
        isBn
          ? "আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে!"
          : "Post published successfully!"
      );

      // Reset
      setPostContent("");
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview(null);
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          (isBn
            ? "পোস্ট তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
            : "Failed to publish post. Please try again.")
      );
    }
  };

  const authorDisplayName = userProfile
    ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim()
    : isBn
    ? "বরিশালবাসী নাগরিক"
    : "Barishal Resident";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border border-emerald-100 dark:border-emerald-950">
          <AvatarImage
            src={userProfile?.avatar || "/assets/profile.jpg"}
            alt={authorDisplayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-emerald-600 text-white font-bold text-sm">
            {userProfile?.firstName?.[0] || "B"}
          </AvatarFallback>
        </Avatar>

        <div
          onClick={() => setIsModalOpen(true)}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-between border border-slate-200/60 dark:border-slate-700"
        >
          <span className="font-bangla">
            {isBn
              ? "বরিশালের যেকোনো নাগরিক তথ্য, অভিজ্ঞতা বা প্রশ্ন শেয়ার করুন..."
              : "Share news, ask questions, or post community updates..."}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold shrink-0 hidden sm:inline-block">
            {isBn ? "পোস্ট করুন" : "New Post"}
          </span>
        </div>
      </div>

      {/* Creation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <DialogHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? "নতুন কমিউনিটি পোস্ট" : "Create Community Post"}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePostSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* User row */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-emerald-100">
                <AvatarImage src={userProfile?.avatar || "/assets/profile.jpg"} />
                <AvatarFallback>{authorDisplayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {authorDisplayName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isBn ? "বরিশাল কমিউনিটি ফোরাম" : "Public Community Post"}
                </p>
              </div>
            </div>

            {/* Content Textarea */}
            <textarea
              required
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={
                isBn
                  ? "কীর্তনখোলা লঞ্চের অভিজ্ঞতা, কোনো সড়ক বা ড্রেন সমস্যা, ঐতিহ্যবাহী মিষ্টির খোঁজ, কিংবা রক্তের জরুরি অনুরোধ বিস্তারিত লিখুন..."
                  : "Write your post here... Share local information, experiences or emergency calls."
              }
              rows={4}
              className="w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bangla resize-none"
            />

            {/* Image Preview */}
            {preview && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-60 bg-black/5">
                <img
                  src={preview}
                  alt="Post preview"
                  className="w-full h-auto max-h-60 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (preview) URL.revokeObjectURL(preview);
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isBn ? "ক্যাটাগরি নির্বাচন করুন *" : "Select Category *"}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c: any) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(String(c.id))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === String(c.id)
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Photo File Input */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer text-xs font-semibold transition-colors">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? "ছবি সংযুক্ত করুন" : "Attach Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs h-9 px-4 rounded-xl"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (!postContent.trim() && !file)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-5 rounded-xl font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLoading ? (isBn ? "প্রকাশ হচ্ছে..." : "Posting...") : (isBn ? "পোস্ট প্রকাশ করুন" : "Publish Post")}</span>
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
