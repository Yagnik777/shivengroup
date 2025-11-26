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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow ${
        isScrolled ? "shadow-md" : "shadow-sm"
      } bg-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a
            onClick={handleLogoClick}
            className="cursor-pointer flex-shrink-0 text-3xl font-extrabold text-blue-700 tracking-tight hover:text-blue-800 transition"
          >
            Vaccancies
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-grow justify-start ml-10 space-x-8">
            {links.map((link, i) => (
              <NavLink key={i} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hello, {user.name?.split(" ")[0] || "User"}
                </span>

                <NavLink href="/profile">My Profile</NavLink>
                <Link href="/status" className="hover:text-blue-600">
                  📋 My Status
                </Link>

                {/* Notification Bell */}
                <Link href="/notifications" className="relative">
                  <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() =>
                    signOut({ redirect: true, callbackUrl: "/login" })
                  }
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink isPrimary href="/login">
                  Login
                </NavLink>
                <NavLink isPrimary href="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t bg-white"
        style={{ maxHeight: `${menuHeight}px` }}
      >
        <div ref={menuRef} className="px-3 pt-2 pb-4 space-y-1">
          {links.map((link, i) => (
            <NavLink key={i} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink href="/jobs" onClick={() => setIsMenuOpen(false)}>
                Jobs
              </NavLink>

              <NavLink href="/profile" onClick={() => setIsMenuOpen(false)}>
                My Profile
              </NavLink>

              {/* Mobile Notification */}
              <Link
                href="/notifications"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 relative"
              >
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: "/login" })
                }
                className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                isPrimary
                href="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                isPrimary
                href="/register"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
  