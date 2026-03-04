import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import ApprovalQueuePage from "./pages/ApprovalQueuePage";
import PaymentsPage from "./pages/PaymentsPage";
import ServiceRatesPage from "./pages/ServiceRatesPage";
import GateMonitorPage from "./pages/GateMonitorPage";
import FinanceReportsPage from "./pages/FinanceReportsPage";
import RefundCenterPage from "./pages/RefundCenterPage";
import RefundRequestPage from "./pages/RefundRequestPage";
import UserManagementPage from "./pages/UserManagementPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import NotFound from "./pages/NotFound";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import TicketDesignerPage from "./pages/TicketDesigner";
import ProfilePage from "./pages/ProfilePage";
import VisitorPage from "./pages/VisitorPage";
import VisitorDetailPage from "./pages/VisitorDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <a
        className="group fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200/70 bg-white/90 shadow-lg backdrop-blur transition hover:bg-white"
        href="https://wa.me/6282188885751"
        target="_blank"
        rel="noreferrer"
        aria-label="Kontak Support WhatsApp 0821-8888-5751"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition group-hover:bg-emerald-600">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6 fill-current">
            <path d="M16 2.667c-7.364 0-13.333 5.969-13.333 13.333 0 2.353.607 4.651 1.761 6.689L2 30l7.48-2.414a13.27 13.27 0 0 0 6.52 1.714c7.364 0 13.333-5.969 13.333-13.333C29.333 8.636 23.364 2.667 16 2.667Zm0 24.667c-2.197 0-4.347-.581-6.227-1.679l-.445-.26-4.433 1.432 1.448-4.314-.289-.445a11.27 11.27 0 0 1-1.754-6.101c0-6.264 5.091-11.333 11.333-11.333S27.333 9.703 27.333 15.967 22.264 27.334 16 27.334Zm6.217-8.043c-.341-.171-2.023-.998-2.336-1.111-.314-.114-.541-.171-.768.171-.228.341-.884 1.111-1.085 1.338-.199.228-.398.256-.739.085-.341-.171-1.441-.531-2.744-1.694-1.014-.904-1.698-2.02-1.898-2.361-.199-.341-.021-.525.149-.695.154-.153.341-.398.512-.597.171-.199.228-.341.341-.569.114-.228.057-.427-.029-.597-.085-.171-.768-1.853-1.054-2.537-.278-.667-.561-.576-.768-.587l-.655-.011c-.228 0-.597.085-.909.427-.313.341-1.195 1.168-1.195 2.846 0 1.679 1.224 3.301 1.395 3.53.171.228 2.409 3.671 5.833 5.147.815.352 1.451.561 1.947.718.818.26 1.563.223 2.151.135.655-.097 2.023-.828 2.307-1.63.285-.803.285-1.49.199-1.63-.086-.139-.313-.227-.655-.398Z" />
          </svg>
        </span>
      </a>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/tickets" element={<TicketListPage />} />
          {/* <Route path="/visitors" element={<VisitorPage />} /> */}
          <Route path="/visitors/:visitorKey" element={<VisitorDetailPage />} />
          <Route path="/ticket-designer" element={<TicketDesignerPage />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
          <Route path="/approval" element={<ApprovalQueuePage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/tarif" element={<ServiceRatesPage />} />
          <Route path="/gate" element={<GateMonitorPage />} />
          <Route path="/reports" element={<FinanceReportsPage />} />
          <Route path="/refund-request" element={<RefundRequestPage />} />
          <Route path="/refunds" element={<RefundCenterPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/logs" element={<ActivityLogsPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
