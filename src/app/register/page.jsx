"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  // 🔥 OTP States
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const router = useRouter();

  // -------------------------------------
  // SEND OTP FUNCTION
  // -------------------------------------
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

  // -------------------------------------
  // VERIFY OTP FUNCTION
  // -------------------------------------
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

  // -------------------------------------
  // SUBMIT FORM
  // -------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otpVerified) return setError("Please verify your email first.");

    if (!name.trim()) return setError("Full name is required");
    if (!email.includes("@")) return setError("Enter valid email address");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (!acceptedTerms)
      return setError("You must accept Terms & Conditions and Privacy Policy");

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

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Sign Up
//         </h1>

//         {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
//         {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}

//         {/* NAME */}
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Full Name</label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border rounded-lg"
//             placeholder="John Doe"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         {/* EMAIL + OTP SECTION */}
//         {/* EMAIL + OTP SECTION */}
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Email</label>
          
//           <div className="flex gap-2">
//             <input
//               type="email"
//               disabled={otpSent || otpVerified} // disable input if OTP sent or verified
//               className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-200"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
        
//             {!otpVerified && (
//               <button
//                 type="button"
//                 onClick={sendOtp}
//                 disabled={sendingOtp}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 {sendingOtp ? "Sending..." : otpSent ? "Resend" : "Send Code"}
//               </button>
//             )}
//           </div>
//         </div>


//         {/* OTP INPUT */}
//         {otpSent && !otpVerified && (
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1">Enter OTP</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 placeholder="123456"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />

//               <button
//                 type="button"
//                 onClick={verifyOtp}
//                 disabled={verifyingOtp}
//                 className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 {verifyingOtp ? "Verifying..." : "Verify"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Verified Badge */}
//         {otpVerified && (
//           <p className="text-green-600 font-semibold mb-2">✔ Email Verified</p>
//         )}

//         {/* PASSWORD */}
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Password</label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="w-full px-4 py-2 border rounded-lg pr-10"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
        
//             {/* Eye Icon */}
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </span>
//           </div>
//         </div>
              

//         {/* CONFIRM PASSWORD */}
//         <div className="mb-6">
//           <label className="block text-gray-700 mb-1">Confirm Password</label>
//           <input
//             type="password"
//             className="w-full px-4 py-2 border rounded-lg"
//             placeholder="Re-enter password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//         </div>

//         {/* TERMS & PRIVACY CHECKBOX */}
//         <label className="flex items-start gap-2 mb-4">
//           <input
//             type="checkbox"
//             checked={acceptedTerms}
//             onChange={(e) => setAcceptedTerms(e.target.checked)}
//             className="mt-1"
//           />
//           <div className="text-sm text-gray-700">
//             I accept the{" "}
//             <span
//               className="text-blue-600 underline cursor-pointer"
//               onClick={() => setShowTerms(true)}
//             >
//               Terms & Conditions
//             </span>{" "}
//             and{" "}
//             <span
//               className="text-blue-600 underline cursor-pointer"
//               onClick={() => setShowPrivacy(true)}
//             >
//               Privacy Policy
//             </span>
//           </div>
//         </label>

//         {/* TERMS MODAL */}
//         {showTerms && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg w-11/12 max-w-xl shadow-lg">
//               <h2 className="text-xl font-bold mb-3">Terms & Conditions</h2>
//               <p className="text-gray-700 text-sm h-64 overflow-y-auto">
//                 <strong>1. Acceptance of Terms</strong><br />
//                 By accessing or using this website, you agree to follow and be bound by these Terms & Conditions. If you do not agree, please do not use the website.
        
//                 <br /><br />
//                 <strong>2. Accuracy of Information</strong><br />
//                 You agree to provide accurate, complete, and up-to-date information while submitting any form or application on this website.
        
//                 <br /><br />
//                 <strong>3. Use of Website</strong><br />
//                 You must not use this website for any illegal, harmful, or unauthorized activities. Any misuse of the platform may result in restricted access.
        
//                 <br /><br />
//                 <strong>4. Intellectual Property</strong><br />
//                 All content, logos, and material displayed on this site are owned by us. You must not copy, distribute, or use them without written permission.
        
//                 <br /><br />
//                 <strong>5. Third-Party Links</strong><br />
//                 Our website may contain external links. We are not responsible for the content, privacy, or security of third-party websites.
        
//                 <br /><br />
//                 <strong>6. Limitation of Liability</strong><br />
//                 We are not responsible for any direct, indirect, or incidental damages arising from the use of this website.
        
//                 <br /><br />
//                 <strong>7. Changes to Terms</strong><br />
//                 We may update these Terms at any time. Continued use of the website means you accept the updated Terms.
        
//                 <br /><br />
//                 <strong>8. Contact Us</strong><br />
//                 If you have any questions about these Terms & Conditions, you can contact us directly through our website.
//               </p>
        
//               <button
//                 onClick={() => setShowTerms(false)}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* PRIVACY MODAL */}
//         {showPrivacy && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg w-11/12 max-w-xl shadow-lg">
//               <h2 className="text-xl font-bold mb-3">Privacy Policy</h2>
//               <p className="text-gray-700 text-sm h-64 overflow-y-auto">
//                 <strong>1. Data Protection & Security</strong><br />
//                 We take your privacy seriously. All personal information you submit on this website is securely stored, encrypted, and protected from unauthorized access.
        
//                 <br /><br />
//                 <strong>2. No Third-Party Sharing</strong><br />
//                 Your personal data, including your name, email, phone number, resume, or any other information, will NEVER be shared, sold, or rented to any third party.
        
//                 <br /><br />
//                 <strong>3. Purpose of Data Collection</strong><br />
//                 We collect your information only for:
//                 <ul className="list-disc ml-5">
//                   <li>Processing job applications</li>
//                   <li>Contacting you regarding your application</li>
//                   <li>Improving website experience and services</li>
//                 </ul>
        
//                 <br />
//                 <strong>4. Data Storage & Access</strong><br />
//                 Your data is stored securely on our servers. Only authorized team members can access your information for legitimate purposes.
        
//                 <br /><br />
//                 <strong>5. Cookies & Tracking</strong><br />
//                 We may use basic cookies to improve website performance. No sensitive personal data is stored in cookies.
        
//                 <br /><br />
//                 <strong>6. User Rights</strong><br />
//                 You have the right to request:
//                 <ul className="list-disc ml-5">
//                   <li>Access to your data</li>
//                   <li>Correction of incorrect information</li>
//                   <li>Deletion of your data from our system</li>
//                 </ul>
        
//                 <br /><br />
//                 <strong>7. Protection Against Unauthorized Access</strong><br />
//                 We use strong security protocols to ensure your data remains private and protected from hacking or misuse.
        
//                 <br /><br />
//                 <strong>8. Policy Updates</strong><br />
//                 We may update this Privacy Policy when required. Any changes will be posted on this page.
        
//                 <br /><br />
//                 <strong>9. Contact Us</strong><br />
//                 If you have any privacy-related concerns, you can contact us anytime through our website.
//               </p>
        
//               <button
//                 onClick={() => setShowPrivacy(false)}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}


//         {/* SUBMIT BUTTON */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
//             loading ? "bg-blue-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "Creating account..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// }

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

      <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">
        Create Account
      </h1>
      <p className="text-slate-500 text-center text-sm mb-8 font-medium">
        Join JobConnect Pro today
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-600 p-3 rounded-xl text-center text-sm font-semibold">
            {success}
          </div>
        )}

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl 
            focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL + OTP SECTION */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Email Address</label>
          <div className="flex gap-2">
            <input
              type="email"
              disabled={otpSent || otpVerified}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl disabled:bg-slate-200 disabled:text-slate-500
              focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!otpVerified && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={sendingOtp}
                className="px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm whitespace-nowrap"
              >
                {sendingOtp ? "..." : otpSent ? "Resend" : "Send Code"}
              </button>
            )}
          </div>
        </div>

        {/* OTP INPUT */}
        {otpSent && !otpVerified && (
          <div className="mb-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <label className="block text-sm font-bold text-indigo-700 mb-1">Enter OTP Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={verifyingOtp}
                className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm"
              >
                {verifyingOtp ? "..." : "Verify"}
              </button>
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {otpVerified && (
          <p className="text-emerald-600 text-sm font-bold mb-4 flex items-center gap-1 ml-1">
            <span className="bg-emerald-100 p-0.5 rounded-full">✔</span> Email Verified Successfully
          </p>
        )}

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl pr-12
              focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors text-xl"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl
            focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* TERMS & PRIVACY */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer group">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div className="text-sm text-slate-600 font-medium leading-tight">
            I accept the{" "}
            <span className="text-indigo-600 font-bold hover:underline" onClick={(e) => {e.preventDefault(); setShowTerms(true)}}>
              Terms
            </span> & <span className="text-indigo-600 font-bold hover:underline" onClick={(e) => {e.preventDefault(); setShowPrivacy(true)}}>
              Privacy Policy
            </span>
          </div>
        </label>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all active:scale-[0.98] ${
            loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* MODALS (Terms & Privacy) */}
      {(showTerms || showPrivacy) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-[32px] w-full max-w-xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
              {showTerms ? "Terms & Conditions" : "Privacy Policy"}
            </h2>
            <div className="text-slate-600 text-sm h-80 overflow-y-auto pr-2 custom-scrollbar leading-relaxed">
              {showTerms ? (
                <>
                  <p><strong>1. Acceptance of Terms</strong><br />By accessing or using this website, you agree to follow and be bound by these Terms & Conditions...</p>
                  {/* ... બાકીનું લખાણ ... */}
                </>
              ) : (
                <>
                  <p><strong>1. Data Protection & Security</strong><br />We take your privacy seriously. All personal information is securely stored...</p>
                  {/* ... બાકીનું લખાણ ... */}
                </>
              )}
            </div>
            <button
              onClick={() => { setShowTerms(false); setShowPrivacy(false); }}
              className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}