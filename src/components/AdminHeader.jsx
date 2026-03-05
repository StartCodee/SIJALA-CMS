import { useState } from 'react';
import { Search, Bell, Calendar, ChevronDown, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAdminSidebar } from '@/components/AdminSidebarContext';
import { getUserRole } from '@/lib/rbac';

const dateFilters = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: '1 Tahun', value: 'year' },
  { label: 'Rentang Kustom', value: 'custom' },
];

const toInputDate = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const addMonthsInputDate = (inputDate, months) => {
  if (!inputDate) return '';
  const base = new Date(`${inputDate}T00:00:00`);
  if (Number.isNaN(base.getTime())) return '';
  base.setMonth(base.getMonth() + months);
  return toInputDate(base);
};

const formatDateLabel = (inputDate) => {
  if (!inputDate) return '-';
  const date = new Date(`${inputDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function AdminHeader({
  title,
  subtitle,
  showSearch = true,
  showDateFilter = true,
  forceSuperAdmin = false,
  actions,
  className,
}) {
  const role = getUserRole();
  const isAdminUtama = forceSuperAdmin || role === 'admin_utama';
  const today = toInputDate(new Date());
  const defaultCustomStart = toInputDate(new Date(new Date().setDate(new Date().getDate() - 29)));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('today');
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customError, setCustomError] = useState('');
  const [customRange, setCustomRange] = useState({
    from: defaultCustomStart,
    to: today,
  });
  const [draftFrom, setDraftFrom] = useState(defaultCustomStart);
  const [draftTo, setDraftTo] = useState(today);
  const { toggleMobile } = useAdminSidebar();
  const maxToByPolicy = !isAdminUtama ? addMonthsInputDate(draftFrom, 3) : '';

  const selectedDateLabel =
    selectedDateFilter === 'custom'
      ? `${formatDateLabel(customRange.from)} - ${formatDateLabel(customRange.to)}`
      : (dateFilters.find((filter) => filter.value === selectedDateFilter)?.label ?? 'Hari Ini');

  const handleSelectDateFilter = (value) => {
    if (value !== 'custom') {
      setSelectedDateFilter(value);
      return;
    }
    setCustomError('');
    setDraftFrom(customRange.from || defaultCustomStart);
    setDraftTo(customRange.to || today);
    setShowCustomDialog(true);
  };

  const handleDraftFromChange = (value) => {
    setDraftFrom(value);
    if (!value) return;

    if (draftTo && new Date(`${draftTo}T00:00:00`) < new Date(`${value}T00:00:00`)) {
      setDraftTo(value);
    }

    if (!isAdminUtama) {
      const policyMax = addMonthsInputDate(value, 3);
      if (draftTo && new Date(`${draftTo}T00:00:00`) > new Date(`${policyMax}T00:00:00`)) {
        setDraftTo(policyMax);
      }
    }
  };

  const handleApplyCustomRange = () => {
    setCustomError('');
    if (!draftFrom || !draftTo) {
      setCustomError('Tanggal mulai dan tanggal akhir wajib diisi.');
      return;
    }

    const fromDate = new Date(`${draftFrom}T00:00:00`);
    const toDate = new Date(`${draftTo}T00:00:00`);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      setCustomError('Format tanggal tidak valid.');
      return;
    }
    if (toDate < fromDate) {
      setCustomError('Tanggal akhir tidak boleh lebih kecil dari tanggal mulai.');
      return;
    }

    if (!isAdminUtama) {
      const policyMax = new Date(`${addMonthsInputDate(draftFrom, 3)}T00:00:00`);
      if (toDate > policyMax) {
        setCustomError('Rentang kustom maksimal 3 bulan untuk selain Admin Utama.');
        return;
      }
    }

    setCustomRange({
      from: draftFrom,
      to: draftTo,
    });
    setSelectedDateFilter('custom');
    setShowCustomDialog(false);
  };

  return (
    <header className={cn('bg-card border-b border-border px-6 py-4', className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={toggleMobile}
            aria-label="Buka sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
          {/* Global Search */}
          {showSearch && (
            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 h-9 bg-background border-border"
              />
            </div>
          )}

          {actions}

          {/* Date Filter */}
          {showDateFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="max-w-[220px] truncate">
                    {selectedDateLabel}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                {dateFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => handleSelectDateFilter(filter.value)}
                    className={cn(
                      'cursor-pointer',
                      selectedDateFilter === filter.value && 'bg-accent'
                    )}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rentang Kustom</DialogTitle>
            <DialogDescription>
              Pilih tanggal mulai dan akhir untuk filter data.
              {!isAdminUtama && ' Selain Admin Utama dibatasi maksimal 3 bulan.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="custom-date-from">Tanggal Mulai</Label>
              <Input
                id="custom-date-from"
                type="date"
                value={draftFrom}
                onChange={(event) => handleDraftFromChange(event.target.value)}
                max={draftTo || undefined}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-date-to">Tanggal Akhir</Label>
              <Input
                id="custom-date-to"
                type="date"
                value={draftTo}
                onChange={(event) => setDraftTo(event.target.value)}
                min={draftFrom || undefined}
                max={maxToByPolicy || undefined}
                className="bg-background"
              />
              {!isAdminUtama && draftFrom && (
                <p className="text-xs text-muted-foreground">
                  Maksimal sampai {formatDateLabel(maxToByPolicy)} (3 bulan dari tanggal mulai).
                </p>
              )}
            </div>
            {customError && (
              <p className="text-xs text-destructive">{customError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleApplyCustomRange} className="btn-ocean">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
