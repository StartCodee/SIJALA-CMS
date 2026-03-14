import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { BarChart3, Layers, Radio, Radar, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  loadGeoJsonFromPublic,
  normalizeZoneName,
  pointFromFeature,
} from "@/lib/geojsonUtils";
import { TRACKER_LIST, getKpiStats, getMessageStats } from "@/data/sispandalwas/trackerData";

const TAB_OPTIONS = [
  { key: "map", label: "Tracker", icon: Radio },
  { key: "radar", label: "Radar", icon: Radar },
  { key: "statistics", label: "Statistics", icon: BarChart3 },
];

const ZONE_STYLE = {
  Inti: { color: "#b8b8b8", fillColor: "#EA3323", fillOpacity: 0.72, weight: 0.6 },
  "Pemanfaatan Terbatas": { color: "#9ba39a", fillColor: "#AFFCA1", fillOpacity: 0.72, weight: 0.6 },
  Lainnya: { color: "#9d9d9d", fillColor: "#828282", fillOpacity: 0.66, weight: 0.6 },
};
const ZONE_ORDER = ["Inti", "Pemanfaatan Terbatas", "Lainnya"];
const CLUSTER_ORDER = ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"];
const CLUSTER_DASH = {
  "Cluster 1": "12 6",
  "Cluster 2": "8 6",
  "Cluster 3": "4 6",
  "Cluster 4": "16 4 4 4",
};

const trackerIcon = L.divIcon({
  className: "",
  html: '<div style="width:12px;height:12px;border-radius:999px;background:#f59e0b;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const divingIcon = L.divIcon({
  className: "",
  html: '<div style="width:11px;height:11px;border-radius:999px;background:#2563eb;border:2px solid #dbeafe;box-shadow:0 2px 8px rgba(37,99,235,.4)"></div>',
  iconSize: [11, 11],
  iconAnchor: [5, 5],
});

const snorkelingIcon = L.divIcon({
  className: "",
  html: '<div style="width:11px;height:11px;border-radius:3px;background:#0ea5a4;border:2px solid #ccfbf1;box-shadow:0 2px 8px rgba(14,165,164,.35);transform:rotate(45deg)"></div>',
  iconSize: [11, 11],
  iconAnchor: [5, 5],
});

const divingSnorkelingIcon = L.divIcon({
  className: "",
  html: '<div style="width:11px;height:11px;border-radius:999px;background:linear-gradient(135deg,#2563eb 50%, #0ea5a4 50%);border:2px solid #dbeafe;box-shadow:0 2px 8px rgba(37,99,235,.35)"></div>',
  iconSize: [11, 11],
  iconAnchor: [5, 5],
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

  return `<div style="font-size:12px;line-height:1.6;min-width:300px;max-width:360px;max-height:360px;overflow:auto;padding-right:4px">${items || `<div style="color:#64748b">Data area tidak tersedia untuk zona ${escapeHtml(zone)}</div>`}</div>`;
}

function HeaderBar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-slate-900">
      <div className="min-w-0">
        <h1 className="text-[34px] leading-none font-black tracking-tight">SISPANDALWAS</h1>
        <p className="mt-1 text-[20px] text-slate-600">Sistem Informasi Patroli & Pengawasan Jaga Laut</p>
      </div>
      <div className="h-11 w-11 rounded-full bg-[#2173ff] text-white font-bold grid place-items-center">AU</div>
    </header>
  );
}

function TabBar({ activeTab }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2 text-slate-900">
      {TAB_OPTIONS.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.key}
            to={`/embed?tab=${tab.key}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
              activeTab === tab.key
                ? "bg-[#1f67f2] text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

function EmbedLayersPanel({
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
            Titik Penyelam
          </label>
        </div>

        <div>
          <p className="mb-1 font-semibold text-slate-600">Filter Zona</p>
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
              <svg width="18" height="8" viewBox="0 0 18 8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke="#ea580c"
                  strokeWidth="2"
                  strokeDasharray={CLUSTER_DASH[cluster] || "8 6"}
                />
              </svg>
              {cluster}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapTab() {
  const trackers = TRACKER_LIST;
  const [zoneGeoJson, setZoneGeoJson] = useState(null);
  const [clusterGeoJson, setClusterGeoJson] = useState(null);
  const [diverGeoJson, setDiverGeoJson] = useState(null);

  const [layerVisibility, setLayerVisibility] = useState({ zones: true, cluster: true, divers: true });
  const [zoneVisibility, setZoneVisibility] = useState({ Inti: true, "Pemanfaatan Terbatas": true, Lainnya: true });
  const [clusterVisibility, setClusterVisibility] = useState({ "Cluster 1": true, "Cluster 2": true, "Cluster 3": true, "Cluster 4": true });
  const [layersOpen, setLayersOpen] = useState(false);

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
        return zoneVisibility[zoneKey] !== false;
      });
  }, [zoneGeoJson, zoneVisibility]);

  const filteredZones = useMemo(() => ({ type: "FeatureCollection", features: zoneFeatures }), [zoneFeatures]);

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

    layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.9, weight: 0.8 }));
    layer.on("mouseout", () => layer.setStyle(ZONE_STYLE[zone] || ZONE_STYLE.Lainnya));
  }, [zoneAreaRows]);

  const onEachClusterFeature = useCallback((feature, layer) => {
    const props = feature.properties || {};
    layer.bindPopup(
      `<div style="font-size:12px;line-height:1.6;max-width:260px"><b>${props.KODE_ZONA || "Cluster"}</b><br/><span style="color:#64748b">Subzona:</span> ${props.Kawasan || "-"}<br/><span style="color:#64748b">Luas:</span> ${props.Luas ? Number(props.Luas).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " m²" : "-"}<br/><div style="margin-top:4px;color:#334155">${props.ATURAN || "Aturan tidak tersedia"}</div></div>`
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

  return (
    <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[1fr_460px] bg-[#f8fafc]">
      <div className="min-h-[440px] border-r border-slate-200 p-2.5">
        <div className="relative h-full min-h-[420px] overflow-hidden border border-slate-200 bg-white">
          <MapContainer center={[-0.72, 130.42]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {layerVisibility.zones && zoneFeatures.length > 0 && (
              <GeoJSON
                key={`zones-${zoneFeatures.length}`}
                data={filteredZones}
                style={(feature) => ZONE_STYLE[feature?.properties?.__zoneKey] || ZONE_STYLE.Lainnya}
                onEachFeature={onEachZoneFeature}
              />
            )}

            {layerVisibility.cluster && filteredClusters.features.length > 0 && (
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
                      <b>{row.properties.Nama || "Titik"}</b>
                      <br />
                      <span className="text-slate-500">Kegiatan:</span> {row.properties.Kegiatan_1 || "-"}
                      <br />
                      <span className="text-slate-500">Subzona:</span> {row.properties.Lokasi_Kaw || "-"}
                      <br />
                      <span className="text-slate-500">Kedalaman:</span> {row.properties.Kedalaman_ || "-"}
                    </div>
                  </Popup>
                </Marker>
              ))}

            {trackers.map((t) => (
              <Marker key={t.id} position={[t.lat, t.lng]} icon={trackerIcon}>
                <Popup>
                  <div className="text-xs leading-5">
                    <b>{t.name}</b>
                    <br />ID: {t.id}
                    <br />Status: {t.status}
                    <br />Pesan: {t.message}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="absolute left-4 bottom-4 z-[1000] rounded-lg bg-black/90 p-3 text-white shadow-lg">
            <p className="text-2xl font-black leading-none">Device Status</p>
            <div className="mt-2 space-y-1 text-base font-bold leading-tight">
              <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Aktif (0)</p>
              <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Maintenance (1)</p>
              <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Tidak Aktif (0)</p>
            </div>
          </div>

          <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 shadow-lg backdrop-blur-sm">
            <p className="mb-2 font-semibold">Aktivitas Titik</p>
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

          <button
            type="button"
            className="absolute right-4 bottom-4 z-[1000] rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow"
            onClick={() => setLayersOpen((prev) => !prev)}
          >
            Legend & Layers
          </button>

          {layersOpen && (
            <EmbedLayersPanel
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
      </div>

      <aside className="border-t border-slate-200 bg-[#f8fafc] xl:border-t-0">
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-2xl leading-none font-black text-slate-800">List Tracker (1) Devices:</h3>
        </div>
        <div className="p-3">
          {trackers.map((t) => (
            <div key={t.id} className="rounded-md border border-slate-200 bg-[#334155] p-3 text-white">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[34px] font-extrabold leading-none">{t.name}</p>
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[24px] font-semibold text-orange-400 leading-none">
                <TriangleAlert className="h-5 w-5" /> {t.locationDuration}
              </p>
              <p className="mt-2 text-[24px] text-slate-200 leading-none">ID: {t.id}</p>
              <p className="text-[24px] text-slate-300 leading-none">Position: {t.lat}, {t.lng}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function RadarTab() {
  return (
    <div className="grid flex-1 place-items-center bg-slate-50 p-8 text-center text-slate-800">
      <div>
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-cyan-300 bg-cyan-50">
          <Radar className="h-10 w-10 text-cyan-500" />
        </div>
        <h3 className="mt-5 text-2xl font-bold">Radar View</h3>
        <p className="mt-2 text-slate-600">Mode radar untuk visualisasi area pengawasan.</p>
      </div>
    </div>
  );
}

function StatisticsTab() {
  const kpi = getKpiStats(TRACKER_LIST);
  const msgStats = getMessageStats(TRACKER_LIST);

  return (
    <div className="space-y-4 bg-slate-50 p-4 text-slate-800">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs text-emerald-700">Online</p>
          <p className="text-2xl font-bold">{kpi.online}</p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-700">Offline</p>
          <p className="text-2xl font-bold">{kpi.offline}</p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-700">Maintenance</p>
          <p className="text-2xl font-bold">{kpi.maintenance}</p>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-700">Total Devices</p>
          <p className="text-2xl font-bold">{kpi.total}</p>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">Message Type Distribution</h4>
        <div className="space-y-2">
          {msgStats.map((item) => (
            <div key={item.type} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-600">{item.type}</span>
              <span className="text-slate-900 font-semibold">{item.count} devices ({item.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SispandalwasEmbedView() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "map";

  const activeTab = useMemo(() => {
    const valid = TAB_OPTIONS.some((item) => item.key === tab);
    return valid ? tab : "map";
  }, [tab]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <HeaderBar />
      <TabBar activeTab={activeTab} />

      <main className="flex min-h-0 flex-1 flex-col">
        {activeTab === "map" && <MapTab />}
        {activeTab === "radar" && <RadarTab />}
        {activeTab === "statistics" && <StatisticsTab />}
      </main>
    </div>
  );
}
