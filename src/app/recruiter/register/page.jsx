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
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Building2, User, Phone, MapPin, Briefcase, Mail, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RecruiterRegister() {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
    mobile: '', companyName: '', designation: '', location: '', otp: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // OTP વેરીફાય સ્ટેટસ
  const [verifying, setVerifying] = useState(false); // વેરીફાય બટન માટે લોડિંગ
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- OTP મોકલવાનું ફંક્શન ---
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

  // --- OTP વેરીફાય કરવાનું બટન લોજિક ---
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

  // --- ફાઈનલ સબમિટ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return setError("Please verify your email first!");
    
    setLoading(true); setError(''); setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false); return;
    }

    try {
      const regRes = await fetch('/api/recruiter/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...formData }),
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

            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">01. Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><User className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Full Name"/></div>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Username"/>
                
                {/* Email Field with Send Button */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                    <input type="email" name="email" required disabled={isVerified} value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Work Email"/>
                  </div>
                  <button type="button" onClick={sendOTP} disabled={loading || isVerified} className="px-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:bg-slate-300">
                    {loading && !otpSent ? "..." : otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>

                {/* OTP Field with Verify Button */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                    <input type="text" name="otp" required disabled={isVerified} value={formData.otp} onChange={handleChange} className={`w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 font-bold text-sm ${isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-2 border-indigo-50 focus:ring-indigo-500'}`} placeholder="Verification Code"/>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleVerifyOTP} 
                    disabled={verifying || isVerified || !otpSent} 
                    className={`px-4 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${isVerified ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-900 text-white hover:bg-black disabled:bg-slate-300'}`}
                  >
                    {verifying ? "..." : isVerified ? <><CheckCircle2 size={16}/> Verified</> : "Verify"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">02. Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><Building2 className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Company Name"/></div>
                <div className="relative"><Briefcase className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="designation" required value={formData.designation} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Designation"/></div>
                <div className="relative"><Phone className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Mobile Number"/></div>
                <div className="relative"><MapPin className="absolute left-4 top-3.5 text-slate-400" size={18}/><input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Location"/></div>
              </div>
            </div>

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

            <button 
              type="submit" 
              disabled={loading || !isVerified} 
              className={`w-full py-5 rounded-[22px] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${isVerified ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {loading ? "Registering..." : "Create Account"} <ArrowRight size={20}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}