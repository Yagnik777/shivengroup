"use client";

import { useEffect, useState } from "react";


export default function CandidatesAdmin() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters
  const [professionFilter, setProfessionFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  // Notifications
  const [notificationMessage, setNotificationMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Excel
  


  // Mail
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingMail, setSendingMail] = useState(false);

  // ✅ Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/candidates");
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);



  

  

  // ✅ Delete candidates
  const handleDelete = async (ids) => {
    if (!ids || ids.length === 0) return alert("Select at least one candidate!");
    if (!confirm(`Are you sure you want to delete ${ids.length} candidate(s)?`)) return;

    try {
      setDeletingIds(ids);
      for (const id of ids) {
        const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
        if (!res.ok) console.error("Failed to delete", id);
      }
      setCandidates((prev) => prev.filter((c) => !ids.includes(c._id)));
      setSelectedIds([]);
      alert("✅ Candidate(s) deleted successfully!");
    } catch (err) {
      console.error("Error deleting candidates:", err);
      alert("An error occurred while deleting candidates");
    } finally {
      setDeletingIds([]);
    }
  };

  // ✅ Send Mail
  const handleSendMail = async (ids = [], broadcast = false) => {
    // 1️⃣ Validate subject and body
    if (!emailSubject.trim() || !emailBody.trim()) {
      alert("⚠️ Please enter both subject and message!");
      return;
    }
  
    // 2️⃣ Validate selected IDs if not broadcast
    if (!broadcast && (!ids || ids.length === 0)) {
      alert("⚠️ Please select at least one candidate!");
      return;
    }
  
    // 3️⃣ Confirm with the user
    const confirmMsg = broadcast
      ? "Send this email to ALL candidates?"
      : `Send this email to ${ids.length} selected candidate(s)?`;
  
    if (!confirm(confirmMsg)) return;
  
    try {
      setSendingMail(true);
  
      // 4️⃣ Prepare emails array
      let emailsToSend = [];
  
      if (broadcast) {
        // all candidate emails
        emailsToSend = candidates.map(c => c.email).filter(Boolean);
      } else {
        // selected candidate emails
        emailsToSend = ids
          .map(id => candidates.find(c => c._id === id)?.email)
          .filter(Boolean);
      }
  
      if (emailsToSend.length === 0) {
        alert("⚠️ No valid email addresses found!");
        return;
      }
  
      // 5️⃣ Send request to backend
      const body = {
        subject: emailSubject,
        message: emailBody,
        type: "candidates",
        emails: emailsToSend,
      };
  
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send mail");
  
      // 6️⃣ Clear inputs and show success
      setEmailSubject("");
      setEmailBody("");
      alert(data.message || "✅ Mail sent successfully!");
    } catch (err) {
      console.error("Error sending mail:", err);
      alert(err.message || "An error occurred while sending mail");
    } finally {
      setSendingMail(false);
    }
  };
  

  // ✅ Send Notification
  const handleSendNotification = async (ids, broadcast = false) => {
    if (!notificationMessage.trim()) {
      alert("Please enter a notification message!");
      return;
    }

    if (!broadcast && (!ids || ids.length === 0)) {
      alert("Please select at least one user!");
      return;
    }

    const confirmMsg = broadcast
      ? "Send this notification to ALL users?"
      : `Send this notification to ${ids.length} selected user(s)?`;

    if (!confirm(confirmMsg)) return;

    try {
      setSending(true);

      const body = broadcast
        ? {
            title: "New Notification",
            message: notificationMessage,
            broadcast: true,
          }
        : {
            title: "New Notification",
            message: notificationMessage,
            userIds: ids
              .map((id) => candidates.find((c) => c._id === id)?.userId)
              .filter(Boolean),
          };

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send notifications");

      setNotificationMessage("");
      alert(data.message || "✅ Notification sent successfully!");
    } catch (err) {
      console.error("Error sending notification:", err);
      alert(err.message || "An error occurred while sending notifications");
    } finally {
      setSending(false);
    }
  };


  
  
  
  

  // ✅ Excel export
  const handleDownloadExcel = () => {
    const exportData = filteredCandidates.map((c) => ({
      Name: c.fullName,
      Email: c.email,
      Mobile: c.mobile,
      DOB: c.dob,
      Profession: c.profession,
      Position: c.position,
      Role: c.role,
      Experience: c.experience,
      City: c.city,
      PinCode: c.pincode,
      State: c.state,
      Education: c.education,
      Reference: c.reference,
      LinkedIn: c.linkedin,
      Portfolio: c.portfolio,
      Skills: Array.isArray(c.skills) ? c.skills.join(", ") : "",
      Resume: c.resume,
      ExperienceLetter: c.experienceLetter || "-", // ✅ new field
      CoverLetter: c.coverLetter || "-",  
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidates");
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `Candidates_${date}.xlsx`);
  };

  // ✅ Filters
  const filteredCandidates = candidates.filter((c) => {
    return (
      (professionFilter === "All" || c.profession === professionFilter) &&
      (positionFilter === "All" || c.position === positionFilter) &&
      (roleFilter === "All" || c.role === roleFilter) &&
      (experienceFilter === "All" || c.experience === experienceFilter) &&
      (cityFilter === "All" || c.city === cityFilter)
    );
  });

  const getUniqueValues = (key) => [
    "All",
    ...new Set(candidates.map((c) => c[key]).filter(Boolean)),
  ];

  const professions = getUniqueValues("profession");
  const positions = getUniqueValues("position");
  const roles = getUniqueValues("role");
  const experiences = getUniqueValues("experience");
  const cities = getUniqueValues("city");

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = (checked) => {
    if (checked) setSelectedIds(filteredCandidates.map((c) => c._id));
    else setSelectedIds([]);
  };

  if (loading) return <p>Loading candidates...</p>;

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">All Candidates</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <Filter label="Profession" value={professionFilter} setValue={setProfessionFilter} options={professions} />
        <Filter label="Position" value={positionFilter} setValue={setPositionFilter} options={positions} />
        <Filter label="Role" value={roleFilter} setValue={setRoleFilter} options={roles} />
        <Filter label="Experience" value={experienceFilter} setValue={setExperienceFilter} options={experiences} />
        <Filter label="City" value={cityFilter} setValue={setCityFilter} options={cities} />
      </div>

      {/* Actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing {filteredCandidates.length} of {candidates.length}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDownloadExcel}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            ⬇️ Download Excel
          </button>

          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => handleSendNotification(selectedIds)}
                disabled={sending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : `Notify (${selectedIds.length})`}
              </button>
              <button
                onClick={() => handleDelete(selectedIds)}
                disabled={deletingIds.length > 0}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deletingIds.length > 0 ? "Deleting..." : `Delete (${selectedIds.length})`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      {/* Table */}
      <table className="w-full border border-gray-300 text-sm mb-6 table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === filteredCandidates.length &&
                  filteredCandidates.length > 0
                }
                onChange={(e) => selectAll(e.target.checked)}
              />
            </th>
            <th className="border px-2 py-1">Created At</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Mobile</th>
            <th className="border px-2 py-1">DOB</th>
            <th className="border px-2 py-1">Profession</th>
            <th className="border px-2 py-1">Position</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Experience</th>
            <th className="border px-2 py-1">City</th>
            <th className="border px-2 py-1">Pin Code</th>
            <th className="border px-2 py-1">State</th>
            <th className="border px-2 py-1">Education</th>
            <th className="border px-2 py-1">Reference</th>
            <th className="border px-2 py-1">LinkedIn</th>
            <th className="border px-2 py-1">Portfolio</th>
            <th className="border px-2 py-1">Skills</th>
            <th className="border px-2 py-1">Experience Letter</th>
            <th className="border px-2 py-1">Cover Letter</th>
            <th className="border px-2 py-1">Resume</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((c) => (
            <tr key={c._id} className="hover:bg-gray-50">
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c._id)}
                  onChange={() => toggleSelect(c._id)}
                />
              </td>
              <td className="border px-2 py-1">{new Date(c.createdAt).toLocaleString()}</td>
              <td className="border px-2 py-1">{c.fullName}</td>
              <td className="border px-2 py-1">{c.email}</td>
              <td className="border px-2 py-1">{c.mobile}</td>
              <td className="border px-2 py-1">{c.dob}</td>
              <td className="border px-2 py-1">{c.profession}</td>
              <td className="border px-2 py-1">{c.position}</td>
              <td className="border px-2 py-1">{c.role}</td>
              <td className="border px-2 py-1">{c.experience}</td>
              <td className="border px-2 py-1">{c.city}</td>
              <td className="border px-2 py-1">{c.pincode || "-"}</td>
              <td className="border px-2 py-1">{c.state || "-"}</td>
              <td className="border px-2 py-1">{c.education || "-"}</td>
              <td className="border px-2 py-1">{c.reference || "-"}</td>
              <td className="border px-2 py-1">
                {c.linkedin ? <a href={c.linkedin} target="_blank" className="text-blue-600">View</a> : "-"}
              </td>
              <td className="border px-2 py-1">
                {c.portfolio ? <a href={c.portfolio} target="_blank" className="text-blue-600">View</a> : "-"}
              </td>
              <td className="border px-2 py-1">{Array.isArray(c.skills) ? c.skills.join(", ") : "-"}</td>
              <td className="border px-2 py-1">
                {c.experienceLetter ? (
                  <a href={c.experienceLetter} target="_blank" className="text-blue-600">Download</a>
                ) : "No Experience Letter"}
              </td>
              <td className="border px-2 py-1">
                {c.coverLetter ? (
                  <a href={c.coverLetter} target="_blank" className="text-blue-600">Download</a>
                ) : "No Cover Letter"}
              </td>

              <td className="border px-2 py-1">
                {c.resume ? (
                  <a href={c.resume} target="_blank" className="text-blue-600">Download</a>
                ) : "No Resume"}
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => handleDelete([c._id])}
                  disabled={deletingIds.includes(c._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingIds.includes(c._id) ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Mail Section */}
      <div className="border-t pt-4 mt-4">
        <h2 className="text-lg font-semibold mb-2">Send Email</h2>
        <input
          type="text"
          placeholder="Email Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="border rounded w-full p-2 mb-3"
        />
        <textarea
          rows="4"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="Write your email message..."
          className="border rounded w-full p-2 mb-3"
        ></textarea>

        <div className="flex gap-3">
          <button
            onClick={() => handleSendMail(selectedIds)}
            disabled={sendingMail}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {sendingMail ? "Sending..." : "Send to Selected Users"}
          </button>
          <button
            onClick={() => handleSendMail([], true)}
            disabled={sendingMail}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {sendingMail ? "Sending..." : "Send to All Users"}
          </button>
        </div>
      </div>

      {/* Notification Section */}
      <div className="border-t pt-4 mt-4">
        <h2 className="text-lg font-semibold mb-2">Send Notification</h2>
        <textarea
          rows="3"
          value={notificationMessage}
          onChange={(e) => setNotificationMessage(e.target.value)}
          placeholder="Write a message to send..."
          className="border rounded w-full p-2 mb-3"
        ></textarea>

        <div className="flex gap-3">
          <button
            onClick={() => handleSendNotification(selectedIds)}
            disabled={sending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send to Selected Users"}
          </button>
          <button
            onClick={() => handleSendNotification([], true)}
            disabled={sending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send to All Users"}
          </button>
        </div>
      </div>


    </div>
  );
}

function Filter({ label, value, setValue, options }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}:</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-1 rounded w-full"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );  
}
