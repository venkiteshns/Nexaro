/**
 * Reverse-geocodes { lat, lng } using OpenStreetMap Nominatim.
 * Returns { country, state, district, city, displayName }
 */
export async function reverseGeocode({ lat, lng }) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "NEXARO-App/1.0" },
  });
  if (!res.ok) throw new Error("Reverse geocoding failed.");
  const data = await res.json();
  const addr = data.address || {};
  return {
    country:     addr.country      || "",
    state:       addr.state        || "",
    district:    addr.state_district || addr.county || addr.district || "",
    city:        addr.city || addr.town || addr.village || addr.suburb || "",
    displayName: data.display_name || "",
  };
}
