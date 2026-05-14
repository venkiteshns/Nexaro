export async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "NEXARO-App/1.0" },
  });
  if (!res.ok) throw new Error("Geocoding failed.");
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
}
