const ZONE_KEYS = {
  INTI: "Inti",
  PEMANFAATAN: "Pemanfaatan Terbatas",
  LAINNYA: "Lainnya",
};

const WEB_MERCATOR_LIMIT = 20037508.342789244;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeZoneName(input) {
  const raw = String(input || "").trim().toLowerCase();

  if (raw.includes("inti")) {
    return ZONE_KEYS.INTI;
  }
  if (raw.includes("pemanfaatan")) {
    return ZONE_KEYS.PEMANFAATAN;
  }
  return ZONE_KEYS.LAINNYA;
}

function webMercatorToWgs84(x, y) {
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) return null;
  if (Math.abs(x) > WEB_MERCATOR_LIMIT * 1.2 || Math.abs(y) > WEB_MERCATOR_LIMIT * 1.2) return null;

  const lon = (x / WEB_MERCATOR_LIMIT) * 180;
  const latRadians = (2 * Math.atan(Math.exp((y / WEB_MERCATOR_LIMIT) * Math.PI)) - Math.PI / 2);
  const lat = (latRadians * 180) / Math.PI;

  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return null;

  return [lon, lat];
}

function utmToWgs84(easting, northing, zoneNumber, southernHemisphere) {
  if (!isFiniteNumber(easting) || !isFiniteNumber(northing)) return null;

  const a = 6378137.0;
  const e = 0.081819191;
  const e1sq = 0.006739497;
  const k0 = 0.9996;

  const x = easting - 500000.0;
  let y = northing;

  if (southernHemisphere) {
    y -= 10000000.0;
  }

  const longOrigin = (zoneNumber - 1) * 6 - 180 + 3;
  const eccPrimeSquared = e1sq;

  const m = y / k0;
  const mu = m / (a * (1 - Math.pow(e, 2) / 4 - (3 * Math.pow(e, 4)) / 64 - (5 * Math.pow(e, 6)) / 256));

  const e1 = (1 - Math.sqrt(1 - Math.pow(e, 2))) / (1 + Math.sqrt(1 - Math.pow(e, 2)));

  const j1 = (3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32;
  const j2 = (21 * Math.pow(e1, 2)) / 16 - (55 * Math.pow(e1, 4)) / 32;
  const j3 = (151 * Math.pow(e1, 3)) / 96;
  const j4 = (1097 * Math.pow(e1, 4)) / 512;

  const fp = mu + j1 * Math.sin(2 * mu) + j2 * Math.sin(4 * mu) + j3 * Math.sin(6 * mu) + j4 * Math.sin(8 * mu);

  const sinFp = Math.sin(fp);
  const cosFp = Math.cos(fp);
  const tanFp = Math.tan(fp);

  const c1 = eccPrimeSquared * Math.pow(cosFp, 2);
  const t1 = Math.pow(tanFp, 2);
  const r1 = a * (1 - Math.pow(e, 2)) / Math.pow(1 - Math.pow(e * sinFp, 2), 1.5);
  const n1 = a / Math.sqrt(1 - Math.pow(e * sinFp, 2));
  const d = x / (n1 * k0);

  const q1 = n1 * tanFp / r1;
  const q2 = (Math.pow(d, 2)) / 2;
  const q3 = (5 + 3 * t1 + 10 * c1 - 4 * Math.pow(c1, 2) - 9 * eccPrimeSquared) * Math.pow(d, 4) / 24;
  const q4 = (61 + 90 * t1 + 298 * c1 + 45 * Math.pow(t1, 2) - 252 * eccPrimeSquared - 3 * Math.pow(c1, 2)) * Math.pow(d, 6) / 720;

  const lat = fp - q1 * (q2 - q3 + q4);

  const q5 = d;
  const q6 = (1 + 2 * t1 + c1) * Math.pow(d, 3) / 6;
  const q7 = (5 - 2 * c1 + 28 * t1 - 3 * Math.pow(c1, 2) + 8 * eccPrimeSquared + 24 * Math.pow(t1, 2)) * Math.pow(d, 5) / 120;

  const lon = ((q5 - q6 + q7) / cosFp);

  const latDeg = (lat * 180) / Math.PI;
  const lonDeg = longOrigin + ((lon * 180) / Math.PI);

  if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg)) return null;
  if (lonDeg < -180 || lonDeg > 180 || latDeg < -90 || latDeg > 90) return null;

  return [lonDeg, latDeg];
}

function mapCoordinates(coords, converter) {
  if (!Array.isArray(coords)) return coords;

  if (coords.length >= 2 && isFiniteNumber(coords[0]) && isFiniteNumber(coords[1])) {
    const converted = converter(coords[0], coords[1]);
    if (!converted) return null;
    if (coords.length > 2) {
      return [converted[0], converted[1], ...coords.slice(2)];
    }
    return converted;
  }

  const mapped = coords
    .map((entry) => mapCoordinates(entry, converter))
    .filter((entry) => entry !== null);

  return mapped.length ? mapped : null;
}

function normalizeByCrs(featureCollection) {
  if (!featureCollection || featureCollection.type !== "FeatureCollection") {
    return { type: "FeatureCollection", features: [] };
  }

  const crsName = featureCollection?.crs?.properties?.name || "";
  let converter = null;

  if (crsName.includes("3857")) {
    converter = webMercatorToWgs84;
  } else if (crsName.includes("32752")) {
    converter = (x, y) => utmToWgs84(x, y, 52, true);
  }

  if (!converter) {
    return {
      type: "FeatureCollection",
      features: Array.isArray(featureCollection.features) ? featureCollection.features : [],
    };
  }

  const features = (featureCollection.features || [])
    .map((feature) => {
      const mappedCoords = mapCoordinates(feature?.geometry?.coordinates, converter);
      if (!mappedCoords) return null;

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: mappedCoords,
        },
      };
    })
    .filter(Boolean);

  return {
    type: "FeatureCollection",
    features,
  };
}

async function loadGeoJsonFromPublic(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  const data = await response.json();
  return normalizeByCrs(data);
}

function pointFromFeature(feature) {
  const coords = feature?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return null;

  const lon = Number(coords[0]);
  const lat = Number(coords[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return [lat, lon];
}

export {
  ZONE_KEYS,
  loadGeoJsonFromPublic,
  normalizeZoneName,
  pointFromFeature,
};
