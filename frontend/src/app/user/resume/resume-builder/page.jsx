"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import ResumePreview from "@/components/ResumePreview";

export default function ResumeBuilderPage() {
  // ===== Personal / Contact Info =====
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // ===== Other Resume Sections =====
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState([{ title: "", company: "", duration: "", description: "" }]);
  const [educations, setEducations] = useState([{ degree: "", university: "", year: "" }]);
  const [skills, setSkills] = useState([""]);
  const [certifications, setCertifications] = useState([""]);
  const [projects, setProjects] = useState([{ name: "", link: "", description: "" }]);
  const [languages, setLanguages] = useState([""]);

  // ===== Import / Export State =====
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ===== Template State =====
  const [template, setTemplate] = useState("template1");
  const templates = [
    { id: "template1", name: "Classic", description: "Clean and professional" },
    { id: "template2", name: "Modern", description: "Sleek and contemporary" },
    { id: "template3", name: "Creative", description: "Colorful and unique" },
    { id: "template4", name: "Minimal", description: "Simple and elegant" },
  ];

  // ===== Handlers for Dynamic Fields =====
  const handleExperienceChange = (index, field, value) => {
    const newExps = [...experiences];
    newExps[index][field] = value;
    setExperiences(newExps);
  };

  const handleEducationChange = (index, field, value) => {
    const newEdus = [...educations];
    newEdus[index][field] = value;
    setEducations(newEdus);
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleCertificationChange = (index, value) => {
    const newCerts = [...certifications];
    newCerts[index] = value;
    setCertifications(newCerts);
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const handleLanguageChange = (index, value) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);
  };

  // ===== Import Resume =====
  const handleFileUpload = async (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/import", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text() || "Import failed");

      const parsed = await res.json();

      if (parsed.name) setName(parsed.name);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.phone) setPhone(parsed.phone);
      if (parsed.linkedin) setLinkedin(parsed.linkedin);
      if (parsed.github) setGithub(parsed.github);
      if (parsed.summary) setSummary(parsed.summary);
      if (parsed.skills?.length) setSkills(parsed.skills);
      if (parsed.experiences?.length) setExperiences(parsed.experiences);
      if (parsed.education?.length) setEducations(parsed.education);
      if (parsed.projects?.length) setProjects(parsed.projects);

      alert("Resume imported. Please review and edit fields as needed.");
    } catch (err) {
      console.error(err);
      alert("Import failed: " + (err.message || "Unknown error"));
    } finally {
      setImporting(false);
      evt.target.value = "";
    }
  };

  // ===== Export Resume =====
  const downloadFile = async (type) => {
    setExporting(true);
    try {
      const payload = {
        type,
        template,
        fullName: name,
        email,
        phone,
        linkedin,
        github,
        summary,
        experiences: experiences.map((exp) => ({
          title: exp.title || "",
          company: exp.company || "",
          start: exp.start_date || exp.duration || "",
          end: exp.end_date || "",
          description: exp.description || "",
        })),
        education: educations.map((edu) => ({
          degree: edu.degree || "",
          university: edu.university || "",
          start: edu.start_year || "",
          end: edu.year || "",
        })),
        skills,
        certifications,
        projects: projects.map((p) => ({ name: p.name || "", description: p.description || "" })),
        languages,
      };

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to export resume");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name || "resume"}.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

  // ===== UI =====
  return (
    <div className="w-full min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10">

        {/* ===== Left: Form Inputs ===== */}
        <div className="flex-1 space-y-8">
          <h1 className="text-3xl font-bold">Build Your Resume</h1>

          {/* Template Selector */}
          <div className="p-4 border rounded-lg bg-white shadow">
            <p className="font-semibold mb-3">Choose Template</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    template === t.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-600">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Import Resume */}
          <div className="p-4 border rounded-lg bg-white shadow">
            <p className="font-semibold mb-2">Import Resume (PDF or DOCX)</p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="p-2 border w-full rounded"
              disabled={importing}
            />
            <p className="text-sm text-gray-500 mt-1">
              {importing ? "Importing..." : "Upload a resume to auto-fill fields"}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="p-2 border rounded w-full" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded w-full" />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="p-2 border rounded w-full" />
              <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn" className="p-2 border rounded w-full" />
              <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub" className="p-2 border rounded w-full" />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-semibold mb-2">Professional Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a short professional summary..."
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
          </div>

          {/* Dynamic Sections: Experience, Education, Skills, Certifications, Projects, Languages */}
          {[
            { label: "Experience", state: experiences, handler: handleExperienceChange, template: { title: "", company: "", duration: "", description: "" } },
            { label: "Education", state: educations, handler: handleEducationChange, template: { degree: "", university: "", year: "" } },
            { label: "Skills", state: skills, handler: handleSkillChange, template: "" },
            { label: "Certifications", state: certifications, handler: handleCertificationChange, template: "" },
            { label: "Projects", state: projects, handler: handleProjectChange, template: { name: "", link: "", description: "" } },
            { label: "Languages", state: languages, handler: handleLanguageChange, template: "" },
          ].map((section, idx) => (
            <div key={idx}>
              <label className="block font-semibold mb-2">{section.label}</label>
              {section.state.map((item, i) => (
                <div key={i} className={`mb-4 p-4 border rounded-lg shadow-sm relative ${["Skills", "Certifications", "Languages"].includes(section.label) ? "flex items-center gap-2" : ""}`}>
                  {/* Remove Button */}
                  {section.state.length > 1 && (
                    <button
                      onClick={() => {
                        const newState = section.state.filter((_, j) => j !== i);
                        ["Experience", "Education", "Projects"].includes(section.label)
                          ? section.label === "Experience"
                            ? setExperiences(newState)
                            : section.label === "Education"
                            ? setEducations(newState)
                            : setProjects(newState)
                          : section.label === "Skills"
                          ? setSkills(newState)
                          : section.label === "Certifications"
                          ? setCertifications(newState)
                          : setLanguages(newState);
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  )}

                  {/* Inputs */}
                  {typeof item === "object" ? Object.keys(section.template).map((field) => (
                    <input
                      key={field}
                      type="text"
                      value={item[field] || ""}
                      onChange={(e) => section.handler(i, field, e.target.value)}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full mb-2 p-2 border rounded"
                    />
                  )) : (
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => section.handler(i, e.target.value)}
                      placeholder={section.label.slice(0, -1)}
                      className="flex-1 p-2 border rounded"
                    />
                  )}

                  {section.label === "Experience" && (
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => section.handler(i, "description", e.target.value)}
                      placeholder="Description / achievements"
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  )}

                  {section.label === "Projects" && (
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => section.handler(i, "description", e.target.value)}
                      placeholder="Project Description"
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={() =>
                  ["Experience", "Education", "Projects"].includes(section.label)
                    ? section.label === "Experience"
                      ? setExperiences([...experiences, section.template])
                      : section.label === "Education"
                      ? setEducations([...educations, section.template])
                      : setProjects([...projects, section.template])
                    : section.label === "Skills"
                    ? setSkills([...skills, ""])
                    : section.label === "Certifications"
                    ? setCertifications([...certifications, ""])
                    : setLanguages([...languages, ""])
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={16} /> Add {section.label.slice(0, -1)}
              </button>
            </div>
          ))}
        </div>

        {/* ===== Right: Resume Preview & Download ===== */}
        <div className="flex-1 border rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-lg">
          <ResumePreview
            data={{
              personal_info: {
                full_name: name,
                email,
                phone,
                location: "",
                linkedin,
                website: github,
              },
              professional_summary: summary,
              experience: experiences.map((exp) => ({
                position: exp.title,
                company: exp.company,
                start_date: exp.start_date || "",
                end_date: exp.end_date || "",
                is_current: exp.duration?.toLowerCase().includes("present"),
                description: exp.description,
              })),
              education: educations.map((edu) => ({
                degree: edu.degree,
                field: "",
                institution: edu.university,
                gpa: "",
                graduation_date: edu.year,
              })),
              skills,
              project: projects.map((proj) => ({ name: proj.name, description: proj.description })),
            }}
            selected={template}
          />

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => downloadFile("pdf")}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {exporting ? "Downloading..." : "Download PDF"}
            </button>
            <button
              onClick={() => downloadFile("docx")}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              {exporting ? "Downloading..." : "Download DOCX"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
