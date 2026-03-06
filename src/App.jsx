import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import BeritaPage from "./pages/Berita"; 
import PublikasiPage from "./pages/Publikasi";
import KalenderKegiatanPage from "./pages/KalenderKegiatan"; // 1. Pastikan import ini ada
import NotFound from "./pages/NotFound";
import RamsPage from "./pages/Rams";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LanguageRuntimeTranslator } from "./i18n/LanguageRuntimeTranslator";
import 'leaflet/dist/leaflet.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageRuntimeTranslator />
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            {/* 2. Pastikan huruf besar/kecil SAMA dengan di Sidebar */}
            <Route path="/Berita" element={<BeritaPage />} />
            <Route path="/Publikasi" element={<PublikasiPage />} />
            <Route path="/KalenderKegiatan" element={<KalenderKegiatanPage />} />
            <Route path="/rams" element={<RamsPage />} />
            
            {/* Route Catch-all (Wildcard) harus di paling bawah */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;