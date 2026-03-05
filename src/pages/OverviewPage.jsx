import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";

export default function OverviewPage() {
  return (
    <AdminLayout>
      <AdminHeader
        title="Ringkasan"
        subtitle="Content Management System"
        showSearch={false}
        showDateFilter={false}
      />
      <div className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground">Halaman Ringkasan</p>
      </div>
    </AdminLayout>
  );
}
