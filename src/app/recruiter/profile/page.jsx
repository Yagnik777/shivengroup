"use client";
import { useState, useEffect } from "react";
import { 
  Building2, Globe, MapPin, Edit3, Save, ExternalLink, 
  Users, Calendar, Briefcase, Camera, Loader2, X, Mail, Phone, LayoutGrid 
} from "lucide-react";
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(null);
  
  // ડેટાબેઝમાંથી આવતા ઓપ્શન્સ માટેના સ્ટેટ
  const [industryOptions, setIndustryOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    tagline: "", 
    industry: "", 
    department: "", 
    website: "",
    email: "", 
    mobile: "", 
    location: "", 
    companySize: "", // આ ફિલ્ડ એડમિનના 'size' ટાઇપ સાથે લિંક થશે
    founded: "", 
    description: "", 
    specialties: "",
    logo: "" 
  });

  // 1. ડ્રોપડાઉન ડેટા લોડ કરવો (Admin Manager માંથી)
  const fetchDropdowns = async () => {
    try {
      const res = await fetch("/api/dropdowns"); // તમારી API નું નામ સાચું કરી દેજો જો અલગ હોય તો
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Admin પેનલના ID મુજબ ફિલ્ટર: industry, department, size
        setIndustryOptions(data.filter(item => item.type === "industry").map(i => i.value));
        setDepartmentOptions(data.filter(item => item.type === "department").map(i => i.value));
        setSizeOptions(data.filter(item => item.type === "size").map(i => i.value));
      }
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const res = await fetch("/api/recruiter/register?action=get-profile"); 
      const result = await res.json();
      
      if (result.data) {
        setCompany(result.data);
        setFormData({
          companyName: result.data.companyName || "",
          tagline: result.data.tagline || "",
          industry: result.data.industry || "",
          department: result.data.department || "",
          website: result.data.website || "",
          email: result.data.email || "",
          mobile: result.data.mobile || "",
          location: result.data.location || "",
          companySize: result.data.companySize || "",
          founded: result.data.founded || "",
          description: result.data.description || "",
          logo: result.data.logo || "",
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

  useEffect(() => { 
    fetchDropdowns();
    fetchCompanyData(); 
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        action: "update-profile",
        ...formData,
        specialties: typeof formData.specialties === 'string' 
          ? formData.specialties.split(',').map(s => s.trim()).filter(s => s !== "") 
          : formData.specialties
      };

      const res = await fetch("/api/recruiter/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        await fetchCompanyData(); 
        setIsEditing(false);
        alert("Profile Updated!");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Failed to save"}`);
      }
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !company) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f3f2ef]">
      <RecruiterSidebar activePage="profile" />

      <main className="flex-1 pb-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 mt-6">
          
          {(!company || isEditing) ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black">{company ? "Edit Profile" : "Setup Company Profile"}</h2>
                  <p className="opacity-80 text-sm">Fill in your company details</p>
                </div>
                {company && (
                   <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                     <X size={24} />
                   </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Section */}
                <div className="md:col-span-2 flex flex-col items-center mb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                      {formData.logo ? <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" /> : <Building2 size={32} className="text-slate-300" />}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-indigo-700">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                    </label>
                  </div>
                </div>

                {/* Company Basic Info */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Company Name *</label>
                  <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Tagline</label>
                  <input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. Innovating the future of tech" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                {/* Dropdowns - Fixed to match Admin types */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Industry</option>
                    {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                    <option value="">Select Department</option>
                    {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Company Size</label>
                  <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                    <option value="">Select size</option>
                    {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Founded Year</label>
                  <input name="founded" value={formData.founded} onChange={handleChange} placeholder="e.g. 2010" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                {/* Contact Info */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Mobile Number</label>
                  <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Website URL</label>
                  <input name="website" value={formData.website} onChange={handleChange} placeholder="www.company.com" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">About Company</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* View Mode */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative bg-white rounded-b-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-400" />
                <div className="px-8 pb-8">
                  <div className="flex justify-between items-end -mt-10">
                    <div className="p-1 bg-white rounded-2xl border shadow-sm">
                      <div className="w-28 h-28 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                        {company.logo ? <img src={company.logo} alt="logo" className="w-full h-full object-cover" /> : <Building2 size={40} className="text-indigo-600" />}
                      </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2 rounded-full font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                      <Edit3 size={18}/> Edit Profile
                    </button>
                  </div>
                  <div className="mt-6">
                    <h1 className="text-3xl font-black text-slate-900">{company.companyName}</h1>
                    <p className="text-indigo-600 font-bold text-lg">{company.tagline || "Your company tagline here"}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-6">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border text-sm font-bold text-slate-600">
                        <Mail size={16} className="text-indigo-500"/> {company.email}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border text-sm font-bold text-slate-600">
                        <MapPin size={16} className="text-indigo-500"/> {company.location || "Location not set"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full" /> About Us
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-bold">{company.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200">
                    <h2 className="text-lg font-black text-slate-900 mb-4">Company Details</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Website</p>
                        {company.website ? (
                          <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                             {company.website} <ExternalLink size={14}/>
                          </a>
                        ) : <p className="text-slate-400 font-bold">Not provided</p>}
                      </div>
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Industry</p>
                          <p className="font-bold text-slate-700 flex items-center gap-2"><Briefcase size={14}/> {company.industry || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Size</p>
                          <p className="font-bold text-slate-700 flex items-center gap-2"><Users size={14}/> {company.companySize || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Founded</p>
                          <p className="font-bold text-slate-700 flex items-center gap-2"><Calendar size={14}/> {company.founded || "N/A"}</p>
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