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
    avatar: "",
    resume: null,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [professions, setProfessions] = useState([]);
  const [positions, setPositions] = useState([]);

  const predefinedSkills = [
    "Java", "React JS", "Node JS", "Mongo DB", "Next JS", "Vite",
    "CSS", "Express JS", "PHP", "My SQL", "React (TS)", "React (JS)", "WordPress"
  ];

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

      const profData = await profRes.json();
      const posData = await posRes.json();

      setProfessions(profData || []);
      setPositions(posData || []);
    } catch (err) {
      console.error("Failed to fetch professions or positions", err);
    }
  };

  // Fetch options on mount + polling + visibility change
  useEffect(() => {
    const fetchAllOptions = () => fetchOptions();

    fetchAllOptions(); // initial fetch

    const interval = setInterval(fetchAllOptions, 5000); // poll every 5s

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchAllOptions();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Set initial data
  useEffect(() => {
    if (initialData) {
      setProfile(prev => ({
        ...prev,
        ...initialData,
        skills: initialData.skills || [],
        avatar: initialData.avatar || "",
        resume: initialData.resume || null,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) setProfile(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSkillToggle = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    const skill = profile.customSkillInput.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        customSkillInput: ""
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

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

      const res = await fetch("/api/users", { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Failed to save profile");

      const data = await res.json();
      setProfile(prev => ({
        ...prev,
        ...data.data,
        resume: data.data.resume || prev.resume,
        avatar: data.data.avatar || prev.avatar,
      }));

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
        <p className="text-sm text-gray-500 text-center">
          Fill your profile to access all features. All fields are editable.
        </p>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {["fullName", "email", "mobile", "dob"].map(field => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-600">{field}</label>
                <input
                  type={field === "dob" ? "date" : "text"}
                  name={field}
                  value={profile[field] || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  readOnly={field === "email"}
                />
              </div>
            ))}

            {/* Profession dropdown */}
          <div>  
            <label className="text-xs font-semibold text-gray-600">Profession</label>
            <div className="flex items-center gap-2">
              <select
                name="profession"
                value={profile.profession}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="">Select Profession</option>
                {professions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              
            </div>
          </div>

            {/* Position dropdown */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Position</label>
              <div className="flex items-center gap-2">
           
              <select
                name="position"
                value={profile.position}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="">Select Position</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              
              </div>
            </div>

            {/* Other dropdowns */}
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
                {references.map(ref => <option key={ref} value={ref}>{ref}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">LinkedIn</label>
              <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="mt-1 p-2 w-full border rounded"/>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Portfolio</label>
              <input type="text" name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://myportfolio.com" className="mt-1 p-2 w-full border rounded"/>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {predefinedSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full border ${profile.skills.includes(skill) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >
                {skill}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              name="customSkillInput"
              value={profile.customSkillInput}
              onChange={handleChange}
              placeholder="Add custom skill"
              className="flex-grow p-2 border rounded"
            />
            <button type="button" onClick={handleAddCustomSkill} className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="font-bold">x</button>
              </span>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">Resume</label>
          {profile.resume && <p className="text-sm text-gray-700 mb-2">{profile.resume.name}</p>}
          <input type="file" name="resume" onChange={handleFileChange} className="text-sm"/>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 rounded ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold`}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
