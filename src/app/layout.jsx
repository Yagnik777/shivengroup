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
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body className={!isAdmin ? "flex flex-col min-h-screen bg-gray-50" : ""}>
        <SessionProviderWrapper>
          {!isAdmin && <Navbar />}
          <main className={!isAdmin ? "flex-grow pt-20 pb-10" : ""}>
            {children}
          </main>
          {!isAdmin && <Footer />}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
