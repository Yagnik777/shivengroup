"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react'; // Optional: npm i lucide-react
import UserSidebar from '@/components/UserSidebar';


const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4"
          >
            Get in <span className="text-indigo-600">Touch</span>
          </motion.h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Have questions about our platform? Whether you're a recruiter, candidate, or service provider, our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Us</h3>
                    <p className="text-slate-500 text-sm">support@yourplatform.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Call Us</h3>
                    <p className="text-slate-500 text-sm">+1 (555) 000-0000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Office</h3>
                    <p className="text-slate-500 text-sm">123 Tech Avenue, <br/>Innovation City, CA</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Follow Our Updates</h4>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                    <div key={social} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-indigo-600 hover:text-white transition-all" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                  <option>General Inquiry</option>
                  <option>Recruiter Support</option>
                  <option>Candidate Help</option>
                  <option>Service Provider Partnership</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                <textarea 
                  rows="5" 
                  placeholder="How can we help you today?"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button className="w-full md:w-max px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2 group">
                  <span>Send Message</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;