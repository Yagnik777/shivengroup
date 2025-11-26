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
        setError("Unknown error");
        setLoading(false);
        return;
      }

      if (res.error) {
        setError(res.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Fetch session to get role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role || "user";

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/jobs");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </label>

          {error && (
            <div className="mb-4 text-red-600 text-center text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white 
            py-2 rounded-lg font-semibold shadow"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          No account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Go to Register
          </span>
        </p>

        <p className="text-center mt-2">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}
