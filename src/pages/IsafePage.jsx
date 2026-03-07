import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dayjs from 'dayjs';
import {
  Search,
  Download,
  FileText,
  Printer,
  Plus,
  Check,
  ChevronsUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const boatIcon = new L.Icon({
  iconUrl: "/boat.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

const colors = ["red", "blue", "green", "orange", "purple"];

export default function IsafePage() {

  const [boats, setBoats] = useState([]);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [status, setStatus] = useState("");
  const [device, setDevice] = useState("");
  const [baterry, setBattery] = useState("");

  const [editingId, setEditingId] = useState(null);

  const formattedDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

  useEffect(() => {

  const interval = setInterval(() => {

    setBoats(prevBoats =>
  prevBoats.map(boat => {

    const newLat = parseFloat(
      (boat.lat + (Math.random() - 0.5) * 0.001).toFixed(6)
    );

    const newLng = parseFloat(
      (boat.lng + (Math.random() - 0.5) * 0.001).toFixed(6)
    );

    if (boat.id === editingId) {
      setLat(newLat.toString());
      setLng(newLng.toString());
    }

    return {
      ...boat,
      lat: newLat,
      lng: newLng,
      trail: [...boat.trail.slice(-100), [newLat, newLng]]
    };

  })
);

  }, 2000);

  return () => clearInterval(interval);

}, [editingId]);

  const saveBoat = (e) => {

    e.preventDefault();

    if (!name || !lat || !lng || !status || !device || !baterry) {
      alert("Lengkapi data kapal");
      return;
    }

    if (editingId) {

      const updated = boats.map((b) =>
        b.id === editingId
          ? { ...b, name, lat: parseFloat(lat), lng: parseFloat(lng), status, device, baterry }
          : b
      );

      setBoats(updated);
      setEditingId(null);

    } else {

      const newBoat = {
        id: Date.now(),
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        status,
        device,
        baterry,
        trail: [[parseFloat(lat), parseFloat(lng)]],
        color: colors[boats.length % colors.length],
      };

      setBoats([...boats, newBoat]);
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setLat("");
    setLng("");
    setStatus("");
    setDevice("");
    setBattery("");
  };

  const editBoat = (boat) => {

    setName(boat.name);
    setLat(boat.lat);
    setLng(boat.lng);
    setEditingId(boat.id);
    setStatus(boat.status);
    setDevice(boat.device);
    setBattery(boat.baterry);
  };

  const deleteBoat = (id) => {

    const updated = boats.filter((b) => b.id !== id);
    setBoats(updated);

  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Boat Tracker CMS</h2>

      <MapContainer
        center={[-6.2, 106.8]}
        zoom={11}
        style={{ height: 500 }}
      >

        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {boats.map((boat) => (

          <React.Fragment key={boat.id}>
            <Marker
              key={boat.id + "-" + boat.lat + "-" + boat.lng}
              position={[boat.lat, boat.lng]}
              icon={boatIcon}
            >
              <Popup>
                <b>{boat.name}</b>
                <br />
                ({boat.lat.toFixed(6)}, {boat.lng.toFixed(6)})
              </Popup>
            </Marker>

            <Polyline
              key={"line-"+boat.id}
              positions={boat.trail}
              pathOptions={{ color: boat.color }}
            />
         </React.Fragment>

        ))}

      </MapContainer>

      <br />

      <form onSubmit={saveBoat}>

        <div>
          <label>Nama Tracker</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Latitude</label>
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>

        <div>
          <label>Longitude</label>
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>

         <div>
          <label>Status</label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <div>
          <label>Device</label>
          <input
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          />
        </div>

        <div>
          <label>Baterai</label>
          <input
            value={baterry}
            onChange={(e) => setBattery(e.target.value)}
          />
        </div>

        <button type="submit">
          {editingId ? "Update Tracker" : "Tambah Tracker"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              resetForm();
            }}
          >
            Cancel
          </button>
        )}

      </form>

      <br />

       <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:w-[520px]">
          
          </div>
          <Button
            className="btn-ocean gap-2 w-full sm:w-auto lg:h-10 lg:shrink-0"
            // onClick={openAddModal}
          >
            <Plus className="w-4 h-4" />
            Tambah Tracker
          </Button>
        </div>

      <Card className="card-ocean overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Daftar Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Tracker ID</th>
                          <th>Nama Tracker</th>
                          <th>Posisi Terakhir</th>
                          <th>Status</th>
                          <th>Message Device</th>
                          <th>Baterai</th>
                          <th>Update Terakhir</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                      {boats.map((boat) => (
                      <tr key={boat.id} className="hover:bg-slate-50 transition-colors">
                          <td>{boat.id}</td>
                          <td>{boat.name}</td>
                          <td>{boat.lat.toFixed(6)}, {boat.lng.toFixed(6)}</td>
                          <td><span className="bg-status-pending-bg text-status-pending">{boat.status}</span></td>
                          <td><span className="bg-status-rejected-bg text-status-rejected">{boat.device}</span></td>
                          <td><span className="bg-status-approved-bg text-status-approved">{boat.baterry}</span></td>
                          <td><span className="font-medium">{formattedDate}</span></td>
                          <td className="flex gap-2"> 
                          <Button 
                              className="btn-yellow" 
                              onClick={() => editBoat(boat)}
                          >
                              Edit
                          </Button>
                          <Button 
                              className="btn-red" 
                              onClick={() => deleteBoat(boat.id)}
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
  );
}