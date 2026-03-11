import { ZONE_TYPES, ZONE_CONFIG } from "./zoneConfig";

// Real geographic coordinates for Selat Dampier, Raja Ampat
export const center = [-0.52, 130.65]; // Center of Selat Dampier
export const zoom = 11;

export const zones = [
    {
        id: "dampier-core-1",
        type: ZONE_TYPES.CORE,
        color: ZONE_CONFIG[ZONE_TYPES.CORE].color,
        nameID: "Pasir Timbul",
        nameEN: "Sandbar Core",
        descID: "Zona Perlindungan Spesies",
        descEN: "Species Protection Zone",
        area: 15600,
        coordinates: [
            [-0.48, 130.60],
            [-0.48, 130.68],
            [-0.54, 130.68],
            [-0.54, 130.60]
        ]
    },
    {
        id: "dampier-limited-1",
        type: ZONE_TYPES.LIMITED_USE,
        color: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].color,
        nameID: "Arborek Tourism",
        nameEN: "Arborek Tourism",
        descID: "Diving & Snorkeling Spot",
        descEN: "Diving & Snorkeling Spot",
        area: 60000,
        coordinates: [
            [-0.55, 130.58],
            [-0.55, 130.72],
            [-0.62, 130.72],
            [-0.62, 130.58]
        ]
    },
    {
        id: "dampier-sasi-1",
        type: ZONE_TYPES.SASI,
        color: ZONE_CONFIG[ZONE_TYPES.SASI].color,
        nameID: "Sasi Laut",
        nameEN: "Marine Sasi",
        descID: "Wilayah Adat Tertentu",
        descEN: "Designated Traditional Area",
        area: 8000,
        coordinates: [
            [-0.46, 130.70],
            [-0.46, 130.76],
            [-0.52, 130.76],
            [-0.52, 130.70]
        ]
    }
];
