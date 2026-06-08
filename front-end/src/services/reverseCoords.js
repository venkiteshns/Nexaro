export const reverseCoords = async ({ lat, lng }) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "NEXARO-App/1.0" },
  });

  if (!res.ok) {
    throw new Error("Unable to decode your location");
  }

  const data = await res.json();
  const addr = data?.address || {};

  return {
    country: addr.country || "",
    state: addr.state || "",
    district: addr.state_district || addr.county || addr.district || "",
    city: addr.city || addr.town || addr.village || addr.suburb || "",
    area: addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || "",
    displayName: data.display_name || "",
  };
};
