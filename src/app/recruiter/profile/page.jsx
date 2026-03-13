"use client";
import { useState, useEffect } from "react";
import { 
  Building2, Globe, MapPin, Edit3, Save, ExternalLink, 
  Users, Calendar, Briefcase, Camera, Loader2, X, Mail, Phone, LayoutGrid,
  Stethoscope, UserCheck, ShieldCheck, Flag
} from "lucide-react";
import RecruiterSidebar from '@/components/RecruiterSidebar';

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState(null);
  
  const [industryOptions, setIndustryOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([]); 
  const [designationOptions, setDesignationOptions] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    tagline: "", 
    industry: "", 
    department: "", 
    profession: "",
    designation: "", 
    website: "",
    email: "", 
    mobile: "", 
    location: "", 
    address: "", 
    city: "",
    state: "",
    pincode: "",
    country: "",
    companySize: "", 
    founded: "", 
    description: "", 
    specialties: "",
    logo: "",
    contactPersonName: "",
    contactPersonNumber: "",
    contactPersonEmail: "",
    ownerName: "",
    ownerNumber: "",
    ownerEmail: ""
  });

  const fetchDropdowns = async () => {
    try {
      const res = await fetch("/api/dropdowns");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setIndustryOptions(data.filter(item => item.type === "industry").map(i => i.value));
        setSizeOptions(data.filter(item => item.type === "size").map(i => i.value));
        setProfessionOptions(data.filter(item => item.type === "profession_recruiter").map(i => i.value)); 
      }
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  const fetchCompanyData = async () => {
    try {
      // 1. LocalStorage mathi email melvo
      const storedEmail = localStorage.getItem("recruiterEmail"); 
  
      if (!storedEmail) {
        console.error("No email found in localStorage");
        // Jo email na male to login par redirect kari shakay
        return;
      }
  
      // 2. Variable ne use karo fetch ma
      const res = await fetch(`/api/recruiter/register?action=get-profile&email=${storedEmail}`); 
      const result = await res.json();
      
      if (result.data) {
        setCompany(result.data);
        setFormData({
          companyName: result.data.companyName || "",
          tagline: result.data.tagline || "",
          industry: result.data.industry || "",
          department: result.data.department || "",
          profession: result.data.profession || "",
          designation: result.data.designation || "",
          website: result.data.website || "",
          email: result.data.email || "",
          mobile: result.data.mobile || "",
          location: result.data.location || "",
          address: result.data.address || "", 
          city: result.data.city || "",
          state: result.data.state || "",
          pincode: result.data.pincode || "",
          country: result.data.country || "",
          companySize: result.data.companySize || "",
          founded: result.data.founded || "",
          description: result.data.description || "",
          logo: result.data.logo || "",
          contactPersonName: result.data.contactPersonName || "",
          contactPersonNumber: result.data.contactPersonNumber || "",
          contactPersonEmail: result.data.contactPersonEmail || "",
          ownerName: result.data.ownerName || "",
          ownerNumber: result.data.ownerNumber || "",
          ownerEmail: result.data.ownerEmail || "",
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
        alert("Failed to save");
      }
    } catch (err) {
      alert("Error");
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

                {/* Main Company Contact Info */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Company Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="company@mail.com" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Company Mobile</label>
                  <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Phone number" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                {/* Profession */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Profession</label>
                  <select name="profession" value={formData.profession} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select Profession</option>
                    {professionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* Contact Person Section */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-black text-indigo-600 uppercase mb-4 flex items-center gap-2">
                    <UserCheck size={16} /> Contact Person Details
                  </p>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Contact Person Name</label>
                  <input name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Contact Person Number</label>
                  <input name="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Contact Person Email</label>
                  <input name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                {/* Owner Details Section */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-black text-indigo-600 uppercase mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} /> Company Owner Details
                  </p>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Owner Name</label>
                  <input name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Owner Number</label>
                  <input name="ownerNumber" value={formData.ownerNumber} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Owner Email</label>
                  <input name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                {/* Company Overview */}
                <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Company Overview</p>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                    <option value="">Select Industry</option>
                    {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Website URL</label>
                  <input name="website" value={formData.website} onChange={handleChange} placeholder="www.company.com" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Location (Area/City)</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Full Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 102 Blue Business Hub, Near XYZ Cross Road" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
                </div>

                {/* New Address Fields */}
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">City</label>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City Name" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">State</label>
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State Name" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit Pincode" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block">Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
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
                      {company.mobile && (
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border text-sm font-bold text-slate-600">
                          <Phone size={16} className="text-indigo-500"/> {company.mobile}
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border text-sm font-bold text-slate-600">
                        <MapPin size={16} className="text-indigo-500"/> {company.city ? `${company.city}, ${company.state}` : (company.location || "Location not set")}
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
                    <p className="text-slate-600 leading-relaxed font-bold mb-4">{company.description || "No description provided."}</p>
                    
                    {company.address && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Office Address</p>
                         <p className="text-slate-700 font-bold text-sm">
                            {company.address}<br/>
                            {company.city && `${company.city}, `}{company.state && `${company.state} - `}{company.pincode}<br/>
                            {company.country}
                         </p>
                      </div>
                    )}
                  </div>

                  {/* Contact & Owner Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200">
                      <h3 className="text-sm font-black text-indigo-600 flex items-center gap-2 mb-4 uppercase">
                        <UserCheck size={18}/> Contact Person
                      </h3>
                      <div className="space-y-3">
                        <p className="text-md font-black text-slate-800">{company.contactPersonName || "Not set"}</p>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Phone size={14} className="text-indigo-500"/> {company.contactPersonNumber || "N/A"}</p>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Mail size={14} className="text-indigo-500"/> {company.contactPersonEmail || "N/A"}</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200">
                      <h3 className="text-sm font-black text-indigo-600 flex items-center gap-2 mb-4 uppercase">
                        <ShieldCheck size={18}/> Company Owner
                      </h3>
                      <div className="space-y-3">
                        <p className="text-md font-black text-slate-800">{company.ownerName || "Not set"}</p>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Phone size={14} className="text-indigo-500"/> {company.ownerNumber || "N/A"}</p>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Mail size={14} className="text-indigo-500"/> {company.ownerEmail || "N/A"}</p>
                      </div>
                    </div>
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
                          <p className="text-[10px] font-black text-slate-400 uppercase">Profession</p>
                          <p className="font-bold text-slate-700 flex items-center gap-2"><Stethoscope size={14}/> {company.profession || "N/A"}</p>
                        </div>
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
                        {company.country && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Country</p>
                            <p className="font-bold text-slate-700 flex items-center gap-2"><Flag size={14}/> {company.country}</p>
                          </div>
                        )}
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