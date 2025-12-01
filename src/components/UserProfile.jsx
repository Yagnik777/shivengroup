"use client";

import { useState, useEffect } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    pincode: "",
    state: "",
    education: "",
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
    coverLetter: null,
    experienceLetter: null,
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [readOnly, setReadOnly] = useState(false);

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman & Diu","Delhi",
    "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
  ];

  const [professions, setProfessions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [cities, setCities] = useState([]);
  const [references, setReferences] = useState([]);
  const [predefinedSkills, setPredefinedSkills] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setProfile((prev) => ({
              ...prev,
              ...data,
              skills: data.skills || [],
              resume: data.resume || null,
              coverLetter: data.coverLetter || null,
              experienceLetter: data.experienceLetter || null,
            }));
            setReadOnly(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await fetch("/api/dropdowns");
      if (!res.ok) throw new Error("Failed to fetch dropdowns");

      const data = await res.json();

      setProfessions(data.filter(d => d.type === "profession").map(d => d.value));
      setPositions(data.filter(d => d.type === "position").map(d => d.value));
      setRoles(data.filter(d => d.type === "role").map(d => d.value));
      setExperiences(data.filter(d => d.type === "experience").map(d => d.value));
      setCities(data.filter(d => d.type === "city").map(d => d.value));
      setReferences(data.filter(d => d.type === "reference").map(d => d.value));
      setPredefinedSkills(data.filter(d => d.type === "skills").map(d => d.value));
    } catch (err) {
      console.error("Failed to fetch dropdowns", err);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    if (readOnly || e.target.files.length === 0) return;
    const name = e.target.name;
    setProfile((prev) => ({ ...prev, [name]: e.target.files[0] }));
  };

  const handleRemoveFile = (name) => {
    if (readOnly) return;
    setProfile((prev) => ({ ...prev, [name]: null }));
  };

  const handleSkillToggle = (skill) => {
    if (readOnly) return;
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleAddCustomSkill = () => {
    const skill = profile.customSkillInput.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        customSkillInput: "",
      }));
    }
  };

  const handleRemoveSkill = (skill) => {
    if (readOnly) return;
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = async () => {
    if (readOnly) return;
    setSaving(true);
    setMessage("");

    // ✅ Validate mandatory fields
    const mandatoryFields = [
      "fullName","email","mobile","dob","pincode","state","education",
      "profession","position","role","experience","city","reference",
      "linkedin","portfolio","skills","resume"
    ];

    for (let field of mandatoryFields) {
      if (!profile[field] || (Array.isArray(profile[field]) && profile[field].length === 0)) {
        setMessage(`❌ Please fill all mandatory fields: ${field}`);
        setSaving(false);
        return;
      }
    }

    try {
      const formData = new FormData();

      Object.entries(profile).forEach(([key, value]) => {
        if (key === "skills") {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value || "");
        }
      });

      const res = await fetch("/api/candidates", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const data = await res.json();

      setProfile((prev) => ({
        ...prev,
        ...data,
        resume: data.resume || prev.resume,
        coverLetter: data.coverLetter || prev.coverLetter,
        experienceLetter: data.experienceLetter || prev.experienceLetter,
        email: data.email || prev.email,
      }));

      setMessage("✅ Profile saved successfully!");
      setReadOnly(true);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            {readOnly
              ? "Profile details are view-only."
              : "You can update and save your details below."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {["fullName","email","mobile","dob"].map((f) => (
            <div key={f}>
              <label className="text-xs font-semibold text-gray-600 capitalize">
                {f} <span className="text-red-600">*</span>
              </label>
              <input
                type={f === "dob" ? "date" : f === "email" ? "email" : "text"}
                name={f}
                value={profile[f] || ""}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                readOnly={readOnly}
              />
            </div>
          ))}

          <SelectInput label="Profession" name="profession" options={professions} value={profile.profession} onChange={handleChange} disabled={readOnly} mandatory />
          <SelectInput label="Position" name="position" options={positions} value={profile.position} onChange={handleChange} disabled={readOnly} mandatory />
          <SelectInput label="Role" name="role" options={roles} value={profile.role} onChange={handleChange} disabled={readOnly} mandatory />
          <SelectInput label="Experience" name="experience" options={experiences} value={profile.experience} onChange={handleChange} disabled={readOnly} mandatory />
          <SelectInput label="City" name="city" options={cities} value={profile.city} onChange={handleChange} disabled={readOnly} mandatory />

          <InputField label="Pin Code" name="pincode" value={profile.pincode} onChange={(e) => {
            if (readOnly) return;
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 6) handleChange({ target: { name: "pincode", value } });
          }} readOnly={readOnly} mandatory />

          <SelectInput label="State" name="state" options={indianStates} value={profile.state} onChange={handleChange} disabled={readOnly} mandatory />
          <InputField label="Minimum Basic Education" name="education" value={profile.education} onChange={handleChange} readOnly={readOnly} mandatory />
          <SelectInput label="Reference" name="reference" options={references} value={profile.reference} onChange={handleChange} disabled={readOnly} mandatory />
          <InputField label="LinkedIn" name="linkedin" value={profile.linkedin} onChange={handleChange} readOnly={readOnly} mandatory />
          <InputField label="Portfolio" name="portfolio" value={profile.portfolio} onChange={handleChange} readOnly={readOnly} mandatory />
        </div>

        {/* SKILLS */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Skills <span className="text-red-600">*</span>
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {predefinedSkills.map(skill => (
              <button key={skill} type="button" onClick={()=>handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full text-sm border ${profile.skills.includes(skill)?"bg-blue-600 text-white":"bg-gray-100 text-gray-700"}`} disabled={readOnly}>
                {skill}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input type="text" name="customSkillInput" value={profile.customSkillInput} onChange={handleChange} placeholder="Add custom skill"
              className="flex-grow p-2 border rounded-lg" disabled={readOnly} />
            {!readOnly && <button type="button" onClick={handleAddCustomSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {profile.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800">
                {skill}
                {!readOnly && <button type="button" onClick={()=>handleRemoveSkill(skill)}>×</button>}
              </span>
            ))}
          </div>
        </div>

        {/* FILE INPUTS */}
        <FileInput label="Resume" name="resume" file={profile.resume} onChange={handleFileChange} onRemove={handleRemoveFile} readOnly={readOnly} mandatory />
        <FileInput label="Cover Letter" name="coverLetter" file={profile.coverLetter} onChange={handleFileChange} onRemove={handleRemoveFile} readOnly={readOnly} />
        <FileInput label="Experience Letter" name="experienceLetter" file={profile.experienceLetter} onChange={handleFileChange} onRemove={handleRemoveFile} readOnly={readOnly} />

        {/* BUTTONS */}
        <div className="flex justify-end mt-8 gap-3">
          {readOnly ? (
            <button onClick={()=>setReadOnly(false)} className="px-6 py-2 bg-yellow-500 text-white rounded-lg">Edit Profile</button>
          ) : (
            <>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg">{saving?"Saving...":"Save Changes"}</button>
              <button onClick={()=>setReadOnly(true)} className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</button>
            </>
          )}
        </div>

        {message && <p className={`text-center text-sm mt-4 font-medium ${message.includes("✅")?"text-green-600":"text-red-600"}`}>{message}</p>}
      </div>
    </div>
  );
}

/* COMPONENTS */
function SelectInput({ label, name, options, value, onChange, disabled, mandatory }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label} {mandatory && <span className="text-red-600">*</span>}</label>
      <select name={name} value={value} onChange={onChange} disabled={disabled} className="mt-1 p-2 w-full border rounded-lg">
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function InputField({ label, name, value, onChange, readOnly, mandatory }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label} {mandatory && <span className="text-red-600">*</span>}</label>
      <input type="text" name={name} value={value||""} onChange={onChange} readOnly={readOnly} className="mt-1 p-2 w-full border rounded-lg" />
    </div>
  );
}

function FileInput({ label, name, file, onChange, onRemove, readOnly, mandatory }) {
  return (
    <div className="mt-4">
      <label className="text-sm font-semibold text-gray-600 mb-1 block">{label} {mandatory && <span className="text-red-600">*</span>}</label>
      {file && (
        <div className="flex items-center gap-3 mb-2">
          <p className="text-sm text-gray-700">{typeof file==="string"?file.split("/").pop():file.name}</p>
          {typeof file==="string" && <a href={file} target="_blank" className="px-3 py-1 bg-blue-600 text-white rounded-lg">View</a>}
          {!readOnly && <button onClick={()=>onRemove(name)} className="px-2 py-1 bg-red-600 text-white rounded-lg">Remove</button>}
        </div>
      )}
      <input type="file" name={name} onChange={onChange} disabled={readOnly} />
    </div>
  );
}
