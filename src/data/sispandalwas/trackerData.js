// Mock tracker data for SISPANDALWAS — replace with real API calls

export const TRACKER_LIST = [
  {
    id: "0-5069592",
    name: "Barakuda04",
    lat: -8.7016,
    lng: 118.0148,
    status: "Maintenance",   // Online | Offline | Maintenance
    message: "STOP",         // POSITION | TRACKING | UNLIMITED-TRACK | STOP | NEWMOVEMENT | POWER-OFF
    battery: "GOOD",         // HIGH | GOOD | LOW | CRITICAL
    lastUpdate: "01/12/2025, 08:35",
    type: "Spot Trace",
    locationDuration: "2642 jam 52 menit di lokasi",
  },
];

export const SYSTEM_INFO = {
  dataSource: "Database Spot Trace - Loka Spasial Nusantara",
  lastSync: "14/03/2026, 11.28",
  dbConnected: true,
  autoRefreshInterval: 5, // minutes
};

export function getKpiStats(trackers = TRACKER_LIST) {
  const online = trackers.filter((t) => t.status === "Online").length;
  const offline = trackers.filter((t) => t.status === "Offline").length;
  const maintenance = trackers.filter((t) => t.status === "Maintenance").length;
  const spotTrace = trackers.filter((t) => t.type === "Spot Trace").length;
  return { online, offline, maintenance, total: trackers.length, spotTrace };
}

export function getBatteryStats(trackers = TRACKER_LIST) {
  const total = trackers.length || 1;
  const levels = ["HIGH", "GOOD", "LOW", "CRITICAL"];
  const counts = Object.fromEntries(levels.map((l) => [l, 0]));
  trackers.forEach((t) => { if (t.battery in counts) counts[t.battery]++; });
  return levels.map((level) => ({
    level,
    count: counts[level],
    pct: ((counts[level] / total) * 100).toFixed(1),
  }));
}

export function getMessageStats(trackers = TRACKER_LIST) {
  const total = trackers.length || 1;
  const types = ["POSITION", "TRACKING", "UNLIMITED-TRACK", "STOP", "NEWMOVEMENT", "POWER-OFF"];
  const counts = Object.fromEntries(types.map((t) => [t, 0]));
  trackers.forEach((t) => { if (t.message in counts) counts[t.message]++; });
  return types.map((type) => ({
    type,
    count: counts[type],
    pct: ((counts[type] / total) * 100).toFixed(1),
  }));
}
