import React, { useState, useMemo, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Editor } from '@tinymce/tinymce-react'; 
import { 
  Calendar as CalIcon, MapPin, Clock, Plus, 
  Search, ChevronLeft, ChevronRight, Pencil, 
  Trash2, X, Info, ChevronDown, Tag, Image as ImageIcon, Upload, FileText,
  CheckCircle2, PlayCircle, BookOpen 
} from 'lucide-react';

export default function KalenderKegiatanPage() {
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q"; 
  const fileInputRef = useRef(null);

  // --- 1. STATE DATA (Struktur Field Sama Dengan Publikasi) ---
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Survey Terumbu Karang Raja Ampat",
      location: "Pulau Mansuar", 
      date: new Date().toISOString().split('T')[0], 
      time: "08:00",
      category: "RISET",
      status: "PUBLISH",
      image: null,
      summary: "Monitoring kesehatan karang di kawasan konservasi.",
      description: "<p>Detail rincian narasi kegiatan di sini.</p>",
    }
  ]);

  const [categories, setCategories] = useState(["PROGRAM", "RISET", "EVENT", "INTERNAL"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [search, setSearch] = useState("");
  
  // State untuk navigasi kalender manual
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [currentEvent, setCurrentEvent] = useState({ 
    id: '', title: '', location: '', category: 'PROGRAM', status: 'DRAFT',
    date: new Date().toISOString().split('T')[0], time: '09:00',
    summary: '', description: '', image: null
  });

  // --- 2. LOGIKA KALENDER MANUAL (Ringan & No-Library) ---
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null); // Padding awal bulan
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentMonth]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: events.length,
      onGoing: events.filter(e => e.date >= today).length,
      terlaksana: events.filter(e => e.date < today).length
    };
  }, [events]);

  // --- 3. FUNGSI HANDLE ---
  const handleSave = (e) => {
    if(e) e.preventDefault();
    if (isEditing) {
      setEvents(prev => prev.map(item => item.id === currentEvent.id ? { ...currentEvent } : item));
    } else {
      setEvents(prev => [{ ...currentEvent, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const openModal = (event = null) => {
    if (event) {
      setCurrentEvent({ ...event });
      setIsEditing(true);
    } else {
      setCurrentEvent({ 
        id: '', title: '', location: '', category: 'PROGRAM', status: 'DRAFT',
        date: new Date().toISOString().split('T')[0], time: '09:00',
        summary: '', description: '', image: null
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCurrentEvent({ ...currentEvent, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Kalender Kegiatan" subtitle="Jadwal operasional " showSearch={false} />

      <div className="flex-1 overflow-auto p-6 space-y-6 bg-slate-50/30">
        
        {/* STATS CARDS (Style Publikasi) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#234E8D]"><BookOpen size={20}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Agenda</p>
              <p className="text-lg font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600"><PlayCircle size={20}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Mendatang</p>
              <p className="text-lg font-bold text-slate-800">{stats.onGoing}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600"><CheckCircle2 size={20}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Terlaksana</p>
              <p className="text-lg font-bold text-slate-800">{stats.terlaksana}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR KALENDER CUSTOM */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 px-1">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                  {currentMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={16}/></button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={16}/></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map(d => (
                  <span key={d} className="text-[9px] font-bold text-slate-300 uppercase">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
                  const dateStr = day.toISOString().split('T')[0];
                  const hasEvent = events.some(e => e.date === dateStr);
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;
                  return (
                    <div key={dateStr} className={`aspect-square flex items-center justify-center text-[10px] rounded-lg relative cursor-default transition-all
                      ${hasEvent ? 'bg-blue-50 text-[#234E8D] font-bold' : 'text-slate-500 hover:bg-slate-50'}
                      ${isToday ? 'ring-1 ring-[#234E8D] ring-inset' : ''}`}>
                      {day.getDate()}
                      {hasEvent && <div className="w-1 h-1 bg-[#234E8D] rounded-full absolute bottom-1.5"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN TABLE (Style Publikasi) */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Cari agenda..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#234E8D] bg-white shadow-sm" />
              </div>
              <button onClick={() => openModal()} className="bg-[#234E8D] text-white px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-[#1C3F72] transition-all">
                <Plus size={16} /> Tambah Agenda
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <th className="px-6 py-4">Informasi Agenda</th>
                    <th className="px-6 py-4">Waktu & Tempat</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.filter(e => e.title.toLowerCase().includes(search.toLowerCase())).map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                          {event.image ? <img src={event.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-4 text-slate-300"/>}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-slate-800 line-clamp-1 block">{event.title}</span>
                          <span className="text-[11px] text-slate-400 font-medium line-clamp-1 italic">{event.summary || 'Belum ada ringkasan'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-2"><CalIcon size={12} className="text-[#234E8D]"/> {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1"><MapPin size={12}/> {event.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${event.status === 'PUBLISH' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1.5">
                          <button onClick={() => openModal(event)} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"><Pencil size={15}/></button>
                          <button onClick={() => setEvents(events.filter(e => e.id !== event.id))} className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all"><Trash2 size={15}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL (100% KONSISTEN DENGAN PUBLIKASI) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
            
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#234E8D]"><CalIcon size={20}/></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isEditing ? 'Ubah Agenda' : 'Tambah Agenda'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Column Left: Media (Style Publikasi) */}
                <div className="col-span-4 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Thumbnail Preview</label>
                  <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-200 rounded-[2rem] h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all overflow-hidden relative bg-slate-50/50 group">
                    {currentEvent.image ? (
                      <img src={currentEvent.image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center text-slate-300 group-hover:text-[#234E8D] transition-colors">
                        <Upload size={40} className="mx-auto mb-3 opacity-40" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Pilih Gambar</p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>

                {/* Column Right: Text (Style Publikasi) */}
                <div className="col-span-8 space-y-5 flex flex-col">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Kegiatan / Agenda</label>
                    <input type="text" placeholder="Ketik judul kegiatan..." className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-[#234E8D] transition-all shadow-sm" value={currentEvent.title} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Ringkasan Kegiatan (Sub-judul)</label>
                    <textarea placeholder="Tuliskan ringkasan singkat agenda..." className="w-full flex-1 p-5 bg-white border border-slate-200 rounded-[2rem] text-sm outline-none focus:border-[#234E8D] resize-none italic leading-relaxed text-slate-600" value={currentEvent.summary} onChange={(e) => setCurrentEvent({...currentEvent, summary: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Meta Row: Style Publikasi (bg-slate-50) */}
              <div className="bg-slate-50/80 p-7 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><CalIcon size={12} className="text-[#234E8D]"/> Tanggal</label>
                  <input type="date" value={currentEvent.date} onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-blue-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Clock size={12} className="text-[#234E8D]"/> Waktu (WIT)</label>
                  <input type="time" value={currentEvent.time} onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-blue-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={12} className="text-[#234E8D]"/> Lokasi</label>
                  <input type="text" placeholder="Nama tempat..." className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none" value={currentEvent.location} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><CheckCircle2 size={12} className="text-[#234E8D]"/> Status</label>
                  <select value={currentEvent.status} onChange={(e) => setCurrentEvent({...currentEvent, status: e.target.value})} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-black text-[#234E8D] outline-none appearance-none cursor-pointer uppercase">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISH">PUBLISH</option>
                  </select>
                </div>
              </div>

              {/* Kategori & Editor (Style Publikasi) */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Agenda</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                      <select value={currentEvent.category} onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none appearance-none shadow-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => setIsCatModalOpen(true)} className="px-5 border border-slate-200 rounded-2xl bg-white text-[#234E8D] font-black hover:bg-blue-50 transition-all">+</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <FileText size={16} className="text-[#234E8D]"/> Deskripsi Lengkap Agenda
                  </div>
                  <div className="border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm shadow-blue-900/5">
                    <Editor
                      apiKey={TINY_API_KEY}
                      value={currentEvent.description}
                      onEditorChange={(content) => setCurrentEvent({...currentEvent, description: content})}
                      init={{
                        height: 350,
                        menubar: false,
                        plugins: ['link', 'lists', 'image', 'table'],
                        toolbar: 'undo redo | fontfamily fontsize | bold italic | alignleft aligncenter | bullist numlist | link image',
                        content_style: 'body { font-family:Plus Jakarta Sans,sans-serif; font-size:14px; padding: 20px }',
                        branding: false,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions (Style Publikasi) */}
              <div className="sticky bottom-0 bg-white pt-6 border-t flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 border border-slate-200 rounded-2xl font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">Batal</button>
                <button type="submit" className="flex-[2] bg-[#234E8D] text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/30 hover:bg-[#1C3F72] transition-all flex items-center justify-center gap-3">
                  <CheckCircle2 size={18}/> Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI (Style Konsisten) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white p-7 rounded-3xl shadow-2xl w-full max-w-[320px] space-y-5 border border-white/20">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#234E8D] text-center">Tambah Kategori</h4>
            <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nama Kategori..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-[#234E8D]" />
            <div className="flex gap-2">
              <button onClick={() => setIsCatModalOpen(false)} className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batal</button>
              <button onClick={() => { if(newCatName) { setCategories([...categories, newCatName.toUpperCase()]); setCurrentEvent({...currentEvent, category: newCatName.toUpperCase()}); setIsCatModalOpen(false); setNewCatName(""); } }} className="flex-1 py-3 bg-[#234E8D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}