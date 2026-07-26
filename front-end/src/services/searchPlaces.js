export const searchPlaces = async (query) => {
    if(!query || query.trim().length < 3)  return [];

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    const res = await fetch(url, {
        headers: { "Accept-Language": "en", "User-Agent": "NEXARO-App/1.0" },
    });

    if (!res.ok) {
        throw new Error("Unable to search for places");
    }

    const data = await res.json();

    return data.map((place) => ({
        displayName: place.display_name,
        lat: place.lat,
        lon: place.lon,
        address: place.address,
        id: place.place_id
    }));
}