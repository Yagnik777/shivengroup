// src/app/layout.js
"use client";
import "./globals.css";

import Navbar from "../components/Navbar";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";


export const metadata = {
  title: "Shivengroup",
  description: "Jobs | Engineering | Infrastructure",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin"); // detect admin routes

  // ✅ For non-admin pages, wrap in flex layout to fix footer position
  if (!isAdmin) {
    return (
      <html lang="en">
        <body className="flex flex-col min-h-screen bg-gray-50">
          <SessionProviderWrapper>
            <Navbar />
            <main className="flex-grow pt-20 pb-10">{children}</main>
            <Footer />
          </SessionProviderWrapper>
        </body>
      </html>
    );
  }

  // ✅ For admin pages — no navbar, no footer, no layout changes
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
