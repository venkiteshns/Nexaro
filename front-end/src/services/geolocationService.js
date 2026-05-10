/**
 * Requests the browser's geolocation permission and resolves with coords.
 * Returns { lat, lng } or throws an Error.
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const msgs = {
          1: "Location permission denied. Please allow access and try again.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out.",
        };
        reject(new Error(msgs[err.code] || "Unknown geolocation error."));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
