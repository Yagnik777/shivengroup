"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MapPin, Briefcase, 
  Coffee, Laptop, Heart, 
  ArrowRight, Search, Zap,
  Globe, Rocket
} from 'lucide-react';

const CareersPage = () => {
  const [filter, setFilter] = useState('All');

  const jobs = [
    { id: 1, title: "Senior AI Engineer", dept: "Engineering", type: "Remote", location: "Global" },
    { id: 2, title: "Product Designer", dept: "Design", type: "Hybrid", location: "San Francisco" },
    { id: 3, title: "Career Coach Lead", dept: "Operations", type: "Full-time", location: "London" },
    { id: 4, title: "ATS Algorithm Researcher", dept: "Engineering", type: "Remote", location: "Global" },
    { id: 5, title: "Growth Marketer", dept: "Marketing", type: "Full-time", location: "New York" },
  ];

  const perks = [
    { icon: <Laptop size={24} />, title: "Remote First", desc: "Work from anywhere in the world." },
    { icon: <Heart size={24} />, title: "Wellness First", desc: "Premium health cover & mental health days." },
    { icon: <Coffee size={24} />, title: "Learning Budget", desc: "$2,000 yearly for your upskilling." },
    { icon: <Rocket size={24} />, title: "Equity", desc: "Own a piece of the future of hiring." },
  ];

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(j => j.dept === filter);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8"
          >
            <Zap size={16} fill="currentColor" /> <span>We are growing fast!</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          >
            Build the future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Human Capital.</span>
          </motion.h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            We’re looking for visionaries to help us bridge the gap between education, hiring, and philanthropy.
          </p>
        </div>
      </section>

      {/* Perks / Culture Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-indigo-600">
                {perk.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">{perk.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Job Board Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Open Roles</h2>
              <p className="text-slate-500 font-medium">Find your place in our global team.</p>
            </div>

            <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
              {['All', 'Engineering', 'Design', 'Marketing', 'Operations'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={job.id}
                className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{job.dept}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.type}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm font-medium">
                    <MapPin size={14} /> {job.location}
                  </div>
                </div>
                <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black group-hover:bg-indigo-600 transition-all">
                  Apply Now <ArrowRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No roles open in this department right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* Referral/General CTA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Don't see a fit?</h2>
          <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto">
            We’re always looking for exceptional talent. If you believe you can add value to our mission, drop your resume here.
          </p>
          <button className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black text-lg hover:bg-slate-900 hover:text-white transition-all shadow-2xl shadow-indigo-900/40">
            Submit General Application
          </button>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;