import { useCallback, useMemo, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";
import { AdminSidebarContext } from "./AdminSidebarContext";

export function AdminLayout({ children, className }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

  const contextValue = useMemo(
    () => ({
      mobileOpen,
      openMobile,
      closeMobile,
      toggleMobile,
    }),
    [mobileOpen, openMobile, closeMobile, toggleMobile],
  );

  return (
    <AdminSidebarContext.Provider value={contextValue}>
      <div className="flex h-screen w-full overflow-hidden overscroll-none bg-background ocean-pattern">
        <AdminSidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />
        <main className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", className)}>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-none">{children}</div>
          <footer className="shrink-0 border-t border-border/70 bg-card/90 px-6 py-3 text-center text-xs backdrop-blur">
            <a
              href="https://lokaspasia.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-1 text-[#0d1930] hover:underline"
            >
              © 2026 BLUD UPTD Kep. Raja Ampat CMS Ver.1.0 | Loka Spasial Nusantara
            </a>
          </footer>
        </main>
      </div>
    </AdminSidebarContext.Provider>
  );
}
