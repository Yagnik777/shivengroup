"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Sparkles, FileText } from 'lucide-react';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import { useRouter } from 'next/navigation';
import Tesseract from 'tesseract.js'; 

export default function PostJobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [pdfjs, setPdfjs] = useState(null);
  
  // --- 🛠️ Dynamic Data States ---
  const [categories, setCategories] = useState([]); 
  const [experienceLevels, setExperienceLevels] = useState([]); 
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    jobType: 'Full-time',
    location: '',
    salaryRange: '',
    experienceLevel: '',
    description: '',
    requirements: '', 
    deadline: '',
  });

  // --- 📡 Fetch Admin Settings ---
  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        const res = await fetch('/api/dropdowns');
        if (res.ok) {
          const allData = await res.json();
          
          const filteredCategories = allData.filter(item => item.type === 'jobCategory');
          setCategories(filteredCategories);
          
          const filteredExperience = allData.filter(item => item.type === 'experienceLevel');
          setExperienceLevels(filteredExperience);
        }
      } catch (err) {
        console.error("Error fetching dynamic fields:", err);
      }
    };

    fetchAdminSettings();
  }, []);

  useEffect(() => {
    const loadPdfJS = async () => {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      setPdfjs(pdfjsLib);
    };
    loadPdfJS();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    try {
      let extractedText = "";
      if (file.type.startsWith('image/')) {
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        extractedText = text;
      } 
      else if (file.type === 'application/pdf') {
        if (!pdfjs) {
          alert("PDF library is still loading, please wait...");
          return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          fullText += pageText + "\n";
        }
        extractedText = fullText;
      }
      if (extractedText.trim()) {
        parseAndFillForm(extractedText);
      }
    } catch (err) {
      console.error("Scan Error:", err);
      alert("Scan Error: " + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const parseAndFillForm = (text) => {
    const lowerText = text.toLowerCase();
    const lines = text.split('\n');
    let newDetails = { ...formData };
    const titleKeywords = ["developer", "manager", "expert", "designer", "engineer", "specialist"];
    for (let line of lines) {
      if (titleKeywords.some(key => line.toLowerCase().includes(key))) {
        newDetails.title = line.trim();
        break;
      }
    }
    if (lowerText.includes("marketing")) newDetails.category = "Marketing";
    if (lowerText.includes("remote")) newDetails.jobType = "Remote";
    const salaryMatch = text.match(/(₹|\$)\s?\d+[kLML]\s?-\s?(₹|\$)\s?\d+[kLML]/i);
    if (salaryMatch) newDetails.salaryRange = salaryMatch[0];
    newDetails.requirements = lines.filter(l => l.includes('•') || l.includes('-')).join(', ').substring(0, 200);
    newDetails.description = text.substring(0, 500);
    setFormData(prev => ({ ...prev, ...newDetails }));
    alert("Form pre-filled successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/jobs/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🚀 Job Published Successfully!");
        router.push("/recruiter/dashboard");
      } else {
        // Handling the profile error and redirecting to the registration page
        if (data.error === "Company profile not found" || data.error === "Profile incomplete") {
          alert("Profile not found. Please complete your registration first.");
          router.push("/recruiter/register");
        } else {
          alert("❌ Error: " + (data.error || "Something went wrong"));
        }
      }
    } catch (err) {
      alert("❌ Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans">
      <RecruiterSidebar activePage="postjob" />
      <main className="flex-1 p-4 sm:p-6 md:p-10 mt-16 lg:mt-0 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6 hover:text-indigo-600 transition-all">
            <ArrowLeft size={18} /> Back
          </button>

          <div className="mb-8 p-6 bg-slate-900 rounded-[30px] shadow-xl text-white relative overflow-hidden border border-slate-800">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black">AI Job Scanner</h2>
                    <p className="text-slate-400 text-xs">Upload Image or PDF, AI will fill details</p>
                </div>
              </div>
              <label className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl cursor-pointer transition-all shadow-lg shadow-indigo-500/20 font-bold text-white">
                {isScanning ? (
                  <><Loader2 className="animate-spin" size={20} /> Scanning...</>
                ) : (
                  <><FileText size={20} /> Upload Image / PDF</>
                )}
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div className="bg-white shadow-2xl shadow-indigo-100/30 rounded-[30px] border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 p-8 md:p-12 text-white">
              <h1 className="text-3xl font-black mb-2">Post a Job</h1>
              <p className="text-indigo-100 text-sm opacity-90">Fill in the details to find your next star hire.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-10">
              <section className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">01</span>
                  Job Basics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Job Title</label>
                    <input type="text" name="title" required onChange={handleChange} value={formData.title}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-800"
                      placeholder="e.g. Senior React Developer" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                    <select name="category" required onChange={handleChange} value={formData.category}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-800">
                      <option value="">Select Category</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.value}>{cat.value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Job Type</label>
                    <select name="jobType" onChange={handleChange} value={formData.jobType}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold text-slate-800">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="pt-8 border-t border-slate-100 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">02</span>
                  Details & Salary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Location</label>
                    <input type="text" name="location" required onChange={handleChange} value={formData.location}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold text-slate-800" placeholder="e.g. Ahmedabad" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Salary Range</label>
                    <input type="text" name="salaryRange" required onChange={handleChange} value={formData.salaryRange}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold text-slate-800" placeholder="e.g. ₹10L - ₹15L PA" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Experience Level</label>
                    <select name="experienceLevel" required onChange={handleChange} value={formData.experienceLevel}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold text-slate-800">
                      <option value="">Select Experience</option>
                      {experienceLevels.map((lvl, idx) => (
                        <option key={idx} value={lvl.value}>{lvl.value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Deadline</label>
                    <input type="date" name="deadline" required onChange={handleChange} value={formData.deadline}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-semibold text-slate-800" />
                  </div>
                </div>
              </section>

              <section className="pt-8 border-t border-slate-100 space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">03</span>
                  Role Description
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">About the Role</label>
                    <textarea name="description" rows="4" required onChange={handleChange} value={formData.description}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-medium text-sm text-slate-800" placeholder="Job duties..."></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Requirements (Skills)</label>
                    <textarea name="requirements" rows="3" required onChange={handleChange} value={formData.requirements}
                      className="mt-2 w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-medium text-sm text-slate-800" placeholder="React, Node.js, MongoDB (separate with commas)"></textarea>
                  </div>
                </div>
              </section>

              <div className="pt-10">
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="animate-spin" /> Publishing...</> : <><Send size={20} /> Publish Job</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}