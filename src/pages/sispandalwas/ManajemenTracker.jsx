import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Battery,
  MessageSquare,
} from "lucide-react";
import {
  TRACKER_LIST,
  getKpiStats,
  getBatteryStats,
  getMessageStats,
} from "@/data/sispandalwas/trackerData";
import { cn } from "@/lib/utils";

const STATUS_BADGE = {
  Online:      "bg-green-50 border-green-200 text-green-700",
  Offline:     "bg-red-50   border-red-200   text-red-700",
  Maintenance: "bg-amber-50 border-amber-200 text-amber-700",
};
const STATUS_DOT = {
  Online:      "bg-green-500",
  Offline:     "bg-red-500",
  Maintenance: "bg-amber-500",
};
const MSG_BADGE = {
  POSITION:          "bg-blue-50   border-blue-200   text-blue-700",
  TRACKING:          "bg-green-50  border-green-200  text-green-700",
  "UNLIMITED-TRACK": "bg-purple-50 border-purple-200 text-purple-700",
  STOP:              "bg-red-50    border-red-200    text-red-700",
  NEWMOVEMENT:       "bg-amber-50  border-amber-200  text-amber-700",
  "POWER-OFF":       "bg-slate-50  border-slate-200  text-slate-700",
};
const BAT_BADGE = {
  HIGH:     "bg-green-50 border-green-200 text-green-700",
  GOOD:     "bg-green-50 border-green-200 text-green-700",
  LOW:      "bg-amber-50 border-amber-200 text-amber-700",
  CRITICAL: "bg-red-50   border-red-200   text-red-700",
};
const BAT_COLOR = { HIGH: "bg-green-500", GOOD: "bg-green-500", LOW: "bg-amber-500", CRITICAL: "bg-red-500" };
const MSG_COLOR = {
  POSITION: "bg-blue-500", TRACKING: "bg-green-500", "UNLIMITED-TRACK": "bg-purple-500",
  STOP: "bg-red-500", NEWMOVEMENT: "bg-amber-500", "POWER-OFF": "bg-slate-400",
};

const EMPTY_FORM = {
  id: "", name: "", lat: "", lng: "", status: "Online",
  message: "POSITION", battery: "GOOD", type: "Spot Trace",
};

export default function ManajemenTracker() {
  const [trackers, setTrackers] = useState(TRACKER_LIST);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const kpi = getKpiStats(trackers);
  const batteryStats = getBatteryStats(trackers);
  const messageStats = getMessageStats(trackers);

  const kpiCards = [
    { label: "Devices Online",  value: kpi.online,      sub: "Total Tracker", icon: Wifi,    bg: "bg-green-50 border-green-100", iconColor: "text-green-500",  valueColor: "text-green-600" },
    { label: "Devices Offline", value: kpi.offline,     sub: "Total Tracker", icon: WifiOff, bg: "bg-red-50   border-red-100",   iconColor: "text-red-500",    valueColor: "text-red-600"   },
    { label: "Maintenance",     value: kpi.maintenance, sub: "Total Tracker", icon: Wrench,  bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-500",  valueColor: "text-amber-600" },
    { label: "Total Devices",   value: kpi.total,       sub: "Spot Trace",    icon: Radio,   bg: "bg-blue-50  border-blue-100",  iconColor: "text-blue-500",   valueColor: "text-blue-600"  },
  ];

  function handleOpenAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function handleOpenEdit(tracker) {
    setEditTarget(tracker.id);
    setForm({
      id: tracker.id,
      name: tracker.name,
      lat: String(tracker.lat),
      lng: String(tracker.lng),
      status: tracker.status,
      message: tracker.message,
      battery: tracker.battery,
      type: tracker.type,
    });
    setShowForm(true);
  }

  function handleSave() {
    const now = new Date().toLocaleString("id-ID", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).replace(",", "");

    if (editTarget) {
      setTrackers((prev) =>
        prev.map((t) =>
          t.id === editTarget
            ? { ...t, ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng), lastUpdate: now }
            : t
        )
      );
    } else {
      const newTracker = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        lastUpdate: now,
        locationDuration: "0 jam di lokasi",
      };
      setTrackers((prev) => [...prev, newTracker]);
    }
    setShowForm(false);
  }

  function handleDelete(id) {
    setTrackers((prev) => prev.filter((t) => t.id !== id));
    setDeleteTarget(null);
  }

  const fieldChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const selectChange = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <AdminLayout>
      <AdminHeader
        title="Manajemen Perangkat Tracker"
        subtitle="Kelola dan pantau semua perangkat tracker yang terdaftar"
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

        {/* Tracker Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-slate-600" />
                  <CardTitle className="text-base">Tracker Devices</CardTitle>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Real-time status dari {trackers.length} tracker devices yang terdaftar
                </p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={handleOpenAdd}>
                <Plus className="w-4 h-4" /> Tambah Tracker
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Tracker ID", "Nama Tracker", "Posisi Terakhir", "Status", "Message Device", "Baterai", "Update Terakhir", ""].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trackers.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-gray-800 flex items-center gap-1">
                          <Radio className="w-3 h-3 text-gray-400" /> {t.id}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">{t.name}</td>
                      <td className="py-3 px-3 text-blue-600 font-mono text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {t.lat}, {t.lng}
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold", STATUS_BADGE[t.status])}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[t.status])} />
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold", MSG_BADGE[t.message])}>
                          <MessageSquare className="w-3 h-3" /> {t.message}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold", BAT_BADGE[t.battery])}>
                          <Battery className="w-3 h-3" /> {t.battery}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-500">{t.lastUpdate}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenEdit(t)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteTarget(t.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Battery & Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Battery className="w-4 h-4" /> Battery Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {batteryStats.map(({ level, count, pct }) => (
                <div key={level} className="flex items-center gap-3">
                  <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold w-24 justify-center", BAT_BADGE[level])}>
                    <Battery className="w-3 h-3" /> {level}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={cn("h-1.5 rounded-full", BAT_COLOR[level])} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-32 text-right">{count} devices ({pct}%)</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Message Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {messageStats.map(({ type, count, pct }) => (
                <div key={type} className="flex items-center gap-3">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold w-36 justify-center", MSG_BADGE[type])}>
                    <MessageSquare className="w-3 h-3" /> {type}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={cn("h-1.5 rounded-full", MSG_COLOR[type])} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-32 text-right">{count} devices ({pct}%)</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Tracker" : "Tambah Tracker Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Tracker ID</Label>
              <Input placeholder="0-5069592" value={form.id} onChange={fieldChange("id")} disabled={!!editTarget} />
            </div>
            <div className="space-y-1.5">
              <Label>Nama Tracker</Label>
              <Input placeholder="Barakuda04" value={form.name} onChange={fieldChange("name")} />
            </div>
            <div className="space-y-1.5">
              <Label>Latitude</Label>
              <Input placeholder="-8.7016" value={form.lat} onChange={fieldChange("lat")} />
            </div>
            <div className="space-y-1.5">
              <Label>Longitude</Label>
              <Input placeholder="118.0148" value={form.lng} onChange={fieldChange("lng")} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={selectChange("status")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Online", "Offline", "Maintenance"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Message Device</Label>
              <Select value={form.message} onValueChange={selectChange("message")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["POSITION","TRACKING","UNLIMITED-TRACK","STOP","NEWMOVEMENT","POWER-OFF"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Baterai</Label>
              <Select value={form.battery} onValueChange={selectChange("battery")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["HIGH","GOOD","LOW","CRITICAL"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipe Perangkat</Label>
              <Select value={form.type} onValueChange={selectChange("type")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Spot Trace","AIS","VMS"].map((tp) => (
                    <SelectItem key={tp} value={tp}>{tp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
            <Button onClick={handleSave}>{editTarget ? "Simpan Perubahan" : "Tambah Tracker"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Tracker</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus tracker <b>{deleteTarget}</b>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteTarget)}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
