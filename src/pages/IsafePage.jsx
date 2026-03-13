import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import {
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import geoJsonUrl from "@/data/GeoJson.geojson?url";

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATUS = { ONLINE: "online", OFFLINE: "offline", MAINTENANCE: "maintenance" };

const BOAT_TYPES = {
  BAGAN:      "Bagan Tradisional",
  JOLOR:      "Jolor",
  PENAMPUNG:  "Kapal Penampung",
  KETINTING:  "Ketinting",
  LAIN:       "Lain-lain",
  LIVEABOARD: "Liveaboard",
  SPEED:      "Speed Boat",
};

const TYPE_COLORS = {
  [BOAT_TYPES.BAGAN]:      "#ef4444",
  [BOAT_TYPES.JOLOR]:      "#f97316",
  [BOAT_TYPES.PENAMPUNG]:  "#eab308",
  [BOAT_TYPES.KETINTING]:  "#22c55e",
  [BOAT_TYPES.LAIN]:       "#94a3b8",
  [BOAT_TYPES.LIVEABOARD]: "#3b82f6",
  [BOAT_TYPES.SPEED]:      "#8b5cf6",
};

const KAWASAN_LIST = [
  "Area 1 - Perairan Kepulauan Ayau-Asia",
  "Area 2 - Perairan Teluk Mayalibit",
  "Area 3 - Perairan Selat Dampier",
  "Area 4 - Perairan Kepulauan Misool",
  "Area 5 - Perairan Kepulauan Kofiau-Boo",
  "Area 6 - Perairan Kepulauan Fam",
  "Area 7- Perairan Kepulauan Misool Utara",
];

const ZONASI_LIST = ["Zona Inti", "Zona Pemanfaatan Terbatas", "Zona Sasi", "Zona Lainnya"];

const ZONASI_STYLE = {
  "Zona Inti":                 { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.15, weight: 1.5 },
  "Zona Pemanfaatan Terbatas": { color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.15, weight: 1.5 },
  "Zona Sasi":                 { color: "#eab308", fillColor: "#eab308", fillOpacity: 0.12, weight: 1.5 },
  "Zona Lainnya":              { color: "#94a3b8", fillColor: "#94a3b8", fillOpacity: 0.10, weight: 1 },
};

// â”€â”€â”€ Dummy Boat Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Each boat has: current position (lat/lng), destination (destLat/destLng),
// origin (originLat/originLng - used when reversing direction).
// Offline boats do not move.

const INITIAL_BOATS = [
  {
    id: 1001, name: "KM Harapan Jaya",
    type: BOAT_TYPES.PENAMPUNG,
    lat: -0.574, lng: 130.618,
    destLat: -0.648, destLng: 130.738, originLat: -0.574, originLng: 130.618,
    status: STATUS.ONLINE,  device: "AIS-001", battery: "85%", violation: false, patroli: true,
    color: TYPE_COLORS[BOAT_TYPES.PENAMPUNG], trail: [[-0.574, 130.618]],
  },
  {
    id: 1002, name: "Bagan Merah 01",
    type: BOAT_TYPES.BAGAN,
    lat: -0.520, lng: 130.749,
    destLat: -0.468, destLng: 130.842, originLat: -0.520, originLng: 130.749,
    status: STATUS.ONLINE, device: "VHF-012", battery: "62%", violation: false, patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.BAGAN], trail: [[-0.520, 130.749]],
  },
  {
    id: 1003, name: "Ketinting Waisai",
    type: BOAT_TYPES.KETINTING,
    lat: -0.352, lng: 130.935,
    destLat: -0.285, destLng: 130.882, originLat: -0.352, originLng: 130.935,
    status: STATUS.ONLINE, device: "GPS-034", battery: "91%", violation: false, patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.KETINTING], trail: [[-0.352, 130.935]],
  },
  {
    id: 1004, name: "Jolor Kofiau 03",
    type: BOAT_TYPES.JOLOR,
    lat: -1.153, lng: 129.843,
    destLat: -1.246, destLng: 129.775, originLat: -1.153, originLng: 129.843,
    status: STATUS.ONLINE, device: "VHF-056", battery: "44%", violation: true,  patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.JOLOR], trail: [[-1.153, 129.843]],
  },
  {
    id: 1005, name: "Liveaboard Raja IV",
    type: BOAT_TYPES.LIVEABOARD,
    lat: -0.682, lng: 130.282,
    destLat: -0.608, destLng: 130.462, originLat: -0.682, originLng: 130.282,
    status: STATUS.ONLINE, device: "AIS-078", battery: "100%", violation: false, patroli: true,
    color: TYPE_COLORS[BOAT_TYPES.LIVEABOARD], trail: [[-0.682, 130.282]],
  },
  {
    id: 1006, name: "Ketinting Misool 02",
    type: BOAT_TYPES.KETINTING,
    lat: -1.980, lng: 130.050,
    destLat: -2.044, destLng: 129.968, originLat: -1.980, originLng: 130.050,
    status: STATUS.ONLINE, device: "GPS-091", battery: "78%", violation: false, patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.KETINTING], trail: [[-1.980, 130.050]],
  },
  {
    id: 1007, name: "Speed Patrol 01",
    type: BOAT_TYPES.SPEED,
    lat: -0.610, lng: 130.520,
    destLat: -0.552, destLng: 130.626, originLat: -0.610, originLng: 130.520,
    status: STATUS.ONLINE, device: "AIS-022", battery: "96%", violation: false, patroli: true,
    color: TYPE_COLORS[BOAT_TYPES.SPEED], trail: [[-0.610, 130.520]],
  },
  {
    id: 1008, name: "Bagan Ayau 07",
    type: BOAT_TYPES.BAGAN,
    lat: 0.362, lng: 131.052,
    destLat: 0.308, destLng: 130.964, originLat: 0.362, originLng: 131.052,
    status: STATUS.MAINTENANCE, device: "VHF-114", battery: "23%", violation: false, patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.BAGAN], trail: [[0.362, 131.052]],
  },
  {
    id: 1009, name: "Jolor Fam 08",
    type: BOAT_TYPES.JOLOR,
    lat: -0.720, lng: 130.195,
    destLat: -0.794, destLng: 130.328, originLat: -0.720, originLng: 130.195,
    status: STATUS.ONLINE, device: "GPS-145", battery: "57%", violation: false, patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.JOLOR], trail: [[-0.720, 130.195]],
  },
  {
    id: 1010, name: "Lain-lain Misool",
    type: BOAT_TYPES.LAIN,
    lat: -1.752, lng: 130.399,
    destLat: -1.815, destLng: 130.324, originLat: -1.752, originLng: 130.399,
    status: STATUS.OFFLINE, device: "AIS-167", battery: "5%", violation: true,  patroli: false,
    color: TYPE_COLORS[BOAT_TYPES.LAIN], trail: [[-1.752, 130.399]],
  },
];

const TEMUAN_TERKINI = [
  { id: 1, name: "KM Harapan Jaya",  area: "Perairan Teluk Kabul, Selat Dampier",  time: "08:42", violation: false },
  { id: 2, name: "Jolor Kofiau 03",  area: "Zona Inti, Kepulauan Kofiau-Boo",      time: "07:15", violation: true  },
  { id: 3, name: "Bagan Merah 01",   area: "Perairan Selat Dampier",               time: "06:33", violation: false },
  { id: 4, name: "Lain-lain Misool", area: "Zona Inti, Kepulauan Misool Utara",    time: "05:50", violation: true  },
];

// â”€â”€â”€ Icon Factories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function createBoatIcon(boat, isSelected) {
  const bg = isSelected ? "#fff" : boat.violation ? "#ef4444" : "#1a3c6e";
  const border = isSelected ? `3px solid ${boat.violation ? "#ef4444" : "#1a3c6e"}` : "2px solid rgba(255,255,255,0.9)";
  const size = isSelected ? 20 : 13;
  const shadow = isSelected
    ? "0 0 0 3px rgba(26,60,110,0.25), 0 3px 10px rgba(0,0,0,0.4)"
    : boat.violation
    ? "0 0 0 2px rgba(239,68,68,0.3), 0 2px 6px rgba(0,0,0,0.3)"
    : "0 2px 6px rgba(0,0,0,0.35)";
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:${bg};border-radius:50%;border:${border};box-shadow:${shadow};cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function createDestIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:9px;height:9px;background:${color};border:2px solid white;transform:rotate(45deg);box-shadow:0 1px 4px rgba(0,0,0,0.4);opacity:0.75;"></div>`,
    iconSize: [13, 13],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

// â”€â”€â”€ MapController â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MapController({ targetBoat, onMapReady }) {
  const map = useMap();
  useEffect(() => { onMapReady(map); }, [map, onMapReady]);
  useEffect(() => {
    if (targetBoat) map.flyTo([targetBoat.lat, targetBoat.lng], 13, { duration: 1.4 });
  }, [targetBoat]); // eslint-disable-line
  return null;
}

// â”€â”€â”€ KawasanGeoJSONLayer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function KawasanGeoJSONLayer({ geoData, kawasanVisibility, zonasiVisibility }) {
  const filtered = useMemo(() => {
    if (!geoData) return null;
    const features = geoData.features.filter(
      (f) =>
        f.properties?.Zonasi &&
        kawasanVisibility[f.properties.Kawasan] !== false &&
        zonasiVisibility[f.properties.Zonasi] !== false
    );
    return { type: "FeatureCollection", features };
  }, [geoData, kawasanVisibility, zonasiVisibility]);

  const layerKey = useMemo(
    () => (filtered ? filtered.features.length + JSON.stringify(kawasanVisibility) + JSON.stringify(zonasiVisibility) : "empty"),
    [filtered, kawasanVisibility, zonasiVisibility]
  );

  const styleFeature = useCallback(
    (f) => ZONASI_STYLE[f.properties.Zonasi] || { color: "#94a3b8", fillColor: "#94a3b8", fillOpacity: 0.1, weight: 1 },
    []
  );

  const onEachFeature = useCallback((feature, layer) => {
    const { Kawasan, Zonasi, Luas_Ha } = feature.properties;
    layer.bindPopup(
      `<div style="font-size:12px;line-height:1.8">
        <b>${Kawasan}</b><br/>
        <span style="color:#6b7280">Zonasi:</span> ${Zonasi}<br/>
        <span style="color:#6b7280">Luas:</span> ${Luas_Ha ? Number(Luas_Ha).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " Ha" : "N/A"}
      </div>`
    );
    layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.38, weight: 2.5 }));
    layer.on("mouseout", () => layer.resetStyle());
  }, []);

  if (!filtered || filtered.features.length === 0) return null;
  return <GeoJSON key={layerKey} data={filtered} style={styleFeature} onEachFeature={onEachFeature} />;
}

// ─── MapLegend Panel ──────────────────────────────────────────────────────────

function MapLegend({
  kawasanVisibility, setKawasanVisibility,
  zonasiVisibility,  setZonasiVisibility,
  showBoatMarkers,   setShowBoatMarkers,
  onClose,
}) {
  const [sec, setSec] = React.useState({ kawasan: true, zonasi: false, boats: true });
  const toggle = (s) => setSec((p) => ({ ...p, [s]: !p[s] }));

  const SH = ({ id, label }) => (
    <button
      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      onClick={() => toggle(id)}
    >
      <span>{label}</span>
      {sec[id] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
    </button>
  );

  return (
    <div
      className="absolute z-[1000] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      style={{ bottom: 100, left: 16, width: 218 }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 bg-[#1a3c6e]">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Layers size={12} /> Legend &amp; Layers
        </span>
        <button onClick={onClose} className="text-blue-200 hover:text-white"><X size={13} /></button>
      </div>

      {/* Kawasan */}
      <div className="border-b border-gray-100">
        <SH id="kawasan" label="Layer Kawasan" />
        {sec.kawasan && (
          <div className="px-3 pb-2.5 space-y-1 max-h-36 overflow-y-auto">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600">
              <input
                type="checkbox"
                className="accent-[#1a3c6e]"
                checked={KAWASAN_LIST.every((k) => kawasanVisibility[k] !== false)}
                onChange={(e) =>
                  setKawasanVisibility(Object.fromEntries(KAWASAN_LIST.map((k) => [k, e.target.checked])))
                }
              />
              Semua Kawasan
            </label>
            {KAWASAN_LIST.map((name) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                <input
                  type="checkbox"
                  className="accent-[#1a3c6e]"
                  checked={kawasanVisibility[name] !== false}
                  onChange={() => setKawasanVisibility((p) => ({ ...p, [name]: !p[name] }))}
                />
                {name.replace(/Area d+[-–s]*/i, '').trim() || name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Zonasi */}
      <div className="border-b border-gray-100">
        <SH id="zonasi" label="Filter Zonasi" />
        {sec.zonasi && (
          <div className="px-3 pb-2.5 space-y-1">
            {ZONASI_LIST.map((name) => {
              const s = ZONASI_STYLE[name] || {};
              return (
                <label key={name} className="flex items-center gap-2 cursor-pointer text-xs text-gray-500">
                  <input
                    type="checkbox"
                    className="accent-[#1a3c6e]"
                    checked={zonasiVisibility[name] !== false}
                    onChange={() => setZonasiVisibility((p) => ({ ...p, [name]: !p[name] }))}
                  />
                  <span className="w-3 h-3 rounded-sm flex-shrink-0 inline-block" style={{ background: s.fillColor, border: `1.5px solid ${s.color}` }} />
                  {name}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Boats */}
      <div className="border-b border-gray-100">
        <SH id="boats" label="Layer Kapal" />
        {sec.boats && (
          <div className="px-3 pb-2.5 space-y-1.5 text-xs text-gray-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#1a3c6e]" checked={showBoatMarkers} onChange={(e) => setShowBoatMarkers(e.target.checked)} />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a3c6e] flex-shrink-0 inline-block border border-white" />
              Marker Kapal
            </label>
          </div>
        )}
      </div>

      {/* Zonasi color key */}
      <div className="px-3 py-2.5 bg-gray-50 space-y-1">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Keterangan Zonasi</p>
        {ZONASI_LIST.map((name) => {
          const s = ZONASI_STYLE[name] || {};
          return (
            <div key={name} className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0 inline-block" style={{ background: s.fillColor, border: `1px solid ${s.color}` }} />
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SispandalwasPage() {
  const [boats, setBoats] = React.useState(INITIAL_BOATS);

  // Form state
  const [name, setName] = React.useState('');
  const [lat, setLat] = React.useState('');
  const [lng, setLng] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [device, setDevice] = React.useState('');
  const [battery, setBattery] = React.useState('');
  const [boatType, setBoatType] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);

  // Map UI state
  const [selectedBoatId, setSelectedBoatId] = React.useState(null);
  const [legendOpen, setLegendOpen] = React.useState(false);
  const [kawasanVisibility, setKawasanVisibility] = React.useState(
    Object.fromEntries(KAWASAN_LIST.map((k) => [k, true]))
  );
  const [zonasiVisibility, setZonasiVisibility] = React.useState(
    Object.fromEntries(ZONASI_LIST.map((z) => [z, true]))
  );
  const [showBoatMarkers, setShowBoatMarkers] = React.useState(true);

  // GeoJSON load
  const [geoData, setGeoData] = React.useState(null);
  const [geoLoading, setGeoLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(geoJsonUrl)
      .then((r) => r.json())
      .then((data) => { setGeoData(data); setGeoLoading(false); })
      .catch((err) => { console.error('GeoJSON:', err); setGeoLoading(false); });
  }, []);

  const rowRefs = React.useRef({});
  const mapRef = React.useRef(null);
  const formattedDate = React.useMemo(() => dayjs().format('YYYY-MM-DD HH:mm:ss'), []);

  const targetBoat = React.useMemo(
    () => (selectedBoatId ? boats.find((b) => b.id === selectedBoatId) ?? null : null),
    [selectedBoatId, boats]
  );

  React.useEffect(() => {
    if (selectedBoatId && rowRefs.current[selectedBoatId]) {
      rowRefs.current[selectedBoatId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedBoatId]);

  React.useEffect(() => {
    if (editingId) {
      const b = boats.find((b) => b.id === editingId);
      if (b) { setLat(b.lat.toString()); setLng(b.lng.toString()); }
    }
  }, [boats, editingId]);

  // Live tracking — boats move toward destination
  React.useEffect(() => {
    const id = setInterval(() => {
      setBoats((prev) =>
        prev.map((boat) => {
          if (boat.status === STATUS.OFFLINE) return boat;
          const dlat = boat.destLat - boat.lat;
          const dlng = boat.destLng - boat.lng;
          const dist = Math.sqrt(dlat * dlat + dlng * dlng);
          if (dist < 0.003) {
            return { ...boat, destLat: boat.originLat, destLng: boat.originLng, originLat: boat.destLat, originLng: boat.destLng };
          }
          const speed = boat.type === BOAT_TYPES.SPEED ? 0.0028 : 0.0014;
          const factor = speed / dist;
          const noise = 0.0001;
          const nLat = parseFloat((boat.lat + dlat * factor + (Math.random() - 0.5) * noise).toFixed(6));
          const nLng = parseFloat((boat.lng + dlng * factor + (Math.random() - 0.5) * noise).toFixed(6));
          return { ...boat, lat: nLat, lng: nLng, trail: [...boat.trail.slice(-90), [nLat, nLng]] };
        })
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const handleMapReady = React.useCallback((map) => { mapRef.current = map; }, []);
  const handleMarkerClick = React.useCallback((boat) => {
    setSelectedBoatId((prev) => (prev === boat.id ? null : boat.id));
  }, []);
  const handleTableRowClick = React.useCallback((boat) => {
    setSelectedBoatId((prev) => (prev === boat.id ? null : boat.id));
  }, []);

  const resetForm = () => {
    setName(''); setLat(''); setLng(''); setStatus(''); setDevice(''); setBattery(''); setBoatType('');
  };

  const saveBoat = (e) => {
    e.preventDefault();
    if (!name || !lat || !lng || !status || !device || !battery || !boatType) {
      alert('Lengkapi semua data tracker');
      return;
    }
    if (editingId) {
      setBoats((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? { ...b, name, lat: parseFloat(lat), lng: parseFloat(lng), status, device, battery, type: boatType, color: TYPE_COLORS[boatType] || '#94a3b8' }
            : b
        )
      );
      setEditingId(null);
    } else {
      const nLat = parseFloat(lat), nLng = parseFloat(lng);
      setBoats((prev) => [
        ...prev,
        {
          id: Date.now(), name, type: boatType, status, device, battery,
          lat: nLat, lng: nLng,
          destLat: nLat + 0.08, destLng: nLng + 0.08,
          originLat: nLat, originLng: nLng,
          violation: false, patroli: false,
          color: TYPE_COLORS[boatType] || '#94a3b8',
          trail: [[nLat, nLng]],
        },
      ]);
    }
    resetForm();
    setShowForm(false);
  };

  const editBoat = (boat) => {
    setName(boat.name); setLat(boat.lat); setLng(boat.lng);
    setStatus(boat.status); setDevice(boat.device); setBattery(boat.battery); setBoatType(boat.type);
    setEditingId(boat.id); setShowForm(true);
  };

  const deleteBoat = (id) => {
    if (window.confirm('Hapus tracker ini?')) {
      setBoats((prev) => prev.filter((b) => b.id !== id));
      if (selectedBoatId === id) setSelectedBoatId(null);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Sispandalwas Monitoring"
        subtitle="Live Vessel Tracking — Raja Ampat"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-y-auto p-4">

        {/* Map */}
        <Card className="mb-5 overflow-hidden rounded-xl shadow-md">
          <CardContent className="p-0">
            <div className="relative" style={{ height: 620 }}>
              <MapContainer
                center={[-0.72, 130.42]}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <KawasanGeoJSONLayer
                  geoData={geoData}
                  kawasanVisibility={kawasanVisibility}
                  zonasiVisibility={zonasiVisibility}
                />

                {/* Route + trail + destination — only shown for the selected boat */}
                {selectedBoatId && boats
                  .filter((boat) => boat.id === selectedBoatId)
                  .map((boat) => (
                    <React.Fragment key={`sel-${boat.id}`}>
                      <Polyline
                        positions={[[boat.lat, boat.lng], [boat.destLat, boat.destLng]]}
                        pathOptions={{ color: boat.color, weight: 1.5, dashArray: '4 7', opacity: 0.65 }}
                      />
                      <Marker
                        position={[boat.destLat, boat.destLng]}
                        icon={createDestIcon(boat.color)}
                      >
                        <Popup>
                          <div style={{ fontSize: 12, lineHeight: 1.7 }}>
                            <b>Tujuan — {boat.name}</b><br />
                            {boat.destLat.toFixed(5)}, {boat.destLng.toFixed(5)}
                          </div>
                        </Popup>
                      </Marker>
                      <Polyline
                        positions={boat.trail}
                        pathOptions={{ color: boat.color, weight: 2.5, opacity: 0.9 }}
                      />
                    </React.Fragment>
                  ))}

                {/* Boat markers — always visible */}
                {showBoatMarkers &&
                  boats.map((boat) => (
                    <Marker
                      key={`m-${boat.id}-${boat.lat}-${boat.lng}-${selectedBoatId === boat.id}`}
                      position={[boat.lat, boat.lng]}
                      icon={createBoatIcon(boat, selectedBoatId === boat.id)}
                      eventHandlers={{ click: () => handleMarkerClick(boat) }}
                    >
                      <Popup>
                        <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                          <b>{boat.name}</b>
                          {boat.violation && <span style={{ color: '#ef4444', marginLeft: 6 }}>⚠ Pelanggaran</span>}
                          <br />
                          <span style={{ color: '#6b7280' }}>Tipe:</span> {boat.type}<br />
                          <span style={{ color: '#6b7280' }}>Posisi:</span> {boat.lat.toFixed(5)}, {boat.lng.toFixed(5)}<br />
                          <span style={{ color: '#6b7280' }}>Tujuan:</span> {boat.destLat.toFixed(5)}, {boat.destLng.toFixed(5)}<br />
                          <span style={{ color: '#6b7280' }}>Status:</span> {boat.status}<br />
                          <span style={{ color: '#6b7280' }}>Baterai:</span> {boat.battery}
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                <MapController targetBoat={targetBoat} onMapReady={handleMapReady} />
              </MapContainer>

              {geoLoading && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 rounded-full px-4 py-1.5 text-xs text-gray-500 flex items-center gap-1.5 shadow-md">
                  <Loader2 className="w-3 h-3 animate-spin" /> Memuat kawasan…
                </div>
              )}

              {selectedBoatId && (
                <div className="absolute top-3 right-3 z-[1000] bg-white/90 rounded-lg px-3 py-1.5 text-xs text-gray-600 shadow-md border border-gray-200">
                  Klik kapal lagi untuk menyembunyikan jalur
                </div>
              )}

              <button
                className="absolute z-[1000] bg-white shadow-md rounded-lg px-3 py-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ bottom: 44, left: 16 }}
                onClick={() => setLegendOpen((p) => !p)}
              >
                <Layers size={13} />
                Legend &amp; Layers
              </button>

              {legendOpen && (
                <MapLegend
                  kawasanVisibility={kawasanVisibility}
                  setKawasanVisibility={setKawasanVisibility}
                  zonasiVisibility={zonasiVisibility}
                  setZonasiVisibility={setZonasiVisibility}
                  showBoatMarkers={showBoatMarkers}
                  setShowBoatMarkers={setShowBoatMarkers}
                  onClose={() => setLegendOpen(false)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table toolbar */}
        <div className="mb-3 flex justify-end">
          <Button className="btn-ocean gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Tambah Tracker
          </Button>
        </div>

        {/* Tracker Table */}
        <Card className="card-ocean overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Daftar Tracker
              {selectedBoatId && (
                <span className="text-xs font-normal text-blue-500 ml-1">
                  ● Klik kapal atau baris untuk melihat jalur
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama Kapal</th>
                    <th>Jenis</th>
                    <th>Posisi Saat Ini</th>
                    <th>Titik Tujuan</th>
                    <th>Status</th>
                    <th>Device</th>
                    <th>Baterai</th>
                    <th>Update</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {boats.map((boat) => (
                    <tr
                      key={boat.id}
                      ref={(el) => { rowRefs.current[boat.id] = el; }}
                      onClick={() => handleTableRowClick(boat)}
                      className={`cursor-pointer transition-colors ${
                        selectedBoatId === boat.id
                          ? 'bg-blue-50 border-l-4 border-l-[#1a3c6e]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white shadow-sm"
                            style={{ background: boat.color }}
                          />
                          <span className="font-medium text-sm">{boat.name}</span>
                          {boat.violation && (
                            <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: boat.color + '22', color: boat.color, border: `1px solid ${boat.color}44` }}
                        >
                          {boat.type}
                        </span>
                      </td>
                      <td className="font-mono text-xs text-gray-500">
                        {boat.lat.toFixed(4)}, {boat.lng.toFixed(4)}
                      </td>
                      <td className="font-mono text-xs text-gray-400">
                        {boat.destLat.toFixed(4)}, {boat.destLng.toFixed(4)}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            boat.status === STATUS.ONLINE
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : boat.status === STATUS.OFFLINE
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}
                        >
                          {boat.status}
                        </span>
                      </td>
                      <td className="text-xs text-gray-500">{boat.device}</td>
                      <td>
                        <span
                          className={`text-xs font-semibold ${parseInt(boat.battery) < 30 ? 'text-red-500' : 'text-green-600'}`}
                        >
                          {boat.battery}
                        </span>
                      </td>
                      <td className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</td>
                      <td className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button className="btn-yellow" onClick={() => editBoat(boat)}>Edit</Button>
                        <Button className="btn-red" onClick={() => deleteBoat(boat.id)}>Hapus</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <Card className="w-[440px] relative z-[10000]">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Tracker' : 'Tambah Tracker'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveBoat} className="space-y-3">
                <div>
                  <Label>Nama Kapal</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Latitude</Label>
                    <Input value={lat} onChange={(e) => setLat(e.target.value)} />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input value={lng} onChange={(e) => setLng(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Jenis Kapal</Label>
                  <Select value={boatType} onValueChange={setBoatType}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Pilih Jenis" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {Object.values(BOAT_TYPES).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value={STATUS.ONLINE}>Online</SelectItem>
                      <SelectItem value={STATUS.OFFLINE}>Offline</SelectItem>
                      <SelectItem value={STATUS.MAINTENANCE}>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Device ID</Label>
                    <Input value={device} onChange={(e) => setDevice(e.target.value)} />
                  </div>
                  <div>
                    <Label>Baterai</Label>
                    <Input value={battery} placeholder="misal: 75%" onChange={(e) => setBattery(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="btn-ocean flex-1">
                    {editingId ? 'Update' : 'Tambah'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
