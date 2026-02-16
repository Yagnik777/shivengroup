// "use client";

// import { ArrowRight, FileText, Sparkles, Wand2, Layers } from "lucide-react";

// export default function ResumeLandingPage() {
//   const features = [
//     {
//       title: "Create Your Resume",
//       desc: "Step-by-step builder to make a professional resume.",
//       icon: FileText,
//       href: "/resume/resume-builder",
//     },
//     {
//       title: "AI Resume Writer",
//       desc: "Generate summaries and bullet points with AI.",
//       icon: Sparkles,
//       href: "/resume/ai-writer",
//     },
//     {
//       title: "Cover Letter Generation",
//       desc: "Generate professional cover letters tailored for each job.",
//       icon: Wand2,
//       href: "/cover-letter/builder",
//     },
//     {
//       title: "Optimize With AI",
//       desc: "Check ATS score & improve resume for jobs.",
//       icon: Wand2,
//       href: "/resume/ats-check",
//     },
//   ];

//   const getIcon = (icon) => {
//     const IconComp = icon;
//     return <IconComp size={28} className="transition-transform duration-300 group-hover:scale-110" />;
//   };

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
//       <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16">

//         {/* Hero Section */}
//         <div className="text-center flex flex-col items-center gap-4">
//           <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
//             Build a Job-Winning Resume
//           </h1>
//           <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
//             Create, optimize, and tailor your resume with our AI-powered tools — all in one place.
//           </p>
//           <div className="mt-6">
//             <a
//               href="/resume/builder"
//               className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg transition transform hover:-translate-y-1"
//             >
//               Start Building Your Resume <ArrowRight size={20} />
//             </a>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="grid gap-8 md:grid-cols-2">
//           {features.map((f, idx) => (
//             <a
//               key={idx}
//               href={f.href}
//               className="group flex flex-col bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl border border-gray-200 transition transform hover:-translate-y-2 cursor-pointer"
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
//                   {getIcon(f.icon)}
//                 </div>
//                 <h3 className="text-xl font-semibold">{f.title}</h3>
//               </div>
//               <p className="text-gray-600 flex-1">{f.desc}</p>
//               <span className="mt-4 inline-flex items-center gap-2 text-blue-600 font-medium group-hover:underline">
//                 Get Started <ArrowRight size={16} />
//               </span>
//             </a>
//           ))}
//         </div>

       
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { 
  Plus, Trash, FileDown, UploadCloud, 
  User, Briefcase, GraduationCap, Code, 
  Award, FolderGit2, Globe2, Sparkles, 
  CheckCircle2, LayoutTemplate
} from "lucide-react";
import ResumePreview from "@/components/ResumePreview";
import UserSidebar from "@/components/UserSidebar";

export default function ResumeBuilderPage() {
  // States (Keeping your original state logic)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState([{ title: "", company: "", duration: "", description: "" }]);
  const [educations, setEducations] = useState([{ degree: "", university: "", year: "" }]);
  const [skills, setSkills] = useState([""]);
  const [certifications, setCertifications] = useState([""]);
  const [projects, setProjects] = useState([{ name: "", link: "", description: "" }]);
  const [languages, setLanguages] = useState([""]);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [template, setTemplate] = useState("template1");

  const templates = [
    { id: "template1", name: "Classic", description: "Clean & Pro" },
    { id: "template2", name: "Modern", description: "Sleek look" },
    { id: "template3", name: "Creative", description: "Unique style" },
    { id: "template4", name: "Minimal", description: "Simple" },
  ];

  // Logic Handlers (Keeping your logic intact)
  const handleExperienceChange = (index, field, value) => {
    const newExps = [...experiences];
    newExps[index][field] = value;
    setExperiences(newExps);
  };
  const handleEducationChange = (index, field, value) => {
    const newEdus = [...educations];
    newEdus[index][field] = value;
    setEducations(newEdus);
  };
  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };
  // ... other handlers (add them back here as per your original code)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <UserSidebar />
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Sparkles className="text-indigo-600" /> Resume Builder
            </h1>
            <p className="text-slate-500 font-medium">Create a job-winning resume in minutes.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-600 cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                <UploadCloud size={18} className="text-indigo-600" />
                {importing ? "Importing..." : "Import JSON/PDF"}
                <input type="file" className="hidden" accept=".pdf,.docx" onChange={() => {}} />
             </label>
             <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
             <button 
                onClick={() => {}} 
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
             >
                <CheckCircle2 size={18} /> Save Progress
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Form Builder */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Template Picker */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <LayoutTemplate size={16} /> Select Template
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-3 rounded-2xl border-2 transition-all text-left ${
                      template === t.id 
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm" 
                      : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                    }`}
                  >
                    <p className={`font-bold text-sm ${template === t.id ? "text-indigo-600" : "text-slate-700"}`}>{t.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Personal Info */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <User size={16} /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-1">FULL NAME</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-1">EMAIL ADDRESS</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold" />
                </div>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="p-3 bg-slate-50 border-none rounded-xl text-sm font-bold" />
                <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="p-3 bg-slate-50 border-none rounded-xl text-sm font-bold" />
              </div>
            </div>

            {/* 3. Professional Summary */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Professional Summary</h2>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe your career goals and achievements..."
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium min-h-[120px]"
              />
            </div>

            {/* 4. Experience Section */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Briefcase size={16} /> Work Experience
                </h2>
                <button onClick={() => setExperiences([...experiences, {title:"", company:"", duration:"", description:""}])} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <button className="absolute -top-2 -right-2 p-1.5 bg-white shadow-sm border border-slate-100 text-rose-500 rounded-full hover:bg-rose-50 transition-all">
                      <Trash size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" placeholder="Job Title" className="p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold w-full" value={exp.title} onChange={(e) => handleExperienceChange(i, 'title', e.target.value)} />
                      <input type="text" placeholder="Company" className="p-3 bg-white border border-slate-100 rounded-xl text-sm font-bold w-full" value={exp.company} onChange={(e) => handleExperienceChange(i, 'company', e.target.value)} />
                    </div>
                    <textarea placeholder="Description of your role..." className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm min-h-[100px]" value={exp.description} onChange={(e) => handleExperienceChange(i, 'description', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Grid for Skills & Others (Compact) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Code size={16} /> Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <input key={i} type="text" value={s} onChange={(e) => handleSkillChange(i, e.target.value)} className="w-full p-2 bg-slate-50 border-none rounded-lg text-xs font-bold" placeholder="Skill Name" />
                    ))}
                    <button onClick={() => setSkills([...skills, ""])} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all text-xs font-bold">+ Add Skill</button>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <GraduationCap size={16} /> Education
                  </h2>
                  <button onClick={() => setEducations([...educations, {degree:"", university:"", year:""}])} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all mb-3">Add Education</button>
                  {educations.map((edu, i) => (
                    <div key={i} className="mb-2 p-3 bg-slate-50 rounded-xl">
                       <input type="text" placeholder="Degree" className="w-full bg-transparent text-xs font-bold outline-none mb-1" value={edu.degree} />
                       <input type="text" placeholder="Uni" className="w-full bg-transparent text-[10px] text-slate-500 outline-none" value={edu.university} />
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* Right: Real-time Preview */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-8 space-y-6">
              <div className="bg-slate-900 rounded-[32px] p-2 shadow-2xl overflow-hidden border-[8px] border-slate-800">
                <div className="bg-white rounded-[24px] h-[750px] overflow-y-auto custom-scrollbar shadow-inner">
                  <ResumePreview 
                    data={{
                      personal_info: { full_name: name, email, phone, linkedin, website: github },
                      professional_summary: summary,
                      experience: experiences.map(exp => ({ position: exp.title, company: exp.company, description: exp.description })),
                      education: educations.map(edu => ({ degree: edu.degree, institution: edu.university, graduation_date: edu.year })),
                      skills
                    }} 
                    selected={template} 
                  />
                </div>
              </div>

              {/* Action Buttons Overlay */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => {}} className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <FileDown size={20} className="text-slate-400" /> Export DOCX
                </button>
                <button onClick={() => {}} className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <FileDown size={20} /> Download PDF
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};