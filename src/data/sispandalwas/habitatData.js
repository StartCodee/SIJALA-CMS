// Habitat Monitoring Data
// Dummy data for Monitoring Pemanfaatan Habitat dashboard

export { KKP_OPTIONS, POS_OPTIONS, mapCenter, mapZoom } from './sispandalwasData';

// ─── Habitat Summary statistics ────────────────────────────────────
export const habitatSummary = {
    dataMasuk: 48,
    jumlahPelanggaran: 3,
};

// ─── Monitoring points on map ──────────────────────────────────────
export const habitatPoints = [
    { id: 'H001', lat: -0.44, lng: 130.60, type: 'wisatawan', label: 'Monitoring Wisatawan #1', zone: 'selat-dampier', pos: 'pos-dampier-1', date: '2025-01-04' },
    { id: 'H002', lat: -0.52, lng: 130.65, type: 'wisatawan', label: 'Monitoring Wisatawan #2', zone: 'selat-dampier', pos: 'pos-dampier-2', date: '2025-01-06' },
    { id: 'H003', lat: -1.86, lng: 130.22, type: 'guide', label: 'Monitoring Guide #1', zone: 'kepulauan-misool', pos: 'pos-misool-1', date: '2025-01-08' },
    { id: 'H004', lat: -0.34, lng: 130.80, type: 'manta', label: 'Temuan Manta #1', zone: 'teluk-mayalibit', pos: 'pos-mayalibit-1', date: '2025-01-09' },
    { id: 'H005', lat: 0.03, lng: 131.08, type: 'wisatawan', label: 'Monitoring Wisatawan #3', zone: 'kepulauan-ayau-asia', pos: 'pos-ayau-1', date: '2025-01-11' },
    { id: 'H006', lat: -0.48, lng: 130.62, type: 'manta', label: 'Temuan Manta #2', zone: 'selat-dampier', pos: 'pos-dampier-1', date: '2025-01-05' },
    { id: 'H007', lat: -1.90, lng: 130.28, type: 'guide', label: 'Monitoring Guide #2', zone: 'kepulauan-misool', pos: 'pos-misool-1', date: '2025-01-12' },
    { id: 'H008', lat: -0.30, lng: 130.82, type: 'wisatawan', label: 'Monitoring Wisatawan #4', zone: 'teluk-mayalibit', pos: 'pos-mayalibit-1', date: '2025-01-10' },
    { id: 'H009', lat: -0.58, lng: 130.56, type: 'manta', label: 'Temuan Manta #3', zone: 'selat-dampier', pos: 'pos-dampier-2', date: '2025-01-13' },
    { id: 'H010', lat: -0.72, lng: 130.44, type: 'guide', label: 'Monitoring Guide #3', zone: 'kepulauan-fam', pos: 'pos-fam-1', date: '2025-01-15' },
];

// ─── Jenis Pelanggaran ─────────────────────────────────────────────
export const jenisPelanggaran = [
    { label: { ID: 'Pelanggaran Zonasi', EN: 'Zoning Violation' }, count: 2, color: '#ef4444' },
    { label: { ID: 'Kerusakan Terumbu Karang', EN: 'Coral Reef Damage' }, count: 1, color: '#f59e0b' },
];

// ─── Dokumentasi / Validasi Data ───────────────────────────────────
export const dokumentasiItems = [
    {
        id: 'DOK001',
        src: '/images/pengelolaan-kawasan/Foto 01 oleh Nikka Gunadharma.webp',
        caption: { ID: 'Dokumentasi monitoring wisatawan Dampier', EN: 'Dampier tourist monitoring documentation' },
        date: '04 Jan 2025',
        status: { ID: 'Divalidasi', EN: 'Validated' },
    },
    {
        id: 'DOK002',
        src: '/images/pengelolaan-kawasan/Foto 03 oleh Nikka Gunadharma.webp',
        caption: { ID: 'Dokumentasi temuan manta Arborek', EN: 'Arborek manta sighting documentation' },
        date: '05 Jan 2025',
        status: { ID: 'Divalidasi', EN: 'Validated' },
    },
    {
        id: 'DOK003',
        src: '/images/pengelolaan-kawasan/Foto 05 oleh Nikka Gunadharma.webp',
        caption: { ID: 'Dokumentasi monitoring guide Misool', EN: 'Misool guide monitoring documentation' },
        date: '08 Jan 2025',
        status: { ID: 'Divalidasi', EN: 'Validated' },
    },
];

// ─── Chart data: Jumlah Wisatawan ──────────────────────────────────
export const wisatawanChartData = [
    { key: 'dampier', label: { ID: 'Selat Dampier', EN: 'Dampier Strait' }, value: 124, color: '#3b82f6' },
    { key: 'misool', label: { ID: 'Kep. Misool', EN: 'Misool Islands' }, value: 86, color: '#ef4444' },
    { key: 'mayalibit', label: { ID: 'Teluk Mayalibit', EN: 'Mayalibit Bay' }, value: 45, color: '#f59e0b' },
    { key: 'ayau', label: { ID: 'Kep. Ayau-Asia', EN: 'Ayau-Asia Islands' }, value: 32, color: '#84cc16' },
    { key: 'kofiau', label: { ID: 'Kep. Kofiau-Boo', EN: 'Kofiau-Boo Islands' }, value: 18, color: '#06b6d4' },
    { key: 'fam', label: { ID: 'Kep. Fam', EN: 'Fam Islands' }, value: 67, color: '#8b5cf6' },
    { key: 'misool-utara', label: { ID: 'Misool Utara', EN: 'North Misool' }, value: 29, color: '#ec4899' },
];

// ─── Chart data: Jumlah Guide ──────────────────────────────────────
export const guideChartData = [
    { key: 'dampier', label: { ID: 'Selat Dampier', EN: 'Dampier Strait' }, value: 18, color: '#3b82f6' },
    { key: 'misool', label: { ID: 'Kep. Misool', EN: 'Misool Islands' }, value: 12, color: '#ef4444' },
    { key: 'mayalibit', label: { ID: 'Teluk Mayalibit', EN: 'Mayalibit Bay' }, value: 6, color: '#f59e0b' },
    { key: 'ayau', label: { ID: 'Kep. Ayau-Asia', EN: 'Ayau-Asia Islands' }, value: 4, color: '#84cc16' },
    { key: 'kofiau', label: { ID: 'Kep. Kofiau-Boo', EN: 'Kofiau-Boo Islands' }, value: 3, color: '#06b6d4' },
    { key: 'fam', label: { ID: 'Kep. Fam', EN: 'Fam Islands' }, value: 9, color: '#8b5cf6' },
    { key: 'misool-utara', label: { ID: 'Misool Utara', EN: 'North Misool' }, value: 5, color: '#ec4899' },
];

// ─── Chart data: Jumlah Temuan Manta ───────────────────────────────
export const mantaChartData = [
    { key: 'dampier', label: { ID: 'Selat Dampier', EN: 'Dampier Strait' }, value: 8, color: '#3b82f6' },
    { key: 'misool', label: { ID: 'Kep. Misool', EN: 'Misool Islands' }, value: 5, color: '#ef4444' },
    { key: 'mayalibit', label: { ID: 'Teluk Mayalibit', EN: 'Mayalibit Bay' }, value: 2, color: '#f59e0b' },
    { key: 'fam', label: { ID: 'Kep. Fam', EN: 'Fam Islands' }, value: 3, color: '#8b5cf6' },
];

// ─── Chart titles ──────────────────────────────────────────────────
export const chartTitles = {
    wisatawan: { ID: 'Jumlah Wisatawan', EN: 'Number of Tourists' },
    guide: { ID: 'Jumlah Guide', EN: 'Number of Guides' },
    manta: { ID: 'Jumlah Temuan Manta', EN: 'Manta Sightings' },
};

// ─── Latest findings for summary card ──────────────────────────────
export const latestHabitatFindings = [
    { label: { ID: 'Wisatawan - Dampier', EN: 'Tourist - Dampier' }, location: { ID: 'Perairan Selat Dampier', EN: 'Dampier Strait Waters' }, date: '04 Jan 2025' },
    { label: { ID: 'Manta - Arborek', EN: 'Manta - Arborek' }, location: { ID: 'Perairan Arborek', EN: 'Arborek Waters' }, date: '05 Jan 2025' },
    { label: { ID: 'Guide - Misool', EN: 'Guide - Misool' }, location: { ID: 'Perairan Kep. Misool', EN: 'Misool Islands Waters' }, date: '08 Jan 2025' },
    { label: { ID: 'Manta - Dampier', EN: 'Manta - Dampier' }, location: { ID: 'Perairan Selat Dampier', EN: 'Dampier Strait Waters' }, date: '13 Jan 2025' },
    { label: { ID: 'Wisatawan - Fam', EN: 'Tourist - Fam' }, location: { ID: 'Perairan Kep. Fam', EN: 'Fam Islands Waters' }, date: '15 Jan 2025' },
    { label: { ID: 'Wisatawan - Mayalibit', EN: 'Tourist - Mayalibit' }, location: { ID: 'Perairan Teluk Mayalibit', EN: 'Mayalibit Bay Waters' }, date: '10 Jan 2025' },
];
