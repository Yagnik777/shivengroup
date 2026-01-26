"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    designation: '',
    companyWebsite: '',
    gstNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // અહીં તમારું રિક્રુટર રજીસ્ટ્રેશન API લોજિક આવશે
    console.log("Recruiter Data:", formData);
    
    setSuccess("Recruiter account created successfully!");
    setLoading(false);
    // setTimeout(() => router.push('/recruiter/dashboard'), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-2xl shadow-indigo-100 rounded-[40px] p-8 md:p-12 border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Recruiter Registration</h1>
          <p className="text-slate-500 mt-2 font-medium">Create an employer account to start hiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-center text-sm font-bold">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl text-center text-sm font-bold">{success}</div>}

          {/* Section: Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase ml-1">Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="Manager Name" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase ml-1">Work Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="hr@company.com" />
            </div>
          </div>

          {/* Section: Company Details */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-indigo-600 font-bold text-sm mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Company Name</label>
                <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Tech Solutions" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Industry</label>
                <select name="industry" required value={formData.industry} onChange={handleChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select Industry</option>
                  <option value="IT">IT & Software</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Company Website</label>
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://www.company.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">GST/Tax ID (Optional)</label>
                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="GSTIN123456" />
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div className="pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Password</label>
                <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-slate-400">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Confirm Password</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-4">
            {loading ? "Creating Account..." : "Register as Recruiter"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Already have an employer account?{" "}
          <button onClick={() => router.push("/login")} className="text-indigo-600 font-bold hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}