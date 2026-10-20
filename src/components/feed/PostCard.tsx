"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import {
  useAddCommentMutation,
  useGetSingleCommentQuery,
} from "@/redux/features/comment/comment.api";
import {
  useGetSingleLikeQuery,
  useToggleLikeMutation,
} from "@/redux/features/likes/like.api";
import {
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Send,
  ShieldCheck,
  Flag,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

export interface PostCardProps {
  id: number;
  content: string;
  photo?: string | null;
  authorId: number;
  createdAt: string;
  author?: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    role?: string;
  };
  category?: {
    id: number;
    title: string;
    slug: string;
  };
  _count?: {
    likes?: number;
    comments?: number;
  };
}

export default function PostCard(props: PostCardProps) {
  const { id, content, photo, authorId, createdAt, category, author } = props;
  const { locale } = useLocale();
  const isBn = locale === "bn";

  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // RTK Query for comments and likes
  const { data: commentData, refetch: refetchComments } = useGetSingleCommentQuery(id);
  const { data: likeData, refetch: refetchLikes } = useGetSingleLikeQuery(id);
  const [toggleLike, { isLoading: isLiking }] = useToggleLikeMutation();
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();

  const currentLikesCount =
    likeData?.count !== undefined
      ? likeData.count
      : props._count?.likes || 0;

  const currentCommentsCount =
    commentData?.count !== undefined
      ? commentData.count
      : props._count?.comments || 0;

  const commentsList = commentData?.comments || [];

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      await toggleLike({ postId: id }).unwrap();
      refetchLikes();
    } catch {
      // Revert optimistic state
      setIsLiked(isLiked);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({ postId: id, content: commentText.trim() }).unwrap();
      setCommentText("");
      refetchComments();
      toast.success(isBn ? "মন্তব্য যুক্ত হয়েছে!" : "Comment posted!");
    } catch {
      toast.error(isBn ? "মন্তব্য করতে লগইন প্রয়োজন হতে পারে।" : "Failed to post comment.");
    }
  };

  const handleShare = (platform: "copy" | "facebook" | "twitter" | "whatsapp") => {
    const postUrl = typeof window !== "undefined" ? `${window.location.origin}/#post-${id}` : "";

    switch (platform) {
      case "copy":
        if (navigator.clipboard) {
          navigator.clipboard.writeText(postUrl);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
          toast.success(isBn ? "পোস্টের লিঙ্ক কপি হয়েছে!" : "Link copied to clipboard!");
        }
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(content.slice(0, 100))}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${content.slice(0, 80)}... ${postUrl}`)}`, "_blank");
        break;
    }
    setShowShareOptions(false);
  };

  // Format relative time in Bengali / English
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (isBn) {
        if (diffMins < 1) return "এইমাত্র";
        if (diffMins < 60) return `${diffMins} মিনিট আগে`;
        if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
        if (diffDays === 1) return "গতকাল";
        return `${diffDays} দিন আগে`;
      } else {
        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "yesterday";
        return `${diffDays}d ago`;
      }
    } catch {
      return "";
    }
  };

  // Role tag mapping
  const role = author?.role;
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";

  const authorName = author
    ? `${author.firstName || ""} ${author.lastName || ""}`.trim()
    : isBn
    ? "বরিশালবাসী"
    : "Barishal Resident";

  return (
    <article
      id={`post-${id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group"
    >
      {/* Post Header: Author & Category */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11 border-2 border-emerald-100 dark:border-emerald-950">
            <AvatarImage
              src={author?.avatar || "/assets/profile.jpg"}
              alt={authorName}
              className="object-cover"
            />
            <AvatarFallback className="bg-emerald-600 text-white font-bold">
              {author?.firstName?.[0] || "B"}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors">
                {authorName}
              </h3>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  {isBn ? "অ্যাডমিন" : "Admin"}
                </span>
              ) : isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <ShieldCheck className="w-3 h-3" />
                  {isBn ? "মডারেটর" : "Moderator"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {isBn ? "বরিশালবাসী" : "Resident"}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatTime(createdAt)}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        {category?.title && (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 shrink-0">
            {category.title}
          </span>
        )}
      </div>

      {/* Post Text Content */}
      <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed mb-4 whitespace-pre-line font-bangla">
        {content}
      </div>

      {/* Post Photo (if attached) */}
      {photo && (
        <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-96 relative bg-slate-100 dark:bg-slate-800">
          <img
            src={photo}
            alt="Barishal community post photo"
            className="w-full h-auto max-h-96 object-cover hover:scale-101 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Interaction Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
        <div className="flex items-center gap-5">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-colors py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
              isLiked ? "text-rose-600 font-bold" : "hover:text-rose-600"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? "fill-rose-600 text-rose-600" : ""
              }`}
            />
            <span>{currentLikesCount}</span>
            <span className="hidden sm:inline">{isBn ? "লাইক" : "Likes"}</span>
          </button>

          {/* Comments Toggle */}
          <button
            onClick={() => {
              setShowComments(!showComments);
              if (showShareOptions) setShowShareOptions(false);
            }}
            className={`flex items-center gap-1.5 transition-colors py-1 px-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/30 ${
              showComments ? "text-teal-600 font-bold" : "hover:text-teal-600"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{currentCommentsCount}</span>
            <span className="hidden sm:inline">{isBn ? "মন্তব্য" : "Comments"}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              setShowShareOptions(!showShareOptions);
              if (showComments) setShowComments(false);
            }}
            className={`flex items-center gap-1.5 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
              showShareOptions ? "text-slate-900 dark:text-white font-bold" : ""
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isBn ? "শেয়ার" : "Share"}</span>
          </button>
        </div>

        {/* Report / Citizen Moderation Button */}
        <button
          onClick={() => {
            toast.info(
              isBn
                ? "পোস্টটি মডারেটর টিমের পর্যালোচনার জন্য চিহ্নিত করা হয়েছে।"
                : "Post reported for moderator review."
            );
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          title={isBn ? "রিপোর্ট করুন" : "Report post"}
        >
          <Flag className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Share Dropdown */}
      {showShareOptions && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 animate-fadeIn flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
            {isBn ? "শেয়ার করুন:" : "Share:"}
          </span>
          <button
            onClick={() => handleShare("copy")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium hover:bg-slate-100"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isBn ? "কপি হয়েছে!" : "Copied!") : isBn ? "লিঙ্ক কপি" : "Copy Link"}</span>
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-medium hover:opacity-90"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-medium hover:opacity-90"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 text-xs font-medium hover:opacity-90"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>Twitter/X</span>
          </button>
        </div>
      )}

      {/* Comments Drawer / Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 animate-fadeIn">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isBn ? "আপনার মতামত বা মন্তব্য লিখুন..." : "Write a comment..."}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bangla"
            />
            <button
              type="submit"
              disabled={isCommenting || !commentText.trim()}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? "পাঠান" : "Post"}</span>
            </button>
          </form>

          {/* List of comments */}
          {commentsList.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {commentsList.map((c: any) => (
                <div
                  key={c.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs"
                >
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={c.user?.avatar || "/assets/profile.jpg"} />
                    <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-[10px]">
                      {c.user?.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {c.user ? `${c.user.firstName || ""} ${c.user.lastName || ""}`.trim() : (isBn ? "নাগরিক" : "Resident")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTime(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-bangla leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              {isBn ? "এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!" : "No comments yet. Be the first to comment!"}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
