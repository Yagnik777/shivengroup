// "use client";
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Eye, EyeOff, Building2, User, Phone, MapPin, Briefcase, Mail, KeyRound, ArrowRight } from 'lucide-react';

// export default function RecruiterRegister() {
//   const [formData, setFormData] = useState({
//     fullName: '', username: '', email: '', password: '', confirmPassword: '',
//     mobile: '', companyName: '', designation: '', location: '', otp: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const router = useRouter();

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const sendOTP = async () => {
//     if (!formData.email) return setError("Please enter email first");
//     setLoading(true); setError('');
//     try {
//       const res = await fetch('/api/recruiter/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ action: 'send-otp', email: formData.email }),
//       });
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);
//       setOtpSent(true);
//       setSuccess("OTP sent successfully!");
//     } catch (err) { setError(err.message); }
//     finally { setLoading(false); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match!");
//       setLoading(false); return;
//     }

//     try {
//       // Step 1: Verify
//       const verifyRes = await fetch('/api/recruiter/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ action: 'verify-otp', email: formData.email, otp: formData.otp }),
//       });
//       const vData = await verifyRes.json();
//       if (vData.error) throw new Error(vData.error);

//       // Step 2: Register
//       const regRes = await fetch('/api/recruiter/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ action: 'register', ...formData }),
//       });
//       const rData = await regRes.json();
//       if (rData.error) throw new Error(rData.error);

//       setSuccess("Registration successful! Redirecting...");
//       setTimeout(() => router.push('/login'), 2000);
//     } catch (err) { setError(err.message); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
//       <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[32px] overflow-hidden border border-slate-100">
//         <div className="p-8 md:p-14">
//           <div className="mb-10 text-center md:text-left">
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruiter Signup</h1>
//             <p className="text-slate-500 font-medium">Create your company profile to start hiring</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">{error}</div>}
//             {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-bold border border-emerald-100 text-center">{success}</div>}

//             {/* Account Details */}
//             <div className="space-y-4">
//               <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">01. Account Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative"><User className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Full Name"/></div>
//                 <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Username"/>
//                 <div className="flex gap-2"><div className="relative flex-1"><Mail className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Work Email"/></div><button type="button" onClick={sendOTP} className="px-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all">{otpSent ? "Resend" : "Send"}</button></div>
//                 <div className="relative"><KeyRound className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="otp" required value={formData.otp} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-indigo-50 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm" placeholder="Verification Code"/></div>
//               </div>
//             </div>

//             {/* Company Details */}
//             <div className="space-y-4">
//               <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">02. Company Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative"><Building2 className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Company Name"/></div>
//                 <div className="relative"><Briefcase className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="designation" required value={formData.designation} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Designation"/></div>
//                 <div className="relative"><Phone className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Mobile Number"/></div>
//                 <div className="relative"><MapPin className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Location"/></div>
//               </div>
//             </div>

//             {/* Security */}
//             <div className="space-y-4">
//               <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">03. Security</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative"><input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
//                 <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Confirm Password"/>
//               </div>
//             </div>

//             <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[22px] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2">
//               {loading ? "Please wait..." : "Create Account"} <ArrowRight size={20}/>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
//src/app/recruiter/register/page.jsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Building2, User, Phone, MapPin, Briefcase, Mail, KeyRound, ArrowRight, CheckCircle2, FileText, UploadCloud, CreditCard } from 'lucide-react';

export default function RecruiterRegister() {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
    mobile: '', companyName: '', designation: '', location: '', otp: '',
    gstNumber: '', aadharNumber: '', panNumber: '', registrationType: 'company'
  });

  const [gstDoc, setGstDoc] = useState(null);
  const [licenseDoc, setLicenseDoc] = useState(null);
  const [aadharDoc, setAadharDoc] = useState(null);
  const [panDoc, setPanDoc] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const sendOTP = async () => {
    if (!formData.email) return setError("Please enter email first");
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/recruiter/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email: formData.email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOtpSent(true);
      setSuccess("OTP sent successfully!");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) return setError("Please enter OTP code");
    setVerifying(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/recruiter/register', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return setError("Please verify your email first!");
    
    // વેલિડેશન ચેક
    if (formData.registrationType === 'company') {
      if (!gstDoc || !licenseDoc) return setError("Please upload GST and License documents!");
    } else {
      if (!aadharDoc || !panDoc) return setError("Please upload Aadhar and PAN documents!");
    }

    setLoading(true); setError(''); setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false); return;
    }

    try {
      const finalData = new FormData();
      Object.keys(formData).forEach(key => finalData.append(key, formData[key]));
      
      if (formData.registrationType === 'company') {
        finalData.append('gstDocument', gstDoc);
        finalData.append('businessLicense', licenseDoc);
      } else {
        finalData.append('aadharDocument', aadharDoc);
        finalData.append('panDocument', panDoc);
      }
      
      finalData.append('action', 'register');

      const regRes = await fetch('/api/recruiter/register', {
        method: 'POST',
        body: finalData,
      });
      
      const rData = await regRes.json();
      if (rData.error) throw new Error(rData.error);

      setSuccess("Account created! Redirecting...");
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[32px] overflow-hidden border border-slate-100">
        <div className="p-8 md:p-14">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruiter Signup</h1>
            <p className="text-slate-500 font-medium">Join us to find the best talent</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">{error}</div>}
            {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-bold border border-emerald-100 text-center">{success}</div>}

            {/* 01. Account Details */}
            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">01. Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><User className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Full Name"/></div>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Username"/>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                    <input type="email" name="email" required disabled={isVerified} value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Work Email"/>
                  </div>
                  <button type="button" onClick={sendOTP} disabled={loading || isVerified} className="px-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:bg-slate-300">
                    {loading && !otpSent ? "..." : otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                    <input type="text" name="otp" required disabled={isVerified} value={formData.otp} onChange={handleChange} className={`w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 font-bold text-sm ${isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-2 border-indigo-50 focus:ring-indigo-500'}`} placeholder="Verification Code"/>
                  </div>
                  <button type="button" onClick={handleVerifyOTP} disabled={verifying || isVerified || !otpSent} className={`px-4 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${isVerified ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-900 text-white hover:bg-black disabled:bg-slate-300'}`}>
                    {verifying ? "..." : isVerified ? <><CheckCircle2 size={16}/> Verified</> : "Verify"}
                  </button>
                </div>
              </div>
            </div>

            {/* 02. Verification Type Toggle */}
            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">02. Company & Verification</h3>
              <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl mb-6">
                <button type="button" onClick={() => setFormData({...formData, registrationType: 'company'})} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.registrationType === 'company' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Company (GST)</button>
                <button type="button" onClick={() => setFormData({...formData, registrationType: 'individual'})} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.registrationType === 'individual' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Individual (Aadhar/PAN)</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><Building2 className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Company Name"/></div>
                
                {formData.registrationType === 'company' ? (
                  <div className="relative"><FileText className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="gstNumber" required value={formData.gstNumber} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="GST Number"/></div>
                ) : (
                  <>
                    <div className="relative"><CreditCard className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="aadharNumber" required value={formData.aadharNumber} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Aadhar Number"/></div>
                    <div className="relative"><FileText className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="panNumber" required value={formData.panNumber} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="PAN Number"/></div>
                  </>
                )}

                <div className="relative"><Briefcase className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="designation" required value={formData.designation} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Designation"/></div>
                <div className="relative"><Phone className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Mobile Number"/></div>
                <div className="relative md:col-span-2"><MapPin className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Company Location"/></div>
              </div>

              {/* Document Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {formData.registrationType === 'company' ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST Certificate</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                        {gstDoc ? <div className="flex flex-col items-center"><CheckCircle2 className="text-emerald-500 mb-1"/><span className="text-xs font-bold text-slate-600">{gstDoc.name}</span></div> : <div className="flex flex-col items-center"><UploadCloud className="text-slate-300 mb-1"/><span className="text-xs font-bold text-slate-400">Upload GST Doc</span></div>}
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, setGstDoc)} />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business License</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                        {licenseDoc ? <div className="flex flex-col items-center"><CheckCircle2 className="text-emerald-500 mb-1"/><span className="text-xs font-bold text-slate-600">{licenseDoc.name}</span></div> : <div className="flex flex-col items-center"><UploadCloud className="text-slate-300 mb-1"/><span className="text-xs font-bold text-slate-400">Upload License</span></div>}
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, setLicenseDoc)} />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aadhar Card</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                        {aadharDoc ? <div className="flex flex-col items-center"><CheckCircle2 className="text-emerald-500 mb-1"/><span className="text-xs font-bold text-slate-600">{aadharDoc.name}</span></div> : <div className="flex flex-col items-center"><UploadCloud className="text-slate-300 mb-1"/><span className="text-xs font-bold text-slate-400">Upload Aadhar</span></div>}
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, setAadharDoc)} />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAN Card</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                        {panDoc ? <div className="flex flex-col items-center"><CheckCircle2 className="text-emerald-500 mb-1"/><span className="text-xs font-bold text-slate-600">{panDoc.name}</span></div> : <div className="flex flex-col items-center"><UploadCloud className="text-slate-300 mb-1"/><span className="text-xs font-bold text-slate-400">Upload PAN Doc</span></div>}
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, setPanDoc)} />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 03. Security */}
            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">03. Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Password"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                </div>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Confirm Password"/>
              </div>
            </div>

            <button type="submit" disabled={loading || !isVerified} className={`w-full py-5 rounded-[22px] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${isVerified ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              {loading ? "Registering..." : "Create Account"} <ArrowRight size={20}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}