"use client";

import { ArrowRight, FileText, Sparkles, Wand2, Layers } from "lucide-react";

export default function ResumeLandingPage() {
  const features = [
    {
      title: "Create Your Resume",
      desc: "Step-by-step builder to make a professional resume.",
      icon: FileText,
      href: "/resume/resume-builder",
    },
    {
      title: "AI Resume Writer",
      desc: "Generate summaries and bullet points with AI.",
      icon: Sparkles,
      href: "/resume/ai-writer",
    },
    {
      title: "Cover Letter Generation",
      desc: "Generate professional cover letters tailored for each job.",
      icon: Wand2,
      href: "/cover-letter/builder",
    },
    {
      title: "Optimize With AI",
      desc: "Check ATS score & improve resume for jobs.",
      icon: Wand2,
      href: "/resume/ats-check",
    },
  ];

  const getIcon = (icon) => {
    const IconComp = icon;
    return <IconComp size={28} className="transition-transform duration-300 group-hover:scale-110" />;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16">

        {/* Hero Section */}
        <div className="text-center flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Build a Job-Winning Resume
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
            Create, optimize, and tailor your resume with our AI-powered tools — all in one place.
          </p>
          <div className="mt-6">
            <a
              href="/resume/builder"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg transition transform hover:-translate-y-1"
            >
              Start Building Your Resume <ArrowRight size={20} />
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((f, idx) => (
            <a
              key={idx}
              href={f.href}
              className="group flex flex-col bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl border border-gray-200 transition transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                  {getIcon(f.icon)}
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </div>
              <p className="text-gray-600 flex-1">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-blue-600 font-medium group-hover:underline">
                Get Started <ArrowRight size={16} />
              </span>
            </a>
          ))}
        </div>

       
      </div>
    </div>
  );
}
