"use client";
import { useState, useEffect } from "react";
import { 
  Building2, Globe, MapPin, Edit3, Save, ExternalLink, 
  Users, Calendar, Briefcase, Camera, Loader2, X, Mail, Phone, Home 
} from "lucide-react";
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "", 
    tagline: "", 
    industry: "", 
    website: "",
    email: "", 
    phone: "", 
    address: "", 
    companySize: "11-50 employees",
    founded: "", 
    description: "", 
    specialties: "",
  });

  // 1. ડેટા ફેચ કરવો
  const fetchCompanyData = async () => {
    try {
      const res = await fetch("/api/recruiter/company/setup");
      const result = await res.json();
      if (result.data) {
        setCompany(result.data);
        // Fallback to empty string for every field to prevent controlled/uncontrolled error
        setFormData({
          name: result.data.name || "",
          tagline: result.data.tagline || "",
          industry: result.data.industry || "",
          website: result.data.website || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          address: result.data.address || "",
          companySize: result.data.companySize || "11-50 employees",
          founded: result.data.founded || "",
          description: result.data.description || "",
          specialties: Array.isArray(result.data.specialties) 
            ? result.data.specialties.join(", ") 
            : (result.data.specialties || "")
        });
      }
    } catch (err) {
      console.error("Error fetching company data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanyData(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. ડેટા સેવ કરવો
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        specialties: typeof formData.specialties === 'string' 
          ? formData.specialties.split(',').map(s => s.trim()).filter(s => s !== "") 
          : formData.specialties
      };

      const res = await fetch("/api/recruiter/company/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        await fetchCompanyData(); 
        setIsEditing(false);
        alert("Profile Saved Successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Failed to save profile"}`);
      }
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !company) {
    return (
      <div className="flex min-h-screen bg-[#f3f2ef]">
        <RecruiterSidebar activePage="profile" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f2ef]">
      <RecruiterSidebar activePage="profile" />

      <main className="flex-1 pb-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 mt-6">
          
          {(!company || isEditing) ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transition-all">
              <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black">{company ? "Edit Profile" : "Setup Company Profile"}</h2>
                  <p className="opacity-80 text-sm">Fill in the details to attract the best candidates.</p>
                </div>
                {company && (
                   <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                     <X size={24} />
                   </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Company Name *</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Official Email</label>
                  <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="contact@company.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="+91 00000 00000" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Address Field */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Company Full Address</label>
                  <input name="address" value={formData.address || ""} onChange={handleChange} placeholder="Street name, City, State, Country" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Tagline */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Tagline</label>
                  <input name="tagline" value={formData.tagline || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Industry */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Industry</label>
                  <input name="industry" value={formData.industry || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Website */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Website URL</label>
                  <input name="website" value={formData.website || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Founded */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Founded Year</label>
                  <input name="founded" value={formData.founded || ""} onChange={handleChange} placeholder="e.g. 2010" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Company Size */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Company Size</label>
                  <select name="companySize" value={formData.companySize || "11-50 employees"} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>

                {/* About */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">About Company</label>
                  <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                {/* Specialties */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-2 block">Specialties (comma separated)</label>
                  <input name="specialties" value={formData.specialties || ""} onChange={handleChange} placeholder="React, Node.js, AI, Recruitment" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Company Profile</>}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* DISPLAY MODE */
            <div className="animate-in fade-in duration-500">
              <div className="relative bg-white rounded-b-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <div className="px-8 pb-8">
                  <div className="flex justify-between items-end -mt-12">
                    <div className="p-1 bg-white rounded-3xl border shadow-sm">
                      <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                        {company.logo ? <img src={company.logo} alt="logo" className="w-full h-full object-cover" /> : <Building2 size={48} className="text-indigo-600" />}
                      </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      <Edit3 size={18}/> Edit Profile
                    </button>
                  </div>
                  <div className="mt-6">
                    <h1 className="text-4xl font-black text-slate-900">{company.name}</h1>
                    <p className="text-slate-500 text-lg mt-1 font-bold tracking-tight">{company.tagline}</p>
                    
                    {/* Display Email, Phone, and Address */}
                    <div className="flex flex-wrap gap-4 mt-6">
                      <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border text-sm font-bold text-slate-600">
                        <Mail size={16} className="text-indigo-500"/> {company.email || "No Official Email"}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border text-sm font-bold text-slate-600">
                        <Phone size={16} className="text-indigo-500"/> {company.phone || "No Phone Number"}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border text-sm font-bold text-slate-600">
                        <Home size={16} className="text-indigo-500"/> {company.address || "No Address Added"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                       <span className="w-2 h-8 bg-indigo-600 rounded-full" /> About Company
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">{company.description || "No description provided."}</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Specialties</h2>
                    <div className="flex flex-wrap gap-3">
                      {(Array.isArray(company.specialties) ? company.specialties : company.specialties?.split(','))?.length > 0 ? (
                        (Array.isArray(company.specialties) ? company.specialties : company.specialties?.split(','))?.map((item, idx) => (
                          <span key={idx} className="px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black uppercase tracking-wider">
                            {item.trim()}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 font-medium">No specialties added.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6">Online Presence</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Official Website</label>
                        {company.website ? (
                          <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black flex items-center gap-2 hover:underline">
                            {company.website.replace(/^https?:\/\//, "")} <ExternalLink size={16}/>
                          </a>
                        ) : (
                          <p className="text-slate-400 font-bold italic">Not provided</p>
                        )}
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Company Size</p>
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <Users size={18} className="text-indigo-500"/> {company.companySize || "Not specified"}
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Founded</p>
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <Calendar size={18} className="text-indigo-500"/> {company.founded || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}