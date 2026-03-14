import React, { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Editor } from '@tinymce/tinymce-react'; 
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


import { 
  Calendar as CalIcon, MapPin, Plus, 
  Search, ChevronLeft, ChevronRight, Pencil, 
  Trash2, X, Info, ChevronDown, Tag, Image as ImageIcon, Upload, FileText,
  CheckCircle2, CalendarDays, CalendarCheck, CalendarRange, Bell,Clock, CheckCircle, BookOpen,
  CalendarClock
} from 'lucide-react';

export default function KalenderKegiatanPage() {
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q"; 

  const getTodayString = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  // --- 1. STATE DATA ---
  const [events, setEvents] = useState([]);

  const [categories, setCategories] = useState(["PROGRAM", "RISET", "EVENT", "INTERNAL"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState("semua");  

  const getToday = () => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
};

  const BASE_URL = "http://localhost:5000";

  const API_URL = BASE_URL + "/api/kegiatan";

  const [currentEvent, setCurrentEvent] = useState({ 
    id: '', title: '', location: '', category: 'PROGRAM',
    date: getTodayString(), time: '09:00',
    summary: '', description: '', image: null
  });

  const [loading,setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

 const stats = useMemo(() => {
  const today = getToday();

  return {
    total: events.length,
    onGoing: events.filter(e => new Date(e.date) >= today).length,
    terlaksana: events.filter(e => new Date(e.date) < today).length
  };

}, [events]);

  // --- 3. LOGIKA SORTING ---
  const sortedAndFilteredEvents = useMemo(() => {
    return [...events]
      .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, search]);

   const today = getToday();

  const eventsByStatus = {
    semua: sortedAndFilteredEvents,
    mendatang: sortedAndFilteredEvents.filter(
      (e) => new Date(e.date) >= today
    ),
    terlaksana: sortedAndFilteredEvents.filter(
      (e) => new Date(e.date) < today
    ),
  };

  // --- 4. LOGIKA ALERT ---
  const alerts = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const limit = new Date();
    limit.setDate(now.getDate() + 7);

    return events.filter(e => {
      const d = new Date(e.date);
      return d >= now && d <= limit;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  // --- 5. LOGIKA KALENDER ---
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentMonth]);

  // --- 6. HANDLERS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCurrentEvent(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();

    Object.keys(currentEvent).forEach((key) => {
      formData.append(key, currentEvent[key]);
    });

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

  try {
    if (isEditing) {
      await axios.patch(
              `${API_URL}/${currentEvent.id}`,
              formData
            );    
          } else {
    await axios.post(
        API_URL,
        formData
      );
    }
    fetchKegiatan();
    setIsModalOpen(false);
  } catch (err) {
    console.error(err);
  }
  };

  const openModal = (event = null) => {
    if (event) {
      setCurrentEvent({ ...event });
      setIsEditing(true);
    } else {
      setCurrentEvent({ 
        id: '', title: '', location: '', category: 'PROGRAM',
        date: getTodayString(), time: '09:00',
        summary: '', description: '', image: null
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

   const handleDelete = async (id) => {

      if (!confirm("Hapus kegiatan ini?")) return;

      try {

        await axios.delete(`${API_URL}/${id}`);

        fetchKegiatan();

      } catch (err) {
        console.error(err);
      }
    };

  const renderTable = (data) => (
  <Card className="card-ocean overflow-hidden">
    <div className="overflow-x-auto">
      <table className="data-table">

        <thead>
          <tr>
            <th>Detail Agenda</th>
            <th>Kategori</th>
            <th>Waktu & Tempat</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((event) => {

          const today = getToday();
          const isDone = new Date(event.date) < today;
            return (
              <tr key={event.id}>

                <td className="flex items-center gap-3">

                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                    {event.image ? (
                      <img
                        src={`${BASE_URL}${event.image}`}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.summary}
                    </p>
                  </div>

                </td>

                <td>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {event.category}
                  </Badge>
                </td>

                <td>
                   <p className="text-sm font-semibold text-slate-700 flex items-center gap-2"><CalIcon size={14} className="text-[#234E8D]"/> {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-xs text-muted-foreground text-slate-400 flex items-center gap-2 mt-1.5"><MapPin size={12}/> {event.location} • {event.time} WIT</p>
                  
                </td>

                <td>
                  {isDone ? (
                    <Badge className="items-center gap-1 bg-status-approved-bg text-status-approved">
                      <CheckCircle className="w-3 h-3" />
                      Terlaksana
                    </Badge>
                  ) : (
                    <Badge className="items-center gap-1 bg-status-pending-bg text-status-pending">
                      <Clock className="w-3 h-3" />
                      Mendatang
                    </Badge>
                  )}
                </td>

                <td className="flex gap-2">

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openModal(event)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      setEvents(events.filter((e) => e.id !== event.id))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  </Card>
);

  return (
    <AdminLayout>
      <AdminHeader title="Kalender Kegiatan" subtitle="Jadwal operasional Satker Raja Ampat" showSearch={false} />

      <div className="flex-1 overflow-auto p-6 space-y-6 bg-slate-50/30 font-plus text-left">
        
        {/* STATS CARDS */}
         <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">            
                  <Card className="card-ocean p-4 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <CalendarDays className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-bold leading-tight break-words">
                       { stats.total}
                        </p>
                        <p className="text-xs text-muted-foreground break-words">
                          Total Agenda
                        </p>
                      </div>
                    </div>
                  </Card>
                   <Card className="card-ocean p-4 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-status-pending-bg">
                        <CalendarClock className="w-5 h-5 text-status-pending" />
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-bold leading-tight break-words">
                          {stats.onGoing}
                        </p>
                        <p className="text-xs text-muted-foreground break-words">
                          Mendatang
                        </p>
                      </div>
                    </div>
                  </Card>
                    <Card className="card-ocean p-4 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-status-approved-bg">
                        <CalendarCheck className="w-5 h-5 text-status-approved" />
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-bold leading-tight break-words">
                          {stats.terlaksana}
                        </p>
                        <p className="text-xs text-muted-foreground break-words">
                          Terlaksana
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

        

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                  {currentMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={16}/></button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={16}/></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-4 text-[10px] font-black text-slate-300 uppercase">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;
                  const today = new Date();
                  const isToday = 
                    day.getDate() === today.getDate() &&
                    day.getMonth() === today.getMonth() &&
                    day.getFullYear() === today.getFullYear();
                  const dayString = day.toLocaleDateString('en-CA');
                  const hasEvent = events.some(e => e.date === dayString);
                  return (
                    <div key={day.toString()} className={`aspect-square flex items-center justify-center text-[11px] rounded-xl transition-all
                      ${isToday 
                        ? 'bg-[#234E8D] text-white ring-4 ring-blue-100 shadow-md scale-110 font-bold' 
                        : hasEvent 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-slate-500 hover:bg-slate-50 font-medium'}`}>
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-amber-600">
                  <Bell size={16} className="animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Peringatan Agenda</span>
                </div>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex gap-3 group">
                       <div className="w-1 bg-amber-300 rounded-full group-hover:bg-amber-500 transition-colors"></div>
                       <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{alert.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {new Date(alert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {alert.time} WIT
                          </p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 gap-3 items-center">
                <div className="relative flex-1 lg:max-w-[400px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                               placeholder="Cari Kalender Kegiatan..."
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}
                               className="pl-9 bg-card"
                             />
                </div>
              </div>
               <Button className="btn-ocean gap-2" onClick={() => openModal()}>
                    <Plus className="w-4 h-4"/>
                      Tambah Agenda
                </Button>
            </div>

            <Tabs
  value={activeTab}
  onValueChange={setActiveTab}
  className="w-full"
>

  <TabsList className="grid w-full grid-cols-3 mb-4">

    <TabsTrigger value="semua" className="gap-2">
      <FileText className="w-4 h-4" />
      Semua ({eventsByStatus.semua.length})
    </TabsTrigger>

    <TabsTrigger value="mendatang" className="gap-2">
      <Clock className="w-4 h-4" />
      Mendatang ({eventsByStatus.mendatang.length})
    </TabsTrigger>

    <TabsTrigger value="terlaksana" className="gap-2">
      <CheckCircle className="w-4 h-4" />
      Terlaksana ({eventsByStatus.terlaksana.length})
    </TabsTrigger>

  </TabsList>

  <TabsContent value="semua">
    {renderTable(eventsByStatus.semua)}
  </TabsContent>

  <TabsContent value="mendatang">
    {renderTable(eventsByStatus.mendatang)}
  </TabsContent>

  <TabsContent value="terlaksana">
    {renderTable(eventsByStatus.terlaksana)}
  </TabsContent>

</Tabs>

           
          </div>
        </div>
      </div>

      {/* MODAL INPUT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-100 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden font-plus text-left">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                {isEditing ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-400"/>
              </button>
            </div>
            
            {/* INI BAGIAN YANG SAYA PERBAIKI: Inline style untuk scrollbar tipis */}
            <form 
              onSubmit={handleSave} 
              className="p-6 space-y-6 overflow-y-auto"
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#cbd5e160 transparent' 
              }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                form::-webkit-scrollbar { width: 5px; }
                form::-webkit-scrollbar-track { background: transparent; }
                form::-webkit-scrollbar-thumb { 
                  background-color: rgba(203, 213, 225, 0.5); 
                  border-radius: 10px; 
                }
              `}} />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Thumbnail Agenda</label>
                    <div className="relative aspect-video h-[165px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group hover:border-[#234E8D] transition-all">
                        {currentEvent.image ? (
                          <img src={`${BASE_URL}${currentEvent.image}`} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                              <Upload className="w-6 h-6 text-[#234E8D] mb-1"/>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Upload Gambar</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0];
                               setThumbnailFile(file);

                                const preview = URL.createObjectURL(file);

                                setCurrentEvent({
                                  ...currentEvent,
                                  image: preview
                                });}} />
                          </label>
                        )}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <label className="text-[10px] font-bold text-[#234E8D] uppercase flex items-center gap-2 mb-2"><Info size={14}/> Info</label>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">Input waktu WIT sesuai zona operasional.</p>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nama Kegiatan</label>
                    <input required type="text" value={currentEvent.title} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] font-semibold" placeholder="Nama Agenda..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Lokasi</label>
                      <input required type="text" value={currentEvent.location} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D]" placeholder="Lokasi..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Kategori</label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <select value={currentEvent.category} onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none appearance-none cursor-pointer font-semibold">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        <button type="button" onClick={() => setIsCatModalOpen(true)} className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"><Plus size={18}/></button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Ringkasan Singkat</label>
                    <textarea value={currentEvent.summary} onChange={(e) => setCurrentEvent({...currentEvent, summary: e.target.value})} className="w-full h-20 p-3 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:border-[#234E8D]" placeholder="Tulis ringkasan singkat..." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tanggal</label>
                  <input type="date" value={currentEvent.date} onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#234E8D]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Waktu (WIT)</label>
                  <input type="time" value={currentEvent.time} onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#234E8D]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={14} className="text-[#234E8D]"/> Detail Narasi</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <Editor
                    apiKey={TINY_API_KEY}
                    value={currentEvent.description}
                    onEditorChange={(val) => setCurrentEvent({...currentEvent, description: val})}
                    init={{ height: 250, menubar: false, plugins: ['link', 'lists', 'image', 'code'], toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code', branding: false }}
                  />
                </div>
              </div>
                <div className="flex gap-3 pt-4 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-2 border border-slate-200 rounded-md font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors text-sm shadow-sm"
                  >
                    Batal
                  </button>
                  
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-[#234E8D] text-white rounded-md font-semibold text-sm shadow-md hover:bg-[#1C3F72] flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 size={16}/> Simpan Agenda
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm font-plus">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 space-y-4 text-left border border-slate-100">
            <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-widest flex items-center gap-2"><Tag className="w-3 h-3"/> Kategori Baru</h4>
            <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nama Kategori..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-semibold focus:border-[#234E8D]" />
            <div className="flex gap-2">
              <button onClick={() => setIsCatModalOpen(false)} className="flex-1 py-2 text-[10px] font-bold text-slate-400 uppercase">BATAL</button>
              <button onClick={() => { if(newCatName) { setCategories([...categories, newCatName.toUpperCase()]); setCurrentEvent({...currentEvent, category: newCatName.toUpperCase()}); setIsCatModalOpen(false); setNewCatName(""); } }} className="flex-1 py-2 bg-[#234E8D] text-white rounded-lg text-[10px] font-bold uppercase shadow-md">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}