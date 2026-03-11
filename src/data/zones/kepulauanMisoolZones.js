import { ZONE_TYPES, ZONE_CONFIG } from "./zoneConfig";

// Real geographic coordinates for Kepulauan Misool, Raja Ampat
export const center = [-1.9, 130.1]; // Center of Misool area
export const zoom = 10;

export const zones = [
    {
        id: "misool-core-1",
        type: ZONE_TYPES.CORE,
        color: ZONE_CONFIG[ZONE_TYPES.CORE].color,
        nameID: "Zona Inti Misool",
        nameEN: "Misool Core Zone",
        descID: "Perairan Selatan",
        descEN: "South Waters",
        area: 85000,
        coordinates: [
            [-1.82, 130.02],
            [-1.82, 130.14],
            [-1.94, 130.14],
            [-1.94, 130.02]
        ]
    },
    {
        id: "misool-limited-1",
        type: ZONE_TYPES.LIMITED_USE,
        color: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].color,
        nameID: "Lagoon",
        nameEN: "Lagoon",
        descID: "Wisata Kayak & Snorkeling",
        descEN: "Kayaking & Snorkeling",
        area: 32000,
        coordinates: [
            [-1.96, 130.06],
            [-1.96, 130.18],
            [-2.04, 130.18],
            [-2.04, 130.06]
        ]
    }
];
