import ngeohash from 'ngeohash';

// precision 4 = ~40km x 20km zone — good enough for 50km radius
export const encodeGeohash = (lat, lng, precision = 4) => {
    return ngeohash.encode(lat, lng, precision);
};
