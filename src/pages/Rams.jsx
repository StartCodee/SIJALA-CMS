import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { Layers, Loader2, X } from "lucide-react";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  loadGeoJsonFromPublic,
  normalizeZoneName,
  pointFromFeature,
} from "@/lib/geojsonUtils";

const PAGE_SIZE = 10;

const ZONE_STYLE = {
  Inti: { color: "#b8b8b8", fillColor: "#EA3323", fillOpacity: 0.82, weight: 0.6 },
  "Pemanfaatan Terbatas": { color: "#9ba39a", fillColor: "#AFFCA1", fillOpacity: 0.82, weight: 0.6 },
  Lainnya: { color: "#9d9d9d", fillColor: "#828282", fillOpacity: 0.8, weight: 0.6 },
};

const ZONE_ORDER = ["Inti", "Pemanfaatan Terbatas", "Lainnya"];

const mooringIcon = L.divIcon({
  className: "",
  html: '<div style="width:22px;height:22px;border-radius:999px;background:#0f766e;border:2px solid #ecfeff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(15,118,110,.45)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ecfeff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"></circle><line x1="12" y1="7" x2="12" y2="16"></line><path d="M5 12a7 7 0 0 0 14 0"></path><path d="M8 19l4-3 4 3"></path></svg></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

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

function MapReadyBridge({ onReady }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

function LayersPanel({ layerVisibility, setLayerVisibility, zoneVisibility, setZoneVisibility, onClose }) {
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
              checked={layerVisibility.moorings}
              onChange={(event) => setLayerVisibility((prev) => ({ ...prev, moorings: event.target.checked }))}
            />
            Mooring Points
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
      </div>
    </div>
  );
}

function formatMooringFeature(feature, index) {
  const p = feature?.properties || {};
  const [lat, lng] = pointFromFeature(feature) || [null, null];

  return {
    id: `mooring-${index + 1}`,
    code: `MOOR-${String(index + 1).padStart(3, "0")}`,
    name: p.Name || "-",
    latitude: lat,
    longitude: lng,
    koordX: p.Koord_X || "-",
    koordY: p.Koord_Y || "-",
    status: "TERSEDIA",
    keterangan: p.Keterangan || "-",
  };
}

export default function RamsPage() {
  const [zoneGeoJson, setZoneGeoJson] = useState(null);
  const [mooringRows, setMooringRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState({
    zones: true,
    moorings: true,
  });
  const [zoneVisibility, setZoneVisibility] = useState({
    Inti: true,
    "Pemanfaatan Terbatas": true,
    Lainnya: true,
  });
  const [selectedMooringId, setSelectedMooringId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);

  const mapRef = useRef(null);
  const markerRefs = useRef({});

  useEffect(() => {
    let alive = true;

    Promise.all([
      loadGeoJsonFromPublic("/data/full-geo.geojson"),
      loadGeoJsonFromPublic("/data/titik_mooring.geojson"),
    ])
      .then(([zones, moorings]) => {
        if (!alive) return;
        setZoneGeoJson(zones);

        const initialRows = (moorings?.features || [])
          .map((feature, index) => formatMooringFeature(feature, index))
          .filter((row) => Number.isFinite(row.latitude) && Number.isFinite(row.longitude));
        setMooringRows(initialRows);
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
      .map((feature) => {
        const normalizedZone = normalizeZoneName(feature?.properties?.Zonasi);
        return {
          ...feature,
          properties: {
            ...feature.properties,
            __zoneKey: normalizedZone,
          },
        };
      })
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

  const totalPages = Math.max(1, Math.ceil(mooringRows.length / PAGE_SIZE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return mooringRows.slice(start, start + PAGE_SIZE);
  }, [mooringRows, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const onEachZoneFeature = useCallback((feature, layer) => {
    const props = feature.properties || {};
    const zone = props.__zoneKey || normalizeZoneName(props.Zonasi);
    const rows = zoneAreaRows[zone] || [];
    layer.bindPopup(buildZonePopupHtml(zone, rows));

    layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.96, weight: 0.8 }));
    layer.on("mouseout", () => layer.setStyle(ZONE_STYLE[zone] || ZONE_STYLE.Lainnya));
  }, [zoneAreaRows]);

  const handleRowClick = useCallback(
    (rowId) => {
      if (editingRowId === rowId) return;
      setSelectedMooringId(rowId);
      const marker = markerRefs.current[rowId];
      if (!marker || !mapRef.current) return;

      const latLng = marker.getLatLng();
      mapRef.current.flyTo([latLng.lat, latLng.lng], 11, { duration: 1.2 });
      marker.openPopup();
    },
    [editingRowId]
  );

  const startRowEdit = useCallback((row, event) => {
    event.stopPropagation();
    setEditingRowId(row.id);
    setEditingDraft({
      name: row.name,
      latitude: String(row.latitude),
      longitude: String(row.longitude),
      status: row.status,
      koordX: row.koordX,
      koordY: row.koordY,
      keterangan: row.keterangan,
    });
  }, []);

  const cancelRowEdit = useCallback((event) => {
    event.stopPropagation();
    setEditingRowId(null);
    setEditingDraft(null);
  }, []);

  const saveRowEdit = useCallback((rowId, event) => {
    event.stopPropagation();
    if (!editingDraft) return;

    const nextLat = Number(editingDraft.latitude);
    const nextLng = Number(editingDraft.longitude);

    if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) {
      alert("Latitude dan Longitude harus berupa angka yang valid.");
      return;
    }

    setMooringRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              name: editingDraft.name,
              latitude: nextLat,
              longitude: nextLng,
              status: editingDraft.status,
              koordX: editingDraft.koordX,
              koordY: editingDraft.koordY,
              keterangan: editingDraft.keterangan,
            }
          : row
      )
    );

    setEditingRowId(null);
    setEditingDraft(null);
  }, [editingDraft]);

  const updateDraft = useCallback((key, value) => {
    setEditingDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <AdminLayout>
      <AdminHeader
        title="SISPANDALWAS"
        subtitle="Monitoring Zona dan Mooring"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative" style={{ height: 540 }}>
              <MapContainer center={[-0.72, 130.42]} zoom={8} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapReadyBridge onReady={(map) => { mapRef.current = map; }} />

                {layerVisibility.zones && zoneFeatures.length > 0 && (
                  <GeoJSON
                    key={`zones-${zoneFeatures.length}`}
                    data={filteredZones}
                    style={(feature) => ZONE_STYLE[feature?.properties?.__zoneKey] || ZONE_STYLE.Lainnya}
                    onEachFeature={onEachZoneFeature}
                  />
                )}

                {layerVisibility.moorings &&
                  mooringRows.map((row) => (
                    <Marker
                      key={row.id}
                      position={[row.latitude, row.longitude]}
                      icon={mooringIcon}
                      ref={(ref) => {
                        if (ref) markerRefs.current[row.id] = ref;
                      }}
                      eventHandlers={{
                        click: () => setSelectedMooringId(row.id),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[220px] text-xs leading-6">
                          <div className="mb-1 text-[11px] font-semibold uppercase text-emerald-600">{row.code}</div>
                          <div className="text-base font-semibold text-slate-800">{row.name}</div>
                          <div><span className="text-slate-500">Koordinat:</span> {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}</div>
                          <div><span className="text-slate-500">Koor X:</span> {row.koordX}</div>
                          <div><span className="text-slate-500">Koor Y:</span> {row.koordY}</div>
                          <div><span className="text-slate-500">Status:</span> {row.status}</div>
                          <div><span className="text-slate-500">Keterangan:</span> {row.keterangan}</div>
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
                  onClose={() => setLayersOpen(false)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Data Mooring Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table min-w-[1180px]">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Koordinat</th>
                    <th>Status</th>
                    <th>Koor X</th>
                    <th>Koor Y</th>
                    <th>Keterangan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row) => {
                    const isEditing = editingRowId === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => handleRowClick(row.id)}
                        className={`cursor-pointer transition-colors ${
                          selectedMooringId === row.id ? "bg-emerald-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="font-mono text-xs">{row.code}</td>
                        <td className="font-semibold text-slate-700">
                          {isEditing ? (
                            <input
                              value={editingDraft?.name || ""}
                              onChange={(event) => updateDraft("name", event.target.value)}
                              className="w-full rounded border border-slate-300 px-1.5 py-1 text-xs"
                            />
                          ) : (
                            row.name
                          )}
                        </td>
                        <td className="font-mono text-xs text-slate-600">
                          {isEditing ? (
                            <div className="flex gap-1">
                              <input
                                value={editingDraft?.latitude || ""}
                                onChange={(event) => updateDraft("latitude", event.target.value)}
                                className="w-20 rounded border border-slate-300 px-1.5 py-1 text-xs"
                              />
                              <input
                                value={editingDraft?.longitude || ""}
                                onChange={(event) => updateDraft("longitude", event.target.value)}
                                className="w-20 rounded border border-slate-300 px-1.5 py-1 text-xs"
                              />
                            </div>
                          ) : (
                            `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}`
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              value={editingDraft?.status || ""}
                              onChange={(event) => updateDraft("status", event.target.value)}
                              className="w-24 rounded border border-slate-300 px-1.5 py-1 text-xs"
                            />
                          ) : (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {row.status}
                            </span>
                          )}
                        </td>
                        <td className="text-xs text-slate-600">
                          {isEditing ? (
                            <input
                              value={editingDraft?.koordX || ""}
                              onChange={(event) => updateDraft("koordX", event.target.value)}
                              className="w-32 rounded border border-slate-300 px-1.5 py-1 text-xs"
                            />
                          ) : (
                            row.koordX
                          )}
                        </td>
                        <td className="text-xs text-slate-600">
                          {isEditing ? (
                            <input
                              value={editingDraft?.koordY || ""}
                              onChange={(event) => updateDraft("koordY", event.target.value)}
                              className="w-32 rounded border border-slate-300 px-1.5 py-1 text-xs"
                            />
                          ) : (
                            row.koordY
                          )}
                        </td>
                        <td className="text-xs text-slate-600">
                          {isEditing ? (
                            <input
                              value={editingDraft?.keterangan || ""}
                              onChange={(event) => updateDraft("keterangan", event.target.value)}
                              className="w-40 rounded border border-slate-300 px-1.5 py-1 text-xs"
                            />
                          ) : (
                            row.keterangan
                          )}
                        </td>
                        <td>
                          <div className="flex gap-1" onClick={(event) => event.stopPropagation()}>
                            {isEditing ? (
                              <>
                                <Button className="h-7 px-2 text-xs btn-ocean" onClick={(event) => saveRowEdit(row.id, event)}>
                                  Simpan
                                </Button>
                                <Button className="h-7 px-2 text-xs" variant="outline" onClick={cancelRowEdit}>
                                  Batal
                                </Button>
                              </>
                            ) : (
                              <Button className="h-7 px-2 text-xs btn-yellow" onClick={(event) => startRowEdit(row, event)}>
                                Edit
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <span>
                Menampilkan {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, mooringRows.length)} dari {mooringRows.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </Button>
                <span>Halaman {currentPage} / {totalPages}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
