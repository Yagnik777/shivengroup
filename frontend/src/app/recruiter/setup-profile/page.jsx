"use client";
import { useState } from "react";
import { Building2, Globe, MapPin, Users, Calendar, Briefcase, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function SetupCompanyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    industry: "",
    website: "",
    location: "",
    companySize: "11-50 employees",
    founded: "",
    description: "",
    specialties: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/recruiter/company/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Success: Company Profile Created!");
        router.push("/recruiter/profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error: Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <RecruiterSidebar activePage="setup-profile" />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800">Company Settings</h2>
            <p className="text-slate-500 font-medium">Create a professional profile to attract top talent.</p>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
            {/* Form Banner */}
            <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold">Business Profile Setup</h3>
                <p className="text-indigo-100 opacity-90 mt-1">Fill in the details to build your company's presence.</p>
              </div>
              {/* Background Decoration */}
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Company Name */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Company Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="e.g. Shivengroup Infotech" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700" 
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Tagline</label>
                  <input 
                    name="tagline" 
                    value={formData.tagline} 
                    onChange={handleChange} 
                    placeholder="e.g. Innovating the future of Technology" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" 
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="industry" 
                      value={formData.industry} 
                      onChange={handleChange} 
                      placeholder="e.g. Software Development" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700" 
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder="https://yourcompany.com" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700" 
                    />
                  </div>
                </div>

                {/* Headquarters / Location */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Headquarters</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      placeholder="e.g. Ahmedabad, India" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700" 
                    />
                  </div>
                </div>

                {/* Company Size */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Company Size</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="companySize" 
                      value={formData.companySize} 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-slate-700 bg-transparent"
                    >
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>500+ employees</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">About Company</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={5} 
                    placeholder="Describe your company's mission, values, and what it's like to work here..." 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 leading-relaxed" 
                  />
                </div>

                {/* Specialties */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 block ml-1">Specialties (Keywords)</label>
                  <input 
                    name="specialties" 
                    value={formData.specialties} 
                    onChange={handleChange} 
                    placeholder="Enter skills or domains separated by commas (e.g. AI, Cloud, E-commerce)" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700" 
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 pt-6">
                  <button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {loading ? "Saving Information..." : (
                      <>
                        Save & Publish Profile
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}