"use client";

import { useState, useEffect } from "react";

export default function UserProfile({ initialData }) {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    profession: "",
    position: "",
    role: "",
    experience: "",
    city: "",
    reference: "",
    skills: [],
    linkedin: "",
    portfolio: "",
    customSkillInput: "",
    resume: null,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [professions, setProfessions] = useState([]);
  const [positions, setPositions] = useState([]);

  const predefinedSkills = ["Java", "React JS", "Node JS", "Mongo DB", "Next JS", "Vite", "CSS", "Express JS", "PHP", "My SQL", "React (TS)", "React (JS)", "WordPress"];
  const roles = ["Fresher", "Junior", "Senior"];
  const experiences = ["0 - 1 Years", "1 - 3 Years", "3+ Years"];
  const cities = ["Mumbai", "Delhi", "Bangalore"];
  const references = ["Work India", "LinkedIn", "Referral"];

  // Fetch professions & positions dynamically
  const fetchOptions = async () => {
    try {
      const [profRes, posRes] = await Promise.all([
        fetch("/api/options/professions"),
        fetch("/api/options/positions"),
      ]);
      if (!profRes.ok || !posRes.ok) throw new Error("Failed to fetch options");
      setProfessions(await profRes.json());
      setPositions(await posRes.json());
    } catch (err) {
      console.error("Failed to fetch professions or positions", err);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  // Set initial data
  useEffect(() => {
    if (initialData) {
      setProfile(prev => ({
        ...prev,
        ...initialData,
        skills: initialData.skills || [],
        resume: initialData.resume || null,
      }));
    }
  }, [initialData]);

  const handleChange = e => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = e => { if (e.target.files.length) setProfile(prev => ({ ...prev, [e.target.name]: e.target.files[0] })); };
  const handleSkillToggle = skill => setProfile(prev => ({
    ...prev,
    skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
  }));
  const handleAddCustomSkill = () => {
    const skill = profile.customSkillInput.trim();
    if (skill && !profile.skills.includes(skill)) setProfile(prev => ({ ...prev, skills: [...prev.skills, skill], customSkillInput: "" }));
  };
  const handleRemoveSkill = skill => setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (key === "skills") formData.append(key, JSON.stringify(value));
        else if (value instanceof File) formData.append(key, value);
        else formData.append(key, value || "");
      });

      const res = await fetch("/api/candidates", { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text();
        console.error("Save failed:", res.status, text);
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      setProfile(prev => ({ ...prev, ...data, resume: data.resume || prev.resume }));
      setMessage("✅ Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center font-sans">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6 md:p-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Profile</h1>
        <p className="text-sm text-gray-500 text-center">Fill your profile to access all features. All fields are editable.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["fullName","email","mobile","dob"].map(f => (
            <div key={f}>
              <label className="text-xs font-semibold text-gray-600">{f}</label>
              <input type={f==="dob"?"date":"text"} name={f} value={profile[f]||""} onChange={handleChange} className="mt-1 p-2 w-full border rounded" readOnly={f==="email"}/>
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold text-gray-600">Profession</label>
            <select name="profession" value={profile.profession} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="">Select Profession</option>
              {professions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Position</label>
            <select name="position" value={profile.position} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="">Select Position</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Role</label>
            <select name="role" value={profile.role} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="">Select Role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Experience</label>
            <select name="experience" value={profile.experience} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="">Select Experience</option>
              {experiences.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">City</label>
            <select name="city" value={profile.city} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Reference</label>
            <select name="reference" value={profile.reference} onChange={handleChange} className="mt-1 p-2 w-full border rounded">
              <option value="">Select Reference</option>
              {references.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">LinkedIn</label>
            <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} className="mt-1 p-2 w-full border rounded"/>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Portfolio</label>
            <input type="text" name="portfolio" value={profile.portfolio} onChange={handleChange} className="mt-1 p-2 w-full border rounded"/>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {predefinedSkills.map(skill => (
              <button key={skill} type="button" onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full border ${profile.skills.includes(skill) ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                {skill}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <input type="text" name="customSkillInput" value={profile.customSkillInput} onChange={handleChange} placeholder="Add custom skill" className="flex-grow p-2 border rounded"/>
            <button type="button" onClick={handleAddCustomSkill} className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800">{skill} <button type="button" onClick={() => handleRemoveSkill(skill)} className="font-bold">x</button></span>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Resume</label>
          {profile.resume && <p className="text-sm text-gray-700 mb-2">{typeof profile.resume==="string"?profile.resume.split("/").pop():profile.resume.name}</p>}
          <input type="file" name="resume" onChange={handleFileChange} className="text-sm"/>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={handleSave} disabled={saving} className={`px-6 py-2 rounded ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold`}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
