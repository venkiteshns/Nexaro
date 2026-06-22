import React from 'react';
import { Star, Phone, Mail, BadgeCheck, IndianRupee } from 'lucide-react';

const WorkerAssignedCard = ({ worker, bid }) => {
    if (!worker) return null;

    const initial = worker.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <p className="font-extrabold text-gray-900 text-base mb-4">Assigned Worker</p>

            {/* Profile */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                    {worker.selfie ? (
                        <img src={worker.selfie} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-extrabold text-[#0A6E5C]">{initial}</span>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900 text-sm">{worker.name}</p>
                        {worker.isVerified && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold">
                                <BadgeCheck size={9} />
                                VERIFIED
                            </span>
                        )}
                    </div>
                    {/* Rating */}
                    {worker.rating != null && (
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star size={12} fill="#FBBF24" color="#FBBF24" />
                            <span className="text-xs font-semibold text-gray-700">{worker.rating}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact */}
            <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Phone size={13} className="text-gray-400" />
                    </div>
                    <span>{worker.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Mail size={13} className="text-gray-400" />
                    </div>
                    <span className="break-all">{worker.email || '—'}</span>
                </div>
            </div>

            {/* Accepted bid */}
            {bid && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Accepted Bid</p>
                    <div className="flex items-center gap-1.5 mb-1">
                        <IndianRupee size={15} className="text-[#0A6E5C]" />
                        <span className="text-lg font-extrabold text-[#0A6E5C]">
                            {Number(bid.amount || 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                    {bid.eta && (
                        <p className="text-xs text-gray-500">
                            ETA: <span className="font-semibold text-gray-700">{bid.eta}</span>
                        </p>
                    )}
                    {bid.pitch && (
                        <p className="text-xs text-gray-500 mt-1 italic">"{bid.pitch}"</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkerAssignedCard;
