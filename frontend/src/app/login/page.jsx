// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // 👁️ added

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });

//       if (!res) {
//         setError("Unknown error");
//         setLoading(false);
//         return;
//       }

//       if (res.error) {
//         setError(res.error || "Invalid credentials");
//         setLoading(false);
//         return;
//       }

//       // Fetch session to get role
//       const sessionRes = await fetch("/api/auth/session");
//       const session = await sessionRes.json();
//       const role = session?.user?.role || "user";

//       if (role === "admin") {
//         router.replace("/admin/dashboard");
//       } else {
//         router.replace("/dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //       <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
// //         <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
// //           Login
// //         </h1>

// //         <form onSubmit={handleSubmit}>
// //           <label className="block mb-4">
// //             <span className="text-sm font-medium text-gray-700">Email</span>
// //             <input
// //               type="email"
// //               required
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg 
// //               focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //             />
// //           </label>

// //           <label className="block mb-4">
// //             <span className="text-sm font-medium text-gray-700">Password</span>

// //             <div className="relative">
// //               <input
// //                 type={showPassword ? "text" : "password"} // 👁️
// //                 required
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg pr-10
// //                 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //               />

// //               {/* Eye Icon */}
// //               <span
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="absolute right-3 top-3 cursor-pointer text-gray-600 text-lg"
// //               >
// //                 {showPassword ? "🙈" : "👁️"}
// //               </span>
// //             </div>
// //           </label>

// //           {error && (
// //             <div className="mb-4 text-red-600 text-center text-sm font-medium">
// //               {error}
// //             </div>
// //           )}

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-blue-600 hover:bg-blue-700 transition text-white 
// //             py-2 rounded-lg font-semibold shadow"
// //           >
// //             {loading ? "Signing in..." : "Sign in"}
// //           </button>
// //         </form>

// //         <p className="text-center text-gray-600 text-sm mt-6">
// //           No account?{" "}
// //           <span
// //             onClick={() => router.push("/register")}
// //             className="text-blue-600 font-medium cursor-pointer hover:underline"
// //           >
// //             Go to Register
// //           </span>
// //         </p>

// //         <p className="text-center mt-2">
// //           <a
// //             href="/forgot-password"
// //             className="text-blue-600 hover:underline text-sm"
// //           >
// //             Forgot your password?
// //           </a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // "use client";
// // import React, { useState } from 'react';
// // import { useRouter } from 'next/navigation';

// // export default function LoginPage() {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const router = useRouter();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');
// //     // તમારું login logic અહીં આવશે
// //     setLoading(false);
// //   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
//       <div className="w-full max-w-sm bg-white shadow-2xl shadow-indigo-100 rounded-[32px] p-10 border border-slate-100">
//         {/* Logo Section - Theme Match */}
//         <div className="flex justify-center mb-6">
//           <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
//             <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           </div>
//         </div>

//         <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">
//           Welcome Back
//         </h1>
//         <p className="text-slate-500 text-center text-sm mb-8 font-medium">
//           Login to your JobConnect Pro account
//         </p>

//         <form onSubmit={handleSubmit}>
//           <label className="block mb-5">
//             <span className="text-sm font-bold text-slate-700 ml-1">Email Address</span>
//             <input
//               type="email"
//               required
//               placeholder="name@company.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl 
//               focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
//             />
//           </label>

//           <label className="block mb-2">
//             <span className="text-sm font-bold text-slate-700 ml-1">Password</span>
//             <div className="relative mt-2">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 required
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl pr-12
//                 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
//               />
//               {/* Eye Icon Button */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-600 transition-colors"
//               >
//                 {showPassword ? (
//                   <span className="text-xl">🙈</span>
//                 ) : (
//                   <span className="text-xl">👁️</span>
//                 )}
//               </button>
//             </div>
//           </label>

//           {/* Forgot Password Right Aligned */}
//           <div className="text-right mb-6">
//             <a href="/forgot-password" title="Forgot Password"
//               className="text-indigo-600 hover:text-indigo-700 font-bold text-xs transition-colors">
//               Forgot password?
//             </a>
//           </div>

//           {error && (
//             <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-semibold">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white 
//             py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 text-lg"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Signing in...
//               </span>
//             ) : "Sign In"}
//           </button>
//         </form>

//         <p className="text-center text-slate-500 text-sm mt-8">
//           Don't have an account?{" "}
//           <button
//             onClick={() => router.push("/register")}
//             className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4"
//           >
//             Create account
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!res) {
        setError("Unknown error occurred");
        setLoading(false);
        return;
      }

      if (res.error) {
        setError(res.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // સેશનમાંથી રોલ મેળવવા માટે
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role || "user";

      // 🎯 રોલ મુજબ રીડાયરેક્ટ લોજિક
      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else if (role === "recruiter") {
        router.replace("/recruiter/dashboard");
      } else if (role === "serviceprovider") {
        // ✨ સર્વિસ પ્રોવાઈડર માટે નવું રીડાયરેક્ટ ઉમેર્યું
        router.replace("/serviceprovider/dashboard"); 
      } else {
        router.replace("/user/dashboard"); // સામાન્ય User માટે
      }
      
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-sm bg-white shadow-2xl shadow-indigo-100 rounded-[32px] p-10 border border-slate-100">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-slate-500 text-center text-sm mb-8 font-medium">
          Login to your JobConnect Pro account
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-5">
            <span className="text-sm font-bold text-slate-700 ml-1">Email Address</span>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl 
              focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-bold text-slate-700 ml-1">Password</span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-2xl pr-12
                focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <div className="text-right mb-6">
            <a href="/forgot-password" 
               className="text-indigo-600 hover:text-indigo-700 font-bold text-xs transition-colors">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white 
            py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 text-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}