"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Stethoscope, Wrench, Menu } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { t } = useLocale();

  const navItems = [
    {
      label: t.navigation.home,
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: t.navigation.mobility,
      href: "/transit",
      icon: Compass,
      isActive: pathname.startsWith("/transit"),
    },
    {
      label: t.navigation.healthcare,
      href: "/healthcare",
      icon: Stethoscope,
      isActive: pathname.startsWith("/healthcare"),
    },
    {
      label: t.navigation.services,
      href: "/services",
      icon: Wrench,
      isActive: pathname.startsWith("/services"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden shadow-lg safe-bottom">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-md transition-colors ${
                item.isActive ? "text-emerald-700 font-semibold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? "text-emerald-700 stroke-[2.5]" : ""}`} />
              <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t.common.language === "Language" ? "Menu" : "মেনু"}</span>
        </button>
      </div>
    </nav>
  );
}
