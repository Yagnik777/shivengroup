// src/app/layout.js
"use client"; 
import "./globals.css";

import Navbar from "../components/Navbar";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin"); // detect admin routes

  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {/* Common Navbar */}
          {!isAdmin && <Navbar />}

          {/* Page-specific content */}
          <main>{children}</main>

          {/* Footer */}
          {!isAdmin && <Footer />}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
