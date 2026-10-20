import {
  BellRing,
  Briefcase,
  Calendar,
  Compass,
  Home,
  MessageSquare,
  Search,
  Settings,
  Stethoscope,
  Store,
  Wrench,
} from "lucide-react";

export const feedNavigationItems = [
  {
    icon: Compass,
    text: "লঞ্চ ও যাতায়াত হাব",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-700 dark:text-emerald-300",
    hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    href: "/transit",
  },
  {
    icon: Stethoscope,
    text: "ডাক্তার ও হাসপাতাল",
    bgColor: "bg-rose-50 dark:bg-rose-950/40",
    textColor: "text-rose-700 dark:text-rose-300",
    hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/40",
    href: "/healthcare",
  },
  {
    icon: Wrench,
    text: "কারিগর ও সেবা",
    bgColor: "bg-teal-50 dark:bg-teal-950/40",
    textColor: "text-teal-700 dark:text-teal-300",
    hoverBg: "hover:bg-teal-100 dark:hover:bg-teal-900/40",
    href: "/services",
  },
  {
    icon: Store,
    text: "দোকান ও নোটিশবোর্ড",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    textColor: "text-amber-700 dark:text-amber-300",
    hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/40",
    href: "/services",
  },
];

export const navigationItemsLeftSite = [
  {
    icon: Home,
    label: "হোম",
    href: "/",
  },
  // {
  //   icon: Newspaper,
  //   label: "ফিড",
  //   href: "/feed",
  // },
  // {
  //   icon: Users,
  //   label: "গ্রুপস",
  //   href: "/groups",
  // },
  {
    icon: MessageSquare,
    label: "মেসেজেস",
    href: "/messages",
  },
  // {
  //   icon: ShoppingBag,
  //   label: "মার্কেটপ্লেস",
  //   href: "/marketplace",
  // },
  // {
  //   icon: Calendar,
  //   label: "ইভেন্টস",
  //   href: "/events",
  // },
  {
    icon: BellRing,
    label: "নোটিফিকেশন্স",
    href: "/notifications",
  },
  // {
  //   icon: HelpCircle,
  //   label: "সহায়তা",
  //   href: "/help",
  // },
  {
    icon: Settings,
    label: "সেটিংস",
    href: "/settings",
  },
];

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
}

export const upcomingEvents: Event[] = [
  {
    title: "বরিশাল টেক মিট ২০২৪",
    date: "১৫ মার্চ",
    time: "সকাল ১০:০০",
    location: "বরিশাল সিটি কলেজ",
  },
  {
    title: "সাহিত্য আড্ডা",
    date: "২০ মার্চ",
    time: "বিকাল ৪:০০",
    location: "আশরাফ উদ্দিন চৌধুরী সিটি লাইব্রেরি",
  },
  {
    title: "ক্যারিয়ার ওয়ার্কশপ",
    date: "২৫ মার্চ",
    time: "সকাল ১১:০০",
    location: "বরিশাল বিশ্ববিদ্যালয়",
  },
];

interface TrendingTopic {
  hashtag: string;
  postCount: string;
}

export const trendingTopics: TrendingTopic[] = [
  {
    hashtag: "#বরিশাল",
    postCount: "১,২৩৪",
  },
  {
    hashtag: "#জবসার্কুলার",
    postCount: "৮৯০",
  },
  {
    hashtag: "#শিক্ষা",
    postCount: "৭৫৬",
  },
  {
    hashtag: "#সাহিত্য",
    postCount: "৬৪৫",
  },
  {
    hashtag: "#খেলাধুলা",
    postCount: "৫৩২",
  },
];
