"use client";
import React from 'react';
import Sidebar from '@/components/Serviceprovidersidbar';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Star, 
  Bell,
  Search,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FDFEFF] flex flex-col lg:flex-row">
      {/* ૧. સાઇડબાર (આપણે અગાઉ બનાવેલો રિસ્પોન્સિવ સાઇડબાર) */}
      <Sidebar activePage="dashboard" />

      <main className="flex-1 w-full overflow-x-hidden">
        
        {/* ૨. હેડર - મોબાઈલમાં અને ડેસ્કટોપમાં પ્રોપર દેખાશે */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="lg:block hidden"> {/* ડેસ્કટોપ માટે */}
            <h2 className="text-xl font-black text-slate-800">Partner Overview</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">February 2026</p>
          </div>

          {/* મોબાઈલ માટે ટાઈટલ (જ્યારે સાઈડબારના બટન સાથે દેખાય) */}
          <div className="lg:hidden ml-12">
             <h2 className="text-lg font-black text-slate-800 leading-tight">Overview</h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* નોટિફિકેશન આઈકોન */}
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
            </button>
            
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 leading-none">Aman Sharma</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase mt-1">Interview Coach</p>
            </div>
            <div className="w-10 h-10 rounded-xl md:rounded-2xl bg-indigo-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aman" alt="profile" />
            </div>
          </div>
        </header>

        {/* ૩. મેઈન કન્ટેન્ટ એરિયા */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 lg:pt-8 pt-6">
          
          {/* Stats Grid - મોબાઈલમાં ૧, ટેબલેટમાં ૨, ડેસ્કટોપમાં ૪ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard title="Active Gigs" value="08" trend="+2 New" icon={<Briefcase size={20} />} />
            <StatCard title="Total Earnings" value="₹24,500" trend="+12%" icon={<TrendingUp size={20} />} />
            <StatCard title="Total Clients" value="142" trend="+18" icon={<Users size={20} />} />
            <StatCard title="Avg. Rating" value="4.9" trend="98 Reviews" icon={<Star size={20} className="fill-indigo-600 text-indigo-600" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Incoming Bookings Card */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Incoming Bookings</h3>
                <button className="text-indigo-600 text-xs font-bold hover:underline">See All</button>
              </div>
              <div className="space-y-4">
                 {/* મોબાઈલ માટે પ્લેસહોલ્ડર */}
                 <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <Calendar size={32} />
                    </div>
                    <p className="text-sm text-slate-500 font-bold italic">No urgent bookings for today.</p>
                 </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl shadow-indigo-100/20 relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Performance</p>
                 <p className="text-2xl font-black">Expert Plus</p>
                 
                 <div className="mt-8 md:mt-10 space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span>Monthly Goal</span>
                      <span className="text-indigo-400">85%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[85%] shadow-[0_0_15px_#6366f1]"></div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      You are in the top 5% of partners this month. Keep it up!
                    </p>
                    <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      View Insights
                    </button>
                 </div>
               </div>
               {/* Decorative background circle */}
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// StatCard Component - રિસ્પોન્સિવ ટ્વીક્સ સાથે
function StatCard({ title, value, trend, icon }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-[1.8rem] md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 group-hover:bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-100 transition-colors">
          {icon}
        </div>
        <div className="text-[9px] md:text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl md:text-2xl font-black text-slate-800 mt-1 md:mt-2">{value}</p>
    </div>
  );
}