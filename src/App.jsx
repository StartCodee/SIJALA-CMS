import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import BeritaPage from "./pages/Berita"; 
import PublikasiPage from "./pages/Publikasi";
import KalenderKegiatanPage from "./pages/KalenderKegiatan";
import NotFound from "./pages/NotFound";
import RamsPage from "./pages/Rams";
import JuaraKamiPage from "./pages/JuaraKami"; 
import EvikaPage from "./pages/EvikaPage"; 
import SispandalwasOverview from "./pages/sispandalwas/SispandalwasOverview";
import ManajemenTracker from "./pages/sispandalwas/ManajemenTracker";
import PlaybackRiwayat from "./pages/sispandalwas/PlaybackRiwayat";
import EmbedCode from "./pages/sispandalwas/EmbedCode";
import SispandalwasSettings from "./pages/sispandalwas/SispandalwasSettings";
import SispandalwasEmbedView from "./pages/sispandalwas/SispandalwasEmbedView";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LanguageRuntimeTranslator } from "./i18n/LanguageRuntimeTranslator";
import 'leaflet/dist/leaflet.css';
import SispandalwasPage from "./pages/SispandalwasPage";

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
            <Route path="/Berita" element={<BeritaPage />} />
            <Route path="/Publikasi" element={<PublikasiPage />} />
            <Route path="/KalenderKegiatan" element={<KalenderKegiatanPage />} />
            <Route path="/rams" element={<RamsPage />} />
            {/* SISPANDALWAS sub-routes */}
            <Route path="/sispandalwas" element={<SispandalwasPage />} />
            <Route path="/sispandalwas/overview" element={<SispandalwasOverview />} />
            <Route path="/sispandalwas/tracker" element={<ManajemenTracker />} />
            <Route path="/sispandalwas/playback" element={<PlaybackRiwayat />} />
            <Route path="/sispandalwas/embed" element={<EmbedCode />} />
            <Route path="/sispandalwas/settings" element={<SispandalwasSettings />} />
            <Route path="/embed" element={<SispandalwasEmbedView />} />
            <Route path="/juara-kami" element={<JuaraKamiPage />} />
            <Route path="/evika" element={<EvikaPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;