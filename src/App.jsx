import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import NotFound from "./pages/NotFound";
import RamsPage from "./pages/Rams";
import IsafePage from "./pages/IsafePage"; 
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
            <Route path="*" element={<NotFound />} />
            <Route path="/rams" element={<RamsPage />} />
            <Route path="/i-safe" element={<IsafePage />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
