"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";


const NavLink = ({ children, href = "#", isPrimary = false, ...props }) => (
  <Link
    href={href}
    {...props} // ✅ VERY IMPORTANT
    className={`px-3 py-2 text-sm font-medium transition duration-150 ease-in-out ${
      isPrimary
        ? "text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
        : "text-gray-600 hover:text-blue-600"
    }`}
  >
    {children}
  </Link>
);

export default function NavBar({ links = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 text-3xl font-extrabold text-blue-700 tracking-tight">
            Resumind
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-grow justify-start ml-10 space-x-8">
            {links.map((link, i) => (
              <NavLink key={i} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">Hello, {user.name}</span>

                {/* Profile Link */}
                <NavLink href="/profile">
                  Profile
                </NavLink>

                <NavLink
                  isPrimary={true}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut({ redirect: true, callbackUrl: "/login" });
                  }}
                >
                  Log Out
                </NavLink>
              </>
            ) : (
              <>
                <NavLink isPrimary={true} href="/login">
                  Login
                </NavLink>
                <NavLink isPrimary={true} href="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
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
      {isMenuOpen && (
        <div className="md:hidden pb-4 pt-2 space-y-1 sm:px-3 border-t">
          {links.map((link, i) => (
            <NavLink key={i} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <div className="px-3 pt-4 border-t mt-4">
            {user ? (
              <>
                <NavLink href="/profile">
                  Profile
                </NavLink>
                <NavLink
                  isPrimary={true}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut({ callbackUrl: "/login" });
                  }}
                >
                  Log Out
                </NavLink>
              </>
            ) : (
              <>
                <NavLink isPrimary={true} href="/login">
                  Login
                </NavLink>
                <NavLink isPrimary={true} href="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
