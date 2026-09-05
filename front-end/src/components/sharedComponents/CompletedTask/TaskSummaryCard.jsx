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

/* ── Stat pill inside the summary card ── */
function StatPill({ label, value, subValue, valueClass = 'text-gray-900' }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className={`text-base sm:text-lg font-black ${valueClass}`}>{value}</p>
            {subValue && (
                <p className="text-[11px] text-gray-400 font-medium">{subValue}</p>
            )}
        </div>
    );
}

const TaskSummaryCard = ({ task, worker, poster }) => {
    const [revealPhone, setRevealPhone] = useState(false);

    const budgetNum = Number(task?.budget) || 0;
    const finalPaymentNum = Number(task?.finalPayment) || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            {/* ── Left / Main details ── */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-sm p-5 sm:p-6 space-y-4">
                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-6 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <Wrench size={18} className="text-[#0A6E5C]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                            <p className="text-sm font-bold text-gray-900">{task?.category || "General"}</p>
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
                                <Star size={16} fill="#FBBF24" color="#FBBF24" />
                                <span className="text-base sm:text-lg font-black text-gray-900">
                                    {Number(task.ratingGiven).toFixed(1)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {task?.description && (
                    <div className="space-y-1 pt-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/60 rounded-2xl p-4 border border-gray-100">
                            {task.description}
                        </p>
                    </div>
                )}

                {/* Location / Address */}
                {task?.address && (
                    <div className="space-y-1 pt-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50/60 rounded-2xl p-3.5 border border-gray-100">
                            <MapPin size={16} className="text-[#0A6E5C] shrink-0 mt-0.5" />
                            <span>{task.address}</span>
                        </div>
                    </div>
                )}

                {/* Photos if any using PhotoStrip */}
                {task?.photos && task.photos.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon size={14} className="text-[#0A6E5C]" />
                            Attached Photos ({task.photos.length})
                        </p>
                        <PhotoStrip photos={task.photos} />
                    </div>
                )}

                {/* Completed on */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <CalendarCheck size={15} className="text-[#0A6E5C]" />
                    <span>
                        Completed on:{' '}
                        <strong className="font-bold text-gray-800">{task?.completedOn || '—'}</strong>
                    </span>
                </div>
            </div>

            {/* ── Right / Profile Card (Worker OR Poster) ── */}
            {worker && (
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col items-center text-center justify-between gap-4">
                    <div className="flex flex-col items-center w-full">
                        {/* Avatar */}
                        <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center mb-3 shadow-inner">
                            {worker.avatar ? (
                                <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-[#0A6E5C]">
                                    {worker.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Name + verified */}
                        <div>
                            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                <p className="font-extrabold text-gray-900 text-base">{worker.name}</p>
                                {worker.isVerified && (
                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-[9px] font-bold">
                                        <BadgeCheck size={11} />
                                        VERIFIED
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Worker Profile</p>
                        </div>

                        {/* Rating stat */}
                        {worker.rating != null && (
                            <div className="flex items-center justify-center gap-4 w-full border-t border-gray-100 pt-3 mt-3">
                                <div>
                                    <p className="text-xl font-black text-gray-900">{Number(worker.rating).toFixed(1)}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Worker Rating</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full bg-emerald-50/60 rounded-2xl p-2.5 border border-emerald-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#0A6E5C]">
                        <ShieldCheck size={15} />
                        Assigned Professional
                    </div>
                </div>
            )}

            {poster && (
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col items-center text-center justify-between gap-4">
                    <div className="flex flex-col items-center w-full">
                        {/* Avatar */}
                        <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center mb-3 shadow-inner">
                            {poster.avatar ? (
                                <img src={poster.avatar} alt={poster.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-[#0A6E5C]">
                                    {poster.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Name + role */}
                        <div>
                            <p className="font-extrabold text-gray-900 text-base">{poster.name}</p>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold mt-1">
                                <User size={11} /> Task Poster
                            </span>
                        </div>

                        {/* Contacts */}
                        <div className="w-full border-t border-gray-100 my-3 pt-3 space-y-2 text-left text-xs text-gray-600">

                            {poster.phone && (
                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                    <div className="flex items-center gap-2 truncate">
                                        <Phone size={14} className="text-gray-400 shrink-0" />
                                        <span className="font-medium">
                                            {revealPhone
                                                ? poster.phone
                                                : `${String(poster.phone).slice(0, 3)}••••••${String(poster.phone).slice(-2)}`}
                                        </span>
                                    </div>
                                    {!revealPhone ? (
                                        <button
                                            onClick={() => setRevealPhone(true)}
                                            className="text-[11px] font-bold text-[#0A6E5C] hover:underline"
                                        >
                                            Reveal
                                        </button>
                                    ) : (
                                        <a
                                            href={`tel:${poster.phone}`}
                                            className="text-[11px] font-bold text-[#0A6E5C] hover:underline"
                                        >
                                            Call
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full bg-emerald-50/60 rounded-2xl p-2.5 border border-emerald-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#0A6E5C]">
                        <ShieldCheck size={15} />
                        Verified Poster
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskSummaryCard;
