import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { reverseGeocode } from "../../../services/reverseGeocodeService.js";
import "leaflet/dist/leaflet.css";
import "./ServiceAreaMap.css";


// Fix Leaflet's default icon URLs when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng) });
  return null;
}

const IconPin = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function ServiceAreaMap({ center, onConfirm, onClose }) {
  const [pin, setPin] = useState(null);
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePick(latlng) {
    setPin(latlng);
    setLoading(true);
    try {
      const result = await reverseGeocode({ lat: latlng.lat, lng: latlng.lng });
      setGeo(result);
    } catch {
      setGeo({ displayName: "Selected location", city: "", state: "", district: "" });
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm() {
    if (!pin || !geo) return;
    onConfirm({
      lat: pin.lat,
      lng: pin.lng,
      label: geo.city || geo.district || geo.state || "Custom area",
      displayName: geo.displayName,
      ...geo,
    });
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="map-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="map-modal">
        {/* Header */}
        <div className="map-modal__header">
          <div>
            <div className="map-modal__title">Select Service Area</div>
            <div className="map-modal__subtitle">Click anywhere on the map to pin your preferred area</div>
          </div>
          <button type="button" className="map-modal__close" onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* Map */}
        <div className="map-modal__map-wrap">
          <div className="map-modal__hint">📍 Click on the map to place a pin</div>
          <MapContainer
            center={center || [20.5937, 78.9629]}
            zoom={center ? 12 : 5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onPick={handlePick} />
            {pin && <Marker position={pin} />}
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="map-modal__footer">
          {pin ? (
            <div className="map-modal__selected">
              <div className="map-modal__pin-icon"><IconPin /></div>
              <div>
                {loading ? (
                  <div className="map-modal__place" style={{ color: "var(--color-subtle)" }}>Fetching location…</div>
                ) : geo ? (
                  <>
                    <div className="map-modal__place">
                      {geo.city || geo.district || "Selected Location"}
                    </div>
                    <div className="map-modal__place-sub">
                      {[geo.district, geo.state, geo.country].filter(Boolean).join(", ")}
                    </div>
                    <div className="map-modal__coords">
                      {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "var(--color-subtle)", fontFamily: "var(--font-sans)", marginBottom: 14 }}>
              No location selected yet. Tap the map to place a pin.
            </p>
          )}

          <div className="map-modal__actions">
            <button type="button" className="map-modal__cancel" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="map-modal__confirm"
              disabled={!pin || loading}
              onClick={handleConfirm}
            >
              Confirm Service Area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
