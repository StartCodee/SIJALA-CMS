export const ZONE_TYPES = {
    CORE: "ZONA_INTI",
    LIMITED_USE: "ZONA_PEMANFAATAN_TERBATAS",
    SASI: "ZONA_SASI",
    OTHER: "ZONA_LAINNYA"
};

export const ZONE_DISPLAY_ORDER = [
    ZONE_TYPES.CORE,
    ZONE_TYPES.LIMITED_USE,
    ZONE_TYPES.OTHER,
    ZONE_TYPES.SASI,
];

export const ZONE_CONFIG = {
    [ZONE_TYPES.CORE]: {
        color: "#ef4444", // red-500
        labelID: "Zona Inti",
        labelEN: "Core Zone",
        descID: "Akses terbatas untuk penelitian & pendidikan",
        descEN: "Limited access for research & education"
    },
    [ZONE_TYPES.LIMITED_USE]: {
        color: "#22c55e", // green-500
        labelID: "Zona Pemanfaatan Terbatas",
        labelEN: "Limited Use Zone",
        descID: "Pariwisata berkelanjutan diperbolehkan",
        descEN: "Sustainable tourism allowed"
    },
    [ZONE_TYPES.SASI]: {
        color: "#eab308", // yellow-500
        labelID: "Zona Sasi",
        labelEN: "Sasi Zone",
        descID: "Kearifan lokal & buka-tutup sasi",
        descEN: "Local wisdom & seasonal closure"
    },
    [ZONE_TYPES.OTHER]: {
        color: "#3b82f6", // blue-500
        labelID: "Zona Lainnya",
        labelEN: "Other Zone",
        descID: "Area penggunaan umum",
        descEN: "General use area"
    }
};

export const ZONE_COLORS = {
    [ZONE_TYPES.CORE]: {
        fill: ZONE_CONFIG[ZONE_TYPES.CORE].color,
        stroke: ZONE_CONFIG[ZONE_TYPES.CORE].color,
        name: {
            ID: ZONE_CONFIG[ZONE_TYPES.CORE].labelID,
            EN: ZONE_CONFIG[ZONE_TYPES.CORE].labelEN
        }
    },
    [ZONE_TYPES.LIMITED_USE]: {
        fill: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].color,
        stroke: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].color,
        name: {
            ID: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].labelID,
            EN: ZONE_CONFIG[ZONE_TYPES.LIMITED_USE].labelEN
        }
    },
    [ZONE_TYPES.SASI]: {
        fill: ZONE_CONFIG[ZONE_TYPES.SASI].color,
        stroke: ZONE_CONFIG[ZONE_TYPES.SASI].color,
        name: {
            ID: ZONE_CONFIG[ZONE_TYPES.SASI].labelID,
            EN: ZONE_CONFIG[ZONE_TYPES.SASI].labelEN
        }
    },
    [ZONE_TYPES.OTHER]: {
        fill: ZONE_CONFIG[ZONE_TYPES.OTHER].color,
        stroke: ZONE_CONFIG[ZONE_TYPES.OTHER].color,
        name: {
            ID: ZONE_CONFIG[ZONE_TYPES.OTHER].labelID,
            EN: ZONE_CONFIG[ZONE_TYPES.OTHER].labelEN
        }
    }
};

export const getZoneColor = (type) => ZONE_CONFIG[type]?.color || "#cbd5e1";

export const sortZoneTypes = (zoneTypes = []) => {
    const orderMap = new Map(
        ZONE_DISPLAY_ORDER.map((type, index) => [type, index])
    );

    return [...zoneTypes].sort((a, b) => {
        const aIndex = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex;
    });
};
