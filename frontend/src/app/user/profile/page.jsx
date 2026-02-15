"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import { 
  User, Mail, Phone, Briefcase, MapPin, 
  Link as LinkIcon, FileText, Save, Loader2, Award 
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false); // પ્રોફાઇલ ચેક કરવા માટે
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", dob: "", 
    profession: "", position: "", role: "",
    pincode: "", state: "", city: "", 
    education: "", experience: "", 
    reference: "", skills: [], 
    linkedin: "", portfolio: ""
  });

  const [files, setFiles] = useState({
    resume: null,
    coverLetter: null,
    experienceLetter: null
  });

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login");
  }, [status, router]);

  // ✅ ડેટા લોડ કરતી વખતે ચેક કરો કે પ્રોફાઇલ પહેલેથી છે કે નહીં
  useEffect(() => {
    const loadData = async () => {
      if (status !== "authenticated" || !session?.user?.email) return;
      try {
        const res = await fetch(`/api/candidates?email=${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data._id) { 
            // જો ડેટા મળે તો સ્ટેટમાં સેટ કરો
            setFormData(prev => ({ ...prev, ...data }));
            setIsExistingUser(true); // યુઝરની પ્રોફાઇલ પહેલેથી બનેલી છે
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [status, session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'skills') data.append(key, JSON.stringify(formData[key]));
        else data.append(key, formData[key] || "");
      });

      if (files.resume) data.append("resume", files.resume);
      if (files.coverLetter) data.append("coverLetter", files.coverLetter);
      if (files.experienceLetter) data.append("experienceLetter", files.experienceLetter);

      const res = await fetch("/api/candidates", { method: "POST", body: data });
      if (res.ok) {
        alert(isExistingUser ? "Profile updated successfully!" : "Profile created successfully!");
        setIsExistingUser(true);
      }
    } catch (err) {
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <UserSidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {isExistingUser ? "Edit Profile" : "Complete Profile"}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {isExistingUser ? "Review and update your current details" : "Fill in your details to get started"}
              </p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? "Processing..." : isExistingUser ? "Update Profile" : "Save Profile"}
            </button>
          </div>

          <form className="space-y-10 pb-20">
            
            {/* Sections Loop */}
            {[
              { 
                title: "Personal Identity", 
                icon: <User size={22}/>, 
                color: "bg-indigo-50 text-indigo-600",
                fields: [
                  { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "email@example.com" },
                  { label: "Mobile Number", name: "mobile", type: "tel", placeholder: "+91 00000 00000" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  { label: "Reference", name: "reference", type: "text", placeholder: "LinkedIn, Friend, etc." }
                ]
              },
              { 
                title: "Location Details", 
                icon: <MapPin size={22}/>, 
                color: "bg-orange-50 text-orange-600",
                fields: [
                  { label: "City", name: "city", type: "text", placeholder: "Your current city" },
                  { label: "State", name: "state", type: "text", placeholder: "State name" },
                  { label: "Pincode", name: "pincode", type: "text", placeholder: "6-digit code", maxLength: 6 }
                ]
              },
              { 
                title: "Work & Education", 
                icon: <Briefcase size={22}/>, 
                color: "bg-emerald-50 text-emerald-600",
                fields: [
                  { label: "Profession", name: "profession", type: "text", placeholder: "e.g. Developer" },
                  { label: "Applying for Position", name: "position", type: "text", placeholder: "e.g. Senior Role" },
                  { label: "Role / Specialization", name: "role", type: "text", placeholder: "e.g. Backend" },
                  { label: "Experience", name: "experience", type: "text", placeholder: "e.g. 2 Years" }
                ],
                fullWidth: { label: "Education Details", name: "education", placeholder: "Your degrees and certificates..." }
              }
            ].map((section, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-md">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 ${section.color} rounded-xl shadow-sm`}>{section.icon}</div>
                  <h2 className="text-2xl font-extrabold text-slate-800">{section.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.fields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">{field.label}</label>
                      <input 
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                      />
                    </div>
                  ))}
                  {section.fullWidth && (
                    <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">{section.fullWidth.label}</label>
                      <textarea 
                        name={section.fullWidth.name}
                        rows="3"
                        value={formData[section.fullWidth.name] || ""}
                        onChange={handleInputChange}
                        placeholder={section.fullWidth.placeholder}
                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Section 4: Skills & Socials */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm"><Award size={22}/></div>
                <h2 className="text-2xl font-extrabold text-slate-800">Skills & Socials</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Skills (Comma separated)</label>
                  <input 
                    name="skills" 
                    value={Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills || ""} 
                    onChange={(e) => setFormData(prev => ({...prev, skills: e.target.value.split(",").map(s => s.trim())}))} 
                    placeholder="React, Node.js..." 
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">LinkedIn Profile</label>
                  <input name="linkedin" value={formData.linkedin || ""} onChange={handleInputChange} placeholder="URL here" className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Portfolio Link</label>
                  <input name="portfolio" value={formData.portfolio || ""} onChange={handleInputChange} placeholder="URL here" className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm" />
                </div>
              </div>
            </div>

            {/* Section 5: Documents */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shadow-sm"><FileText size={22}/></div>
                <h2 className="text-2xl font-extrabold text-slate-800">Documents</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {['resume', 'coverLetter', 'experienceLetter'].map((fileKey) => (
                   <div key={fileKey} className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
                      <div className="p-4 bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-full mb-4">
                        <FileText size={30} />
                      </div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{fileKey}</p>
                      <p className="text-[10px] text-slate-400 mb-4">{files[fileKey] ? files[fileKey].name : "Replace or upload new"}</p>
                      <input type="file" name={fileKey} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                   </div>
                 ))}
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}