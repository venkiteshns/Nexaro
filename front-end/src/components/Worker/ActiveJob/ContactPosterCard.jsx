import { User, Phone } from 'lucide-react';

export default function ContactPosterCard({ phone, revealPhone, onReveal }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-[#0A6E5C]" />
                <p className="font-extrabold text-gray-900">Contact Poster</p>
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
            <p className="text-xl font-extrabold text-gray-900 mb-4 tracking-wider">
                {revealPhone ? `+91 ${phone}` : '+91 XXXXXXXXXX'}
            </p>

            {revealPhone ? (
                <a
                    href={`tel:+91${phone}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                               bg-[#0A6E5C] text-white rounded-xl text-sm font-bold
                               hover:bg-[#085e4e] transition-all"
                >
                    <Phone size={14} />
                    Call Now
                </a>
            ) : (
                <button
                    onClick={onReveal}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                               border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                               hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all cursor-pointer"
                >
                    <Phone size={14} />
                    Reveal Number
                </button>
            )}
        </div>
    );
}
