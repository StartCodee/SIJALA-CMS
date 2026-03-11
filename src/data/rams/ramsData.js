// RAMS Data - Dummy data for Raja Ampat Mooring System
// Structure ready for API fetching replacement

export const RAMS_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    MAINTENANCE: 'maintenance',
};

export const RAMS_STATUS_CONFIG = {
    [RAMS_STATUS.AVAILABLE]: {
        label: { ID: 'Tersedia', EN: 'Available' },
        color: '#22c55e',
    },
    [RAMS_STATUS.OCCUPIED]: {
        label: { ID: 'Terpakai', EN: 'Occupied' },
        color: '#ef4444',
    },
    [RAMS_STATUS.MAINTENANCE]: {
        label: { ID: 'Pemeliharaan', EN: 'Maintenance' },
        color: '#eab308',
    },
};

export const ramsStats = {
    totalUnits: 87,
    zonesCovered: 4,
    yearStarted: 2013,
    mainAreas: [
        { ID: 'Selat Dampier', EN: 'Dampier Strait' },
        { ID: 'Kepulauan Misool', EN: 'Misool Islands' },
        { ID: 'Wayag', EN: 'Wayag' },
        { ID: 'Teluk Mayalibit', EN: 'Mayalibit Bay' },
    ],
};

// Unique color per area (used for map polygons, stats card, charts)
export const AREA_COLORS = {
    'Dampier Strait': '#3b82f6',
    'Misool': '#22c55e',
    'Wayag': '#f59e0b',
    'Teluk Mayalibit': '#a855f7',
};

// Area configuration for zoom-to-area feature
// Keys match the `zone` field in ramsPoints
export const AREA_CONFIG = {
    'Dampier Strait': {
        center: [-0.54, 130.66],
        zoom: 12,
        color: '#3b82f6',
        label: { ID: 'Selat Dampier', EN: 'Dampier Strait' },
        // GeoJSON polygon (lng, lat) defining the area boundary
        polygon: [
            [130.58, -0.49],
            [130.60, -0.50],
            [130.62, -0.50],
            [130.65, -0.51],
            [130.68, -0.51],
            [130.71, -0.50],
            [130.73, -0.51],
            [130.74, -0.53],
            [130.73, -0.56],
            [130.72, -0.58],
            [130.70, -0.59],
            [130.68, -0.59],
            [130.66, -0.58],
            [130.64, -0.58],
            [130.62, -0.59],
            [130.60, -0.58],
            [130.59, -0.56],
            [130.58, -0.54],
            [130.57, -0.52],
            [130.58, -0.49],
        ],
    },
    'Misool': {
        center: [-1.88, 130.24],
        zoom: 12,
        color: '#22c55e',
        label: { ID: 'Kepulauan Misool', EN: 'Misool Islands' },
        polygon: [
            [130.12, -1.82],
            [130.16, -1.82],
            [130.20, -1.83],
            [130.24, -1.83],
            [130.28, -1.83],
            [130.32, -1.84],
            [130.34, -1.86],
            [130.35, -1.88],
            [130.34, -1.90],
            [130.32, -1.92],
            [130.30, -1.94],
            [130.26, -1.95],
            [130.22, -1.95],
            [130.18, -1.94],
            [130.15, -1.93],
            [130.13, -1.91],
            [130.12, -1.89],
            [130.11, -1.86],
            [130.12, -1.84],
            [130.12, -1.82],
        ],
    },
    'Wayag': {
        center: [-0.18, 130.06],
        zoom: 13,
        color: '#f59e0b',
        label: { ID: 'Wayag', EN: 'Wayag' },
        polygon: [
            [130.02, -0.14],
            [130.04, -0.14],
            [130.06, -0.15],
            [130.08, -0.15],
            [130.10, -0.16],
            [130.11, -0.17],
            [130.11, -0.19],
            [130.10, -0.21],
            [130.08, -0.22],
            [130.06, -0.22],
            [130.04, -0.21],
            [130.03, -0.20],
            [130.02, -0.18],
            [130.02, -0.16],
            [130.02, -0.14],
        ],
    },
    'Teluk Mayalibit': {
        center: [-0.34, 130.91],
        zoom: 12,
        color: '#a855f7',
        label: { ID: 'Teluk Mayalibit', EN: 'Mayalibit Bay' },
        polygon: [
            [130.84, -0.28],
            [130.87, -0.28],
            [130.90, -0.29],
            [130.93, -0.30],
            [130.96, -0.30],
            [130.98, -0.32],
            [130.99, -0.34],
            [130.98, -0.36],
            [130.97, -0.38],
            [130.95, -0.39],
            [130.92, -0.40],
            [130.89, -0.40],
            [130.87, -0.39],
            [130.85, -0.38],
            [130.84, -0.36],
            [130.83, -0.34],
            [130.83, -0.32],
            [130.83, -0.30],
            [130.84, -0.28],
        ],
    },
};

export const mapCenter = [-1.0, 130.5];
export const mapZoom = 9;

// Dummy RAMS points spread across 4 zones in Raja Ampat
export const ramsPoints = [
    // === Dampier Strait (main tourism hub) ===
    { id: 'RAMS-DS-001', name: 'Manta Sandy', zone: 'Dampier Strait', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 14, dateInstalled: '15/03/2013', lat: -0.5465, lng: 130.6450, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-002', name: 'Cape Kri', zone: 'Dampier Strait', status: RAMS_STATUS.OCCUPIED, maxCapacity: 3, depth: 18, dateInstalled: '22/06/2013', lat: -0.5530, lng: 130.6850, image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-003', name: 'Sardine Reef', zone: 'Dampier Strait', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 12, dateInstalled: '10/02/2014', lat: -0.5350, lng: 130.6720, image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-004', name: 'Blue Magic', zone: 'Dampier Strait', status: RAMS_STATUS.OCCUPIED, maxCapacity: 2, depth: 25, dateInstalled: '05/07/2014', lat: -0.5600, lng: 130.6380, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-005', name: 'Manta Ridge', zone: 'Dampier Strait', status: RAMS_STATUS.AVAILABLE, maxCapacity: 3, depth: 16, dateInstalled: '18/04/2015', lat: -0.5280, lng: 130.6550, image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-006', name: 'Chicken Reef', zone: 'Dampier Strait', status: RAMS_STATUS.MAINTENANCE, maxCapacity: 2, depth: 20, dateInstalled: '30/08/2015', lat: -0.5700, lng: 130.6200, image: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-007', name: 'The Passage', zone: 'Dampier Strait', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 10, dateInstalled: '12/01/2016', lat: -0.5150, lng: 130.7100, image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-008', name: 'Friwen Wall', zone: 'Dampier Strait', status: RAMS_STATUS.OCCUPIED, maxCapacity: 2, depth: 22, dateInstalled: '25/05/2016', lat: -0.5400, lng: 130.6100, image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-009', name: 'Yenbuba Jetty', zone: 'Dampier Strait', status: RAMS_STATUS.AVAILABLE, maxCapacity: 1, depth: 8, dateInstalled: '08/09/2017', lat: -0.5620, lng: 130.6650, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop' },
    { id: 'RAMS-DS-010', name: 'Mike\'s Point', zone: 'Dampier Strait', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 15, dateInstalled: '14/11/2018', lat: -0.5050, lng: 130.6900, image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop' },

    // === Misool ===
    { id: 'RAMS-MS-001', name: 'Boo Windows', zone: 'Misool', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 16, dateInstalled: '20/03/2014', lat: -1.8800, lng: 130.2500, image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=200&fit=crop' },
    { id: 'RAMS-MS-002', name: 'Fiabacet', zone: 'Misool', status: RAMS_STATUS.OCCUPIED, maxCapacity: 3, depth: 20, dateInstalled: '11/08/2014', lat: -1.8950, lng: 130.2200, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop' },
    { id: 'RAMS-MS-003', name: 'Magic Mountain', zone: 'Misool', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 24, dateInstalled: '03/05/2015', lat: -1.8600, lng: 130.2800, image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=200&fit=crop' },
    { id: 'RAMS-MS-004', name: 'Nudi Rock', zone: 'Misool', status: RAMS_STATUS.MAINTENANCE, maxCapacity: 2, depth: 18, dateInstalled: '27/10/2016', lat: -1.9100, lng: 130.1900, image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=400&h=200&fit=crop' },
    { id: 'RAMS-MS-005', name: 'Whale Rock', zone: 'Misool', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 22, dateInstalled: '16/06/2017', lat: -1.8400, lng: 130.3100, image: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=200&fit=crop' },
    { id: 'RAMS-MS-006', name: 'Daram Island', zone: 'Misool', status: RAMS_STATUS.OCCUPIED, maxCapacity: 2, depth: 14, dateInstalled: '09/04/2019', lat: -1.9250, lng: 130.1600, image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&h=200&fit=crop' },

    // === Wayag ===
    { id: 'RAMS-WG-001', name: 'Wayag Lagoon', zone: 'Wayag', status: RAMS_STATUS.AVAILABLE, maxCapacity: 3, depth: 10, dateInstalled: '07/07/2015', lat: -0.1700, lng: 130.0600, image: 'https://images.unsplash.com/photo-1498354136128-58f790194fa7?w=400&h=200&fit=crop' },
    { id: 'RAMS-WG-002', name: 'Wayag View Point', zone: 'Wayag', status: RAMS_STATUS.OCCUPIED, maxCapacity: 2, depth: 8, dateInstalled: '19/02/2016', lat: -0.1850, lng: 130.0400, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop' },
    { id: 'RAMS-WG-003', name: 'Wayag Channel', zone: 'Wayag', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 12, dateInstalled: '23/09/2018', lat: -0.1600, lng: 130.0800, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop' },
    { id: 'RAMS-WG-004', name: 'Wayag South', zone: 'Wayag', status: RAMS_STATUS.MAINTENANCE, maxCapacity: 2, depth: 15, dateInstalled: '04/12/2020', lat: -0.2000, lng: 130.0500, image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=200&fit=crop' },

    // === Teluk Mayalibit ===
    { id: 'RAMS-TM-001', name: 'Mayalibit Entrance', zone: 'Teluk Mayalibit', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 12, dateInstalled: '01/06/2016', lat: -0.3200, lng: 130.9400, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop' },
    { id: 'RAMS-TM-002', name: 'Kali Biru', zone: 'Teluk Mayalibit', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 10, dateInstalled: '28/03/2017', lat: -0.3400, lng: 130.9150, image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&h=200&fit=crop' },
    { id: 'RAMS-TM-003', name: 'Mayalibit Inner Bay', zone: 'Teluk Mayalibit', status: RAMS_STATUS.OCCUPIED, maxCapacity: 3, depth: 14, dateInstalled: '13/10/2018', lat: -0.3600, lng: 130.8900, image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=200&fit=crop' },
    { id: 'RAMS-TM-004', name: 'Mayalibit Mangrove', zone: 'Teluk Mayalibit', status: RAMS_STATUS.AVAILABLE, maxCapacity: 1, depth: 6, dateInstalled: '21/08/2020', lat: -0.3800, lng: 130.8700, image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop' },
    { id: 'RAMS-TM-005', name: 'Yenbeser', zone: 'Teluk Mayalibit', status: RAMS_STATUS.AVAILABLE, maxCapacity: 2, depth: 11, dateInstalled: '06/05/2021', lat: -0.3050, lng: 130.9600, image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=200&fit=crop' },
];
