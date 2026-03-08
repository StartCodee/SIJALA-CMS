import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { KPICard } from "@/components/KPICard";
import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";

import {
  Home,
//   PalmTree,
  Ship,
  Users,
//   Venus,
} from "lucide-react";

const boatIcon = new L.Icon({
  iconUrl: "/boat.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});


export default function JuaraKamiPage() {

  return (
    <AdminLayout>
      <AdminHeader
        title="Juara Kami"
        subtitle="Content Management System"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-y-auto p-6">

        {/* ROW 1 */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
  <KPICard
    title="Jumlah Mitra Homestay"
    value="150.000"
    icon={Home}
  />

  <KPICard
    title="Jumlah Mitra Resor"
    value="150.000"
    icon={Home}
  />

  <KPICard
    title="Jumlah Liveaboard"
    value="150.000"
    icon={Ship}
  />
</div>


{/* ROW 2 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <KPICard
    title="Jumlah Mitra Kelompok Masyarakat"
    value="150.000"
    icon={Users}
  />

  <KPICard
    title="Jumlah Kader Manta Perempuan"
    value="150.000"
    icon={Home}
  />
</div>

        <br />

        <div className="mb-4 flex justify-end">
          <Button
            className="btn-ocean gap-2"
          >
           Simpan Perubahan
          </Button>
        </div>


      </div>
    </AdminLayout>
  );
}