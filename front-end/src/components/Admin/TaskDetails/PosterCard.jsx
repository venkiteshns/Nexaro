import React from 'react';
import { Mail, Phone, User } from 'lucide-react';

const PosterCard = ({ poster }) => {
    if (!poster) return null;

    const initial = poster.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <p className="font-extrabold text-gray-900 text-base mb-4">Poster Details</p>

            <div className="flex items-center gap-3 mb-5">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                    {poster.selfie ? (
                        <img src={poster.selfie} alt={poster.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-extrabold text-[#0A6E5C]">{initial}</span>
                    )}
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm">{poster.name}</p>
                    <p className="text-xs text-gray-400">Poster</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Mail size={13} className="text-gray-400" />
                    </div>
                    <span className="break-all">{poster.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Phone size={13} className="text-gray-400" />
                    </div>
                    <span>{poster.phone || '—'}</span>
                </div>
            </div>
        </div>
    );
};

export default PosterCard;
