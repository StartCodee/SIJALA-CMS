import { useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wifi,
  WifiOff,
  Wrench,
  Radio,
  History,
  Play,
  Square,
  RotateCcw,
  Download,
} from "lucide-react";
import { TRACKER_LIST, getKpiStats } from "@/data/sispandalwas/trackerData";
import { cn } from "@/lib/utils";

// Mock historical path data
const MOCK_HISTORY = {
  "0-5069592": [
    { lat: -8.72, lng: 118.01, time: "01/12/2025, 07:00" },
    { lat: -8.71, lng: 118.02, time: "01/12/2025, 07:30" },
    { lat: -8.70, lng: 118.01, time: "01/12/2025, 08:00" },
    { lat: -8.70, lng: 118.0148, time: "01/12/2025, 08:35" },
  ],
};

const startIcon = L.divIcon({
  className: "",
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});
const endIcon = L.divIcon({
  className: "",
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function toDateInput(d) {
  return d.toISOString().slice(0, 10);
}

export default function PlaybackRiwayat() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [selectedTracker, setSelectedTracker] = useState("");
  const [startDate, setStartDate] = useState(toDateInput(yesterday));
  const [endDate, setEndDate] = useState(toDateInput(today));
  const [pathData, setPathData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const kpi = getKpiStats(TRACKER_LIST);
  const intervalRef = useRef(null);

  const kpiCards = [
    { label: "Devices Online",  value: kpi.online,      sub: "Total Tracker", icon: Wifi,    bg: "bg-green-50 border-green-100", iconColor: "text-green-500",  valueColor: "text-green-600" },
    { label: "Devices Offline", value: kpi.offline,     sub: "Total Tracker", icon: WifiOff, bg: "bg-red-50   border-red-100",   iconColor: "text-red-500",    valueColor: "text-red-600"   },
    { label: "Maintenance",     value: kpi.maintenance, sub: "Total Tracker", icon: Wrench,  bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-500",  valueColor: "text-amber-600" },
    { label: "Total Devices",   value: kpi.total,       sub: "Spot Trace",    icon: Radio,   bg: "bg-blue-50  border-blue-100",  iconColor: "text-blue-500",   valueColor: "text-blue-600"  },
  ];

  function handleLoad() {
    if (!selectedTracker) return;
    const data = MOCK_HISTORY[selectedTracker] ?? [];
    setPathData(data);
    setPlayIndex(0);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function handlePlay() {
    if (!pathData || pathData.length === 0) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setPlayIndex((prev) => {
        if (prev >= pathData.length - 1) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  }

  function handleStop() {
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function handleReset() {
    setPlayIndex(0);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  const visiblePath = pathData ? pathData.slice(0, playIndex + 1) : [];
  const mapCenter = pathData && pathData.length > 0
    ? [pathData[0].lat, pathData[0].lng]
    : [-0.72, 130.42];

  const formatDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Playback Riwayat"
        subtitle="Lihat riwayat pergerakan tracker berdasarkan rentang tanggal"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((card) => (
            <div key={card.label} className={cn("rounded-2xl border p-5 shadow-sm", card.bg)}>
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-gray-700">{card.label}</p>
                <card.icon className={cn("w-5 h-5", card.iconColor)} />
              </div>
              <p className={cn("text-3xl font-bold mt-3", card.valueColor)}>{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Playback Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <CardTitle className="text-base">Playback Configuration</CardTitle>
            </div>
            <p className="text-xs text-blue-600 mt-0.5">
              Select tracker and date range to view historical movement data
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5 min-w-[200px]">
                <Label>Select Tracker</Label>
                <Select value={selectedTracker} onValueChange={setSelectedTracker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose tracker..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACKER_LIST.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} ({t.id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate}
                    className="h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <Button
                onClick={handleLoad}
                disabled={!selectedTracker}
                className="h-9"
              >
                Load Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map + Controls */}
        {pathData !== null && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">
                  Rute Pergerakan — {TRACKER_LIST.find((t) => t.id === selectedTracker)?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatDate(startDate)} → {formatDate(endDate)}</span>
                  {!playing ? (
                    <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={handlePlay} disabled={playIndex >= (pathData.length - 1)}>
                      <Play className="w-3 h-3" /> Play
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={handleStop}>
                      <Square className="w-3 h-3" /> Stop
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={handleReset}>
                    <RotateCcw className="w-3 h-3" /> Reset
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
                    <Download className="w-3 h-3" /> Export
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {pathData.length} titik data · Menampilkan {playIndex + 1}/{pathData.length}
              </p>
            </CardHeader>
            <CardContent>
              <div style={{ height: 460 }}>
                <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
                  <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {visiblePath.length > 1 && (
                    <Polyline
                      positions={visiblePath.map((p) => [p.lat, p.lng])}
                      color="#3b82f6"
                      weight={3}
                      opacity={0.8}
                    />
                  )}
                  {visiblePath.length > 0 && (
                    <Marker position={[visiblePath[0].lat, visiblePath[0].lng]} icon={startIcon}>
                      <Popup><div className="text-xs"><b>Start</b><br />{visiblePath[0].time}</div></Popup>
                    </Marker>
                  )}
                  {visiblePath.length > 1 && (
                    <Marker
                      position={[visiblePath[visiblePath.length - 1].lat, visiblePath[visiblePath.length - 1].lng]}
                      icon={endIcon}
                    >
                      <Popup>
                        <div className="text-xs">
                          <b>Current Position</b><br />
                          {visiblePath[visiblePath.length - 1].time}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {pathData === null && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400">
              <History className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Pilih tracker dan rentang tanggal, lalu klik <b>Load Data</b></p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
