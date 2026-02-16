// "use client";

// import { useState, useRef, useEffect } from "react";
// import { signOut, useSession } from "next-auth/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ChevronDown } from "lucide-react"; // આ ઈમ્પોર્ટ કરજો
// import { motion, AnimatePresence } from "framer-motion"; // આ ઈમ્પોર્ટ કરજો



// const NavLink = ({ children, href = "#", isPrimary = false, onClick }) => (
//   <Link
//     href={href}
//     onClick={onClick}
//     className={`block px-3 py-2 text-sm font-bold transition duration-150 ease-in-out ${
//       isPrimary
//         ? "text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
//         : "text-slate-700 hover:text-indigo-600"
//     }`}
//   >
//     {children}
//   </Link>
// );

// export default function NavBar({ links = [] }) {
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ડ્રોપડાઉન સ્ટેટ
//   const [menuHeight, setMenuHeight] = useState(0);
//   const menuRef = useRef(null);
//   const { data: session } = useSession();
//   const user = session?.user;

//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     if (!user) {
//       router.push("/login");
//     } else if (user.role === "recruiter") {
//       router.push("/recruiter/dashboard");
//     } else if (user.role === "service_provider") {
//       router.push("/service-provider/dashboard");
//     } else {
//       router.push("/jobs");
//     }
//   };

//   useEffect(() => {
//     if (menuRef.current) {
//       setMenuHeight(isMenuOpen ? menuRef.current.scrollHeight : 0);
//     }
//   }, [isMenuOpen]);

//   const [isScrolled, setIsScrolled] = useState(false);
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 0);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg shadow-indigo-100/50 py-2" : "bg-white py-4"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div
           
//             className="cursor-pointer flex-shrink-0 text-2xl font-black text-indigo-600 tracking-tighter hover:text-indigo-800 transition-colors"
//           >
//             JobConnect<span className="text-slate-900">Pro</span>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex flex-grow justify-center ml-12 space-x-2">
//             {links.map((link, i) => (
//               <NavLink key={i} href={link.href}>
//                 {link.label}
//               </NavLink>
//             ))}
//             <NavLink href="/">Home</NavLink>
//             <NavLink href="/aboutus">About Us</NavLink>
//             <NavLink href="/features">Features</NavLink>
//             <NavLink href="/blog">Blogs / Articles</NavLink>
//             <NavLink href="/philanthropy">Philanthropy</NavLink>
//             <NavLink href="/careers">Careers</NavLink>
//             <NavLink href="/contactus">Contact Us</NavLink>

//           </div>

//           {/* Desktop User Section */}
//           <div className="hidden md:flex items-center space-x-6">
//             {user ? (
//               <div className="flex items-center space-x-6">
//                 <div className="flex flex-col items-end">
//                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//                     {user.role?.replace('_', ' ')}
//                   </span>
//                   <span className="text-sm font-bold text-slate-700">
//                     {user.name || "User"}
//                   </span>
//                 </div>
//                 <div className="h-8 w-[1px] bg-slate-100"></div>
//                 <button
//                   onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
//                   className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
//                 >
//                   Log Out
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <NavLink href="/login">Login</NavLink>
                
//                 {/* --- Get Started Dropdown --- */}
//                 <div 
//                   className="relative"
//                   onMouseEnter={() => setIsDropdownOpen(true)}
//                   onMouseLeave={() => setIsDropdownOpen(false)}
//                 >
//                   <button 
//                     className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
//                   >
//                     Get Started
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   <AnimatePresence>
//                     {isDropdownOpen && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                         className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden py-2 z-[60]"
//                       >
//                         <Link href="/recruiter/register" className="block w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
//                           🏢 Recruiter
//                         </Link>

//                         <Link href="/register?type=candidate" className="block w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-t border-slate-50">
//                           👨‍💼 Candidate
//                         </Link>
                    
//                         <Link href="/serviceprovider/register" className="block w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-t border-slate-50">
//                           🛠️ Service Provider
//                         </Link>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all outline-none"
//             >
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
//                   d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className="md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-50"
//         style={{ maxHeight: `${menuHeight}px` }}
//       >
//         <div ref={menuRef} className="px-4 pt-4 pb-6 space-y-2">
//           <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">About Us</Link>
//           <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">Contact Us</Link>
//           <Link href="/help" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">Help</Link>
      
//           {user ? (
//             <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
//               <button
//                 onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
//                 className="w-full px-4 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all"
//               >
//                 Log Out
//               </button>
//             </div>
//           ) : (
//             <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
//               <p className="px-4 text-[10px] font-black uppercase text-slate-400">Join as</p>
//               <Link href="/recuriter/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl">🏢 Recruiter</Link>
//               <Link href="/register?type=candidate" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl">👨‍💼 Candidate</Link>
//               <Link href="/serviceprovider/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl">🛠️ Service Provider</Link>
//               <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full mt-4 text-center py-4 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-lg">Login</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { handleGlobalLogout } from "./logout"; // આ ફંક્શન બનાવો અને export કરો

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

export default function NavBar({ links = [] }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const { data: session } = useSession();
  const user = session?.user;

  // ૧. લોગો માટેનું ફંક્શન - સીધું મેઈન લેન્ડિંગ પેજ પર જવા માટે
  const handleLogoClick = () => {
    router.push("/");
  };

  // ૨. ડેશબોર્ડ માટેનું ફંક્શન - રોલ મુજબ રિડાયરેક્ટ કરવા માટે
  const handleDashboardClick = (e) => {
    if (e) e.preventDefault();
    
    if (!user) {
      router.push("/login");
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
    setIsMenuOpen(false); // મોબાઈલ મેનુ બંધ કરવા માટે
  };

  // NavBar.jsx ની અંદર
  const handleLogout = async () => {
    // ૧. પહેલા NextAuth માંથી સાઈન આઉટ કરો (redirect: false રાખવું)
    await signOut({ redirect: false });

    // ૨. લોકલ સ્ટોરેજ ક્લિયર કરો
    localStorage.clear();
    sessionStorage.clear();

    // ૩. હાર્ડ રીડાયરેક્ટ કરો જેથી સેશન પુરેપુરી રીતે સાફ થઈ જાય
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg shadow-indigo-100/50 py-2" : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Redirects to "/" */}
          <div
            onClick={handleLogoClick}
            className="cursor-pointer flex-shrink-0 text-2xl font-black text-indigo-600 tracking-tighter hover:text-indigo-800 transition-colors"
          >
            JobConnect<span className="text-slate-900">Pro</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-grow justify-center ml-12 space-x-2">
            {/* Home બદલીને Dashboard કર્યું */}
            <button 
              onClick={handleDashboardClick}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition duration-150 ease-in-out"
            >
              Dashboard
            </button>
            <NavLink href="/aboutus">About Us</NavLink>
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/blog">Blogs</NavLink>
            <NavLink href="/careers">Careers</NavLink>
            <NavLink href="/contactus">Contact Us</NavLink>
            <NavLink href="/philanthropy">Philanthropy</NavLink>
          </div>

          {/* Desktop User Section */}
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
                
                <div 
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button 
                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                  >
                    Get Started
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden py-2 z-[60]"
                      >
                        <Link href="/recruiter/register" className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                          🏢 Join as Recruiter
                        </Link>
                        <Link href="/register?type=candidate" className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-t border-slate-50">
                          👨‍💼 Join as Candidate
                        </Link>
                        <Link href="/serviceprovider/register" className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-t border-slate-50">
                          🛠️ Join as Service Provider
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-50"
        style={{ maxHeight: `${menuHeight}px` }}
      >
        <div ref={menuRef} className="px-4 pt-4 pb-6 space-y-2">
          {/* Mobile Dashboard Button */}
          <button 
            onClick={handleDashboardClick}
            className="block w-full text-left px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 rounded-xl"
          >
            Dashboard
          </button>
          
          <Link href="/aboutus" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-indigo-50 rounded-xl">About Us</Link>
          
          {user ? (
            <div className="pt-4 mt-4 border-t border-slate-100">
               <div className="px-4 py-3 mb-2 bg-slate-50 rounded-xl">
                 <p className="text-[10px] font-black text-indigo-500 uppercase">{user.role?.replace('_', ' ')}</p>
                 <p className="text-sm font-bold text-slate-700">{user.name}</p>
               </div>
               <button
                onClick={handleLogout}
                className="w-full px-4 py-4 text-base font-bold text-white bg-rose-500 rounded-xl shadow-lg"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center py-4 text-base font-bold text-white bg-indigo-600 rounded-xl">Login</Link>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/recruiter/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl">🏢 Register as Recruiter</Link>
                <Link href="/register?type=candidate" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl">👨‍💼 Register as Candidate</Link>
                <Link href="/serviceprovider/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl">🛠️ Register as Provider</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}