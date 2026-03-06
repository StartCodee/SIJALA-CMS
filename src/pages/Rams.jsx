import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import L from "leaflet";


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

      <MapContainer
        center={[-6.2, 106.816666]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
