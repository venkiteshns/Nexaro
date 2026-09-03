import { Navigation, ExternalLink } from 'lucide-react';

export default function DirectionsCard({ address, location }) {
    const googleMapsUrl = address?.landmark
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.landmark)}`
        : location?.coordinates
            ? `https://www.google.com/maps?q=${location.coordinates[1]},${location.coordinates[0]}`
            : '#';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1 bg-linear-to-r from-[#0A6E5C] to-emerald-400" />
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Navigation size={16} className="text-[#0A6E5C]" />
                    <p className="font-extrabold text-gray-900">Get Directions</p>
                </div>

                <div
                    style={{ backgroundImage: `url(${import.meta.env.VITE_MAP_IMG})` }}
                    className="relative w-full h-36 rounded-xl bg-center bg-cover bg-emerald-50 border border-emerald-100 mb-4 overflow-hidden"
                >
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/50 to-transparent px-3 pt-6 pb-2.5">
                        <p className="text-xs font-medium text-white text-center leading-snug line-clamp-2">
                            {address?.landmark}
                        </p>
                    </div>
                </div>

                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                               border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                               hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all"
                >
                    <ExternalLink size={14} />
                    Open in Google Maps
                </a>
            </div>
        </div>
    );
}
