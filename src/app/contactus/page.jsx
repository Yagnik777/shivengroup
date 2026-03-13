"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ShieldCheck, RefreshCw, Loader2, MessageSquare } from 'lucide-react'; 

const ContactPage = () => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "", // Added mobile field
    subject: "General Inquiry",
    message: ""
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter email first");
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "send-otp", email })
      });
      if (res.ok) {
        setShowOtpField(true);
        setTimer(60);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "verify-otp", email, otp })
      });
      if (res.ok) {
        setIsEmailVerified(true);
        setShowOtpField(false);
      } else {
        const data = await res.json();
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      alert("Verification error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "submit-form", email, formData })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Submission failed");
        setLoading(false);
        return;
      }
      alert("Message sent successfully!");
      setFormData({ name: "", mobile: "", subject: "General Inquiry", message: "" });
      setEmail("");
      setIsEmailVerified(false);
    } catch (err) {
      alert("Submission error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold tracking-wide uppercase"
          >
            Contact Support
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Conversation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Have a question or just want to say hi? We'd love to hear from you. 
            Fill out the form below and our team will get back to you shortly.
          </motion.p>
        </div>

        <div className="flex justify-center items-center relative">
          {/* Decorative background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative z-10"
          >
            <form onSubmit={handleSubmitForm} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2.5">
                  <label htmlFor="fullNameId" className="text-sm font-bold text-slate-700 ml-2">Full Name</label>
                  <input 
                    id="fullNameId"
                    type="text" 
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-slate-700 ml-2">Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter mobile number"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="md:col-span-2 space-y-2.5">
                  <label className="text-sm font-bold text-slate-700 ml-2">Email Address</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isEmailVerified || loading}
                      className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all ${isEmailVerified ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700 font-semibold' : ''}`}
                    />
                    {!isEmailVerified && !showOtpField && (
                      <button 
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || !email}
                        className="absolute right-2.5 top-2.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 disabled:bg-slate-300 transition-all active:scale-95"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                      </button>
                    )}
                    {isEmailVerified && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-emerald-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-emerald-100">
                        <ShieldCheck size={16} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* OTP Section with Enhanced Animation */}
              <AnimatePresence>
                {showOtpField && !isEmailVerified && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-200 space-y-5 overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                          <ShieldCheck size={18} />
                        </div>
                        <label className="font-bold tracking-tight">Security Code</label>
                      </div>
                      {timer > 0 ? (
                        <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-md">
                          Resend in {timer}s
                        </div>
                      ) : (
                        <button type="button" onClick={handleSendOtp} className="text-xs font-bold hover:text-indigo-200 transition-colors flex items-center gap-1.5 underline underline-offset-4">
                          <RefreshCw size={12} /> Resend Code
                        </button>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 focus:bg-white focus:text-indigo-600 outline-none transition-all text-center text-2xl tracking-[0.4em] font-black placeholder:text-white/30"
                      />
                      <button 
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6 || loading}
                        className="px-8 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl disabled:opacity-50 active:scale-95 flex items-center justify-center"
                      >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : "Confirm"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-2">Subject</label>
                <div className="relative">
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Recruiter Support</option>
                    <option>Candidate Help</option>
                    <option>Partnership</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <MessageSquare size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-2">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="How can we help you today?"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              <div className="pt-4">
                <motion.button 
                  whileHover={isEmailVerified ? { scale: 1.02 } : {}}
                  whileTap={isEmailVerified ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={!isEmailVerified || loading}
                  className={`w-full py-5 font-extrabold rounded-2xl shadow-2xl transition-all flex items-center justify-center space-x-3 group relative overflow-hidden ${isEmailVerified ? 'bg-slate-900 text-white shadow-indigo-200 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  <span className="relative z-10 text-lg">{loading ? "Sending..." : "Send Message"}</span>
                  {!loading && <Send size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  {isEmailVerified && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                </motion.button>
                
                {!isEmailVerified && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mt-5">
                    <div className="h-px w-8 bg-slate-200"></div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                      Verify Email to unlock
                    </p>
                    <div className="h-px w-8 bg-slate-200"></div>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;