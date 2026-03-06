import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Editor } from '@tinymce/tinymce-react';
import { 
  Search, Plus, Pencil, Trash2, X, 
  FileText, Upload, Tag, Download,
  Filter, CheckCircle2, FileEdit, ChevronDown, Calendar, User, Clock
} from 'lucide-react';

export default function PublikasiPage() {
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q";

  // --- 1. STATE DATA UTAMA ---
  const [publikasiData, setPublikasiData] = useState([
    { 
      id: 1, 
      title: "Laporan Tahunan Pengelolaan Pesisir 2023", 
      author: "Humas KKP", 
      category: "LAPORAN", 
      status: "PUBLISH",
      date: "2024-03-01",
      subjudul: "Ringkasan capaian kinerja pengelolaan ruang laut selama periode tahun anggaran 2023.",
      thumbnail: null,
      content: "",
    },
    { 
      id: 2, 
      title: "Draft Regulasi Kawasan Konservasi 2024", 
      author: "Admin Satker", 
      category: "REGULASI", 
      status: "DRAFT",
      date: "2024-05-10",
      subjudul: "Peraturan terbaru mengenai batasan wilayah konservasi laut.",
      thumbnail: null,
      content: "",
    }
  ]);

  const [categories, setCategories] = useState(["LAPORAN", "JURNAL", "REGULASI", "BUKU"]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [currentPub, setCurrentPub] = useState({ 
    id: '', title: '', author: 'Admin Satker', category: 'LAPORAN', 
    content: '', thumbnail: null, subjudul: '', status: 'DRAFT', 
    date: new Date().toISOString().split('T')[0] 
  });

  // --- 2. LOGIKA STATISTIK ---
  const stats = useMemo(() => {
    return {
      published: publikasiData.filter(n => n.status === 'PUBLISH').length,
      draft: publikasiData.filter(n => n.status === 'DRAFT').length
    };
  }, [publikasiData]);

  // --- 3. LOGIKA FUNGSI ---
  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setPublikasiData(prev => prev.map(item => item.id === currentPub.id ? { ...currentPub } : item));
    } else {
      setPublikasiData(prev => [{ ...currentPub, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const openModal = (pub = null) => {
    if (pub) {
      setCurrentPub({ ...pub });
      setIsEditing(true);
    } else {
      setCurrentPub({ 
        id: '', title: '', author: 'Admin Satker', category: 'LAPORAN', 
        content: '', thumbnail: null, subjudul: '', status: 'DRAFT', 
        date: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const filteredData = publikasiData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <AdminHeader title="Manajemen Publikasi" subtitle="Kelola dokumen dan publikasi Satker" showSearch={false} />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* TOOLBAR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-3 items-center">
            <div className="relative flex-1 lg:max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari Publikasi..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-slate-200 outline-none focus:border-[#234E8D] bg-white shadow-sm" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm rounded-md border border-slate-200 bg-white outline-none focus:border-[#234E8D] appearance-none min-w-[160px] shadow-sm font-medium text-slate-600 cursor-pointer">
                <option value="Semua">Semua Kategori</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button onClick={() => openModal()} className="bg-[#234E8D] text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 h-10 shadow-md hover:bg-[#1C3F72]">
            <Plus className="w-4 h-4" /> Tambah Publikasi
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-5 py-3">Info Publikasi</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" /> : <FileText className="w-full h-full p-3.5 text-slate-300"/>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-bold text-[#234E8D] line-clamp-1">{item.title}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-1 italic font-medium">{item.subjudul || 'Tidak ada sub judul'}</span>
                      
                      {/* LOGIC AUTHOR & PENDING/DATE */}
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="font-semibold">{item.author}</span>
                        </div>
                        
                        {item.status === 'DRAFT' ? (
                          <div className="flex items-center gap-1 text-orange-500 font-bold uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-[#EBF1FA] text-[#234E8D] text-[10px] font-black uppercase border border-[#D5E1F2]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${item.status === 'PUBLISH' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button title="Unduh PDF" className="p-1.5 text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-all"><Download className="w-3.5 h-3.5"/></button>
                      <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 border rounded-lg transition-all"><Pencil className="w-3.5 h-3.5"/></button>
                      <button onClick={() => setPublikasiData(publikasiData.filter(p => p.id !== item.id))} className="p-1.5 text-red-500 hover:bg-red-50 border rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BERITA STYLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit Publikasi' : 'Tambah Publikasi'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Banner Utama</label>
                  <div className="relative aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group hover:border-[#234E8D] transition-all">
                    {currentPub.thumbnail ? (
                      <img src={currentPub.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                        <Upload className="w-6 h-6 text-[#234E8D] mb-2"/>
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Klik Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setCurrentPub({ ...currentPub, thumbnail: reader.result });
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" value={currentPub.title} onChange={(e) => setCurrentPub({...currentPub, title: e.target.value})} className="p-2.5 border rounded-lg text-sm outline-none focus:border-[#234E8D]" placeholder="Judul Publikasi" />
                    <input required type="text" value={currentPub.author} onChange={(e) => setCurrentPub({...currentPub, author: e.target.value})} className="p-2.5 border rounded-lg text-sm outline-none focus:border-[#234E8D]" placeholder="Penulis" />
                  </div>
                  <textarea value={currentPub.subjudul} onChange={(e) => setCurrentPub({...currentPub, subjudul: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm h-16 outline-none focus:border-[#234E8D]" placeholder="Ringkasan / Subjudul..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Tanggal Terbit</label>
                  <input type="date" value={currentPub.date} onChange={(e) => setCurrentPub({...currentPub, date: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select value={currentPub.category} onChange={(e) => setCurrentPub({...currentPub, category: e.target.value})} className="w-full p-2.5 pr-10 border rounded-lg text-sm bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => setIsCatModalOpen(true)} className="px-3 border rounded-lg bg-slate-50 text-[#234E8D] font-bold">+</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Status</label>
                  <div className="relative">
                    <select value={currentPub.status} onChange={(e) => setCurrentPub({...currentPub, status: e.target.value})} className="w-full p-2.5 pr-10 border rounded-lg text-sm font-bold text-[#234E8D] bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer">
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISH">PUBLISH</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#234E8D] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <Editor
                    apiKey={TINY_API_KEY}
                    value={currentPub.content}
                    onEditorChange={(val) => setCurrentPub({...currentPub, content: val})}
                    init={{ 
                      height: 400, 
                      menubar: true,
                      plugins: ['link', 'lists', 'image', 'table', 'code'],
                      toolbar: 'undo redo | fontfamily fontsize | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
                      branding: false,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t mt-4 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-400 text-[10px] uppercase">Batal</button>
                <button type="submit" className="flex-1 bg-[#234E8D] text-white py-3 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:bg-[#1C3F72]">Simpan Publikasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 space-y-4">
            <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-widest flex items-center gap-2"><Tag className="w-3 h-3"/> Kategori Baru</h4>
            <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nama Kategori..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
            <div className="flex gap-2">
              <button onClick={() => setIsCatModalOpen(false)} className="flex-1 py-2 text-[10px] font-bold text-slate-400">BATAL</button>
              <button onClick={() => { if(newCatName) { setCategories([...categories, newCatName.toUpperCase()]); setCurrentPub({...currentPub, category: newCatName.toUpperCase()}); setIsCatModalOpen(false); setNewCatName(""); } }} className="flex-1 py-2 bg-[#234E8D] text-white rounded-lg text-[10px] font-bold">SIMPAN</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}