import { CheckCircle, Star } from "lucide-react";
import { formatInrToUsd } from "../../../utils/currency";

export default function BidCard({ bid, onAccept }) {
    const { worker } = bid;
    return (
        <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md border-gray-200">

            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 border bg-gray-100 border-gray-200">
                            {worker?.selfie ? (
                                <img src={worker.selfie} alt="" className='w-12 h-12 rounded-full object-cover' />
                            ) : (
                                <span className="text-sm font-bold text-gray-600">
                                    {worker?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${worker.status ? 'bg-emerald-500' : 'bg-gray-400'}`}
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-[15px]">{worker.name}</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <Star size={13} fill="#FBBF24" color="#FBBF24" />
                        <span className="text-sm font-bold text-gray-800">{worker.rating}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                        { label: 'Active Status', value: worker.status ? 'Online' : 'Offline' },
                        { label: 'ETA', value: bid.eta },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-emerald-50/60 rounded-xl px-3 py-2 text-center border border-emerald-100">
                            <p className="text-[9px] font-bold text-[#0A6E5C]/70 uppercase tracking-wide mb-0.5">{label}</p>
                            <p className="text-xs font-bold text-gray-800">{value}</p>
                        </div>
                    ))}
                </div>

                {bid.pitch && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 italic border-l-2 border-[#0A6E5C]/30 pl-3">
                        {bid.pitch}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <div className='flex flex-col '>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Bid Amount</p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-extrabold text-gray-900">
                                ₹{bid.amount}
                            </span>
                            <span className="text-sm font-semibold text-gray-500">
                                ({formatInrToUsd(bid.amount)})
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => onAccept(bid)}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-[#0A6E5C] text-white
                                       hover:bg-[#085e4e] active:scale-[0.97] transition-all flex items-center gap-1.5 shadow-sm"
                        >
                            Accept Bid
                            <CheckCircle size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
