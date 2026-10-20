"use client";

import React, { useState, useMemo } from "react";
import { useGetAllPostQuery } from "@/redux/features/post/post.api";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { useLocale } from "@/lib/i18n";
import FeedNavigation from "./FeedNavigation";
import PostCard from "./PostCard";
import PostCreator from "./PostCreator";
import { Flame, Clock, Sparkles, Filter, Search } from "lucide-react";

export default function CommunityFeed() {
  const { locale } = useLocale();
  const isBn = locale === "bn";

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [activeSort, setActiveSort] = useState<"latest" | "popular">("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetAllCategoryQuery(undefined);
  const { data: postData = [], isLoading: isPostsLoading } = useGetAllPostQuery(
    selectedCategoryId !== "all" ? { categoryId: selectedCategoryId } : undefined
  );

  // Filter and sort posts in memory for instant responsiveness
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(postData)) return [];

    let result = [...postData];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.content?.toLowerCase().includes(q) ||
          p.author?.firstName?.toLowerCase().includes(q) ||
          p.author?.lastName?.toLowerCase().includes(q) ||
          p.category?.title?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort === "popular") {
      result.sort((a, b) => {
        const scoreA = (a._count?.likes || 0) * 2 + (a._count?.comments || 0);
        const scoreB = (b._count?.likes || 0) * 2 + (b._count?.comments || 0);
        return scoreB - scoreA;
      });
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [postData, searchQuery, activeSort]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Quick Hub Navigation Cards */}
      <FeedNavigation />

      {/* Post Creator Box */}
      <PostCreator />

      {/* Community Feed Filters & Sort */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "কমিউনিটি পোস্টে খুঁজুন..." : "Search community discussions..."}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveSort("latest")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSort === "latest"
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isBn ? "সর্বশেষ" : "Latest"}</span>
            </button>

            <button
              onClick={() => setActiveSort("popular")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSort === "popular"
                  ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isBn ? "জনপ্রিয় আলোচনা" : "Popular"}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {isBn ? "সকল আলোচনা" : "All Discussions"}
          </button>

          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === cat.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      {isPostsLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 mx-auto border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">{isBn ? "পোস্ট লোড হচ্ছে..." : "Loading discussions..."}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <Sparkles className="w-10 h-10 mx-auto text-emerald-600 mb-2 opacity-80" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {isBn ? "কোনো পোস্ট পাওয়া যায়নি" : "No discussions found"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            {isBn
              ? "এই ক্যাটাগরিতে এখনো কোনো আলোচনা নেই। প্রথম পোস্ট করে আলোচনা শুরু করুন!"
              : "No discussions under this filter yet. Be the first to start the conversation!"}
          </p>
          <button
            onClick={() => {
              setSelectedCategoryId("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-colors"
          >
            {isBn ? "সব পোস্ট দেখুন" : "View All Posts"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post: any) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
