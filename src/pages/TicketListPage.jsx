import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  getAllTickets,
  getInvoiceIdForTicket,
  formatShortId,
  FEE_PRICING,
  DOMISILI_LABELS,
  BOOKING_TYPE_LABELS,
  formatDate,
  isChildVisitorTicket,
} from "@/data/dummyData";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  FileCheck,
  IdCard,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { exportExcel } from "@/lib/exporters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function TicketListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gateFilter, setGateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField] = useState("activeStartAt");
  const [sortDir, setSortDir] = useState("desc");
  const getPaymentType = (ticket) => {
    if (ticket.operatorType === "doku") return "online";
    return "on_the_spot";
  };
  const getGatewayLabel = (ticket) =>
    getPaymentType(ticket) === "online" ? "Doku" : "Onsite";
  const getPetugasGerbangName = (ticket) => {
    if (ticket.lastActionBy && ticket.lastActionBy !== "Pemindai Gerbang" && ticket.lastActionBy !== "Sistem") {
      return ticket.lastActionBy;
    }
    if (ticket.gateStatus === "masuk" || ticket.gateStatus === "keluar") {
      return "Bambang Susilo";
    }
    const petugasByOperator = {
      loket: "Bambang Susilo",
      qris: "Dewi Anggraini",
      transfer: "Rudi Hartono",
      doku: "Dwi Prasetyo",
    };
    return petugasByOperator[ticket.operatorType] || "Bambang Susilo";
  };
  const getGerbangDisplay = (ticket) =>
    getPaymentType(ticket) === "online" ? "DOKU" : getPetugasGerbangName(ticket);
  const getCardActiveStart = (ticket) => ticket.paidAt || ticket.createdAt;
  const getValidityDuration = (ticket) => {
    const validityLabel = String(FEE_PRICING[ticket.feeCategory]?.validity || "365 hari").toLowerCase();
    const amountMatch = validityLabel.match(/(\d+)/);
    const amount = amountMatch ? Number(amountMatch[1]) : 365;
    const unit =
      validityLabel.includes("bulan") || validityLabel.includes("month")
        ? "months"
        : "days";

    return {
      amount: amount > 0 ? amount : 365,
      unit,
    };
  };
  const getTargetPengunjungLabel = (ticket) => {
    const map = {
      wisatawan_mancanegara: "Mancanegara",
      wisatawan_domestik_luar_papua: "Domestik",
      wisatawan_domestik_pbd: "PBD",
      wisatawan_domestik_papua: "Tanah Papua",
      peneliti_mancanegara: "Peneliti Mancanegara",
      peneliti_domestik: "Peneliti Domestik",
      sport_fishing: "Sport Fishing",
      mooring: "Mooring",
    };
    return map[ticket.feeCategory] || DOMISILI_LABELS[ticket.domisiliOCR] || "-";
  };
  const getTjlRemainingDays = (ticket) => {
    if (ticket.paymentStatus !== "sudah_bayar") {
      return 0;
    }

    const activeStart = new Date(getCardActiveStart(ticket));
    if (Number.isNaN(activeStart.getTime())) {
      return 0;
    }

    const expiresAt = new Date(activeStart);
    const { amount, unit } = getValidityDuration(ticket);
    if (unit === "months") {
      expiresAt.setMonth(expiresAt.getMonth() + amount);
    } else {
      expiresAt.setDate(expiresAt.getDate() + amount);
    }
    const remainingMs = expiresAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  };
  const isTjlActive = (ticket) => getTjlRemainingDays(ticket) > 0;
  const getTjlStatus = (ticket) => {
    const remainingDays = getTjlRemainingDays(ticket);

    if (remainingDays > 0) {
      return {
        label: `${remainingDays} hari`,
        className: "bg-status-approved-bg text-status-approved",
      };
    }

    return {
      label: "0 hari",
      className: "bg-slate-200 text-slate-700",
    };
  };
  const getTicketTime = (ticket) =>
    new Date(getCardActiveStart(ticket)).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const getSortValue = (ticket, field) => {
    if (field === "activeStartAt") {
      return new Date(getCardActiveStart(ticket)).getTime();
    }
    if (field === "id") return ticket.id;
    if (field === "namaLengkap") return ticket.namaLengkap;
    if (field === "targetPengunjung") return getTargetPengunjungLabel(ticket);
    return ticket[field];
  };
  const isPublishedTicket = (ticket) =>
    ticket.paymentStatus === "sudah_bayar" ||
    ticket.gateStatus === "masuk" ||
    ticket.gateStatus === "keluar";
  const allTickets = getAllTickets().filter((ticket) => !isChildVisitorTicket(ticket)).filter(isPublishedTicket);

  // Filter tickets
  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" || ticket.bookingType === typeFilter;
    const matchesLocation =
      locationFilter === "all" || getPaymentType(ticket) === locationFilter;
    const matchesTarget =
      targetFilter === "all" || getTargetPengunjungLabel(ticket) === targetFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? isTjlActive(ticket) : !isTjlActive(ticket));
    const matchesGate =
      gateFilter === "all" ||
      getGatewayLabel(ticket).toLowerCase() === gateFilter;
    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesTarget &&
      matchesStatus &&
      matchesGate
    );
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aVal = getSortValue(a, sortField);
    const bVal = getSortValue(b, sortField);
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );
  };
  const handleExportXls = () => {
    exportExcel(
      sortedTickets.map((ticket) => ({
        ticket_id: ticket.id,
        nama: ticket.namaLengkap,
        email: ticket.email,
        no_hp: ticket.noHP,
        domisili: DOMISILI_LABELS[ticket.domisiliOCR] || ticket.domisiliOCR,
        booking_type:
          BOOKING_TYPE_LABELS[ticket.bookingType] || ticket.bookingType,
        fee_category:
          FEE_PRICING[ticket.feeCategory]?.label || ticket.feeCategory,
        total_biaya: ticket.totalBiaya,
        payment_status: ticket.paymentStatus,
        approval_status: ticket.approvalStatus,
        created_at: ticket.createdAt,
      })),
      `tickets_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName: "Tickets",
      },
    );
  };
  const handleExportPdf = () => {
    window.print();
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <AdminLayout>
      <AdminHeader
        title="Daftar Tiket"
        subtitle="Data tiket tarif jasa lingkungan masuk kawasan konservasi."
        showSearch={false}
      />

      <div className="flex-1 overflow-auto px-5 py-4 xl:px-6 xl:py-5">
        {/* Search & Actions Bar */}
        <div className="flex flex-col gap-3 mb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Tiket, nama, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
              {showFilters ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportXls}
            >
              <Download className="w-4 h-4" />
              Export XLS
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportPdf}
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-4 card-ocean animate-fade-in">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Tipe
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="group">Grup</SelectItem>
                      <SelectItem value="perorangan">Individu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Lokasi Pembayaran
                  </label>
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="on_the_spot">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Target Pengunjung
                  </label>
                  <Select value={targetFilter} onValueChange={setTargetFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="Mancanegara">Mancanegara</SelectItem>
                      <SelectItem value="Domestik">Domestik</SelectItem>
                      <SelectItem value="PBD">PBD</SelectItem>
                      <SelectItem value="Tanah Papua">Tanah Papua</SelectItem>
                      <SelectItem value="Peneliti Mancanegara">
                        Peneliti Mancanegara
                      </SelectItem>
                      <SelectItem value="Peneliti Domestik">
                        Peneliti Domestik
                      </SelectItem>
                      <SelectItem value="Sport Fishing">Sport Fishing</SelectItem>
                      <SelectItem value="Mooring">Mooring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Gerbang
                  </label>
                  <Select value={gateFilter} onValueChange={setGateFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="doku">Doku</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTypeFilter("all");
                      setLocationFilter("all");
                      setTargetFilter("all");
                      setStatusFilter("all");
                      setGateFilter("all");
                    }}
                    className="text-xs w-full sm:w-auto"
                  >
                    Atur Ulang Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Menampilkan{" "}
            <span className="font-medium text-foreground">
              {sortedTickets.length}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">
              {allTickets.length}
            </span>{" "}
            tiket
          </p>
        </div>

        {/* Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="data-table table-fixed min-w-[1660px]">
              <thead>
                <tr className="[&>th]:text-center [&>th]:align-middle">
                  <th
                    className="w-[260px] min-w-[260px] max-w-[260px] sticky left-0 z-50 relative isolate !bg-muted cursor-pointer hover:!bg-muted transition-colors shadow-[8px_0_12px_-10px_rgba(15,23,42,0.35)] after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border"
                    onClick={() => handleSort("namaLengkap")}
                  >
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
                      Nama <SortIcon field="namaLengkap" />
                    </div>
                  </th>
                  <th
                    className="w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("activeStartAt")}
                  >
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
                      Tanggal <SortIcon field="activeStartAt" />
                    </div>
                  </th>
                  <th className="w-[90px] min-w-[90px] max-w-[90px]">
                    <div>Waktu</div>
                  </th>
                  <th
                    className="w-[120px] min-w-[120px] max-w-[120px] cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
                      ID tiket <SortIcon field="id" />
                    </div>
                  </th>
                  <th className="w-[110px] min-w-[110px] max-w-[110px]">
                    <div>Tipe</div>
                  </th>
                  <th className="w-[170px] min-w-[170px] max-w-[170px]">
                    <div>Lokasi Pembayaran</div>
                  </th>
                  <th
                    className="w-[240px] min-w-[240px] max-w-[240px] cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("targetPengunjung")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Target Pengunjung <SortIcon field="targetPengunjung" />
                    </div>
                  </th>
                  <th className="w-[110px] min-w-[110px] max-w-[110px]">
                    <div>Status</div>
                  </th>
                  <th className="w-[150px] min-w-[150px] max-w-[150px] text-center">
                    <div>Aksi</div>
                  </th>
                  <th className="w-[170px] min-w-[170px] max-w-[170px]">
                    <div>Gerbang</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedTickets.map((ticket) => {
                  const tjlStatus = getTjlStatus(ticket);
                  const invoiceId = getInvoiceIdForTicket(ticket.id);
                  return (
                    <tr key={ticket.id} className="group">
                      <td className="w-[260px] min-w-[260px] max-w-[260px] whitespace-nowrap text-sm font-medium sticky left-0 z-40 relative isolate !bg-card group-hover:!bg-card shadow-[8px_0_12px_-10px_rgba(15,23,42,0.25)] after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border">
                        <div className="truncate" title={ticket.namaLengkap}>
                          {ticket.namaLengkap}
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-sm">
                        {formatDate(getCardActiveStart(ticket))}
                      </td>
                      <td className="whitespace-nowrap text-sm text-muted-foreground">
                        {getTicketTime(ticket)}
                      </td>
                      <td className="whitespace-nowrap">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="font-mono text-sm font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          {formatShortId(ticket.id)}
                        </Link>
                      </td>

                      <td className="whitespace-nowrap">
                        <span className="text-sm">
                          {ticket.bookingType === "group" ? "Grup" : "Individu"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <span
                            className={
                              getPaymentType(ticket) === "online"
                                ? "inline-flex items-center rounded-full bg-status-approved-bg px-2 py-0.5 text-xs font-medium text-status-approved"
                                : "inline-flex items-center rounded-full bg-status-pending-bg px-2 py-0.5 text-xs font-medium text-status-pending"
                            }
                          >
                            {getPaymentType(ticket) === "online"
                              ? "Online"
                              : "Onsite"}
                          </span>
                        </div>
                      </td>

                      <td className="w-[240px] min-w-[240px] max-w-[240px]">
                        <span
                          className="block text-sm whitespace-normal break-words leading-snug"
                          title={getTargetPengunjungLabel(ticket)}
                        >
                          {getTargetPengunjungLabel(ticket)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tjlStatus.className}`}
                        >
                          {tjlStatus.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap">
                        <div className="flex items-center justify-center gap-0.5">
                          <Link to={`/tickets/${ticket.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Detail tiket"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          {invoiceId ? (
                            <Link to={`/invoices/${invoiceId}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                title="Invoice"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-40"
                              title="Invoice belum tersedia"
                              disabled
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Button>
                          )}

                          <Link to={`/payments/${ticket.id}?type=turis`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Bukti Pembayaran"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          <Link to={`/cards/${ticket.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Cetak Kartu TJL"
                            >
                              <IdCard className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">
                        <div className="text-sm" title={getGerbangDisplay(ticket)}>
                          {getGerbangDisplay(ticket)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
