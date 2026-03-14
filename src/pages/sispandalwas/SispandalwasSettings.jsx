import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings2,
  Map,
  ShieldCheck,
  User,
  Save,
  RotateCcw,
  Camera,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "umum",     label: "Umum",     icon: Settings2 },
  { id: "peta",     label: "Peta",     icon: Map       },
  { id: "keamanan", label: "Keamanan", icon: ShieldCheck },
  { id: "profile",  label: "Profile",  icon: User       },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
        checked ? "bg-gray-900" : "bg-gray-300"
      )}
    >
      <span className={cn(
        "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-6" : "translate-x-1"
      )} />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Umum Tab ────────────────────────────────────────────────────────────────
function TabUmum() {
  const [company, setCompany] = useState("I-SAFE - Loka Spasial Nusantara");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [language, setLanguage] = useState("id");
  const [theme, setTheme] = useState("light");
  const [autoSave, setAutoSave] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  function handleReset() {
    setCompany("I-SAFE - Loka Spasial Nusantara");
    setTimezone("Asia/Jakarta");
    setLanguage("id");
    setTheme("light");
    setAutoSave(true);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-slate-600" />
          <CardTitle className="text-base">Pengaturan Umum</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <Label>Nama Perusahaan</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Zona Waktu</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Bahasa</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SettingRow label="Auto Save" description="Otomatis menyimpan perubahan">
          <Toggle checked={autoSave} onChange={setAutoSave} />
        </SettingRow>
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="w-4 h-4" /> {saved ? "Tersimpan!" : "Simpan"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Peta Tab ─────────────────────────────────────────────────────────────────
function TabPeta() {
  const [zoom, setZoom] = useState("11");
  const [mapStyle, setMapStyle] = useState("osm");
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [showTraffic, setShowTraffic] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [clustering, setClustering] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  function handleReset() {
    setZoom("11"); setMapStyle("osm"); setRefreshInterval("5");
    setShowTraffic(false); setShowWeather(true); setClustering(true);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-slate-600" />
          <CardTitle className="text-base">Pengaturan Peta</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <Label>Default Zoom Level</Label>
            <Input type="number" min="1" max="20" value={zoom} onChange={(e) => setZoom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Map Style</Label>
            <Select value={mapStyle} onValueChange={setMapStyle}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="osm">OpenStreetMap</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Refresh Interval (detik)</Label>
            <Input type="number" min="1" value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} />
          </div>
        </div>
        <SettingRow label="Show Traffic" description="Tampilkan informasi lalu lintas">
          <Toggle checked={showTraffic} onChange={setShowTraffic} />
        </SettingRow>
        <SettingRow label="Show Weather" description="Tampilkan informasi cuaca">
          <Toggle checked={showWeather} onChange={setShowWeather} />
        </SettingRow>
        <SettingRow label="Marker Clustering" description="Kelompokkan marker yang berdekatan">
          <Toggle checked={clustering} onChange={setClustering} />
        </SettingRow>
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="w-4 h-4" /> {saved ? "Tersimpan!" : "Simpan"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Keamanan Tab ──────────────────────────────────────────────────────────────
function TabKeamanan() {
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [maxAttempts, setMaxAttempts] = useState("3");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [requirePwChange, setRequirePwChange] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  function handleReset() {
    setSessionTimeout("60"); setMaxAttempts("3"); setIpWhitelist("");
    setRequirePwChange(false); setTwoFactor(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <CardTitle className="text-base">Pengaturan Keamanan</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <Label>Session Timeout (menit)</Label>
            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["15","30","60","120","240"].map((v) => (
                  <SelectItem key={v} value={v}>{v} menit</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Max Login Attempts</Label>
            <Select value={maxAttempts} onValueChange={setMaxAttempts}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["3","5","10"].map((v) => (
                  <SelectItem key={v} value={v}>{v} kali</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>IP Whitelist (comma separated)</Label>
            <Input
              placeholder="192.168.1.1, 10.0.0.1"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
            />
          </div>
        </div>
        <SettingRow label="Require Password Change" description="Wajib ganti password berkala">
          <Toggle checked={requirePwChange} onChange={setRequirePwChange} />
        </SettingRow>
        <SettingRow label="Two-Factor Authentication" description="Aktifkan autentikasi 2 faktor">
          <Toggle checked={twoFactor} onChange={setTwoFactor} />
        </SettingRow>
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="w-4 h-4" /> {saved ? "Tersimpan!" : "Simpan"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Profile Tab ───────────────────────────────────────────────────────────────
function TabProfile() {
  const [name, setName] = useState("Rudi Hartono");
  const [email, setEmail] = useState("rudi.hartono@lokaspasial.id");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            <CardTitle className="text-base">Informasi Profil</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100 mb-5">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              RH
            </div>
            <div>
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-sm text-gray-400">Admin Utama</p>
              <Button size="sm" variant="outline" className="mt-2 h-7 gap-1.5 text-xs">
                <Camera className="w-3 h-3" /> Ganti Foto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nama Lengkap</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telepon</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <Button onClick={handleSave} className="gap-1.5">
              <Save className="w-4 h-4" /> {saved ? "Tersimpan!" : "Simpan Profil"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <CardTitle className="text-base">Ubah Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Password Saat Ini</Label>
              <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label>Password Baru</Label>
              <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label>Konfirmasi Password</Label>
              <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="gap-1.5"
              disabled={!currentPw || !newPw || newPw !== confirmPw}
            >
              <Lock className="w-4 h-4" /> Ubah Password
            </Button>
            {newPw && confirmPw && newPw !== confirmPw && (
              <p className="text-xs text-red-500 mt-1">Password baru tidak cocok.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Settings Page ────────────────────────────────────────────────────────
export default function SispandalwasSettings() {
  const [activeTab, setActiveTab] = useState("umum");

  return (
    <AdminLayout>
      <AdminHeader
        title="Settings"
        subtitle="Kelola pengaturan sistem dan preferensi"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Tabs */}
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "umum"     && <TabUmum />}
        {activeTab === "peta"     && <TabPeta />}
        {activeTab === "keamanan" && <TabKeamanan />}
        {activeTab === "profile"  && <TabProfile />}
      </div>
    </AdminLayout>
  );
}
