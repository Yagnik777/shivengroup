"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Users, Gift, Sparkles, ArrowRight } from 'lucide-react';

const PhilanthropySection = () => {
  const impactStats = [
    { label: "Free Courses", value: "12,000+", icon: <Gift className="text-pink-500" /> },
    { label: "Rural Placements", value: "850+", icon: <Globe className="text-blue-500" /> },
    { label: "Scholarships", value: "$250k", icon: <Sparkles className="text-amber-500" /> },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Visual & Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000" 
                alt="Education Impact" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -right-6 md:right-10 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white max-w-xs"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                  <Heart size={20} fill="currentColor" />
                </div>
                <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Our Mission</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "We believe every talent deserves a chance, regardless of their background or bank balance."
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side: Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-sm mb-4">Philanthropy</h4>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Beyond Business. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-600">Building Futures.</span>
              </h2>
            </motion.div>

            <p className="text-slate-500 text-lg leading-relaxed">
              At our core, we are more than just a job portal. We dedicate 5% of our platform's resources to provide 
              **free ATS-friendly resumes**, **mock interview training**, and **upskilling workshops** to students from 
              underrepresented communities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              {impactStats.map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</div>
                </div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all group"
            >
              Support Our Cause <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PhilanthropySection;