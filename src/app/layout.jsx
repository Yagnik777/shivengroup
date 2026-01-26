// // src/app/layout.js
// "use client";
// import "./globals.css";

// import Navbar from "../components/Navbar";
// import SessionProviderWrapper from "../components/SessionProviderWrapper";
// import Footer from "../components/Footer";
// import { usePathname } from "next/navigation";
// import RecruiterDashboard from "./recruiter/dashboard/page";

// export default function RootLayout({ children }) {
//   const pathname = usePathname();
//   const isAdmin = pathname.startsWith("/admin"); // detect admin routes

//   // ✅ For non-admin pages, wrap in flex layout to fix footer position
//   if (!isAdmin) {
//     return (
//       <html lang="en">
//         <body className="flex flex-col min-h-screen bg-gray-50">
//           <SessionProviderWrapper>
//             <Navbar />
//             <main className="flex-grow pt-20 pb-10">{children}</main>
//             <Footer />
//           </SessionProviderWrapper>
//         </body>
//       </html>
//     );
//   }

//   // ✅ For admin pages — no navbar, no footer, no layout changes
//   return (
//     <html lang="en">
//       <body>
//         <SessionProviderWrapper>{children}</SessionProviderWrapper>
//       </body>
//     </html>
//   );
// }
// src/app/layout.js
"use client";
import "./globals.css";

import Navbar from "../components/Navbar";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import RecruiterSidebar from "../components/RecruiterSidebar";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  const isAdmin = pathname.startsWith("/admin"); 
  const isRecruiter = pathname.startsWith("/recruiter"); // ✅ Recruiter પાથ ડિટેક્ટ કરવા માટે

  // ✅ 1. Admin Pages: No Navbar, No Footer
  if (isAdmin) {
    return (
      <html lang="en">
        <body>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </body>
      </html>
    );
  }

  // ✅ 2. Recruiter Pages: No Global Navbar/Footer (કારણ કે રિક્રૂટરનું પોતાનું સાઇડબાર છે)
  if (isRecruiter) {
    return (
      <html lang="en">
        <body className="bg-slate-50">
          <SessionProviderWrapper>
            <main>{children}</main>
          </SessionProviderWrapper>
        </body>
      </html>
    );
  }

  // ✅ 3. Regular User Pages: Default Layout with Navbar & Footer
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