
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          reject(new Error("Location permission denied. Please allow access in your browser settings."));
          return;
        }
        _doGetPosition(resolve, reject);
      }).catch(() => {

        _doGetPosition(resolve, reject);
      });
    } else {
      _doGetPosition(resolve, reject);
    }
  });
}

function _doGetPosition(resolve, reject) {
  navigator.geolocation.getCurrentPosition(
    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    (err) => {
      const msgs = {
        1: "Location permission denied.",
        2: "Location unavailable. Please try again.",
        3: "Location request timed out.",
      };
      reject(new Error(msgs[err.code] || "Unknown geolocation error."));
    },
    {
      timeout: 8000,
      maximumAge: 300000,   
      enableHighAccuracy: false 
    }
  );
}
