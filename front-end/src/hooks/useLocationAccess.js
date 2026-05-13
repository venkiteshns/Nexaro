import { useState, useCallback } from 'react';
import { getCurrentPosition } from '../services/geolocationService';
import { reverseGeocode } from '../services/reverseGeocodeService';
import { geocode } from '../services/geocodeService';
import { isInsecureNetworkOrigin } from '../utils/helpers';
import { KERALA_DISTRICTS, MAX_GEO_RETRIES } from '../utils/constants';

// ─── Location State Machine ────────────────────────────────────────────────────
// States:
//   idle              – initial, nothing attempted
//   autoDetecting     – browser geolocation in progress
//   autoDetected      – GPS success, fields populated
//   failed            – last GPS attempt failed, can retry
//   manualMode        – user chose manual OR exhausted retries
//   resolvingCoords   – geocoding the manually selected place
//   resolved          – manual place geocoded, coords ready
//   coordFailed       – geocoding the manual place failed
// ──────────────────────────────────────────────────────────────────────────────

export function useLocationAccess(setValue) {
  const [locationState, setLocationState] = useState('idle');
  const [attempts, setAttempts] = useState(0);

  // Legacy alias so LocationAccessCard can still consume it
  const geoState = locationState;
  const setGeoState = setLocationState;

  // ── Auto geolocation ────────────────────────────────────────────────────────
  const requestLocation = useCallback(async () => {
    if (isInsecureNetworkOrigin()) {
      setLocationState('manualMode');
      return;
    }
    setLocationState('autoDetecting');
    try {
      const pos = await getCurrentPosition();
      const addr = await reverseGeocode(pos);
      setValue('exactLat', pos.lat);
      setValue('exactLng', pos.lng);
      setValue('country', addr.country, { shouldValidate: true });
      setValue('state', addr.state, { shouldValidate: true });
      const matched = KERALA_DISTRICTS.find(
        (d) => d.toLowerCase() === (addr.district || '').toLowerCase()
      );
      setValue('district', matched || addr.district, { shouldValidate: true });
      setValue('city', addr.city, { shouldValidate: true });
      setLocationState('autoDetected');
    } catch {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_GEO_RETRIES) {
        // Exhausted all retries → force manual mode
        setLocationState('manualMode');
      } else {
        setLocationState('failed');
      }
    }
  }, [attempts, setValue]);

  // ── Manual coordinate resolution ────────────────────────────────────────────
  const resolveManualCoords = useCallback(async ({ district, city, state = 'Kerala', country = 'India' }) => {
    if (!district || !city) return;
    setLocationState('resolvingCoords');
    try {
      const address = `${city}, ${district}, ${state}, ${country}`;
      const coords = await geocode(address);
      if (!coords) throw new Error('No results found');
      setValue('exactLat', coords.lat);
      setValue('exactLng', coords.lng);
      setValue('state', state, { shouldValidate: true });
      setValue('country', country, { shouldValidate: true });
      setLocationState('resolved');
      return coords;
    } catch {
      setLocationState('coordFailed');
      // Clear any stale coords so the form cannot be submitted with bad data
      setValue('exactLat', '');
      setValue('exactLng', '');
      return null;
    }
  }, [setValue]);

  // ── Expose a method to reset back to manual selection after coordFailed ─────
  const retryManual = useCallback(() => {
    setValue('exactLat', '');
    setValue('exactLng', '');
    setLocationState('manualMode');
  }, [setValue]);

  // ── Full reset (on logout / form reset) ────────────────────────────────────
  const clearLocationState = useCallback(() => {
    setLocationState('idle');
    setAttempts(0);
    setValue('exactLat', '');
    setValue('exactLng', '');
    setValue('district', '');
    setValue('city', '');
    setValue('state', '');
    setValue('country', '');
  }, [setValue]);

  return {
    locationState,
    setLocationState,
    attempts,
    requestLocation,
    maxRetries: MAX_GEO_RETRIES,
    resolveManualCoords,
    retryManual,
    clearLocationState,
    // Legacy aliases kept for backward-compat:
    geoState,
    setGeoState,
  };
}
