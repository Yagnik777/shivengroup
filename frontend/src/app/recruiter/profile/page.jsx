"use client";
import { useState, useEffect } from "react";
import { 
  Building2, Globe, MapPin, Edit3, Save, ExternalLink, 
  Users, Calendar, Briefcase, Camera, Loader2 
} from "lucide-react";
import RecruiterSidebar from '@/components/RecruiterSidebar';
import Link from 'next/link';

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  // Fetch company data from API
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await fetch("/api/recruiter/company/setup"); // GET request to fetch data
        const result = await res.json();
        if (result.data) {
          setCompany(result.data);
        }
      } catch (err) {
        console.error("Error fetching company:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f3f2ef]">
        <RecruiterSidebar activePage="profile" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      </div>
    );
  }

  // If no company found, show setup button
  if (!company) {
    return (
      <div className="flex min-h-screen bg-[#f3f2ef]">
        <RecruiterSidebar activePage="profile" />
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <Building2 size={64} className="text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">No Profile Found</h2>
          <p className="text-slate-500 mb-6">You haven't set up your company profile yet.</p>
          <Link href="/recruiter/setup-profile" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Setup Company Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f2ef]">
      {/* Sidebar */}
      <RecruiterSidebar activePage="profile" />

      {/* Main Content Area */}
      <main className="flex-1 pb-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          
          {/* Header/Cover Section */}
          <div className="relative bg-white rounded-b-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            </div>

            {/* Logo & Basic Info */}
            <div className="px-8 pb-6">
              <div className="relative flex justify-between items-end -mt-12">
                <div className="p-1 bg-white rounded-2xl border shadow-sm">
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <img src={company.logo} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={48} className="text-indigo-600" />
                    )}
                  </div>
                </div>
                
                <Link
                  href="/recruiter/setup-profile"
                  className="flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <Edit3 size={18}/> Edit Profile
                </Link>
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-black text-slate-900">{company.name}</h1>
                <p className="text-slate-600 text-lg mt-1 font-medium">{company.tagline}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-indigo-500"/> {company.industry}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500"/> {company.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-indigo-500"/> {company.companySize}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Left Column: About & Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-4 border-b pb-2">About</h2>
                <p className="text-slate-600 text-md leading-relaxed whitespace-pre-line font-medium">
                  {company.description}
                </p>
              </div>

              {/* Specialties Section */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-4 border-b pb-2">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(company.specialties) ? (
                    company.specialties.map((item, idx) => (
                      <span key={idx} className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black tracking-wide">
                        {item}
                      </span>
                    ))
                  ) : (
                    company.specialties?.split(',').map((item, idx) => (
                      <span key={idx} className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black tracking-wide">
                        {item.trim()}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Details Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tighter">Company Details</h2>
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Website</label>
                    <a href={company.website} target="_blank" className="text-sm text-indigo-600 font-black flex items-center gap-1 hover:underline">
                      {company.website?.replace("https://", "").replace("http://", "")} <ExternalLink size={14}/>
                    </a>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Founded Year</label>
                    <p className="text-sm text-slate-800 font-bold flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400"/> {company.founded}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Company Size</label>
                    <p className="text-sm text-slate-800 font-bold flex items-center gap-2">
                      <Users size={16} className="text-slate-400"/> {company.companySize}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Headquarters</label>
                    <p className="text-sm text-slate-800 font-bold flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400"/> {company.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}