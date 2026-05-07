import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { getCurrentPosition } from "../../../services/geolocationService.js";
import { reverseGeocode } from "../../../services/reverseGeocodeService.js";
import SectionCard from "../SectionCard/SectionCard.jsx";
import ServiceAreaMap from "../ServiceAreaMap/ServiceAreaMap.jsx";

const IconLocation = () => (
  <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);

const IconGps = () => (
  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" strokeDasharray="2 2"/>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconMap = () => (
  <svg width="16" height="16" fill="none" stroke="var(--color-muted)" strokeWidth="1.5" viewBox="0 0 24 24">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

const IconX = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* Detects if page is on a non-localhost HTTP origin (network IP) */
function isInsecureNetworkOrigin() {
  return (
    window.location.protocol === "http:" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname)
  );
}

/* Location fields — shared between auto-fill (granted) and manual (denied) */
function LocationFields({ register, banner }) {
  return (
    <div className="ws-loc-fields">
      {banner}
      <div className="ws-grid-2">
        {[
          { name: "country",  label: "Country" },
          { name: "state",    label: "State" },
          { name: "district", label: "District" },
          { name: "city",     label: "City / Place" },
        ].map(({ name, label }) => (
          <div key={name} className="ws-field">
            <label className="ws-label">{label}</label>
            <input className="ws-input" placeholder={`Enter ${label.toLowerCase()}`} {...register(name)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceLocationSection() {
  const { register, setValue } = useFormContext();
  // idle | loading | granted | denied | manual
  const [geoState, setGeoState]     = useState("idle");
  const [coords, setCoords]         = useState(null);
  const [showMap, setShowMap]       = useState(false);
  const [serviceAreas, setServiceAreas] = useState([]);

  async function requestLocation() {
    /* On insecure network origins, geolocation will always be blocked.
       Skip straight to manual entry with a helpful note. */
    if (isInsecureNetworkOrigin()) {
      setGeoState("manual");
      return;
    }

    setGeoState("loading");
    try {
      const pos = await getCurrentPosition();
      setCoords(pos);
      const addr = await reverseGeocode(pos);
      setValue("country",  addr.country,  { shouldValidate: true });
      setValue("state",    addr.state,    { shouldValidate: true });
      setValue("district", addr.district, { shouldValidate: true });
      setValue("city",     addr.city,     { shouldValidate: true });
      setGeoState("granted");
    } catch {
      /* Permission denied or unavailable — fall back to manual */
      setGeoState("denied");
    }
  }

  function addServiceArea(area) {
    setServiceAreas(prev => {
      if (prev.find(a => a.label === area.label && a.lat === area.lat)) return prev;
      return [...prev, area];
    });
    setShowMap(false);
  }

  function removeArea(idx) {
    setServiceAreas(prev => prev.filter((_, i) => i !== idx));
  }

  /* Banner shown when GPS succeeds */
  const SuccessBanner = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
      padding: "10px 14px", background: "var(--color-accent2)",
      borderRadius: 10, border: "1px solid #A7F3D0" }}>
      <svg width="16" height="16" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7"/>
      </svg>
      <span style={{ fontSize: 13, color: "var(--color-accent)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
        Location detected — fields auto-filled. You may edit them.
      </span>
    </div>
  );

  /* Banner shown for manual entry (denied / insecure origin) */
  const ManualBanner = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20,
      padding: "10px 14px", background: "#FFF7ED",
      borderRadius: 10, border: "1px solid #FCD34D" }}>
      <span style={{ fontSize: 14, marginTop: 1 }}>✏️</span>
      <span style={{ fontSize: 13, color: "#92400E", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
        Location access isn't available here — please enter your location manually.
      </span>
    </div>
  );

  return (
    <>
      <SectionCard icon={<IconLocation />} title="Service Location">

        {/* ── Idle: permission card ── */}
        {geoState === "idle" && (
          <div className="ws-loc-card">
            <div className="ws-loc-icon">
              <svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div className="ws-loc-card__title">Enable Location Access</div>
            <div className="ws-loc-card__sub">
              Allow Nexaro to detect your location for precise hyperlocal matching.<br />
              Your coordinates are never shared publicly.
            </div>
            <button type="button" className="ws-loc-btn" onClick={requestLocation}>
              <IconGps />
              Allow Location Access
            </button>
            {/* Manual fallback link */}
            <p style={{ marginTop: 14, fontSize: 12, color: "var(--color-subtle)", fontFamily: "var(--font-sans)" }}>
              Can't share location?{" "}
              <button
                type="button"
                onClick={() => setGeoState("manual")}
                style={{ background: "none", border: "none", color: "var(--color-accent)",
                  fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                Enter manually
              </button>
            </p>
          </div>
        )}

        {/* ── Loading ── */}
        {geoState === "loading" && (
          <div className="ws-loc-card" style={{ opacity: 0.75 }}>
            <div className="ws-loc-icon">
              <svg width="26" height="26" fill="none" stroke="#0A6E5C" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeDasharray="4 2"/>
              </svg>
            </div>
            <div className="ws-loc-card__title">Detecting your location…</div>
            <div className="ws-loc-card__sub">Please allow the browser permission popup.</div>
          </div>
        )}

        {/* ── Denied: show manual fields + retry ── */}
        {geoState === "denied" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🚫</span>
                <span style={{ fontSize: 13, color: "#DC2626", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                  Location access was denied.
                </span>
              </div>
              <button
                type="button"
                onClick={requestLocation}
                style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: 8,
                  padding: "5px 12px", fontSize: 12, fontFamily: "var(--font-sans)",
                  color: "var(--color-body)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
              >
                <IconGps />
                Retry
              </button>
            </div>
            <LocationFields register={register} banner={ManualBanner} />
          </>
        )}

        {/* ── Manual entry (insecure origin or user chose manual) ── */}
        {geoState === "manual" && (
          <LocationFields register={register} banner={ManualBanner} />
        )}

        {/* ── GPS success: auto-filled fields ── */}
        {geoState === "granted" && (
          <LocationFields register={register} banner={SuccessBanner} />
        )}

        {/* ── Service area picker (visible once location is known) ── */}
        {(geoState === "granted" || geoState === "denied" || geoState === "manual") && (
          <div style={{ marginTop: 24 }}>
            <label className="ws-label" style={{ marginBottom: 10, display: "block" }}>
              Preferred Service Areas
            </label>
            <button type="button" className="ws-map-trigger" onClick={() => setShowMap(true)}>
              <IconMap />
              Click to select service area on map
            </button>
            {serviceAreas.length > 0 && (
              <div className="ws-area-chips">
                {serviceAreas.map((area, i) => (
                  <span key={i} className="ws-area-chip">
                    📍 {area.label}
                    <button type="button" className="ws-area-chip__remove" onClick={() => removeArea(i)}>
                      <IconX />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

      </SectionCard>

      {/* Map Modal */}
      {showMap && (
        <ServiceAreaMap
          center={coords}
          onConfirm={addServiceArea}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
}
