"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
import Sidebar from '@/components/Serviceprovidersidbar';
import { BadgeCheck, MapPin, Mail, Phone, Edit3, Save, Loader2, Briefcase, Star, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession(); 
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    serviceCategory: "",
    experience: "",
    location: "",
    email: "",
    mobile: "",
    whatsappNumber: "", 
    providerName: "",
    status: "pending"
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.email) return; 

      try {
        const response = await fetch(`/api/admin/serviceproviders?email=${session.user.email}`);
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        
        if (data.providers) {
          const currentProfile = data.providers.find(p => p.email === session.user.email);
          if (currentProfile) {
            // અહીં ખાતરી કરી કે જો ડેટાબેઝમાં whatsappNumber ન હોય તો ખાલી સ્ટ્રિંગ સેટ થાય
            setProfile({
              ...currentProfile,
              whatsappNumber: currentProfile.whatsappNumber || ""
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("");
    try {
      const response = await fetch('/api/serviceprovider/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile), 
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // API માંથી આવેલો નવો ડેટા (user) સેટ કરવો
        setProfile(prev => ({
          ...prev,
          ...data.user,
          whatsappNumber: data.user.whatsappNumber || ""
        })); 
        setIsEditing(false);
        setSaveStatus("Saved!");
      } else {
        setSaveStatus(data.error || "Error!");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("Failed!");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-bold animate-pulse text-sm">Loading Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc]">
      <Sidebar activePage="profile" />

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 mt-16 lg:mt-0">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* --- PROFILE HEADER CARD --- */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 md:gap-8 relative z-10">
              <div className="relative group shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden transition-transform group-hover:scale-105">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.fullName || 'User'}`} 
                    alt="profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 w-full space-y-3 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4 max-w-md mx-auto md:mx-0">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Full Name</label>
                      <input name="fullName" value={profile.fullName || ""} onChange={handleChange} className="text-xl font-black text-slate-800 outline-none w-full bg-transparent" placeholder="Enter full name" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Provider Name</label>
                      <input name="providerName" value={profile.providerName || ""} onChange={handleChange} className="text-indigo-600 font-bold outline-none w-full bg-transparent" placeholder="Enter provider name" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{profile.fullName || "Your Name"}</h1>
                      {profile.status === "approved" && <BadgeCheck className="text-indigo-600" size={24} />}
                    </div>
                    <p className="text-indigo-600 font-bold text-lg">{profile.providerName || "Service Provider"}</p>
                    <div className="flex justify-center md:justify-start">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${profile.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                         {profile.status}
                       </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isSaving}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                    isEditing ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  }`}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16}/> : isEditing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
                </button>
                {isEditing && (
                  <button onClick={() => setIsEditing(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">Cancel</button>
                )}
                {saveStatus && (
                  <div className={`mt-2 px-4 py-1 rounded-full text-[10px] font-black uppercase ${saveStatus === 'Saved!' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    {saveStatus}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>

          {/* --- INFO GRIDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Service Details</h3>
                 <Briefcase size={18} className="text-slate-300" />
              </div>
              <div className="space-y-5">
                <EditableField label="Category" icon={<Briefcase size={18}/>} name="serviceCategory" value={profile.serviceCategory} isEditing={isEditing} onChange={handleChange} />
                <EditableField label="Experience Year" icon={<Star size={18}/>} name="experience" value={profile.experience} isEditing={isEditing} onChange={handleChange} />
                <EditableField label="Location" icon={<MapPin size={18}/>} name="location" value={profile.location} isEditing={isEditing} onChange={handleChange} />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Personal Contact</h3>
                 <Phone size={18} className="text-slate-300" />
              </div>
              <div className="space-y-5">
                <EditableField label="Email Address" icon={<Mail size={18}/>} name="email" value={profile.email} isEditing={isEditing} onChange={handleChange} readOnly={true} />
                <EditableField label="Mobile Number" icon={<Phone size={18}/>} name="mobile" value={profile.mobile} isEditing={isEditing} onChange={handleChange} />
                
                {/* WhatsApp Number Field */}
                <EditableField label="WhatsApp Number" icon={<MessageCircle size={18}/>} name="whatsappNumber" value={profile.whatsappNumber} isEditing={isEditing} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EditableField({ label, icon, name, value, isEditing, onChange, readOnly = false }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:bg-indigo-50">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">{label}</p>
        {isEditing && !readOnly ? (
          <input 
            name={name} 
            value={value || ""} 
            onChange={onChange} 
            className="w-full bg-slate-50 border-b-2 border-indigo-100 focus:border-indigo-500 outline-none text-sm font-bold text-slate-700 py-1 px-1 transition-all rounded-t-lg" 
            placeholder={`Enter ${label}`}
          />
        ) : (
          <p className={`text-sm font-bold truncate ${readOnly && isEditing ? "text-slate-400 italic" : "text-slate-700"}`}>
            {value || "Not Set"}
          </p>
        )}
      </div>
    </div>
  );
}