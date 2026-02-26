"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Serviceprovidersidbar';
import { 
  TrendingUp, Users, Briefcase, Star, 
  Bell, Calendar, Clock, OctagonAlert, Loader2, CheckCircle2, MessageSquare
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // રિવ્યુ અને એક્ટિવ સર્વિસ માટે સ્ટેટ્સ
  const [reviews, setReviews] = useState([]);
  const [activeGigsCount, setActiveGigsCount] = useState(0);
  const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (session?.user?.email) {
        try {
          // ૧. પ્રોવાઈડર પ્રોફાઈલ ડેટા ફેચ કરવો
          const res = await fetch(`/api/admin/serviceproviders?email=${session.user.email}`);
          const data = await res.json();
          
          if (res.ok && data.providers) {
            const currentProfile = data.providers.find(p => p.email === session.user.email);
            setDbUser(currentProfile);
          }

          // ૨. એક્ટિવ ગીગ્સ (સર્વિસિસ) ની સંખ્યા ફેચ કરવી
          const serviceRes = await fetch(`/api/serviceprovider/serviceform`);
          const serviceData = await serviceRes.json();
          if (serviceRes.ok && serviceData.services) {
            setActiveGigsCount(serviceData.services.length);
          }

          // ૩. રિવ્યુ અને રેટિંગ્સ ડેટા ફેચ કરવો
          const reviewRes = await fetch(`/api/reviews?targetId=${session.user.email}`);
          const reviewData = await reviewRes.json();
          
          if (reviewData.success) {
            setReviews(reviewData.reviews || []);
            // એવરેજ રેટિંગ ગણતરી
            if (reviewData.reviews?.length > 0) {
              const avg = reviewData.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewData.reviews.length;
              setStats({
                avgRating: avg.toFixed(1),
                totalReviews: reviewData.reviews.length
              });
            }
          }
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (authStatus === "authenticated") {
      fetchDashboardData();
    } else if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [session, authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFEFF]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-bold animate-pulse text-sm">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (dbUser?.status === 'rejected') {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-red-100">
          <OctagonAlert size={40} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-3">Access Denied</h1>
          <p className="text-slate-500 mb-8">Your service provider application was not approved.</p>
          <button onClick={() => router.push('/')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Back to Home</button>
        </div>
      </div>
    );
  }

  if (dbUser?.status !== 'approved') {
    return (
      <div className="h-screen flex items-center justify-center bg-amber-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-amber-100">
          <Clock size={40} className="text-amber-500 animate-pulse mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-3">Under Review</h1>
          <p className="text-slate-500 mb-8">Our team is verifying your profile. Please check back later.</p>
          <button onClick={() => router.push('/')} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Refresh Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] flex flex-col lg:flex-row">
      <Sidebar activePage="dashboard" />

      <main className="flex-1 w-full overflow-x-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="lg:block hidden">
            <h2 className="text-xl font-black text-slate-800">Partner Overview</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
            </p>
          </div>

          <div className="lg:hidden ml-12 text-slate-800 font-black">Dashboard</div>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 leading-none">{dbUser?.fullName}</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase mt-1">{dbUser?.providerName}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser?.fullName}`} alt="profile" />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 lg:pt-8 pt-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard title="Active Gigs" value={activeGigsCount.toString().padStart(2, '0')} trend="Published" icon={<Briefcase size={20} />} />
            <StatCard title="Total Earnings" value="₹0" trend="Wallet" icon={<TrendingUp size={20} />} />
            <StatCard title="Total Reviews" value={stats.totalReviews} trend="Feedback" icon={<Users size={20} />} />
            <StatCard title="Avg. Rating" value={stats.avgRating} trend={`${stats.totalReviews} Reviews`} icon={<Star size={20} className="fill-amber-400 text-amber-400" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800">Recent Customer Reviews</h3>
                <span className="bg-indigo-50 text-indigo-600 text-[10px] px-3 py-1 rounded-full font-black uppercase">Live Feedback</span>
              </div>
              
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.slice(0, 4).map((rev) => (
                    <div key={rev._id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 transition-hover hover:border-indigo-100">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 font-bold text-indigo-600 text-xs uppercase">
                        {rev.reviewerName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-black text-slate-800">{rev.reviewerName}</h4>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={12} className="fill-current" />
                            <span className="text-xs font-bold">{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium italic">"{rev.comment}"</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-sm text-slate-500 font-bold italic">No reviews received yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden h-fit">
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Verification Status</p>
                 <p className="text-2xl font-black flex items-center gap-2">Verified Expert <CheckCircle2 size={20} className="text-indigo-400"/></p>
                 
                 <div className="mt-8 space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>Profile Strength</span>
                      <span className="text-indigo-400">100%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-full shadow-[0_0_15px_#6366f1]"></div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Your profile is live and visible to potential clients.
                    </p>
                 </div>
               </div>
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, trend, icon }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-[1.8rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-slate-100 transition-colors">
          {icon}
        </div>
        <div className="text-[9px] md:text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl md:text-2xl font-black text-slate-800 mt-1">{value}</p>
    </div>
  );
} 