import { Star, Phone, Mail, BadgeCheck, IndianRupee } from 'lucide-react';

const WorkerAssignedCard = ({ worker, bid }) => {
    if (!worker) return null;

    const initial = worker.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xs p-3.5 sm:p-5">
            <p className="font-extrabold text-gray-900 text-sm sm:text-base mb-2.5 sm:mb-4">Assigned Worker</p>

            <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                    {worker.selfie ? (
                        <img src={worker.selfie} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg sm:text-xl font-extrabold text-[#0A6E5C]">{initial}</span>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm">{worker.name}</p>
                        {worker.isVerified && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[8px] sm:text-[9px] font-bold">
                                <BadgeCheck size={9} />
                                VERIFIED
                            </span>
                        )}
                    </div>
                    {worker.rating != null && (
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star size={11} className="sm:w-3 sm:h-3" fill="#FBBF24" color="#FBBF24" />
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-700">{worker.rating}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 sm:space-y-2.5 mb-3.5 sm:mb-5">
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                    </div>
                    <span>{worker.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                    </div>
                    <span className="break-all">{worker.email || '—'}</span>
                </div>
            </div>

            {bid && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Accepted Bid</p>
                    <div className="flex items-center gap-1 mb-1">
                        <IndianRupee size={14} className="sm:w-4 sm:h-4 text-[#0A6E5C]" />
                        <span className="text-base sm:text-lg font-extrabold text-[#0A6E5C]">
                            {Number(bid.amount || 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                    {bid.eta && (
                        <p className="text-[11px] sm:text-xs text-gray-500">
                            ETA: <span className="font-semibold text-gray-700">{bid.eta}</span>
                        </p>
                    )}
                    {bid.pitch && (
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 italic">"{bid.pitch}"</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkerAssignedCard;
