"use client";
import { useState, useEffect } from "react";
import { Send, Mail, Users, Layout, Trash2, Plus, Eye } from "lucide-react";

export default function MailingSystem() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "Welcome Mail",
      subject: "Welcome to ShivEn Group!",
      content: "<h1>Welcome!</h1><p>We are glad to have you with us.</p>"
    },
    {
      id: 2,
      title: "Job Alert",
      subject: "New Job Openings for You",
      content: "<h2>New Jobs Available</h2><p>Check our portal for new listings.</p>"
    }
  ]);

  const applyTemplate = (temp) => {
    setSubject(temp.subject);
    setMessage(temp.content);
  };

  const handleSend = async () => {
    if (!subject || !message) return alert("Subject and Message are required!");
    setLoading(true);
    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        body: JSON.stringify({ subject, message, type: target, allUsers: target === "all" })
      });
      const data = await res.json();
      alert(`Sent to ${data.sentTo} users!`);
    } catch (err) {
      alert("Error sending mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">ShivEn Mailing Engine</h1>
          <p className="text-slate-500 font-bold text-xs tracking-[0.2em]">BROADCAST & CAMPAIGN MANAGER</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Composer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white"><Send size={20}/></div>
                <h2 className="text-xl font-black text-slate-800">Compose Campaign</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Target Audience</label>
                  <select 
                    className="w-full p-4 mt-1 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-slate-700"
                    onChange={(e) => setTarget(e.target.value)}
                  >
                    <option value="all">All Records (Candidates + Recruiters)</option>
                    <option value="candidates">Candidate Jobs Only</option>
                    <option value="jobs">Company Jobs Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter a catchy subject line..."
                    className="w-full p-4 mt-1 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Message Body (HTML Supported)</label>
                  <textarea 
                    rows="12"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message or select a template..."
                    className="w-full p-4 mt-1 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-medium text-slate-600"
                  />
                </div>

                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  {loading ? "Launching..." : <><Send size={18}/> Send Broadcast Now</>}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Templates & Stats */}
          <div className="space-y-6">
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
              <h3 className="font-black text-xs uppercase tracking-widest opacity-80 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-black italic">1.2k</p>
                  <p className="text-[10px] font-bold uppercase opacity-70">Total Subs</p>
                </div>
                <div>
                  <p className="text-3xl font-black italic">98%</p>
                  <p className="text-[10px] font-bold uppercase opacity-70">Delivery Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-800">Templates</h3>
                <button className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-all"><Plus size={18}/></button>
              </div>
              
              <div className="space-y-3">
                {templates.map((t) => (
                  <div key={t.id} className="group p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-indigo-100 transition-all cursor-pointer" onClick={() => applyTemplate(t)}>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-700 text-sm uppercase italic">{t.title}</p>
                      <Layout size={14} className="text-slate-400 group-hover:text-indigo-500"/>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 truncate">{t.subject}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2rem border border-amber-100">
              <div className="flex gap-3 text-amber-700">
                <Mail size={20}/>
                <div>
                  <p className="text-xs font-black uppercase italic">Pro Tip</p>
                  <p className="text-[11px] font-medium leading-relaxed mt-1">HTML વાપરતી વખતે Inline CSS નો જ ઉપયોગ કરો જેથી ઈમેલ Gmail માં પ્રોપર દેખાય.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}