"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Navigation માટે
import { motion } from 'framer-motion';
import { 
  Search, Users, GraduationCap, Briefcase, 
  UserPlus, MessageSquare, Calendar, Send, 
  ChevronRight, Rocket, Handshake, Globe, Sparkles
} from 'lucide-react';

const ServicesPage = () => {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState(null);

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("Thank you! Your inquiry has been sent successfully.");
    setTimeout(() => setFormStatus(null), 5000);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 pb-20">
      
      {/* --- 1. Hero Section --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-slate-100 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> The Future of Recruitment
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
              Connecting <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Global Talent</span> <br/>
              with Opportunity.
            </h1>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
              Our platform bridges the gap between skill and success, offering an all-in-one ecosystem for job seekers, recruiters, and mentors.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('core-services').scrollIntoView({ behavior: 'smooth' })} 
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2 cursor-pointer"
              >
                Explore Ecosystem <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                alt="Professional Collaboration" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-100 flex items-center gap-4"
            >
              <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                <Globe size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">10k+</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Users</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. Core Services (Updated with specific links) --- */}
      <section id="core-services" className="max-w-7xl mx-auto px-6 mb-32 pt-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Our Core Solutions</h2>
          <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <MainServiceCard 
            badge="For Job Seekers"
            title="Launch Your Career Journey"
            desc="Access curated job listings across global industries. Build your AI-optimized profile and track applications effortlessly."
            btnText="Explore Jobs"
            icon={<Search size={32} className="text-blue-500" />}
            accentColor="blue"
            onClick={() => router.push('/careers')} // careers link
          />
          <MainServiceCard 
            badge="For Recruiters"
            title="Find Your Next Star Hire"
            desc="Post openings, manage pipelines with advanced CRM tools, and connect with verified professionals in real-time."
            btnText="Hire Talent"
            icon={<Users size={32} className="text-slate-800" />}
            accentColor="slate"
            onClick={() => router.push('/recruiter/register')} // recruiter register link
          />
          <MainServiceCard 
            badge="For Service Providers"
            title="Empower the Next Generation"
            desc="Offer mock interviews, resume-building workshops, and specialized training to help talent become 'Job-Ready'."
            btnText="List Your Service"
            icon={<GraduationCap size={32} className="text-emerald-500" />}
            accentColor="emerald"
            onClick={() => router.push('/serviceprovider/register')} // sp register link
          />
        </div>
      </section>

      {/* --- 3. Professional Network --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32 py-24 bg-slate-900 rounded-[5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Handshake size={300} className="text-white" />
        </div>
        
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">Join Our Global Network</h2>
          <p className="text-slate-400 font-medium">Tools and resources designed for every stage of professional growth.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 relative z-10">
          <NetworkFeatureCard title="Post a Job" desc="Reach verified candidates with AI-matching." btnText="Post Now" icon={<Briefcase size={20} />} onClick={scrollToContact} />
          <NetworkFeatureCard title="Become a Mentor" desc="Share your expertise and build your brand." btnText="Register" icon={<UserPlus size={20} />} onClick={scrollToContact} />
          <NetworkFeatureCard title="Career Coaching" desc="Get expert resume audits and mock trials." btnText="Browse" icon={<MessageSquare size={20} />} onClick={scrollToContact} />
          <NetworkFeatureCard title="Webinars" desc="Stay ahead with weekly industry workshops." btnText="View" icon={<Calendar size={20} />} onClick={scrollToContact} />
        </div>
      </section>

      {/* --- 4. Contact & Support --- */}
      <section id="contact-section" className="max-w-4xl mx-auto px-6 scroll-mt-20">
        <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-12 text-center text-white">
            <h2 className="text-4xl font-black">Get In Touch</h2>
            <p className="text-indigo-100 mt-4 font-medium opacity-90">
              Have questions about our platform? We are here to help you navigate your success.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormInput label="Full Name" placeholder="John Doe" type="text" required />
              <FormInput label="Email Address" placeholder="john@example.com" type="email" required />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <FormInput label="Subject" placeholder="How can we help?" type="text" required />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Select Your Role</label>
                <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-600 outline-none appearance-none cursor-pointer">
                  <option>Job Seeker</option>
                  <option>Recruiter</option>
                  <option>Service Provider</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
              <textarea required rows={4} placeholder="Type your message here..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold outline-none resize-none"></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm cursor-pointer"
            >
              Send Message <Send size={18} />
            </motion.button>

            {formStatus && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-green-50 text-green-700 p-4 rounded-2xl font-black text-center border border-green-100"
              >
                {formStatus}
              </motion.div>
            )}
          </form>
        </div>
      </section>

    </div>
  );
};

// --- Reusable Components ---
const MainServiceCard = ({ badge, title, desc, btnText, icon, accentColor, onClick }) => {
  const colors = {
    blue: "border-blue-100 hover:border-blue-400 bg-blue-50/20",
    slate: "border-slate-100 hover:border-slate-800 bg-slate-50/30",
    emerald: "border-emerald-100 hover:border-emerald-400 bg-emerald-50/20"
  };

  const btnColors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    slate: "bg-slate-900 hover:bg-black",
    emerald: "bg-emerald-600 hover:bg-emerald-700"
  };

  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className={`p-12 rounded-[4rem] border-2 transition-all group bg-white shadow-sm hover:shadow-2xl flex flex-col items-center text-center ${colors[accentColor]}`}
    >
      <div className="px-5 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-sm border border-slate-50 mb-8">
        {badge}
      </div>
      <div className="mb-8 p-8 bg-white rounded-[2.5rem] shadow-sm group-hover:rotate-6 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed mb-10">{desc}</p>
      <button 
        onClick={onClick}
        className={`mt-auto w-full py-5 text-white rounded-3xl font-black transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${btnColors[accentColor]}`}
      >
        {btnText} <ChevronRight size={18} />
      </button>
    </motion.div>
  );
};

const NetworkFeatureCard = ({ title, desc, btnText, icon, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-start transition-all hover:bg-white/10"
  >
    <div className="p-4 bg-indigo-600 rounded-2xl text-white mb-6">
      {icon}
    </div>
    <h3 className="font-black text-white text-lg mb-2">{title}</h3>
    <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">{desc}</p>
    <button 
      onClick={onClick}
      className="mt-auto px-6 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all cursor-pointer"
    >
      {btnText}
    </button>
  </motion.div>
);

const FormInput = ({ label, placeholder, type, required }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <input required={required} type={type} placeholder={placeholder} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold outline-none" />
  </div>
);

const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default ServicesPage;