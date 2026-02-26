"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/Navbar';
import { 
  Eye, EyeOff, User, Phone, MapPin, Briefcase, Mail, 
  KeyRound, ArrowRight, GraduationCap, 
  FileText, Hash, Upload, CheckCircle 
} from 'lucide-react';

export default function SPRegister() {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
    mobile: '', providerName: '', serviceCategory: 'Interview Prep', location: '', 
    otp: '', gstNumber: '', aadharNumber: '', panNumber: ''
  });

  // Files State
  const [files, setFiles] = useState({
    aadharFile: null,
    panFile: null,
    gstFile: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Handle File Change (Same as Recruiter) ---
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFiles(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  // --- Send OTP ---
  const sendOTP = async () => {
    if (!formData.email) return setError("Please enter email first");
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/serviceprovider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email: formData.email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOtpSent(true);
      setSuccess("OTP sent successfully to your email!");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // --- Verify OTP ---
  const handleVerifyOTP = async () => {
    if (!formData.otp) return setError("Please enter OTP code");
    setVerifying(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/serviceprovider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', email: formData.email, otp: formData.otp }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIsVerified(true);
      setSuccess("Email verified successfully!");
    } catch (err) { setError(err.message); }
    finally { setVerifying(false); }
  };

  // --- Final Submit with File Support ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return setError("Please verify your email first!");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");
    if (!files.aadharFile || !files.panFile) return setError("Aadhar and PAN card files are required!");

    setLoading(true); setError('');
    
    try {
      // Create FormData to handle files + text
      const dataToSend = new FormData();
      dataToSend.append('action', 'register');
      
      // Append all text fields
      Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
      
      // Append files
      if (files.aadharFile) dataToSend.append('aadharFile', files.aadharFile);
      if (files.panFile) dataToSend.append('panFile', files.panFile);
      if (files.gstFile) dataToSend.append('gstFile', files.gstFile);

      const res = await fetch('/api/serviceprovider/register', {
        method: 'POST',
        body: dataToSend, // Sending FormData instead of JSON
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess("Registration successful! Admin will verify your documents soon.");
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100">
          <div className="p-8 md:p-16">
            
            <div className="mb-12 text-center">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Expert Network</span>
              <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Service Provider Signup</h1>
              <p className="text-slate-500 mt-2 font-medium">Join us to help candidates achieve their career goals</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 text-center animate-shake">{error}</div>}
              {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold border border-emerald-100 text-center">{success}</div>}

              {/* Step 01: Account Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">01</div>
                  <h3 className="text-lg font-black text-slate-800">Account Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-slate-400" size={20}/>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all" placeholder="Your Full Name"/>
                  </div>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-4 text-slate-400" size={20}/>
                    <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all" placeholder="Choose Username"/>
                  </div>
                  <div className="flex gap-3">
                    <input type="email" name="email" required disabled={isVerified} value={formData.email} onChange={handleChange} className="flex-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all disabled:opacity-60" placeholder="Email Address"/>
                    <button type="button" onClick={sendOTP} disabled={loading || isVerified} className="px-6 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-lg">SEND</button>
                  </div>
                  <div className="flex gap-3">
                    <input type="text" name="otp" required disabled={isVerified} value={formData.otp} onChange={handleChange} className="flex-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none font-bold text-sm transition-all" placeholder="Enter OTP"/>
                    <button type="button" onClick={handleVerifyOTP} disabled={verifying || isVerified || !otpSent} className={`px-6 rounded-2xl font-black text-xs transition-all ${isVerified ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>VERIFY</button>
                  </div>
                </div>
              </div>

              {/* Step 02: Business Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">02</div>
                  <h3 className="text-lg font-black text-slate-800">Business & Verification</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" name="providerName" required value={formData.providerName} onChange={handleChange} className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-sm" placeholder="Agency or Individual Name"/>
                  <select name="serviceCategory" value={formData.serviceCategory} onChange={handleChange} className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-sm">
                    <option>Interview Prep</option>
                    <option>Resume Writing</option>
                    <option>Career Counseling</option>
                    <option>Soft Skills Training</option>
                  </select>
                  <input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-sm" placeholder="Mobile Number"/>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-sm" placeholder="Business Location"/>
                </div>

                {/* --- File Upload Section (Same as Recruiter) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Aadhar Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Aadhar Card *</label>
                    <div className="relative group cursor-pointer">
                      <input type="file" name="aadharFile" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${files.aadharFile ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-indigo-400'}`}>
                        {files.aadharFile ? <CheckCircle className="text-emerald-500" size={24}/> : <Upload className="text-slate-400" size={24}/>}
                        <span className="text-[10px] font-black text-slate-500">{files.aadharFile ? "AADHAR ATTACHED" : "UPLOAD AADHAR"}</span>
                      </div>
                    </div>
                  </div>

                  {/* PAN Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">PAN Card *</label>
                    <div className="relative group cursor-pointer">
                      <input type="file" name="panFile" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${files.panFile ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-indigo-400'}`}>
                        {files.panFile ? <CheckCircle className="text-emerald-500" size={24}/> : <Upload className="text-slate-400" size={24}/>}
                        <span className="text-[10px] font-black text-slate-500">{files.panFile ? "PAN ATTACHED" : "UPLOAD PAN"}</span>
                      </div>
                    </div>
                  </div>

                  {/* GST Upload (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">GST (Optional)</label>
                    <div className="relative group cursor-pointer">
                      <input type="file" name="gstFile" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${files.gstFile ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-indigo-400'}`}>
                        {files.gstFile ? <CheckCircle className="text-emerald-500" size={24}/> : <Upload className="text-slate-400" size={24}/>}
                        <span className="text-[10px] font-black text-slate-500">{files.gstFile ? "GST ATTACHED" : "UPLOAD GST"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                   <input type="text" name="aadharNumber" required value={formData.aadharNumber} onChange={handleChange} className="w-full px-4 py-4 bg-white border-2 border-indigo-50 focus:border-indigo-500 rounded-2xl font-bold text-sm" placeholder="Aadhar Number"/>
                   <input type="text" name="panNumber" required value={formData.panNumber} onChange={handleChange} className="w-full px-4 py-4 bg-white border-2 border-indigo-50 focus:border-indigo-500 rounded-2xl font-bold text-sm" placeholder="PAN Card Number"/>
                   <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full px-4 py-4 bg-white border-2 border-indigo-50 focus:border-indigo-500 rounded-2xl font-bold text-sm" placeholder="GST (Optional)"/>
                </div>
              </div>

              {/* Step 03: Security */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">03</div>
                  <h3 className="text-lg font-black text-slate-800">Security</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full pl-4 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-sm outline-none" placeholder="Create Password"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-sm outline-none" placeholder="Confirm Password"/>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !isVerified} 
                className={`w-full py-5 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl ${isVerified ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {loading ? "Registering..." : "Create Expert Profile"} <ArrowRight size={22}/>
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 font-bold text-sm">
              Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}