"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Calendar, Star, Wallet, Settings, User, Tooltip } from 'lucide-react';

export default function Sidebar({ activePage }) {
  const [isOpen, setIsOpen] = useState(false); // મોબાઈલ મેનુ માટે સ્ટેટ

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- મોબાઈલ માટે ઉપરનો બાર (જ્યારે સાઈડબાર બંધ હોય) --- */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic text-sm">S</div>
          <span className="text-lg font-black tracking-tight text-slate-800">Shiven <span className="text-indigo-600">Partner</span></span>
        </div>
        <button onClick={toggleSidebar} className="p-2 bg-slate-50 rounded-xl text-slate-600 active:scale-95 transition-all">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- ઓવરલે (જ્યારે મેનુ ખુલે ત્યારે પાછળનો ભાગ ઝાંખો કરવા) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* --- મેઈન સાઈડબાર --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-slate-100 p-6 flex flex-col transition-transform duration-300 ease-in-out
        lg:sticky lg:translate-x-0 h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* ક્લોઝ બટન (માત્ર મોબાઈલ માટે) */}
        <button onClick={toggleSidebar} className="lg:hidden absolute right-4 top-6 text-slate-400">
          <X size={20} />
        </button>

        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">S</div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            Shiven <span className="text-indigo-600">Partner</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          <Link href="/serviceprovider/dashboard" onClick={() => setIsOpen(false)}>
            <NavItem icon="🏠" label="Dashboard" active={activePage === "dashboard"} />
          </Link>
          
          <Link href="/serviceprovider/services" onClick={() => setIsOpen(false)}>
            <NavItem icon="🛠️" label="My Services" active={activePage === "services"} />
          </Link>

          <Link href="/serviceprovider/bookings" onClick={() => setIsOpen(false)}>
            <NavItem icon="📅" label="Bookings" active={activePage === "bookings"} />
          </Link>

          <Link href="/serviceprovider/earnings" onClick={() => setIsOpen(false)}>
            <NavItem icon="💰" label="Earnings" active={activePage === "earnings"} />
          </Link>

          <Link href="/serviceprovider/profile" onClick={() => setIsOpen(false)}>
            <NavItem icon="👤" label="My Profile" active={activePage === "profile"} />
          </Link>

          <Link href="/serviceprovider/settings" onClick={() => setIsOpen(false)}>
            <NavItem icon="⚙️" label="Settings" active={activePage === "settings"} />
          </Link>
        </nav>

        {/* Support Card */}
        <div className="mt-auto bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Support</p>
          <button className="text-sm font-bold text-indigo-600 hover:underline">Help Center</button>
        </div>
      </aside>
    </>
  );
}

// Sidebar Item Helper
function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
    }`}>
      <span className="text-lg">{icon}</span>
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </div>
  );
}