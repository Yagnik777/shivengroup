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
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return setError("Full name is required");
    if (!email.includes("@")) return setError("Enter valid email address");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (!acceptedTerms) return setError("You must accept Terms & Conditions and Privacy Policy");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, acceptedTerms }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.error || "Registration failed");

      setSuccess("✅ Registration successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* TERMS CHECKBOX */}
        <label className="flex items-start gap-2 mb-4">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1"
          />
          <div className="text-sm text-gray-700">
            I accept the{" "}
            <span className="text-blue-600 underline cursor-pointer" onClick={() => setShowTerms(true)}>
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-blue-600 underline cursor-pointer" onClick={() => setShowPrivacy(true)}>
              Privacy Policy
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </form>

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-xl shadow-lg">
            <h2 className="text-xl font-bold mb-3">Terms & Conditions</h2>
            <p className="text-gray-700 text-sm h-64 overflow-y-auto">
              {/* Add full terms here */}
              These are the terms and conditions...
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-xl shadow-lg">
            <h2 className="text-xl font-bold mb-3">Privacy Policy</h2>
            <p className="text-gray-700 text-sm h-64 overflow-y-auto">
              {/* Add full privacy here */}
              This is the privacy policy...
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
