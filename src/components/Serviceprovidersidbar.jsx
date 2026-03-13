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

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1 overflow-y-auto no-scrollbar pr-2">
          <Link href="/serviceprovider/dashboard" onClick={() => setIsOpen(false)}>
            <NavItem icon="🏠" label="Dashboard" active={activePage === "dashboard"} />
          </Link>
          
          <Link href="/serviceprovider/profile" onClick={() => setIsOpen(false)}>
            <NavItem icon="👤" label="Profile" active={activePage === "profile"} />
          </Link>

          <Link href="/serviceprovider/serviceform" onClick={() => setIsOpen(false)}>
            <NavItem icon="🛠️" label="Services" active={activePage === "serviceform"} />
          </Link>

          <Link href="/serviceprovider/responses" onClick={() => setIsOpen(false)}>
            <NavItem icon="📩" label="Responses" active={activePage === "responses"} />
          </Link>

          <Link href="/serviceprovider/stats" onClick={() => setIsOpen(false)}>
            <NavItem icon="⏳" label="My Status" active={activePage === "stats"} />
          </Link>

          {/* <Link href="/serviceprovider/events" onClick={() => setIsOpen(false)}>
            <NavItem icon="📅" label="Events & Activities" active={activePage === "events"} />
          </Link>

          <Link href="/serviceprovider/ai-features" onClick={() => setIsOpen(false)}>
            <NavItem icon="✨" label="AI Features" active={activePage === "ai"} />
          </Link>

          <Link href="/serviceprovider/mailer" onClick={() => setIsOpen(false)}>
            <NavItem icon="📧" label="Auto-Mailer System" active={activePage === "mailer"} />
          </Link>

          <Link href="/serviceprovider/customers" onClick={() => setIsOpen(false)}>
            <NavItem icon="👥" label="Customer List" active={activePage === "customers"} />
          </Link>

          <Link href="/serviceprovider/mailing-list" onClick={() => setIsOpen(false)}>
            <NavItem icon="📑" label="Mailing List" active={activePage === "mailinglist"} />
          </Link>

          <Link href="/serviceprovider/contacts" onClick={() => setIsOpen(false)}>
            <NavItem icon="📞" label="Contact Management" active={activePage === "contacts"} />
          </Link>

          <Link href="/serviceprovider/notifications" onClick={() => setIsOpen(false)}>
            <NavItem icon="🔔" label="Notifications" active={activePage === "notifications"} />
          </Link>

          <Link href="/serviceprovider/files" onClick={() => setIsOpen(false)}>
            <NavItem icon="📁" label="Files & Folder" active={activePage === "files"} />
          </Link>

          <Link href="/serviceprovider/wallet" onClick={() => setIsOpen(false)}>
            <NavItem icon="💳" label="Digital Wallet" active={activePage === "wallet"} />
          </Link>

          <Link href="/serviceprovider/advertising" onClick={() => setIsOpen(false)}>
            <NavItem icon="📢" label="Advertising" active={activePage === "advertising"} />
          </Link>

          <Link href="/serviceprovider/analytics" onClick={() => setIsOpen(false)}>
            <NavItem icon="📊" label="Analytics & Reports" active={activePage === "analytics"} />
          </Link>

          <Link href="/serviceprovider/service-request" onClick={() => setIsOpen(false)}>
            <NavItem icon="🔧" label="Service Request" active={activePage === "servicerequest"} />
          </Link>

          <Link href="/serviceprovider/subscriptions" onClick={() => setIsOpen(false)}>
            <NavItem icon="💎" label="My Subscriptions" active={activePage === "subscriptions"} />
          </Link>

          <Link href="/serviceprovider/retail" onClick={() => setIsOpen(false)}>
            <NavItem icon="🛍️" label="Retail Purchase" active={activePage === "retail"} />
          </Link>

          <Link href="/serviceprovider/settings" onClick={() => setIsOpen(false)}>
            <NavItem icon="⚙️" label="Settings" active={activePage === "settings"} />
          </Link> */}
        </nav>

        {/* Support Card */}
        {/* <div className="mt-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Support</p>
          <button className="text-sm font-bold text-indigo-600 hover:underline">Help Center</button>
        </div> */}
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