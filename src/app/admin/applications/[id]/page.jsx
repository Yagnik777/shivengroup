"use client";
import { useEffect, useState } from "react";

export default function ApplicationDetail({ params }) {
  const { id } = params;
  const [app, setApp] = useState(null);

  useEffect(()=>{
    fetch(`/api/applications/${id}`).then(r=>r.json()).then(setApp).catch(console.error);
  },[id]);

  if (!app) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Application</h1>
      <p><strong>Candidate:</strong> {app.name}</p>
      <p><strong>Email:</strong> {app.email}</p>
      <p><strong>Phone:</strong> {app.phone}</p>
      <p><strong>Job ID:</strong> {app.jobId}</p>
      <p className="mt-4"><strong>Cover Letter:</strong></p>
      <div className="p-3 border rounded bg-white">{app.coverLetter || "—"}</div>

      {app.candidateId && (
        <div className="mt-4">
          <a className="text-blue-600 hover:underline" href={`/admin/candidates/${app.candidateId}`}>Open Candidate Profile</a>
        </div>
      )}
    </div>
  );
}
