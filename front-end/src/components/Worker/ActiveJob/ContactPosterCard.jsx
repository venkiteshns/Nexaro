import { User, Phone } from 'lucide-react';

export default function ContactPosterCard({ phone, revealPhone, onReveal }) {
    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 mb-2.5">
                <User size={14} className="text-[#0A6E5C]" />
                <p className="font-bold text-xs sm:text-sm text-gray-900">Contact Poster</p>
            </div>

            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
            <p className="text-base sm:text-lg font-extrabold text-gray-900 mb-3 tracking-wider">
                {revealPhone ? `+91 ${phone}` : '+91 XXXXXXXXXX'}
            </p>

            {revealPhone ? (
                <a
                    href={`tel:+91${phone}`}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5
                               bg-[#0A6E5C] text-white rounded-lg text-xs font-bold
                               hover:bg-[#085e4e] transition-all cursor-pointer shadow-2xs"
                >
                    <Phone size={13} />
                    Call Now
                </a>
            ) : (
                <button
                    onClick={onReveal}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5
                               border border-gray-200 rounded-lg text-xs font-semibold text-gray-700
                               hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all cursor-pointer"
                >
                    <Phone size={13} />
                    Reveal Number
                </button>
            )}
        </div>
    );
}
