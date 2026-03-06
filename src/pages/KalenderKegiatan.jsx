import React, { useState, useMemo, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { 
  Calendar as CalIcon, MapPin, Clock, Plus, 
  Search, ChevronLeft, ChevronRight, Pencil, 
  Trash2, X, Info, ChevronDown, Tag, Camera, Image as ImageIcon
} from 'lucide-react';

export default function KalenderKegiatanPage() {
  // --- 1. STATE DATA ---
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Survey Terumbu Karang Raja Ampat",
      date: new Date().toISOString().split('T')[0], // Set ke hari ini untuk testing Warning
      time: "08:00",
      location: "Pulau Mansuar",
      category: "RISET",
      image: null,
      description: "Monitoring kesehatan karang di kawasan konservasi.",
      color: "bg-green-500"
    }
  ]);

  const [categories, setCategories] = useState(["PROGRAM", "RISET", "EVENT", "INTERNAL"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);
  
  const [currentEvent, setCurrentEvent] = useState({
    id: null, title: '', date: new Date().toISOString().split('T')[0], 
    time: '09:00', location: '', category: 'PROGRAM', 
    description: '', color: 'bg-blue-500', image: null
  });

  // --- 2. LOGIKA KALENDER & WEEKLY ALERT ---
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [viewDate]);

  // Logika mendeteksi kegiatan 7 hari ke depan
  const weeklyEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    });
  }, [events]);

  // --- 3. FUNGSI HANDLE ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCurrentEvent({ ...currentEvent, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const openModal = (event = null) => {
    if (event) setCurrentEvent({ ...event });
    else setCurrentEvent({
      id: null, title: '', date: new Date().toISOString().split('T')[0], 
      time: '09:00', location: '', category: 'PROGRAM', 
      description: '', color: 'bg-blue-500', image: null
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (currentEvent.id) {
      setEvents(events.map(ev => ev.id === currentEvent.id ? currentEvent : ev));
    } else {
      setEvents([...events, { ...currentEvent, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <AdminHeader title="Kalender Kegiatan" subtitle="Jadwal operasional Satker Raja Ampat" showSearch={false} />

      <div className="flex-1 overflow-auto p-6 flex flex-col lg:flex-row gap-6 bg-slate-50/50">
        
        {/* SIDEBAR: MINI CALENDAR & WEEKLY WARNING */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* MINI CALENDAR */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-sm">
                {viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-1">
                <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-slate-500"/></button>
                <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-500"/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map(d => (
                <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(day => {
                const dateStr = day.toISOString().split('T')[0];
                const hasEvent = events.some(e => e.date === dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                return (
                  <div key={day.toString()} className={`aspect-square flex flex-col items-center justify-center text-xs rounded-lg transition-all relative
                    ${hasEvent ? 'bg-blue-50 text-[#234E8D] font-bold' : 'text-slate-600 hover:bg-slate-50'}
                    ${isToday ? 'ring-1 ring-[#234E8D] ring-inset' : ''}`}>
                    {day.getDate()}
                    {hasEvent && <div className="w-1 h-1 bg-[#234E8D] rounded-full absolute bottom-1.5"></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* WEEKLY WARNING BOX (DINAMIS) */}
          <div className={`p-5 rounded-2xl shadow-lg relative overflow-hidden transition-all duration-500 ${
            weeklyEvents.length > 0 ? 'bg-amber-500 text-white ring-4 ring-amber-500/20' : 'bg-[#234E8D] text-white'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${weeklyEvents.length > 0 ? 'bg-white/20' : 'bg-white/10'}`}>
                  <Info className="w-4 h-4"/>
                </div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest">Agenda 7 Hari Ke Depan</h4>
              </div>

              {weeklyEvents.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-medium leading-tight opacity-90">
                    Terdapat <span className="font-black text-sm">{weeklyEvents.length} kegiatan</span> yang perlu dipersiapkan:
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar-thin">
                    {weeklyEvents.map(ev => (
                      <div key={ev.id} className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                        <p className="text-[10px] font-bold truncate">{ev.title}</p>
                        <p className="text-[9px] opacity-70 italic">
                          {new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] font-medium leading-relaxed opacity-80 italic">
                  Tidak ada agenda mendesak minggu ini.
                </p>
              )}
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
          </div>
        </div>

        {/* MAIN LIST VIEW */}
        <div className="flex-1 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari kegiatan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] shadow-sm transition-all" />
            </div>
            <button onClick={() => openModal()} className="bg-[#234E8D] text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 h-10 shadow-md hover:bg-[#1C3F72]">
                        <Plus className="w-4 h-4" /> Tambah Agenda
            </button>
          </div>

          <div className="grid gap-4">
            {events.filter(e => e.title.toLowerCase().includes(search.toLowerCase())).map(event => (
              <div key={event.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex gap-5">
                {event.image ? (
                  <img src={event.image} className="w-24 h-24 rounded-xl object-cover" alt="thumb" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-300 border border-slate-100">
                    <ImageIcon className="w-6 h-6 mb-1"/>
                    <span className="text-[8px] font-bold uppercase">No Image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${event.color}`}></span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{event.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 truncate">{event.title}</h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openModal(event)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><Pencil className="w-3.5 h-3.5"/></button>
                      <button onClick={() => setEvents(events.filter(e => e.id !== event.id))} className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium italic">
                      <CalIcon className="w-3.5 h-3.5 text-[#234E8D]"/> {new Date(event.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium italic">
                      <Clock className="w-3.5 h-3.5 text-[#234E8D]"/> {event.time} WIT
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium col-span-2 md:col-span-1">
                      <MapPin className="w-3.5 h-3.5 text-[#234E8D]"/> <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Detail Agenda Satker</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSaveEvent} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              {/* UPLOAD THUMBNAIL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Thumbnail Kegiatan</label>
                <div onClick={() => fileInputRef.current.click()} className="relative border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all overflow-hidden group">
                  {currentEvent.image ? (
                    <img src={currentEvent.image} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-slate-300 mb-1 group-hover:scale-110 transition-transform"/>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pilih Gambar Kegiatan</span>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 text-blue-600">Nama Agenda</label>
                <input required value={currentEvent.title} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] shadow-sm" placeholder="Contoh: Rapat Koordinasi Wilayah..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tanggal</label>
                  <input required type="date" value={currentEvent.date} onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Waktu (WIT)</label>
                  <input required type="time" value={currentEvent.time} onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Kategori</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select value={currentEvent.category} onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})} className="w-full p-3 pr-10 border border-slate-200 rounded-xl text-sm bg-white outline-none appearance-none font-bold text-[#234E8D] shadow-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#234E8D] pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => setIsCatModalOpen(true)} className="px-3 border border-slate-200 rounded-xl bg-slate-50 text-[#234E8D] font-bold hover:bg-blue-50 transition-all shadow-sm">+</button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 text-blue-600">Lokasi Pelaksanaan</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required value={currentEvent.location} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] shadow-sm" placeholder="Contoh: Gedung Serbaguna..." />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Keterangan Singkat</label>
                <textarea value={currentEvent.description} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm h-24 outline-none focus:border-[#234E8D] resize-none shadow-sm" placeholder="Rincian singkat agenda..." />
              </div>

              <div className="flex gap-3 pt-6 border-t mt-4 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-400 text-[10px] uppercase hover:bg-slate-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#234E8D] text-white py-3.5 rounded-2xl font-bold text-[10px] uppercase shadow-xl hover:bg-[#1C3F72] transition-all">Simpan Agenda</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI BARU */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-[320px] space-y-4 animate-in zoom-in duration-200">
            <div className="flex items-center gap-2 text-[#234E8D]">
              <Tag className="w-4 h-4"/><h4 className="text-[11px] font-black uppercase tracking-widest">Tambah Kategori</h4>
            </div>
            <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nama Kategori..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D]" />
            <div className="flex gap-2">
              <button onClick={() => {setIsCatModalOpen(false); setNewCatName("")}} className="flex-1 py-2 text-[10px] font-bold text-slate-400 uppercase">Batal</button>
              <button onClick={() => { if(newCatName) { setCategories([...categories, newCatName.toUpperCase()]); setCurrentEvent({...currentEvent, category: newCatName.toUpperCase()}); setIsCatModalOpen(false); setNewCatName(""); } }} className="flex-1 py-2 bg-[#234E8D] text-white rounded-lg text-[10px] font-bold uppercase">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}