import { AlertTriangle, MapPin, Wrench } from "lucide-react";

export default function NoActiveJob({ onNavigate }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
            {/* Illustration */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    <Wrench size={36} className="text-emerald-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-orange-400" />
                </div>
            </div>

            <div className="max-w-xs">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">No Active Jobs</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    You don&apos;t have any active jobs right now. Browse nearby tasks and place a bid to get started!
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0A6E5C] text-white
                               text-sm font-bold hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-md"
                >
                    <MapPin size={15} />
                    Browse Nearby Tasks
                </button>
            </div>

            {/* Tips card */}
            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-sm text-left">
                <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-wider mb-3">How it works</p>
                <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0A6E5C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        Browse tasks near your location
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0A6E5C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        Place a competitive bid
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0A6E5C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        Once accepted, your active job appears here
                    </li>
                </ol>
            </div>
        </div>
    );
}