import { ZONE_TYPES, ZONE_CONFIG } from "./zoneConfig";

// Real geographic coordinates for Teluk Mayalibit, Raja Ampat
export const center = [-0.35, 130.55]; // Center of Teluk Mayalibit
export const zoom = 11;

export const zones = [
    {
        id: "mayalibit-core-1",
        type: ZONE_TYPES.CORE,
        color: ZONE_CONFIG[ZONE_TYPES.CORE].color,
        nameID: "Zona Inti Teluk",
        nameEN: "Bay Core Zone",
        descID: "Perairan Dalam Teluk",
        descEN: "Inner Bay Waters",
        area: 9500,
        coordinates: [
            [-0.32, 130.52],
            [-0.32, 130.58],
            [-0.38, 130.58],
            [-0.38, 130.52]
        ]
    },
    {
        id: "mayalibit-limited-1",
        type: ZONE_TYPES.LIMITED_USE,
        color: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].color,
        nameID: "Zona Pemanfaatan Terbatas",
        nameEN: "Limited Use Zone",
        descID: "Wisata Mangrove",
        descEN: "Mangrove Tourism",
        area: 25000,
        coordinates: [
            [-0.28, 130.48],
            [-0.28, 130.62],
            [-0.42, 130.62],
            [-0.42, 130.48]
        ]
    }
];
