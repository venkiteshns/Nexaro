export const placeToCoords = async ({ city, district, state, country }) => {
  const query = `${city},${district},${state},${country}`;
  console.log("query : ", query);

  try {
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    );

    const data = await response.json();

    if (!data.length) {
      throw new Error("Location not found");
    }
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
    // throw new Error("test");
  } catch (error) {
    throw new Error(error);
  }
};
