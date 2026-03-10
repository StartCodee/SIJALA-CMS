import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Newspaper, 
  BookOpen,     
  CalendarDays,  
  ShieldCheck,
  Trophy,
  Radio,
  LocateFixed,
  BookOpenText
} from 'lucide-react';
import logoRajaAmpat from '@/assets/image/KKP-RajaAmpat.png';
import motifSidebar from '@/assets/motif-sidebar.svg';
import { useLanguage } from '@/i18n/LanguageContext';

const mainNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Ringkasan' },
  { to: '/rams', icon: LocateFixed, label: 'RAMS' },
  { to: '/i-safe', icon: Radio, label: 'I-SAFE' },
  { to: '/juara-kami', icon: Trophy, label: 'Juara Kami' },
  { to: '/evika', icon: BookOpenText, label: 'EVIKA' },
  { to: '/Berita', icon: Newspaper, label: 'Berita' },
  { to: '/Publikasi', icon: BookOpen, label: 'Publikasi' }, 
  { to: '/KalenderKegiatan', icon: CalendarDays, label: 'Kalender Kegiatan' } 
];

export function AdminSidebar({ className, mobileOpen = false, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const isCollapsed = collapsed && !mobileOpen;

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      if (mobileOpen) {
        onMobileClose?.();
      }
    }
  }, [location.pathname, mobileOpen, onMobileClose]);

  const handleMobileClose = () => {
    onMobileClose?.();
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={handleMobileClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'flex flex-col relative h-screen bg-sidebar border-r border-sidebar-border transition-[width,transform] duration-300',
          'fixed inset-y-0 left-0 z-50 shadow-2xl md:static md:z-auto md:shadow-none',
          'w-[82vw] max-w-[320px] md:w-[260px]',
          isCollapsed && 'md:w-[72px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
        style={{ background: 'var(--gradient-sidebar)' }}
      >
        {/* Tribal motif kiri bawah */}
        <img
          src={motifSidebar}
          alt=""
          aria-hidden="true"
          className={cn(
            'pointer-events-none select-none absolute bottom-0 left-0 transition-all duration-300',
            'opacity-100 w-[140px]',
            isCollapsed && 'md:w-[70px] opacity-40'
          )}
        />

        {/* Logo Section */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className={cn('flex items-center gap-3 flex-1 min-w-0', isCollapsed && 'md:justify-center md:gap-0')}>
            <div
              className={cn(
                'rounded-xl bg-white/95 ring-1 ring-white/25 p-1 shadow-sm transition-all',
                'h-12 w-12',
                isCollapsed && 'md:h-10 md:w-10'
              )}
            >
              <img
                src={logoRajaAmpat}
                alt="Konservasi Raja Ampat"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-500">
                <h1 className="text-base font-bold text-white truncate leading-tight">KKP Raja Ampat</h1>
                <p className="text-[11px] text-sidebar-foreground/70 truncate">Content Management System</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleMobileClose}
            className="md:hidden rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Tutup sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-0 relative z-10">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-4 mb-2">
                Menu Utama
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'nav-item mx-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  isActive && 'bg-sidebar-accent text-white font-medium shadow-sm active',
                  isCollapsed && 'justify-center px-2 mx-2'
                )}
                title={isCollapsed ? item.label : undefined}
                onClick={handleMobileClose}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isCollapsed ? "" : "min-w-[20px]")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 hidden md:flex bg-sidebar border border-sidebar-border rounded-full p-1.5 hover:bg-sidebar-accent transition-colors z-[60] shadow-md"
          aria-label={isCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-sidebar-foreground" />
          )}
        </button>

        {/* User Section */}
        <div className={cn('p-4 border-t border-sidebar-border bg-sidebar/40 backdrop-blur-md relative z-10', isCollapsed && 'md:flex md:justify-center')}>
          {!isCollapsed && (
            <div className="mb-3 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/30 p-2 animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-1.5">Bahasa</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('id')}
                  className={cn(
                    'rounded-md px-2 py-1.5 transition-all flex items-center justify-center border',
                    language === 'id'
                      ? 'bg-sidebar-primary/20 border-sidebar-primary/40 ring-1 ring-sidebar-primary/40'
                      : 'border-transparent hover:bg-sidebar-accent'
                  )}
                >
                  <img src="/flags/id.svg" alt="ID" className="h-3 w-5 rounded-[1px] object-cover shadow-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={cn(
                    'rounded-md px-2 py-1.5 transition-all flex items-center justify-center border',
                    language === 'en'
                      ? 'bg-sidebar-primary/20 border-sidebar-primary/40 ring-1 ring-sidebar-primary/40'
                      : 'border-transparent hover:bg-sidebar-accent'
                  )}
                >
                  <img src="/flags/gb.svg" alt="EN" className="h-3 w-5 rounded-[1px] object-cover shadow-sm" />
                </button>
              </div>
            </div>
          )}

          <div className={cn('flex items-center gap-3', isCollapsed && 'md:justify-center')}>
            <NavLink
              to="/profile"
              className="flex items-center gap-3 flex-1 min-w-0 rounded-lg p-1.5 hover:bg-sidebar-accent transition-colors group"
              onClick={handleMobileClose}
            >
              <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <span className="text-sm font-bold text-white">RH</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">Rudi Hartono</p>
                  <p className="text-[10px] text-sidebar-foreground/60 font-medium">Admin Utama</p>
                </div>
              )}
            </NavLink>
            {!isCollapsed && (
              <button
                className="p-2 rounded-lg hover:bg-red-500/20 text-sidebar-foreground/60 hover:text-red-400 transition-all"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}