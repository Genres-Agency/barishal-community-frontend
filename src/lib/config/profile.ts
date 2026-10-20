export interface UserProfile {
  name: string;
  location: string;
  memberSince: string;
  email: string;
  phone: string;
  bio: string;
  website: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  stats: {
    posts: number;
    comments: number;
    events: number;
  };
}

export const mockUserProfile: UserProfile = {
  name: "আতাউল্লাহ",
  location: "বরিশাল, বাংলাদেশ",
  memberSince: "২০২৩",
  email: "ataullahm100@gmail.com",
  phone: "+880 1719-199967",
  bio: "বরিশাল কমিউনিটির একজন সক্রিয় সদস্য। সফটওয়্যার ডেভেলপার হিসেবে কাজ করি।",
  website: "https://ataullah.com",
  social: {
    facebook: "https://facebook.com/username",
    twitter: "https://twitter.com/username",
    linkedin: "https://linkedin.com/in/username",
  },
  stats: {
    posts: 24,
    comments: 128,
    events: 8,
  },
};

import { PostProps } from "../constant";

export interface ProfilePostItem extends PostProps {
  title: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export const posts: ProfilePostItem[] = [
  {
    id: 101,
    authorId: 1,
    categoryId: 1,
    hashTagId: 1,
    title: "বরিশালে ডেভেলপার মিটআপ",
    timestamp: "২ দিন আগে",
    content: "আগামী শনিবার বরিশালে একটি কমিউনিটি মিটআপের আয়োজন করা হয়েছে...",
    photo: "/assets/community-event.png",
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
    likes: 24,
    comments: 12,
    shares: 4,
    _count: {
      likes: 24,
      comments: 12,
    },
  },
  {
    id: 102,
    authorId: 1,
    categoryId: 1,
    hashTagId: 1,
    title: "নতুন আইটি প্রশিক্ষণ কেন্দ্র",
    timestamp: "৫ দিন আগে",
    content: "বরিশালে নতুন একটি আইটি প্রশিক্ষণ ও কমিউনিটি সেন্টার চালু হতে যাচ্ছে...",
    photo: "",
    createdAt: "2026-03-08T10:00:00Z",
    updatedAt: "2026-03-08T10:00:00Z",
    likes: 18,
    comments: 8,
    shares: 2,
    _count: {
      likes: 18,
      comments: 8,
    },
  },
];
