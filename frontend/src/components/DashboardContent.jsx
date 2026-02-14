"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image"



export default function JobConnectPro() {
  const [config, setConfig] = useState({
    hero_title: "Find Your Dream Career, Faster Than Ever",
    hero_subtitle: "Connect with top employers, showcase your skills, and land your perfect job. The most comprehensive platform for job seekers and recruiters.",
    features_title: "Everything You Need to Succeed",
    cta_text: "Get Started Free",
  });

  // SDK Integration Logic
  useEffect(() => {
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig: config,
        onConfigChange: (updated) => setConfig(prev => ({ ...prev, ...updated }))
      });
    }
  }, [config]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .gradient-text {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .floating { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .pulse-ring { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.05); } }
      `}</style>

      {/* --- Navigation --- */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">JobConnect<span className="text-indigo-600">Pro</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="#recruiters" className="hover:text-indigo-600 transition-colors">For Recruiters</a>
              <a href="#profiles" className="hover:text-indigo-600 transition-colors">Profiles</a>
              <a href="#admin" className="hover:text-indigo-600 transition-colors">Enterprise</a>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
              {config.cta_text}
            </button>
          </div>
        </div>
      </nav> */}

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl floating" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl floating" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-indigo-700 text-sm font-bold tracking-wide uppercase">10M+ Active Job Seekers</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              {config.hero_title.split(',')[0]}, <br />
              <span className="gradient-text">{config.hero_title.split(',')[1] || "Faster Than Ever"}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              {config.hero_subtitle}
            </p>

            {/* Search Box */}
            <div className="bg-white shadow-xl shadow-indigo-100 border border-slate-200 rounded-2xl p-2 mb-10 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <input type="text" placeholder="Job title or skills" className="flex-1 px-4 py-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" />
              <button className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg">Search Jobs</button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div><div className="text-3xl font-black text-slate-900">500K+</div><div className="text-slate-500 font-medium">Jobs</div></div>
              <div><div className="text-3xl font-black text-slate-900">50K+</div><div className="text-slate-500 font-medium">Companies</div></div>
              <div><div className="text-3xl font-black text-slate-900">95%</div><div className="text-slate-500 font-medium">Success</div></div>
            </div>
          </div>

          {/* Hero Visuals */}
          <div className="hidden lg:block relative h-[500px]">
            <div className="absolute top-0 right-0 w-80 bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 floating">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">G</div>
                <div><h3 className="font-bold">Senior Engineer</h3><p className="text-slate-400 text-sm">Google • Remote</p></div>
              </div>
              <div className="text-green-600 font-bold">$180K - $220K</div>
            </div>
            <div className="absolute bottom-10 left-0 w-72 bg-white border border-emerald-100 shadow-2xl rounded-3xl p-5 floating" style={{ animationDelay: '-3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <div><p className="font-bold text-sm">Application Accepted!</p><p className="text-slate-400 text-xs">Microsoft HR Team</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-16">{config.features_title}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Smart Search", desc: "AI-powered filters for location & salary.", icon: "🔍", color: "bg-indigo-50" },
              { title: "Verified", desc: "Every company is manually checked.", icon: "✅", color: "bg-emerald-50" },
              { title: "Instant Apply", desc: "Apply with a single click profile.", icon: "⚡", color: "bg-amber-50" },
              { title: "Insights", desc: "Track applications & salary trends.", icon: "📊", color: "bg-pink-50" }
            ].map((feature, i) => (
              <div key={i} className={`${feature.color} p-8 rounded-[32px] border border-slate-50 hover:scale-105 transition-transform cursor-default`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Recruiter Section --- */}
      <section id="recruiters" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-slate-900">Hire Top Talent <span className="gradient-text">10x Faster</span></h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">Streamline your recruitment process with AI-powered matching and centralized candidate tracking.</p>
            <div className="space-y-4 mb-10">
              {['Easy Job Posting', 'Candidate Management', 'AI Matching Engine'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 font-semibold text-slate-700">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                  {item}
                </div>
              ))}
            </div>
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl">Start Hiring Now</button>
          </div>
          <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
            <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Recent Applicants</h4>
            <div className="space-y-4">
              {[
                { name: "Sarah Kim", role: "UI Designer", match: "98%" },
                { name: "Mike Ross", role: "Backend Dev", match: "92%" },
                { name: "Jessica P.", role: "Manager", match: "85%" }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full border border-indigo-200 flex items-center justify-center font-bold text-indigo-600">{c.name[0]}</div>
                    <div><div className="font-bold text-sm text-slate-900">{c.name}</div><div className="text-xs text-slate-400 font-medium">{c.role}</div></div>
                  </div>
                  <span className="text-indigo-600 font-bold text-xs bg-indigo-50 px-3 py-1.5 rounded-lg">{c.match} Match</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Admin/Enterprise Section --- */}
      <section id="admin" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 bg-indigo-600 rounded-[48px] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6">Enterprise Dashboard</h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">Complete control over your recruitment ecosystem with analytics, security, and custom settings.</p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20"><div className="text-2xl font-bold">2.4M</div><div className="text-indigo-100 text-sm">Total Users</div></div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20"><div className="text-2xl font-bold">89K</div><div className="text-indigo-100 text-sm">Jobs Posted</div></div>
              </div>
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">Request Demo</button>
            </div>
            <div className="hidden lg:block bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
              <div className="h-48 flex items-end gap-3 mb-6">
                {[40, 70, 45, 90, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all hover:bg-white" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-center text-sm font-bold text-indigo-100 uppercase tracking-widest">Platform Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-slate-50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8">Ready to Transform Your Career?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">{config.cta_text}</button>
            <button className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">Watch Demo</button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">J</div>
                <span className="text-xl font-bold text-slate-900">JobConnectPro</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">Connecting global talent with world-class opportunities. The future of hiring is here.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Job Seekers</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Create Profile</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 text-center text-slate-400 text-sm font-medium">
            © 2026 JobConnect Pro Inc. Built with React & Tailwind.
          </div>
        </div>
      </footer>
    </div>
  );
}