import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Search, Plus, Pencil, Trash2, FileText, User } from 'lucide-react';

export default function PublikasiPage() {
  const [search, setSearch] = useState("");
  
  // Data Dummy untuk Publikasi
  const publikasiData = [
    { id: 1, title: "Laporan Tahunan KKP 2023", author: "Sekretariat", date: "2024-01-15", type: "PDF" },
    { id: 2, title: "Panduan Wisata Ramah Lingkungan", author: "Tim Edukasi", date: "2024-02-20", type: "E-Book" },
  ];

  return (
    <AdminLayout>
      <AdminHeader title="Manajemen Publikasi" subtitle="Kelola dokumen dan publikasi resmi" />
      
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari publikasi..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Tambah Publikasi
          </button>
        </div>

        {/* Tabel Manual */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Judul Dokumen</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Penerbit</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tipe</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {publikasiData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600"/>
                      {item.title}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{item.author}</td>
                  <td className="p-4 text-sm text-slate-500">{item.type}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4"/></button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}