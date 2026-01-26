// src/app/resume-toolkit/page.jsx
"use client";

import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function ResumeToolkit() {
  const [tab, setTab] = useState("tailor");
  const { data: session } = useSession();

  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tailor Resume
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeTextPreview, setResumeTextPreview] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResult, setTailoredResult] = useState(null);

  // Cover Letter
  const [coverTone, setCoverTone] = useState("formal");
  const [coverLength, setCoverLength] = useState("short");
  const [coverResult, setCoverResult] = useState(null);

  // Headshot
  const [selfieFile, setSelfieFile] = useState(null);
  const [headshotResults, setHeadshotResults] = useState([]);
  const [selectedHeadshot, setSelectedHeadshot] = useState(null);

  // ATS Upload Tab
  const [atsFile, setAtsFile] = useState(null);
  const [atsJobDesc, setAtsJobDesc] = useState("");
  const [atsResult, setAtsResult] = useState(null);

  const fileInputRef = useRef();
  const selfieInputRef = useRef();
  const atsInputRef = useRef();

  // ------------------ Helpers ------------------
  async function extractTextFromFile(file) {
    if (!file) return "";
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "txt") return await file.text();
    return "(Uploaded file will be analyzed on the server)";
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadImage(url) {
    window.open(url, "_blank");
  }

  // ------------------ Tailor Resume ------------------
  async function handleTailorSubmit(e) {
    e.preventDefault();
    setError(null);
    setTailoredResult(null);
    setLoading(true);

    if (!resumeFile && !resumeTextPreview) {
      setError("Please upload a resume file or paste resume text.");
      setLoading(false);
      return;
    }

    try {
      let textToSend = resumeTextPreview;
      if (resumeFile) {
        const ext = resumeFile.name.split(".").pop().toLowerCase();
        if (ext === "txt") textToSend = await resumeFile.text();
        else if (ext === "pdf" || ext === "docx")
          textToSend = "(Uploaded file will be analyzed on the server)";
      }

      const payload = {
        resumeText: textToSend,
        jobDescription: jobDescription || "",
        format: "onepage",
        focus: "achievements",
      };

      const res = await fetch("/api/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to tailor resume");
      }

      const data = await res.json();
      setTailoredResult(data.data || data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ------------------ Cover Letter ------------------
  async function handleCoverSubmit(e) {
    e.preventDefault();
    setError(null);
    setCoverResult(null);
    setLoading(true);

    if (!resumeFile && !resumeTextPreview) {
      setError("Please upload a resume file or paste resume text.");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      if (resumeFile) form.append("file", resumeFile);
      form.append("jobDescription", jobDescription || "");
      form.append("tone", coverTone);
      form.append("length", coverLength);

      const res = await fetch("/api/resume/cover-letter", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      const data = await res.json();
      setCoverResult(data.coverText || data.data || data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ------------------ Headshot ------------------
  async function handleHeadshotUpload(e) {
    e.preventDefault();
    setError(null);
    setHeadshotResults([]);
    setSelectedHeadshot(null);
    setLoading(true);

    if (!selfieFile) {
      setError("Please upload a selfie image.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selfieFile);
      formData.append("userId", session?.user?.resumeId || session?.user?._id);
      formData.append("style", "corporate");

      const res = await fetch("/api/headshot/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate headshot");
      }

      const data = await res.json();
      setHeadshotResults(data.images || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ------------------ ATS Upload ------------------
  const handleAtsUpload = async () => {
    if (!atsFile) return;

    const form = new FormData();
    form.append("file", atsFile);
    form.append("userId", session?.user?._id || "123");
    form.append("jobDescription", atsJobDesc);

    setLoading(true);
    setError(null);
    setAtsResult(null);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setAtsResult(data.data);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Resume Toolkit</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("tailor")}
          className={`px-4 py-2 rounded-md ${tab === "tailor" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
        >
          Tailor Resume
        </button>
        <button
          onClick={() => setTab("cover")}
          className={`px-4 py-2 rounded-md ${tab === "cover" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
        >
          Cover Letter
        </button>
        <button
          onClick={() => setTab("headshot")}
          className={`px-4 py-2 rounded-md ${tab === "headshot" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
        >
          AI Headshots
        </button>
        <button
          onClick={() => setTab("ats")}
          className={`px-4 py-2 rounded-md ${tab === "ats" ? "bg-blue-600 text-white" : "bg-slate-100"}`}
        >
          ATS Score
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      )}

      {/* ---------------- Tailor Resume ---------------- */}
      {tab === "tailor" && (
        <form onSubmit={handleTailorSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tailor Resume Left Panel */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Upload Resume (PDF/DOCX/TXT)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={async (e) => {
                const f = e.target.files[0];
                setResumeFile(f);
                const t = await extractTextFromFile(f);
                setResumeTextPreview(t);
              }}
              className="block w-full text-sm text-slate-700"
            />
            <label className="block text-sm font-medium mt-4 mb-2">Or paste resume text</label>
            <textarea
              value={resumeTextPreview}
              onChange={(e) => setResumeTextPreview(e.target.value)}
              rows={10}
              className="w-full p-2 border rounded"
            />
            <label className="block text-sm font-medium mt-4 mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="w-full p-2 border rounded"
            />
            <div className="mt-4 flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">
                {loading ? "Processing..." : "Tailor Resume"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setResumeFile(null);
                  setResumeTextPreview("");
                  fileInputRef.current.value = null;
                }}
                className="px-4 py-2 rounded bg-gray-100"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Tailor Resume Right Panel */}
          <div className="col-span-2">
            <h3 className="font-medium mb-2">Preview / Results</h3>
            {!tailoredResult && (
              <div className="p-4 border rounded h-full bg-white">
                <p className="text-sm text-slate-500">Tailored result will appear here after processing.</p>
                <div className="mt-3">
                  <strong>Uploaded/Pasted Resume (preview):</strong>
                  <div className="mt-2 p-3 border rounded bg-slate-50 text-sm whitespace-pre-wrap">
                    {resumeTextPreview || "No preview"}
                  </div>
                </div>
              </div>
            )}
            {tailoredResult && (
              <div className="p-4 border rounded bg-white">
                <h4 className="font-semibold mb-2">Tailored Resume</h4>
                <pre className="text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded">
                  {typeof tailoredResult === "string" ? tailoredResult : JSON.stringify(tailoredResult, null, 2)}
                </pre>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      downloadText(
                        "tailored-resume.txt",
                        typeof tailoredResult === "string" ? tailoredResult : JSON.stringify(tailoredResult)
                      )
                    }
                    className="px-3 py-2 rounded bg-blue-600 text-white"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      )}

      {/* ---------------- Cover Letter ---------------- */}
      {tab === "cover" && (
        <form onSubmit={handleCoverSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Upload Resume (or paste)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={async (e) => {
                const f = e.target.files[0];
                setResumeFile(f);
                const t = await extractTextFromFile(f);
                setResumeTextPreview(t);
              }}
              className="block w-full text-sm text-slate-700"
            />
            <label className="block text-sm font-medium mt-4 mb-2">Job Description</label>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} className="w-full p-2 border rounded" />
            <label className="block text-sm font-medium mt-4 mb-2">Tone</label>
            <select value={coverTone} onChange={(e) => setCoverTone(e.target.value)} className="w-full p-2 border rounded">
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
              <option value="creative">Creative</option>
            </select>
            <label className="block text-sm font-medium mt-4 mb-2">Length</label>
            <select value={coverLength} onChange={(e) => setCoverLength(e.target.value)} className="w-full p-2 border rounded">
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">{loading ? "Generating..." : "Generate Cover Letter"}</button>
              <button type="button" onClick={() => { setCoverResult(null); setCoverTone("formal"); setCoverLength("short"); }} className="px-4 py-2 rounded bg-gray-100">Reset</button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-2">
            <h3 className="font-medium mb-2">Cover Letter Preview</h3>
            <div className="p-4 border rounded bg-white">
              {!coverResult && <p className="text-sm text-slate-500">Generated letter will appear here.</p>}
              {coverResult && (
                <>
                  <pre className="whitespace-pre-wrap bg-slate-50 p-3 rounded text-sm">{coverResult}</pre>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => downloadText("cover-letter.txt", coverResult)} className="px-3 py-2 rounded bg-blue-600 text-white">Download</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      )}

      {/* ---------------- Headshot ---------------- */}
      {tab === "headshot" && (
        <form onSubmit={handleHeadshotUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Upload Selfie</label>
            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelfieFile(e.target.files[0])}
              className="block w-full text-sm text-slate-700"
            />
            <label className="block text-sm font-medium mt-4 mb-2">Style</label>
            <select className="w-full p-2 border rounded" defaultValue="corporate">
              <option value="corporate">Corporate</option>
              <option value="creative">Creative</option>
              <option value="casual">Casual</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">{loading ? "Generating..." : "Generate Headshots"}</button>
              <button type="button" onClick={() => { setHeadshotResults([]); setSelectedHeadshot(null); selfieInputRef.current.value = null; setSelfieFile(null); }} className="px-4 py-2 rounded bg-gray-100">Reset</button>
            </div>
            {selectedHeadshot && (
              <div className="mt-4">
                <h4 className="text-sm font-medium">Selected</h4>
                <img src={selectedHeadshot} alt="selected" className="mt-2 w-40 h-40 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="col-span-2">
            <h3 className="font-medium mb-2">Generated Headshots</h3>
            <div className="p-4 border rounded bg-white min-h-[200px]">
              {!headshotResults.length && <p className="text-sm text-slate-500">Generated images will appear here.</p>}
              {headshotResults.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {headshotResults.map((img, idx) => {
                    const url = img.url || img;
                    return (
                      <div key={idx} className="p-2 border rounded text-center">
                        <img src={url} alt={`headshot-${idx}`} className="w-full h-44 object-cover rounded mb-2" />
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => setSelectedHeadshot(url)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Select</button>
                          <button onClick={() => downloadImage(url)} className="px-3 py-1 rounded bg-gray-100 text-sm">Open</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* ---------------- ATS Score ---------------- */}
      {tab === "ats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Upload Resume (PDF/DOCX/TXT)</label>
            <input
              ref={atsInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setAtsFile(e.target.files[0])}
              className="block w-full text-sm text-slate-700"
            />

            <label className="block text-sm font-medium mt-4 mb-2">Job Description</label>
            <textarea
              value={atsJobDesc}
              onChange={(e) => setAtsJobDesc(e.target.value)}
              rows={6}
              className="w-full p-2 border rounded"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAtsUpload}
                disabled={!atsFile || loading}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                {loading ? "Uploading..." : "Upload Resume"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAtsFile(null);
                  setAtsJobDesc("");
                  setAtsResult(null);
                  atsInputRef.current.value = null;
                }}
                className="px-4 py-2 rounded bg-gray-100"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-2">
            <h3 className="font-medium mb-2">ATS Result</h3>
            <div className="p-4 border rounded bg-white">
              {!atsResult && <p className="text-sm text-slate-500">Upload a resume to see ATS scoring and AI suggestions.</p>}
              {atsResult && (
                <div className="space-y-2">
                  <p><strong>ATS Score:</strong> {atsResult.atsScore}</p>
                  <p><strong>Missing Keywords:</strong> {atsResult.missingKeywords.join(", ")}</p>
                  <p><strong>AI Suggestions:</strong></p>
                    {Array.isArray(atsResult.aiSuggestions) && atsResult.aiSuggestions.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {atsResult.aiSuggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">No AI suggestions available.</p>
                    )}
                    
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
