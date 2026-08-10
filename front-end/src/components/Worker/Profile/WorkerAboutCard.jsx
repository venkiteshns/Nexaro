import { User, Globe } from 'lucide-react';

/**
 * WorkerAboutCard
 * Props: bio: string, languages: string[]
 */
const WorkerAboutCard = ({ bio, languages }) => {
    const bioText = bio ||
        'Dedicated professional with over 8 years of specialist experience in high-end residential plumbing and electrical systems. I specialize in identifying complex leaks and modernizing outdated heating systems. My goal is to provide lasting solutions with precision craftsmanship and minimal disruption to your home environment.';


    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <User size={13} className="text-[#0A6E5C] md:w-4 md:h-4" />
                </div>
                <h2 className="font-extrabold text-gray-900 text-sm md:text-base">About Me</h2>
            </div>

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed flex-1">{bioText}</p>

            {/* Languages */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                    <Globe size={11} className="text-[#0A6E5C] md:w-[13px] md:h-[13px]" />
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                        <span
                            key={lang}
                            className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                        >
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkerAboutCard;
