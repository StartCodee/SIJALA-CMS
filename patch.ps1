$f = "d:\Hakkam\Kuliah\Projects\SIJALA-CMS\src\pages\IsafePage.jsx"
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)
$out = [System.Collections.Generic.List[string]]::new()

for ($i = 0; $i -lt $lines.Count; $i++) {
  # 1. Remove ActivityPanel component lines 258-428 (0-indexed 257-427)
  if ($i -ge 257 -and $i -le 427) { continue }
  # 2. Remove activityOpen state line 582 (0-indexed 581)
  if ($i -eq 581) { continue }
  # 3. Remove showTrails and showDestinations lines 590-591 (0-indexed 589-590)
  if ($i -ge 589 -and $i -le 590) { continue }
  # 4. Replace route/dest/trail block (lines 769-813, 0-indexed 768-812) with per-selection block
  if ($i -eq 768) {
    $out.Add("                {/* Route, trail & destination - only for the selected boat */}")
    $out.Add("                {selectedBoatId && boats")
    $out.Add("                  .filter((boat) => boat.id === selectedBoatId)")
    $out.Add("                  .map((boat) => (")
    $out.Add("                    <React.Fragment key={`sel-${boat.id}`}>")
    $out.Add("                      {/* Dashed route line: current to destination */}")
    $out.Add("                      <Polyline")
    $out.Add("                        positions={[[boat.lat, boat.lng], [boat.destLat, boat.destLng]]}")
    $out.Add("                        pathOptions={{ color: boat.color, weight: 1.5, dashArray: `4 7`, opacity: 0.7 }}")
    $out.Add("                      />")
    $out.Add("                      {/* Destination diamond marker */}")
    $out.Add("                      <Marker")
    $out.Add("                        position={[boat.destLat, boat.destLng]}")
    $out.Add("                        icon={createDestIcon(boat.color)}")
    $out.Add("                      >")
    $out.Add("                        <Popup>")
    $out.Add("                          <div style={{ fontSize: 12, lineHeight: 1.7 }}>")
    $out.Add("                            <b>Tujuan — {boat.name}</b><br />")
    $out.Add("                            {boat.destLat.toFixed(5)}, {boat.destLng.toFixed(5)}")
    $out.Add("                          </div>")
    $out.Add("                        </Popup>")
    $out.Add("                      </Marker>")
    $out.Add("                      {/* Trail polyline */}")
    $out.Add("                      <Polyline")
    $out.Add("                        positions={boat.trail}")
    $out.Add("                        pathOptions={{ color: boat.color, weight: 2.5, opacity: 0.9 }}")
    $out.Add("                      />")
    $out.Add("                    </React.Fragment>")
    $out.Add("                  ))}")
    continue
  }
  if ($i -ge 769 -and $i -le 812) { continue }
  # 5. Remove ActivityPanel JSX + re-open button (lines 849-865, 0-indexed 848-864)
  if ($i -ge 848 -and $i -le 865) { continue }
  $out.Add($lines[$i])
}

[System.IO.File]::WriteAllLines($f, $out, [System.Text.Encoding]::UTF8)
Write-Host "Patched. New line count: $($out.Count)"
