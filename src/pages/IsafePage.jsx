import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Layers, Loader2, Wifi, WifiOff, Wrench, Radio, Clock, RefreshCw, AlertTriangle, MapPin, X } from "lucide-react";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadGeoJsonFromPublic,
  normalizeZoneName,
  pointFromFeature,
} from "@/lib/geojsonUtils";
import { TRACKER_LIST, SYSTEM_INFO, getKpiStats } from "@/data/sispandalwas/trackerData";
import { cn } from "@/lib/utils";

const ZONE_STYLE = {
  Inti: { color: "#b8b8b8", fillColor: "#EA3323", fillOpacity: 0.82, weight: 0.6 },
  "Pemanfaatan Terbatas": { color: "#9ba39a", fillColor: "#AFFCA1", fillOpacity: 0.82, weight: 0.6 },
  Lainnya: { color: "#9d9d9d", fillColor: "#828282", fillOpacity: 0.8, weight: 0.6 },
};

const ZONE_ORDER = ["Inti", "Pemanfaatan Terbatas", "Lainnya"];
const CLUSTER_ORDER = ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"];
const CLUSTER_DASH = {
  "Cluster 1": "12 6",
  "Cluster 2": "8 6",
  "Cluster 3": "4 6",
  "Cluster 4": "16 4 4 4",
};

const divingIcon = L.divIcon({
  className: "",
  html: '<div style="width:13px;height:13px;border-radius:999px;background:#2563eb;border:2px solid #dbeafe;box-shadow:0 2px 8px rgba(37,99,235,.4)"></div>',
  iconSize: [13, 13],
  iconAnchor: [6, 6],
});

const snorkelingIcon = L.divIcon({
  className: "",
  html: '<div style="width:13px;height:13px;border-radius:4px;background:#0ea5a4;border:2px solid #ccfbf1;box-shadow:0 2px 8px rgba(14,165,164,.35);transform:rotate(45deg)"></div>',
  iconSize: [13, 13],
  iconAnchor: [6, 6],
});

const divingSnorkelingIcon = L.divIcon({
  className: "",
  html: '<div style="width:13px;height:13px;border-radius:999px;background:linear-gradient(135deg,#2563eb 50%, #0ea5a4 50%);border:2px solid #dbeafe;box-shadow:0 2px 8px rgba(37,99,235,.35)"></div>',
  iconSize: [13, 13],
  iconAnchor: [6, 6],
});

function getActivityType(activity) {
  const value = String(activity || "").toLowerCase();
  const hasDive = value.includes("div");
  const hasSnorkel = value.includes("snork");
  if (hasDive && hasSnorkel) return "both";
  if (hasSnorkel) return "snorkeling";
  return "diving";
}

function iconByActivityType(type) {
  if (type === "snorkeling") return snorkelingIcon;
  if (type === "both") return divingSnorkelingIcon;
  return divingIcon;
}

function formatLuas(luas) {
  const num = Number(luas);
  if (!Number.isFinite(num) || num <= 0) return "-";
  return `${num.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Ha`;
}

function escapeHtml(input) {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildZonePopupHtml(zone, rows) {
  const items = rows
    .map((row) => {
      const aturan1 = escapeHtml(row.aturan1 || "-");
      const aturan2 = escapeHtml(row.aturan2 || "-");
      const aturan3 = escapeHtml(row.aturan3 || "-");

      return `<div style="border-top:1px solid #e2e8f0;padding-top:8px;margin-top:8px">
        <div style="font-weight:700;color:#0f172a;margin-bottom:4px">${escapeHtml(row.area)}</div>
        <div style="display:inline-block;background:#dcfce7;color:#166534;border-radius:999px;padding:2px 10px;font-size:11px;margin-bottom:6px">Zona ${escapeHtml(zone)}</div>
        <div style="color:#64748b;margin-bottom:2px">Luas: <b style="color:#334155">${escapeHtml(row.luas)}</b></div>
        <div style="color:#475569"><span style="display:inline-block;min-width:50px;color:#64748b">Aturan 1</span> ${aturan1}</div>
        <div style="color:#475569"><span style="display:inline-block;min-width:50px;color:#64748b">Aturan 2</span> ${aturan2}</div>
        <div style="color:#475569"><span style="display:inline-block;min-width:50px;color:#64748b">Aturan 3</span> ${aturan3}</div>
      </div>`;
    })
    .join("");

  return `<div style="font-size:12px;line-height:1.6;min-width:300px;max-width:360px;max-height:360px;overflow:auto;padding-right:4px">
    ${items || `<div style=\"color:#64748b\">Data area tidak tersedia untuk zona ${escapeHtml(zone)}</div>`}
  </div>`;
}

function LayersPanel({
  layerVisibility,
  setLayerVisibility,
  zoneVisibility,
  setZoneVisibility,
  clusterVisibility,
  setClusterVisibility,
  onClose,
}) {
  return (
    <div
      className="absolute left-4 bottom-16 z-[1000] w-64 rounded-xl border border-slate-200 bg-white shadow-xl"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between rounded-t-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5" /> Legend & Layers
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Close legend panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3 px-3 py-3 text-xs">
        <div>
          <p className="mb-1 font-semibold text-slate-600">Layer Data</p>
          <label className="flex cursor-pointer items-center gap-2 py-0.5 text-slate-600">
            <input
              type="checkbox"
              className="accent-slate-900"
              checked={layerVisibility.zones}
              onChange={(event) => setLayerVisibility((prev) => ({ ...prev, zones: event.target.checked }))}
            />
            Zones
          </label>
          <label className="flex cursor-pointer items-center gap-2 py-0.5 text-slate-600">
            <input
              type="checkbox"
              className="accent-slate-900"
              checked={layerVisibility.cluster}
              onChange={(event) => setLayerVisibility((prev) => ({ ...prev, cluster: event.target.checked }))}
            />
            Cluster SISPANDALWAS
          </label>
          <label className="flex cursor-pointer items-center gap-2 py-0.5 text-slate-600">
            <input
              type="checkbox"
              className="accent-slate-900"
              checked={layerVisibility.divers}
              onChange={(event) => setLayerVisibility((prev) => ({ ...prev, divers: event.target.checked }))}
            />
            Diver Points
          </label>
        </div>

        <div>
          <p className="mb-1 font-semibold text-slate-600">Filter Zone</p>
          {ZONE_ORDER.map((zone) => (
            <label key={zone} className="flex cursor-pointer items-center gap-2 py-0.5 text-slate-600">
              <input
                type="checkbox"
                className="accent-slate-900"
                checked={zoneVisibility[zone] !== false}
                onChange={() => setZoneVisibility((prev) => ({ ...prev, [zone]: prev[zone] === false }))}
              />
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: ZONE_STYLE[zone].fillColor, border: `1px solid ${ZONE_STYLE[zone].color}` }}
              />
              {zone}
            </label>
          ))}
        </div>

        <div>
          <p className="mb-1 font-semibold text-slate-600">Filter Cluster</p>
          {CLUSTER_ORDER.map((cluster) => (
            <label key={cluster} className="flex cursor-pointer items-center gap-2 py-0.5 text-slate-600">
              <input
                type="checkbox"
                className="accent-slate-900"
                checked={clusterVisibility[cluster] !== false}
                onChange={() => setClusterVisibility((prev) => ({ ...prev, [cluster]: prev[cluster] === false }))}
              />
              <span
                className="inline-block h-0.5 w-4"
                style={{
                  borderTop: "2px dashed #ea580c",
                  borderTopWidth: 2,
                  borderTopStyle: "dashed",
                }}
              />
              {cluster}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SispandalwasPage() {
  const [boats, setBoats] = React.useState(INITIAL_BOATS);
  const [zoneGeoJson, setZoneGeoJson] = useState(null);
  const [clusterGeoJson, setClusterGeoJson] = useState(null);
  const [diverGeoJson, setDiverGeoJson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState({
    zones: true,
    cluster: true,
    divers: true,
  });
  const [zoneVisibility, setZoneVisibility] = useState({
    Inti: true,
    "Pemanfaatan Terbatas": true,
    Lainnya: true,
  });
  const [clusterVisibility, setClusterVisibility] = useState({
    "Cluster 1": true,
    "Cluster 2": true,
    "Cluster 3": true,
    "Cluster 4": true,
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [trackerSearch, setTrackerSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messageFilter, setMessageFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const kpi = getKpiStats(TRACKER_LIST);

  // Auto-refresh every 5 mins
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => setLastRefresh(new Date()), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const handleManualRefresh = () => setLastRefresh(new Date());

  useEffect(() => {
    let alive = true;

    Promise.all([
      loadGeoJsonFromPublic("/data/full-geo.geojson"),
      loadGeoJsonFromPublic("/data/cluster_sispandalwas.geojson"),
      loadGeoJsonFromPublic("/data/titik_penyelam.geojson"),
    ])
      .then(([zones, cluster, divers]) => {
        if (!alive) return;
        setZoneGeoJson(zones);
        setClusterGeoJson(cluster);
        setDiverGeoJson(divers);
      })
      .catch((error) => {
        console.error("GeoJSON load failed", error);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const zoneFeatures = useMemo(() => {
    const features = zoneGeoJson?.features || [];
    return features
      .map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          __zoneKey: normalizeZoneName(feature?.properties?.Zonasi),
        },
      }))
      .filter((feature) => {
        const zoneKey = feature.properties.__zoneKey;
        if (zoneVisibility[zoneKey] === false) return false;
        return true;
      });
  }, [zoneGeoJson, zoneVisibility]);

  const filteredZones = useMemo(
    () => ({ type: "FeatureCollection", features: zoneFeatures }),
    [zoneFeatures]
  );

  const filteredClusters = useMemo(() => {
    const features = (clusterGeoJson?.features || []).filter((feature) => {
      const clusterName = feature?.properties?.KODE_ZONA || "Cluster 1";
      return clusterVisibility[clusterName] !== false;
    });
    return { type: "FeatureCollection", features };
  }, [clusterGeoJson, clusterVisibility]);

  const diverRows = useMemo(() => {
    return (diverGeoJson?.features || [])
      .map((feature, index) => {
        const [lat, lng] = pointFromFeature(feature) || [null, null];
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          id: `diver-${index + 1}`,
          lat,
          lng,
          activityType: getActivityType(feature?.properties?.Kegiatan_1),
          properties: feature.properties || {},
        };
      })
      .filter(Boolean)
      .filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lng));
  }, [diverGeoJson]);

  const zoneAreaRows = useMemo(() => {
    const grouped = { Inti: [], "Pemanfaatan Terbatas": [], Lainnya: [] };
    const seen = new Set();

    (zoneGeoJson?.features || []).forEach((feature) => {
      const p = feature?.properties || {};
      const zone = normalizeZoneName(p.Zonasi);
      const area = p.Kawasan || "Area tidak tersedia";
      const key = `${zone}::${area}`;
      if (seen.has(key)) return;
      seen.add(key);

      grouped[zone].push({
        area,
        luas: formatLuas(p.Luas_Ha),
        aturan1: p.Aturan_1,
        aturan2: p.Aturan_2,
        aturan3: p.Aturan_3,
      });
    });

    Object.values(grouped).forEach((rows) => {
      rows.sort((a, b) => a.area.localeCompare(b.area, "id"));
    });

    return grouped;
  }, [zoneGeoJson]);

  const onEachZoneFeature = useCallback((feature, layer) => {
    const props = feature.properties || {};
    const zone = props.__zoneKey || normalizeZoneName(props.Zonasi);
    const rows = zoneAreaRows[zone] || [];
    layer.bindPopup(buildZonePopupHtml(zone, rows));

    layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.96, weight: 0.8 }));
    layer.on("mouseout", () => layer.setStyle(ZONE_STYLE[zone] || ZONE_STYLE.Lainnya));
  }, [zoneAreaRows]);

  const onEachClusterFeature = useCallback((feature, layer) => {
    const props = feature.properties || {};
    layer.bindPopup(
      `<div style="font-size:12px;line-height:1.6;max-width:260px"><b>${props.KODE_ZONA || "Cluster"}</b><br/><span style="color:#64748b">Kawasan:</span> ${props.Kawasan || "-"}<br/><span style="color:#64748b">Luas:</span> ${props.Luas ? Number(props.Luas).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " m²" : "-"}<br/><div style="margin-top:4px;color:#334155">${props.ATURAN || "Aturan tidak tersedia"}</div></div>`
    );
  }, []);

  const clusterStyle = useCallback((feature) => {
    const clusterName = feature?.properties?.KODE_ZONA || "Cluster 1";
    return {
      color: "#ea580c",
      fillOpacity: 0,
      weight: 2,
      dashArray: CLUSTER_DASH[clusterName] || "8 6",
      opacity: 0.95,
    };
  }, []);

  const filteredTrackers = useMemo(() => {
    return TRACKER_LIST.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(trackerSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(trackerSearch.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchMessage = messageFilter === "all" || t.message === messageFilter;
      return matchSearch && matchStatus && matchMessage;
    });
  }, [trackerSearch, statusFilter, messageFilter]);

  const STATUS_DOT = {
    Online: "bg-green-500",
    Offline: "bg-red-500",
    Maintenance: "bg-amber-500",
  };
  const STATUS_BADGE = {
    Online:      "bg-green-50 border-green-200 text-green-700",
    Offline:     "bg-red-50   border-red-200   text-red-700",
    Maintenance: "bg-amber-50 border-amber-200 text-amber-700",
  };

  const kpiCards = [
    { label: "Devices Online",  value: kpi.online,      sub: "Total Tracker", icon: Wifi,    bg: "bg-green-50 border-green-100", iconColor: "text-green-500",  valueColor: "text-green-600" },
    { label: "Devices Offline", value: kpi.offline,     sub: "Total Tracker", icon: WifiOff, bg: "bg-red-50   border-red-100",   iconColor: "text-red-500",    valueColor: "text-red-600"   },
    { label: "Maintenance",     value: kpi.maintenance, sub: "Total Tracker", icon: Wrench,  bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-500",  valueColor: "text-amber-600" },
    { label: "Total Devices",   value: kpi.total,       sub: "Spot Trace",    icon: Radio,   bg: "bg-blue-50  border-blue-100",  iconColor: "text-blue-500",   valueColor: "text-blue-600"  },
    {
      label: "Update Terakhir",
      value: lastRefresh.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      sub: "Sinkronisasi Data",
      icon: Clock,
      bg: "bg-slate-50 border-slate-100",
      iconColor: "text-slate-500",
      valueColor: "text-slate-700",
    },
  ];

  return (
    <AdminLayout>
      <AdminHeader
        title="Tracking Realtime"
        subtitle="Monitoring posisi tracker secara real-time"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* KPI Flash Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {kpiCards.map((card) => (
            <div key={card.label} className={cn("rounded-2xl border p-4 shadow-sm", card.bg)}>
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold text-gray-700">{card.label}</p>
                <card.icon className={cn("w-4 h-4 flex-shrink-0", card.iconColor)} />
              </div>
              <p className={cn("text-2xl font-bold mt-2", card.valueColor)}>{card.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Map + Tracker Panel */}
        <div className="flex gap-4">
          {/* Map Card */}
          <Card className="flex-1 overflow-hidden min-w-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Peta Tracking Realtime
                </CardTitle>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                    Auto Refresh
                    <button
                      type="button"
                      role="switch"
                      aria-checked={autoRefresh}
                      onClick={() => setAutoRefresh((p) => !p)}
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                        autoRefresh ? "bg-blue-600" : "bg-gray-300"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
                        autoRefresh ? "translate-x-4" : "translate-x-1"
                      )} />
                    </button>
                  </label>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={handleManualRefresh}>
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </Button>
                </div>
              </div>
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Input
                  placeholder="Cari tracker..."
                  value={trackerSearch}
                  onChange={(e) => setTrackerSearch(e.target.value)}
                  className="h-8 text-xs w-48"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={messageFilter} onValueChange={setMessageFilter}>
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pesan</SelectItem>
                    {["POSITION","TRACKING","UNLIMITED-TRACK","STOP","NEWMOVEMENT","POWER-OFF"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative" style={{ height: 520 }}>
                <MapContainer center={[-0.72, 130.42]} zoom={8} style={{ height: "100%", width: "100%" }}>
                  <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {layerVisibility.zones && zoneFeatures.length > 0 && (
                    <GeoJSON
                      key={`zones-${zoneFeatures.length}`}
                      data={filteredZones}
                      style={(feature) => ZONE_STYLE[feature?.properties?.__zoneKey] || ZONE_STYLE.Lainnya}
                      onEachFeature={onEachZoneFeature}
                    />
                  )}

                  {layerVisibility.cluster && filteredClusters?.features?.length > 0 && (
                    <GeoJSON
                      key={`cluster-${filteredClusters.features.length}`}
                      data={filteredClusters}
                      style={clusterStyle}
                      onEachFeature={onEachClusterFeature}
                    />
                  )}

                  {layerVisibility.divers &&
                    diverRows.map((row) => (
                      <Marker key={row.id} position={[row.lat, row.lng]} icon={iconByActivityType(row.activityType)}>
                        <Popup>
                          <div className="text-xs leading-6">
                            <b>{row.properties.Nama || "Diver Point"}</b>
                            <br />
                            <span className="text-slate-500">Kegiatan:</span> {row.properties.Kegiatan_1 || "-"}
                            <br />
                            <span className="text-slate-500">Lokasi:</span> {row.properties.Lokasi_Kaw || "-"}
                            <br />
                            <span className="text-slate-500">Kedalaman:</span> {row.properties.Kedalaman_ || "-"}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>

                {loading && (
                  <div className="absolute left-1/2 top-3 z-[1000] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs text-slate-600 shadow-md">
                    <Loader2 className="h-3 w-3 animate-spin" /> Memuat GeoJSON...
                  </div>
                )}

                <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-slate-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm">
                  <p className="mb-2 font-semibold text-slate-700">Aktivitas Titik</p>
                  <div className="space-y-1.5 text-slate-600">
                    <p className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full border-2 border-blue-100 bg-blue-600" /> Diving
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rotate-45 rounded-[2px] border-2 border-teal-100 bg-teal-500" /> Snorkeling
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full border-2 border-blue-100 bg-[linear-gradient(135deg,#2563eb_50%,#0ea5a4_50%)]" /> Diving + Snorkeling
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="absolute bottom-4 left-4 z-[1000] h-8 gap-1.5 bg-white text-slate-700 hover:bg-slate-100"
                  onClick={() => setLayersOpen((prev) => !prev)}
                >
                  <Layers className="h-3.5 w-3.5" /> Legend & Layers
                </Button>

                {layersOpen && (
                  <LayersPanel
                    layerVisibility={layerVisibility}
                    setLayerVisibility={setLayerVisibility}
                    zoneVisibility={zoneVisibility}
                    setZoneVisibility={setZoneVisibility}
                    clusterVisibility={clusterVisibility}
                    setClusterVisibility={setClusterVisibility}
                    onClose={() => setLayersOpen(false)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tracker List Panel */}
          <div className="w-72 flex-shrink-0">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  List Trackers ({filteredTrackers.length}) Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 overflow-y-auto max-h-[560px]">
                {filteredTrackers.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">Tidak ada tracker ditemukan</p>
                ) : (
                  filteredTrackers.map((t) => (
                    <div key={t.id} className="rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                        <span className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0",
                          STATUS_BADGE[t.status] ?? "bg-slate-50 border-slate-200 text-slate-700"
                        )}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t.locationDuration}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Pesan: {t.message}</p>
                      <p className="text-[11px] text-gray-400">Update Terakhir: {t.lastUpdate}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
