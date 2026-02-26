"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; 

const NavLink = ({ children, href = "#", isPrimary = false, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`block px-3 py-2 text-sm font-bold transition duration-150 ease-in-out ${
      isPrimary
        ? "text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
        : "text-slate-700 hover:text-indigo-600"
    }`}
  >
    {children}
  </Link>
);

export default function NavBar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const { data: session } = useSession();
  const user = session?.user;

  // લોગો પર ક્લિક કરવાથી સીધું ડેશબોર્ડ પર જવા માટેનું ફંક્શન
  const handleLogoOrDashboardClick = (e) => {
    if (e) e.preventDefault();
    
    if (!user) {
      router.push("/");
    } else {
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "recruiter":
          router.push("/recruiter/dashboard");
          break;
        case "serviceprovider":
          router.push("/serviceprovider/dashboard");
          break;
        case "user":
        case "candidate":
          router.push("/user/dashboard");
          break;
        default:
          router.push("/");
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/login");
  };

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(isMenuOpen ? menuRef.current.scrollHeight : 0);
    }
  }, [isMenuOpen]);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // મોબાઈલ અને ડેસ્કટોપ માટે લિંક્સનું લિસ્ટ
  const navLinks = [
    { name: "About Us", href: "/aboutus" },
    { name: "Features", href: "/features" },
    { name: "Blogs", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contactus" },
    { name: "Philanthropy", href: "/philanthropy" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg shadow-indigo-100/50 py-2" : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section - Redirects to Dashboard */}
          <div
            onClick={handleLogoOrDashboardClick}
            className="cursor-pointer flex-shrink-0 text-2xl font-black text-indigo-600 tracking-tighter hover:text-indigo-800 transition-colors"
          >
            JobConnect<span className="text-slate-900">Pro</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-grow justify-center ml-12 space-x-2">
            <button 
              onClick={handleLogoOrDashboardClick}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition duration-150 ease-in-out"
            >
              Dashboard
            </button>
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>{link.name}</NavLink>
            ))}
          </div>

          {/* User Actions Section */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {user.role?.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {user.name || "User"}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-100"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-100 transition-all active:scale-95"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink href="/login">Login</NavLink>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-indigo-50 transition-all"
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

      {/* Mobile Navigation Menu - Fixed to show all fields */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-50 shadow-xl"
        style={{ maxHeight: isMenuOpen ? "100vh" : "0px" }}
      >
        <div ref={menuRef} className="px-4 pt-4 pb-8 space-y-1">
          <button 
            onClick={handleLogoOrDashboardClick}
            className="block w-full text-left px-4 py-3 text-base font-bold text-indigo-600 bg-indigo-50 rounded-xl mb-2"
          >
            Dashboard
          </button>
          
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsMenuOpen(false)} 
              className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="px-4 py-3 mb-4 bg-slate-50 rounded-xl">
                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{user.role?.replace('_', ' ')}</p>
                 <p className="text-sm font-bold text-slate-700">{user.name}</p>
               </div>
               <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 text-base font-bold text-white bg-rose-500 rounded-xl shadow-lg shadow-rose-100"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-4 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-lg">Login</Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-4 text-base font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}