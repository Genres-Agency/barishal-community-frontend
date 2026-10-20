import Navbar from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import ReduxProvider from "@/lib/providers/ReduxProviders";
import type { Metadata } from "next";
import { Poppins, Tiro_Bangla } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const tiro_bangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali"],
  variable: "--font-bangla",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-english",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barishal Community",
  description:
    "A vibrant community platform for the people of Barishal, fostering connections, sharing information, and building stronger relationships.",
  keywords: [
    "Barishal",
    "community",
    "barishal community",
    "Bangladesh",
    "local events",
    "community platform",
  ],
  authors: [{ name: "Barishal Community" }],
  openGraph: {
    title: "Barishal Community",
    description: "Connect with your local community in Barishal",
    type: "website",
    locale: "bn_BD",
  },
};

import { LocaleProvider } from "@/lib/i18n";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${tiro_bangla.variable} ${poppins.variable}`}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans">
        <ReduxProvider>
          <LocaleProvider>
            <ErrorBoundary>
              {/* Sticky Navbar */}
              <div className="sticky top-0 z-50">
                <Navbar />
              </div>
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
            </ErrorBoundary>
            <Toaster position="top-center" richColors />
          </LocaleProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
