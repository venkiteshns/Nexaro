import { User, Globe } from 'lucide-react';

const WorkerAboutCard = ({ bio, languages }) => {
    const bioText = bio || "No Bio added !";

    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-3.5 sm:p-4 h-full flex flex-col">
            <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <User size={12} className="text-[#0A6E5C]" />
                </div>
                <h2 className="font-bold text-gray-900 text-xs sm:text-sm">About Me</h2>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed flex-1">{bioText}</p>

            <div className="mt-3 pt-2.5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <Globe size={11} className="text-[#0A6E5C]" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {languages.map((lang) => (
                        <span
                            key={lang}
                            className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
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
