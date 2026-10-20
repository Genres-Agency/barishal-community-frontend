"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import EmergencyQuickBar from "./emergency/EmergencyQuickBar";
import MobileBottomNav from "./navigation/MobileBottomNav";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetUserQuery } from "@/redux/features/auth/authApi";
import {
  Compass,
  Stethoscope,
  Wrench,
  Newspaper,
  Languages,
  Search,
  User,
  Menu,
  X,
  Waves,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectCurrentUser);
  const { data: user } = useGetUserQuery(undefined, {
    skip: !userData?.userId,
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/transit?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    {
      label: t.navigation.mobility,
      href: "/transit",
      icon: Compass,
      isActive: pathname.startsWith("/transit"),
      badge: locale === "bn" ? "লঞ্চ ও বাস" : "Launch & Bus",
    },
    {
      label: t.navigation.healthcare,
      href: "/healthcare",
      icon: Stethoscope,
      isActive: pathname.startsWith("/healthcare"),
      badge: locale === "bn" ? "ডাক্তার ও SBMCH" : "Doctors & Clinic",
    },
    {
      label: t.navigation.services,
      href: "/services",
      icon: Wrench,
      isActive: pathname.startsWith("/services"),
      badge: locale === "bn" ? "কারিগর ও নোটিশ" : "Trades & Notices",
    },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo & Local Identity */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                  <Waves className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {t.common.siteTitle}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-medium tracking-wide -mt-1 hidden xs:block">
                    {locale === "bn" ? "বরিশাল লোকাল সার্ভিস ও ট্রানজিট" : "Barishal Local Transit & Community"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {t.navigation.home}
              </Link>

              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      link.isActive
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] bg-emerald-100/80 text-emerald-800 px-1.5 py-0.2 rounded-full font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Global Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common.searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </form>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                id="lang-toggle-btn"
                type="button"
                onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors shadow-2xs"
                title={locale === "bn" ? "Switch to English" : "বাংলা ভাষায় দেখুন"}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-600" />
                <span>{locale === "bn" ? "English" : "বাংলা"}</span>
              </button>

              {/* User Profile or Sign In */}
              {userData?.userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-emerald-500/20">
                        <AvatarImage src="/assets/profile.jpg" />
                        <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">
                          {user?.data?.firstName?.slice(0, 1) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.data?.firstName ? `${user.data.firstName} ${user.data.lastName || ""}` : "My Account"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.data?.email || userData.userId}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{t.common.myProfile}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/transit" className="flex items-center gap-2 cursor-pointer">
                        <Compass className="w-4 h-4 text-gray-500" />
                        <span>{t.navigation.mobility}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{t.navigation.adminConsole}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.common.signOut}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{t.common.signIn}</span>
                </Link>
              )}

              {/* Mobile menu drawer trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Quick Access Bar */}
        <EmergencyQuickBar />
      </header>

      {/* Persistent Mobile Bottom Navigation */}
      <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b flex items-center justify-between bg-emerald-700 text-white">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-emerald-200" />
                <span className="font-bold text-base">{t.common.siteTitle}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.common.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </form>

              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-800"
                >
                  <Waves className="w-5 h-5 text-emerald-600" />
                  <span>{t.navigation.home}</span>
                </Link>

                <Link
                  href="/transit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-800"
                >
                  <Compass className="w-5 h-5 text-emerald-600" />
                  <span>{t.navigation.mobility}</span>
                </Link>

                <Link
                  href="/healthcare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-800"
                >
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                  <span>{t.navigation.healthcare}</span>
                </Link>

                <Link
                  href="/notices"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-800"
                >
                  <Newspaper className="w-5 h-5 text-emerald-600" />
                  <span>{t.navigation.communityNews}</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-800"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{t.navigation.adminConsole}</span>
                </Link>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {t.common.language}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("bn");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border text-center ${
                      locale === "bn" ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("en");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border text-center ${
                      locale === "en" ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              {userData?.userId ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-sm font-medium text-red-600 border border-red-200 rounded-lg bg-white hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.common.signOut}</span>
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 px-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{t.common.signIn}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
