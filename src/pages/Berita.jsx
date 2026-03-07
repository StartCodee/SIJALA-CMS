import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Editor } from '@tinymce/tinymce-react';
import { 
  Search, Plus, Pencil, Trash2, X, 
  Image as ImageIcon, Upload, Tag, 
  Filter, CheckCircle2, ChevronDown, Calendar, User, Clock,
  Newspaper, Link as LinkIcon
} from 'lucide-react';

export default function BeritaPage() {
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q";

  // --- 1. STATE DATA UTAMA ---
  const [newsData, setNewsData] = useState([
    { 
      id: 1, 
      title: "Penanaman Mangrove di Pesisir Sorong", 
      author: "Admin KKP", 
      category: "PROGRAM", 
      status: "PUBLISH",
      date: "2024-05-20",
      subjudul: "Upaya pencegahan abrasi pantai di wilayah timur Indonesia melalui program rehabilitasi vegetasi pesisir.",
      thumbnail: null,
      content: "",
      linkSource: ""
    },
    { 
      id: 2, 
      title: "Riset Terumbu Karang Raja Ampat", 
      author: "Rudi Hartono", 
      category: "RISET", 
      status: "DRAFT",
      date: "2024-05-25",
      subjudul: "Hasil observasi awal tim peneliti kelautan mengenai dampak pemanasan suhu air laut.",
      thumbnail: null,
      content: "",
      linkSource: ""
    }
  ]);

  const [categories, setCategories] = useState(["UMUM", "RISET", "PROGRAM", "EVENT"]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [currentNews, setCurrentNews] = useState({ 
    id: '', title: '', author: 'Admin Satker', category: 'UMUM', 
    content: '', thumbnail: null, subjudul: '', status: 'DRAFT', 
    linkSource: '', date: new Date().toISOString().split('T')[0] 
  });

  // --- 2. LOGIKA STATISTIK ---
  const stats = useMemo(() => {
    return {
      total: newsData.length,
      published: newsData.filter(n => String(n.status).toUpperCase() === 'PUBLISH').length,
      draft: newsData.filter(n => String(n.status).toUpperCase() === 'DRAFT').length
    };
  }, [newsData]);

  // --- 3. LOGIKA FUNGSI ---
  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setNewsData(prev => prev.map(item => item.id === currentNews.id ? { ...currentNews } : item));
    } else {
      setNewsData(prev => [{ ...currentNews, id: Date.now() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const openModal = (news = null) => {
    if (news) {
      setCurrentNews({ ...news });
      setIsEditing(true);
    } else {
      setCurrentNews({ 
        id: '', title: '', author: 'Admin Satker', category: 'UMUM', 
        content: '', thumbnail: null, subjudul: '', status: 'DRAFT', 
        linkSource: '', date: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const filteredNews = newsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <AdminHeader title="Manajemen Berita" subtitle="Kelola konten dan publikasi berita" showSearch={false} />
      
      <div className="flex-1 overflow-auto p-6 space-y-6 bg-slate-50/30">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#234E8D]"><Newspaper size={20}/></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Berita</p>
                    <p className="text-lg font-bold text-slate-800">{stats.total}</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600"><CheckCircle2 size={20}/></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Published</p>
                    <p className="text-lg font-bold text-slate-800">{stats.published}</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600"><Clock size={20}/></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Draft / Pending</p>
                    <p className="text-lg font-bold text-slate-800">{stats.draft}</p>
                </div>
            </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-3 items-center">
            <div className="relative flex-1 lg:max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari Berita..." value={search} onChange={(e) => setSearch(e.target.value)}
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
            <Plus className="w-4 h-4" /> Tambah Berita
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-5 py-3">Konten Berita</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3.5 text-slate-300"/>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-bold text-[#234E8D] line-clamp-1">{item.title}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-1 italic font-medium">{item.subjudul || 'Tidak ada ringkasan'}</span>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1 font-semibold"><User size={12}/> {item.author}</div>
                        {String(item.status).toUpperCase() === 'DRAFT' ? (
                          <div className="flex items-center gap-1 text-orange-500 font-bold uppercase tracking-wider"><Clock size={12}/> Pending</div>
                        ) : (
                          <div className="flex items-center gap-1"><Calendar size={12}/> {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
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
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${String(item.status).toUpperCase() === 'PUBLISH' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-2">
                        <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 border rounded-lg transition-all"><Pencil className="w-3.5 h-3.5"/></button>
                        <button onClick={() => setNewsData(newsData.filter(n => n.id !== item.id))} className="p-1.5 text-red-500 hover:bg-red-50 border rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT BERITA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{isEditing ? 'Edit Konten Berita' : 'Tambah Berita Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              
              {/* TOP SECTION: MEDIA & TEXT (STRETCHED) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* LEFT: BANNER PREVIEW */}
                <div className="md:col-span-4 flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Banner Utama</label>
                  <div className="relative aspect-video h-[185px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group hover:border-[#234E8D] transition-all shadow-inner">
                      {currentNews.thumbnail ? (
                        <img src={currentNews.thumbnail} className="w-full h-full object-cover" />
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                            <Upload className="w-6 h-6 text-[#234E8D] mb-2"/>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Klik untuk Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setCurrentNews({ ...currentNews, thumbnail: reader.result });
                                  reader.readAsDataURL(file);
                              }
                            }} />
                        </label>
                      )}
                  </div>
                </div>

                {/* RIGHT: TITLE & EXTENDED SUBTITLE */}
                <div className="md:col-span-8 flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Judul Utama Berita</label>
                      <input required type="text" value={currentNews.title} onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm font-semibold" placeholder="Input judul berita..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Penulis / Kontributor</label>
                      <input required type="text" value={currentNews.author} onChange={(e) => setCurrentNews({...currentNews, author: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm font-semibold" placeholder="Nama penulis..." />
                    </div>
                  </div>

                  {/* SUBJUDUL - SEKARANG MENGISI RUANG KOSONG (FLEX-1) */}
                  <div className="flex-1 flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ringkasan / Subjudul Berita</label>
                    <textarea 
                      value={currentNews.subjudul} 
                      onChange={(e) => setCurrentNews({...currentNews, subjudul: e.target.value})} 
                      className="w-full flex-1 min-h-[120px] p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm resize-none leading-relaxed italic" 
                      placeholder="Tulis ringkasan singkat isi berita..." 
                    />
                  </div>
                </div>
              </div>

              {/* METADATA FIELDS - TANPA KOTAK PEMBUNGKUS BESAR */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Tanggal Dibuat</label>
                  <input type="date" value={currentNews.date} onChange={(e) => setCurrentNews({...currentNews, date: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm cursor-pointer" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Kategori Konten</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select value={currentNews.category} onChange={(e) => setCurrentNews({...currentNews, category: e.target.value})} className="w-full p-2.5 pr-10 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer font-bold text-slate-700 shadow-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => setIsCatModalOpen(true)} className="px-3 bg-white border border-slate-200 rounded-lg text-[#234E8D] font-black hover:bg-blue-50 transition-colors shadow-sm">+</button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Status Publish</label>
                  <div className="relative">
                    <select value={currentNews.status} onChange={(e) => setCurrentNews({...currentNews, status: e.target.value})} className="w-full p-2.5 pr-10 border border-slate-200 rounded-lg text-sm font-bold text-[#234E8D] bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer shadow-sm">
                      <option value="DRAFT">DRAFT (Sembunyikan)</option>
                      <option value="PUBLISH">PUBLISH (Tampilkan)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#234E8D] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1"><LinkIcon size={10}/> Sumber Referensi</label>
                  <input type="text" value={currentNews.linkSource} onChange={(e) => setCurrentNews({...currentNews, linkSource: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm" placeholder="URL Link..." />
                </div>
              </div>

              {/* EDITOR KONTEN */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Newspaper size={14} className="text-[#234E8D]"/> Narasi Lengkap Berita
                </label>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <Editor
                    apiKey={TINY_API_KEY}
                    value={currentNews.content}
                    onEditorChange={(val) => setCurrentNews({...currentNews, content: val})}
                    init={{ 
                      height: 380, 
                      menubar: true,
                      plugins: ['link', 'lists', 'image', 'table', 'code', 'advlist'],
                      toolbar: 'undo redo | fontfamily fontsize | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code',
                      branding: false,
                    }}
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-400 text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-[#234E8D] text-white py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:shadow-[#234E8D]/20 hover:bg-[#1C3F72] transition-all">Simpan Berita</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 space-y-4 border border-slate-100">
            <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-widest flex items-center gap-2"><Tag className="w-3 h-3"/> Tambah Kategori</h4>
            <input autoFocus value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nama Kategori..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D]" />
            <div className="flex gap-2">
              <button onClick={() => setIsCatModalOpen(false)} className="flex-1 py-2 text-[10px] font-bold text-slate-400 uppercase">Batal</button>
              <button onClick={() => { if(newCatName) { setCategories([...categories, newCatName.toUpperCase()]); setCurrentNews({...currentNews, category: newCatName.toUpperCase()}); setIsCatModalOpen(false); setNewCatName(""); } }} className="flex-1 py-2 bg-[#234E8D] text-white rounded-lg text-[10px] font-bold uppercase">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}