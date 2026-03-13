import React, { useState, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Editor } from "@tinymce/tinymce-react";

import { Search, Plus, Pencil, X,Upload,ChevronDown,LinkIcon,Newspaper, CheckCircle2, Trash2, Image as ImageIcon, FileText, CheckCircle, Clock} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BeritaPage() {
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q";

  const [newsData, setNewsData] = useState([
    {
      id: 1,
      title: "Penanaman Mangrove di Pesisir Sorong",
      author: "Admin KKP",
      category: "PROGRAM",
      status: "PUBLISH",
      date: "2024-05-20",
      subjudul: "Upaya pencegahan abrasi pantai",
      thumbnail: null,
      content: "",
    },
    {
      id: 2,
      title: "Riset Terumbu Karang Raja Ampat",
      author: "Rudi Hartono",
      category: "RISET",
      status: "DRAFT",
      date: "2024-05-25",
      subjudul: "Hasil observasi awal tim peneliti",
      thumbnail: null,
      content: "",
    },
  ]);

  const [categories, setCategories] = useState([
    "UMUM",
    "RISET",
    "PROGRAM",
    "EVENT",
  ]);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);


  const [isEditing, setIsEditing] = useState(false);

  const [currentNews, setCurrentNews] = useState({
    title: "",
    author: "",
    category: "UMUM",
    subjudul: "",
    status: "DRAFT",
    date: "",
    content: "",
    thumbnail: null,
  });

  const [activeTab, setActiveTab] = useState("semua");

  const filteredData = useMemo(() => {
    return newsData.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [newsData, search]);

  const newsByStatus = {
  semua: filteredData,
  publish: filteredData.filter((n) => n.status === "PUBLISH"),
  draft: filteredData.filter((n) => n.status === "DRAFT"),
};

  const stats = useMemo(
    () => ({
      total: newsData.length,
      published: newsData.filter((n) => n.status === "PUBLISH").length,
      draft: newsData.filter((n) => n.status === "DRAFT").length,
    }),
    [newsData]
  );

  const openModal = (news = null) => {
    if (news) {
      setCurrentNews(news);
      setIsEditing(true);
    } else {
      setCurrentNews({
        title: "",
        author: "",
        category: "UMUM",
        subjudul: "",
        status: "DRAFT",
        date: "",
        content: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (isEditing) {
      setNewsData((prev) =>
        prev.map((item) =>
          item.id === currentNews.id ? currentNews : item
        )
      );
    } else {
      setNewsData((prev) => [
        { ...currentNews, id: Date.now() },
        ...prev,
      ]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setNewsData((prev) => prev.filter((n) => n.id !== id));
  };

  const renderTable = (data) => (
  <Card className="card-ocean overflow-hidden">
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.subjudul}
                  </p>
                </div>
              </td>

              <td>
                <Badge variant="outline" className="text-xs font-semibold">
                  {item.category}
                </Badge>
              </td>

              <td>
                {item.status === "PUBLISH" ? (
                   <Badge className="items-center gap-1 bg-status-approved-bg text-status-approved">
                    <CheckCircle className="w-3 h-3" />
                    Publish
                  </Badge>
                ) : (
                  <Badge className="items-center gap-1 bg-status-pending-bg text-status-pending">
                    <Clock className="w-3 h-3" />
                    Draft
                  </Badge>
                )}
              </td>

              <td><p className="text-sm text-muted-foreground">{item.date}</p></td>

              <td className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => openModal(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

  return (
    <AdminLayout>
      <AdminHeader
        title="Manajemen Berita"
        subtitle="Kelola konten berita"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">

        {/* STATS */}
        <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">            
          <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold leading-tight break-words">
               { stats.total}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Total Berita
                </p>
              </div>
            </div>
          </Card>
           <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-approved-bg">
                <CheckCircle className="w-5 h-5 text-status-approved" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
                  {stats.published}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Published
                </p>
              </div>
            </div>
          </Card>
            <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-pending-bg">
                <Clock className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
                  {stats.draft}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Draft
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* SEARCH */}
        <div className="mb-4 flex justify-between items-end gap-3">

          <div className="relative w-full max-w-[420px]">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>

            <Input
              placeholder="Cari Berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />

          </div>

          <Button className="btn-ocean gap-2" onClick={() => openModal()}>
            <Plus className="w-4 h-4"/>
            Tambah Berita
          </Button>

        </div>

       {/* FILTER TABS */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >

          <TabsList className="grid w-full grid-cols-3 mb-4 no-print">            
            <TabsTrigger value="semua" className="gap-2">
              <FileText className="w-4 h-4"/>
              Semua ({newsByStatus.semua.length})
            </TabsTrigger>

            <TabsTrigger value="publish" className="gap-2">
              <CheckCircle className="w-4 h-4"/>
              Publish ({newsByStatus.publish.length})
            </TabsTrigger>

            <TabsTrigger value="draft" className="gap-2">
              <Clock className="w-4 h-4"/>
              Draft ({newsByStatus.draft.length})
            </TabsTrigger>

          </TabsList>

          <TabsContent value="semua">
            {renderTable(newsByStatus.semua)}
          </TabsContent>

          <TabsContent value="publish">
            {renderTable(newsByStatus.publish)}
          </TabsContent>

          <TabsContent value="draft">
            {renderTable(newsByStatus.draft)}
          </TabsContent>

        </Tabs>

      </div>

      {/* MODAL */}
      {/* MODAL INPUT BERITA (KATEGORI SEJAJAR) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{isEditing ? 'Edit Konten Berita' : 'Tambah Berita Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
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

              {/* BARIS INPUT SEJAJAR */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Tanggal Dibuat</label>
                  <input type="date" value={currentNews.date} onChange={(e) => setCurrentNews({...currentNews, date: e.target.value})} className="w-full h-11 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm cursor-pointer" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Kategori Konten</label>
                  <div className="flex gap-1 h-11">
                    <div className="relative flex-1">
                      <select value={currentNews.category} onChange={(e) => setCurrentNews({...currentNews, category: e.target.value})} className="w-full h-full p-2.5 pr-10 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer font-bold text-slate-700 shadow-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => setIsCatModalOpen(true)} className="px-3 bg-white border border-slate-200 rounded-lg text-[#234E8D] font-black hover:bg-blue-50 transition-colors shadow-sm">+</button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Status Publish</label>
                  <div className="relative h-11">
                    <select value={currentNews.status} onChange={(e) => setCurrentNews({...currentNews, status: e.target.value})} className="w-full h-full p-2.5 pr-10 border border-slate-200 rounded-lg text-sm font-bold text-[#234E8D] bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer shadow-sm">
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISH">PUBLISH</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#234E8D] pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1"><LinkIcon size={10}/> Sumber Referensi</label>
                  <input type="text" value={currentNews.linkSource} onChange={(e) => setCurrentNews({...currentNews, linkSource: e.target.value})} className="w-full h-11 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm" placeholder="URL Link..." />
                </div>
              </div>

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
                  <CheckCircle2 size={16}/> Simpan Berita
                </button>
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