"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import useNotifications from "@/hooks/useNotifications";

const NavLink = ({ children, href = "#", isPrimary = false, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`block px-3 py-2 text-sm font-medium transition duration-150 ease-in-out ${
      isPrimary
        ? "text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
        : "text-gray-700 hover:text-blue-600"
    }`}
  >
    {children}
  </Link>
);

export default function NavBar({ links = [] }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const { data: session } = useSession();
  const user = session?.user;

  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Logo click handler
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
    } else {
      router.push("/jobs");
    }
  };

  // Animate mobile menu height
  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(isMenuOpen ? menuRef.current.scrollHeight : 0);
    }
  }, [isMenuOpen]);

  // Shadow on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-shadow ${
//         isScrolled ? "shadow-md" : "shadow-sm"
//       } bg-white`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Top Navbar Row */}
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <a
//             onClick={handleLogoClick}
//             className="cursor-pointer flex-shrink-0 text-3xl font-extrabold text-blue-700 tracking-tight hover:text-blue-800 transition"
//           >
//             Vaccancies
//           </a>

//           {/* Desktop Links */}
//           <div className="hidden md:flex flex-grow justify-start ml-10 space-x-8">
//             {links.map((link, i) => (
//               <NavLink key={i} href={link.href}>
//                 {link.label}
//               </NavLink>
//             ))}
//           </div>

//           {/* Desktop User Section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <>
//                 <span className="text-gray-700 font-medium">
//                   Hello, {user.name?.split(" ")[0] || "User"}
//                 </span>

//                 <NavLink href="/profile">My Profile</NavLink>
//                 <Link href="/status" className="hover:text-blue-600">
//                   📋 My Status
//                 </Link>

//                 {/* Notification Bell */}
//                 <Link href="/notifications" className="relative">
//                   <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </Link>

//                 <button
//                   onClick={() =>
//                     signOut({ redirect: true, callbackUrl: "/login" })
//                   }
//                   className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
//                 >
//                   Log Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 <NavLink isPrimary href="/login">
//                   Login
//                 </NavLink>
//                 <NavLink isPrimary href="/register">
//                   Register
//                 </NavLink>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d={
//                     isMenuOpen
//                       ? "M6 18L18 6M6 6l12 12"
//                       : "M4 6h16M4 12h16M4 18h16"
//                   }
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {/* Mobile Menu */}
//       <div
//         className="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t bg-white"
//         style={{ maxHeight: `${menuHeight}px` }}
//       >
//         <div ref={menuRef} className="px-3 pt-2 pb-4 space-y-1">
//           {links.map((link, i) => (
//             <NavLink key={i} href={link.href} onClick={() => setIsMenuOpen(false)}>
//               {link.label}
//             </NavLink>
//           ))}
      
//           {user ? (
//             <>
//               {/* Greeting */}
//               <span className="block px-3 py-2 text-sm font-medium text-gray-700">
//                 Hello, {user.name?.split(" ")[0] || "User"}
//               </span>
          
//               {/* Jobs & Profile */}
//               <NavLink href="/jobs" onClick={() => setIsMenuOpen(false)}>
//                 Jobs
//               </NavLink>
//               <NavLink href="/profile" onClick={() => setIsMenuOpen(false)}>
//                 My Profile
//               </NavLink>
          
//               {/* Status */}
//               <NavLink href="/status" onClick={() => setIsMenuOpen(false)}>
//                 📋 My Status
//               </NavLink>
          
//               {/* Notifications */}
//               <Link
//                 href="/notifications"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 relative"
//               >
//                 🔔 Notifications
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </Link>
              
//               {/* Logout */}
//               <button
//                 onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
//                 className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
//               >
//                 Log Out
//               </button>
//             </>
//           ) : (
//             <>
//               <NavLink isPrimary href="/login" onClick={() => setIsMenuOpen(false)}>
//                 Login
//               </NavLink>
//               <NavLink isPrimary href="/register" onClick={() => setIsMenuOpen(false)}>
//                 Register
//               </NavLink>
//             </>
//           )}
//         </div>
//       </div>

//     </nav>


<nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg shadow-indigo-100/50 py-2" : "bg-white py-4"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Top Navbar Row */}
    <div className="flex justify-between items-center h-16">
      {/* Logo - Indigo Theme */}
      <a
        onClick={handleLogoClick}
        className="cursor-pointer flex-shrink-0 text-2xl font-black text-indigo-600 tracking-tighter hover:text-indigo-800 transition-colors"
      >
        JobConnect<span className="text-slate-900">Pro</span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex flex-grow justify-start ml-12 space-x-1">
        {links.map((link, i) => (
          <NavLink key={i} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Desktop User Section */}
      <div className="hidden md:flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Welcome</span>
              <span className="text-sm font-bold text-slate-700">
                {user.name?.split(" ")[0] || "User"}
              </span>
            </div>

            <div className="h-8 w-[1px] bg-slate-100"></div>

            <div className="flex items-center space-x-5">
              <NavLink href="/profile">Profile</NavLink>
              
              <Link href="/status" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                📋 Status
              </Link>

              {/* Notification Bell with Indigo Theme */}
              <Link href="/notifications" className="relative group p-2 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all">
                <Bell className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <NavLink href="/login">Login</NavLink>
            <Link 
              href="/register" 
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all outline-none"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu - Themed */}
  <div
    className="md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-50"
    style={{ maxHeight: `${menuHeight}px` }}
  >
    <div ref={menuRef} className="px-4 pt-4 pb-6 space-y-2">
      {links.map((link, i) => (
        <Link 
          key={i} 
          href={link.href} 
          onClick={() => setIsMenuOpen(false)}
          className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
        >
          {link.label}
        </Link>
      ))}
  
      {user ? (
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
          <div className="px-4 py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Logged in as</span>
            <span className="text-sm font-bold text-slate-900">{user.name}</span>
          </div>
      
          <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
            👤 My Profile
          </Link>
          
          <Link href="/status" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
            📋 My Status
          </Link>
      
          <Link href="/notifications" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
            <span>🔔 Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </Link>
          
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            className="w-full mt-4 px-4 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl">
            Login
          </Link>
          <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-center py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
            Register
          </Link>
        </div>
      )}
    </div>
  </div>
</nav>

  )
}
