export const searchPlaces = async (query) => {
    if(!query || query.trim().length < 3)  return [];

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=7`;
    const res = await fetch(url, {
        headers: { "Accept-Language": "en", "User-Agent": "NEXARO-App/1.0" },
    });

    if (!res.ok) {
        throw new Error("Unable to search for places");
    }

    const data = await res.json();

    return data.map((place) => ({
        displayName: place.display_name,
        country: place.address.country || "",
        state: place.address.state || "",
        district: place.address.state_district || place.address.county || place.address.district || "",
        // city: place.address.city || place.address.town || place.address.village || place.address.suburb || "",
        // area: place.address.suburb || place.address.neighbourhood || place.address.quarter || place.address.residential || "",
        lat: place.lat,
        lon: place.lon,
        address: place.address,
        id: place.place_id
    }));
}