import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useState, useEffect, useMemo, useCallback } from "react";
import L from "leaflet";
import geoJsonUrl from "@/data/GeoJson.geojson?url";

// ─── Kawasan / Zonasi constants ───────────────────────────────────────────────

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

// ─── KawasanGeoJSONLayer ──────────────────────────────────────────────────────

function KawasanGeoJSONLayer({ geoData, kawasanVisibility, zonasiVisibility, onMapClick }) {
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
    layer.on("click", (e) => { if (onMapClick) onMapClick(e.latlng); });
  }, [onMapClick]);

  if (!filtered || filtered.features.length === 0) return null;
  return <GeoJSON key={layerKey} data={filtered} style={styleFeature} onEachFeature={onEachFeature} />;
}


const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ setLat, setLng, setPreviewMarker, isEditing }) {
  useMapEvents({
    click(e) {
      if (isEditing) return;

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setLat(lat);
      setLng(lng);

      setPreviewMarker({
        lat,
        lng
      });
    },
  });

  return null;
}



export default function RamsPage() {
    
    
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [markers, setMarkers] = useState([]);
    const [previewMarker, setPreviewMarker] = useState(null);
    const [name, setName] = useState("");
    // const [editingIndex, setEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // GeoJSON
    const [geoData, setGeoData] = useState(null);
    const [geoLoading, setGeoLoading] = useState(true);
    const [kawasanVisibility, setKawasanVisibility] = useState(
      Object.fromEntries(KAWASAN_LIST.map((k) => [k, true]))
    );
    const [zonasiVisibility, setZonasiVisibility] = useState(
      Object.fromEntries(ZONASI_LIST.map((z) => [z, true]))
    );

    useEffect(() => {
      fetch(geoJsonUrl)
        .then((r) => r.json())
        .then((data) => { setGeoData(data); setGeoLoading(false); })
        .catch((err) => { console.error("GeoJSON:", err); setGeoLoading(false); });
    }, []);


const addOrUpdateMarker = (e) => {
  e.preventDefault();

  if (!lat || !lng || !name) {
    alert("Lengkapi nama dan koordinat");
    return;
  }

  if (isEditing) {
    setMarkers((prevMarkers) =>
      prevMarkers.map((m) =>
        m.id === editingId 
          ? { ...m, name, lat: parseFloat(lat), lng: parseFloat(lng) }
          : m
      )
    );
    
    setIsEditing(false);
    setEditingId(null);
  } else {
    const newMarker = {
      id: Date.now(),
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
    setMarkers((prev) => [...prev, newMarker]);
  }

  setName("");
  setLat("");
  setLng("");
  setPreviewMarker(null);
};

const deleteMarker = (id) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus lokasi ini?")) {
    setMarkers(markers.filter((m) => m.id !== id));
    
    // Jika sedang mengedit data yang dihapus, batalkan mode edit
    if (isEditing && editingId === id) {
      setIsEditing(false);
      setEditingId(null);
      setName("");
      setLat("");
      setLng("");
    }
  }
};

const editMarker = (marker) => {
  setName(marker.name);
  setLat(marker.lat.toString()); 
  setLng(marker.lng.toString()); 
  setEditingId(marker.id); 
  setIsEditing(true);

  setPreviewMarker(null);
};

  return (
    <AdminLayout>
      <AdminHeader
        title="RAMS"
        subtitle="Content Management System"
        showSearch={false}
        showDateFilter={false}
      />
      <div className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground">Halaman Input RAMS</p>
         <div>

      <div className="relative" style={{ height: 500 }}>
      <MapContainer
        center={[-0.72, 130.42]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <KawasanGeoJSONLayer
          geoData={geoData}
          kawasanVisibility={kawasanVisibility}
          zonasiVisibility={zonasiVisibility}
          onMapClick={(latlng) => {
            if (!isEditing) {
              setLat(latlng.lat);
              setLng(latlng.lng);
              setPreviewMarker({ lat: latlng.lat, lng: latlng.lng });
            }
          }}
        />

       <MapClickHandler
        setLat={setLat}
        setLng={setLng}
        setPreviewMarker={setPreviewMarker}
        isEditing={isEditing}
        />

        {markers.map((marker, index) => (
        <Marker
    key={marker.id} 
    position={[marker.lat, marker.lng]}
    icon={markerIcon}
    eventHandlers={{
      dragend: (e) => {
        const { lat, lng } = e.target.getLatLng();
        setMarkers(prev => prev.map(m => m.id === marker.id ? { ...m, lat, lng } : m));
        
        if (isEditing && editingId === marker.id) {
          setLat(lat.toString());
          setLng(lng.toString());
        }
      },
      click: () => editMarker(marker) 
    }}
  >
    <Popup><b>{marker.name}</b></Popup>
  </Marker>
        ))}

        {previewMarker && (
        <Marker
            position={[previewMarker.lat, previewMarker.lng]}
            icon={markerIcon}
        >
            <Popup>Preview Lokasi</Popup>
        </Marker>
        )}

      </MapContainer>

      {geoLoading && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 rounded-full px-4 py-1.5 text-xs text-gray-500 flex items-center gap-1.5 shadow-md">
          <Loader2 className="w-3 h-3 animate-spin" /> Memuat kawasan…
        </div>
      )}
      </div>

      <br />

    <div className="grid grid-cols-1 gap-6">
          <Card className="xl:col-span-2 card-ocean">
            <CardHeader>
              <CardTitle className="text-lg">Input RAMS</CardTitle>
            </CardHeader>
            <CardContent>
      <form key={isEditing ? `edit-${editingId}` : "add"} onSubmit={addOrUpdateMarker}>

         <div className="space-y-2">
             <Label>Nama Lokasi</Label>
            <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: KMP Tuna Tomini"
            required
             />

        </div>

         <div className="space-y-2">
             <Label>Latitude</Label>
            <Input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Contoh: -6.207889445262002"
            required
             />

        </div>

         <div className="space-y-2">
             <Label>Longitude</Label>
            <Input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Contoh: 106.77466102883625"
            required
             />

        </div>

        <br />

        <Button 
        type="submit" 
        className={`gap-2 ${isEditing ? "btn-yellow" : "btn-ocean"}`} 
        >
        {isEditing ? "Update Pin" : "Tambah Pin"}
        </Button>

        &nbsp;
        {isEditing && (
        <Button 
        className="gap-2 btn-red"
        type="button"
        onClick={()=>{
        setIsEditing(false)
        setEditingId(null)
        setName("")
        setLat("")
        setLng("")
        setPreviewMarker(null)
        }}
        >
        Cancel
        </Button>
        )}


      </form>
            </CardContent>
            </Card>
            </div>

      <br />

      <Card className="card-ocean overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Daftar RAMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama Lokasi</th>
                    <th>Lat</th>
                    <th>Long</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {markers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td>{m.name}</td>
                    <td>{m.lat}</td>
                    <td>{m.lng}</td>
                    <td className="flex gap-2"> 
                    <Button 
                        className="btn-yellow" 
                        onClick={() => editMarker(m)}
                    >
                        Edit
                    </Button>
                    <Button 
                        className="btn-red" 
                        onClick={() => deleteMarker(m.id)}
                    >
                        Hapus
                    </Button>
                    </td>
                </tr>
                ))}
                </tbody>
                </table>
                </div>
                </CardContent>
                </Card>

      <br />

     
      
    </div>
      </div>
    </AdminLayout>
  );
}
