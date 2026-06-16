import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Phone,
    CheckCircle,
    Circle,
    Wrench,
    AlertTriangle,
    Loader2,
    Navigation,
    ExternalLink,
    ChevronRight,
    Flag,
    User,
    IndianRupee,
    Clock,
    Tag,
} from 'lucide-react';
import WorkerNavBar from '../../layouts/Worker/WorkerNavBar';
import WorkerHeader from '../../layouts/Worker/WorkerHeader';
import { useGetWorkerActiveJobQuery, useUpdateJobProgressMutation } from '../../store/services/api';
import { showSuccess, showError } from '../../utils/toast';

// ── Checklist steps ──────────────────────────────────────────────────────────
const CHECKLIST = [
    { key: 'arrived', label: 'Arrived at location', stepIndex: 1 },
    { key: 'discussed', label: 'Discussed job with poster', stepIndex: 2 },
    { key: 'started', label: 'Started work', stepIndex: 3 },
    { key: 'completed', label: 'Job completed', stepIndex: 4 },
    { key: 'payment', label: 'Payment received', stepIndex: 5 },
];

const UPDATE_ORDER = ['not_started', 'arrived', 'discussed', 'started', 'completed', 'payment'];

function doneCount(update) {
    const idx = UPDATE_ORDER.indexOf(update);
    return Math.max(0, idx);
}

function PageLoader() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            <div className="relative w-20 h-20">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0A6E5C] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Wrench size={22} className="text-[#0A6E5C]" />
                </div>
            </div>
            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Loading Active Job</p>
                <p className="text-sm text-gray-400">Fetching your task details…</p>
            </div>
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
            </div>
        </div>
    );
}

function PageError({ onBack }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
            </div>
            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Failed to Load</p>
                <p className="text-sm text-gray-400 max-w-xs">
                    We couldn't fetch your active job. Please check your connection and try again.
                </p>
            </div>
            <button onClick={onBack}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white
                           text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]">
                <ArrowLeft size={15} />
                Back to My Bids
            </button>
        </div>
    );
}

function CompleteModal({ onConfirm, onClose, isLoading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                <div className="h-1 w-full bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />
                <div className="p-7 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-5">
                        <Flag size={28} className="text-[#0A6E5C]" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">Mark as Complete?</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                        This will notify the poster that the job is done and trigger the payment release process.
                    </p>
                    <button onClick={onConfirm} disabled={isLoading}
                        className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                   hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150
                                   shadow-sm mb-3 flex items-center justify-center gap-2 disabled:opacity-60">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
                        {isLoading ? 'Completing…' : 'Yes, Mark Complete'}
                    </button>
                    <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1">
                        Not yet
                    </button>
                </div>
            </div>
        </div>
    );
}

const ActiveJob = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [revealPhone, setRevealPhone] = useState(false);

    const { data, isLoading, isError } = useGetWorkerActiveJobQuery(taskId);
    const [updateProgress, { isLoading: isUpdating }] = useUpdateJobProgressMutation();

    const mainData = data?.data;
    const { bid, poster } = mainData ?? {};
    const update = mainData?.update ?? 'not_started';
    const done = doneCount(update);
    const pct = Math.round((done / 5) * 100);

    const nextStep = UPDATE_ORDER[done + 1]; // next step to mark

    const handleStepUpdate = async (step) => {
        try {
            const res = await updateProgress({ taskId, update: step }).unwrap();
            showSuccess(res?.message || 'Progress updated!');
        } catch (err) {
            showError(err?.data?.message || 'Failed to update. Try again.');
        }
    };

    const handleComplete = async () => {
        await handleStepUpdate('completed');
        setShowCompleteModal(false);
    };

    const googleMapsUrl = mainData?.address?.landmark
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mainData.address.landmark)}`
        : mainData?.location?.coordinates
            ? `https://www.google.com/maps?q=${mainData.location.coordinates[1]},${mainData.location.coordinates[0]}`
            : '#';

    return (
        <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
            <WorkerNavBar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <WorkerHeader />

                {isLoading && <PageLoader />}
                {isError && <PageError onBack={() => navigate('/worker/my-bids', { replace: true })} />}

                {!isLoading && !isError && mainData && (
                    <div className="flex-1 overflow-y-auto">

                        <div className="sticky top-0 z-10 bg-[#F6FAF8]/95 backdrop-blur-sm border-b border-gray-200
                                        px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                            <button onClick={() => navigate('/worker/my-bids', { replace: true })}
                                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium">
                                <ArrowLeft size={16} />
                                <span className="hidden sm:inline">Back to My Bids</span>
                                <span className="sm:hidden">Back</span>
                            </button>

                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                             bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                ACTIVE JOB
                            </span>
                        </div>

                        <div className="p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4">

                            <div>
                                <p className="text-xs font-bold text-[#0A6E5C] uppercase tracking-widest mb-1">
                                    Task Overview
                                </p>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                                    {mainData.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    {mainData.category && (
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <Tag size={12} />
                                            {mainData.category}
                                        </span>
                                    )}
                                    {mainData.address?.city && (
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <MapPin size={12} />
                                            {mainData.address.city}
                                        </span>
                                    )}
                                    {bid?.eta && (
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock size={12} />
                                            ETA: {bid.eta}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                                <div className="lg:col-span-2 space-y-4">

                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="h-1 bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />
                                        <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    {poster?.selfie
                                                        ? <img src={poster.selfie} alt={poster.name} className="w-full h-full object-cover" />
                                                        : <span className="text-xl font-extrabold text-[#0A6E5C]">{poster?.name?.charAt(0)}</span>
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Poster</p>
                                                    <p className="font-bold text-gray-900">{poster?.name || '—'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agreed Amount</p>
                                                <p className="text-3xl font-extrabold text-[#0A6E5C] flex items-center gap-0.5">
                                                    <IndianRupee size={20} strokeWidth={3} />
                                                    {bid?.amount ?? mainData.amount}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-extrabold text-gray-900">Job Checklist</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Track your progress and update the poster</p>
                                            </div>
                                            <span className="text-2xl font-extrabold text-[#0A6E5C]">{pct}%</span>
                                        </div>

                                        <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
                                            <div className="h-full bg-[#0A6E5C] rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%` }} />
                                        </div>

                                        <ul className="space-y-2.5">
                                            {CHECKLIST.map((item) => {
                                                const itemDone = item.stepIndex <= done;
                                                const isNext = UPDATE_ORDER[done + 1] === item.key;

                                                return (
                                                    <li key={item.key}
                                                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all
                                                            ${itemDone
                                                                ? 'bg-emerald-50 border-emerald-200'
                                                                : isNext
                                                                    ? 'bg-white border-gray-300 shadow-sm'
                                                                    : 'bg-gray-50 border-gray-100'
                                                            }`}>
                                                        <div className="flex items-center gap-3">
                                                            {itemDone
                                                                ? <CheckCircle size={18} className="text-[#0A6E5C] shrink-0" />
                                                                : <Circle size={18} className="text-gray-300 shrink-0" />
                                                            }
                                                            <span className={`text-sm font-medium ${itemDone ? 'text-[#0A6E5C]' : 'text-gray-500'}`}>
                                                                {item.label}
                                                            </span>
                                                        </div>

                                                        {itemDone && (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0A6E5C]">
                                                                DONE
                                                            </span>
                                                        )}
                                                        {isNext && !itemDone && (
                                                            <button
                                                                onClick={() => item.key === 'completed'
                                                                    ? setShowCompleteModal(true)
                                                                    : handleStepUpdate(item.key)
                                                                }
                                                                disabled={isUpdating}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A6E5C] text-white
                                                                           text-xs font-bold hover:bg-[#085e4e] transition-all active:scale-[0.97]
                                                                           disabled:opacity-60 shrink-0">
                                                                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                                                                Mark Done
                                                            </button>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    {update === 'completed' || update === 'payment' ? (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 flex items-center gap-4">
                                            <CheckCircle size={24} className="text-[#0A6E5C] shrink-0" />
                                            <div>
                                                <p className="font-bold text-[#0A6E5C]">Job Marked Complete!</p>
                                                <p className="text-sm text-emerald-700 mt-0.5">
                                                    The poster has been notified. Await payment release.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-5
                                                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <h2 className="text-base font-extrabold text-gray-900 mb-1">Task Finalization</h2>
                                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                                    Ready to finish? This will notify the poster to release payment and provide a review.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowCompleteModal(true)}
                                                className="flex items-center gap-2 px-6 py-3 rounded-2xl
                                                           bg-gradient-to-r from-[#0A6E5C] to-emerald-500 text-white
                                                           text-sm font-bold shadow-md hover:from-[#085e4e] hover:to-emerald-600
                                                           active:scale-[0.98] transition-all duration-150 shrink-0">
                                                <Flag size={16} />
                                                Mark Job as Complete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">

                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                        <div className="h-1 bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Navigation size={16} className="text-[#0A6E5C]" />
                                                <p className="font-extrabold text-gray-900">Get Directions</p>
                                            </div>

                                            <div className="w-full h-36 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 overflow-hidden">
                                                <div className="text-center">
                                                    <MapPin size={28} className="text-[#0A6E5C] mx-auto mb-1" />
                                                    <p className="text-xs text-emerald-700 font-medium">
                                                        {mainData.address?.area || mainData.address?.city}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Site Address</p>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {mainData.address?.houseNumber && `${mainData.address.houseNumber}, `}
                                                    {mainData.address?.area && `${mainData.address.area}, `}
                                                    {mainData.address?.city}
                                                    {mainData.address?.district && `, ${mainData.address.district}`}
                                                </p>
                                            </div>

                                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                                                           border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                                                           hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all">
                                                <ExternalLink size={14} />
                                                Open in Google Maps
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <User size={16} className="text-[#0A6E5C]" />
                                            <p className="font-extrabold text-gray-900">Contact Poster</p>
                                        </div>

                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="text-xl font-extrabold text-gray-900 mb-4 tracking-wider">
                                            {revealPhone
                                                ? `+91 ${poster?.phone}`
                                                : '+91 XXXXXXXXXX'
                                            }
                                        </p>

                                        {revealPhone ? (
                                            <a href={`tel:+91${poster?.phone}`}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                                                           bg-[#0A6E5C] text-white rounded-xl text-sm font-bold
                                                           hover:bg-[#085e4e] transition-all">
                                                <Phone size={14} />
                                                Call Now
                                            </a>
                                        ) : (
                                            <button onClick={() => setRevealPhone(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                                                           border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                                                           hover:border-[#0A6E5C] hover:text-[#0A6E5C] hover:bg-emerald-50 transition-all">
                                                <Phone size={14} />
                                                Reveal Number
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCompleteModal && (
                <CompleteModal
                    onConfirm={handleComplete}
                    onClose={() => setShowCompleteModal(false)}
                    isLoading={isUpdating}
                />
            )}
        </div>
    );
};

export default ActiveJob;
