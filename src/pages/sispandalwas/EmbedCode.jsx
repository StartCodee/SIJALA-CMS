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
import { Code2, Copy, ExternalLink, Check, Globe, Smartphone } from "lucide-react";

const TAB_OPTIONS = [
  { value: "map", label: "Map" },
  { value: "radar", label: "Radar" },
  { value: "statistics", label: "Statistics" },
];

export default function EmbedCode() {
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("520px");
  const [defaultTab, setDefaultTab] = useState("map");
  const [copied, setCopied] = useState(false);

  // Always points to THIS app's own embed view page
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const embedUrl = `${baseUrl}/embed?tab=${defaultTab}`;

  const htmlCode = `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allowfullscreen
  style="border-radius: 8px;"
></iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenFullscreen() {
    window.open(embedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Embed Code"
        subtitle="Uji dan konfigurasikan iframe platform untuk integrasi website"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Header action */}
        <div className="flex justify-end">
          <Button variant="outline" className="gap-1.5" onClick={handleOpenFullscreen}>
            <ExternalLink className="w-4 h-4" /> Open Fullscreen
          </Button>
        </div>

        {/* Live Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Live Preview</CardTitle>
              <p className="text-xs text-gray-400">Menampilkan Peta SISPANDALWAS milik aplikasi ini</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden rounded-b-2xl">
            <iframe
              src={`/embed?tab=${defaultTab}`}
              width="100%"
              height="460"
              frameBorder="0"
              allowFullScreen
              title="Peta SISPANDALWAS Preview"
              className="block"
              style={{ minHeight: 420, maxHeight: 460 }}
            />
          </CardContent>
        </Card>

        {/* Embed Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-600" />
              <CardTitle className="text-base">Embed Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Width</Label>
                <Input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="100%" />
              </div>
              <div className="space-y-1.5">
                <Label>Height</Label>
                <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="600px" />
              </div>
              <div className="space-y-1.5">
                <Label>Default Tab</Label>
                <Select value={defaultTab} onValueChange={setDefaultTab}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TAB_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Embed URL</Label>
                <Input value={embedUrl} readOnly className="font-mono text-xs bg-gray-50" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>HTML Code</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 gap-1 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? <><Check className="w-3 h-3 text-green-600" /> Disalin!</> : <><Copy className="w-3 h-3" /> Salin</>}
                  </Button>
                </div>
                <pre className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap">
{htmlCode}
                </pre>
              </div>
            </div>

            {/* Features */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
              <ul className="space-y-1">
                {[
                  "Peta SISPANDALWAS interaktif (Leaflet)",
                  "Responsive design",
                  "KPI flash cards (Online / Offline / Maintenance)",
                  "Filter tracker berdasarkan status & pesan",
                  "Panel list tracker real-time",
                  "Layer kontrol: Zona, Cluster, Diver Points",
                  "Auto-refresh data tracker",
                ].map((f) => (
                  <li key={f} className="text-sm text-blue-600 flex items-center gap-1">
                    <span className="text-gray-400">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Website Integration
                </p>
                <pre className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre">
{`<!-- Tambahkan ke website Anda -->
<div class="sispandalwas-embed">
  <iframe
    src="${embedUrl}"
    width="100%"
    height="600"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>`}
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Mobile Responsive
                </p>
                <pre className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5 text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre">
{`<!-- Mobile optimized -->
<div style="position: relative;
        padding-bottom: 56.25%;
        height: 0;">
  <iframe
    src="${embedUrl}"
    style="position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
