import { AlertTriangle, MapPin, Wrench } from "lucide-react";

export default function NoActiveJob({ onNavigate }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                    <Wrench size={26} className="text-emerald-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center">
                    <AlertTriangle size={13} className="text-orange-400" />
                </div>
            </div>

            <div className="max-w-xs">
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1">No Active Jobs</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                    You don&apos;t have any active jobs right now. Browse nearby tasks and place a bid to get started!
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
                <button
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A6E5C] text-white
                               text-xs font-bold hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-xs"
                >
                    <MapPin size={13} />
                    Browse Nearby Tasks
                </button>
            </div>

            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 max-w-sm text-left">
                <p className="text-[10px] font-bold text-[#0A6E5C] uppercase tracking-wider mb-2">How it works</p>
                <ol className="space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#0A6E5C] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        Browse tasks near your location
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#0A6E5C] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        Place a competitive bid
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#0A6E5C] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        Once accepted, your active job appears here
                    </li>
                </ol>
            </div>
        </div>
    );
}