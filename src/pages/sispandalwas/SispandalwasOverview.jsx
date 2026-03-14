import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wifi,
  WifiOff,
  Wrench,
  Radio,
  MapPin,
  Clock,
  CheckCircle2,
  Database,
} from "lucide-react";
import {
  TRACKER_LIST,
  SYSTEM_INFO,
  getKpiStats,
} from "@/data/sispandalwas/trackerData";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  Online:      { bg: "bg-green-50  border-green-200  text-green-700",  dot: "bg-green-500" },
  Offline:     { bg: "bg-red-50    border-red-200    text-red-700",    dot: "bg-red-500"   },
  Maintenance: { bg: "bg-amber-50  border-amber-200  text-amber-700",  dot: "bg-amber-500" },
};

const MSG_STYLE = {
  POSITION:          "bg-blue-50   border-blue-200   text-blue-700",
  TRACKING:          "bg-green-50  border-green-200  text-green-700",
  "UNLIMITED-TRACK": "bg-purple-50 border-purple-200 text-purple-700",
  STOP:              "bg-red-50    border-red-200    text-red-700",
  NEWMOVEMENT:       "bg-amber-50  border-amber-200  text-amber-700",
  "POWER-OFF":       "bg-slate-50  border-slate-200  text-slate-700",
};

const BAT_STYLE = {
  HIGH:     "bg-green-50  border-green-200  text-green-700",
  GOOD:     "bg-green-50  border-green-200  text-green-700",
  LOW:      "bg-amber-50  border-amber-200  text-amber-700",
  CRITICAL: "bg-red-50    border-red-200    text-red-700",
};

function StatusBadge({ value, styleMap, icon: Icon }) {
  const style = styleMap[value] ?? "bg-slate-50 border-slate-200 text-slate-600";
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold", style)}>
      {Icon && <Icon className="w-3 h-3" />}
      {value}
    </span>
  );
}

export default function SispandalwasOverview() {
  const [trackers] = useState(TRACKER_LIST);
  const [now, setNow] = useState(new Date());
  const kpi = getKpiStats(trackers);

  // Live clock for "Update Terakhir"
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const formatNow = (d) =>
    d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(",", "");

  const kpiCards = [
    {
      label: "Devices Online",
      value: kpi.online,
      sub: "Total Tracker",
      icon: Wifi,
      bg: "bg-green-50 border-green-100",
      iconColor: "text-green-500",
      valueColor: "text-green-600",
    },
    {
      label: "Devices Offline",
      value: kpi.offline,
      sub: "Total Tracker",
      icon: WifiOff,
      bg: "bg-red-50 border-red-100",
      iconColor: "text-red-500",
      valueColor: "text-red-600",
    },
    {
      label: "Maintenance",
      value: kpi.maintenance,
      sub: "Total Tracker",
      icon: Wrench,
      bg: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-500",
      valueColor: "text-amber-600",
    },
    {
      label: "Total Devices",
      value: kpi.total,
      sub: "Spot Trace",
      icon: Radio,
      bg: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-500",
      valueColor: "text-blue-600",
    },
  ];

  return (
    <AdminLayout>
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Monitoring real-time perangkat tracker SISPANDALWAS"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((card) => (
            <div key={card.label} className={cn("rounded-2xl border p-5 shadow-sm", card.bg)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{card.label}</p>
                </div>
                <card.icon className={cn("w-5 h-5", card.iconColor)} />
              </div>
              <p className={cn("text-3xl font-bold mt-3", card.valueColor)}>{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Tracker Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-600" />
              <CardTitle className="text-base">Status Tracker Terkini</CardTitle>
            </div>
            <p className="text-xs text-blue-600 mt-0.5">Data real-time dari Database Spot Trace</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Tracker ID", "Nama Tracker", "Posisi Terakhir", "Status", "Message Device", "Baterai", "Update Terakhir"].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trackers.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-gray-800">{t.id}</td>
                      <td className="py-3 px-3 font-semibold text-gray-700">{t.name}</td>
                      <td className="py-3 px-3 text-blue-600 font-mono text-xs">
                        {t.lat}, {t.lng}
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold",
                          STATUS_STYLE[t.status]?.bg ?? "bg-slate-50 border-slate-200 text-slate-700"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_STYLE[t.status]?.dot ?? "bg-slate-400")} />
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge value={t.message} styleMap={MSG_STYLE} />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge value={t.battery} styleMap={BAT_STYLE} />
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">{t.lastUpdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi Sistem Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Sumber Data</p>
                <p className="text-sm text-gray-500">{SYSTEM_INFO.dataSource}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Update Terakhir</p>
                <p className="text-sm text-gray-800 font-mono">{formatNow(now)}</p>
                {SYSTEM_INFO.dbConnected && (
                  <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Database connected
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  Auto-refresh setiap {SYSTEM_INFO.autoRefreshInterval} menit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
