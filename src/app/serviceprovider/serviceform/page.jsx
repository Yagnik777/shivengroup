"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2, CheckCircle2, Trash2, ChevronDown, ChevronUp, Pencil, IndianRupee } from 'lucide-react';
import Sidebar from '@/components/Serviceprovidersidbar';

const ServiceCard = ({ service, onDelete, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider w-fit">
            {service.category || "General"}
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">{service.title}</h3>
        </div>
        <span className="text-2xl font-black text-indigo-600">₹{service.price}</span>
      </div>

      <div className="mb-4 relative z-10">
        <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-slate-500 text-sm font-medium pt-2 pb-4 border-t border-slate-50 mt-2">
            {service.description}
          </p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1 mt-2 outline-none">
          {isOpen ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> View Details</>}
        </button>
      </div>
      
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
        <div className="flex flex-col text-[9px] font-black text-slate-400 uppercase tracking-widest">
           <span>Created On</span>
           <span className="text-slate-600">{new Date(service.createdAt).toLocaleDateString('en-IN')}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(service)} className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm">
             <Pencil size={18} />
          </button>
          <button onClick={() => onDelete(service._id)} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm">
             <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CreateService() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [providerInfo, setProviderInfo] = useState({ fullName: '', mobile: '' });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', customCategory: '', price: '', description: '' });

  // સુરક્ષિત JSON ફેચ ફંક્શન
  const safeFetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return { success: false, error: "Invalid response from server" };
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchProviderDetails();
      await fetchServices();
    };
    loadInitialData();
  }, []);

  const fetchProviderDetails = async () => {
    try {
      const data = await safeFetchJson('/api/recruiter/profile');
      if (data.success && data.user) {
        setProviderInfo({ fullName: data.user.fullName || '', mobile: data.user.mobile || '' });
      }
    } catch (err) { console.error("Profile fetch error", err); }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const data = await safeFetchJson('/api/serviceprovider/serviceform');
      if (data.success) setServices(data.services || []);
    } catch (err) { console.error(err); }
    finally { setLoadingServices(false); }
  };

  const handleEditClick = (service) => {
    setEditingId(service._id);
    const standardCats = ['Cleaning', 'Plumbing'];
    const isStandard = standardCats.includes(service.category);
    setFormData({
      title: service.title,
      category: isStandard ? service.category : 'other',
      customCategory: isStandard ? '' : service.category,
      price: service.price,
      description: service.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/serviceprovider/serviceform?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (err) { console.error("Delete failed", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalCategory = formData.category === 'other' ? formData.customCategory : formData.category;

    const finalData = {
      title: formData.title,
      category: finalCategory,
      price: Number(formData.price),
      description: formData.description,
      providerName: providerInfo.fullName || "Provider",
      providerMobile: providerInfo.mobile || "N/A",
    };

    if (editingId) finalData.id = editingId;

    try {
      const method = editingId ? 'PUT' : 'POST';
      const data = await safeFetchJson('/api/serviceprovider/serviceform', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (data.success) {
        setStatus({ type: 'success', message: editingId ? 'Updated! ✨' : 'Created! 🎉' });
        setFormData({ title: '', category: '', customCategory: '', price: '', description: '' });
        setEditingId(null);
        fetchServices();
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to save' });
      }
    } catch (err) { 
      setStatus({ type: 'error', message: 'Network error' }); 
    } finally { 
      setIsSubmitting(false); 
      setTimeout(() => setStatus({ type: '', message: '' }), 3000); 
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFF]">
      <Sidebar activePage="serviceform" />
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 mb-12">
            <h1 className="text-3xl font-black text-slate-900 mb-6">
              {editingId ? "Edit Service" : "Create New Service"}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Service Name" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold focus:bg-white focus:ring-2 ring-indigo-100 transition-all" />
                <div className="relative">
                   <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input required type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none font-bold focus:bg-white focus:ring-2 ring-indigo-100 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none cursor-pointer">
                  <option value="">Select Category</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="other">Other</option>
                </select>
                {formData.category === 'other' && (
                  <input required placeholder="Enter Category Name" value={formData.customCategory} onChange={(e) => setFormData({...formData, customCategory: e.target.value})} className="w-full p-4 bg-indigo-50 rounded-2xl font-bold outline-none border-2 border-indigo-100 animate-in fade-in" />
                )}
              </div>

              <textarea required placeholder="Service Description..." rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:bg-white focus:ring-2 ring-indigo-100 transition-all resize-none" />

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-100">
                {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? <CheckCircle2 /> : <PlusCircle />}
                {editingId ? "Update Service Details" : "Publish Service"}
              </button>
              {status.message && <div className={`p-4 rounded-xl text-center font-bold animate-pulse ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{status.message}</div>}
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-4">Active Services</h2>
            {loadingServices ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.length > 0 ? (
                  services.map(s => <ServiceCard key={s._id} service={s} onDelete={handleDelete} onEdit={handleEditClick} />)
                ) : (
                  <div className="col-span-2 text-center py-10 text-slate-400 font-bold bg-white rounded-3xl border-2 border-dashed">No services posted yet.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}