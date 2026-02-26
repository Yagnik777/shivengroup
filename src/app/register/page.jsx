"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Link ઈમ્પોર્ટ કર્યું

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP States
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // SEND OTP FUNCTION
  const sendOtp = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email first");
      return;
    }
    setError("");
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email }),
      });
      const data = await res.json();
      setSendingOtp(false);
      if (!res.ok) return setError(data.error || "Failed to send OTP");
      setOtpSent(true);
      setSuccess("OTP sent to your email!");
    } catch (err) {
      setSendingOtp(false);
      setError("Something went wrong sending OTP.");
    }
  };

  // VERIFY OTP FUNCTION
  const verifyOtp = async () => {
    if (!otp.trim()) return setError("Enter the OTP");
    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", email, otp }),
      });
      const data = await res.json();
      setVerifyingOtp(false);
      if (!res.ok) return setError(data.error || "Invalid OTP");
      setOtpVerified(true);
      setSuccess("🎉 Email verified successfully!");
    } catch (err) {
      setVerifyingOtp(false);
      setError("Error verifying OTP.");
    }
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otpVerified) return setError("Please verify your email first.");
    if (!name.trim()) return setError("Full name is required");
    if (!email.includes("@")) return setError("Enter valid email address");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (!acceptedTerms) return setError("You must accept Terms & Conditions");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name,
          email,
          password,
          acceptedTerms,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || "Registration failed");
      setSuccess("🎉 Registration successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setLoading(false);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white shadow-2xl shadow-indigo-100 rounded-[32px] p-8 border border-slate-100">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Create Account</h1>
        <p className="text-slate-500 text-center text-sm mb-8 font-medium">Join as a <span className="text-indigo-600 font-bold">Candidate</span> today</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-semibold">{error}</div>}
          {success && <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-600 p-3 rounded-xl text-center text-sm font-semibold">{success}</div>}

          {/* NAME */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Full Name</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* EMAIL + OTP */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Email Address</label>
            <div className="flex gap-2">
              <input type="email" disabled={otpSent || otpVerified} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl disabled:bg-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {!otpVerified && (
                <button type="button" onClick={sendOtp} disabled={sendingOtp} className="px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-xs whitespace-nowrap">
                  {sendingOtp ? "..." : otpSent ? "Resend" : "Send Code"}
                </button>
              )}
            </div>
          </div>

          {/* OTP INPUT */}
          {otpSent && !otpVerified && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <label className="block text-sm font-bold text-indigo-700 mb-1">Enter Code</label>
              <div className="flex gap-2">
                <input type="text" className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button type="button" onClick={verifyOtp} disabled={verifyingOtp} className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm">
                  {verifyingOtp ? "..." : "Verify"}
                </button>
              </div>
            </div>
          )}

          {otpVerified && <p className="text-emerald-600 text-sm font-bold mb-4 flex items-center gap-1 ml-1">✔ Email Verified Successfully</p>}

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl pr-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-indigo-600 text-xl">{showPassword ? "🙈" : "👁️"}</span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Confirm Password</label>
            <input type="password" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {/* TERMS */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <div className="text-sm text-slate-600 font-medium leading-tight">
              I accept the <span className="text-indigo-600 font-bold hover:underline" onClick={(e) => {e.preventDefault(); setShowTerms(true)}}>Terms</span> & <span className="text-indigo-600 font-bold hover:underline" onClick={(e) => {e.preventDefault(); setShowPrivacy(true)}}>Privacy Policy</span>
            </div>
          </label>

          <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all active:scale-[0.98] ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"}`}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* --- NEW SECTION: RECRUITER & SERVICE PROVIDER LINKS --- */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Not a Candidate?</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/recruiter/register" className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
              <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🏢</span>
              <span className="text-[10px] font-black text-slate-700 uppercase">Recruiter</span>
            </Link>
            <Link href="/serviceprovider/register" className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
              <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🛠️</span>
              <span className="text-[10px] font-black text-slate-700 uppercase">Provider</span>
            </Link>
          </div>
        </div>
        {/* -------------------------------------------------------- */}

      </div>

      {/* Modals for Terms & Privacy */}
      {(showTerms || showPrivacy) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-xl shadow-2xl border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{showTerms ? "Terms & Conditions" : "Privacy Policy"}</h2>
            <div className="text-slate-600 text-sm h-80 overflow-y-auto pr-2 leading-relaxed">
              {showTerms ? <p><strong>1. Acceptance of Terms</strong><br />Terms content here...</p> : <p><strong>1. Data Protection</strong><br />Privacy content here...</p>}
            </div>
            <button onClick={() => { setShowTerms(false); setShowPrivacy(false); }} className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}