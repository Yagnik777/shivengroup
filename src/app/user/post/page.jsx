"use client";
import { useState, useEffect } from "react";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import UserSidebar from "@/components/UserSidebar"; 
import { 
  Loader2, UploadCloud, Building2, 
  MessageSquareText, CheckCircle, MapPin, 
  Banknote, GraduationCap, Globe, Briefcase,
  User, Mail, Phone, Calendar, ShieldCheck, Tag, Info, Award, Clock, ArrowRight, FileText, Image as ImageIcon
} from "lucide-react";

export default function CandidateDashboard() {
  const [loading, setLoading] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [myJobs, setMyJobs] = useState([]); 

  const [jobData, setJobData] = useState({ 
    title: "", category: "", jobType: "Full-time", 
    location: "", salaryRange: "", experienceLevel: "", 
    description: "", requirements: "", deadline: "",
    industry: "", profession: "", designation: "", department: ""
  });

  const [companyData, setCompanyData] = useState({ 
    companyName: "", tagline: "", industry: "", department: "", 
    profession: "", designation: "", website: "", email: "", 
    mobile: "", location: "", address: "", companySize: "", 
    founded: "", description: "", specialties: "", logo: "",
    contactPersonName: "", contactPersonNumber: "", contactPersonEmail: "",
    ownerName: "", ownerNumber: "", ownerEmail: ""
  });

  const fetchMyJobs = async () => {
    try {
      const res = await fetch("/api/candidate-jobs");
      const data = await res.json();
      if (Array.isArray(data)) setMyJobs(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMyJobs();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
  }, []);

  const processTextWithAI = async (text) => {
    if (!text || text.trim() === "") return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/extract-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text }),
      });
      const result = await res.json();
      if (result.job) setJobData(prev => ({ ...prev, ...result.job }));
      if (result.company) setCompanyData(prev => ({ ...prev, ...result.company }));
    } catch (err) {
      alert("AI Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    let extractedText = "";
    try {
      if (file.type.startsWith("image/")) {
        const res = await Tesseract.recognize(file, 'eng');
        extractedText = res.data.text;
      } else if (file.type === "application/pdf") {
        if (!window.pdfjsLib) {
          alert("PDF library is still loading...");
          setLoading(false);
          return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(s => s.str).join(" ") + "\n";
        }
        extractedText = fullText;
      } else if (file.type.includes("word") || file.name.endsWith(".docx")) {
        const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        extractedText = res.value;
      }

      if (extractedText.trim()) {
        setPastedText(extractedText);
        processTextWithAI(extractedText);
      } else {
        alert("No text could be extracted from this file.");
        setLoading(false);
      }
    } catch (err) {
      alert("File Error: " + err.message);
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const payload = { ...jobData, companyDetails: companyData };
      const response = await fetch("/api/candidate-jobs", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("🚀 Published Successfully!");
        fetchMyJobs();
      } else {
        alert("Error saving data.");
      }
    } catch (err) { 
      alert("Network Error: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 flex-shrink-0 hidden md:block border-r border-slate-200 bg-white">
        <UserSidebar />
      </aside>

      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-black text-slate-800">Post New Career Listing</h2>
            <button onClick={handlePublish} className="btn-primary px-10 py-4 shadow-xl">PUBLISH LIVE</button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* AI IMPORT SECTION */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-box border-2 border-indigo-100 bg-indigo-50/20">
                <h3 className="section-title text-indigo-600"> <UploadCloud size={18}/> AI Smart Import </h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <label htmlFor="fileIn" className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 transition-all text-slate-600">
                    <FileText size={20} className="mb-1 text-red-500"/>
                    <span className="text-[10px] font-bold uppercase">PDF</span>
                  </label>
                  <label htmlFor="fileIn" className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 transition-all text-slate-600">
                    <ImageIcon size={20} className="mb-1 text-blue-500"/>
                    <span className="text-[10px] font-bold uppercase">Image</span>
                  </label>
                  <button onClick={() => document.getElementById('jdText').focus()} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-all text-slate-600">
                    <MessageSquareText size={20} className="mb-1 text-emerald-500"/>
                    <span className="text-[10px] font-bold uppercase">Text</span>
                  </button>
                </div>

                <input type="file" id="fileIn" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={handleFileUpload} />
                
                <div className="relative">
                  <label className="text-[11px] font-bold text-slate-500 mb-1 block uppercase ml-1">Job Description Text</label>
                  {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl"><Loader2 className="animate-spin text-indigo-600" /></div>}
                  <textarea 
                    id="jdText"
                    className="input-style h-40" 
                    placeholder="Paste your Job Description here..." 
                    value={pastedText || ""} 
                    onChange={e => setPastedText(e.target.value)} 
                  />
                </div>
                
                <button onClick={() => processTextWithAI(pastedText)} className="btn-secondary mt-3 py-3">
                  RUN AI EXTRACTION ENGINE
                </button>
              </div>

              {/* COMPANY PROFILE */}
              <div className="card-box">
                <h3 className="section-title"> <Building2 size={18}/> Company Profile </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="label-style">Company Name</label>
                    <input className="input-style" placeholder="Ex: Google" value={companyData.companyName || ""} onChange={e => setCompanyData({...companyData, companyName: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Tagline</label>
                    <input className="input-style" placeholder="Ex: Innovation at its best" value={companyData.tagline || ""} onChange={e => setCompanyData({...companyData, tagline: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label-style">Industry</label>
                      <input className="input-style" placeholder="Ex: IT" value={companyData.industry || ""} onChange={e => setCompanyData({...companyData, industry: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Company Size</label>
                      <input className="input-style" placeholder="Ex: 50-100" value={companyData.companySize || ""} onChange={e => setCompanyData({...companyData, companySize: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label-style">Website</label>
                      <input className="input-style" placeholder="Ex: www.google.com" value={companyData.website || ""} onChange={e => setCompanyData({...companyData, website: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Founded Year</label>
                      <input className="input-style" placeholder="Ex: 1998" value={companyData.founded || ""} onChange={e => setCompanyData({...companyData, founded: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">Address</label>
                    <input className="input-style" placeholder="Full Address" value={companyData.address || ""} onChange={e => setCompanyData({...companyData, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Specialties</label>
                    <textarea className="input-style h-20" placeholder="What do you specialize in?" value={companyData.specialties || ""} onChange={e => setCompanyData({...companyData, specialties: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">About Company</label>
                    <textarea className="input-style h-20" placeholder="Brief description..." value={companyData.description || ""} onChange={e => setCompanyData({...companyData, description: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* JOB DETAILS SECTION */}
            <div className="lg:col-span-7 space-y-6">
              <div className="card-box shadow-lg">
                <h3 className="section-title"> <Briefcase size={18}/> Job Vacancy Details </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="label-style">Job Title</label>
                    <input className="input-style font-bold text-indigo-600" placeholder="Ex: Senior Developer" value={jobData.title || ""} onChange={e => setJobData({...jobData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Designation</label>
                    <input className="input-style" placeholder="Ex: Lead" value={jobData.designation || ""} onChange={e => setJobData({...jobData, designation: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Department</label>
                    <input className="input-style" placeholder="Ex: Engineering" value={jobData.department || ""} onChange={e => setJobData({...jobData, department: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Category</label>
                    <input className="input-style" placeholder="Ex: Software" value={jobData.category || ""} onChange={e => setJobData({...jobData, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Job Type</label>
                    <select className="input-style" value={jobData.jobType || "Full-time"} onChange={e => setJobData({...jobData, jobType: e.target.value})}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-style">Location</label>
                    <input className="input-style" placeholder="Ex: Remote / City" value={jobData.location || ""} onChange={e => setJobData({...jobData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Salary Range</label>
                    <input className="input-style" placeholder="Ex: 5L - 8L" value={jobData.salaryRange || ""} onChange={e => setJobData({...jobData, salaryRange: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Experience Level</label>
                    <input className="input-style" placeholder="Ex: 2+ Years" value={jobData.experienceLevel || ""} onChange={e => setJobData({...jobData, experienceLevel: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-style">Application Deadline</label>
                    <input className="input-style" type="date" value={jobData.deadline || ""} onChange={e => setJobData({...jobData, deadline: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="label-style">Job Description</label>
                    <textarea className="input-style h-24" placeholder="Role and responsibilities..." value={jobData.description || ""} onChange={e => setJobData({...jobData, description: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="label-style">Key Requirements</label>
                    <textarea className="input-style h-24" placeholder="Skills, education, etc..." value={jobData.requirements || ""} onChange={e => setJobData({...jobData, requirements: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-box bg-emerald-50/30">
                  <h3 className="section-title text-emerald-700"> <User size={16}/> Contact Person </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="label-style">Full Name</label>
                      <input className="input-style" placeholder="Name" value={companyData.contactPersonName || ""} onChange={e => setCompanyData({...companyData, contactPersonName: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Work Email</label>
                      <input className="input-style" placeholder="Email" value={companyData.contactPersonEmail || ""} onChange={e => setCompanyData({...companyData, contactPersonEmail: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Mobile No</label>
                      <input className="input-style" placeholder="Number" value={companyData.contactPersonNumber || ""} onChange={e => setCompanyData({...companyData, contactPersonNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="card-box bg-orange-50/30">
                  <h3 className="section-title text-orange-700"> <ShieldCheck size={16}/> Business Owner </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="label-style">Owner Name</label>
                      <input className="input-style" placeholder="Name" value={companyData.ownerName || ""} onChange={e => setCompanyData({...companyData, ownerName: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Owner Email</label>
                      <input className="input-style" placeholder="Email" value={companyData.ownerEmail || ""} onChange={e => setCompanyData({...companyData, ownerEmail: e.target.value})} />
                    </div>
                    <div>
                      <label className="label-style">Owner Mobile</label>
                      <input className="input-style" placeholder="Number" value={companyData.ownerNumber || ""} onChange={e => setCompanyData({...companyData, ownerNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE LISTINGS SECTION */}
          <div className="mt-12 border-t pt-10">
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <CheckCircle className="text-emerald-500" /> Your Published Career Listings
            </h3>
            <div className="grid grid-cols-1 gap-4"> 
              {myJobs.length > 0 ? (
                myJobs.map((job, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex justify-between items-center group">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{job.title}</h4>
                      <p className="text-indigo-600 font-bold text-xs uppercase">{job.companyDetails?.companyName}</p>
                      <div className="flex gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase">
                        <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {job.jobType}</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-sm">
                  No live posts found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .card-box { background: white; padding: 1.5rem; border-radius: 1.25rem; border: 1px solid #e2e8f0; }
        .section-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; margin-bottom: 1rem; text-transform: uppercase; font-size: 0.7rem; color: #64748b; letter-spacing: 0.05em; }
        .label-style { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px; display: block; margin-left: 4px; }
        .input-style { width: 100%; padding: 0.6rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; font-size: 0.85rem; }
        .input-style:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px #eef2ff; }
        .btn-primary { background: #4f46e5; color: white; border-radius: 1rem; font-weight: 900; transition: 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); background: #4338ca; }
        .btn-secondary { width: 100%; background: #1e293b; color: white; padding: 0.6rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}