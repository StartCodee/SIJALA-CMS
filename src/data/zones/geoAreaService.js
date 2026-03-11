import overviewUrl from "@/data/zones/generated/overview.json?url";
import area1Url from "@/data/zones/generated/areas/area-1.json?url";
import area2Url from "@/data/zones/generated/areas/area-2.json?url";
import area3Url from "@/data/zones/generated/areas/area-3.json?url";
import area4Url from "@/data/zones/generated/areas/area-4.json?url";
import area5Url from "@/data/zones/generated/areas/area-5.json?url";
import area6Url from "@/data/zones/generated/areas/area-6.json?url";
import area7Url from "@/data/zones/generated/areas/area-7.json?url";
import { ZONE_TYPES } from "./zoneConfig";

const DEFAULT_CENTER = [-0.583943, 130.271383];

const AREA_DATA_URLS = {
    1: area1Url,
    2: area2Url,
    3: area3Url,
    4: area4Url,
    5: area5Url,
    6: area6Url,
    7: area7Url,
};

let geoAreaCollectionPromise;
const geoAreaByNumberPromise = new Map();

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load geo area data: ${response.status}`);
    }

    return response.json();
}

export function formatArea(value, lang = "ID", withUnit = true) {
    const locale = lang === "EN" ? "en-US" : "id-ID";
    const unit = lang === "EN" ? "Hectares" : "Hektare";
    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

    return withUnit ? `${formatted} ${unit}` : formatted;
}

export function buildZoneSummary(area, lang = "ID") {
    if (!area) {
        return [];
    }

    return [
        {
            zoneType: ZONE_TYPES.CORE,
            label: lang === "EN" ? "Core Zone" : "Zona Inti",
            value: formatArea(area.zoneTotals?.[ZONE_TYPES.CORE], lang),
        },
        {
            zoneType: ZONE_TYPES.LIMITED_USE,
            label: lang === "EN" ? "Limited Use Zone" : "Zona Pemanfaatan Terbatas",
            value: formatArea(area.zoneTotals?.[ZONE_TYPES.LIMITED_USE], lang),
        },
        {
            zoneType: ZONE_TYPES.OTHER,
            label: lang === "EN" ? "Other Zone" : "Zona Lainnya",
            value: formatArea(area.zoneTotals?.[ZONE_TYPES.OTHER], lang),
        },
    ];
}

export async function getGeoAreaCollection() {
    if (!geoAreaCollectionPromise) {
        geoAreaCollectionPromise = fetchJson(overviewUrl).then((data) => ({
            ...data,
            center: data.center || DEFAULT_CENTER,
            zoom: data.zoom || 8,
        }));
    }

    return geoAreaCollectionPromise;
}

export async function getGeoAreaByNumber(areaNumber) {
    const areaKey = Number(areaNumber);
    const url = AREA_DATA_URLS[areaKey];

    if (!url) {
        return null;
    }

    if (!geoAreaByNumberPromise.has(areaKey)) {
        geoAreaByNumberPromise.set(
            areaKey,
            fetchJson(url).then((area) => ({
                ...area,
                center: area.center || DEFAULT_CENTER,
                zoom: area.zoom || 9,
            }))
        );
    }

    return geoAreaByNumberPromise.get(areaKey);
}
