"use client";


import { useState } from "react";


export default function ForgotPassword() {
const [email, setEmail] = useState("");
const [msg, setMsg] = useState("");
const [loading, setLoading] = useState(false);


const submit = async () => {
setLoading(true);
const res = await fetch("/api/auth/forgot-password", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email }),
});
const data = await res.json();
setMsg(data.message || data.error);
setLoading(false);
};


return (
<div className="p-6 max-w-md mx-auto">
<h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
<input
className="border p-2 w-full"
placeholder="Enter your email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
<button
className="mt-3 bg-blue-600 text-white px-4 py-2"
onClick={submit}
disabled={loading}
>
{loading ? "Sending..." : "Send Reset Link"}
</button>
<p className="mt-3 text-green-600">{msg}</p>
</div>
);
}