import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Layers, Loader2 } from "lucide-react";

import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  loadGeoJsonFromPublic,
  normalizeZoneName,
  pointFromFeature,
} from "@/lib/geojsonUtils";

const ZONE_STYLE = {
  Inti: { color: "#b8b8b8", fillColor: "#EA3323", fillOpacity: 0.82, weight: 0.6 },
  "Pemanfaatan Terbatas": { color: "#9ba39a", fillColor: "#AFFCA1", fillOpacity: 0.82, weight: 0.6 },
  Lainnya: { color: "#9d9d9d", fillColor: "#828282", fillOpacity: 0.8, weight: 0.6 },
};

const ZONE_ORDER = ["Inti", "Pemanfaatan Terbatas", "Lainnya"];

const diverIcon = L.divIcon({
  className: "",
  html: '<div style="width:13px;height:13px;border-radius:999px;background:#2563eb;border:2px solid #dbeafe;box-shadow:0 2px 8px rgba(37,99,235,.4)"></div>',
  iconSize: [13, 13],
  iconAnchor: [6, 6],
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

function LayersPanel({ layerVisibility, setLayerVisibility, zoneVisibility, setZoneVisibility }) {
  return (
    <div
      className="absolute left-4 bottom-16 z-[1000] w-64 rounded-xl border border-slate-200 bg-white shadow-xl"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2 rounded-t-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
        <Layers className="h-3.5 w-3.5" /> Legend & Layers
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
      </div>
    </div>
  );
}

export default function IsafePage() {
  const [zoneGeoJson, setZoneGeoJson] = useState(null);
  const [clusterGeoJson, setClusterGeoJson] = useState(null);
  const [diverGeoJson, setDiverGeoJson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [layersOpen, setLayersOpen] = useState(true);
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

  const diverRows = useMemo(() => {
    return (diverGeoJson?.features || [])
      .map((feature, index) => {
        const [lat, lng] = pointFromFeature(feature) || [null, null];
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          id: `diver-${index + 1}`,
          lat,
          lng,
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

  return (
    <AdminLayout>
      <AdminHeader
        title="SISPANDALWAS"
        subtitle="Monitoring Kawasan, Cluster, dan Diver"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <Card className="mb-5 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Peta SISPANDALWAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative" style={{ height: 620 }}>
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

                {layerVisibility.cluster && clusterGeoJson?.features?.length > 0 && (
                  <GeoJSON
                    key={`cluster-${clusterGeoJson.features.length}`}
                    data={clusterGeoJson}
                    style={() => ({ color: "#16a34a", fillColor: "#4ade80", fillOpacity: 0.12, weight: 1.2 })}
                    onEachFeature={onEachClusterFeature}
                  />
                )}

                {layerVisibility.divers &&
                  diverRows.map((row) => (
                    <Marker key={row.id} position={[row.lat, row.lng]} icon={diverIcon}>
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
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
