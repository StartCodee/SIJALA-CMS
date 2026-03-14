import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";
import { 
  Search, Plus, Pencil, Trash2, X, 
  FileText, Upload, Tag, Download,
  Filter, CheckCircle2, ChevronDown, Calendar, User, Clock,
  FileDown, BookOpen, ChevronLeft, ChevronRight, CheckCircle, Image as ImageIcon 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { set } from 'date-fns';


export default function PublikasiPage() {
  const TINY_API_KEY = "eybf5twbyft2lx292gpajz8ru701uxg4upqd3zy9c270ng7q";
  const pdfInputRef = useRef(null);

  // --- 1. STATE DATA UTAMA ---
  const BASE_URL = "http://localhost:5000";
  const API_URL = BASE_URL + "/api/publikasi";
  const [publikasiData, setPublikasiData] = useState([]);

  const [categories, setCategories] = useState(["LAPORAN", "JURNAL", "REGULASI", "BUKU"]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [activeTab, setActiveTab] = useState("semua");
  const [loading,setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  useEffect(() => {
    fetchPublikasi();
  }, []);

  const fetchPublikasi = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setPublikasiData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  // STATE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [currentPub, setCurrentPub] = useState({ 
    id: '', title: '', author: 'Admin Satker', category: 'LAPORAN', 
    content: '', thumbnail: null, subjudul: '', status: 'DRAFT', 
    date: new Date().toISOString().split('T')[0],
    pdfFile: null
  });

  // --- 2. LOGIKA STATISTIK ---
  const stats = useMemo(() => {
    return {
      total: publikasiData.length,
      published: publikasiData.filter(n => n.status === 'PUBLISH').length,
      draft: publikasiData.filter(n => n.status === 'DRAFT').length
    };
  }, [publikasiData]);

  // --- 3. LOGIKA FILTER, SORT, & PAGINATION ---
  const sortedAndFilteredData = useMemo(() => {
    return publikasiData
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [publikasiData, search, selectedCategory]);
;

   const publikasiByStatus = {
  semua: sortedAndFilteredData,
  publish: sortedAndFilteredData.filter((n) => n.status === "PUBLISH"),
  draft: sortedAndFilteredData.filter((n) => n.status === "DRAFT"),
};

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredData, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  // --- 4. HANDLERS ---
  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();

     formData.append("title", currentPub.title);
    formData.append("author", currentPub.author);
    formData.append("category", currentPub.category);
    formData.append("status", currentPub.status);
    formData.append("date", currentPub.date);
    formData.append("subjudul", currentPub.subjudul);
    formData.append("content", currentPub.content);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    if (currentPub.pdfFile) {
    formData.append("pdf", currentPub.pdfFile);
  }

  try {

    if (isEditing) {
      await axios.patch(
        `${API_URL}/${currentPub.id}`,
        formData
      );
    } else {
    await axios.post(
        API_URL,
        formData
      );
    }

    fetchPublikasi();
    setIsModalOpen(false);

  } catch (err) {
    console.error(err);
    }
  };

  const openModal = (pub = null) => {
    if (pub) {
      setCurrentPub({ ...pub });
      setIsEditing(true);
    } else {
      setCurrentPub({ 
        id: '', title: '', author: 'Admin Satker', category: 'LAPORAN', 
        content: '', thumbnail: null, subjudul: '', status: 'DRAFT', 
        date: new Date().toISOString().split('T')[0],
        pdfFile: null
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {

  if (!confirm("Hapus publikasi ini?")) return;

  try {

    await axios.delete(`${API_URL}/${id}`);

    fetchPublikasi();

  } catch (err) {
    console.error(err);
  }

};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCurrentPub({ 
        ...currentPub, 
        pdfFile: file
      });
    }
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
                      src={`${BASE_URL}${item.thumbnail}`}
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
      <AdminHeader title="Manajemen Publikasi" subtitle="Kelola dokumen dan publikasi" showSearch={false} />
      
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
                  Total Publikasi
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
                <p className="text-base sm:text-lg font-bold leading-tight break-words">
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
                <p className="text-base sm:text-lg font-bold leading-tight break-words">
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
              placeholder="Cari Publikasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />

          </div>

          <Button className="btn-ocean gap-2" onClick={() => openModal()}>
            <Plus className="w-4 h-4"/>
            Tambah Publikasi
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
              Semua ({publikasiByStatus.semua.length})
            </TabsTrigger>

            <TabsTrigger value="publish" className="gap-2">
              <CheckCircle className="w-4 h-4"/>
              Publish ({publikasiByStatus.publish.length})
            </TabsTrigger>

            <TabsTrigger value="draft" className="gap-2">
              <Clock className="w-4 h-4"/>
              Draft ({publikasiByStatus.draft.length})
            </TabsTrigger>

          </TabsList>

          <TabsContent value="semua">
            {renderTable(publikasiByStatus.semua)}
          </TabsContent>

          <TabsContent value="publish">
            {renderTable(publikasiByStatus.publish)}
          </TabsContent>

          <TabsContent value="draft">
            {renderTable(publikasiByStatus.draft)}
          </TabsContent>

        </Tabs>
        </div>

      {/* MODAL PUBLIKASI STYLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{isEditing ? 'Edit Publikasi' : 'Tambah Publikasi'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* LEFT SIDE: THUMBNAIL & PDF */}
                <div className="md:col-span-4 flex flex-col gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Thumbnail Preview</label>
                    <div className="relative aspect-video h-[165px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group hover:border-[#234E8D] transition-all">
                        {currentPub.thumbnail ? (
                          <img src={`${BASE_URL}${currentPub.thumbnail}`} className="w-full h-full object-cover" />
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                              <Upload className="w-6 h-6 text-[#234E8D] mb-1"/>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Upload Image</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0];
                               setThumbnailFile(file);

                                const preview = URL.createObjectURL(file);

                                setCurrentPub({
                                  ...currentPub,
                                  thumbnail: preview
                                });
                              }} />
                          </label>
                        )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="text-[10px] font-bold text-[#234E8D] uppercase tracking-widest flex items-center gap-2 mb-2">
                        <FileDown size={14}/> Lampiran PDF
                    </label>
                    {currentPub.pdfFile ? (
                        <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-700 truncate flex-1 pr-2 italic">{currentPub.pdfFile.name}</span>
                            <button type="button" onClick={() => setCurrentPub({...currentPub, pdfFile: null})} className="text-red-500 p-1 hover:bg-red-50 rounded"><X size={14}/></button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => pdfInputRef.current.click()} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 hover:border-[#234E8D] hover:text-[#234E8D] bg-white transition-all">PILIH FILE PDF</button>
                    )}
                    <input ref={pdfInputRef} type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </div>
                </div>

                {/* RIGHT SIDE: TEXT INPUTS */}
                <div className="md:col-span-8 flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Judul Dokumen</label>
                      <input required type="text" value={currentPub.title} onChange={(e) => setCurrentPub({...currentPub, title: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm font-semibold" placeholder="Input judul publikasi..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Penulis / Sumber</label>
                      <input required type="text" value={currentPub.author} onChange={(e) => setCurrentPub({...currentPub, author: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm font-semibold" placeholder="Nama penulis..." />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ringkasan Singkat / Sub Judul</label>
                    <textarea value={currentPub.subjudul} onChange={(e) => setCurrentPub({...currentPub, subjudul: e.target.value})} className="w-full flex-1 min-h-[120px] p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm resize-none italic leading-relaxed" placeholder="Tulis ringkasan publikasi di sini..." />
                  </div>
                </div>
              </div>

              {/* METADATA BAR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tanggal Terbit</label>
                  <input type="date" value={currentPub.date} onChange={(e) => setCurrentPub({...currentPub, date: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#234E8D] bg-white shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Kategori</label>
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <select value={currentPub.category} onChange={(e) => setCurrentPub({...currentPub, category: e.target.value})} className="w-full p-2.5 pr-8 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer font-semibold shadow-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <button type="button" onClick={() => setIsCatModalOpen(true)} className="px-3 bg-white border border-slate-200 rounded-lg text-[#234E8D] font-black hover:bg-blue-50 transition-colors shadow-sm">+</button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Status Publikasi</label>
                  <div className="relative">
                    <select value={currentPub.status} onChange={(e) => setCurrentPub({...currentPub, status: e.target.value})} className="w-full p-2.5 pr-8 border border-slate-200 rounded-lg text-sm font-bold text-[#234E8D] bg-white outline-none focus:border-[#234E8D] appearance-none cursor-pointer shadow-sm">
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISH">PUBLISH</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#234E8D] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* EDITOR */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <BookOpen size={14} className="text-[#234E8D]"/> Narasi Lengkap / Isi Dokumen
                </label>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <Editor
                    apiKey={TINY_API_KEY}
                    value={currentPub.content}
                    onEditorChange={(val) => setCurrentPub({...currentPub, content: val})}
                    init={{ height: 300, menubar: true, plugins: ['link', 'lists', 'image', 'table', 'code'], toolbar: 'undo redo | fontfamily fontsize | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code', branding: false }}
                  />
                </div>
              </div>

              {/* ACTIONS */}
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
                  <CheckCircle2 size={16}/> Simpan Publikasi
                </button>
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