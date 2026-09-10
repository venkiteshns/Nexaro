import ngeohash from 'ngeohash';

export const encodeGeohash = (lat, lng, precision = 4) => {
    return ngeohash.encode(lat, lng, precision);
};
