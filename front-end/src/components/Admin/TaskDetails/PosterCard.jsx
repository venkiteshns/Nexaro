import { Mail, Phone } from 'lucide-react';

const PosterCard = ({ poster }) => {
    if (!poster) return null;

    const initial = poster.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xs p-3.5 sm:p-5">
            <p className="font-extrabold text-gray-900 text-sm sm:text-base mb-2.5 sm:mb-4">Poster Details</p>

            <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                    {poster.selfie ? (
                        <img src={poster.selfie} alt={poster.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg sm:text-xl font-extrabold text-[#0A6E5C]">{initial}</span>
                    )}
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{poster.name}</p>
                    <p className="text-[11px] sm:text-xs text-gray-400">Poster</p>
                </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                    </div>
                    <span className="break-all">{poster.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                    </div>
                    <span>{poster.phone || '—'}</span>
                </div>
            </div>
        </div>
    );
};

export default PosterCard;
