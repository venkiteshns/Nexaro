import { useState } from 'react';
import {
    Wrench,
    Star,
    CalendarCheck,
    BadgeCheck,
    MapPin,
    Phone,
    User,
    ShieldCheck,
    Image as ImageIcon
} from 'lucide-react';
import { PhotoStrip } from '../PhotoStrip';
import { formatInrToUsd } from '../../../utils/currency';

function StatPill({ label, value, subValue, valueClass = 'text-gray-900' }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className={`text-sm sm:text-base font-extrabold ${valueClass}`}>{value}</p>
            {subValue && (
                <p className="text-[10px] text-gray-400 font-medium">{subValue}</p>
            )}
        </div>
    );
}

const TaskSummaryCard = ({ task, worker, poster }) => {
    const [revealPhone, setRevealPhone] = useState(false);

    const budgetNum = Number(task?.budget) || 0;
    const finalPaymentNum = Number(task?.finalPayment) || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3.5 mb-3">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <Wrench size={15} className="text-[#0A6E5C]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                            <p className="text-xs sm:text-sm font-bold text-gray-900">{task?.category || "General"}</p>
                        </div>
                    </div>

                    <StatPill
                        label="Initial Budget"
                        value={`₹${budgetNum.toLocaleString('en-IN')}`}
                        subValue={formatInrToUsd(budgetNum)}
                    />
                    <StatPill
                        label="Accepted Bid"
                        value={`₹${finalPaymentNum.toLocaleString('en-IN')}`}
                        subValue={formatInrToUsd(finalPaymentNum)}
                        valueClass="text-[#0A6E5C]"
                    />

                    {task?.ratingGiven != null && (
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                            <div className="flex items-center gap-1">
                                <Star size={14} fill="#FBBF24" color="#FBBF24" />
                                <span className="text-sm sm:text-base font-extrabold text-gray-900">
                                    {Number(task.ratingGiven).toFixed(1)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {task?.description && (
                    <div className="space-y-1 pt-0.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</p>
                        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/60 rounded-lg p-3 border border-gray-100">
                            {task.description}
                        </p>
                    </div>
                )}

                {task?.address && (
                    <div className="space-y-1 pt-0.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                        <div className="flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50/60 rounded-lg p-2.5 border border-gray-100">
                            <MapPin size={14} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <span>{task.address}</span>
                        </div>
                    </div>
                )}

                {task?.photos && task.photos.length > 0 && (
                    <div className="space-y-1 pt-0.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon size={13} className="text-[#0A6E5C]" />
                            Attached Photos ({task.photos.length})
                        </p>
                        <PhotoStrip photos={task.photos} />
                    </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <CalendarCheck size={13} className="text-[#0A6E5C]" />
                    <span>
                        Completed on:{' '}
                        <strong className="font-bold text-gray-800">{task?.completedOn || '—'}</strong>
                    </span>
                </div>
            </div>

            {worker && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col items-center text-center justify-between gap-3">
                    <div className="flex flex-col items-center w-full">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center mb-2 shadow-inner">
                            {worker.avatar ? (
                                <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg font-black text-[#0A6E5C]">
                                    {worker.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                                <p className="font-bold text-gray-900 text-xs sm:text-sm">{worker.name}</p>
                                {worker.isVerified && (
                                    <span className="flex items-center gap-0.5 px-1 py-0.2 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-[8px] font-bold">
                                        <BadgeCheck size={10} />
                                        VERIFIED
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium">Worker Profile</p>
                        </div>

                        {worker.rating != null && (
                            <div className="flex items-center justify-center gap-3 w-full border-t border-gray-100 pt-2 mt-2">
                                <div>
                                    <p className="text-base font-extrabold text-gray-900">{Number(worker.rating).toFixed(1)}</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Worker Rating</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full bg-emerald-50/60 rounded-lg p-2 border border-emerald-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0A6E5C]">
                        <ShieldCheck size={13} />
                        Assigned Professional
                    </div>
                </div>
            )}

            {poster && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-3.5 sm:p-4 flex flex-col items-center text-center justify-between gap-3">
                    <div className="flex flex-col items-center w-full">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center mb-2 shadow-inner">
                            {poster.avatar ? (
                                <img src={poster.avatar} alt={poster.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg font-black text-[#0A6E5C]">
                                    {poster.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div>
                            <p className="font-bold text-gray-900 text-xs sm:text-sm">{poster.name}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] font-bold mt-0.5">
                                <User size={10} /> Task Poster
                            </span>
                        </div>

                        <div className="w-full border-t border-gray-100 my-2 pt-2 space-y-1.5 text-left text-xs text-gray-600">

                            {poster.phone && (
                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                    <div className="flex items-center gap-1.5 truncate">
                                        <Phone size={12} className="text-gray-400 shrink-0" />
                                        <span className="font-medium text-xs">
                                            {revealPhone
                                                ? poster.phone
                                                : `${String(poster.phone).slice(0, 3)}••••••${String(poster.phone).slice(-2)}`}
                                        </span>
                                    </div>
                                    {!revealPhone ? (
                                        <button
                                            onClick={() => setRevealPhone(true)}
                                            className="text-[10px] font-bold text-[#0A6E5C] hover:underline"
                                        >
                                            Reveal
                                        </button>
                                    ) : (
                                        <a
                                            href={`tel:${poster.phone}`}
                                            className="text-[10px] font-bold text-[#0A6E5C] hover:underline"
                                        >
                                            Call
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full bg-emerald-50/60 rounded-lg p-2 border border-emerald-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0A6E5C]">
                        <ShieldCheck size={13} />
                        Verified Poster
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskSummaryCard;
