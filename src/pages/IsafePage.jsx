import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import React, { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dayjs from 'dayjs';
import {
  Plus,
  Wifi, 
  WifiOff, 
  Wrench, 
  Radio
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const boatIcon = new L.Icon({
  iconUrl: "/boat.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

  const STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    MAINTENANCE: "maintenance"
  };  


const colors = ["red", "blue", "green", "orange", "purple"];

export default function IsafePage() {
  const [boats, setBoats] = useState([]);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [status, setStatus] = useState("");
  const [device, setDevice] = useState("");
  const [battery, setBattery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const formattedDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

  useEffect(() => {
    if (editingId) {
      const currentBoat = boats.find(b => b.id === editingId);
      if (currentBoat) {
        setLat(currentBoat.lat.toString());
        setLng(currentBoat.lng.toString());
      }
    }
  }, [boats, editingId]);
  
 useEffect(() => {
    const interval = setInterval(() => {
      setBoats(prevBoats =>
        prevBoats.map(boat => {
          const newLat = parseFloat((boat.lat + (Math.random() - 0.5) * 0.001).toFixed(6));
          const newLng = parseFloat((boat.lng + (Math.random() - 0.5) * 0.001).toFixed(6));
          
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
  }, []);

  const saveBoat = (e) => {

    e.preventDefault();

    if (!name || !lat || !lng || !status || !device || !battery) {
      alert("Lengkapi data tracker");
      return;
    }

    if (editingId) {

      setBoats(prev =>
        prev.map(b =>
          b.id === editingId
            ? { ...b, name, lat: parseFloat(lat), lng: parseFloat(lng), status, device, battery }
            : b
        )
      );
      setEditingId(null);

    } else {

      const newBoat = {
        id: Date.now(),
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        status,
        device,
        battery,
        trail: [[parseFloat(lat), parseFloat(lng)]],
        color: colors[boats.length % colors.length],
      };

      setBoats(prev => [...prev, newBoat]);
    }

    resetForm();
    setShowForm(false);
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
  setStatus(boat.status);
  setDevice(boat.device);
  setBattery(boat.battery);

  setEditingId(boat.id);
  setShowForm(true);
};

  const deleteBoat = (id) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus tracker ini?")) {

    setBoats(prev => prev.filter(b => b.id !== id));
  }
  };

  const stats = useMemo(() => {
      return {
        online: boats.filter(b => b.status === STATUS.ONLINE).length,
        offline: boats.filter(b => b.status === STATUS.OFFLINE).length,
        maintenance: boats.filter(b => b.status === STATUS.MAINTENANCE).length,
        total: boats.length
      };
    }, [boats]);


  return (
    <AdminLayout>
      <AdminHeader
       title="Isafe Page"
        subtitle="Content Management System"
        showSearch={false}
        showDateFilter={false}
      />
      <div className="flex-1 overflow-y-auto p-6">
      <h2>Boat Tracker CMS</h2>
<br />
  <div key={boats.length} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

  <Card className="p-5 bg-green-50 border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-600">Devices Online</p>
        <p className="text-3xl font-bold text-green-600">{stats.online}</p>
        <p className="text-sm text-gray-500">Total Tracker</p>
      </div>
      <Wifi className="text-green-500" />
    </div>
  </Card>

  <Card className="p-5 bg-red-50 border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-600">Devices Offline</p>
        <p className="text-3xl font-bold text-red-600">{stats.offline}</p>
        <p className="text-sm text-gray-500">Total Tracker</p>
      </div>
      <WifiOff className="text-red-500" />
    </div>
  </Card>

  <Card className="p-5 bg-yellow-50 border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-600">Maintenance</p>
        <p className="text-3xl font-bold text-yellow-600">{stats.maintenance}</p>
        <p className="text-sm text-gray-500">Total Tracker</p>
      </div>
      <Wrench className="text-yellow-500" />
    </div>
  </Card>

  <Card className="p-5 bg-blue-50 border">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-600">Total Devices</p>
        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        <p className="text-sm text-gray-500">Spot Tracker</p>
      </div>
      <Radio className="text-blue-500" />
    </div>
  </Card>

</div>

      <MapContainer
        center={[-6.2, 106.816666]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
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

     {showForm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">

    <Card className="w-[420px] relative z-[10000]">

      <CardHeader>
        <CardTitle>
          {editingId ? "Edit Tracker" : "Tambah Tracker"}
        </CardTitle>
      </CardHeader>

      <CardContent>

        <form onSubmit={saveBoat} className="space-y-3">

          <div>
            <Label>Nama Tracker</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Latitude</Label>
            <Input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>

          <div>
            <Label>Longitude</Label>
            <Input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>

          <div>
              <Label>Status Device</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >

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

          <div>
            <Label>Device</Label>
            <Input
              value={device}
              onChange={(e) => setDevice(e.target.value)}
            />
          </div>

          <div>
            <Label>Baterai</Label>
            <Input
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">

            <Button type="submit" className="btn-ocean flex-1">
              {editingId ? "Update" : "Tambah"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}
            >
              Cancel
            </Button>

          </div>

        </form>

      </CardContent>

    </Card>

  </div>
)}

      <br />

       <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:w-[520px]">
          
          </div>
          <Button
            className="btn-ocean gap-2 w-full sm:w-auto lg:h-10 lg:shrink-0"
            onClick={() => setShowForm(true)}
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
                          <td><span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border border-yellow-100 bg-yellow-50 text-yellow-700">{boat.status}</span></td>
                          <td><span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border border-red-100 bg-red-50 text-red-700">{boat.device}</span></td>
                          <td><span className="px-2 py-0.5 rounded text-[9px] font-black uppercase border border-green-100 bg-green-50 text-green-700">{boat.battery}</span></td>
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
        </AdminLayout>
    
  );
}