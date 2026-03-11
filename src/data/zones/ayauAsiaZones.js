import { ZONE_TYPES, ZONE_CONFIG } from "./zoneConfig";

// Real geographic coordinates for Kepulauan Ayau-Asia, Raja Ampat
export const center = [-0.25, 131.0]; // Center of Ayau-Asia area
export const zoom = 10;

export const zones = [
    {
        id: "ayau-core-1",
        type: ZONE_TYPES.CORE,
        color: ZONE_CONFIG[ZONE_TYPES.CORE].color,
        nameID: "Zona Inti Ayau",
        nameEN: "Ayau Core Zone",
        descID: "Perairan Kepulauan Asia",
        descEN: "Asia Islands Waters",
        area: 12500,
        coordinates: [
            [-0.18, 130.92],
            [-0.18, 130.98],
            [-0.24, 130.98],
            [-0.24, 130.92]
        ]
    },
    {
        id: "ayau-limited-1",
        type: ZONE_TYPES.LIMITED_USE,
        color: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].color,
        nameID: "Zona Pemanfaatan Terbatas",
        nameEN: "Limited Use Zone",
        descID: "Wisata Bahari",
        descEN: "Marine Tourism",
        area: 45000,
        coordinates: [
            [-0.26, 131.0],
            [-0.26, 131.12],
            [-0.35, 131.12],
            [-0.35, 131.0]
        ]
    },
    {
        id: "ayau-sasi-1",
        type: ZONE_TYPES.SASI,
        color: ZONE_CONFIG[ZONE_TYPES.SASI].color,
        nameID: "Zona Sasi Kampung",
        nameEN: "Village Sasi Zone",
        descID: "Wilayah Adat",
        descEN: "Traditional Area",
        area: 5000,
        coordinates: [
            [-0.30, 130.88],
            [-0.30, 130.94],
            [-0.36, 130.94],
            [-0.36, 130.88]
        ]
    }
];
