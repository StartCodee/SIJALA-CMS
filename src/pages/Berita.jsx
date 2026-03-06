import React, { useState, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE
import { 
  Search, Plus, Pencil, Trash2, X, Save, 
  Calendar, User, Newspaper, Image as ImageIcon, 
  Upload, Tag 
} from 'lucide-react';

export default function BeritaPage() {
  const editorRef = useRef(null);
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q";
  // 1. STATE DATA
  const [newsData, setNewsData] = useState([
    { 
      id: "BRT-001", 
      title: "Penemuan Spesies Karang Baru di Raja Ampat", 
      author: "Admin KKP", 
      date: "2024-03-10", 
      category: "Riset", 
      image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=400",
      content: "<p>Para peneliti menemukan spesies karang unik di kedalaman 30 meter wilayah perairan Raja Ampat bagian utara...</p>" 
    },
    { 
      id: "BRT-002", 
      title: "Peningkatan Kunjungan Wisatawan Lokal", 
      author: "Rudi Hartono", 
      date: "2024-03-12", 
      category: "Program", 
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400",
      content: "<p>Data menunjukkan kenaikan signifikan pariwisata domestik selama kuartal pertama tahun ini berkat promosi digital...</p>" 
    },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState({ 
    id: '', title: '', author: '', date: '', category: 'Umum', content: '', image: null 
  });

  // 2. FUNGSI LOGIKA
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentNews({ ...currentNews, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (news = null) => {
    if (news) {
      setCurrentNews(news);
      setIsEditing(true);
    } else {
      const newId = `BRT-${Math.floor(100 + Math.random() * 900)}`;
      setCurrentNews({ 
        id: newId, 
        title: '', 
        author: 'Admin Raja Ampat', 
        date: new Date().toISOString().split('T')[0], 
        category: 'Umum', 
        content: '',
        image: null 
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setNewsData(newsData.map(item => item.id === currentNews.id ? currentNews : item));
    } else {
      setNewsData([currentNews, ...newsData]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm(`Hapus berita dengan ID ${id}?`)) {
      setNewsData(newsData.filter(item => item.id !== id));
    }
  };

  // Fungsi untuk membersihkan tag HTML agar bisa jadi ringkasan teks biasa
  const stripHtml = (html) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  const filteredNews = newsData.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AdminHeader 
        title="Manajemen Berita" 
        subtitle="Kelola konten dan publikasi berita aplikasi" 
        showSearch={false}
      />
      
      <div className="flex-1 overflow-auto overscroll-contain p-6 space-y-6">
        
        {/* STATS CARDS */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          <div className="bg-[#234E8D] p-5 rounded-xl text-white shadow-sm flex justify-between items-center transition-transform hover:scale-[1.01]">
            <div>
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-80">Total Publikasi</p>
              <h3 className="text-2xl font-bold mt-0.5">{newsData.length} <span className="text-xs font-normal opacity-70 ml-1">POST</span></h3>
            </div>
            <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm border border-white/10">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.01]">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kategori Aktif</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-0.5">04 <span className="text-xs font-normal text-slate-300 ml-1">GRUP</span></h3>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[#234E8D]">
              <Tag className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-[520px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari ID Berita, Judul, atau Penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-slate-200 bg-white focus:border-[#234E8D] focus:ring-1 focus:ring-[#234E8D] outline-none transition-all shadow-sm"
            />
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#234E8D] hover:bg-[#1C3F72] text-white px-4 py-2 rounded-md font-semibold text-sm transition-all shadow-sm w-full lg:w-auto h-10 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Berita
          </button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Informasi Berita</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Penulis</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Kategori</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 align-top">
                      <span className="font-mono text-[10px] font-bold text-slate-400 tracking-tight">{item.id}</span>
                    </td>
                    <td className="px-5 py-4 max-w-[420px]">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" alt="thumb" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-5 h-5"/></div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-bold text-[#234E8D] line-clamp-1 leading-tight uppercase tracking-tight">
                            {item.title}
                          </span>
                          {/* RINGKASAN DETAIL BERITA */}
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic pr-4">
                            {stripHtml(item.content) || "Tidak ada ringkasan konten..."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{item.author}</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[#234E8D] text-[9px] font-black uppercase border border-blue-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center align-top">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => openModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-all bg-white shadow-sm"><Pencil className="w-3.5 h-3.5"/></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-all bg-white shadow-sm"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FORM WITH TINYMCE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit Publikasi Berita' : 'Tambah Berita Baru'}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{currentNews.id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-full transition-all"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gambar Utama</label>
                <div className="relative group border border-dashed border-slate-300 rounded-xl p-2 bg-slate-50 transition-colors hover:border-[#234E8D]">
                  {currentNews.image ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden max-h-[200px]">
                      <img src={currentNews.image} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setCurrentNews({...currentNews, image: null})} className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-lg shadow-sm hover:bg-red-50"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-10 gap-2 cursor-pointer">
                      <Upload className="w-6 h-6 text-[#234E8D]"/>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Pilih Banner Berita</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Judul Berita</label>
                  <input required type="text" value={currentNews.title} onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white focus:border-[#234E8D] outline-none text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Penulis</label>
                  <input required type="text" value={currentNews.author} onChange={(e) => setCurrentNews({...currentNews, author: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white focus:border-[#234E8D] outline-none text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Tanggal Publish</label>
                  <input required type="date" value={currentNews.date} onChange={(e) => setCurrentNews({...currentNews, date: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white focus:border-[#234E8D] outline-none text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Kategori</label>
                  <select value={currentNews.category} onChange={(e) => setCurrentNews({...currentNews, category: e.target.value})} className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white focus:border-[#234E8D] outline-none text-sm font-medium appearance-none">
                    <option value="Umum">Umum</option><option value="Riset">Riset</option><option value="Program">Program</option><option value="Event">Event</option>
                  </select>
                </div>
              </div>

              {/* TINYMCE EDITOR INTEGRATION */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Isi Konten</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <Editor
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={currentNews.content}
                    onEditorChange={(newValue) => setCurrentNews({...currentNews, content: newValue})}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                      toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                      content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                      skin: 'oxide',
                      promotion: false,
                      branding: false
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all text-[11px] uppercase tracking-widest">
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-[#234E8D] px-4 py-2.5 rounded-lg font-bold text-white hover:bg-[#1C3F72] transition-all flex items-center justify-center gap-2 shadow-md text-[11px] uppercase tracking-widest">
                  <Save className="w-4 h-4" /> Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}