import { ArrowRight, Star } from "lucide-react";

export default function SuccessState({ bid, countdown, taskId, navigate }) {

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-6">

            <div className="text-center">
                <p className="text-lg font-extrabold text-gray-900">Bid Accepted!</p>
                <p className="text-sm text-gray-500 mt-1">
                    Redirecting to Work Progress in{' '}
                    <span className="font-bold text-[#0A6E5C]">{countdown}s</span>
                </p>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm w-full max-w-sm overflow-hidden">
                <div className="h-1 bg-linear-to-r from-[#0A6E5C] to-emerald-400" />
                <div className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {bid?.worker?.selfie ? (
                            <img src={bid.worker.selfie} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-extrabold text-[#0A6E5C]">
                                {bid?.worker?.name?.charAt(0)}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{bid?.worker?.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star size={11} fill="#FBBF24" color="#FBBF24" />
                            <span className="text-xs font-semibold text-gray-700">{bid?.worker?.rating}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                            ETA · <span className="font-semibold text-gray-600">{bid?.eta ?? '—'}</span>
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Agreed Bid</p>
                        <p className="text-xl font-extrabold text-gray-900">₹{bid?.amount}</p>
                    </div>
                </div>

                {bid?.pitch && (
                    <p className="mx-5 mb-4 px-3 py-2 text-xs text-gray-500 italic bg-emerald-50 border-l-2 border-[#0A6E5C]/40 rounded-r-lg leading-relaxed">
                        “{bid.pitch}”
                    </p>
                )}
            </div>

            {/* Manual redirect */}
            <button
                onClick={() => navigate(`/poster/work-progress/${taskId}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
            >
                Go to Work Progress
                <ArrowRight size={15} />
            </button>
        </div>
    );
}