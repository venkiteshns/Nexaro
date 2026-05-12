import { useState } from 'react';
import { getCurrentPosition } from '../services/geolocationService';
import { reverseGeocode } from '../services/reverseGeocodeService';
import { isInsecureNetworkOrigin } from '../utils/helpers';
import { KERALA_DISTRICTS, MAX_GEO_RETRIES } from '../utils/constants';

export function useLocationAccess(setValue) {
  const [geoState, setGeoState] = useState("idle");
  const [attempts, setAttempts] = useState(0);

  async function requestLocation() {
    if (isInsecureNetworkOrigin()) {
      setGeoState("manual");
      return;
    }
    setGeoState("loading");
    try {
      const pos = await getCurrentPosition();
      const addr = await reverseGeocode(pos);
      setValue("exactLat", pos.lat);
      setValue("exactLng", pos.lng);
      setValue("country", addr.country, { shouldValidate: true });
      setValue("state", addr.state, { shouldValidate: true });
      const matched = KERALA_DISTRICTS.find(d => d.toLowerCase() === (addr.district || "").toLowerCase());
      setValue("district", matched || addr.district, { shouldValidate: true });
      setValue("city", addr.city, { shouldValidate: true });
      setGeoState("granted");
    } catch (err) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_GEO_RETRIES) {
        setGeoState("exhausted");
      } else {
        setGeoState("failed");
      }
    }
  }

  return { geoState, setGeoState, attempts, requestLocation, maxRetries: MAX_GEO_RETRIES };
}
