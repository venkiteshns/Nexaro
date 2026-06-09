import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getCoords } from '../../services/getCooords'

const MapClickHandler = ({ setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            })
        }
    })
    return null;
}

const getUserLocation = async (setPosition) => {
    const cord = await getCoords()
    setPosition({
        lat: cord.lat,
        lng: cord.lng
    })
}

const FlyToLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng]);
        }
    }, [position]);
    return null;
}

const Map = ({ position: externalPosition, setPosition: externalSetPosition, height = "500px", showButton = true }) => {
    // handleMapPositionChange
    const [internalPosition, setInternalPosition] = useState({
        lat: 10.5276,
        lng: 76.2144
    });

    const position = externalPosition ?? internalPosition;
    const setPosition = externalSetPosition ?? setInternalPosition;

    return (
        <div>
            {showButton && (
                <button
                    type="button"
                    className='cursor-pointer mb-3 p-2 border-2 border-green-500 bg-white text-green-500 hover:bg-green-500 hover:text-white rounded-md transition-colors duration-300'
                    onClick={() => getUserLocation(setPosition)}
                >
                    Get Current Location
                </button>
            )}
            <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height, width: "100%" }}>
                <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <FlyToLocation position={position} />
                <MapClickHandler setPosition={setPosition} />
                {position && <Marker
                    icon={L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                        shadowAnchor: [12, 41],
                    })}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target;
                            const latlng = marker.getLatLng();
                            setPosition({
                                lat: latlng.lat,
                                lng: latlng.lng,
                            })
                        }
                    }}
                    position={[position.lat, position.lng]}>
                    <Popup>{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</Popup>
                </Marker>}
            </MapContainer>
        </div>
    )
}

export default Map