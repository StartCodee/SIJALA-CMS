const fs = require('fs');
const f = 'd:\\Hakkam\\Kuliah\\Projects\\SIJALA-CMS\\src\\pages\\SispandalwasPage.jsx';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const out = [];

const selBlock = [
  "                {/* Route, trail & destination - only for the selected boat */}",
  "                {selectedBoatId && boats",
  "                  .filter((boat) => boat.id === selectedBoatId)",
  "                  .map((boat) => (",
  "                    <React.Fragment key={`sel-${boat.id}`}>",
  "                      {/* Dashed route line */}",
  "                      <Polyline",
  "                        positions={[[boat.lat, boat.lng], [boat.destLat, boat.destLng]]}",
  "                        pathOptions={{ color: boat.color, weight: 1.5, dashArray: '4 7', opacity: 0.7 }}",
  "                      />",
  "                      {/* Destination diamond marker */}",
  "                      <Marker",
  "                        position={[boat.destLat, boat.destLng]}",
  "                        icon={createDestIcon(boat.color)}",
  "                      >",
  "                        <Popup>",
  "                          <div style={{ fontSize: 12, lineHeight: 1.7 }}>",
  "                            <b>Tujuan &mdash; {boat.name}</b><br />",
  "                            {boat.destLat.toFixed(5)}, {boat.destLng.toFixed(5)}",
  "                          </div>",
  "                        </Popup>",
  "                      </Marker>",
  "                      {/* Trail polyline */}",
  "                      <Polyline",
  "                        positions={boat.trail}",
  "                        pathOptions={{ color: boat.color, weight: 2.5, opacity: 0.9 }}",
  "                      />",
  "                    </React.Fragment>",
  "                  ))}",
];

for (let i = 0; i < lines.length; i++) {
  // 1. Remove ActivityPanel component (0-indexed 257-427)
  if (i >= 257 && i <= 427) continue;
  // 2. Remove activityOpen state (0-indexed 581)
  if (i === 581) continue;
  // 3. Remove showTrails + showDestinations (0-indexed 589-590)
  if (i >= 589 && i <= 590) continue;
  // 4. Replace route/dest/trail block (0-indexed 768-812) with per-selection block
  if (i === 768) { selBlock.forEach(l => out.push(l)); continue; }
  if (i >= 769 && i <= 812) continue;
  // 5. Remove ActivityPanel JSX + re-open button (0-indexed 848-865)
  if (i >= 848 && i <= 865) continue;
  out.push(lines[i]);
}

fs.writeFileSync(f, out.join('\n'), 'utf8');
console.log('Done. Lines:', out.length);
